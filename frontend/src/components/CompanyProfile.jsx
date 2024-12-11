import React from 'react';
import CmpnyPHlogo from "../static/sahayion.png";
import { GoHistory } from "react-icons/go";
import { MdDriveFileMoveOutline } from "react-icons/md";
import { IoPersonCircleOutline } from "react-icons/io5";



function CompanyProfile() {
  return (
    <div className='CompanyProfileMain'>
      <div className="container-xl">
        <div className='CompanyProfileHead'>
          <div className='d-flex align-items-center'> 
            <div className='Cmpny-pH-logo'>
              <img src={CmpnyPHlogo}/>
            </div>
            <div className='Cmpny-pH-Details'>
              <h3 className='m-0'>START-UP SAHAY PRIVATE LIMITED</h3>
              <div className='d-flex align-items-center'>
                <div className='CPH_subdtl'>
                  <p className='m-0'>Total Booking : <span>0</span></p>
                </div>
                <div className='CPH_subdtl'>
                  <p className='m-0'>Recent BDM : <span>Vishnu Desai</span></p>
                </div>
                <div className='CPH_subdtl'>
                  <div className='d-flex'>
                    <p className='m-0 mr-1' style={{lineHeight:'11px'}}><span><GoHistory /></span></p>
                    <p className='m-0 ms-1'>Call History</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='CompanyProfilebody'>
          <div className='row'>
            <div className='col-lg-3 col-md-4'>
              <div className="accordion CompanyProfileAccordi" id="accordionPanelsStayOpenExample">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="panelsStayOpen-headingOne">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                      Company Details 
                    </button>
                  </h2>
                  <div id="panelsStayOpen-collapseOne" class="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingOne">
                    <div className="accordion-body">
                      <div className='CPaccordi_Dtl_inner'>
                        <div className='row align-items-center'>
                          <div className='col-4'>
                            <div className='CPaccordi_Dtl_inner_left'>
                              Company Email
                            </div>
                          </div>
                          <div className='col-8'>
                            <div className='CPaccordi_Dtl_inner_right'>
                              info@startupsahay.com
                            </div>
                          </div>
                        </div>
                        <div className='row align-items-center mt-2'>
                          <div className='col-4'>
                            <div className='CPaccordi_Dtl_inner_left'>
                              Phone No
                            </div>
                          </div>
                          <div className='col-8'>
                            <div className='CPaccordi_Dtl_inner_right'>
                              9924283502
                            </div>
                          </div>
                        </div>
                        <div className='row align-items-center mt-2'>
                          <div className='col-4'>
                            <div className='CPaccordi_Dtl_inner_left'>
                              CIN No
                            </div>
                          </div>
                          <div className='col-8'>
                            <div className='CPaccordi_Dtl_inner_right'>
                              U62091HR2024PTC118906 
                            </div>
                          </div>
                        </div>
                        <div className='row align-items-center mt-2'>
                          <div className='col-4'>
                            <div className='CPaccordi_Dtl_inner_left'>
                              Inco. Date
                            </div>
                          </div>
                          <div className='col-8'>
                            <div className='CPaccordi_Dtl_inner_right'>
                              20 Jun 2024
                            </div>
                          </div>
                        </div>
                        <div className='row align-items-center mt-2'>
                          <div className='col-4'>
                            <div className='CPaccordi_Dtl_inner_left'>
                              Company Age
                            </div>
                          </div>
                          <div className='col-8'>
                            <div className='CPaccordi_Dtl_inner_right'>
                              9 months & 14 days
                            </div>
                          </div>
                        </div>
                        <div className='row align-items-center mt-2'>
                          <div className='col-4'>
                            <div className='CPaccordi_Dtl_inner_left'>
                              PAN
                            </div>
                          </div>
                          <div className='col-8'>
                            <div className='CPaccordi_Dtl_inner_right'>
                              DLHPP569K
                            </div>
                          </div>
                        </div>
                        <div className='row align-items-top mt-2'>
                          <div className='col-4'>
                            <div className='CPaccordi_Dtl_inner_left'>
                              Address
                            </div>
                          </div>
                          <div className='col-8'>
                            <div className='CPaccordi_Dtl_inner_right'>
                              House No. 337, Kharan Street, Parkash Chowk, Yamuna Nagar, Ambala, Haryana, India, 135003
                              click Here For All The Companies At 135003.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="panelsStayOpen-headingTwo">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false" aria-controls="panelsStayOpen-collapseTwo">
                      Director's Details
                    </button>
                  </h2>
                  <div id="panelsStayOpen-collapseTwo" className="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
                    <div className="accordion-body">
                     
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-lg-6 col-md-8'>
              <div className='cmpnyP_nav_main'>
                <ul className="nav nav-tabs cmpnyP_nav_tabs" id="Cmpny_P_Main_tab" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button className="nav-link active" id="History-tab" data-bs-toggle="tab" data-bs-target="#Overview" type="button" role="tab" aria-controls="Overview" aria-selected="true">
                      Overview
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className="nav-link" id="Activity-tab" data-bs-toggle="tab" data-bs-target="#Activity" type="button" role="tab" aria-controls="Activity" aria-selected="false">
                      Activity
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className="nav-link" id="History-tab" data-bs-toggle="tab" data-bs-target="#History" type="button" role="tab" aria-controls="History" aria-selected="false">
                      History
                    </button>
                  </li>
                </ul>
                <div className="tab-content cmpnyP_tab_content" id="myTabCmpny_P_Main_tab">
                  <div className="tab-pane fade show active" id="Overview" role="tabpanel" aria-labelledby="History-tab">
                    <div className='d-flex align-items-center justify-content-between mt-2'>
                      <div className='d-flex align-items-center'> 
                        <button className='btn btn-sm Overoviewbkngbtn active mr-1'>Booking 1</button>
                        <button className='btn btn-sm Overoviewbkngbtn mr-1'>Booking 2</button>
                      </div>
                      <div className='rm_bkng_item_no nav-link clr-ff8800'>
                        <span style={{marginRight:'2px', color:'#797373'}}>Publish On : </span>October 24, 2024 at 11:34 am
                      </div>
                    </div>
                    <div className='Overview_Main'>
                      <div className='mb-2 mul-booking-card-inner-head d-flex justify-content-between'>
                        <b>Booking Details:</b>
                      </div>
                      <div className='my-card'>
                        <div className='my-card-body'>
                          <div className='row m-0 bdr-btm-eee'>
                            <div className='col-lg-4 col-sm-6 p-0'>
                              <div className='row m-0'>
                                <div className='col-sm-4 align-self-stretch p-0'>
                                  <div className='booking_inner_dtl_h h-100'>
                                    BDE Name
                                  </div>
                                </div>
                                <div className='col-sm-8 align-self-stretch p-0'>
                                  <div className='booking_inner_dtl_b h-100 bdr-left-eee'>
                                    Mansi Kalal
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className='col-lg-4 col-sm-6 p-0'>
                              <div className='row m-0'>
                                <div className='col-sm-4 align-self-stretch p-0'>
                                  <div className='booking_inner_dtl_h h-100 bdr-left-eee'>
                                    BDE Email
                                  </div>
                                </div>
                                <div className='col-sm-8 align-self-stretch p-0'>
                                  <div className='booking_inner_dtl_b h-100 bdr-left-eee'>
                                    Mansi@startupsahay.com
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className='col-lg-4 col-sm-6 p-0'>
                              <div className='row m-0'>
                                <div className='col-sm-4 align-self-stretch p-0'>
                                  <div className='booking_inner_dtl_h h-100 bdr-left-eee'>
                                    BDM Name
                                  </div>
                                </div>
                                <div className='col-sm-8 align-self-stretch p-0'>
                                  <div className='booking_inner_dtl_b h-100 bdr-left-eee'>
                                    Mansi Kalal
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className='row m-0 bdr-btm-eee'>
                            <div className='col-lg-4 col-sm-6 p-0'>
                              <div className='row m-0'>
                                <div className='col-sm-4 align-self-stretch p-0'>
                                  <div className='booking_inner_dtl_h h-100'>
                                    BDM Email
                                  </div>
                                </div>
                                <div className='col-sm-8 align-self-stretch p-0'>
                                  <div className='booking_inner_dtl_b h-100 bdr-left-eee'>
                                    Mansi@startupsahay.com
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className='col-lg-4 col-sm-6 p-0'>
                              <div className='row m-0'>
                                <div className='col-sm-6 align-self-stretch p-0'>
                                  <div className='booking_inner_dtl_h h-100 bdr-left-eee'>
                                    Booking Date 
                                  </div>
                                </div>
                                <div className='col-sm-6 align-self-stretch p-0'>
                                  <div className='booking_inner_dtl_b h-100 bdr-left-eee'>
                                   12 Jun 2022
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className='col-lg-4 col-sm-6 p-0'>
                              <div className='row m-0'>
                                <div className='col-sm-5 align-self-stretch p-0'>
                                  <div className='booking_inner_dtl_h h-100 bdr-left-eee'>
                                    Lead Source
                                  </div>
                                </div>
                                <div className='col-sm-6 align-self-stretch p-0'>
                                  <div className='booking_inner_dtl_b h-100 bdr-left-eee'>
                                    CRM Data
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='mb-2 mt-3 mul-booking-card-inner-head'>
                        <b>Services And Payment Details:</b>
                      </div>
                      <div className='my-card'>
                        <div className='my-card-body'>
                          <div className='row m-0 bdr-btm-eee'>
                            <div className='col-lg-6 col-sm-12 p-0'>
                              <div className='row m-0'>
                                <div className='col-sm-4 align-self-stretch p-0'>
                                  <div className='booking_inner_dtl_h h-100'>
                                    No. Of Services
                                  </div>
                                </div>
                                <div className='col-sm-8 align-self-stretch p-0'>
                                  <div className='booking_inner_dtl_b h-100 bdr-left-eee'>
                                    1
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='my-card mt-1'>
                        <div className='my-card-body'>
                          <div className='row m-0 bdr-btm-eee'>
                            <div className='col-lg-6 col-sm-6 p-0'>
                              <div className='row m-0'>
                                <div className='col-sm-4 align-self-stretch p-0'>
                                  <div className='booking_inner_dtl_h h-100'>
                                    1st Services Name
                                  </div>
                                </div>
                                <div className='col-sm-8 align-self-stretch p-0'>
                                  <div className='booking_inner_dtl_b bdr-left-eee h-100 services-name'>
                                    Start-Up India Certificate With DSC
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className='col-lg-6 col-sm-6 p-0'>
                              <div className='row m-0'>
                                <div className='col-sm-4 align-self-stretch p-0'>
                                  <div className='booking_inner_dtl_h h-100 bdr-left-eee'>
                                    Total Amount
                                  </div>
                                </div>
                                <div className='col-sm-8 align-self-stretch p-0'>
                                  <div className='booking_inner_dtl_b h-100 bdr-left-eee'>
                                    <div className='d-flex align-items-center justify-content-between'>
                                      ₹ 7,080 (With GST)
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className='row m-0 bdr-btm-eee'>
                            <div className='col-lg-6 col-sm-5 p-0'>
                              <div className='row m-0'>
                                <div className='col-sm-4 align-self-stretch p-0'>
                                  <div className='booking_inner_dtl_h h-100'>
                                    Payment Terms
                                  </div>
                                </div>
                                <div className='col-sm-8 align-self-stretch p-0'>
                                  <div className='booking_inner_dtl_b bdr-left-eee h-100'>
                                    Full Advanced
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className='col-lg-6 col-sm-5 p-0'>
                              <div className='row m-0'>
                                <div className='col-sm-3 align-self-stretch p-0'>
                                  <div className='booking_inner_dtl_h h-100 bdr-left-eee'>
                                    Notes
                                  </div>
                                </div>
                                <div className='col-sm-9 align-self-stretch p-0'>
                                  <div className='booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap'>
                                    N/A
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className='row m-0 bdr-btm-eee'>
                            <div className='col-lg-6 col-sm-6 p-0'>
                              <div className='row m-0'>
                                <div className='col-sm-4 align-self-stretch p-0'>
                                  <div className='booking_inner_dtl_h h-100'>
                                    Expense
                                  </div>
                                </div>
                                <div className='col-sm-8 align-self-stretch p-0'>
                                  <div className='booking_inner_dtl_b bdr-left-eee h-100'>
                                    - ₹ 1,500
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className='col-lg-6 col-sm-6 p-0'>
                              <div className='row m-0'>
                                <div className='col-sm-4 align-self-stretch p-0'>
                                  <div className='booking_inner_dtl_h h-100 bdr-left-eee'>
                                     Expense Date
                                  </div>
                                </div>
                                <div className='col-sm-8 align-self-stretch p-0'>
                                  <div className='booking_inner_dtl_b h-100 bdr-left-eee'>
                                    <div className='d-flex align-items-center justify-content-between'>
                                      March 7, 2024
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className='row m-0 bdr-btm-eee'>
                            <div className='col-lg-6 col-sm-6 p-0'>
                              <div className='row m-0'>
                                <div className='col-sm-4 align-self-stretch p-0'>
                                  <div className='booking_inner_dtl_h h-100'>
                                    1<sup>st</sup> Payment
                                  </div>
                                </div>
                                <div className='col-sm-8 align-self-stretch p-0'>
                                  <div className='booking_inner_dtl_b bdr-left-eee h-100'>
                                      First payment
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className='col-lg-6 col-sm-6 p-0'>
                              <div className='row m-0'>
                                <div className='col-sm-4 align-self-stretch p-0'>
                                  <div className='booking_inner_dtl_h h-100 bdr-left-eee'>
                                       2<sup>nd</sup> Payment
                                  </div>
                                </div>
                                <div className='col-sm-8 align-self-stretch p-0'>
                                  <div className='booking_inner_dtl_b h-100 bdr-left-eee'>
                                    <div className='d-flex align-items-center justify-content-between'>
                                      ₹3,540(AFTER CERTIFICATE)
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className='row m-0 bdr-btm-eee'>
                            <div className='col-lg-6 col-sm-6 p-0'>
                              <div className='row m-0'>
                                <div className='col-sm-4 align-self-stretch p-0'>
                                  <div className='booking_inner_dtl_h h-100'>
                                    3<sup>rd</sup> Payment
                                  </div>
                                </div>
                                <div className='col-sm-8 align-self-stretch p-0'>
                                  <div className='booking_inner_dtl_b bdr-left-eee h-100'>
                                      0
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className='col-lg-6 col-sm-6 p-0'>
                              <div className='row m-0'>
                                <div className='col-sm-4 align-self-stretch p-0'>
                                  <div className='booking_inner_dtl_h h-100 bdr-left-eee'>
                                       4<sup>th</sup> Payment
                                  </div>
                                </div>
                                <div className='col-sm-8 align-self-stretch p-0'>
                                  <div className='booking_inner_dtl_b h-100 bdr-left-eee'>
                                    <div className='d-flex align-items-center justify-content-between'>
                                      0
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Remaining */}
                        <div className='my-card-body accordion' id='accordionExample0'>
                          <div className='accordion-item bdr-none'>
                            <div className='pr-10 accordion-header' id='headingOne0'>
                              <div className="row m-0 bdr-btm-eee accordion-button p-0" data-bs-toggle="collapse" data-bs-target="#collapseOne0" aria-expanded="true" aria-controls="collapseOne0">
                                <div className="w-95 p-0">
                                  <div className="booking_inner_dtl_h h-100">
                                    <div>Remaining Payment </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div id="collapseOne0" className="accordion-collapse collapse show" aria-labelledby="headingOne0" data-bs-parent="#accordionExample">
                              <div className="accordion-body bdr-none p-0">
                                   <div>
                                    <div className="row m-0 bdr-btm-eee bdr-top-eee">
                                        <div className="col-lg-12 col-sm-6 p-0 align-self-stretc bg-fffafa">
                                          <div className="booking_inner_dtl_h h-100 d-flex align-items-center justify-content-between">
                                              <div>Second Remaining Payment</div>
                                              <div>(August 13, 2024)</div>
                                          </div>
                                        </div>
                                    </div>
                                    <div className="row m-0 bdr-btm-eee">
                                        <div className="col-lg-3 col-sm-6 p-0 align-self-stretc">
                                          <div className="row m-0 h-100">
                                              <div className="col-sm-5 align-self-stretc p-0">
                                                <div className="booking_inner_dtl_h h-100">Amount</div>
                                              </div>
                                              <div className="col-sm-7 align-self-stretc p-0">
                                                <div className="booking_inner_dtl_b bdr-left-eee h-100">₹ 3,540</div>
                                              </div>
                                          </div>
                                        </div>
                                        <div className="col-lg-3 col-sm-6 p-0 align-self-stretc">
                                          <div className="row m-0 h-100">
                                              <div className="col-sm-5 align-self-stretc p-0">
                                                <div className="booking_inner_dtl_h bdr-left-eee h-100">Pending</div>
                                              </div>
                                              <div className="col-sm-7 align-self-stretc p-0">
                                                <div className="booking_inner_dtl_b bdr-left-eee h-100">₹ 0</div>
                                              </div>
                                          </div>
                                        </div>
                                        <div className="col-lg-6 col-sm-6 p-0 align-self-stretc">
                                          <div className="row m-0 h-100">
                                              <div className="col-sm-5 align-self-stretc p-0">
                                                <div className="booking_inner_dtl_h h-100 bdr-left-eee">Payment Date</div>
                                              </div>
                                              <div className="col-sm-7 align-self-stretc p-0">
                                                <div className="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap">August 13, 2024</div>
                                              </div>
                                          </div>
                                        </div>
                                    </div>
                                    <div className="row m-0 bdr-btm-eee">
                                        <div className="col-lg-6 col-sm-6 p-0 align-self-stretc">
                                          <div className="row m-0 h-100">
                                              <div className="col-sm-5 align-self-stretc p-0">
                                                <div className="booking_inner_dtl_h h-100">Payment Method</div>
                                              </div>
                                              <div className="col-sm-7 align-self-stretc p-0">
                                                <div className="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap" title="Other">Other</div>
                                              </div>
                                          </div>
                                        </div>
                                        <div className="col-lg-6 col-sm-4 p-0 align-self-stretc">
                                          <div className="row m-0 h-100">
                                              <div className="col-sm-4 align-self-stretc p-0">
                                                <div className="booking_inner_dtl_h h-100 bdr-left-eee">Extra Remarks</div>
                                              </div>
                                              <div className="col-sm-8 align-self-stretc p-0">
                                                <div className="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap" title="Remaining payment received in IDFC/SSC but considered as a GST payment.">Remaining payment received in IDFC/SSC but considered as a GST payment.</div>
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
                      <div className="my-card mt-1">
                        <div className="my-card-body">
                            <div className="row m-0 bdr-btm-eee">
                              <div className="col-lg-12 col-sm-6 p-0">
                                  <div className="row m-0">
                                    <div className="col-sm-2 align-self-stretc p-0">
                                        <div className="booking_inner_dtl_h h-100">CA Case</div>
                                    </div>
                                    <div className="col-sm-10 align-self-stretc p-0">
                                        <div className="booking_inner_dtl_b h-100 bdr-left-eee">No</div>
                                    </div>
                                  </div>
                              </div>
                            </div>
                        </div>
                      </div>
                      <div className='mb-2 mt-3 mul-booking-card-inner-head'>
                        <b>Payment Summary:</b>
                      </div>
                      <div className="my-card">
                        <div className="my-card-body">
                            <div className="row m-0 bdr-btm-eee">
                              <div className="col-lg-4 col-sm-6 p-0 align-self-stretch">
                                  <div className="row m-0 h-100">
                                    <div className="col-sm-5 align-self-stretch p-0">
                                        <div className="booking_inner_dtl_h bdr-left-eee h-100">Total Amount</div>
                                    </div>
                                    <div className="col-sm-7 align-self-stretch p-0">
                                        <div className="booking_inner_dtl_b h-100 bdr-left-eee">₹ 9,440</div>
                                    </div>
                                  </div>
                              </div>
                              <div className="col-lg-4 col-sm-6 p-0 align-self-stretch">
                                  <div className="row m-0 h-100">
                                    <div className="col-sm-6 align-self-stretch p-0">
                                        <div className="booking_inner_dtl_h bdr-left-eee h-100">Received Amount</div>
                                    </div>
                                    <div className="col-sm-6 align-self-stretch p-0">
                                        <div className="booking_inner_dtl_b bdr-left-eee h-100">₹ 9,440</div>
                                    </div>
                                  </div>
                              </div>
                              <div className="col-lg-4 col-sm-5 p-0 align-self-stretch">
                                  <div className="row m-0 h-100">
                                    <div className="col-sm-6 align-self-stretch p-0">
                                        <div className="booking_inner_dtl_h bdr-left-eee h-100">Pending Amount</div>
                                    </div>
                                    <div className="col-sm-6 align-self-stretch p-0">
                                        <div className="booking_inner_dtl_b bdr-left-eee h-100">₹ 0</div>
                                    </div>
                                  </div>
                              </div>
                            </div>
                            <div className="row m-0 bdr-btm-eee">
                              <div className="col-lg-6 col-sm-6 p-0 align-self-stretch">
                                  <div className="row m-0 h-100">
                                    <div className="col-sm-4 align-self-stretch p-0">
                                        <div className="booking_inner_dtl_h h-100 ">Payment Method</div>
                                    </div>
                                    <div className="col-sm-8 align-self-stretch p-0">
                                        <div className="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap" title="ICICI Bank">ICICI Bank</div>
                                    </div>
                                  </div>
                              </div>
                              <div className="col-lg-6 col-sm-6 p-0 align-self-stretch">
                                  <div className="row m-0 h-100">
                                    <div className="col-sm-4 align-self-stretch p-0">
                                        <div className="booking_inner_dtl_h h-100 bdr-left-eee">Extra Remarks</div>
                                    </div>
                                    <div className="col-sm-8 align-self-stretch p-0">
                                        <div className="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap" title="undefined">undefined</div>
                                    </div>
                                  </div>
                              </div>
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane fade" id="Activity" role="tabpanel" aria-labelledby="Activity-tab">...</div>
                  <div className="tab-pane fade" id="History" role="tabpanel" aria-labelledby="History-tab">
                    <div className='History_Timeline_Main'>
                      <div className='History_Timeline'>
                        <div className='History_Timeline_item'>
                          <div className='d-flex align-items-start'>
                            <div className='History_Timeline_item_l'>
                              <MdDriveFileMoveOutline />
                            </div>
                            <div className='History_Timeline_item_r'>
                              <div className='d-flex align-items-center justify-content-between'>
                                <div className='Timeline_item_main_sentance'>
                                  <p className='m-0'>Lead Assign To <b>Ravi Prajapati</b></p>
                                </div>  
                                <div className='Timeline_item_main_date'>
                                  <p className='m-0'>2nd Jun 2024</p>
                                </div>
                              </div>
                              <div className='d-flex align-items-center mt-1'>
                                <div className='per-icon'>
                                  <IoPersonCircleOutline />
                                </div> 
                                <div className='per-name'>
                                  Assign By : Nimesh Parekh
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='History_Timeline_item'>
                          <div className='d-flex align-items-start'>
                            <div className='History_Timeline_item_l'>
                              <MdDriveFileMoveOutline />
                            </div>
                            <div className='History_Timeline_item_r'>
                              <div className='d-flex align-items-center justify-content-between'>
                                <div className='Timeline_item_main_sentance'>
                                  <p className='m-0'><b>Ravi Prajapati</b> Forwarded this Lead to BDM</p>
                                </div>  
                                <div className='Timeline_item_main_date'>
                                  <p className='m-0'>5th Jun 2024</p>
                                </div>
                              </div>
                              <div className='d-flex align-items-center mt-1'>
                                <div className='per-icon'>
                                  <IoPersonCircleOutline />
                                </div> 
                                <div className='per-name'>
                                  BDM : Vishal Gohel
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='History_Timeline_item'>
                          <div className='d-flex align-items-start'>
                            <div className='History_Timeline_item_l'>
                              <MdDriveFileMoveOutline />
                            </div>
                            <div className='History_Timeline_item_r'>
                              <div className='d-flex align-items-center justify-content-between'>
                                <div className='Timeline_item_main_sentance'>
                                  <p className='m-0'><b>Data Analyst</b> Take Back this lead form <b>Ravi Prajapati</b></p>
                                </div>  
                                <div className='Timeline_item_main_date'>
                                  <p className='m-0'>7th Jun 2024</p>
                                </div>
                              </div>
                              <div className='d-flex align-items-center mt-1'>
                                <div className='per-icon'>
                                  <IoPersonCircleOutline />
                                </div> 
                                <div className='per-name'>
                                  Data Analyst : Pavan Bhai   
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='History_Timeline_item'>
                          <div className='d-flex align-items-start'>
                            <div className='History_Timeline_item_l'>
                              <MdDriveFileMoveOutline />
                            </div>
                            <div className='History_Timeline_item_r'>
                              <div className='d-flex align-items-center justify-content-between'>
                                <div className='Timeline_item_main_sentance'>
                                  <p className='m-0'>Lead Assign To <b>Khushi Gandhi</b></p>
                                </div>  
                                <div className='Timeline_item_main_date'>
                                  <p className='m-0'>8th Jun 2024</p>
                                </div>
                              </div>
                              <div className='d-flex align-items-center mt-1'>
                                <div className='per-icon'>
                                  <IoPersonCircleOutline />
                                </div> 
                                <div className='per-name'>
                                  Assign By : Pavan Bhai 
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='History_Timeline_item'>
                          <div className='d-flex align-items-start'>
                            <div className='History_Timeline_item_l'>
                              <MdDriveFileMoveOutline />
                            </div>
                            <div className='History_Timeline_item_r'>
                              <div className='d-flex align-items-center justify-content-between'>
                                <div className='Timeline_item_main_sentance'>
                                  <p className='m-0'>Lead Move in Interested Section By BDE</p>
                                </div>  
                                <div className='Timeline_item_main_date'>
                                  <p className='m-0'>8th Jun 2024</p>
                                </div>
                              </div>
                              <div className='d-flex align-items-center mt-1'>
                                <div className='per-icon'>
                                  <IoPersonCircleOutline />
                                </div> 
                                <div className='per-name'>
                                  BDE : Khushi Gandhi
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='History_Timeline_item'>
                          <div className='d-flex align-items-start'>
                            <div className='History_Timeline_item_l'>
                              <MdDriveFileMoveOutline />
                            </div>
                            <div className='History_Timeline_item_r'>
                              <div className='d-flex align-items-center justify-content-between'>
                                <div className='Timeline_item_main_sentance'>
                                  <p className='m-0'>Add Booking By BDE</p>
                                </div>  
                                <div className='Timeline_item_main_date'>
                                  <p className='m-0'>11th Jun 2024</p>
                                </div>
                              </div>
                              <div className='d-flex align-items-center mt-1'>
                                <div className='per-icon'>
                                  <IoPersonCircleOutline />
                                </div> 
                                <div className='per-name'>
                                  BDE : Khushi Gandhi
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='History_Timeline_item'>
                          <div className='d-flex align-items-start'>
                            <div className='History_Timeline_item_l'>
                              <MdDriveFileMoveOutline />
                            </div>
                            <div className='History_Timeline_item_r'>
                              <div className='d-flex align-items-center justify-content-between'>
                                <div className='Timeline_item_main_sentance'>
                                  <p className='m-0'>Greetings call done by RM</p>
                                </div>  
                                <div className='Timeline_item_main_date'>
                                  <p className='m-0'>11th Jun 2024</p>
                                </div>
                              </div>
                              <div className='d-flex align-items-center mt-1'>
                                <div className='per-icon'>
                                  <IoPersonCircleOutline />
                                </div> 
                                <div className='per-name'>
                                  RM : Aiditi Bhatiya
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
            </div>
            <div className='col-lg-3 col-md-4'>
              <div className='cmpny-docs-card'>
                <div className='cmpny-docs-card-head'>
                  Documents
                </div>
                <div className='cmpny-docs-card-body'>
                  <div className='row'>
                    <div className='col-4'>
                      <div className='doc-inner-card'>
                        <div className='doc-inner-card-body'>
                          <img src={CmpnyPHlogo}></img>
                        </div>
                        <div className='doc-inner-card-footer'>
                          Startup.pdf
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
    </div>
  );
}

export default CompanyProfile;