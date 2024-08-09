import React, { useEffect, useState, CSSProperties, useRef } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header/Header.jsx";
import axios from "axios";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
//import { DateRangePicker } from "react-date-range";
import EmpImg1 from "../../static/EmployeeImg/Emp1.jpeg"
import EmpImg2 from "../../static/EmployeeImg/Emp2.jpeg"
import MaleEmployee from "../../static/EmployeeImg/office-man.png";
import FemaleEmployee from "../../static/EmployeeImg/woman.png";
import { MdOutlineCameraAlt } from "react-icons/md";
import logo from "../../static/mainLogo.png"
import { FaCamera } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { FaRegCircleUser } from "react-icons/fa6";
import { TbPhoneCall } from "react-icons/tb";
import { MdOutlineCalendarMonth } from "react-icons/md";
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
import CloseIcon from "@mui/icons-material/Close";
import Navbar from "./Navbar/Navbar.jsx";
import { HiPencil } from "react-icons/hi";
import { FcBusinessman } from "react-icons/fc";
import { FcManager } from "react-icons/fc";
import { FcCalendar } from "react-icons/fc";
import { FcBusinesswoman } from "react-icons/fc";
import { FcIphone } from "react-icons/fc";
import { FaLocationDot } from "react-icons/fa6";
import { FcFeedback } from "react-icons/fc";
import { color } from "@mui/system";

function EmployeeView() {

  const { userId } = useParams();
  const { newtoken } = useParams();
  const [data, setdata] = useState([]);
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



  React.useEffect(() => {
    fetchEmployeeData();
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
      <Header id={data._id} name={data.ename} empProfile={data.profilePhoto && data.profilePhoto.length !== 0 && data.profilePhoto[0].filename} gender={data.gender} designation={data.newDesignation} />
      <Navbar />
      <div className="page-wrapper">
        <div className="page-header rm_Filter m-0">
          <div className="container-xl">
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="#">Employee</a></li>
                <li class="breadcrumb-item active" aria-current="page">Employee Profile</li>
              </ol>
            </nav>
          </div>
        </div>
        <div className="page-body rm_Dtl_box m-0">
          <div className="container-xl">
            <div className="d-flex mt-1">
              {/* <div className="E_Id_card_main">
                <div className="E_Id_card">
                  <div className="E_Id_card_bg">
                    <div className="main_logo_For_ID">
                      <img src={logo}></img>
                    </div>
                    <div className="E_id_top_black_bg">
                    </div>
                    <div className="E_id_profile d-flex align-items-center justify-content-center"> 
                      <div className="E_id_profile_inner">
                        <div className="position-relative">
                          <div className="E_id_profile_img">
                            <img src={EmpDfaullt}></img>
                          </div>
                          <div
                              className="profile-pic-upload"
                              onClick={handleCameraClick}
                            >
                              <FaCamera />
                          </div>
                        </div>
                        <div className="E_id_profile_Name">
                          Nimesh Parekh
                        </div>
                        <div className="E_id_profile_designation">
                          CTO
                        </div>
                      </div>
                    </div>
                    <div className="E_id_bottom_black_bg">
                    </div>
                    <div className="E_id_profile_details">
                      <div className="d-flex E_id_profile_details_items">
                        <div className="E_id_p_fileld">
                          ID
                        </div>
                        <div className="E_id_p_data">
                           : 025863
                        </div>
                      </div>
                      <div className="d-flex E_id_profile_details_items">
                        <div className="E_id_p_fileld">
                          DOB
                        </div>
                        <div className="E_id_p_data">
                           : 10-03-2000
                        </div>
                      </div>
                      <div className="d-flex E_id_profile_details_items">
                        <div className="E_id_p_fileld">
                          Phone
                        </div>
                        <div className="E_id_p_data">
                           : +91 9924283530
                        </div>
                      </div>
                      <div className="d-flex E_id_profile_details_items">
                        <div className="E_id_p_fileld">
                          BG
                        </div>
                        <div className="E_id_p_data">
                           : O-
                        </div>
                      </div>
                      <div className="d-flex E_id_profile_details_items">
                        <div className="E_id_p_fileld">
                          E-Mail
                        </div>
                        <div className="E_id_p_data">
                           : nirmeshparekh1@gmail.com
                        </div>
                      </div>
                    </div>
                    <div className="E_id_website">
                        www.startupsahay.com
                    </div>
                  </div>
                </div>
              </div> */}
              <div className="emply_e_card">
                <div className="my-card">
                  <div className="emply_e_card_profile">
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
                    <div className="emply_e_card_profile_name">
                      <p className="m-0">{data.ename}</p>
                      <label className="m-0">{data.newDesignation}</label>
                    </div>
                  </div>
                </div>
                <div className="my-card-style-2 mt-3">
                  <div className="my-card-head-style-2">
                    Personal Information
                  </div>
                  <div className="my-card-body-style-2">
                    <div className="emply_e_card_dtl">
                      <div className="emply_e_info_head">
                        Full Name
                      </div>
                      <div className="emply_e_info_data d-flex align-items-center justify-content-between">
                        <div className="d-flex align-item-center">
                          <div className="ee_info_i"><FcManager /></div>
                          <div className="emply_e_info_data_name">
                            Vishunu Maheshbhai Suthar
                          </div>
                        </div>
                        <div class="employee_active">Active</div>
                      </div>
                    </div>
                    <div className="row mt-2">
                      <div className="col">
                        <div className="emply_e_card_dtl">
                          <div className="emply_e_info_head">
                            DOB
                          </div>
                          <div className="emply_e_info_data">
                            <div className="d-flex aling-items-center">
                              <div className="ee_info_i"><FcCalendar /></div>
                              <div className="emply_e_info_data_name">
                                2<sup>nd</sup> Dec 2024
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col">
                        <div className="emply_e_card_dtl">
                          <div className="emply_e_info_head">
                            Gender
                          </div>
                          <div className="emply_e_info_data">
                            <div className="d-flex aling-items-center">
                              <div className="ee_info_i"><FcBusinessman /></div>
                              <div className="emply_e_info_data_name">
                                Male
                              </div>
                              {/* <div className="ee_info_i"><FcBusinesswoman  /></div>
                              <div className="emply_e_info_data_name">
                                Female
                              </div> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row mt-2">
                      <div className="col">
                        <div className="emply_e_card_dtl">
                          <div className="emply_e_info_head">
                            Phone No
                          </div>
                          <div className="emply_e_info_data">
                            <div className="d-flex aling-items-center">
                              <div className="ee_info_i"><FcIphone /></div>
                              <div className="emply_e_info_data_name">
                                9924283530
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col">
                        <div className="emply_e_card_dtl">
                          <div className="emply_e_info_head">
                            Email
                          </div>
                          <div className="emply_e_info_data">
                            <div className="d-flex aling-items-center">
                              <div className="ee_info_i"><FcFeedback /></div>
                              <div className="emply_e_info_data_name">
                                Nimesh@incsccale.in
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row mt-2">
                      <div className="col">
                        <div className="emply_e_card_dtl">
                          <div className="emply_e_info_head">
                            Address
                          </div>
                          <div className="emply_e_info_data">
                            <div className="d-flex aling-items-center">
                              <div className="ee_info_i" style={{ color: "#fbba1c" }}><FaLocationDot /></div>
                              <div className="emply_e_info_data_name">
                                H 21, Suvarna Apartment, Nirnay nagar, Ranip. Ahmedabad
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hr_employee_information">
                <div className="my-card hr_emply_info_inner">

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>






















      {/* {data && data.length!==0 &&  }
      {data && data.length!==0 && }
      {data && data.length!==0 && <div className="page-wrapper">
        <div className="employee-profile-main mt-3 mb-3">
          <div className="container-xl">
            <div className="row">
              <div className="col-lg-7">
                <div className="my-card">
                  <div className="d-flex align-items-start m-0">
                    <div className="employee_profile_picture d-flex align-items-center justify-content-center">
                      <div className="employee_picture">
                        <img src={`${secretKey}/employee/employeeImg/${encodeURIComponent(data.ename)}/${data.employee_profile && data.employee_profile.length!==0 && encodeURIComponent(data.employee_profile[0].filename)}`} alt="Employee"></img>
                      </div>
                      <div
                        className="profile-pic-upload"
                        onClick={handleCameraClick}
                      >
                        <FaCamera />
                      </div>
                      <Dialog
                        open={open}
                        onClose={handleClose}
                        fullWidth
                        maxWidth="sm"
                      >
                        <DialogTitle>
                          Upload Image
                          <IconButton
                            onClick={handleClose}
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
                                accept=".jpg, .jpeg, .png"
                                onChange={handleImageChange}
                              />
                            </div>
                          </div>
                        </DialogContent>
                        <Button className="btn btn-primary">
                          Submit
                        </Button>
                      </Dialog>
                    </div>
                    <div className="employee_profile_data">
                      <div className="EP_Name d-flex justify-content-between align-items-center">
                        <h3 className="m-0">
                          <span className="clr-ffb900">{data.ename}</span>
                          <div className="EP_Designation">Sales Executive</div>
                        </h3>
                        <div className="employee_active">Active</div>
                      </div>
                      <div className="row m-0 aling-items-start">
                        <div className="col-sm-6 p-0">
                          <div className="EP_Other_info">
                            <div className="EP_Other_info_head">
                              Office Details
                            </div>
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
                                  <div className="ml-1">
                                    <div className="ep_info_t">2456</div>
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
                                  <div className="ml-1">
                                    <div className="ep_info_t">
                                      {data.email}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="row m-0 bdr-btm-eee">
                                <div className="col-5  pt-1 pb-1">
                                  <div className="d-flex align-items-center">
                                    <div className="ep_info_icon clr-ffb900">
                                      <TbPhoneCall />
                                    </div>
                                    <div className="ep_info_h">Phone No :</div>
                                  </div>
                                </div>
                                <div className="col-7  pt-1 pb-1 bdr-left-eee">
                                  <div className="ml-1">
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
                                      Joining Date:
                                    </div>
                                  </div>
                                </div>
                                <div className="col-7  pt-1 pb-1 bdr-left-eee">
                                  <div className="ml-1">
                                    <div className="ep_info_t">{formatDateNew(data.jdate)}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6 p-0 bdr-left-eee">
                          <div className="EP_Other_info">
                            <div className="EP-other_info_heads d-flex ln-lg align-items-center">
                              <div className="EP_Other_info_head">
                                Personal Details
                              </div>
                              <div className="employee-personal-details" onClick={functionEditEmployee}>
                                <HiPencil />
                              </div>
                            </div>
                            <div className="EP_Other_info_body">
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
                                  <div className="ml-1">
                                    <div className="ep_info_t">
                                    {data.personal_email}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="row m-0 bdr-btm-eee">
                                <div className="col-5  pt-1 pb-1">
                                  <div className="d-flex align-items-center">
                                    <div className="ep_info_icon clr-ffb900">
                                      <TbPhoneCall />
                                    </div>
                                    <div className="ep_info_h">Phone No :</div>
                                  </div>
                                </div>
                                <div className="col-7  pt-1 pb-1 bdr-left-eee">
                                  <div className="ml-1">
                                    <div className="ep_info_t">
                                    {data.personal_number}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="row m-0 bdr-btm-eee">
                                <div className="col-5  pt-1 pb-1">
                                  <div className="d-flex align-items-center">
                                    <div className="ep_info_icon clr-ffb900">
                                      <FaRegCircleUser />
                                    </div>
                                    <div className="ep_info_h">
                                      Contact Person:
                                    </div>
                                  </div>
                                </div>
                                <div className="col-7  pt-1 pb-1 bdr-left-eee">
                                  <div className="ml-1">
                                    <div className="ep_info_t">{data.personal_contact_person}</div>
                                  </div>
                                </div>
                              </div>
                              <div className="row m-0">
                                <div className="col-5  pt-1 pb-1">
                                  <div className="d-flex align-items-center">
                                    <div className="ep_info_icon clr-ffb900">
                                      <GrLocation />
                                    </div>
                                    <div className="ep_info_h">Address:</div>
                                  </div>
                                </div>
                                <div className="col-7  pt-1 pb-1 bdr-left-eee">
                                  <div className="ml-1">
                                    <div className="ep_info_t">{data.personal_address}</div>
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
                <div className="my-card e-profile-tab-main mt-3 p-3">
                  <div className="e-profile-tab d-flex align-items-center justify-content-between">
                    <div className="e-profile-tab-item active">
                      Leave Calculation
                    </div>
                    <div className="e-profile-tab-item">National Holidays</div>
                    <div className="e-profile-tab-item">Salary Calculation</div>
                    <div className="e-profile-tab-item">salary slip</div>
                    <div className="e-profile-tab-item">
                      Performance Management
                    </div>
                  </div>
                  <div className="table-resposive e-profile-tab-data mt-2">
                    <div className="d-flex justify-content-between aling-items-center">
                      <div className="form-group">
                        <div class="input-group">
                          <span
                            class="input-group-text"
                            style={{ fontSize: "12px" }}
                          >
                            Filter By Date
                          </span>
                          <input
                            type="date"
                            class="form-control form-control-sm"
                            placeholder="Enter Your City"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <button className="btn btn-sm btn-primary">
                          + Leave Request
                        </button>
                      </div>
                    </div>
                    <div className="table-resposive emply-p-table mt-2">
                      <table className="table table-nowrap">
                        <thead>
                          <tr class="tr-sticky">
                            <th>Sr.No</th>
                            <th>Date</th>
                            <th>Reason</th>
                            <th>Leave Type</th>
                            <th>Paid/Unpaid</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>1</td>
                            <td>20 Jun 2023</td>
                            <td>Out of City</td>
                            <td>Full Day</td>
                            <td>Unpaid</td>
                          </tr>
                          <tr>
                            <td>1</td>
                            <td>20 Jun 2023</td>
                            <td>Out of City</td>
                            <td>Full Day</td>
                            <td>Unpaid</td>
                          </tr>
                          <tr>
                            <td>1</td>
                            <td>20 Jun 2023</td>
                            <td>Out of City</td>
                            <td>Full Day</td>
                            <td>Unpaid</td>
                          </tr>
                          <tr>
                            <td>1</td>
                            <td>20 Jun 2023</td>
                            <td>Out of City</td>
                            <td>Full Day</td>
                            <td>Unpaid</td>
                          </tr>
                          <tr>
                            <td>1</td>
                            <td>20 Jun 2023</td>
                            <td>Out of City</td>
                            <td>Full Day</td>
                            <td>Unpaid</td>
                          </tr>
                          <tr>
                            <td>1</td>
                            <td>20 Jun 2023</td>
                            <td>Out of City</td>
                            <td>Full Day</td>
                            <td>Unpaid</td>
                          </tr>

                          <tr>
                            <td>1</td>
                            <td>20 Jun 2023</td>
                            <td>Out of City</td>
                            <td>Full Day</td>
                            <td>Unpaid</td>
                          </tr>
                          <tr>
                            <td>1</td>
                            <td>20 Jun 2023</td>
                            <td>Out of City</td>
                            <td>Full Day</td>
                            <td>Unpaid</td>
                          </tr>
                          <tr>
                            <td>1</td>
                            <td>20 Jun 2023</td>
                            <td>Out of City</td>
                            <td>Full Day</td>
                            <td>Unpaid</td>
                          </tr>
                          <tr>
                            <td>1</td>
                            <td>20 Jun 2023</td>
                            <td>Out of City</td>
                            <td>Full Day</td>
                            <td>Unpaid</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-5">
                <div className="my-card">
                  <div
                    className="my-card-body p-2"
                    style={{ minHeight: "calc(100vh - 149px)" }}
                  >
                    <FullCalendar 
                      plugins={[dayGridPlugin,interactionPlugin,listPlugin, timeGridPlugin]}
                      initialView="dayGridMonth"
                      editable={true}
                      selectable={true}
                      headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,dayGridWeek,dayGridDay,listDay'
                      }}
                      events={events}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>}
      <Dialog className='My_Mat_Dialog' open={editempinfo} onClose={closePopUp} fullWidth maxWidth="sm" onSubmit={handlePersonalDetailsSubmit}>
        <DialogTitle>
          Employee Edit Info{" "}
          <IconButton onClick={closePopUp} style={{ float: "right" }}>
            <CloseIcon color="primary"></CloseIcon>
          </IconButton>{" "}
        </DialogTitle>
        <DialogContent>
          <div className="modal-dialog modal-lg" role="document" >
            <div className="modal-content">
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Personal Email</label>
                  <input
                    type="email"
                    value={personal_email}
                    className="form-control"
                    name="example-text-input"
                    placeholder="Your Personal name"
                    onChange={(e) => {
                      setPersonalEmail(e.target.value);
                    }}
                  />
                </div>
                <div className="mb-3">
                    <label className="form-label">Personal Phone No.</label>
                    <input
                      value={personal_number}
                      type="number"
                      className="form-control"
                      onChange={(e) => {
                        setPersonalPhone(e.target.value);
                      }}
                    />
                  </div>
                <div className="mb-3">
                  <label className="form-label">Personal Contact Person</label>
                  <input
                    value={personal_contact_person}
                    type="text"
                    className="form-control"
                    name="example-text-input"
                    placeholder="Your Contact Person"
                    onChange={(e) => {
                      setContactPerson(e.target.value);
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Personal Address</label>
                  <input
                    value={personal_address}
                    type="text"
                    className="form-control"
                    name="example-text-input"
                    placeholder="Your Personal Address"
                    onChange={(e) => {
                      setPersonalAddress(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
        <Button className="btn btn-primary bdr-radius-none" onClick={handleSubmit} variant="contained">
          Save Changes
        </Button>
      </Dialog> */}
    </div>
  );
}

export default EmployeeView;
