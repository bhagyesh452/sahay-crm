import React from "react";
import Header from "./Header";
import Navbar from "./Navbar";

function BookingList() {
  return (
    <div>
      <Header />
      <Navbar />
      <div className="booking-list-main">
        <div className="booking_list_Filter">
          <div className="container-xl">
            <div className="row justify-content-between">
              <div className="col-2">
                <div class="my-2 my-md-0 flex-grow-1 flex-md-grow-0 order-first order-md-last">
                  <div class="input-icon">
                    <span class="input-icon-addon">
                      <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
                        <path d="M21 21l-6 -6"></path>
                      </svg>
                    </span>
                    <input type="text"  class="form-control" placeholder="Search…" aria-label="Search in website"/>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="d-flex justify-content-end" >
                    <button className="btn btn-primary mr-1">Import CSV</button>
                    <button className="btn btn-primary mr-1">Export CSV</button>
                    <button className="btn btn-primary">Add Booking</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container-xl">
          <div className="booking_list_Dtl_box">
            <div className="row m-0">
              <div className="col-4 p-0">
                <div className="booking-list-card">
                  <div className="booking-list-heading">
                    <div className="d-flex justify-content-between">
                      <div className="b_dtl_C_name">
                        Booking List
                      </div>
                    </div>
                  </div>  
                  <div className="booking-list-body">
                    <div className="bookings_Company_Name ">
                      <div className="d-flex justify-content-between align-items-center">
                          <div className="b_cmpny_name cName-text-wrap">
                              SEAVY CORP SOLUTIONS (OPC) PRIVATE LIMITE
                          </div>
                          <div className="b_cmpny_time">
                              10:00 AM
                          </div>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mt-2">
                          <div className="b_Services_name d-flex">
                            <div className="sname">
                              Seed Fund
                            </div>
                            <div className="amount">
                              ₹ 25000/-
                            </div>
                          </div>
                          <div className="b_BDE_name">
                              Vaibhav Acharya
                          </div>
                      </div>
                    </div>
                    <div className="bookings_Company_Name">
                      <div className="d-flex justify-content-between align-items-center">
                          <div className="b_cmpny_name cName-text-wrap">
                            Incscale Technologies Private Limited
                          </div>
                          <div className="b_cmpny_time">
                              10:00 AM
                          </div>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mt-2">
                          <div className="b_Services_name d-flex">
                            <div className="sname">
                              Seed Fund, Startup Certificate 
                            </div>
                            <div className="amount">
                              ₹ 25000/-
                            </div>
                          </div>
                          <div className="b_BDE_name">
                              Vaibhav Acharya
                          </div>
                      </div>
                    </div>
                    <div className="bookings_Company_Name activeBox">
                      <div className="d-flex justify-content-between align-items-center">
                          <div className="b_cmpny_name cName-text-wrap">
                              Start-Up Sahay Private Limited
                          </div>
                          <div className="b_cmpny_time">
                              10:00 AM
                          </div>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mt-2">
                          <div className="b_Services_name d-flex">
                            <div className="sname">
                              Seed Fund, Startup Certificate 
                            </div>
                            <div className="amount">
                              ₹ 25000/-
                            </div>
                          </div>
                          <div className="b_BDE_name">
                              Vaibhav Acharya
                          </div>
                      </div>
                    </div>
                    <div className="bookings_Company_Name">
                      <div className="d-flex justify-content-between align-items-center">
                          <div className="b_cmpny_name cName-text-wrap">
                          CENTAGON TECHNOLOGY INDIA PRIVATE LIMITED
                          </div>
                          <div className="b_cmpny_time">
                              10:00 AM
                          </div>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mt-2">
                          <div className="b_Services_name d-flex">
                            <div className="sname">
                              Startup Certificate 
                            </div>
                            <div className="amount">
                              ₹ 5000/-
                            </div>
                          </div>
                          <div className="b_BDE_name">
                              Vaibhav Acharya
                          </div>
                      </div>
                    </div>
                    <div className="bookings_Company_Name">
                      <div className="d-flex justify-content-between align-items-center">
                          <div className="b_cmpny_name cName-text-wrap">
                          YANTRIKI BHARAT PRIVATE LIMITED
                          </div>
                          <div className="b_cmpny_time">
                              10:00 AM
                          </div>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mt-2">
                          <div className="b_Services_name d-flex">
                            <div className="sname">
                              Seed Fund
                            </div>
                            <div className="amount">
                              ₹ 25000/-
                            </div>
                          </div>
                          <div className="b_BDE_name">
                              Vaibhav Acharya
                          </div>
                      </div>
                    </div>
                    <div className="bookings_Company_Name">
                      <div className="d-flex justify-content-between align-items-center">
                          <div className="b_cmpny_name cName-text-wrap">
                          RYAL JADIBOOTI BY BHARAT PRIVATE LIMITED
                          </div>
                          <div className="b_cmpny_time">
                              10:00 AM
                          </div>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mt-2">
                          <div className="b_Services_name d-flex">
                            <div className="sname">
                             Startup Certificate 
                            </div>
                            <div className="amount">
                              ₹ 25000/-
                            </div>
                          </div>
                          <div className="b_BDE_name">
                              Vaibhav Acharya
                          </div>
                      </div>
                    </div>
                    <div className="bookings_Company_Name">
                      <div className="d-flex justify-content-between align-items-center">
                          <div className="b_cmpny_name cName-text-wrap">
                          ASHA SNR CONFECTIONERY PRIVATE LIMITED
                          </div>
                          <div className="b_cmpny_time">
                              10:00 AM
                          </div>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mt-2">
                          <div className="b_Services_name d-flex">
                            <div className="sname">
                              Website
                            </div>
                            <div className="amount">
                              ₹ 15000/-
                            </div>
                          </div>
                          <div className="b_BDE_name">
                              Vaibhav Acharya
                          </div>
                      </div>
                    </div>
                    <div className="bookings_Company_Name">
                      <div className="d-flex justify-content-between align-items-center">
                          <div className="b_cmpny_name cName-text-wrap">
                          JAYMAHABALI FARMER PRODUCER COMPANY LIMITED
                          </div>
                          <div className="b_cmpny_time">
                              10:00 AM
                          </div>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mt-2">
                          <div className="b_Services_name d-flex">
                            <div className="sname">
                              ISO Certificate  
                            </div>
                            <div className="amount">
                              ₹ 2000/-
                            </div>
                          </div>
                          <div className="b_BDE_name">
                              Vaibhav Acharya
                          </div>
                      </div>
                    </div>
                    <div className="bookings_Company_Name">
                      <div className="d-flex justify-content-between align-items-center">
                          <div className="b_cmpny_name cName-text-wrap">
                          DORICS ARTIFICE PRIVATE LIMITED
                          </div>
                          <div className="b_cmpny_time">
                              10:00 AM
                          </div>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mt-2">
                          <div className="b_Services_name d-flex">
                            <div className="sname">
                              Seed Fund, Startup Certificate 
                            </div>
                            <div className="amount">
                              ₹ 25000/-
                            </div>
                          </div>
                          <div className="b_BDE_name">
                              Vaibhav Acharya
                          </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-8 p-0">
                <div className="booking-deatils-card">
                  <div className="booking-deatils-heading">
                    <div className="d-flex justify-content-between">
                      <div className="b_dtl_C_name">
                        Start-Up Sahay Private Limited
                      </div>
                    </div>
                  </div>  
                  <div className="booking-deatils-body">
                    <div className="my-card mt-2">
                      <div className="my-card-head">
                        Basic Informations:
                      </div>   
                      <div className="my-card-body">
                        <div className="row m-0 bdr-btm-eee">
                          <div className="col-sm-6 p-0">
                            <div class="row m-0">
                              <div class="col-sm-4 p-0">
                                  <div class="booking_inner_dtl_h">Email Address</div>
                              </div>
                              <div class="col-sm-6 p-0">
                                  <div class="booking_inner_dtl_b bdr-left-eee">info@startupsahay.in</div>
                              </div>
                            </div>
                          </div>
                          <div className="col-sm-6 p-0">
                            <div class="row m-0">
                              <div class="col-sm-4 p-0">
                                  <div class="booking_inner_dtl_h bdr-left-eee">Phone No</div>
                              </div>
                              <div class="col-sm-6 p-0">
                                  <div class="booking_inner_dtl_b bdr-left-eee">9924283530</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row m-0 bdr-btm-eee">
                          <div className="col-sm-4 p-0">
                            <div class="row m-0">
                              <div class="col-sm-6 p-0">
                                  <div class="booking_inner_dtl_h">Incorporation date</div>
                              </div>
                              <div class="col-sm-6 p-0">
                                  <div class="booking_inner_dtl_b bdr-left-eee">20 Jun 2024</div>
                              </div>
                            </div>
                          </div>
                          <div className="col-sm-4">
                            <div class="row m-0">
                              <div class="col-sm-5 p-0">
                                  <div class="booking_inner_dtl_h bdr-left-eee">Company's PAN:</div>
                              </div>
                              <div class="col-sm-7 p-0">
                                  <div class="booking_inner_dtl_b bdr-left-eee">DLGPP5927K</div>
                              </div>
                            </div>
                          </div>
                          <div className="col-sm-4">
                            <div class="row m-0">
                              <div class="col-sm-5 p-0">
                                  <div class="booking_inner_dtl_h bdr-left-eee">Company's GST:</div>
                              </div>
                              <div class="col-sm-7 p-0">
                                  <div class="booking_inner_dtl_b bdr-left-eee">256336111111</div>
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
        </div>
      </div>
    </div>
  );
}

export default BookingList;
