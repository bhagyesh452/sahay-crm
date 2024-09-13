import React, { useEffect, useState, CSSProperties, useRef } from "react";
import { useParams } from "react-router-dom";
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
import { color } from "@mui/system";
import { FcBriefcase } from "react-icons/fc";
import { IoCall } from "react-icons/io5";
import EmployeeViewAttendance from "./EmployeeView/EmloyeeViewAttendance.jsx";
import EmployeeViewPayrollView from "./EmployeeView/EmployeePayrollView.jsx";
import SalaryCalculationView from "./EmployeeView/SalaryCalculationView.jsx";


function EmployeeView() {

  const { userId } = useParams();
  const personalUserId = localStorage.getItem("hrUserId");

  const { newtoken } = useParams();
  const [data, setdata] = useState([]);
  const [myInfo, setMyInfo] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);


  const secretKey = process.env.REACT_APP_SECRET_KEY;


  const [empImg1, setEmpImg1] = useState(
    localStorage.getItem("empImg1") || "initial_image_url"
  );

  useEffect(() => {
    document.title = `HR-Sahay-CRM`;
  }, []);

  const [selectedFile, setSelectedFile] = useState(null);
  const [open, setOpen] = useState(false);
  const [editempinfo, setEditEmpInfo] = useState(false);


  const [personal_email, setPersonalEmail] = useState('');
  const [personal_number, setPersonalPhone] = useState('');
  const [personal_contact_person, setContactPerson] = useState('');
  const [personal_address, setPersonalAddress] = useState('');



  useEffect(() => {
    const savedImage = localStorage.getItem("empImg1");
    if (savedImage) {
      setEmpImg1(savedImage);
    }
  }, []);



  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.match("image/jpeg|image/png|image/jpg")) {
      setSelectedFile(file);
    } else {
      alert("Please select a valid image file (JPG, JPEG, PNG).");
    }
  };

  const handleSubmit = async () => {
    console.log("personalEmail", personal_email);
    console.log("personalPhone", personal_number);
    console.log("contactPerson", personal_contact_person);
    console.log("personalAddress", personal_address);
    try {
      const response = await axios.post(`${secretKey}/employee/post-employee-detail-byhr/${userId}`, {
        personal_email, personal_number, personal_contact_person, personal_address
      },
        {
          headers: {
            Authorization: `Bearer ${newtoken}`,
          }
        }
      );
      console.log("Response", response.data);
      fetchEmployeeData();

    } catch (error) {
      console.error("Error Updating Employee Details", error);
    }
    closePopUp();
  };



  function formatDateNew(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }


  const handleCameraClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };




  //-----------------fetching employee details----------------------------------
  const fetchEmployeeData = async () => {
    try {
      const response = await axios.get(`${secretKey}/employee/einfo`);
      console.log(response.data, userId);
      const tempData = response.data;
      const data = tempData.find((item) => item._id === userId);
      console.log(data);
      setEmployeeData(data);


      // set the personal details fields
      setPersonalEmail(data.personal_email || '')
      setPersonalPhone(data.personal_number || '');
      setContactPerson(data.personal_contact_person || '');
      setPersonalAddress(data.personal_address || '');


      setdata(data);
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

  // const today = new Date().toISOString().split('T')[0];

  const events = [

    {
      title: 'Present',
      start: '2024-07-02', // Static start date
      end: '2024-07-03',   // Static end date (same day, all-day event)
      allDay: true,
      editable: false,     // Disable editing for this event
    },
    {
      title: 'Present',
      start: '2024-07-03', // Static start date
      end: '2024-07-03',   // Static end date (same day, all-day event)
      allDay: true,
      editable: false,     // Disable editing for this event
    },
    {
      title: 'Absent',
      start: '2024-06-30', // Static start date
      end: '2024-06-30',   // Static end date (same day, all-day event)
      allDay: true,
      editable: false,     // Disable editing for this event
    }
  ]


  // Edit Employee Information from Hr

  const functionEditEmployee = () => {
    setEditEmpInfo(true);
  }

  const closePopUp = () => {
    setEditEmpInfo(false);
  }


  // Handle form submission
  const handlePersonalDetailsSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.put(
        `${secretKey}/api/employee/personal-details/${userId}`,
        {
          personal_email,
          personal_number,
          personal_contact_person,
          personal_address,
        },
        {
          headers: {
            Authorization: `Bearer ${newtoken}`,
          },
        }
      );

      console.log('Personal details updated successfully:', response.data);
      Swal.fire({
        title: 'Success!',
        text: 'Personal details updated successfully.',
        icon: 'success',
      });
      fetchEmployeeData();
    } catch (error) {
      console.error('Error updating personal details:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to update personal details.',
        icon: 'error',
      });
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
                <li class="breadcrumb-item"><a href="#">Employee</a></li>
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
                            <MdOutlineCameraAlt className="emply_e_card_profile_update_icon" />
                            <p className="m-0 emply_e_card_profile_update_text">Upload</p>
                          </div>
                        </div>
                      </label>
                    </div>
                    <div className="emply_e_card_profile_name bdr-left-eee">
                      <div className="EP_Name d-flex justify-content-between align-items-center">
                        <h3 className="m-0">
                          <span className="clr-ffb900">{data.ename}</span>
                          <div className="EP_Designation">Sales Executive</div>
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
                                    <div className="ep_info_t">SSPL001</div>
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
                                <div className="col-7  pt-1 pb-1 bdr-left-eee">
                                  <div className="">
                                    <div className="ep_info_t">
                                      {data.email}
                                    </div>
                                  </div>
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
                                  <div className="">
                                    <div className="ep_info_t">
                                      {data.number}
                                    </div>
                                  </div>
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
                                  <div className="">
                                    <div className="ep_info_t">{formatDateNew(data.jdate)}</div>
                                  </div>
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
                  <ul class="nav nav-tabs employee_e_info_tab">
                    <li class="nav-item">
                      <a class="nav-link active" data-bs-toggle="tab" href="#eI">Employee Info</a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link" data-bs-toggle="tab" href="#Emergency_Contact">Emergency Contact</a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link" data-bs-toggle="tab" href="#PayrollInformation">Payroll Information</a>
                    </li>
                  </ul>

                  <div class="tab-content employee_e_info_tab_content">
                    <div class="tab-pane active" id="eI">
                      <div className="my-card mt-2" >
                        {/* <div className="my-card-head">
                          Employment Information
                        </div> */}
                        <div className="my-card-body">
                          <div className="row m-0  bdr-btm-eee">
                            <div className="col-4 pt-1 pb-1">
                              <div className="d-flex align-items-center">
                                <div className="ep_info_icon clr-ffb900">
                                  <HiOutlineBuildingLibrary />
                                </div>
                                <div className="ep_info_h">Department :</div>
                              </div>
                            </div>
                            <div className="col-6 pt-1 pb-1 bdr-left-eee">
                              <div className="ep_info_t">
                                Sales
                              </div>
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
                            <div className="col-6 pt-1 pb-1 bdr-left-eee">
                              <div className="ep_info_t">
                                Gota
                              </div>
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
                            <div className="col-6 pt-1 pb-1 bdr-left-eee">
                              <div className="ep_info_t">
                                Full Time
                              </div>
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
                            <div className="col-6 pt-1 pb-1 bdr-left-eee">
                              <div className="ep_info_t">
                                Vaibhav Acharya
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="my-card mt-2" >
                        {/* <div className="my-card-head">
                          Personal Information
                        </div> */}
                        <div className="my-card-body">
                          <div className="row m-0  bdr-btm-eee">
                            <div className="col-4 pt-1 pb-1">
                              <div className="d-flex align-items-center">
                                <div className="ep_info_icon clr-ffb900">
                                  <FaRegUser  />
                                </div>
                                <div className="ep_info_h">Full Name :</div>
                              </div>
                            </div>
                            <div className="col-6 pt-1 pb-1 bdr-left-eee">
                              <div className="ep_info_t">
                                Nimeshkumar Kamleshbhai Parekh
                              </div>
                            </div>
                          </div>  
                          <div className="row m-0 bdr-btm-eee">
                            <div className="col-4 pt-1 pb-1">
                              <div className="d-flex align-items-center">
                                <div className="ep_info_icon clr-ffb900">
                                  <IoCalendarClearOutline  />
                                </div>
                                <div className="ep_info_h">DOB :</div>
                              </div>
                            </div>
                            <div className="col-6 pt-1 pb-1 bdr-left-eee">
                              <div className="ep_info_t">
                                2<sup>nd</sup> Dec 2024
                              </div>
                            </div>
                          </div>
                          <div className="row m-0 bdr-btm-eee">
                            <div className="col-4 pt-1 pb-1 ">
                              <div className="d-flex align-items-center">
                                <div className="ep_info_icon clr-ffb900">
                                  <BsGenderTrans  />
                                </div>
                                <div className="ep_info_h">Gender :</div>
                              </div>
                            </div>
                            <div className="col-6 pt-1 pb-1 bdr-left-eee">
                              <div className="ep_info_t">
                                male
                              </div>
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
                            <div className="col-6 pt-1 pb-1 bdr-left-eee">
                              <div className="ep_info_t">
                                9924283530
                              </div>
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
                            <div className="col-6 pt-1 pb-1 bdr-left-eee">
                              <div className="ep_info_t">
                                male@gmail.com
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="tab-pane fade" id="PayrollInformation">
                      <EmployeeViewPayrollView></EmployeeViewPayrollView>
                    </div>
                    <div class="tab-pane fade" id="Emergency_Contact">
                      <div className="my-card mt-2" >
                        <div className="my-card-body">
                          <div className="row m-0  bdr-btm-eee">
                            <div className="col-4 pt-1 pb-1">
                              <div className="d-flex align-items-center">
                                <div className="ep_info_icon clr-ffb900">
                                  <GoPerson />
                                </div>
                                <div className="ep_info_h">Emergency Contact :</div>
                              </div>
                            </div>
                            <div className="col-6 pt-1 pb-1 bdr-left-eee">
                              <div className="ep_info_t">
                                Nimesh Parekh
                              </div>
                            </div>
                          </div>  
                          <div className="row m-0  bdr-btm-eee">
                            <div className="col-4 pt-1 pb-1">
                              <div className="d-flex align-items-center">
                                <div className="ep_info_icon clr-ffb900">
                                  <GiRelationshipBounds />
                                </div>
                                <div className="ep_info_h">Relationship  :</div>
                              </div>
                            </div>
                            <div className="col-6 pt-1 pb-1 bdr-left-eee">
                              <div className="ep_info_t">
                                Father
                              </div>
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
                            <div className="col-6 pt-1 pb-1 bdr-left-eee">
                              <div className="ep_info_t">
                                9924283530
                              </div>
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
                            <div className="col-6 pt-1 pb-1 bdr-left-eee">
                              <div className="ep_info_t">
                                H 21, Suvarna Apartment, Nirnaynagar, Ranip, Ahmedabad 380000
                              </div>
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
                            <div className="col-6 pt-1 pb-1 bdr-left-eee">
                              <div className="ep_info_t">
                                H 21, Suvarna Apartment, Nirnaynagar, Ranip, Ahmedabad 380000
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
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
                      <EmployeeViewAttendance/>
                    </div>
                    <div class="tab-pane heiitc_inner fade" id="SalaryCalculation">
                      <SalaryCalculationView></SalaryCalculationView>
                    </div>
                    <div class="tab-pane heiitc_inner fade" id="LeaveReport">...</div>
                    <div class="tab-pane heiitc_inner fade" id="CallingReport">...</div>
                    <div class="tab-pane heiitc_inner fade" id="EmployeeDocuments">...</div>
                    <div class="tab-pane heiitc_inner fade" id="Settings">...</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeView;
