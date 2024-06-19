import React, { useEffect, useState, CSSProperties, useRef } from "react";
import { useParams } from 'react-router-dom';
import Header from "../components/Header";
import EmpNav from "./EmpNav";
import axios from "axios";
import { options } from "../components/Options.js";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
//import { DateRangePicker } from "react-date-range";
import EmpImg1 from "../static/EmployeeImg/Emp1.jpeg"
import EmpImg2 from "../static/EmployeeImg/Emp2.jpeg"
import EmpDfaullt from "../static/EmployeeImg/office-man.png"
import { FaCamera } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { FaRegCircleUser } from "react-icons/fa6";
import { TbPhoneCall } from "react-icons/tb";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { GrLocation } from "react-icons/gr";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'










function EmployeeProfile() {
    const { userId } = useParams();
    const { newtoken } = useParams();
    const [data, setdata] = useState([])
    const [employeeData, setEmployeeData] = useState([])
    const secretKey = process.env.REACT_APP_SECRET_KEY;



    //-----------------fetching employee details----------------------------------
    const fetchEmployeeData = async () => {

        try {
            const response = await axios.get(`${secretKey}/employee/einfo`)
            console.log(response.data)
            const tempData = response.data;
            const data = tempData.find((item) => item._id === userId);
            console.log(data)
            setEmployeeData(data)
            setdata(data)


        } catch (error) {
            console.error("Error fetching employee data", error)

        }
    }
    React.useEffect(() => {
        fetchEmployeeData()
    }, [])

    






  return (
    <div>
      <Header name={data.ename} designation={data.designation} />
      <EmpNav userId={userId} bdmWork={data.bdmWork} />
      <div className="page-wrapper">
        <div className="employee-profile-main mt-3 mb-3">
          <div className="container-xl">
            <div className="row">
              <div className="col-lg-7">
                <div className="my-card">
                  <div className="d-flex align-items-start m-0">
                    <div className="employee_profile_picture d-flex align-items-center justify-content-center">
                      <div className="employee_picture">
                        <img src={EmpImg1}></img>
                      </div>
                      <div className="profile-pic-upload">
                        <FaCamera />
                      </div>
                    </div>
                    <div className="employee_profile_data">
                      <div className="EP_Name d-flex justify-content-between align-items-center">
                        <h3 className="m-0">
                          Nimesh Parekh
                          <div className="EP_Designation">
                              Sales Executive
                          </div>
                        </h3>
                        <div className="employee_active">
                          Active
                        </div>
                      </div>
                      <div className="row m-0 aling-items-start" >
                        <div className="col-sm-6">
                          <div className="EP_Other_info clr-bg-light-4299e1 mt-3">
                            <div className="EP_Other_info_head clr-4299e1" style={{background:'#e4f1fb'}}>
                                Office Details
                            </div>
                            <div className="d-flex align-items-center mt-1 mb-1">
                              <div className="d-flex align-items-center">
                                <div className="ep_info_icon clr-4299e1">
                                <FaRegCircleUser />
                                </div>
                                <div className="ep_info_h">
                                  Employee Id :
                                </div>
                              </div>
                              <div className="ml-1">
                                <div className="ep_info_t">2456</div>
                              </div>
                            </div>
                            <div className="d-flex align-items-center mt-1 mb-1">
                              <div className="d-flex align-items-center">
                                <div className="ep_info_icon clr-4299e1">
                                  <MdOutlineEmail />
                                </div>
                                <div className="ep_info_h">
                                  Email :
                                </div>
                              </div>
                              <div className="ml-1">
                                <div className="ep_info_t">nirmeshparekh1@gmail.com</div>
                              </div>
                            </div>
                            <div className="d-flex align-items-center mt-1 mb-1">
                              <div className="d-flex align-items-center">
                                <div className="ep_info_icon clr-4299e1">
                                <TbPhoneCall />
                                </div>
                                <div className="ep_info_h">
                                  Phone No :
                                </div>
                              </div>
                              <div className="ml-1">
                                <div className="ep_info_t">+91 99242 83530</div>
                              </div>
                            </div>
                            <div className="d-flex align-items-center mt-1 mb-1">
                              <div className="d-flex align-items-center">
                                <div className="ep_info_icon clr-4299e1">
                                <MdOutlineCalendarMonth />
                                </div>
                                <div className="ep_info_h">
                                  Joining Date:
                                </div>
                              </div>
                              <div className="ml-1">
                                <div className="ep_info_t">02 Dec 2023</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="EP_Other_info clr-bg-light-00d19d mt-3">
                            <div className="EP_Other_info_head clr-00d19d" style={{background:'#dbf9f1'}}>
                                Personal Details
                            </div>
                            <div className="d-flex align-items-center mt-1 mb-1">
                              <div className="d-flex align-items-center">
                                <div className="ep_info_icon clr-00d19d">
                                  <MdOutlineEmail />
                                </div>
                                <div className="ep_info_h">
                                  Email :
                                </div>
                              </div>
                              <div className="ml-1">
                                <div className="ep_info_t">nirmeshparekh1@gmail.com</div>
                              </div>
                            </div>
                            <div className="d-flex align-items-center mt-1 mb-1">
                              <div className="d-flex align-items-center">
                                <div className="ep_info_icon clr-00d19d">
                                <TbPhoneCall />
                                </div>
                                <div className="ep_info_h">
                                  Phone No :
                                </div>
                              </div>
                              <div className="ml-1">
                                <div className="ep_info_t">+91 99242 83530</div>
                              </div>
                            </div>
                            <div className="d-flex align-items-center mt-1 mb-1">
                              <div className="d-flex align-items-center">
                                <div className="ep_info_icon clr-00d19d">
                                <FaRegCircleUser />
                                </div>
                                <div className="ep_info_h">
                                  Emergency Contact :
                                </div>
                              </div>
                              <div className="ml-1">
                                <div className="ep_info_t">2456</div>
                              </div>
                            </div>
                            <div className="d-flex align-items-center mt-1 mb-1">
                              <div className="d-flex align-items-center">
                                <div className="ep_info_icon clr-00d19d">
                                <GrLocation />
                                </div>
                                <div className="ep_info_h">
                                  Address:
                                </div>
                              </div>
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
              <div className="col-lg-5">
                <div className="my-card">
                  <div className="my-card-body p-2">
                    <FullCalendar
                      plugins={[ dayGridPlugin ]}
                      initialView="dayGridMonth"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmployeeProfile