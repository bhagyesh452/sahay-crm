import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RmofCertificationHeader from "../RM-CERT-COMPONENTS/RmofCertificationHeader";
import RmCertificationNavbar from "../RM-CERT-COMPONENTS/RmCertificationNavbar";
import { SlActionRedo } from "react-icons/sl";
import { IoDocumentTextOutline } from "react-icons/io5";
import { options } from '../../components/Options.js';
import Nodata from '../../components/Nodata.jsx';
import { GrClose } from "react-icons/gr";
import { FaCheck } from "react-icons/fa6";
import wordimg from "../../static/my-images/word.png";
import PdfImageViewerAdmin from "../../admin/PdfViewerAdmin.jsx";
import pdfimg from "../../static/my-images/pdf.png";
import { FcList } from "react-icons/fc";
import RemainingAmnt from "../../static/my-images/money.png";



function RmofCertificationAllBookings({ setOpenAllBookingPanel, completeData }) {


    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const [employeeData, setEmployeeData] = useState([])
    const [currentLeadform, setCurrentLeadform] = useState(null);
    const defaultLeadData = {
        "Company Name": "",
        "Company Number": 0,
        "Company Email": "",
        panNumber: "",
        bdeName: "",
        bdeEmail: "",
        bdmName: "",
        bdmType: "Close-by",
        bookingDate: "",
        paymentMethod: "",
        caCase: false,
        caNumber: 0,
        caEmail: "",
        serviceName: "",
        totalPaymentWOGST: 0,
        totalPaymentWGST: 0,
        withGST: "",
        firstPayment: 0,
        secondPayment: 0,
        thirdPayment: 0,
        fourthPayment: 0,
        secondPaymentRemarks: "",
        thirdPaymentRemarks: "",
        fourthPaymentRemarks: "",
    };

    const rmCertificationUserId = localStorage.getItem("rmCertificationUserId")

    //---------date format------------------------

    function formatDatePro(inputDate) {
        const options = { year: "numeric", month: "long", day: "numeric" };
        const formattedDate = new Date(inputDate).toLocaleDateString(
            "en-US",
            options
        );
        return formattedDate;
    }

    const formatTime = (dateString) => {
        //const dateString = "Sat Jun 29 2024 15:15:12 GMT+0530 (India Standard Time)";
        const date = new Date(dateString)
        let hours = date.getHours();
        let minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'pm' : 'am';

        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;

        const strTime = `${hours}:${minutes} ${ampm}`;
        return strTime;
    }


    useEffect(() => {
        document.title = `AdminHead-Sahay-CRM`;
    }, []);


    //---------------------fetching employee data---------------------------------------
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

    //--------fetching booking data by default date should be operation date of rm portal date-------------------------------
    const [redesignedData, setRedesignedData] = useState([]);
    const [leadFormData, setLeadFormData] = useState([]);
    const [currentCompanyName, setCurrentCompanyName] = useState("");
    const [activeIndex, setActiveIndex] = useState(0);
    const [activeIndexBooking, setActiveIndexBooking] = useState(0)
    const [activeIndexMoreBookingServices, setActiveIndexMoreBookingServices] = useState(0)

    const fetchRedesignedFormData = async (page) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of today

        try {

            const response = await axios.get(
                `${secretKey}/bookings/redesigned-final-leadData`
            );

            const filteredAndSortedData = response.data
                .sort((a, b) => {
                    const dateA = new Date(a.lastActionDate);
                    const dateB = new Date(b.lastActionDate);
                    return dateB - dateA; // Sort in descending order
                });

            setRedesignedData(filteredAndSortedData);
            setLeadFormData(filteredAndSortedData)
            //setCurrentCompanyName(filteredAndSortedData[0]["Company Name"])
        } catch (error) {
            console.error("Error fetching data:", error.message);
        }
    };

    useEffect(() => {
        fetchRedesignedFormData();
    }, []);

    //-----------------services array-----------------------------

    const certificationLabels = [
        "Start-Up India Certificate",
        "MSME/UDYAM Certificate",
        "ISO Certificate",
        "IEC CODE Certificate",
        "BIS Certificate",
        "NSIC Certificate",
        "FSSAI Certificate",
        "APEDA Certificate",
        "GST Certificate",
        "Company Incorporation",
        "Trademark Registration",
        "Copyright Registration",
        "Patent Registration",
        "Organization DSC",
        "Director DSC",
        "Self Certification",
        "GeM"
    ];

    // Filter certification options
    const certificationOptions = options.filter(option =>
        certificationLabels.includes(option.label)
    );

    useEffect(() => {
        if (currentCompanyName === "") {
            setCurrentLeadform(completeData[0]);
            setActiveIndex(0)
            setActiveIndexBooking(1)
            setActiveIndexMoreBookingServices(0)
        }
    }, [completeData]);

    //------- to caluclate total , recieved and pemding amount ---------------------

    function calculateTotalAmount(obj) {
        let total = parseInt(obj.totalAmount);
        if (obj.moreBookings && obj.moreBookings.length > 0) {
            total += obj.moreBookings.reduce(
                (acc, curr) => acc + parseInt(curr.totalAmount),
                0
            )
        }
        return total.toFixed(2)
    }

    function calculateReceivedAmount(obj) {
        let total = parseInt(obj.receivedAmount);
        if (obj.moreBookings && obj.moreBookings.length !== 0) {
            total += obj.moreBookings.reduce(
                (acc, curr) => acc + parseInt(curr.receivedAmount),
                0
            )
        }
        return total.toFixed(2)
    }

    const calculatePendingAmount = (obj) => {
        let pending = parseInt(obj.pendingAmount);
        if (obj.moreBookings && obj.moreBookings.length > 0) {
            pending += obj.moreBookings.reduce(
                (acc, booking) => acc + parseInt(booking.pendingAmount),
                0
            );
        }
        return pending.toFixed(2);
    };

    const handleViewPdfReceipts = (paymentreciept, companyName) => {
        const pathname = paymentreciept;
        //console.log(pathname);
        window.open(`${secretKey}/bookings/recieptpdf/${companyName}/${pathname}`, "_blank");
    };

    const handleViewPdOtherDocs = (pdfurl, companyName) => {
        const pathname = pdfurl;
        console.log(pathname);
        window.open(`${secretKey}/bookings/otherpdf/${companyName}/${pathname}`, "_blank");
    };

    // -------------------swapping function for rm-------------------

    const [openServicesPopup, setOpenServicesPopup] = useState(false)
    const [selectServices, setSelectServices] = useState([]);
    const [serviceNames, setServiceNames] = useState([])
    const [selectedServices, setSelectedServices] = useState([]);
    const [selectedCompanyName, setSelectedCompanyName] = useState("")
    const [dataToSend, setDataToSend] = useState(defaultLeadData)
    const [selectedCompanyData, setSelectedCompanyData] = useState([]);



    const handleCloseServicesPopup = () => {
        setOpenServicesPopup(false)
        setSelectedServices([])
        setSelectedCompanyName("")
        setSelectedCompanyData([])
        setDataToSend(defaultLeadData)
    }

    // const handleOpenServices = (companyName) => {
    //     // Filter the mainDataSwap array to get the companies that match the provided companyName
    //     setSelectedCompanyName(companyName)
    //     const selectedServices = mainDataSwap
    //       .filter((company) => company["Company Name"] === companyName)
    //       .flatMap((company) => {
    //         if (company.moreBookings.length !== 0) {
    //           return [
    //             ...company.services,
    //             ...company.moreBookings.flatMap((item) => item.services),
    //           ];
    //         } else {
    //           return company.services || [];
    //         }
    //       });
    //     //console.log("new slecetd", selectedServices)
    //     // Map through the selected services to get the service names
    //     const servicesNames = selectedServices.map((service) => service.serviceName);
    //     // Log the selected services and service names
    //     setServiceNames(servicesNames)
    //   };


    // console.log("leadformdata", leadFormData)
    // console.log("currentleadform", currentLeadform)

    return (
        <div>
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
                                <button className='btn btn-primary' onClick={() => setOpenAllBookingPanel(false)}>Recieved Box</button>
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
                                        {completeData.length !== 0 &&
                                            completeData.map((obj, index) => (
                                                <div
                                                    className={
                                                        currentLeadform &&
                                                            currentLeadform["Company Name"] ===
                                                            obj["Company Name"]
                                                            ? "bookings_Company_Name activeBox"
                                                            : "bookings_Company_Name"
                                                    }
                                                    onClick={() => {

                                                        setCurrentLeadform(
                                                            completeData.find(
                                                                (data) =>
                                                                    data["Company Name"] === obj["Company Name"]
                                                            )
                                                        )

                                                    }
                                                    }
                                                >
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div className="b_cmpny_name cName-text-wrap">
                                                            {obj["Company Name"]}
                                                        </div>
                                                        <div className="b_cmpny_time">
                                                            {
                                                                formatDatePro(
                                                                    obj.moreBookings &&
                                                                        obj.moreBookings.length !== 0
                                                                        ? obj.moreBookings[
                                                                            obj.moreBookings.length - 1
                                                                        ].bookingDate // Get the latest bookingDate from moreBookings
                                                                        : obj.bookingDate
                                                                ) // Use obj.bookingDate if moreBookings is empty or not present
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="d-flex justify-content-between align-items-center mt-2">
                                                        <div className="b_Services_name d-flex flex-wrap">
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
                                                                    .slice(0, 3) // Limit to first 3 services
                                                                    .map((service, index, array) => (
                                                                        <>
                                                                            <div
                                                                                className="sname mb-1"
                                                                                key={service.serviceId}
                                                                            >
                                                                                {service.serviceName}
                                                                            </div>

                                                                            {index === 2 &&
                                                                                Math.max(
                                                                                    obj.services.length +
                                                                                    obj.moreBookings.length -
                                                                                    3,
                                                                                    0
                                                                                ) !== 0 && (
                                                                                    <div className="sname mb-1">
                                                                                        {`+${Math.max(
                                                                                            obj.services.length +
                                                                                            obj.moreBookings.length -
                                                                                            3,
                                                                                            0
                                                                                        )}`}
                                                                                    </div>
                                                                                )}
                                                                        </>
                                                                    ))}
                                                        </div>
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            {(obj.remainingPayments.length !== 0 || obj.moreBookings.some((moreObj) => moreObj.remainingPayments.length !== 0)) &&
                                                                <div className="b_Service_remaining_receive" title="remaining Payment Received">
                                                                    <img src={RemainingAmnt}></img>
                                                                </div>}
                                                            {obj.moreBookings.length !== 0 && (
                                                                <div
                                                                    className="b_Services_multipal_services"
                                                                    title="Multipal Bookings"
                                                                >
                                                                    <FcList />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="d-flex justify-content-between align-items-center mt-2">
                                                        <div className="b_Services_amount d-flex">
                                                            <div className="amount total_amount_bg">
                                                                Total: ₹ {parseInt(calculateTotalAmount(obj)).toLocaleString()}
                                                            </div>
                                                            <div className="amount receive_amount_bg">
                                                                Received: ₹ {parseInt(calculateReceivedAmount(obj)).toLocaleString()}
                                                            </div>
                                                            <div className="amount pending_amount_bg">
                                                                Pending: ₹ {parseInt(calculatePendingAmount(obj)).toLocaleString()}
                                                            </div>
                                                        </div>
                                                        <div className="b_BDE_name">{obj.bdeName}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        {completeData.length === 0 && (
                                            <div
                                                className="d-flex align-items-center justify-content-center"
                                                style={{ height: "inherit" }}
                                            >
                                                <Nodata />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {/* --------booking Details Right Part---------*/}
                            <div className="col-8 p-0">
                                <div className="booking-deatils-card">
                                    <div className="booking-deatils-heading">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="b_dtl_C_name">{currentLeadform &&
                                                Object.keys(currentLeadform).length !== 0
                                                ? currentLeadform["Company Name"]
                                                : completeData && completeData.length !== 0
                                                    ? completeData[0]["Company Name"]
                                                    : "-"}</div>
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
                                                            Total Booking :
                                                            <b>
                                                                {Array.isArray(currentLeadform?.moreBookings) && currentLeadform.moreBookings.length !== 0
                                                                    ? currentLeadform.moreBookings.length + 1
                                                                    : 1}
                                                            </b>
                                                        </div>
                                                        <div className='rm_total_services'>
                                                            Total Services :
                                                            <b>
                                                                {currentLeadform && (currentLeadform.services.length !== 0 || currentLeadform.moreBookings.length !== 0) ? (
                                                                    [
                                                                        ...currentLeadform.services,
                                                                        ...(currentLeadform.moreBookings || []).flatMap(booking => booking.services)
                                                                    ].length
                                                                ) : null}
                                                            </b>
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
                                                                    {currentLeadform &&
                                                                        Object.keys(currentLeadform).length !== 0
                                                                        ? currentLeadform["Company Name"]
                                                                        : leadFormData && leadFormData.length !== 0
                                                                            ? leadFormData[0]["Company Name"]
                                                                            : "-"}
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
                                                                    {currentLeadform &&
                                                                        Object.keys(currentLeadform).length !== 0
                                                                        ? currentLeadform["Company Email"]
                                                                        : leadFormData && leadFormData.length !== 0
                                                                            ? leadFormData[0]["Company Email"]
                                                                            : "-"}
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
                                                    <div class="col-lg-4 col-sm-6 p-0 align-self-stretch">
                                                        <div class="row m-0 h-100 bdr-btm-eee">
                                                            <div class="col-lg-7 align-self-stretch p-0">
                                                                <div class="booking_inner_dtl_h bdr-left-eee h-100">Incorporation date</div>
                                                            </div>
                                                            <div class="col-lg-5 align-self-stretch p-0">
                                                                <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                                                    {currentLeadform &&
                                                                        formatDatePro(
                                                                            Object.keys(currentLeadform).length !==
                                                                                0
                                                                                ? currentLeadform.incoDate
                                                                                : leadFormData &&
                                                                                    leadFormData.length !== 0
                                                                                    ? leadFormData[0].incoDate
                                                                                    : "-"
                                                                        )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-4 col-sm-12 p-0 align-self-stretch">
                                                        <div class="row m-0 h-100 bdr-btm-eee">
                                                            <div class="col-lg-5 align-self-stretch p-0">
                                                                <div class="booking_inner_dtl_h bdr-left-eee h-100">PAN/GST</div>
                                                            </div>
                                                            <div class="col-lg-7 align-self-stretch p-0">
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
                                                </div>
                                                <div class="row m-0">
                                                    <div class="col-lg-4 col-sm-6 p-0">
                                                        <div class="row m-0 ">
                                                            <div class="col-lg-4 align-self-stretc p-0">
                                                                <div class="booking_inner_dtl_h h-100">Total</div>
                                                            </div>
                                                            <div class="col-lg-8 align-self-stretc p-0">
                                                                {currentLeadform && <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                                                    ₹ {parseInt(calculateTotalAmount(currentLeadform)).toLocaleString()}
                                                                </div>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-4 col-sm-6 p-0">
                                                        <div class="row m-0 ">
                                                            <div class="col-lg-4 align-self-stretc p-0">
                                                                <div class="booking_inner_dtl_h bdr-left-eee h-100">Received</div>
                                                            </div>
                                                            <div class="col-lg-8 align-self-stretc p-0">
                                                                {currentLeadform && <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                                                    ₹ {parseInt(calculateReceivedAmount(currentLeadform)).toLocaleString()}
                                                                </div>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-4 col-sm-6 p-0">
                                                        <div class="row m-0">
                                                            <div class="col-lg-4 align-self-stretc p-0">
                                                                <div class="booking_inner_dtl_h bdr-left-eee h-100">Pending</div>
                                                            </div>
                                                            <div class="col-lg-8 align-self-stretc p-0">
                                                                {currentLeadform &&
                                                                    <div class="booking_inner_dtl_b bdr-left-eee h-100">

                                                                        ₹ {parseInt(calculatePendingAmount(currentLeadform)).toLocaleString()}

                                                                    </div>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='rm_all_bkng_right mt-3'>
                                            <ul className="nav nav-tabs rm_bkng_items align-items-center">
                                                {currentLeadform && currentLeadform.moreBookings && currentLeadform.moreBookings.length !== 0 ? (
                                                    <>
                                                        <li className="nav-item rm_bkng_item_no">
                                                            <a
                                                                className={activeIndexBooking === 1 ? "nav-link active" : "nav-link"}
                                                                data-bs-toggle="tab"
                                                                href="#Booking_1"
                                                                onClick={() => {
                                                                    setActiveIndex(0);
                                                                    setActiveIndexBooking(1);
                                                                }}
                                                            >
                                                                Booking 1
                                                            </a>
                                                        </li>
                                                        {currentLeadform.moreBookings.map((obj, index) => (
                                                            <li key={index} className="nav-item rm_bkng_item_no">
                                                                <a
                                                                    className={index + 2 === activeIndexBooking ? "nav-link active" : "nav-link"}
                                                                    data-bs-toggle="tab"
                                                                    href={`#Booking_${index + 2}`}
                                                                    onClick={() => {
                                                                        setActiveIndex(0);
                                                                        setActiveIndexMoreBookingServices(0);
                                                                        setActiveIndexBooking(index + 2);
                                                                    }}
                                                                >
                                                                    Booking {index + 2}
                                                                </a>
                                                            </li>
                                                        ))}
                                                        {activeIndexBooking === 1 ? (
                                                            <li className="nav-item rm_bkng_item_no ms-auto">
                                                                <div className="rm_bkng_item_no nav-link clr-ff8800">
                                                                    {currentLeadform.bookingPublishDate
                                                                        ? `${formatDatePro(currentLeadform.bookingPublishDate)} at ${formatTime(currentLeadform.bookingPublishDate)}`
                                                                        : 'No Date Available'}
                                                                </div>
                                                            </li>
                                                        ) : (
                                                            currentLeadform.moreBookings.map((obj, index) => (
                                                                <li key={index} className="nav-item rm_bkng_item_no ms-auto">
                                                                    <div className="rm_bkng_item_no nav-link clr-ff8800">
                                                                        {obj.bookingPublishDate
                                                                            ? `${formatDatePro(obj.bookingPublishDate)} at ${formatTime(obj.bookingPublishDate)}`
                                                                            : 'No Date Available'}
                                                                    </div>
                                                                </li>
                                                            ))
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                        <li className="nav-item rm_bkng_item_no">
                                                            <a
                                                                className={activeIndexBooking === 1 ? "nav-link active" : "nav-link"}
                                                                data-bs-toggle="tab"
                                                                href="#Booking_1"
                                                                onClick={() => {
                                                                    setActiveIndex(0);
                                                                    setActiveIndexBooking(1);
                                                                }}
                                                            >
                                                                Booking 1
                                                            </a>
                                                        </li>
                                                        <li className="nav-item rm_bkng_item_no ms-auto">
                                                            <div className="rm_bkng_item_no nav-link clr-ff8800">
                                                                {currentLeadform && currentLeadform.bookingPublishDate
                                                                    ? `${formatDatePro(currentLeadform.bookingPublishDate)} at ${formatTime(currentLeadform.bookingPublishDate)}`
                                                                    : 'No Date Available'}
                                                            </div>
                                                        </li>
                                                    </>
                                                )}
                                            </ul>
                                            <div class="tab-content rm_bkng_item_details">
                                                {currentLeadform &&
                                                    <div className={`tab-pane fade rm_bkng_item_detail_inner ${activeIndexBooking === 1 ? 'show active' : ''}`} id="Booking_1">
                                                        <div className='row mt-3'>
                                                            <div className='col-lg-4 col-sm-12'>
                                                                <div className='my-card'>
                                                                    <div className='my-card-body'>
                                                                        <div className='row m-0 bdr-btm-eee'>
                                                                            <div className='col-lg-4 col-sm-12 p-0 align-self-stretch'>
                                                                                <div class="booking_inner_dtl_h h-100">Booking Date</div>
                                                                            </div>
                                                                            <div className='col-lg-8 col-sm-12 p-0 align-self-stretch'>
                                                                                <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap">{formatDatePro(currentLeadform.bookingDate)}</div>
                                                                            </div>
                                                                        </div>
                                                                        <div className='row m-0'>
                                                                            <div className='col-lg-4 col-sm-12 p-0 align-self-stretch'>
                                                                                <div class="booking_inner_dtl_h h-100">Lead Source</div>
                                                                            </div>
                                                                            <div className='col-lg-8 col-sm-12 p-0 align-self-stretch'>
                                                                                <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap">{currentLeadform &&
                                                                                    (currentLeadform.bookingSource ===
                                                                                        "Other"
                                                                                        ? currentLeadform.otherBookingSource
                                                                                        : currentLeadform.bookingSource)}</div>
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
                                                                                <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap"> {currentLeadform &&
                                                                                    currentLeadform.bdeName}</div>
                                                                            </div>
                                                                        </div>
                                                                        <div className='row m-0'>
                                                                            <div className='col-lg-4 col-sm-12 p-0 align-self-stretch'>
                                                                                <div class="booking_inner_dtl_h h-100">BDE Email</div>
                                                                            </div>
                                                                            <div className='col-lg-8 col-sm-12 p-0 align-self-stretch'>
                                                                                <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap"> {currentLeadform &&
                                                                                    currentLeadform.bdeEmail}</div>
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
                                                                                <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap"> {currentLeadform &&
                                                                                    currentLeadform.bdmName} <i>({currentLeadform && currentLeadform.bdmType})</i></div>
                                                                            </div>
                                                                        </div>
                                                                        <div className='row m-0'>
                                                                            <div className='col-lg-4 col-sm-12 p-0 align-self-stretch'>
                                                                                <div class="booking_inner_dtl_h h-100">BDM Email</div>
                                                                            </div>
                                                                            <div className='col-lg-8 col-sm-12 p-0 align-self-stretch'>
                                                                                <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap"> {currentLeadform &&
                                                                                    currentLeadform.bdmEmail}</div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {currentLeadform.caCase === "Yes" && (
                                                                    <div className='my-card mt-2'>
                                                                        <div className='my-card-body'>
                                                                            <div className='row m-0 bdr-btm-eee'>
                                                                                <div className='col-lg-4 col-sm-12 p-0 align-self-stretch'>
                                                                                    <div class="booking_inner_dtl_h h-100">CA Case</div>
                                                                                </div>
                                                                                <div className='col-lg-8 col-sm-12 p-0 align-self-stretch'>
                                                                                    <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap">{currentLeadform &&
                                                                                        currentLeadform.caCase}</div>
                                                                                </div>
                                                                            </div>
                                                                            <div className='row m-0 bdr-btm-eee'>
                                                                                <div className='col-lg-4 col-sm-12 p-0 align-self-stretch'>
                                                                                    <div class="booking_inner_dtl_h h-100">CA's Number</div>
                                                                                </div>
                                                                                <div className='col-lg-8 col-sm-12 p-0 align-self-stretch'>
                                                                                    <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap"> {currentLeadform &&
                                                                                        currentLeadform.caNumber}</div>
                                                                                </div>
                                                                            </div>
                                                                            <div className='row m-0 bdr-btm-eee'>
                                                                                <div className='col-lg-4 col-sm-12 p-0 align-self-stretch'>
                                                                                    <div class="booking_inner_dtl_h h-100">CA's Email</div>
                                                                                </div>
                                                                                <div className='col-lg-8 col-sm-12 p-0 align-self-stretch'>
                                                                                    <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap">{currentLeadform &&
                                                                                        currentLeadform.caEmail}</div>
                                                                                </div>
                                                                            </div>
                                                                            <div className='row m-0'>
                                                                                <div className='col-lg-5 col-sm-12 p-0 align-self-stretch'>
                                                                                    <div class="booking_inner_dtl_h h-100">CA's Commission</div>
                                                                                </div>
                                                                                <div className='col-lg-7 col-sm-12 p-0 align-self-stretch'>
                                                                                    <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap"> ₹{" "}
                                                                                        {currentLeadform &&
                                                                                            currentLeadform.caCommission}</div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>)}
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
                                                                                                <div class="booking_inner_dtl_b h-100 bdr-left-eee"> ₹{" "}
                                                                                                    {currentLeadform &&
                                                                                                        parseInt(
                                                                                                            currentLeadform.totalAmount
                                                                                                        ).toLocaleString()}</div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div class="col-lg-4 col-sm-6 p-0 align-self-stretch">
                                                                                        <div class="row m-0 h-100">
                                                                                            <div class="col-lg-7 align-self-stretch p-0">
                                                                                                <div class="booking_inner_dtl_h bdr-left-eee h-100">Received Amount</div>
                                                                                            </div>
                                                                                            <div class="col-lg-5 align-self-stretch p-0">
                                                                                                <div class="booking_inner_dtl_b bdr-left-eee h-100">₹{" "}
                                                                                                    {currentLeadform &&
                                                                                                        parseInt(
                                                                                                            currentLeadform.receivedAmount
                                                                                                        ).toLocaleString()}</div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div class="col-lg-4 col-sm-5 p-0 align-self-stretch">
                                                                                        <div class="row m-0 h-100">
                                                                                            <div class="col-lg-7 align-self-stretch p-0">
                                                                                                <div class="booking_inner_dtl_h bdr-left-eee h-100">Pending Amount</div>
                                                                                            </div>
                                                                                            <div class="col-lg-5 align-self-stretch p-0">
                                                                                                <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                                                                                    ₹{" "}
                                                                                                    {currentLeadform &&
                                                                                                        parseInt(
                                                                                                            currentLeadform.pendingAmount
                                                                                                        ).toLocaleString()}
                                                                                                </div>
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
                                                                                                <div class="booking_inner_dtl_b h-100 bdr-left-eee" title={currentLeadform &&
                                                                                                    currentLeadform.paymentMethod}>
                                                                                                    {currentLeadform &&
                                                                                                        currentLeadform.paymentMethod}
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div class="col-lg-6 col-sm-6 p-0 align-self-stretch">
                                                                                        <div class="row m-0 h-100">
                                                                                            <div class="col-lg-6 align-self-stretch p-0">
                                                                                                <div class="booking_inner_dtl_h h-100 bdr-left-eee">Extra Remarks</div>
                                                                                            </div>
                                                                                            <div class="col-lg-6 align-self-stretch p-0">
                                                                                                <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap" title={currentLeadform &&
                                                                                                    currentLeadform.extraNotes}>
                                                                                                    {currentLeadform &&
                                                                                                        currentLeadform.extraNotes}
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className='p-0 mul-booking-card rm_bkng_item_detail_inner_services bdr-ededed mt-2'>
                                                                        <ul className="nav nav-tabs">
                                                                            {currentLeadform && currentLeadform.services && currentLeadform.services.length !== 0 ? (
                                                                                currentLeadform.services.map((obj, index) => (
                                                                                    <li key={index} className="nav-item rmbidis_nav_item">
                                                                                        <a
                                                                                            className={index === activeIndex ? "nav-link rmbidis_nav_link active My_Text_Wrap" : "nav-link rmbidis_nav_link My_Text_Wrap"}
                                                                                            data-bs-toggle="tab"
                                                                                            href={`#services_${index}`}
                                                                                            onClick={() => setActiveIndex(index)}
                                                                                            title={obj.serviceName}
                                                                                        >
                                                                                            {obj.serviceName}
                                                                                        </a>
                                                                                    </li>
                                                                                ))
                                                                            ) : null}
                                                                            <li className="nav-item rmbidis_nav_item ms-auto">
                                                                                <a
                                                                                    className="nav-link rmbidis_nav_link d-flex align-items-center justify-content-center"
                                                                                    data-bs-toggle="tab"
                                                                                    href="#booking_docs"
                                                                                >
                                                                                    <div style={{ lineHeight: '11px', marginRight: '3px' }}>
                                                                                        <IoDocumentTextOutline />
                                                                                    </div>
                                                                                    <div>Documents</div>
                                                                                </a>
                                                                            </li>
                                                                        </ul>

                                                                        <div class="tab-content">
                                                                            {currentLeadform && currentLeadform.services && currentLeadform.services.length !== 0 ? (
                                                                                currentLeadform.services.map((obj, index) => (
                                                                                    <div
                                                                                        key={index}
                                                                                        className={`tab-pane p-1 fade ${index === activeIndex ? "show active" : ""}`}
                                                                                        id={`services_${index}`}
                                                                                    >
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
                                                                                                                <div class="booking_inner_dtl_b bdr-left-eee h-100 services-name My_Text_Wrap" title={obj.serviceName}>
                                                                                                                    {obj.serviceName}
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
                                                                                                                        <div>
                                                                                                                            ₹{" "}
                                                                                                                            {parseInt(
                                                                                                                                obj.totalPaymentWGST
                                                                                                                            ).toLocaleString()}{" "}
                                                                                                                            {"("}
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
                                                                                                                    {obj.paymentTerms === "two-part"
                                                                                                                        ? "Part-Payment"
                                                                                                                        : "Full Advanced"}
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                                {obj.paymentTerms === "two-part" && (
                                                                                                    <div class="row m-0 bdr-btm-eee">
                                                                                                        <div class="col-lg-6 col-sm-12 p-0">
                                                                                                            <div class="row m-0 bdr-btm-eee">
                                                                                                                <div class="col-lg-4 align-self-stretch p-0">
                                                                                                                    <div class="booking_inner_dtl_h h-100">1<sup>st</sup> payment</div>
                                                                                                                </div>
                                                                                                                <div class="col-lg-8 align-self-stretch p-0">
                                                                                                                    <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                                                                                                        ₹{" "}
                                                                                                                        {parseInt(
                                                                                                                            obj.firstPayment
                                                                                                                        ).toLocaleString()}
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        {obj.secondPayment !== 0 && (<div class="col-lg-6 col-sm-12 p-0">
                                                                                                            <div class="row m-0 bdr-btm-eee">
                                                                                                                <div class="col-lg-4 align-self-stretch p-0">
                                                                                                                    <div class="booking_inner_dtl_h h-100 bdr-left-eee">2<sup>nd</sup> Payment</div>
                                                                                                                </div>
                                                                                                                <div class="col-lg-8 align-self-stretch p-0">
                                                                                                                    <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                                                                                                        <div class="d-flex align-items-center justify-content-between">
                                                                                                                            <div className='My_Text_Wrap' title={obj.secondPaymentRemarks}> ₹
                                                                                                                                {parseInt(
                                                                                                                                    obj.secondPayment
                                                                                                                                ).toLocaleString()}
                                                                                                                                {"("}
                                                                                                                                {isNaN(
                                                                                                                                    new Date(
                                                                                                                                        obj.secondPaymentRemarks
                                                                                                                                    )
                                                                                                                                )
                                                                                                                                    ? obj.secondPaymentRemarks
                                                                                                                                    : "On " +
                                                                                                                                    obj.secondPaymentRemarks +
                                                                                                                                    ")"}
                                                                                                                                {")"}
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>)}
                                                                                                        {obj.thirdPayment !== 0 && (
                                                                                                            <div class="col-lg-6 col-sm-12 p-0">
                                                                                                                <div class="row m-0">
                                                                                                                    <div class="col-lg-4 align-self-stretch p-0">
                                                                                                                        <div class="booking_inner_dtl_h h-100">3<sup>rd</sup> Payment</div>
                                                                                                                    </div>
                                                                                                                    <div class="col-lg-8 align-self-stretch p-0">
                                                                                                                        <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                                                                                                            <div class="d-flex align-items-center justify-content-between">
                                                                                                                                <div>
                                                                                                                                    ₹{" "}
                                                                                                                                    {parseInt(
                                                                                                                                        obj.thirdPayment
                                                                                                                                    ).toLocaleString()}
                                                                                                                                    {"("}
                                                                                                                                    {isNaN(
                                                                                                                                        new Date(
                                                                                                                                            obj.thirdPaymentRemarks
                                                                                                                                        )
                                                                                                                                    )
                                                                                                                                        ? obj.thirdPaymentRemarks
                                                                                                                                        : "On " +
                                                                                                                                        obj.thirdPaymentRemarks +
                                                                                                                                        ")"}
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>)}
                                                                                                        {obj.fourthPayment !== 0 && (<div class="col-lg-6 col-sm-12 p-0">
                                                                                                            <div class="row m-0">
                                                                                                                <div class="col-lg-4 align-self-stretch p-0">
                                                                                                                    <div class="booking_inner_dtl_h h-100 bdr-left-eee">4<sup>th</sup> Payment</div>
                                                                                                                </div>
                                                                                                                <div class="col-lg-8 align-self-stretch p-0">
                                                                                                                    <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                                                                                                        <div class="d-flex align-items-center justify-content-between">
                                                                                                                            <div>
                                                                                                                                ₹{" "}
                                                                                                                                {parseInt(
                                                                                                                                    obj.fourthPayment
                                                                                                                                ).toLocaleString()}{" "}
                                                                                                                                {"("}
                                                                                                                                {isNaN(
                                                                                                                                    new Date(
                                                                                                                                        obj.fourthPaymentRemarks
                                                                                                                                    )
                                                                                                                                )
                                                                                                                                    ? obj.fourthPaymentRemarks
                                                                                                                                    : "On " +
                                                                                                                                    obj.fourthPaymentRemarks +
                                                                                                                                    ")"}
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>)}
                                                                                                    </div>)}
                                                                                                {obj.expanse !== 0 && obj.expanse && (<div class="row m-0 bdr-btm-eee">
                                                                                                    <div class="col-lg-3 col-sm-12 p-0">
                                                                                                        <div class="row m-0">
                                                                                                            <div class="col-lg-6 align-self-stretch p-0">
                                                                                                                <div class="booking_inner_dtl_h h-100">
                                                                                                                    Expense
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div class="col-lg-6 align-self-stretch p-0">
                                                                                                                <div class="booking_inner_dtl_b bdr-left-eee h-100"> - ₹ {obj.expanse ? (obj.expanse).toLocaleString() : "N/A"}</div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div class="col-lg-4 col-sm-12 p-0">
                                                                                                        <div class="row m-0">
                                                                                                            <div class="col-lg-6 align-self-stretch p-0">
                                                                                                                <div class="booking_inner_dtl_h bdr-left-eee h-100">expense Date</div>
                                                                                                            </div>
                                                                                                            <div class="col-lg-6 align-self-stretch p-0">
                                                                                                                <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                                                                                                    {formatDatePro(obj.expanseDate ? obj.expanseDate : currentLeadform.bookingDate)}
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div class="col-lg-5 col-sm-12 p-0">
                                                                                                        <div class="row m-0">
                                                                                                            <div class="col-lg-3 align-self-stretch p-0">
                                                                                                                <div class="booking_inner_dtl_h bdr-left-eee h-100">Notes</div>
                                                                                                            </div>
                                                                                                            <div class="col-lg-9 align-self-stretch p-0">
                                                                                                                <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap" title={obj.paymentRemarks
                                                                                                                    ? obj.paymentRemarks
                                                                                                                    : "N/A"}>
                                                                                                                    {obj.paymentRemarks
                                                                                                                        ? obj.paymentRemarks
                                                                                                                        : "N/A"}
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>)}
                                                                                            </div>
                                                                                        </div>
                                                                                        {currentLeadform && currentLeadform.remainingPayments && currentLeadform.remainingPayments.length !== 0 && (
                                                                                            currentLeadform.remainingPayments.some(remainObj => remainObj.serviceName === obj.serviceName) && (
                                                                                                <div class="my-card mt-1">
                                                                                                    <div class="my-card-body accordion"
                                                                                                        id={`accordionExample${index}`}
                                                                                                    >
                                                                                                        <div class="accordion-item bdr-none">
                                                                                                            <div
                                                                                                                id={`headingOne${index}`}
                                                                                                                class="pr-10 accordion-header">
                                                                                                                <div class="row m-0 bdr-btm-eee accordion-button p-0 collapsed"
                                                                                                                    data-bs-toggle="collapse"
                                                                                                                    data-bs-target={`#collapseOne${index}`}
                                                                                                                    aria-expanded="true"
                                                                                                                    aria-controls={`collapseOne${index}`}>
                                                                                                                    <div class="w-95 p-0">
                                                                                                                        <div class="booking_inner_dtl_h h-100">
                                                                                                                            <div>Remaining Payment</div>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div
                                                                                                                id={`collapseOne${index}`}
                                                                                                                class="accordion-collapse collapse"
                                                                                                                aria-labelledby={`headingOne${index}`}
                                                                                                                data-bs-parent="#accordionExample"
                                                                                                            >
                                                                                                                {currentLeadform && currentLeadform.remainingPayments && currentLeadform.remainingPayments.length !== 0 && (
                                                                                                                    currentLeadform.remainingPayments.filter(remainObj => remainObj.serviceName === obj.serviceName).map((paymentObj, index) => paymentObj.serviceName === obj.serviceName ? (
                                                                                                                        <div class="accordion-body bdr-none p-0">
                                                                                                                            <div>
                                                                                                                                <div class="row m-0 bdr-btm-eee bdr-top-eee">
                                                                                                                                    <div class="col-lg-12 col-sm-6 p-0 align-self-stretc bg-fffafa">
                                                                                                                                        <div class="booking_inner_dtl_h h-100 d-flex align-items-center justify-content-between">
                                                                                                                                            <div> {currentLeadform.remainingPayments.length !== 0 &&
                                                                                                                                                (() => {

                                                                                                                                                    if (index === 0) return "Second ";
                                                                                                                                                    else if (index === 1) return "Third ";
                                                                                                                                                    else if (index === 2) return "Fourth ";
                                                                                                                                                    // Add more conditions as needed
                                                                                                                                                    return ""; // Return default value if none of the conditions match
                                                                                                                                                })()}
                                                                                                                                                Remaining Payment</div>
                                                                                                                                            <div>
                                                                                                                                                {"(" + formatDatePro(paymentObj.publishDate ? paymentObj.publishDate : paymentObj.paymentDate) + ")"}
                                                                                                                                            </div>
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
                                                                                                                                                <div class="booking_inner_dtl_b bdr-left-eee h-100"> ₹{" "}
                                                                                                                                                    {paymentObj.receivedPayment.toLocaleString()}</div>
                                                                                                                                            </div>
                                                                                                                                        </div>
                                                                                                                                    </div>
                                                                                                                                    <div class="col-lg-3 col-sm-6 p-0 align-self-stretc">
                                                                                                                                        <div class="row m-0 h-100">
                                                                                                                                            <div class="col-sm-5 align-self-stretc p-0">
                                                                                                                                                <div class="booking_inner_dtl_h bdr-left-eee h-100">Pending</div>
                                                                                                                                            </div>
                                                                                                                                            <div class="col-sm-7 align-self-stretc p-0">
                                                                                                                                                <div class="booking_inner_dtl_b bdr-left-eee h-100">  ₹{" "}
                                                                                                                                                    {currentLeadform.remainingPayments.length !== 0 &&
                                                                                                                                                        (() => {
                                                                                                                                                            const filteredPayments = currentLeadform.remainingPayments.filter(
                                                                                                                                                                (pay) => pay.serviceName === obj.serviceName
                                                                                                                                                            );

                                                                                                                                                            const filteredLength = filteredPayments.length;
                                                                                                                                                            if (index === 0) return parseInt(obj.totalPaymentWGST) - parseInt(obj.firstPayment) - parseInt(paymentObj.receivedPayment);
                                                                                                                                                            else if (index === 1) return parseInt(obj.totalPaymentWGST) - parseInt(obj.firstPayment) - parseInt(paymentObj.receivedPayment) - parseInt(filteredPayments[0].receivedPayment);
                                                                                                                                                            else if (index === 2) return parseInt(currentLeadform.pendingAmount);
                                                                                                                                                            // Add more conditions as needed
                                                                                                                                                            return ""; // Return default value if none of the conditions match
                                                                                                                                                        })()}
                                                                                                                                                </div>
                                                                                                                                            </div>
                                                                                                                                        </div>
                                                                                                                                    </div>
                                                                                                                                    <div class="col-lg-6 col-sm-6 p-0 align-self-stretc">
                                                                                                                                        <div class="row m-0 h-100">
                                                                                                                                            <div class="col-sm-5 align-self-stretc p-0">
                                                                                                                                                <div class="booking_inner_dtl_h h-100 bdr-left-eee">Payment Date</div>
                                                                                                                                            </div>
                                                                                                                                            <div class="col-sm-7 align-self-stretc p-0">
                                                                                                                                                <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap">
                                                                                                                                                    {formatDatePro(
                                                                                                                                                        paymentObj.paymentDate
                                                                                                                                                    )}
                                                                                                                                                </div>
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
                                                                                                                                                <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap" title={
                                                                                                                                                    paymentObj.paymentMethod
                                                                                                                                                }>{
                                                                                                                                                        paymentObj.paymentMethod
                                                                                                                                                    }</div>
                                                                                                                                            </div>
                                                                                                                                        </div>
                                                                                                                                    </div>
                                                                                                                                    <div class="col-lg-6 col-sm-4 p-0 align-self-stretc">
                                                                                                                                        <div class="row m-0 h-100">
                                                                                                                                            <div class="col-sm-4 align-self-stretc p-0">
                                                                                                                                                <div class="booking_inner_dtl_h h-100 bdr-left-eee">Extra Remarks</div>
                                                                                                                                            </div>
                                                                                                                                            <div class="col-sm-8 align-self-stretc p-0">
                                                                                                                                                <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap" title={
                                                                                                                                                    paymentObj.extraRemarks
                                                                                                                                                }> {
                                                                                                                                                        paymentObj.extraRemarks
                                                                                                                                                    }</div>
                                                                                                                                            </div>
                                                                                                                                        </div>
                                                                                                                                    </div>
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                    ) : (
                                                                                                                        null
                                                                                                                    )))}
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>))}
                                                                                    </div>)))
                                                                                :
                                                                                null
                                                                            }

                                                                            {currentLeadform &&
                                                                                (currentLeadform.paymentReceipt.length !== 0 ||
                                                                                    currentLeadform.otherDocs !== 0) && (
                                                                                    <div class="tab-pane p-1 fade" id="booking_docs">
                                                                                        <div className='row m-0'>
                                                                                            {currentLeadform.paymentReceipt.length !==
                                                                                                0 && (
                                                                                                    <div className="col-sm-3 mt2">
                                                                                                        <div className="booking-docs-preview">
                                                                                                            <div
                                                                                                                className="booking-docs-preview-img"
                                                                                                                onClick={() =>
                                                                                                                    handleViewPdfReceipts(
                                                                                                                        currentLeadform.paymentReceipt[0]
                                                                                                                            .filename,
                                                                                                                        currentLeadform["Company Name"]
                                                                                                                    )
                                                                                                                }
                                                                                                            >
                                                                                                                {currentLeadform &&
                                                                                                                    currentLeadform.paymentReceipt[0] &&
                                                                                                                    (((currentLeadform.paymentReceipt[0].filename).toLowerCase()).endsWith(
                                                                                                                        ".pdf"
                                                                                                                    ) ? (
                                                                                                                        <PdfImageViewerAdmin
                                                                                                                            type="paymentrecieptpdf"
                                                                                                                            path={
                                                                                                                                currentLeadform
                                                                                                                                    .paymentReceipt[0].filename
                                                                                                                            }
                                                                                                                            companyName={
                                                                                                                                currentLeadform["Company Name"]
                                                                                                                            }
                                                                                                                        />
                                                                                                                    ) : currentLeadform.paymentReceipt[0].filename.endsWith(
                                                                                                                        ".png"
                                                                                                                    ) ||
                                                                                                                        currentLeadform.paymentReceipt[0].filename.endsWith(
                                                                                                                            ".jpg"
                                                                                                                        ) ||
                                                                                                                        currentLeadform.paymentReceipt[0].filename.endsWith(
                                                                                                                            ".jpeg"
                                                                                                                        ) ? (
                                                                                                                        <img
                                                                                                                            src={`${secretKey}/bookings/recieptpdf/${currentLeadform["Company Name"]}/${currentLeadform.paymentReceipt[0].filename}`}
                                                                                                                            alt="Receipt Image"
                                                                                                                        />
                                                                                                                    ) : (
                                                                                                                        <img
                                                                                                                            src={wordimg}
                                                                                                                            alt="Default Image"
                                                                                                                        />
                                                                                                                    ))}
                                                                                                            </div>
                                                                                                            <div className="booking-docs-preview-text">
                                                                                                                <p className="booking-img-name-txtwrap text-wrap m-auto m-0">
                                                                                                                    Receipt
                                                                                                                </p>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                )}
                                                                                            {currentLeadform.remainingPayments.length !==
                                                                                                0 &&
                                                                                                currentLeadform.remainingPayments.some(
                                                                                                    (obj) => obj.paymentReceipt.length !== 0
                                                                                                ) &&
                                                                                                currentLeadform.remainingPayments.map((remainingObject, index) => (
                                                                                                    remainingObject.paymentReceipt.length !== 0 && (
                                                                                                        <div className="col-sm-3 mt-2" key={index}>
                                                                                                            <div className="booking-docs-preview">
                                                                                                                <div
                                                                                                                    className="booking-docs-preview-img"
                                                                                                                    onClick={() =>
                                                                                                                        handleViewPdfReceipts(
                                                                                                                            remainingObject.paymentReceipt[0].filename,
                                                                                                                            currentLeadform["Company Name"]
                                                                                                                        )
                                                                                                                    }
                                                                                                                >
                                                                                                                    {((remainingObject.paymentReceipt[0].filename).toLowerCase()).endsWith(".pdf") ? (
                                                                                                                        <PdfImageViewerAdmin
                                                                                                                            type="paymentrecieptpdf"
                                                                                                                            path={remainingObject.paymentReceipt[0].filename}
                                                                                                                            companyName={currentLeadform["Company Name"]}
                                                                                                                        />
                                                                                                                    ) : remainingObject.paymentReceipt[0].filename.endsWith(".png") ||
                                                                                                                        remainingObject.paymentReceipt[0].filename.endsWith(".jpg") ||
                                                                                                                        remainingObject.paymentReceipt[0].filename.endsWith(".jpeg") ? (
                                                                                                                        <img
                                                                                                                            src={`${secretKey}/bookings/recieptpdf/${currentLeadform["Company Name"]}/${remainingObject.paymentReceipt[0].filename}`}
                                                                                                                            alt="Receipt Image"
                                                                                                                        />
                                                                                                                    ) : (
                                                                                                                        <img src={wordimg} alt="Default Image" />
                                                                                                                    )}
                                                                                                                </div>
                                                                                                                <div className="booking-docs-preview-text">
                                                                                                                    <p className="booking-img-name-txtwrap text-wrap m-auto m-0">
                                                                                                                        Remaining Payment
                                                                                                                    </p>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    )
                                                                                                ))}

                                                                                            {currentLeadform &&
                                                                                                currentLeadform.otherDocs.map((obj) => (
                                                                                                    <div className="col-sm-3 mb-2">
                                                                                                        <div className="booking-docs-preview">
                                                                                                            <div
                                                                                                                className="booking-docs-preview-img"
                                                                                                                onClick={() =>
                                                                                                                    handleViewPdOtherDocs(
                                                                                                                        obj.filename,
                                                                                                                        currentLeadform["Company Name"]
                                                                                                                    )
                                                                                                                }
                                                                                                            >
                                                                                                                {((obj.filename).toLowerCase()).endsWith(".pdf") ? (
                                                                                                                    <PdfImageViewerAdmin
                                                                                                                        type="pdf"
                                                                                                                        path={obj.filename}
                                                                                                                        companyName={
                                                                                                                            currentLeadform["Company Name"]
                                                                                                                        }
                                                                                                                    />
                                                                                                                ) : (
                                                                                                                    <img
                                                                                                                        src={`${secretKey}/bookings/otherpdf/${currentLeadform["Company Name"]}/${obj.filename}`}
                                                                                                                        alt={pdfimg}
                                                                                                                    ></img>
                                                                                                                )}
                                                                                                            </div>
                                                                                                            <div className="booking-docs-preview-text">
                                                                                                                <p
                                                                                                                    className="booking-img-name-txtwrap text-wrap m-auto m-0 text-wrap m-auto m-0"
                                                                                                                    title={obj.originalname}
                                                                                                                >
                                                                                                                    {obj.originalname}
                                                                                                                </p>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                ))}

                                                                                            <div class="col-sm-3 mt-2">
                                                                                                <div class="booking-docs-preview" title="Upload More Documents">
                                                                                                    <div class="upload-Docs-BTN">
                                                                                                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                                                                                            <path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 112v288m144-144H112"></path>
                                                                                                        </svg>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>)}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>}
                                                {/* ----- More Bookings section --------- */}
                                                {currentLeadform && currentLeadform.moreBookings && currentLeadform.moreBookings.length !== 0 &&
                                                    currentLeadform.moreBookings.map((obj, index) => (
                                                        <div key={index + 2} className={`tab-pane fade rm_bkng_item_detail_inner ${activeIndexBooking === index + 2 ? 'show active' : ''}`} id={`Booking_${index + 2}`}>
                                                            <div className='row mt-3'>
                                                                <div className='col-lg-4 col-sm-12'>
                                                                    <div className='my-card'>
                                                                        <div className='my-card-body'>
                                                                            <div className='row m-0 bdr-btm-eee'>
                                                                                <div className='col-lg-4 col-sm-12 p-0 align-self-stretch'>
                                                                                    <div class="booking_inner_dtl_h h-100">Booking Date</div>
                                                                                </div>
                                                                                <div className='col-lg-8 col-sm-12 p-0 align-self-stretch'>
                                                                                    <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap">{formatDatePro(obj.bookingDate)}</div>
                                                                                </div>
                                                                            </div>
                                                                            <div className='row m-0'>
                                                                                <div className='col-lg-4 col-sm-12 p-0 align-self-stretch'>
                                                                                    <div class="booking_inner_dtl_h h-100">Lead Source</div>
                                                                                </div>
                                                                                <div className='col-lg-8 col-sm-12 p-0 align-self-stretch'>
                                                                                    <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap">{currentLeadform.mainBookings &&
                                                                                        (obj.bookingSource ===
                                                                                            "Other"
                                                                                            ? obj.otherBookingSource
                                                                                            : obj.bookingSource)}</div>
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
                                                                                    <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap"> {currentLeadform.moreBookings &&
                                                                                        obj.bdeName}</div>
                                                                                </div>
                                                                            </div>
                                                                            <div className='row m-0'>
                                                                                <div className='col-lg-4 col-sm-12 p-0 align-self-stretch'>
                                                                                    <div class="booking_inner_dtl_h h-100">BDE Email</div>
                                                                                </div>
                                                                                <div className='col-lg-8 col-sm-12 p-0 align-self-stretch'>
                                                                                    <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap"> {currentLeadform.moreBookings &&
                                                                                        obj.bdeEmail}</div>
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
                                                                                    <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap"> {currentLeadform.moreBookings &&
                                                                                        obj.bdmName} <i>({currentLeadform.moreBookings && obj.bdmType})</i></div>
                                                                                </div>
                                                                            </div>
                                                                            <div className='row m-0'>
                                                                                <div className='col-lg-4 col-sm-12 p-0 align-self-stretch'>
                                                                                    <div class="booking_inner_dtl_h h-100">BDM Email</div>
                                                                                </div>
                                                                                <div className='col-lg-8 col-sm-12 p-0 align-self-stretch'>
                                                                                    <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap"> {currentLeadform.moreBookings &&
                                                                                        obj.bdmEmail}</div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    {obj.caCase === "Yes" && (
                                                                        <div className='my-card mt-2'>
                                                                            <div className='my-card-body'>
                                                                                <div className='row m-0 bdr-btm-eee'>
                                                                                    <div className='col-lg-4 col-sm-12 p-0 align-self-stretch'>
                                                                                        <div class="booking_inner_dtl_h h-100">CA Case</div>
                                                                                    </div>
                                                                                    <div className='col-lg-8 col-sm-12 p-0 align-self-stretch'>
                                                                                        <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap">{currentLeadform.moreBookings &&
                                                                                            obj.caCase}</div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className='row m-0 bdr-btm-eee'>
                                                                                    <div className='col-lg-4 col-sm-12 p-0 align-self-stretch'>
                                                                                        <div class="booking_inner_dtl_h h-100">CA's Number</div>
                                                                                    </div>
                                                                                    <div className='col-lg-8 col-sm-12 p-0 align-self-stretch'>
                                                                                        <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap"> {currentLeadform.moreBookings &&
                                                                                            obj.caNumber}</div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className='row m-0 bdr-btm-eee'>
                                                                                    <div className='col-lg-4 col-sm-12 p-0 align-self-stretch'>
                                                                                        <div class="booking_inner_dtl_h h-100">CA's Email</div>
                                                                                    </div>
                                                                                    <div className='col-lg-8 col-sm-12 p-0 align-self-stretch'>
                                                                                        <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap">{currentLeadform.moreBookings &&
                                                                                            obj.caEmail}</div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className='row m-0'>
                                                                                    <div className='col-lg-5 col-sm-12 p-0 align-self-stretch'>
                                                                                        <div class="booking_inner_dtl_h h-100">CA's Commission</div>
                                                                                    </div>
                                                                                    <div className='col-lg-7 col-sm-12 p-0 align-self-stretch'>
                                                                                        <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap"> ₹{" "}
                                                                                            {currentLeadform.moreBookings &&
                                                                                                obj.caCommission}</div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>)}
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
                                                                                                    <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                                                                                        ₹{" "}
                                                                                                        {parseInt(
                                                                                                            obj.totalAmount
                                                                                                        ).toLocaleString()}
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div class="col-lg-4 col-sm-6 p-0 align-self-stretch">
                                                                                            <div class="row m-0 h-100">
                                                                                                <div class="col-lg-7 align-self-stretch p-0">
                                                                                                    <div class="booking_inner_dtl_h bdr-left-eee h-100">Received Amount</div>
                                                                                                </div>
                                                                                                <div class="col-lg-5 align-self-stretch p-0">
                                                                                                    <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                                                                                        ₹{" "}
                                                                                                        {parseInt(
                                                                                                            obj.receivedAmount
                                                                                                        ).toLocaleString()}</div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div class="col-lg-4 col-sm-5 p-0 align-self-stretch">
                                                                                            <div class="row m-0 h-100">
                                                                                                <div class="col-lg-7 align-self-stretch p-0">
                                                                                                    <div class="booking_inner_dtl_h bdr-left-eee h-100">Pending Amount</div>
                                                                                                </div>
                                                                                                <div class="col-lg-5 align-self-stretch p-0">
                                                                                                    <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                                                                                        ₹{" "}
                                                                                                        {parseInt(
                                                                                                            obj.pendingAmount
                                                                                                        ).toLocaleString()}
                                                                                                    </div>
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
                                                                                                    <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap"
                                                                                                        title={obj.paymentMethod}
                                                                                                    >
                                                                                                        {obj.paymentMethod}
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div class="col-lg-6 col-sm-6 p-0 align-self-stretch">
                                                                                            <div class="row m-0 h-100">
                                                                                                <div class="col-lg-6 align-self-stretch p-0">
                                                                                                    <div class="booking_inner_dtl_h h-100 bdr-left-eee">Extra Remarks</div>
                                                                                                </div>
                                                                                                <div class="col-lg-6 align-self-stretch p-0">
                                                                                                    <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap"
                                                                                                        title={obj.extraNotes}
                                                                                                    >
                                                                                                        {obj.extraNotes}
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className='p-0 mul-booking-card rm_bkng_item_detail_inner_services bdr-ededed mt-2'>
                                                                            <ul className="nav nav-tabs">
                                                                                {obj.services && obj.services.length !== 0 ? (
                                                                                    obj.services.map((objServ, index2) => (
                                                                                        <li key={index2} className="nav-item rmbidis_nav_item">
                                                                                            <a
                                                                                                className={index2 === activeIndexMoreBookingServices ? "nav-link rmbidis_nav_link active My_Text_Wrap" : "nav-link rmbidis_nav_link My_Text_Wrap"}
                                                                                                data-bs-toggle="tab"
                                                                                                href={`#services_${index2}`}
                                                                                                onClick={() => setActiveIndexMoreBookingServices(index2)}
                                                                                                title={objServ.serviceName}
                                                                                            >
                                                                                                {objServ.serviceName}
                                                                                            </a>
                                                                                        </li>
                                                                                    ))
                                                                                ) : null}
                                                                                <li className="nav-item rmbidis_nav_item ms-auto">
                                                                                    <a
                                                                                        className="nav-link rmbidis_nav_link d-flex align-items-center justify-content-center"
                                                                                        data-bs-toggle="tab"
                                                                                        href="#booking_docs2"
                                                                                    >
                                                                                        <div style={{ lineHeight: '11px', marginRight: '3px' }}>
                                                                                            <IoDocumentTextOutline />
                                                                                        </div>
                                                                                        <div>Documents</div>
                                                                                    </a>
                                                                                </li>
                                                                            </ul>

                                                                            <div class="tab-content">
                                                                                {obj.services && obj.services.length !== 0 ? (
                                                                                    obj.services.map((objServ, index2) => (
                                                                                        <div
                                                                                            key={index2}
                                                                                            className={`tab-pane p-1 fade ${index2 === activeIndexMoreBookingServices ? "show active" : ""}`}
                                                                                            id={`services_${index2}`}
                                                                                        >
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
                                                                                                                    <div class="booking_inner_dtl_b bdr-left-eee h-100 services-name My_Text_Wrap" title={objServ.serviceName}>
                                                                                                                        {objServ.serviceName}
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
                                                                                                                            <div>
                                                                                                                                ₹{" "}
                                                                                                                                {parseInt(
                                                                                                                                    objServ.totalPaymentWGST
                                                                                                                                ).toLocaleString()}{" "}
                                                                                                                                {"("}
                                                                                                                                {objServ.totalPaymentWGST !==
                                                                                                                                    objServ.totalPaymentWOGST
                                                                                                                                    ? "With GST"
                                                                                                                                    : "Without GST"}
                                                                                                                                {")"}
                                                                                                                            </div>
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
                                                                                                                        {objServ.paymentTerms === "two-part"
                                                                                                                            ? "Part-Payment"
                                                                                                                            : "Full Advanced"}
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    {objServ.paymentTerms === "two-part" && (
                                                                                                        <div class="row m-0 bdr-btm-eee">
                                                                                                            <div class="col-lg-6 col-sm-12 p-0">
                                                                                                                <div class="row m-0 bdr-btm-eee">
                                                                                                                    <div class="col-lg-4 align-self-stretch p-0">
                                                                                                                        <div class="booking_inner_dtl_h h-100">1<sup>st</sup> payment</div>
                                                                                                                    </div>
                                                                                                                    <div class="col-lg-8 align-self-stretch p-0">
                                                                                                                        <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                                                                                                            ₹{" "}
                                                                                                                            {parseInt(
                                                                                                                                objServ.firstPayment
                                                                                                                            ).toLocaleString()}
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            {objServ.secondPayment !== 0 && (<div class="col-lg-6 col-sm-12 p-0">
                                                                                                                <div class="row m-0 bdr-btm-eee">
                                                                                                                    <div class="col-lg-4 align-self-stretch p-0">
                                                                                                                        <div class="booking_inner_dtl_h h-100 bdr-left-eee">2<sup>nd</sup> Payment</div>
                                                                                                                    </div>
                                                                                                                    <div class="col-lg-8 align-self-stretch p-0">
                                                                                                                        <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                                                                                                            <div class="d-flex align-items-center justify-content-between">
                                                                                                                                <div className='My_Text_Wrap' title={objServ.secondPaymentRemarks}> ₹
                                                                                                                                    {parseInt(
                                                                                                                                        objServ.secondPayment
                                                                                                                                    ).toLocaleString()}
                                                                                                                                    {"("}
                                                                                                                                    {isNaN(
                                                                                                                                        new Date(
                                                                                                                                            objServ.secondPaymentRemarks
                                                                                                                                        )
                                                                                                                                    )
                                                                                                                                        ? objServ.secondPaymentRemarks
                                                                                                                                        : "On " +
                                                                                                                                        objServ.secondPaymentRemarks +
                                                                                                                                        ")"}
                                                                                                                                    {")"}
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>)}
                                                                                                            {objServ.thirdPayment !== 0 && (
                                                                                                                <div class="col-lg-6 col-sm-12 p-0">
                                                                                                                    <div class="row m-0">
                                                                                                                        <div class="col-lg-4 align-self-stretch p-0">
                                                                                                                            <div class="booking_inner_dtl_h h-100">3<sup>rd</sup> Payment</div>
                                                                                                                        </div>
                                                                                                                        <div class="col-lg-8 align-self-stretch p-0">
                                                                                                                            <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                                                                                                                <div class="d-flex align-items-center justify-content-between">
                                                                                                                                    <div>
                                                                                                                                        ₹{" "}
                                                                                                                                        {parseInt(
                                                                                                                                            objServ.thirdPayment
                                                                                                                                        ).toLocaleString()}
                                                                                                                                        {"("}
                                                                                                                                        {isNaN(
                                                                                                                                            new Date(
                                                                                                                                                objServ.thirdPaymentRemarks
                                                                                                                                            )
                                                                                                                                        )
                                                                                                                                            ? objServ.thirdPaymentRemarks
                                                                                                                                            : "On " +
                                                                                                                                            objServ.thirdPaymentRemarks +
                                                                                                                                            ")"}
                                                                                                                                    </div>
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </div>)}
                                                                                                            {objServ.fourthPayment !== 0 && (<div class="col-lg-6 col-sm-12 p-0">
                                                                                                                <div class="row m-0">
                                                                                                                    <div class="col-lg-4 align-self-stretch p-0">
                                                                                                                        <div class="booking_inner_dtl_h h-100 bdr-left-eee">4<sup>th</sup> Payment</div>
                                                                                                                    </div>
                                                                                                                    <div class="col-lg-8 align-self-stretch p-0">
                                                                                                                        <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                                                                                                            <div class="d-flex align-items-center justify-content-between">
                                                                                                                                <div>
                                                                                                                                    ₹{" "}
                                                                                                                                    {parseInt(
                                                                                                                                        objServ.fourthPayment
                                                                                                                                    ).toLocaleString()}{" "}
                                                                                                                                    {"("}
                                                                                                                                    {isNaN(
                                                                                                                                        new Date(
                                                                                                                                            objServ.fourthPaymentRemarks
                                                                                                                                        )
                                                                                                                                    )
                                                                                                                                        ? objServ.fourthPaymentRemarks
                                                                                                                                        : "On " +
                                                                                                                                        objServ.fourthPaymentRemarks +
                                                                                                                                        ")"}
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>)}
                                                                                                        </div>)}
                                                                                                    {/* --------------expanse section----------------- */}
                                                                                                    {objServ.expanse !== 0 && objServ.expanse && (<div class="row m-0 bdr-btm-eee">
                                                                                                        <div class="col-lg-3 col-sm-12 p-0">
                                                                                                            <div class="row m-0">
                                                                                                                <div class="col-lg-6 align-self-stretch p-0">
                                                                                                                    <div class="booking_inner_dtl_h h-100">
                                                                                                                        Expense
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div class="col-lg-6 align-self-stretch p-0">
                                                                                                                    <div class="booking_inner_dtl_b bdr-left-eee h-100"> - ₹ {objServ.expanse ? (objServ.expanse).toLocaleString() : "N/A"}</div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        <div class="col-lg-4 col-sm-12 p-0">
                                                                                                            <div class="row m-0">
                                                                                                                <div class="col-lg-6 align-self-stretch p-0">
                                                                                                                    <div class="booking_inner_dtl_h bdr-left-eee h-100">expense Date</div>
                                                                                                                </div>
                                                                                                                <div class="col-lg-6 align-self-stretch p-0">
                                                                                                                    <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                                                                                                        {formatDatePro(objServ.expanseDate ? objServ.expanseDate : obj.bookingDate)}
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        <div class="col-lg-5 col-sm-12 p-0">
                                                                                                            <div class="row m-0">
                                                                                                                <div class="col-lg-3 align-self-stretch p-0">
                                                                                                                    <div class="booking_inner_dtl_h bdr-left-eee h-100">Notes</div>
                                                                                                                </div>
                                                                                                                <div class="col-lg-9 align-self-stretch p-0">
                                                                                                                    <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap" title={objServ.paymentRemarks
                                                                                                                        ? objServ.paymentRemarks
                                                                                                                        : "N/A"}>
                                                                                                                        {objServ.paymentRemarks
                                                                                                                            ? obj.paymentRemarks
                                                                                                                            : "N/A"}
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>)}
                                                                                                </div>
                                                                                            </div>
                                                                                            {/* --------------remaining payment condition----------------- */}
                                                                                            {obj.remainingPayments && obj.remainingPayments.length !== 0 && (
                                                                                                obj.remainingPayments.some(remainObj => remainObj.serviceName === objServ.serviceName) && (
                                                                                                    <div class="my-card mt-1">
                                                                                                        <div class="my-card-body accordion"
                                                                                                            id={`accordionExample${index}`}
                                                                                                        >
                                                                                                            <div class="accordion-item bdr-none">
                                                                                                                <div
                                                                                                                    id={`headingOne${index}`}
                                                                                                                    class="pr-10 accordion-header">
                                                                                                                    <div class="row m-0 bdr-btm-eee accordion-button p-0 collapsed"
                                                                                                                        data-bs-toggle="collapse"
                                                                                                                        data-bs-target={`#collapseOne${index}`}
                                                                                                                        aria-expanded="true"
                                                                                                                        aria-controls={`collapseOne${index}`}>
                                                                                                                        <div class="w-95 p-0">
                                                                                                                            <div class="booking_inner_dtl_h h-100">
                                                                                                                                <div>Remaining Payment</div>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div
                                                                                                                    id={`collapseOne${index}`}
                                                                                                                    class="accordion-collapse collapse"
                                                                                                                    aria-labelledby={`headingOne${index}`}
                                                                                                                    data-bs-parent="#accordionExample"
                                                                                                                >
                                                                                                                    {obj.remainingPayments && obj.remainingPayments.length !== 0 && (
                                                                                                                        obj.remainingPayments.filter(remainObj => remainObj.serviceName === objServ.serviceName).map((paymentObj, index) => paymentObj.serviceName === objServ.serviceName ? (
                                                                                                                            <div class="accordion-body bdr-none p-0">
                                                                                                                                <div>
                                                                                                                                    <div class="row m-0 bdr-btm-eee bdr-top-eee">
                                                                                                                                        <div class="col-lg-12 col-sm-6 p-0 align-self-stretc bg-fffafa">
                                                                                                                                            <div class="booking_inner_dtl_h h-100 d-flex align-items-center justify-content-between">
                                                                                                                                                <div> {obj.remainingPayments.length !== 0 &&
                                                                                                                                                    (() => {

                                                                                                                                                        if (index === 0) return "Second ";
                                                                                                                                                        else if (index === 1) return "Third ";
                                                                                                                                                        else if (index === 2) return "Fourth ";
                                                                                                                                                        // Add more conditions as needed
                                                                                                                                                        return ""; // Return default value if none of the conditions match
                                                                                                                                                    })()}
                                                                                                                                                    Remaining Payment</div>
                                                                                                                                                <div>
                                                                                                                                                    {"(" + formatDatePro(paymentObj.publishDate ? paymentObj.publishDate : paymentObj.paymentDate) + ")"}
                                                                                                                                                </div>
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
                                                                                                                                                    <div class="booking_inner_dtl_b bdr-left-eee h-100"> ₹{" "}
                                                                                                                                                        {paymentObj.receivedPayment.toLocaleString()}</div>
                                                                                                                                                </div>
                                                                                                                                            </div>
                                                                                                                                        </div>
                                                                                                                                        <div class="col-lg-3 col-sm-6 p-0 align-self-stretc">
                                                                                                                                            <div class="row m-0 h-100">
                                                                                                                                                <div class="col-sm-5 align-self-stretc p-0">
                                                                                                                                                    <div class="booking_inner_dtl_h bdr-left-eee h-100">Pending</div>
                                                                                                                                                </div>
                                                                                                                                                <div class="col-sm-7 align-self-stretc p-0">
                                                                                                                                                    <div class="booking_inner_dtl_b bdr-left-eee h-100">  ₹{" "}
                                                                                                                                                        {obj.remainingPayments.length !== 0 &&
                                                                                                                                                            (() => {
                                                                                                                                                                const filteredPayments = obj.remainingPayments.filter(
                                                                                                                                                                    (pay) => pay.serviceName === objServ.serviceName
                                                                                                                                                                );

                                                                                                                                                                const filteredLength = filteredPayments.length;
                                                                                                                                                                if (index === 0) return parseInt(objServ.totalPaymentWGST) - parseInt(objServ.firstPayment) - parseInt(paymentObj.receivedPayment);
                                                                                                                                                                else if (index === 1) return parseInt(objServ.totalPaymentWGST) - parseInt(objServ.firstPayment) - parseInt(paymentObj.receivedPayment) - parseInt(filteredPayments[0].receivedPayment);
                                                                                                                                                                else if (index === 2) return parseInt(obj.pendingAmount);
                                                                                                                                                                // Add more conditions as needed
                                                                                                                                                                return ""; // Return default value if none of the conditions match
                                                                                                                                                            })()}
                                                                                                                                                    </div>
                                                                                                                                                </div>
                                                                                                                                            </div>
                                                                                                                                        </div>
                                                                                                                                        <div class="col-lg-6 col-sm-6 p-0 align-self-stretc">
                                                                                                                                            <div class="row m-0 h-100">
                                                                                                                                                <div class="col-sm-5 align-self-stretc p-0">
                                                                                                                                                    <div class="booking_inner_dtl_h h-100 bdr-left-eee">Payment Date</div>
                                                                                                                                                </div>
                                                                                                                                                <div class="col-sm-7 align-self-stretc p-0">
                                                                                                                                                    <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap">
                                                                                                                                                        {formatDatePro(
                                                                                                                                                            paymentObj.paymentDate
                                                                                                                                                        )}
                                                                                                                                                    </div>
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
                                                                                                                                                    <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap" title={
                                                                                                                                                        paymentObj.paymentMethod
                                                                                                                                                    }>{
                                                                                                                                                            paymentObj.paymentMethod
                                                                                                                                                        }</div>
                                                                                                                                                </div>
                                                                                                                                            </div>
                                                                                                                                        </div>
                                                                                                                                        <div class="col-lg-6 col-sm-4 p-0 align-self-stretc">
                                                                                                                                            <div class="row m-0 h-100">
                                                                                                                                                <div class="col-sm-4 align-self-stretc p-0">
                                                                                                                                                    <div class="booking_inner_dtl_h h-100 bdr-left-eee">Extra Remarks</div>
                                                                                                                                                </div>
                                                                                                                                                <div class="col-sm-8 align-self-stretc p-0">
                                                                                                                                                    <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap" title={
                                                                                                                                                        paymentObj.extraRemarks
                                                                                                                                                    }> {
                                                                                                                                                            paymentObj.extraRemarks
                                                                                                                                                        }</div>
                                                                                                                                                </div>
                                                                                                                                            </div>
                                                                                                                                        </div>
                                                                                                                                    </div>
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                        ) : (
                                                                                                                            null
                                                                                                                        )))}
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>))}
                                                                                        </div>)))
                                                                                    :
                                                                                    null
                                                                                }
                                                                                <div class="tab-pane p-1 fade" id="booking_docs2">
                                                                                    <div className='row m-0'>
                                                                                        {obj.paymentReceipt &&
                                                                                            obj.paymentReceipt.length !== 0 && (
                                                                                                <div className="col-sm-3 mb-2">
                                                                                                    <div className="booking-docs-preview">
                                                                                                        <div
                                                                                                            className="booking-docs-preview-img"
                                                                                                            onClick={() =>
                                                                                                                handleViewPdfReceipts(
                                                                                                                    obj.paymentReceipt[0]
                                                                                                                        .filename,
                                                                                                                    currentLeadform["Company Name"]
                                                                                                                )
                                                                                                            }
                                                                                                        >
                                                                                                            {((obj.paymentReceipt[0].filename).toLowerCase()).endsWith(
                                                                                                                ".pdf"
                                                                                                            ) ? (
                                                                                                                <PdfImageViewerAdmin
                                                                                                                    type="paymentrecieptpdf"
                                                                                                                    path={
                                                                                                                        obj.paymentReceipt[0]
                                                                                                                            .filename
                                                                                                                    }
                                                                                                                    companyName={
                                                                                                                        currentLeadform["Company Name"]
                                                                                                                    }
                                                                                                                />
                                                                                                            ) : (
                                                                                                                <img
                                                                                                                    src={`${secretKey}/bookings/recieptpdf/${currentLeadform["Company Name"]}/${obj.paymentReceipt[0].filename}`}
                                                                                                                    alt={"MyImg"}
                                                                                                                ></img>
                                                                                                            )}
                                                                                                        </div>
                                                                                                        <div className="booking-docs-preview-text">
                                                                                                            <p className="booking-img-name-txtwrap text-wrap m-auto m-0">
                                                                                                                Receipt.pdf
                                                                                                            </p>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            )}
                                                                                        {obj.otherDocs.map((obj) => (
                                                                                            <div className="col-sm-3 mb-2">
                                                                                                <div className="booking-docs-preview">
                                                                                                    <div
                                                                                                        className="booking-docs-preview-img"
                                                                                                        onClick={() =>
                                                                                                            handleViewPdOtherDocs(
                                                                                                                obj.filename,
                                                                                                                currentLeadform["Company Name"]
                                                                                                            )
                                                                                                        }
                                                                                                    >
                                                                                                        {((obj.filename).toLowerCase()).endsWith(".pdf") ? (
                                                                                                            <PdfImageViewerAdmin
                                                                                                                type="pdf"
                                                                                                                path={obj.filename}
                                                                                                                companyName={
                                                                                                                    currentLeadform["Company Name"]
                                                                                                                }
                                                                                                            />
                                                                                                        ) : (
                                                                                                            <img
                                                                                                                src={`${secretKey}/bookings/otherpdf/${currentLeadform["Company Name"]}/${obj.filename}`}
                                                                                                                alt={pdfimg}
                                                                                                            ></img>
                                                                                                        )}
                                                                                                    </div>
                                                                                                    <div className="booking-docs-preview-text">
                                                                                                        <p
                                                                                                            className="booking-img-name-txtwrap text-wrap m-auto m-0"
                                                                                                            title={obj.originalname}
                                                                                                        >
                                                                                                            {obj.originalname}
                                                                                                        </p>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        ))}
                                                                                        <div class="col-sm-3 mt-2">
                                                                                            <div class="booking-docs-preview" title="Upload More Documents">
                                                                                                <div class="upload-Docs-BTN">
                                                                                                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                                                                                        <path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 112v288m144-144H112"></path>
                                                                                                    </svg>
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
                                                    ))
                                                }
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

export default RmofCertificationAllBookings;