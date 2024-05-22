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

function EmployeeTopSellingServices() {
    return (
        <div>
            <div className="dash-card">
                <div className="dash-card-head d-flex align-items-center justify-content-between">
                    <h2 className="m-0">
                        Top Selling Services
                    </h2>
                </div>
                <div className="dash-card-body">
                    <div className="top-selling-s">
                        <div className="top-selling-s-cards d-flex align-items-center justify-content-between clr-bg-light-1cba19">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="top-selling-s-no bdr-l-clr-1cba19">
                                    1
                                </div>
                                <div className="top-selling-s-name">
                                    Start-Up India Certificate
                                </div>
                            </div>
                            <div className="top-selling-s-num clr-bg-1cba19">
                                10
                            </div>
                        </div>
                        <div className="top-selling-s-cards d-flex align-items-center justify-content-between clr-bg-light-00d19d">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="top-selling-s-no bdr-l-clr-00d19d">
                                    2
                                </div>
                                <div className="top-selling-s-name">
                                    Seed Fund Support
                                </div>
                            </div>
                            <div className="top-selling-s-num clr-bg-00d19d">
                                8
                            </div>
                        </div>
                        <div className="top-selling-s-cards d-flex align-items-center justify-content-between clr-bg-light-fff536">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="top-selling-s-no bdr-l-clr-fff536">
                                    3
                                </div>
                                <div className="top-selling-s-name">
                                    Website Development
                                </div>
                            </div>
                            <div className="top-selling-s-num clr-bg-fff536">
                                5
                            </div>
                        </div>
                        <div className="top-selling-s-cards d-flex align-items-center justify-content-between clr-bg-light-ffb900">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="top-selling-s-no bdr-l-clr-ffb900">
                                    4
                                </div>
                                <div className="top-selling-s-name">
                                    Income TAX Exemption
                                </div>
                            </div>
                            <div className="top-selling-s-num clr-bg-ffb900">
                                4
                            </div>
                        </div>
                        <div className="top-selling-s-cards d-flex align-items-center justify-content-between clr-bg-light-e65b5b">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="top-selling-s-no bdr-l-clr-e65b5b">
                                    5
                                </div>
                                <div className="top-selling-s-name">
                                    ISO Certificate
                                </div>
                            </div>
                            <div className="top-selling-s-num clr-bg-e65b5b">
                                3
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EmployeeTopSellingServices;