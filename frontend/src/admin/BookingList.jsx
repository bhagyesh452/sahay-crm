import React, { useState, useEffect } from "react";
import Header from "./Header";
import Navbar from "./Navbar";
import AdminBookingForm from "./AdminBookingForm";
import axios from "axios";
import PdfImageViewerAdmin from "./PdfViewerAdmin";
import pdfimg from "../static/my-images/pdf.png";
import { TbBoxMultiple } from "react-icons/tb";

function BookingList() {
  const [bookingFormOpen, setBookingFormOpen] = useState(false);
  const [infiniteBooking, setInfiniteBooking] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [leadFormData, setLeadFormData] = useState([]);
  const [currentLeadform, setCurrentLeadform] = useState(null);
  const [currentDataLoading, setCurrentDataLoading] = useState(false);
  const [data, setData] = useState([]);
  const [companyName, setCompanyName] = "";
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
      setCurrentDataLoading(false);
    }
  };
  useEffect(() => {
    setCurrentLeadform(leadFormData[0]);
  }, [leadFormData]);

  useEffect(()=>{
    setLeadFormData(infiniteBooking.filter((obj=> ((obj["Company Name"])).toLowerCase().includes(searchText))))
  }, [searchText])

  const fetchRedesignedFormData = async () => {
    try {
      const response = await axios.get(
        `${secretKey}/redesigned-final-leadData`
      );
      setInfiniteBooking(response.data);
      setLeadFormData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    // if (data.companyName) {
    //   console.log("Company Found");
    fetchDatadebounce();
    fetchRedesignedFormData();
    // } else {
    //   console.log("No Company Found");
    // }
  }, []);

  const functionOpenBookingForm = () => {
    setBookingFormOpen(true);
    //setCompanyName(data.companyName)
  };
  const calculateTotalAmount = (obj) => {
    let total = Number(obj.totalAmount);
    if (obj.moreBookings && obj.moreBookings.length > 0) {
      total += obj.moreBookings.reduce(
        (acc, booking) => acc + Number(booking.totalAmount),
        0
      );
    }
    return total.toFixed(2);
  };

  const calculateReceivedAmount = (obj) => {
    let received = Number(obj.receivedAmount);
    if (obj.moreBookings && obj.moreBookings.length > 0) {
      received += obj.moreBookings.reduce(
        (acc, booking) => acc + Number(booking.receivedAmount),
        0
      );
    }
    return received.toFixed(2);
  };

  const calculatePendingAmount = (obj) => {
    let pending = Number(obj.pendingAmount);
    if (obj.moreBookings && obj.moreBookings.length > 0) {
      pending += obj.moreBookings.reduce(
        (acc, booking) => acc + Number(booking.pendingAmount),
        0
      );
    }
    return pending.toFixed(2);
  };
  function formatDatePro(inputDate) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(inputDate).toLocaleDateString(
      "en-US",
      options
    );
    return formattedDate;
  }
  const getOrdinal = (number) => {
    const suffixes = ["th", "st", "nd", "rd"];
    const lastDigit = number % 10;
    const suffix = suffixes[lastDigit <= 3 ? lastDigit : 0];
    return `${number}${suffix}`;
  };
  const handleViewPdfReciepts = (paymentreciept) => {
    const pathname = paymentreciept;
    //console.log(pathname);
    window.open(`${secretKey}/recieptpdf/${pathname}`, "_blank");
  };

  const handleViewPdOtherDocs = (pdfurl) => {
    const pathname = pdfurl;
    console.log(pathname);
    window.open(`${secretKey}/otherpdf/${pathname}`, "_blank");
  };
  return (
    <div>
      <Header />
      <Navbar />
      {!bookingFormOpen ? (
        <div className="booking-list-main">
          <div className="booking_list_Filter">
            <div className="container-xl">
              <div className="row justify-content-between">
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
                        value={searchText}
                        class="form-control"
                        placeholder="Search…"
                        aria-label="Search in website"
                        onChange={(e)=>setSearchText(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex justify-content-end">
                    <button className="btn btn-primary mr-1">Import CSV</button>
                    <button className="btn btn-primary mr-1">Export CSV</button>
                    <button
                      className="btn btn-primary"
                      onClick={() => functionOpenBookingForm()}
                    >
                      Add Booking
                    </button>
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
                        <div className="b_dtl_C_name">Booking List</div>
                      </div>
                    </div>
                    <div className="booking-list-body">
                      {leadFormData.length !== 0 &&
                        leadFormData.map((obj, index) => (
                          <div
                           
                            className = {currentLeadform && currentLeadform["Company Name"] === obj["Company Name"] ?"bookings_Company_Name activeBox" : "bookings_Company_Name" }
                            onClick={() =>
                              setCurrentLeadform(
                                leadFormData.find(
                                  (data) =>
                                    data["Company Name"] === obj["Company Name"]
                                )
                              )
                            }
                          >
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="b_cmpny_name cName-text-wrap">
                                {obj["Company Name"]}
                              </div>
                              <div className="b_cmpny_time">
                                {
                                 formatDatePro( obj.moreBookings &&
                                  obj.moreBookings.length !== 0
                                    ? obj.moreBookings[
                                        obj.moreBookings.length - 1
                                      ].bookingDate // Get the latest bookingDate from moreBookings
                                    : obj.bookingDate )// Use obj.bookingDate if moreBookings is empty or not present
                                }
                              </div>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mt-2">
                              <div className="b_Services_name d-flex">
                                {(obj.services.length !== 0 ||
                                  (obj.moreBookings &&
                                    obj.moreBookings.length !== 0)) &&
                                  [
                                    ...obj.services,
                                    ...(obj.moreBookings || []).map(
                                      (booking) => booking.services
                                    ),
                                  ]
                                    .flat()
                                    .map((service) => (
                                      <div
                                        className="sname"
                                        key={service.serviceId}
                                      >
                                        {service.serviceName}
                                      </div>
                                    ))}
                              </div>

                              {obj.moreBookings.length!==0 && <div
                                className="b_Services_multipal_services"
                                title="Multipal Bookings"
                              >
                                <TbBoxMultiple />
                              </div>}
                            </div>
                            <div className="d-flex justify-content-between align-items-center mt-2">
                              <div className="b_Services_amount d-flex">
                                <div className="amount total_amount_bg">
                                  Total: ₹ {calculateTotalAmount(obj)} /-
                                </div>
                                <div className="amount receive_amount_bg">
                                  Receive: ₹ {calculateReceivedAmount(obj)} /-
                                </div>
                                <div className="amount pending_amount_bg">
                                  Pending: ₹ {calculatePendingAmount(obj)} /-
                                </div>
                              </div>
                              <div className="b_BDE_name">{obj.bdeName}</div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
                {/* --------booking Details Right Part---------*/}
                <div className="col-8 p-0">
                  <div className="booking-deatils-card">
                    <div className="booking-deatils-heading">
                      <div className="d-flex justify-content-between">
                        <div className="b_dtl_C_name">
                          {currentLeadform &&
                          Object.keys(currentLeadform).length !== 0
                            ? currentLeadform["Company Name"]
                            : leadFormData && leadFormData.length !== 0
                            ? leadFormData[0]["Company Name"]
                            : "-"}
                        </div>
                      </div>
                    </div>
                    <div className="booking-deatils-body">
                      {/* --------Basic Information Which is Common For all bookingdd  ---------*/}
                      <div className="my-card mt-2">
                        <div className="my-card-head">Basic Informations:</div>
                        <div className="my-card-body">
                          <div className="row m-0 bdr-btm-eee">
                            <div className="col-lg-5 col-sm-6 p-0">
                              <div class="row m-0">
                                <div class="col-sm-4 align-self-stretch p-0">
                                  <div class="booking_inner_dtl_h h-100">
                                    Company Name:
                                  </div>
                                </div>
                                <div class="col-sm-6 align-self-stretch p-0">
                                  <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                    {currentLeadform &&
                                    Object.keys(currentLeadform).length !== 0
                                      ? currentLeadform["Company Name"]
                                      : leadFormData &&
                                        leadFormData.length !== 0
                                      ? leadFormData[0]["Company Name"]
                                      : "-"}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-4 col-sm-6 p-0">
                              <div class="row m-0">
                                <div class="col-sm-4 align-self-stretch p-0">
                                  <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                    Email Address
                                  </div>
                                </div>
                                <div class="col-sm-6 align-self-stretch p-0">
                                  <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                    {currentLeadform &&
                                    Object.keys(currentLeadform).length !== 0
                                      ? currentLeadform["Company Email"]
                                      : leadFormData &&
                                        leadFormData.length !== 0
                                      ? leadFormData[0]["Company Email"]
                                      : "-"}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-3 col-sm-6 p-0">
                              <div class="row m-0">
                                <div class="col-sm-4 align-self-stretch p-0">
                                  <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                    Phone No
                                  </div>
                                </div>
                                <div class="col-sm-6 align-self-stretch p-0">
                                  <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                    {currentLeadform &&
                                    Object.keys(currentLeadform).length !== 0
                                      ? currentLeadform["Company Number"]
                                      : leadFormData &&
                                        leadFormData.length !== 0
                                      ? leadFormData[0]["Company Number"]
                                      : "-"}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row m-0 bdr-btm-eee">
                            <div className="col-lg-4 col-sm-6 p-0">
                              <div class="row m-0">
                                <div class="col-sm-6 align-self-stretch p-0">
                                  <div class="booking_inner_dtl_h h-100">
                                    Incorporation date
                                  </div>
                                </div>
                                <div class="col-sm-6 align-self-stretch p-0">
                                  <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                    {currentLeadform &&
                                    formatDatePro(Object.keys(currentLeadform).length !== 0
                                      ? currentLeadform.incoDate
                                      : leadFormData &&
                                        leadFormData.length !== 0
                                      ? leadFormData[0].incoDate
                                      : "-")}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-4 col-sm-6">
                              <div class="row m-0">
                                <div class="col-sm-5 align-self-stretch p-0">
                                  <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                    Company's PAN:
                                  </div>
                                </div>
                                <div class="col-sm-7 align-self-stretch p-0">
                                  <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                    {currentLeadform &&
                                    Object.keys(currentLeadform).length !== 0
                                      ? currentLeadform.panNumber
                                      : leadFormData &&
                                        leadFormData.length !== 0
                                      ? leadFormData[0].panNumber
                                      : "-"}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-4 col-sm-6">
                              <div class="row m-0">
                                <div class="col-sm-5 align-self-stretch p-0">
                                  <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                    Company's GST:
                                  </div>
                                </div>
                                <div class="col-sm-7 align-self-stretch p-0">
                                  <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                    {currentLeadform &&
                                    Object.keys(currentLeadform).length !== 0
                                      ? currentLeadform.gstNumber
                                      : leadFormData &&
                                        leadFormData.length !== 0
                                      ? leadFormData[0].gstNumber
                                      : "-"}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* --------If Multipal Booking (Bookign heading) ---------*/}
                      {currentLeadform &&
                        currentLeadform.moreBookings.length !== 0 && (
                          <div className="row align-items-center m-0 justify-content-between mb-1 mt-3">
                            <div className="mul_booking_heading col-6">
                              <b>Booking 1</b>
                            </div>
                            <div className="mul_booking_date col-6">
                              <b>
                                {formatDatePro(currentLeadform.bookingDate)}
                              </b>
                            </div>
                          </div>
                        )}
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
                                  <div class="col-sm-4 align-self-stretch p-0">
                                    <div class="booking_inner_dtl_h h-100">
                                      BDE Name
                                    </div>
                                  </div>
                                  <div class="col-sm-8 align-self-stretch p-0">
                                    <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                      {currentLeadform &&
                                        currentLeadform.bdeName}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-4 col-sm-6 p-0">
                                <div class="row m-0">
                                  <div class="col-sm-4 align-self-stretch p-0">
                                    <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                      BDE Email
                                    </div>
                                  </div>
                                  <div class="col-sm-8 align-self-stretch p-0">
                                    <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                      {currentLeadform &&
                                        currentLeadform.bdeEmail}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-4 col-sm-6 p-0">
                                <div class="row m-0">
                                  <div class="col-sm-4 align-self-stretch p-0">
                                    <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                      BDM Name
                                    </div>
                                  </div>
                                  <div class="col-sm-8 align-self-stretch p-0">
                                    <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                      {currentLeadform &&
                                        currentLeadform.bdmName}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="row m-0 bdr-btm-eee">
                              <div className="col-lg-4 col-sm-6 p-0">
                                <div class="row m-0">
                                  <div class="col-sm-4 align-self-stretch p-0">
                                    <div class="booking_inner_dtl_h h-100">
                                      BDM Email
                                    </div>
                                  </div>
                                  <div class="col-sm-8 align-self-stretch p-0">
                                    <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                      {currentLeadform &&
                                        currentLeadform.bdmEmail}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-4 col-sm-6 p-0">
                                <div class="row m-0">
                                  <div class="col-sm-4 align-self-stretch p-0">
                                    <div class="booking_inner_dtl_h h-100 bdr-left-eee">
                                      Booking Date{" "}
                                    </div>
                                  </div>
                                  <div class="col-sm-8 align-self-stretch p-0">
                                    <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                      {currentLeadform &&
                                        currentLeadform.bookingDate}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-4 col-sm-6 p-0">
                                <div class="row m-0">
                                  <div class="col-sm-4 align-self-stretch p-0">
                                    <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                      Lead Source
                                    </div>
                                  </div>
                                  <div class="col-sm-8 align-self-stretch p-0">
                                    <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                      {currentLeadform &&
                                        (currentLeadform.bookingSource ===
                                        "Other"
                                          ? currentLeadform.otherBookingSource
                                          : currentLeadform.bookingSource)}
                                    </div>
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
                                  <div class="col-sm-4 align-self-stretch p-0">
                                    <div class="booking_inner_dtl_h h-100">
                                      No. Of Services
                                    </div>
                                  </div>
                                  <div class="col-sm-8 align-self-stretch p-0">
                                    <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                      {currentLeadform &&
                                        currentLeadform.services.length}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {currentLeadform &&
                          currentLeadform.services.map((obj, index) => (
                            <div className="my-card mt-1">
                              <div className="my-card-body">
                                <div className="row m-0 bdr-btm-eee">
                                  <div className="col-lg-6 col-sm-6 p-0">
                                    <div class="row m-0">
                                      <div class="col-sm-4 align-self-stretch p-0">
                                        <div class="booking_inner_dtl_h h-100">
                                          {getOrdinal(index + 1)} Services Name
                                        </div>
                                      </div>
                                      <div class="col-sm-8 align-self-stretch p-0">
                                        <div class="booking_inner_dtl_b bdr-left-eee h-100 services-name">
                                          {obj.serviceName}{" "}
                                          {obj.withDSC && "With DSC"}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-sm-6 p-0">
                                    <div class="row m-0">
                                      <div class="col-sm-4 align-self-stretch p-0">
                                        <div class="booking_inner_dtl_h h-100 bdr-left-eee">
                                          Total Amount
                                        </div>
                                      </div>
                                      <div class="col-sm-8 align-self-stretch p-0">
                                        <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                          ₹ {obj.totalPaymentWGST}/- {"("}
                                          {obj.totalPaymentWGST !==
                                          obj.totalPaymentWOGST
                                            ? "With GST"
                                            : "Without GST"}
                                          {")"}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="row m-0 bdr-btm-eee">
                                  <div className="col-lg-6 col-sm-6 p-0">
                                    <div class="row m-0">
                                      <div class="col-sm-4 align-self-stretch p-0">
                                        <div class="booking_inner_dtl_h h-100">
                                          Payment Terms
                                        </div>
                                      </div>
                                      <div class="col-sm-8 align-self-stretch p-0">
                                        <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                          {obj.paymentTerms}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-sm-6 p-0">
                                    <div class="row m-0">
                                      <div class="col-sm-4 align-self-stretch p-0">
                                        <div class="booking_inner_dtl_h h-100 bdr-left-eee">
                                          Notes
                                        </div>
                                      </div>
                                      <div class="col-sm-8 align-self-stretch p-0">
                                        <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                          {obj.paymentRemarks
                                            ? obj.paymentRemarks
                                            : "N/A"}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="row m-0 bdr-btm-eee">
                                  {obj.firstPayment !== 0 && (
                                    <div className="col-lg-6 col-sm-6 p-0">
                                      <div class="row m-0">
                                        <div class="col-sm-4 align-self-stretch p-0">
                                          <div class="booking_inner_dtl_h h-100">
                                            First payment
                                          </div>
                                        </div>
                                        <div class="col-sm-8 align-self-stretch p-0">
                                          <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                            ₹{" "}
                                            {Number(obj.firstPayment).toFixed(
                                              2
                                            )}
                                            /-
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  {obj.secondPayment !== 0 && (
                                    <div className="col-lg-6 col-sm-6 p-0">
                                      <div class="row m-0">
                                        <div class="col-sm-4 align-self-stretch p-0">
                                          <div class="booking_inner_dtl_h h-100 bdr-left-eee">
                                            Second Paymnet
                                          </div>
                                        </div>
                                        <div class="col-sm-8 align-self-stretch p-0">
                                          <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                            ₹
                                            {Number(obj.secondPayment).toFixed(
                                              2
                                            )}
                                            /- {"("}
                                            {isNaN(
                                              new Date(obj.secondPaymentRemarks)
                                            )
                                              ? obj.secondPaymentRemarks
                                              : "On " +
                                                obj.secondPaymentRemarks +
                                                ")"}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div className="row m-0 bdr-btm-eee">
                                  {obj.thirdPayment !== 0 && (
                                    <div className="col-lg-6 col-sm-6 p-0">
                                      <div class="row m-0">
                                        <div class="col-sm-4 align-self-stretch p-0">
                                          <div class="booking_inner_dtl_h h-100">
                                            Third Payment
                                          </div>
                                        </div>
                                        <div class="col-sm-8 align-self-stretch p-0">
                                          <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                            ₹{" "}
                                            {Number(obj.thirdPayment).toFixed(
                                              2
                                            )}
                                            /- {"("}
                                            {isNaN(
                                              new Date(obj.thirdPaymentRemarks)
                                            )
                                              ? obj.thirdPaymentRemarks
                                              : "On " +
                                                obj.thirdPaymentRemarks +
                                                ")"}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  {obj.fourthPayment !== 0 && (
                                    <div className="col-lg-6 col-sm-6 p-0">
                                      <div class="row m-0">
                                        <div class="col-sm-4 align-self-stretch p-0">
                                          <div class="booking_inner_dtl_h h-100 bdr-left-eee">
                                            Fourth Payment
                                          </div>
                                        </div>
                                        <div class="col-sm-8 align-self-stretch p-0">
                                          <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                            ₹{" "}
                                            {Number(obj.fourthPayment).toFixed(
                                              2
                                            )}{" "}
                                            /- {"("}
                                            {isNaN(
                                              new Date(obj.fourthPaymentRemarks)
                                            )
                                              ? obj.fourthPaymentRemarks
                                              : "On " +
                                                obj.fourthPaymentRemarks +
                                                ")"}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        {/* -------- Step 4 ---------*/}
                        <div className="mb-2 mt-3 mul-booking-card-inner-head">
                          <b>Payment Summary:</b>
                        </div>
                        <div className="my-card">
                          <div className="my-card-body">
                            <div className="row m-0 bdr-btm-eee">
                              <div className="col-lg-4 col-sm-6 p-0">
                                <div class="row m-0">
                                  <div class="col-sm-5 align-self-stretch p-0">
                                    <div class="booking_inner_dtl_h h-100">
                                      Total Amount
                                    </div>
                                  </div>
                                  <div class="col-sm-7 align-self-stretch p-0">
                                    <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                      ₹{" "}
                                      {currentLeadform &&
                                        Number(
                                          currentLeadform.totalAmount
                                        ).toFixed(2)}
                                      /-
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-4 col-sm-6 p-0">
                                <div class="row m-0">
                                  <div class="col-sm-5 align-self-stretch p-0">
                                    <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                      Received Amount
                                    </div>
                                  </div>
                                  <div class="col-sm-7 align-self-stretch p-0">
                                    <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                      ₹{" "}
                                      {currentLeadform &&
                                        Number(
                                          currentLeadform.receivedAmount
                                        ).toFixed(2)}
                                      /-
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-4 col-sm-6 p-0">
                                <div class="row m-0">
                                  <div class="col-sm-5 align-self-stretch p-0">
                                    <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                      Pending Amount
                                    </div>
                                  </div>
                                  <div class="col-sm-7 align-self-stretch p-0">
                                    <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                      ₹{" "}
                                      {currentLeadform &&
                                        Number(
                                          currentLeadform.pendingAmount
                                        ).toFixed(2)}
                                      /-
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="row m-0 bdr-btm-eee">
                              <div className="col-lg-6 col-sm-6 p-0">
                                <div class="row m-0">
                                  <div class="col-sm-4 align-self-stretch p-0">
                                    <div class="booking_inner_dtl_h h-100">
                                      Payment Method
                                    </div>
                                  </div>
                                  <div class="col-sm-8 align-self-stretch p-0">
                                    <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                      {currentLeadform &&
                                        currentLeadform.paymentMethod}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-6 col-sm-6 p-0">
                                <div class="row m-0">
                                  <div class="col-sm-4 align-self-stretch p-0">
                                    <div class="booking_inner_dtl_h h-100 bdr-left-eee">
                                      Extra Remarks
                                    </div>
                                  </div>
                                  <div class="col-sm-8 align-self-stretch p-0">
                                    <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                      {currentLeadform &&
                                        currentLeadform.extraNotes}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mb-2 mt-3 mul-booking-card-inner-head">
                          <b>Payment Receipt and Additional Documents:</b>
                        </div>
                        <div className="row">
                          <div className="col-sm-2 mb-1">
                            <div className="booking-docs-preview">
                              <div
                                className="booking-docs-preview-img"
                                onClick={() =>
                                  handleViewPdfReciepts(
                                    currentLeadform &&
                                      currentLeadform.paymentReceipt[0].filename
                                  )
                                }
                              >
                                {currentLeadform &&
                                currentLeadform.paymentReceipt[0].filename.endsWith(
                                  ".pdf"
                                ) ? (
                                  <PdfImageViewerAdmin
                                    type="pdf"
                                    path={
                                      currentLeadform &&
                                      currentLeadform.paymentReceipt[0].filename
                                    }
                                  />
                                ) : (
                                  <img
                                    src={`${secretKey}/recieptpdf/${
                                      currentLeadform &&
                                      currentLeadform.paymentReceipt[0].filename
                                    }`}
                                    alt={"MyImg"}
                                  ></img>
                                )}
                              </div>
                              <div className="booking-docs-preview-text">
                                <p className="rematkText text-wrap m-auto m-0">
                                  Receipt.pdf
                                </p>
                              </div>
                            </div>
                          </div>
                          {currentLeadform &&
                            currentLeadform.otherDocs.map((obj) => (
                              <div className="col-sm-2 mb-1">
                                <div className="booking-docs-preview">
                                  <div
                                    className="booking-docs-preview-img"
                                    onClick={() =>
                                      handleViewPdOtherDocs(obj.filename)
                                    }
                                  >
                                    {obj.filename.endsWith(".pdf") ? (
                                      <PdfImageViewerAdmin
                                        type="pdf"
                                        path={obj.filename}
                                      />
                                    ) : (
                                      <img
                                        src={`${secretKey}/otherpdf/${obj.filename}`}
                                        alt={pdfimg}
                                      ></img>
                                    )}
                                  </div>
                                  <div className="booking-docs-preview-text">
                                    <p className="rematkText text-wrap m-auto m-0">
                                      {obj.originalname}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* ------------------------------------------ Multiple Booking Section Starts here ----------------------------- */}
                      {currentLeadform && currentLeadform.moreBookings.length!==0 && currentLeadform.moreBookings.map((objMain,index)=>(
<>
<div className="row align-items-center m-0 justify-content-between mb-1 mt-3">
                            <div className="mul_booking_heading col-6">
                              <b>Booking {index+2}</b>
                            </div>
                            <div className="mul_booking_date col-6">
                              <b>
                                {formatDatePro(objMain.bookingDate)}
                              </b>
                            </div>
                          </div>                                                    
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
          <div class="col-sm-4 align-self-stretch p-0">
            <div class="booking_inner_dtl_h h-100">
              BDE Name
            </div>
          </div>
          <div class="col-sm-8 align-self-stretch p-0">
            <div class="booking_inner_dtl_b h-100 bdr-left-eee">
              {objMain.bdeName}
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-4 col-sm-6 p-0">
        <div class="row m-0">
          <div class="col-sm-4 align-self-stretch p-0">
            <div class="booking_inner_dtl_h bdr-left-eee h-100">
              BDE Email
            </div>
          </div>
          <div class="col-sm-8 align-self-stretch p-0">
            <div class="booking_inner_dtl_b bdr-left-eee h-100">
              {objMain.bdeEmail}
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-4 col-sm-6 p-0">
        <div class="row m-0">
          <div class="col-sm-4 align-self-stretch p-0">
            <div class="booking_inner_dtl_h bdr-left-eee h-100">
              BDM Name
            </div>
          </div>
          <div class="col-sm-8 align-self-stretch p-0">
            <div class="booking_inner_dtl_b bdr-left-eee h-100">
              {objMain.bdmName}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="row m-0 bdr-btm-eee">
      <div className="col-lg-4 col-sm-6 p-0">
        <div class="row m-0">
          <div class="col-sm-4 align-self-stretch p-0">
            <div class="booking_inner_dtl_h h-100">
              BDM Email
            </div>
          </div>
          <div class="col-sm-8 align-self-stretch p-0">
            <div class="booking_inner_dtl_b bdr-left-eee h-100">
              {objMain.bdmEmail}
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-4 col-sm-6 p-0">
        <div class="row m-0">
          <div class="col-sm-4 align-self-stretch p-0">
            <div class="booking_inner_dtl_h h-100 bdr-left-eee">
              Booking Date{" "}
            </div>
          </div>
          <div class="col-sm-8 align-self-stretch p-0">
            <div class="booking_inner_dtl_b h-100 bdr-left-eee">
              {objMain.bookingDate}
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-4 col-sm-6 p-0">
        <div class="row m-0">
          <div class="col-sm-4 align-self-stretch p-0">
            <div class="booking_inner_dtl_h bdr-left-eee h-100">
              Lead Source
            </div>
          </div>
          <div class="col-sm-8 align-self-stretch p-0">
            <div class="booking_inner_dtl_b bdr-left-eee h-100">
              {
                (objMain.bookingSource ===
                "Other"
                  ? objMain.otherBookingSource
                  : objMain.bookingSource)}
            </div>
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
          <div class="col-sm-4 align-self-stretch p-0">
            <div class="booking_inner_dtl_h h-100">
              No. Of Services
            </div>
          </div>
          <div class="col-sm-8 align-self-stretch p-0">
            <div class="booking_inner_dtl_b h-100 bdr-left-eee">
              {objMain.services.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
{objMain.services.map((obj, index) => (
    <div className="my-card mt-1">
      <div className="my-card-body">
        <div className="row m-0 bdr-btm-eee">
          <div className="col-lg-6 col-sm-6 p-0">
            <div class="row m-0">
              <div class="col-sm-4 align-self-stretch p-0">
                <div class="booking_inner_dtl_h h-100">
                  {getOrdinal(index + 1)} Services Name
                </div>
              </div>
              <div class="col-sm-8 align-self-stretch p-0">
                <div class="booking_inner_dtl_b bdr-left-eee h-100 services-name">
                  {obj.serviceName}{" "}
                  {obj.withDSC && "With DSC"}
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-sm-6 p-0">
            <div class="row m-0">
              <div class="col-sm-4 align-self-stretch p-0">
                <div class="booking_inner_dtl_h h-100 bdr-left-eee">
                  Total Amount
                </div>
              </div>
              <div class="col-sm-8 align-self-stretch p-0">
                <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                  ₹ {obj.totalPaymentWGST}/- {"("}
                  {obj.totalPaymentWGST !==
                  obj.totalPaymentWOGST
                    ? "With GST"
                    : "Without GST"}
                  {")"}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row m-0 bdr-btm-eee">
          <div className="col-lg-6 col-sm-6 p-0">
            <div class="row m-0">
              <div class="col-sm-4 align-self-stretch p-0">
                <div class="booking_inner_dtl_h h-100">
                  Payment Terms
                </div>
              </div>
              <div class="col-sm-8 align-self-stretch p-0">
                <div class="booking_inner_dtl_b bdr-left-eee h-100">
                  {obj.paymentTerms}
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-sm-6 p-0">
            <div class="row m-0">
              <div class="col-sm-4 align-self-stretch p-0">
                <div class="booking_inner_dtl_h h-100 bdr-left-eee">
                  Notes
                </div>
              </div>
              <div class="col-sm-8 align-self-stretch p-0">
                <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                  {obj.paymentRemarks
                    ? obj.paymentRemarks
                    : "N/A"}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row m-0 bdr-btm-eee">
          {obj.firstPayment !== 0 && (
            <div className="col-lg-6 col-sm-6 p-0">
              <div class="row m-0">
                <div class="col-sm-4 align-self-stretch p-0">
                  <div class="booking_inner_dtl_h h-100">
                    First payment
                  </div>
                </div>
                <div class="col-sm-8 align-self-stretch p-0">
                  <div class="booking_inner_dtl_b bdr-left-eee h-100">
                    ₹{" "}
                    {Number(obj.firstPayment).toFixed(
                      2
                    )}
                    /-
                  </div>
                </div>
              </div>
            </div>
          )}
          {obj.secondPayment !== 0 && (
            <div className="col-lg-6 col-sm-6 p-0">
              <div class="row m-0">
                <div class="col-sm-4 align-self-stretch p-0">
                  <div class="booking_inner_dtl_h h-100 bdr-left-eee">
                    Second Paymnet
                  </div>
                </div>
                <div class="col-sm-8 align-self-stretch p-0">
                  <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                    ₹
                    {Number(obj.secondPayment).toFixed(
                      2
                    )}
                    /- {"("}
                    {isNaN(
                      new Date(obj.secondPaymentRemarks)
                    )
                      ? obj.secondPaymentRemarks
                      : "On " +
                        obj.secondPaymentRemarks +
                        ")"}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="row m-0 bdr-btm-eee">
          {obj.thirdPayment !== 0 && (
            <div className="col-lg-6 col-sm-6 p-0">
              <div class="row m-0">
                <div class="col-sm-4 align-self-stretch p-0">
                  <div class="booking_inner_dtl_h h-100">
                    Third Payment
                  </div>
                </div>
                <div class="col-sm-8 align-self-stretch p-0">
                  <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                    ₹{" "}
                    {Number(obj.thirdPayment).toFixed(
                      2
                    )}
                    /- {"("}
                    {isNaN(
                      new Date(obj.thirdPaymentRemarks)
                    )
                      ? obj.thirdPaymentRemarks
                      : "On " +
                        obj.thirdPaymentRemarks +
                        ")"}
                  </div>
                </div>
              </div>
            </div>
          )}
          {obj.fourthPayment !== 0 && (
            <div className="col-lg-6 col-sm-6 p-0">
              <div class="row m-0">
                <div class="col-sm-4 align-self-stretch p-0">
                  <div class="booking_inner_dtl_h h-100 bdr-left-eee">
                    Fourth Payment
                  </div>
                </div>
                <div class="col-sm-8 align-self-stretch p-0">
                  <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                    ₹{" "}
                    {Number(obj.fourthPayment).toFixed(
                      2
                    )}{" "}
                    /- {"("}
                    {isNaN(
                      new Date(obj.fourthPaymentRemarks)
                    )
                      ? obj.fourthPaymentRemarks
                      : "On " +
                        obj.fourthPaymentRemarks +
                        ")"}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  ))}
{/* -------- Step 4 ---------*/}
<div className="mb-2 mt-3 mul-booking-card-inner-head">
  <b>Payment Summary:</b>
</div>
<div className="my-card">
  <div className="my-card-body">
    <div className="row m-0 bdr-btm-eee">
      <div className="col-lg-4 col-sm-6 p-0">
        <div class="row m-0">
          <div class="col-sm-5 align-self-stretchh p-0">
            <div class="booking_inner_dtl_h h-100">
              Total Amount
            </div>
          </div>
          <div class="col-sm-7 align-self-stretchh p-0">
            <div class="booking_inner_dtl_b h-100 bdr-left-eee">
              ₹{" "}
              {
                Number(
                  objMain.totalAmount
                ).toFixed(2)}
              /-
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-4 col-sm-6 p-0">
        <div class="row m-0">
          <div class="col-sm-5 align-self-stretch p-0">
            <div class="booking_inner_dtl_h bdr-left-eee h-100">
              Received Amount
            </div>
          </div>
          <div class="col-sm-7 align-self-stretch p-0">
            <div class="booking_inner_dtl_b bdr-left-eee h-100">
              ₹{" "}
              {
                Number(
                  objMain.receivedAmount
                ).toFixed(2)}
              /-
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-4 col-sm-6 p-0">
        <div class="row m-0">
          <div class="col-sm-5 align-self-stretch p-0">
            <div class="booking_inner_dtl_h bdr-left-eee h-100">
              Pending Amount
            </div>
          </div>
          <div class="col-sm-7 align-self-stretch p-0">
            <div class="booking_inner_dtl_b bdr-left-eee h-100">
              ₹{" "}
              {
                Number(
                  objMain.pendingAmount
                ).toFixed(2)}
              /-
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="row m-0 bdr-btm-eee">
      <div className="col-lg-6 col-sm-6 p-0">
        <div class="row m-0">
          <div class="col-sm-4 align-self-stretch p-0">
            <div class="booking_inner_dtl_h h-100">
              Payment Method
            </div>
          </div>
          <div class="col-sm-8 align-self-stretch p-0">
            <div class="booking_inner_dtl_b h-100 bdr-left-eee">
              {objMain.paymentMethod}
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-6 col-sm-6 p-0">
        <div class="row m-0">
          <div class="col-sm-4 align-self-stretch p-0">
            <div class="booking_inner_dtl_h h-100 bdr-left-eee">
              Extra Remarks
            </div>
          </div>
          <div class="col-sm-8 align-self-stretch p-0">
            <div class="booking_inner_dtl_b h-100 bdr-left-eee">
              {objMain.extraNotes}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<div className="mb-2 mt-3 mul-booking-card-inner-head">
  <b>Payment Receipt and Additional Documents:</b>
</div>
<div className="row">
  <div className="col-sm-2 mb-1">
    <div className="booking-docs-preview">
      <div
        className="booking-docs-preview-img"
        onClick={() =>
          handleViewPdfReciepts(
            objMain.paymentReceipt[0].filename
          )
        }
      >
        {objMain.paymentReceipt[0].filename.endsWith(
          ".pdf"
        ) ? (
          <PdfImageViewerAdmin
            type="pdf"
            path={
              objMain.paymentReceipt[0].filename
            }
          />
        ) : (
          <img
            src={`${secretKey}/recieptpdf/${
              objMain.paymentReceipt[0].filename
            }`}
            alt={"MyImg"}
          ></img>
        )}
      </div>
      <div className="booking-docs-preview-text">
        <p className="rematkText text-wrap m-auto m-0">
          Receipt.pdf
        </p>
      </div>
    </div>
  </div>
  {objMain.otherDocs.map((obj) => (
      <div className="col-sm-2 mb-1">
        <div className="booking-docs-preview">
          <div
            className="booking-docs-preview-img"
            onClick={() =>
              handleViewPdOtherDocs(obj.filename)
            }
          >
            {obj.filename.endsWith(".pdf") ? (
              <PdfImageViewerAdmin
                type="pdf"
                path={obj.filename}
              />
            ) : (
              <img
                src={`${secretKey}/otherpdf/${obj.filename}`}
                alt={pdfimg}
              ></img>
            )}
          </div>
          <div className="booking-docs-preview-text">
            <p className="rematkText text-wrap m-auto m-0">
              {obj.originalname}
            </p>
          </div>
        </div>
      </div>
    ))}
</div>
</div>
</>

                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
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
