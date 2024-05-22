import React, { useEffect, useState, CSSProperties, useRef } from "react";
import Header from "../../components/Header.js";
import EmpNav from "../EmpNav.js";
import axios from "axios";
import { useParams } from "react-router-dom";
import { options } from "../../components/Options.js";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import Swal from "sweetalert2";
import Select from "react-select";
import Nodata from "../../components/Nodata";
import { IoFileTrayFullOutline } from "react-icons/io5";
import { CiViewList } from "react-icons/ci";
import { MdImportantDevices } from "react-icons/md";
import { LiaAlgolia } from "react-icons/lia";
import { LiaClipboardCheckSolid } from "react-icons/lia";
import { RiFileCloseLine } from "react-icons/ri";

function EmployeeForwardedReport() {
  return (
    <div>
       <div className="dash-card">
                      <div className="dash-card-head d-flex align-items-center justify-content-between">
                        <h2 className="m-0">
                          <select class="head-select form-select" id="head-select">
                            <option value="1" selected>Forwarded to BDM</option>
                            <option value="2">Received as BDM</option>
                          </select>
                        </h2>
                        <div className="dash-select-filter">
                          <select class="form-select form-select-sm my-filter-select" aria-label=".form-select-sm example">
                            <option value="1" selected>Today</option>
                            <option value="2">This Month</option>
                            <option value="3">Last Month</option>
                          </select>
                        </div>
                      </div>
                      <div className="dash-card-body">
                        <div className="row m-0 align-items-center">
                          <div className="col-sm-7 p-0 align-self-stretch h-100">
                            <div className="bdm-f-r-revenue h-100">
                              <div className="bdm-f-r-revenue-projected">
                                <div className="roundImggreen">
                                  <div className="roundImggreen-inner-text">₹ 30,000/-</div>
                                </div>
                                <div className="roundImggreen-text">Projected <br />Revenue</div>
                              </div>
                              <div className="bdm-f-r-revenue-generated">
                                <div className="roundImgOrg">
                                  <div className="roundImgOrg-inner-text">₹ 50,200/-</div>
                                </div>
                                <div className="roundImgOrg-text">Generated <br />Revenue</div>
                              </div>
                            </div>
                          </div>
                          <div className="col-sm-5 p-0 align-self-stretch">
                            <div className="call-dr-names">
                              <div className="call-dr-card d-flex align-items-center justify-content-between pl-0 pt-1 pr-0 pb-1">
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="color-squre-dots clr-bg-light-1ac9bd clr-1ac9bd">
                                    <CiViewList />
                                  </div>
                                  <div className="call-dr-name">
                                    General
                                  </div>
                                </div>
                                <div className="call-dr-num clr-1ac9bd" >
                                  100
                                </div>
                              </div>
                              <div className="call-dr-card d-flex align-items-center justify-content-between pl-0 pt-1 pr-0 pb-1">
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="color-squre-dots clr-bg-light-ffb900 clr-ffb900">
                                    <MdImportantDevices />
                                  </div>
                                  <div className="call-dr-name">
                                    Interested
                                  </div>
                                </div>
                                <div className="call-dr-num clr-ffb900" >
                                  20
                                </div>
                              </div>
                              <div className="call-dr-card d-flex align-items-center justify-content-between pl-0 pt-1 pr-0 pb-1">
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="color-squre-dots clr-bg-light-4299e1 clr-4299e1">
                                    <LiaAlgolia />
                                  </div>
                                  <div className="call-dr-name">
                                    Follow Up
                                  </div>
                                </div>
                                <div className="call-dr-num clr-4299e1">
                                  25
                                </div>
                              </div>
                              <div className="call-dr-card d-flex align-items-center justify-content-between pl-0 pt-1 pr-0 pb-1">
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="color-squre-dots clr-bg-light-1cba19 clr-1cba19">
                                    <LiaClipboardCheckSolid />
                                  </div>
                                  <div className="call-dr-name">
                                    Matured
                                  </div>
                                </div>
                                <div className="call-dr-num clr-1cba19">
                                  5
                                </div>
                              </div>
                              <div className="call-dr-card d-flex align-items-center justify-content-between pl-0 pt-1 pr-0 pb-1">
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="color-squre-dots clr-bg-light-e65b5b clr-e65b5b">
                                    <RiFileCloseLine />
                                  </div>
                                  <div className="call-dr-name">
                                    Not Interested
                                  </div>
                                </div>
                                <div className="call-dr-num clr-e65b5b">
                                  30
                                </div>
                              </div>
                              <div className="call-dr-card d-flex align-items-center justify-content-between pl-0 pt-1 pr-0 pb-1">
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="color-squre-dots clr-bg-light-00d19d clr-00d19d">
                                    <IoFileTrayFullOutline />
                                  </div>
                                  <div className="call-dr-name">
                                    Total
                                  </div>
                                </div>
                                <div className="call-dr-num clr-00d19d">
                                  200
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

export default EmployeeForwardedReport