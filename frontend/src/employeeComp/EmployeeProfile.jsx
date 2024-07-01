import React, { useEffect, useState, CSSProperties, useRef } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import EmpNav from "./EmpNav";
import axios from "axios";
import { options } from "../components/Options.js";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
//import { DateRangePicker } from "react-date-range";
import EmpImg1 from "../static/EmployeeImg/Emp1.jpeg";
import EmpImg2 from "../static/EmployeeImg/Emp2.jpeg";
import EmpDfaullt from "../static/EmployeeImg/office-man.png";
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
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function EmployeeProfile() {
  const { userId } = useParams();
  const { newtoken } = useParams();
  const [data, setdata] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const [empImg1, setEmpImg1] = useState(
    localStorage.getItem("empImg1") || "initial_image_url"
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const [open, setOpen] = useState(false);

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
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
  
      try {
        const response = await axios.post(`${secretKey}/employee/employeeimages/${data.ename}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${newtoken}`, 
          },
        });
        console.log("File upload success:", response.data);
        const imageUrl = response.data.imageUrl;
        setEmpImg1(imageUrl); 
        localStorage.setItem("empImg1", imageUrl); 
        fetchEmployeeData()
        handleClose(); 
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    } else {
      alert("No file selected.");
    }
  };
  

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
      console.log(response.data);
      const tempData = response.data;
      const data = tempData.find((item) => item._id === userId);
      console.log(data);
      setEmployeeData(data);
      setdata(data);
    } catch (error) {
      console.error("Error fetching employee data", error);
    }
  };
  React.useEffect(() => {
    fetchEmployeeData();
  }, []);

  
  return (
    <div>
      <Header name={data.ename} designation={data.designation} />
      <EmpNav userId={userId} bdmWork={data.bdmWork} />
      {data && <div className="page-wrapper">
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
                        <Button onClick={handleSubmit} className="btn btn-primary">
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
                                    <div className="ep_info_t">{data.jdate}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6 p-0 bdr-left-eee">
                          <div className="EP_Other_info">
                            <div className="EP_Other_info_head">
                              Personal Details
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
                                      nirmeshparekh1@gmail.com
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
                                      +91 99242 83530
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
                                    <div className="ep_info_t">Nimesh</div>
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
                                    <div className="ep_info_t">02 Dec 2023</div>
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
                <div className="my-card ">
                  <div
                    className="my-card-body p-2"
                    style={{ minHeight: "calc(100vh - 149px)" }}
                  >
                    <FullCalendar 
                     plugins={[dayGridPlugin,interactionPlugin]}
                     initialView="dayGridMonth"
                     editable={true}
                     selectable={true}
                     event={[
                      {
                        "date":"01-07-2024",
                        "status":"present"
                      }
                     ]}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>}
    </div>
  );
}

export default EmployeeProfile;
