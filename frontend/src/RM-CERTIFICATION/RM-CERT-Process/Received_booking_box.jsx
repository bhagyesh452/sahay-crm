import React , {useState , useEffect} from 'react';
import axios from 'axios';
import RmofCertificationHeader from "../RM-CERT-COMPONENTS/RmofCertificationHeader";
import RmCertificationNavbar from "../RM-CERT-COMPONENTS/RmCertificationNavbar";
import { SlActionRedo } from "react-icons/sl";
import { IoDocumentTextOutline } from "react-icons/io5";




function Received_booking_box() {


    const secretKey = process.env.REACT_APP_SECRET_KEY;
  const [employeeData, setEmployeeData] = useState([])

  const rmCertificationUserId = localStorage.getItem("rmCertificationUserId")
  console.log(rmCertificationUserId)


  const fetchData = async () => {
    try {
      const response = await axios.get(`${secretKey}/employee/einfo`);
      // Set the retrieved data in the state
      const tempData = response.data;
      console.log(tempData)
      const userData = tempData.find((item) => item._id === rmCertificationUserId);
      console.log(userData)
      setEmployeeData(userData);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  console.log('employeeData', employeeData)
  return (
    <div>
        <RmofCertificationHeader name={employeeData.ename} designation={employeeData.designation} />
        <RmCertificationNavbar rmCertificationUserId={rmCertificationUserId}/>
        <div className="booking-list-main">
            <div className="booking_list_Filter">
                <div className="container-xl">
                    <div className="row justify-content-between align-items-center">
                        <div className="col-2">
                            <div class="my-2 my-md-0 flex-grow-1 flex-md-grow-0 order-first order-md-last">
                                <div class="input-icon">
                                    <span class="input-icon-addon">
                                        <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="icon"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        stroke-width="2"
                                        stroke="currentColor"
                                        fill="none"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        >
                                        <path
                                            stroke="none"
                                            d="M0 0h24v24H0z"
                                            fill="none"
                                        ></path>
                                        <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
                                        <path d="M21 21l-6 -6"></path>
                                        </svg>
                                    </span>
                                    <input
                                        type="text"
                                        class="form-control"
                                        placeholder="Search Company"
                                        aria-label="Search in website"
                                    
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-6 d-flex justify-content-end">
                            <button className='btn btn-primary'>All Booking</button>
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
                                        <div className="b_dtl_C_name">Booking List</div>
                                    </div>
                                </div>
                                <div className="booking-list-body">
                                    <div className='rm_bking_list_box_item'>
                                        <div className='d-flex justify-content-between align-items-center'>
                                            <div className='rm_cmpny_name_services'>
                                                <div className='rm_bking_cmpny_name My_Text_Wrap'>
                                                    Start-Up Sahay Private Limited
                                                </div>
                                                <div className='d-flex justify-content-start align-items-center flex-wrap mt-1'>
                                                    <div className='rm_bking_item_serices clr-bg-light-a0b1ad bdr-l-clr-a0b1ad clr-a0b1ad My_Text_Wrap mb-1'>
                                                        Seed Fund
                                                    </div>
                                                    <div className='rm_bking_item_serices clr-bg-light-a0b1ad bdr-l-clr-a0b1ad clr-a0b1ad My_Text_Wrap mb-1'>
                                                        Income Tax Exemption
                                                    </div>
                                                    <div className='rm_bking_item_serices clr-bg-light-4299e1 bdr-l-clr-4299e1 clr-4299e1 My_Text_Wrap mb-1'>
                                                        ISO Certificate IAF ISO 9001 1 YR (3 YR FORMAT)
                                                    </div>
                                                    <div className='rm_bking_item_serices clr-bg-light-4299e1 bdr-l-clr-4299e1 clr-4299e1 My_Text_Wrap mb-1'>
                                                        Startup Certificate
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <button className='btn btn-sm btn-swap-round d-flex align-items-center'> 
                                                    <div className='btn-swap-icon'>
                                                        <SlActionRedo />
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
                                        <div className='d-flex justify-content-between align-items-center mt-1'>
                                            <div className='rm_bking_time'>
                                                02:00 AM | 20 Jun 2024
                                            </div>
                                            <div className='rm_bking_by'>
                                                By Ravi Prajapati
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
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="b_dtl_C_name">ABC PVT LTD</div>
                                    </div>
                                </div>
                                <div className="booking-deatils-body">
                                    <div class="my-card mt-2">
                                        <div className='my-card-head'>
                                            <div className='d-flex justify-content-between align-items-center'>
                                                <div>
                                                    Basic Details
                                                </div>
                                                <div className='d-flex justify-content-between align-items-center'>
                                                    <div className='rm_total_bking'>
                                                        Total Booking : <b>2</b> 
                                                    </div>
                                                    <div className='rm_total_services'>
                                                        Total Services : <b>5</b>
                                                    </div>
                                                </div>
                                            </div>
                                        </div> 
                                        <div class="my-card-body">
                                            <div class="row m-0">
                                                <div class="col-lg-6 col-sm-6 p-0 align-self-stretch">
                                                    <div class="row m-0 h-100 bdr-btm-eee">
                                                        <div class="col-lg-3 align-self-stretch p-0">
                                                            <div class="booking_inner_dtl_h h-100">
                                                                Company Name
                                                            </div>
                                                        </div>
                                                        <div class="col-lg-9 align-self-stretch p-0">
                                                            <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                                                S KUSHWAH BUILDERS PRIVATE LIMITED
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-lg-6 col-sm-6 p-0 align-self-stretch">
                                                    <div class="row m-0 h-100 bdr-btm-eee">
                                                        <div class="col-lg-3 align-self-stretch p-0">
                                                            <div class="booking_inner_dtl_h bdr-left-eee h-100">Email Address</div>
                                                        </div>
                                                        <div class="col-lg-9 align-self-stretch p-0">
                                                            <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                                                nsuiyogeshkushwah111@gmail.com
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row m-0">
                                                <div class="col-lg-4 col-sm-6 p-0 align-self-stretch">
                                                    <div class="row m-0 h-100 bdr-btm-eee">
                                                        <div class="col-lg-4 align-self-stretch p-0">
                                                            <div class="booking_inner_dtl_h h-100">
                                                                Phone No
                                                            </div>
                                                        </div>
                                                        <div class="col-lg-8 align-self-stretch p-0">
                                                            <div class="booking_inner_dtl_b bdr-left-eee h-100">9753740001</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-lg-4 col-sm-6 p-0 align-self-stretch">
                                                    <div class="row m-0 h-100 bdr-btm-eee">
                                                        <div class="col-lg-7 align-self-stretch p-0">
                                                            <div class="booking_inner_dtl_h bdr-left-eee h-100">Incorporation date</div>
                                                        </div>
                                                        <div class="col-lg-5 align-self-stretch p-0">
                                                            <div class="booking_inner_dtl_b h-100 bdr-left-eee">April 22, 2024</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-lg-4 col-sm-12 p-0 align-self-stretch">
                                                    <div class="row m-0 h-100 bdr-btm-eee">
                                                        <div class="col-lg-5 align-self-stretch p-0">
                                                            <div class="booking_inner_dtl_h bdr-left-eee h-100">PAN/GST</div>
                                                        </div>
                                                        <div class="col-lg-7 align-self-stretch p-0">
                                                            <div class="booking_inner_dtl_b bdr-left-eee h-100">ABNCS3122Q</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row m-0">
                                                <div class="col-lg-4 col-sm-6 p-0">
                                                    <div class="row m-0 ">
                                                        <div class="col-lg-4 align-self-stretc p-0">
                                                            <div class="booking_inner_dtl_h h-100">Total</div>
                                                        </div>
                                                        <div class="col-lg-8 align-self-stretc p-0">
                                                            <div class="booking_inner_dtl_b h-100 bdr-left-eee">₹ 22,900</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-lg-4 col-sm-6 p-0">
                                                    <div class="row m-0 ">
                                                        <div class="col-lg-4 align-self-stretc p-0">
                                                            <div class="booking_inner_dtl_h bdr-left-eee h-100">Received</div>
                                                        </div>
                                                        <div class="col-lg-8 align-self-stretc p-0">
                                                            <div class="booking_inner_dtl_b bdr-left-eee h-100">₹ 22,900</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-lg-4 col-sm-6 p-0">
                                                    <div class="row m-0">
                                                        <div class="col-lg-4 align-self-stretc p-0">
                                                            <div class="booking_inner_dtl_h bdr-left-eee h-100">Pending</div>
                                                        </div>
                                                        <div class="col-lg-8 align-self-stretc p-0">
                                                            <div class="booking_inner_dtl_b bdr-left-eee h-100">₹ 0</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='rm_all_bkng_right mt-3'>
                                        <ul class="nav nav-tabs rm_bkng_items align-items-center">
                                            <li class="nav-item rm_bkng_item_no">
                                                <a class="nav-link active" data-bs-toggle="tab" href="#Booking_1">Booking 1</a>
                                            </li>
                                            <li class="nav-item rm_bkng_item_no">
                                                <a class="nav-link" data-bs-toggle="tab" href="#Booking_2">Booking 2</a>
                                            </li>
                                            <li class="nav-item rm_bkng_item_no">
                                                <a class="nav-link" data-bs-toggle="tab" href="#Booking_3">Booking 3</a>
                                            </li>
                                            <li class="nav-item rm_bkng_item_no ms-auto">
                                               <div className='rm_bkng_item_no nav-link clr-ff8800'>Saturday, 06 jun 2024 at 01:00 PM</div>
                                            </li>
                                        </ul>
                                        <div class="tab-content rm_bkng_item_details">
                                            <div class="tab-pane active rm_bkng_item_detail_inner" id="Booking_1">
                                                <div className='row mt-3'>
                                                    <div className='col-lg-4 col-sm-12'>
                                                        <div className='my-card'>
                                                            <div className='my-card-body'>
                                                                <div className='row m-0 bdr-btm-eee'>
                                                                    <div className='col-lg-4 col-sm-12 p-0 align-self-stretch'>
                                                                        <div class="booking_inner_dtl_h h-100">Booking Date</div>
                                                                    </div>
                                                                    <div className='col-lg-8 col-sm-12 p-0 align-self-stretch'>
                                                                        <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap">2024-07-10</div>
                                                                    </div>
                                                                </div>
                                                                <div className='row m-0'>
                                                                    <div className='col-lg-4 col-sm-12 p-0 align-self-stretch'>
                                                                        <div class="booking_inner_dtl_h h-100">Lead Source</div>
                                                                    </div>
                                                                    <div className='col-lg-8 col-sm-12 p-0 align-self-stretch'>
                                                                        <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap">Existing Client</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='my-card mt-2'>
                                                            <div className='my-card-body'>
                                                                <div className='row m-0 bdr-btm-eee'>
                                                                    <div className='col-lg-4 col-sm-12 p-0 align-self-stretch'>
                                                                        <div class="booking_inner_dtl_h h-100">BDE Name</div>
                                                                    </div>
                                                                    <div className='col-lg-8 col-sm-12 p-0 align-self-stretch'>
                                                                        <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap">Ravi Prajapati</div>
                                                                    </div>
                                                                </div>
                                                                <div className='row m-0'>
                                                                    <div className='col-lg-4 col-sm-12 p-0 align-self-stretch'>
                                                                        <div class="booking_inner_dtl_h h-100">BDE Email</div>
                                                                    </div>
                                                                    <div className='col-lg-8 col-sm-12 p-0 align-self-stretch'>
                                                                        <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap">khushi.gandhi@startupsahay.com</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='my-card mt-2'>
                                                            <div className='my-card-body'>
                                                                <div className='row m-0 bdr-btm-eee'>
                                                                    <div className='col-lg-4 col-sm-12 p-0 align-self-stretch'>
                                                                        <div class="booking_inner_dtl_h h-100">BDM Name</div>
                                                                    </div>
                                                                    <div className='col-lg-8 col-sm-12 p-0 align-self-stretch'>
                                                                        <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap">Ravi Prajapati <i>(Close By)</i></div>
                                                                    </div>
                                                                </div>
                                                                <div className='row m-0'>
                                                                    <div className='col-lg-4 col-sm-12 p-0 align-self-stretch'>
                                                                        <div class="booking_inner_dtl_h h-100">BDM Email</div>
                                                                    </div>
                                                                    <div className='col-lg-8 col-sm-12 p-0 align-self-stretch'>
                                                                        <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap">Ravi@startupsahay.com</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='my-card mt-2'>
                                                            <div className='my-card-body'>
                                                                <div className='row m-0 bdr-btm-eee'>
                                                                    <div className='col-lg-4 col-sm-12 p-0 align-self-stretch'>
                                                                        <div class="booking_inner_dtl_h h-100">CA Case</div>
                                                                    </div>
                                                                    <div className='col-lg-8 col-sm-12 p-0 align-self-stretch'>
                                                                        <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap">Yes</div>
                                                                    </div>
                                                                </div>
                                                                <div className='row m-0 bdr-btm-eee'>
                                                                    <div className='col-lg-4 col-sm-12 p-0 align-self-stretch'>
                                                                        <div class="booking_inner_dtl_h h-100">CA's Number</div>
                                                                    </div>
                                                                    <div className='col-lg-8 col-sm-12 p-0 align-self-stretch'>
                                                                        <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap">9967249593</div>
                                                                    </div>
                                                                </div>
                                                                <div className='row m-0 bdr-btm-eee'>
                                                                    <div className='col-lg-4 col-sm-12 p-0 align-self-stretch'>
                                                                        <div class="booking_inner_dtl_h h-100">CA's Email</div>
                                                                    </div>
                                                                    <div className='col-lg-8 col-sm-12 p-0 align-self-stretch'>
                                                                        <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap">pcred.comp@gmail.com</div>
                                                                    </div>
                                                                </div>
                                                                <div className='row m-0'>
                                                                    <div className='col-lg-5 col-sm-12 p-0 align-self-stretch'>
                                                                        <div class="booking_inner_dtl_h h-100">CA's Commission</div>
                                                                    </div>
                                                                    <div className='col-lg-7 col-sm-12 p-0 align-self-stretch'>
                                                                        <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap">₹ 0</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='col-lg-8 col-sm-12'>
                                                        <div className='rm_bkng_item_detail_inner_r'>
                                                            <div className='rm_bkng_item_detail_inner_s_payments'>
                                                                <div class="my-card">
                                                                    <div class="my-card-body">
                                                                        <div class="row m-0 bdr-btm-eee">
                                                                            <div class="col-lg-4 col-sm-6 p-0 align-self-stretch">
                                                                                <div class="row m-0 h-100">
                                                                                    <div class="col-lg-6 align-self-stretch p-0">
                                                                                        <div class="booking_inner_dtl_h h-100">Total Amount</div>
                                                                                    </div>
                                                                                    <div class="col-lg-6 align-self-stretch p-0">
                                                                                        <div class="booking_inner_dtl_b h-100 bdr-left-eee">₹ 21,240</div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div class="col-lg-4 col-sm-6 p-0 align-self-stretch">
                                                                                <div class="row m-0 h-100">
                                                                                    <div class="col-lg-7 align-self-stretch p-0">
                                                                                        <div class="booking_inner_dtl_h bdr-left-eee h-100">Received Amount</div>
                                                                                    </div>
                                                                                    <div class="col-lg-5 align-self-stretch p-0">
                                                                                        <div class="booking_inner_dtl_b bdr-left-eee h-100">₹ 21,240</div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div class="col-lg-4 col-sm-5 p-0 align-self-stretch">
                                                                                <div class="row m-0 h-100">
                                                                                    <div class="col-lg-7 align-self-stretch p-0">
                                                                                        <div class="booking_inner_dtl_h bdr-left-eee h-100">Pending Amount</div>
                                                                                    </div>
                                                                                    <div class="col-lg-5 align-self-stretch p-0">
                                                                                        <div class="booking_inner_dtl_b bdr-left-eee h-100">₹ 0</div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div class="row m-0 bdr-btm-eee">
                                                                            <div class="col-lg-6 col-sm-6 p-0 align-self-stretch">
                                                                                <div class="row m-0 h-100">
                                                                                    <div class="col-lg-6 align-self-stretch p-0">
                                                                                        <div class="booking_inner_dtl_h h-100">Payment Method</div>
                                                                                    </div>
                                                                                    <div class="col-lg-6 align-self-stretch p-0">
                                                                                        <div class="booking_inner_dtl_b h-100 bdr-left-eee">ICICI Bank</div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div class="col-lg-6 col-sm-6 p-0 align-self-stretch">
                                                                                <div class="row m-0 h-100">
                                                                                    <div class="col-lg-6 align-self-stretch p-0">
                                                                                        <div class="booking_inner_dtl_h h-100 bdr-left-eee">Extra Remarks</div>
                                                                                    </div>
                                                                                    <div class="col-lg-6 align-self-stretch p-0">
                                                                                        <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap" title="FOR CONTACT = 9811033069">
                                                                                            FOR CONTACT = 9811033069
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className='p-0 mul-booking-card rm_bkng_item_detail_inner_services bdr-ededed mt-2'>
                                                                <ul class="nav nav-tabs">
                                                                    <li class="nav-item rmbidis_nav_item">
                                                                        <a class="nav-link rmbidis_nav_link active My_Text_Wrap" data-bs-toggle="tab" href="#services_1">Start-Up India Certificate</a>
                                                                    </li>
                                                                    <li class="nav-item rmbidis_nav_item">
                                                                        <a class="nav-link rmbidis_nav_link My_Text_Wrap" data-bs-toggle="tab" href="#services_2">Seed Funding Support</a>
                                                                    </li>
                                                                    <li class="nav-item rmbidis_nav_item">
                                                                        <a class="nav-link rmbidis_nav_link My_Text_Wrap" data-bs-toggle="tab" href="#services_3">ISO Certificate IAF 9001 1 YEAR VALIDITY</a>
                                                                    </li>
                                                                    <li class="nav-item rmbidis_nav_item ms-auto">
                                                                        <a class="nav-link rmbidis_nav_link d-flex aling-items-center justify-content-center" data-bs-toggle="tab" href="#booking_docs">
                                                                            <div style={{lineHeight:'11px',marginRight:'3px'}}><IoDocumentTextOutline /> </div>
                                                                            <div>Documnets</div>
                                                                        </a>
                                                                    </li>
                                                                </ul>
                                                                <div class="tab-content">
                                                                    <div class="tab-pane p-1 active" id="services_1">
                                                                        <div class="my-card mt-1">
                                                                            <div class="my-card-body">
                                                                                <div class="row m-0 bdr-btm-eee">
                                                                                    <div class="col-lg-6 col-sm-12 p-0">
                                                                                        <div class="row m-0">
                                                                                            <div class="col-lg-4 align-self-stretch p-0">
                                                                                                <div class="booking_inner_dtl_h h-100">
                                                                                                    Services
                                                                                                </div>
                                                                                            </div>
                                                                                            <div class="col-lg-8 align-self-stretch p-0">
                                                                                                <div class="booking_inner_dtl_b bdr-left-eee h-100 services-name">
                                                                                                    Seed Funding Support 
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    
                                                                                </div>
                                                                                <div class="row m-0 bdr-btm-eee">
                                                                                    <div class="col-lg-6 col-sm-12 p-0">
                                                                                        <div class="row m-0">
                                                                                            <div class="col-lg-4 align-self-stretch p-0">
                                                                                                <div class="booking_inner_dtl_h h-100">
                                                                                                    Total Amount
                                                                                                </div>
                                                                                            </div>
                                                                                            <div class="col-lg-8 align-self-stretch p-0">
                                                                                                <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                                                                                    <div class="d-flex align-items-center justify-content-between">
                                                                                                        <div>₹ 23,600 (With GST)</div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div class="col-lg-6 col-sm-12 p-0">
                                                                                        <div class="row m-0">
                                                                                            <div class="col-lg-5 align-self-stretch p-0">
                                                                                                <div class="booking_inner_dtl_h h-100 bdr-left-eee">
                                                                                                    Payment Terms
                                                                                                </div>
                                                                                            </div>
                                                                                            <div class="col-lg-7 align-self-stretch p-0">
                                                                                                <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                                                                                    Part-Payment
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div class="row m-0 bdr-btm-eee">
                                                                                    <div class="col-lg-6 col-sm-12 p-0">
                                                                                        <div class="row m-0 bdr-btm-eee">
                                                                                            <div class="col-lg-4 align-self-stretch p-0">
                                                                                                <div class="booking_inner_dtl_h h-100">1<sup>st</sup> payment</div>
                                                                                            </div>
                                                                                            <div class="col-lg-8 align-self-stretch p-0">
                                                                                                <div class="booking_inner_dtl_b bdr-left-eee h-100">₹ 20,000</div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div class="col-lg-6 col-sm-12 p-0">
                                                                                        <div class="row m-0 bdr-btm-eee">
                                                                                            <div class="col-lg-4 align-self-stretch p-0">
                                                                                                <div class="booking_inner_dtl_h h-100 bdr-left-eee">2<sup>nd</sup> Payment</div>
                                                                                            </div>
                                                                                            <div class="col-lg-8 align-self-stretch p-0">
                                                                                                <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                                                                                    <div class="d-flex align-items-center justify-content-between">
                                                                                                        <div>₹3,600(BEFORE APPLICATION)</div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div class="col-lg-6 col-sm-12 p-0">
                                                                                        <div class="row m-0">
                                                                                            <div class="col-lg-4 align-self-stretch p-0">
                                                                                                <div class="booking_inner_dtl_h h-100">3<sup>rd</sup> Payment</div>
                                                                                            </div>
                                                                                            <div class="col-lg-8 align-self-stretch p-0">
                                                                                                <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                                                                                    <div class="d-flex align-items-center justify-content-between">
                                                                                                        <div>₹3,600(BEFORE APPLICATION)</div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div class="col-lg-6 col-sm-12 p-0">
                                                                                        <div class="row m-0">
                                                                                            <div class="col-lg-4 align-self-stretch p-0">
                                                                                                <div class="booking_inner_dtl_h h-100 bdr-left-eee">4<sup>th</sup> Payment</div>
                                                                                            </div>
                                                                                            <div class="col-lg-8 align-self-stretch p-0">
                                                                                                <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                                                                                    <div class="d-flex align-items-center justify-content-between">
                                                                                                        <div>₹3,600(BEFORE APPLICATION)</div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div class="row m-0 bdr-btm-eee">
                                                                                    <div class="col-lg-3 col-sm-12 p-0">
                                                                                        <div class="row m-0">
                                                                                            <div class="col-lg-6 align-self-stretch p-0">
                                                                                                <div class="booking_inner_dtl_h h-100">
                                                                                                    Expense
                                                                                                </div>
                                                                                            </div>
                                                                                            <div class="col-lg-6 align-self-stretch p-0">
                                                                                                <div class="booking_inner_dtl_b bdr-left-eee h-100">- ₹ 100</div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div class="col-lg-4 col-sm-12 p-0">
                                                                                        <div class="row m-0">
                                                                                            <div class="col-lg-6 align-self-stretch p-0">
                                                                                                <div class="booking_inner_dtl_h bdr-left-eee h-100">Expanses Date</div>
                                                                                            </div>
                                                                                            <div class="col-lg-6 align-self-stretch p-0">
                                                                                                <div class="booking_inner_dtl_b bdr-left-eee h-100">July 11, 2024</div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div class="col-lg-5 col-sm-12 p-0">
                                                                                        <div class="row m-0">
                                                                                            <div class="col-lg-3 align-self-stretch p-0">
                                                                                                <div class="booking_inner_dtl_h bdr-left-eee h-100">Notes</div>
                                                                                            </div>
                                                                                            <div class="col-lg-9 align-self-stretch p-0">
                                                                                                <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap" title="N/A">
                                                                                                    N/A
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div class="my-card mt-1">
                                                                            <div class="my-card-body accordion" id="accordionExample0">
                                                                                <div class="accordion-item bdr-none">
                                                                                    <div id="headingOne0" class="pr-10 accordion-header">
                                                                                        <div class="row m-0 bdr-btm-eee accordion-button p-0 collapsed" data-bs-toggle="collapse" data-bs-target="#collapseOne0" aria-expanded="false" aria-controls="collapseOne0">
                                                                                            <div class="w-95 p-0">
                                                                                                <div class="booking_inner_dtl_h h-100">
                                                                                                    <div>Remaining Payment </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div id="collapseOne0" class="accordion-collapse collapse" aria-labelledby="headingOne0" data-bs-parent="#accordionExample">
                                                                                        <div class="accordion-body bdr-none p-0">
                                                                                            <div>
                                                                                                <div class="row m-0 bdr-btm-eee bdr-top-eee">
                                                                                                    <div class="col-lg-12 col-sm-6 p-0 align-self-stretc bg-fffafa">
                                                                                                        <div class="booking_inner_dtl_h h-100 d-flex align-items-center justify-content-between">
                                                                                                            <div>Second Remaining Payment</div>
                                                                                                            <div>(June 24, 2024)</div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div class="row m-0 bdr-btm-eee">
                                                                                                    <div class="col-lg-3 col-sm-6 p-0 align-self-stretc">
                                                                                                        <div class="row m-0 h-100">
                                                                                                            <div class="col-sm-5 align-self-stretc p-0">
                                                                                                                <div class="booking_inner_dtl_h h-100">Amount</div>
                                                                                                            </div>
                                                                                                            <div class="col-sm-7 align-self-stretc p-0">
                                                                                                                <div class="booking_inner_dtl_b bdr-left-eee h-100">₹ 3,500</div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div class="col-lg-3 col-sm-6 p-0 align-self-stretc">
                                                                                                        <div class="row m-0 h-100">
                                                                                                            <div class="col-sm-5 align-self-stretc p-0">
                                                                                                                <div class="booking_inner_dtl_h bdr-left-eee h-100">Pending</div>
                                                                                                            </div>
                                                                                                            <div class="col-sm-7 align-self-stretc p-0">
                                                                                                                <div class="booking_inner_dtl_b bdr-left-eee h-100">₹ 0</div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div class="col-lg-6 col-sm-6 p-0 align-self-stretc">
                                                                                                        <div class="row m-0 h-100">
                                                                                                            <div class="col-sm-5 align-self-stretc p-0">
                                                                                                                <div class="booking_inner_dtl_h h-100 bdr-left-eee">Payment Date</div>
                                                                                                            </div>
                                                                                                            <div class="col-sm-7 align-self-stretc p-0">
                                                                                                                <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap">June 22, 2024</div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div class="row m-0 bdr-btm-eee">
                                                                                                    <div class="col-lg-6 col-sm-6 p-0 align-self-stretc">
                                                                                                        <div class="row m-0 h-100">
                                                                                                            <div class="col-sm-5 align-self-stretc p-0">
                                                                                                                <div class="booking_inner_dtl_h h-100">Payment Method</div>
                                                                                                            </div>
                                                                                                            <div class="col-sm-7 align-self-stretc p-0">
                                                                                                                <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap" title="STARTUP SAHAY SERVICES/ADVISORY(Non GST)/ IDFC First Bank">STARTUP SAHAY SERVICES/ADVISORY(Non GST)/ IDFC First Bank</div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div class="col-lg-6 col-sm-4 p-0 align-self-stretc">
                                                                                                        <div class="row m-0 h-100">
                                                                                                            <div class="col-sm-4 align-self-stretc p-0">
                                                                                                                <div class="booking_inner_dtl_h h-100 bdr-left-eee">Extra Remarks</div>
                                                                                                            </div>
                                                                                                            <div class="col-sm-8 align-self-stretc p-0">
                                                                                                                <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap" title="Remaining payment received in IDFC/SSC">Remaining payment received in IDFC/SSC</div>
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
                                                                    <div class="tab-pane p-1 fade" id="services_2">

                                                                    </div>
                                                                    <div class="tab-pane p-1 fade" id="services_3">
                                                                        
                                                                    </div>
                                                                    <div class="tab-pane p-1 fade" id="booking_docs">
                                                                        <div className='row m-0'>
                                                                            <div class="col-sm-3 mt-2">
                                                                                <div class="booking-docs-preview" title="Upload More Documents">
                                                                                    <div class="upload-Docs-BTN">
                                                                                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                                                                            <path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 112v288m144-144H112"></path>
                                                                                        </svg>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div class="col-sm-3 mt-2">
                                                                                <div class="booking-docs-preview">
                                                                                    <div class="booking-docs-preview-img">
                                                                                        <img src="https://startupsahay.in/api/bookings/recieptpdf/SAMYATVA PHARMACEUTICALS PRIVATE LIMITED/1720587188259-WhatsApp Image 2024-07-10 at 10.04.23 AM.jpeg" alt="MyImg"/>
                                                                                    </div>
                                                                                    <div class="booking-docs-preview-text">
                                                                                        <p class="booking-img-name-txtwrap text-wrap m-auto m-0">Receipt.pdf</p>
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
                                            <div class="tab-pane fade rm_bkng_item_detail_inner" id="Booking_2">

                                            </div>
                                            <div class="tab-pane fade rm_bkng_item_detail_inner" id="Booking_3">

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
  )
}

export default Received_booking_box