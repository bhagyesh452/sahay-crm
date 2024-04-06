import React , {useState , useEffect} from "react";
import Header from "./Header";
import Navbar from "./Navbar";
import AdminBookingForm from "./AdminBookingForm";
import axios from 'axios'


function BookingList() {

  const [bookingFormOpen, setBookingFormOpen] = useState(false);
  const [currentDataLoading, setCurrentDataLoading] = useState(false)
  const [data , setData] = useState([])
  const [companyName , setCompanyName] = ("")
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  
  
  const fetchDatadebounce = async () => {
    try {
      // Set isLoading to true while fetching data
      //setIsLoading(true);
      //setCurrentDataLoading(true)

      const response = await axios.get(`${secretKey}/leads`);

      // Set the retrieved data in the state
      setData(response.data);
      //setmainData(response.data.filter((item) => item.ename === "Not Alloted"));

      // Set isLoading back to false after data is fetched
      //setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error.message);
      // Set isLoading back to false if an error occurs
      //setIsLoading(false);
    } finally {
      setCurrentDataLoading(false)
    }
  };
  
  console.log(data)


  useEffect(() => {
    // if (data.companyName) {
    //   console.log("Company Found");
      fetchDatadebounce();
    // } else {
    //   console.log("No Company Found");
    // }
  }, []);
 

 const functionOpenBookingForm =()=>{
  setBookingFormOpen(true)
  //setCompanyName(data.companyName)
 }





  return (
    <div>
      <Header />
      <Navbar />
     {!bookingFormOpen ? (<div className="booking-list-main">
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
                    <button className="btn btn-primary" onClick={()=>functionOpenBookingForm()}>Add Booking</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container-xl">
          <div className="booking_list_Dtl_box">
            <div className="row m-0">
              {/* --------booking list left Part---------*/}
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
              {/* --------booking Details Right Part---------*/}
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
                    {/* --------Basic Information Which is Common For all bookingdd  ---------*/}
                    <div className="my-card mt-2">
                      <div className="my-card-head">
                        Basic Informations:
                      </div>   
                      <div className="my-card-body">
                        <div className="row m-0 bdr-btm-eee">
                          <div className="col-lg-5 col-sm-6 p-0">
                            <div class="row m-0">
                              <div class="col-sm-4 align-self-stretc p-0">
                                  <div class="booking_inner_dtl_h h-100">Company Name:</div>
                              </div>
                              <div class="col-sm-6 align-self-stretc p-0">
                                  <div class="booking_inner_dtl_b h-100 bdr-left-eee">Start-Up Sahay Private Limited</div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-4 col-sm-6 p-0">
                            <div class="row m-0">
                              <div class="col-sm-4 align-self-stretc p-0">
                                  <div class="booking_inner_dtl_h bdr-left-eee h-100">Email Address</div>
                              </div>
                              <div class="col-sm-6 align-self-stretc p-0">
                                  <div class="booking_inner_dtl_b bdr-left-eee h-100">info@startupsahay.in</div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-3 col-sm-6 p-0">
                            <div class="row m-0">
                              <div class="col-sm-4 align-self-stretc p-0">
                                  <div class="booking_inner_dtl_h bdr-left-eee h-100">Phone No</div>
                              </div>
                              <div class="col-sm-6 align-self-stretc p-0">
                                  <div class="booking_inner_dtl_b bdr-left-eee h-100">9924283530</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row m-0 bdr-btm-eee">
                          <div className="col-lg-4 col-sm-6 p-0">
                            <div class="row m-0">
                              <div class="col-sm-6 align-self-stretc p-0">
                                  <div class="booking_inner_dtl_h h-100">Incorporation date</div>
                              </div>
                              <div class="col-sm-6 align-self-stretc p-0">
                                  <div class="booking_inner_dtl_b h-100 bdr-left-eee">20 Jun 2024</div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-4 col-sm-6">
                            <div class="row m-0">
                              <div class="col-sm-5 align-self-stretc p-0">
                                  <div class="booking_inner_dtl_h bdr-left-eee h-100">Company's PAN:</div>
                              </div>
                              <div class="col-sm-7 align-self-stretc p-0">
                                  <div class="booking_inner_dtl_b bdr-left-eee h-100">DLGPP5927K</div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-4 col-sm-6">
                            <div class="row m-0">
                              <div class="col-sm-5 align-self-stretc p-0">
                                  <div class="booking_inner_dtl_h bdr-left-eee h-100">Company's GST:</div>
                              </div>
                              <div class="col-sm-7 align-self-stretc p-0">
                                  <div class="booking_inner_dtl_b bdr-left-eee h-100">256336111111</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>      
                    </div>
                    {/* --------If Multipal Booking (Bookign heading) ---------*/}
                    <div className="row align-items-center m-0 justify-content-between mb-1 mt-3">
                      <div className="mul_booking_heading col-6">
                        <b>Booking 1</b>
                      </div>
                      <div className="mul_booking_date col-6">
                          <b>1st jan 2024</b>
                      </div>
                    </div>
                    {/* -------- Booking Details ---------*/}
                    <div className="mul-booking-card mt-2">
                      {/* -------- Step 2 ---------*/}
                      <div className="mb-2 mul-booking-card-inner-head">
                          <b>Booking Details:</b>
                      </div>
                      <div className="my-card">
                        <div className="my-card-body">
                          <div className="row m-0 bdr-btm-eee">
                            <div className="col-lg-4 col-sm-6 p-0">
                              <div class="row m-0">
                                <div class="col-sm-4 align-self-stretc p-0">
                                    <div class="booking_inner_dtl_h h-100">BDE Name</div>
                                </div>
                                <div class="col-sm-8 align-self-stretc p-0">
                                    <div class="booking_inner_dtl_b h-100 bdr-left-eee">Nimesh parekh</div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-4 col-sm-6 p-0">
                              <div class="row m-0">
                                <div class="col-sm-4 align-self-stretc p-0">
                                    <div class="booking_inner_dtl_h bdr-left-eee h-100">BDE Email</div>
                                </div>
                                <div class="col-sm-8 align-self-stretc p-0">
                                    <div class="booking_inner_dtl_b bdr-left-eee h-100">info@startupsahay.in</div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-4 col-sm-6 p-0">
                              <div class="row m-0">
                                <div class="col-sm-4 align-self-stretc p-0">
                                    <div class="booking_inner_dtl_h bdr-left-eee h-100">BDM Name</div>
                                </div>
                                <div class="col-sm-8 align-self-stretc p-0">
                                    <div class="booking_inner_dtl_b bdr-left-eee h-100">Nimesh Parekh</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row m-0 bdr-btm-eee">
                            <div className="col-lg-4 col-sm-6 p-0">
                              <div class="row m-0">
                                <div class="col-sm-4 align-self-stretc p-0">
                                    <div class="booking_inner_dtl_h h-100">BDM Email</div>
                                </div>
                                <div class="col-sm-8 align-self-stretc p-0">
                                    <div class="booking_inner_dtl_b bdr-left-eee h-100">info@startupsahay.in</div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-4 col-sm-6 p-0">
                              <div class="row m-0">
                                <div class="col-sm-4 align-self-stretc p-0">
                                    <div class="booking_inner_dtl_h h-100 bdr-left-eee">Booking Date </div>
                                </div>
                                <div class="col-sm-8 align-self-stretc p-0">
                                    <div class="booking_inner_dtl_b h-100 bdr-left-eee">12 Jun 2024</div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-4 col-sm-6 p-0">
                              <div class="row m-0">
                                <div class="col-sm-4 align-self-stretc p-0">
                                    <div class="booking_inner_dtl_h bdr-left-eee h-100">Lead Source</div>
                                </div>
                                <div class="col-sm-8 align-self-stretc p-0">
                                    <div class="booking_inner_dtl_b bdr-left-eee h-100">CRM Data</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* -------- Step 3 ---------*/}
                      <div className="mb-2 mt-3 mul-booking-card-inner-head">
                          <b>Services And Payment Details:</b>
                      </div>
                      <div className="my-card">
                        <div className="my-card-body">
                          <div className="row m-0 bdr-btm-eee">
                            <div className="col-lg-6 col-sm-6 p-0">
                              <div class="row m-0">
                                <div class="col-sm-4 align-self-stretc p-0">
                                    <div class="booking_inner_dtl_h h-100">No. Of Services</div>
                                </div>
                                <div class="col-sm-8 align-self-stretc p-0">
                                    <div class="booking_inner_dtl_b h-100 bdr-left-eee">2</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="my-card mt-1">
                        <div className="my-card-body">
                          <div className="row m-0 bdr-btm-eee">
                            <div className="col-lg-6 col-sm-6 p-0">
                              <div class="row m-0">
                                <div class="col-sm-4 align-self-stretc p-0">
                                    <div class="booking_inner_dtl_h h-100">1st Services Name</div>
                                </div>
                                <div class="col-sm-8 align-self-stretc p-0">
                                    <div class="booking_inner_dtl_b bdr-left-eee h-100 services-name">Start Up certificate (With DSC)</div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6 col-sm-6 p-0">
                              <div class="row m-0">
                                <div class="col-sm-4 align-self-stretc p-0">
                                    <div class="booking_inner_dtl_h h-100 bdr-left-eee">Total Amount</div>
                                </div>
                                <div class="col-sm-8 align-self-stretc p-0">
                                    <div class="booking_inner_dtl_b h-100 bdr-left-eee">₹ 12000 /- (With GST)</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row m-0 bdr-btm-eee">
                            <div className="col-lg-6 col-sm-6 p-0">
                              <div class="row m-0">
                                <div class="col-sm-4 align-self-stretc p-0">
                                    <div class="booking_inner_dtl_h h-100">Payment Terms</div>
                                </div>
                                <div class="col-sm-8 align-self-stretc p-0">
                                    <div class="booking_inner_dtl_b bdr-left-eee h-100">Full Advance</div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6 col-sm-6 p-0">
                              <div class="row m-0">
                                <div class="col-sm-4 align-self-stretc p-0">
                                    <div class="booking_inner_dtl_h h-100 bdr-left-eee">Notes</div>
                                </div>
                                <div class="col-sm-8 align-self-stretc p-0">
                                    <div class="booking_inner_dtl_b h-100 bdr-left-eee">Work Complate Before 19th of Jun </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="my-card mt-1">
                        <div className="my-card-body">
                          <div className="row m-0 bdr-btm-eee">
                            <div className="col-lg-6 col-sm-6 p-0">
                              <div class="row m-0">
                                <div class="col-sm-4 align-self-stretc p-0">
                                    <div class="booking_inner_dtl_h h-100">2nd Services Name</div>
                                </div>
                                <div class="col-sm-8 align-self-stretc p-0">
                                    <div class="booking_inner_dtl_b bdr-left-eee h-100 services-name">Seed Fund Support</div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6 col-sm-6 p-0">
                              <div class="row m-0">
                                <div class="col-sm-4 align-self-stretc p-0">
                                    <div class="booking_inner_dtl_h h-100 bdr-left-eee">Total Amount</div>
                                </div>
                                <div class="col-sm-8 align-self-stretc p-0">
                                    <div class="booking_inner_dtl_b h-100 bdr-left-eee">₹ 22000 (With GST)</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row m-0 bdr-btm-eee">
                            <div className="col-lg-6 col-sm-6 p-0">
                              <div class="row m-0">
                                <div class="col-sm-4 align-self-stretc p-0">
                                    <div class="booking_inner_dtl_h h-100">Payment Terms</div>
                                </div>
                                <div class="col-sm-8 align-self-stretc p-0">
                                    <div class="booking_inner_dtl_b bdr-left-eee h-100">Part paymnet</div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6 col-sm-6 p-0">
                              <div class="row m-0">
                                <div class="col-sm-4 align-self-stretc p-0">
                                    <div class="booking_inner_dtl_h h-100 bdr-left-eee">Notes</div>
                                </div>
                                <div class="col-sm-8 align-self-stretc p-0">
                                    <div class="booking_inner_dtl_b h-100 bdr-left-eee">2nd Payment is aftre Docs</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row m-0 bdr-btm-eee">
                            <div className="col-lg-6 col-sm-6 p-0">
                              <div class="row m-0">
                                <div class="col-sm-4 align-self-stretc p-0">
                                    <div class="booking_inner_dtl_h h-100">First payment</div>
                                </div>
                                <div class="col-sm-8 align-self-stretc p-0">
                                    <div class="booking_inner_dtl_b bdr-left-eee h-100">₹ 11000</div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6 col-sm-6 p-0">
                              <div class="row m-0">
                                <div class="col-sm-4 align-self-stretc p-0">
                                    <div class="booking_inner_dtl_h h-100 bdr-left-eee">Second Paymnet</div>
                                </div>
                                <div class="col-sm-8 align-self-stretc p-0">
                                    <div class="booking_inner_dtl_b h-100 bdr-left-eee">₹ 11000 (Before Application)</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row m-0 bdr-btm-eee">
                            <div className="col-lg-6 col-sm-6 p-0">
                              <div class="row m-0">
                                <div class="col-sm-4 align-self-stretc p-0">
                                    <div class="booking_inner_dtl_h h-100">Third Paymnet</div>
                                </div>
                                <div class="col-sm-8 align-self-stretc p-0">
                                    <div class="booking_inner_dtl_b h-100 bdr-left-eee">₹ 11000 (Before Application)</div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6 col-sm-6 p-0">
                              <div class="row m-0">
                                <div class="col-sm-4 align-self-stretc p-0">
                                    <div class="booking_inner_dtl_h h-100 bdr-left-eee">Forth Paymnet</div>
                                </div>
                                <div class="col-sm-8 align-self-stretc p-0">
                                    <div class="booking_inner_dtl_b h-100 bdr-left-eee">₹ 11000 /- (Before Application)</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* -------- Step 4 ---------*/}
                      <div className="mb-2 mt-3 mul-booking-card-inner-head">
                          <b>Payment Summary</b>
                      </div>
                      <div className="my-card">
                        <div className="my-card-body">
                          <div className="row m-0 bdr-btm-eee">
                            <div className="col-lg-4 col-sm-6 p-0">
                              <div class="row m-0">
                                <div class="col-sm-5 align-self-stretc p-0">
                                    <div class="booking_inner_dtl_h h-100">Total Amount</div>
                                </div>
                                <div class="col-sm-7 align-self-stretc p-0">
                                    <div class="booking_inner_dtl_b h-100 bdr-left-eee">₹ 22000</div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-4 col-sm-6 p-0">
                              <div class="row m-0">
                                <div class="col-sm-5 align-self-stretc p-0">
                                    <div class="booking_inner_dtl_h bdr-left-eee h-100">Received Amount</div>
                                </div>
                                <div class="col-sm-7 align-self-stretc p-0">
                                    <div class="booking_inner_dtl_b bdr-left-eee h-100">₹ 22000</div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-4 col-sm-6 p-0">
                              <div class="row m-0">
                                <div class="col-sm-5 align-self-stretc p-0">
                                    <div class="booking_inner_dtl_h bdr-left-eee h-100">Pending Amount</div>
                                </div>
                                <div class="col-sm-7 align-self-stretc p-0">
                                    <div class="booking_inner_dtl_b bdr-left-eee h-100">₹ 22000</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row m-0 bdr-btm-eee">
                            <div className="col-lg-6 col-sm-6 p-0">
                              <div class="row m-0">
                                <div class="col-sm-4 align-self-stretc p-0">
                                    <div class="booking_inner_dtl_h h-100">Payment Method</div>
                                </div>
                                <div class="col-sm-8 align-self-stretc p-0">
                                    <div class="booking_inner_dtl_b h-100 bdr-left-eee">ICICI Bank</div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6 col-sm-6 p-0">
                              <div class="row m-0">
                                <div class="col-sm-4 align-self-stretc p-0">
                                    <div class="booking_inner_dtl_h h-100 bdr-left-eee">Extra Remarks</div>
                                </div>
                                <div class="col-sm-8 align-self-stretc p-0">
                                    <div class="booking_inner_dtl_b h-100 bdr-left-eee">no</div>
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
      ) : (<>
      <AdminBookingForm
        // matured={true}
        // companysId={companyId}
        //setDataStatus={setdataStatus}
        setFormOpen={setBookingFormOpen}
        //companysName={companyName}
        // companysEmail={companyEmail}
        // companyNumber={companyNumber}
        // setNowToFetch={setNowToFetch}
        // companysInco={companyInco}
        // employeeName={data.ename}
        // employeeEmail={data.email}
      />
    </>
    )}
    </div>
  );
}

export default BookingList;
