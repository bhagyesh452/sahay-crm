import React, { useState, useEffect, useSyncExternalStore } from "react";
import Header from "../components/Header";
import EmpNav from "./EmpNav";
import { IoFilterOutline } from "react-icons/io5";
import axios from "axios";
import { useParams } from "react-router-dom";


function EmployeeAssets() {
    const { userId } = useParams();
    const [data, setData] = useState([]);




    return(
        <div>
            <Header/>
            <EmpNav/>
            <div className="page-wrapper">
                <div className="page-header rm_Filter m-0 d-none">
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
                    <div className="container-xl">
                        <div className="my-card">
                            <div className="row m-0 E_assets_main">
                                <div className="col-lg-2 p-0">
                                    <div className="employee-assets-left">
                                        <ul class="nav flex-column">
                                            <li class="nav-item">
                                                <a class="nav-link sweep-to-right active" data-bs-toggle="tab" href="#Business_Registration">Business Registration</a>
                                            </li>
                                            <li class="nav-item">
                                                <a class="nav-link sweep-to-right" data-bs-toggle="tab" href="#Certification_Services">Certification Services</a>
                                            </li>
                                            <li class="nav-item">
                                                <a class="nav-link sweep-to-right" data-bs-toggle="tab" href="#Documentations_Services">Documentations Services</a>
                                            </li>
                                            <li class="nav-item">
                                                <a class="nav-link sweep-to-right" data-bs-toggle="tab" href="#Fund_Raising_Services">Fund Raising Services</a>
                                            </li>
                                            <li class="nav-item">
                                                <a class="nav-link sweep-to-right" data-bs-toggle="tab" href="#IT">IT Services</a>
                                            </li>
                                            <li class="nav-item">
                                                <a class="nav-link sweep-to-right" data-bs-toggle="tab" href="#DigitalMarketing">Digital Marketing</a>
                                            </li>
                                            <li class="nav-item">
                                                <a class="nav-link sweep-to-right" data-bs-toggle="tab" href="#ISO">ISO Services</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="col-lg-10 p-0">
                                    <div className="employee-assets-right">
                                        <div class="tab-content">
                                            <div class="tab-pane container active" id="Business_Registration">
                                                <div className="E_Start-Up_Assets_inner">
                                                    
                                                    <div className="ESAI_data row">
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                Private Limited Registration
                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                Structure with limited liability, suitable for startups and medium to large businesses.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                LLP Registration
                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                Hybrid structure offering limited liability and flexibility for small to medium businesses.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                    LLP Firm Registration
                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                    Application for Issue of Phytosanitary Certificate for Export of Agriculture Commodit...
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                OPC Registration
                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                Single-owner company with limited liability, ideal for solo entrepreneurs.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                Public Company Registration
                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                Large entity raising capital through public shares, suitable for large-scale businesses.

                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                Nidhi Company Registration
                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                NBFC promoting savings and lending among members, with limited liability.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                Sole Proprietorship Registration
                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                Simple structure with complete control, ideal for individual-owned businesses.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                Producer Company Registration
                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                Structure for farmers/producers to pool resources, share profits, and scale operations.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="tab-pane container fade" id="Certification_Services">
                                                <div className="E_Start-Up_Assets_inner">
                                                    
                                                    <div className="ESAI_data row">
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                Start-Up India Certificate
                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                Structure with limited liability, suitable for startups and medium to large businesses.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                MSME/UYDAM Certificate
                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                Hybrid structure offering limited liability and flexibility for small to medium businesses.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                IEC CODE Certificate
                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                    Application for Issue of Phytosanitary Certificate for Export of Agriculture Commodit...
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                BIS Certificate
                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                Single-owner company with limited liability, ideal for solo entrepreneurs.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                NSIC Certificate
                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                Large entity raising capital through public shares, suitable for large-scale businesses.

                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                FSSAI Certificate
                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                NBFC promoting savings and lending among members, with limited liability.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                APEDA Certificate
                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                Simple structure with complete control, ideal for individual-owned businesses.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                GST Certificate
                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                Structure for farmers/producers to pool resources, share profits, and scale operations.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="tab-pane container fade" id="Documentations_Services">
                                                <div className="E_Start-Up_Assets_inner">
                                                    
                                                    <div className="ESAI_data row">
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                Pitch Deck Development
                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                Structure with limited liability, suitable for startups and medium to large businesses.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                Financial Modeling

                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                Hybrid structure offering limited liability and flexibility for small to medium businesses.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                DPR Development

                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                    Application for Issue of Phytosanitary Certificate for Export of Agriculture Commodit...
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                CMA Report Development

                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                Single-owner company with limited liability, ideal for solo entrepreneurs.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                Company Profile

                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                Large entity raising capital through public shares, suitable for large-scale businesses.

                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                FSSAI Certificate
                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                NBFC promoting savings and lending among members, with limited liability.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                APEDA Certificate
                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                Simple structure with complete control, ideal for individual-owned businesses.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                Company Brochure
                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                Structure for farmers/producers to pool resources, share profits, and scale operations.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                Product Catalog
                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                Structure for farmers/producers to pool resources, share profits, and scale operations.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="tab-pane container fade" id="Fund_Raising_Services">
                                                <div className="E_Start-Up_Assets_inner">
                                                    
                                                    <div className="ESAI_data row">
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                Seed Funding Support
                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                Structure with limited liability, suitable for startups and medium to large businesses.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                I-CREATE Funding Support
                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                Hybrid structure offering limited liability and flexibility for small to medium businesses.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                DBS Funding 


                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                    Application for Issue of Phytosanitary Certificate for Export of Agriculture Commodit...
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                Angel Funding Support


                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                Single-owner company with limited liability, ideal for solo entrepreneurs.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                VC Funding Support


                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                Large entity raising capital through public shares, suitable for large-scale businesses.

                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                Crowd Funding Support

                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                NBFC promoting savings and lending among members, with limited liability.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                Government Funding Support
                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                Simple structure with complete control, ideal for individual-owned businesses.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="tab-pane container fade" id="IT">
                                                <div className="E_Start-Up_Assets_inner">
                                                    
                                                    <div className="ESAI_data row">
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                Website Development

                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                Structure with limited liability, suitable for startups and medium to large businesses.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                App Design & Development

                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                Hybrid structure offering limited liability and flexibility for small to medium businesses.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                Web Application Development
                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                    Application for Issue of Phytosanitary Certificate for Export of Agriculture Commodit...
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                Software Development

                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                Single-owner company with limited liability, ideal for solo entrepreneurs.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                E-Commerce Website


                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                Large entity raising capital through public shares, suitable for large-scale businesses.

                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                Product Development


                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                NBFC promoting savings and lending among members, with limited liability.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                CRM Development
                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                Simple structure with complete control, ideal for individual-owned businesses.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="tab-pane container fade" id="DigitalMarketing">...</div>
                                            <div class="tab-pane container fade" id="ISO">...</div>
                                        </div>
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


export default EmployeeAssets