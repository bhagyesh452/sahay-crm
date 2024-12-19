import React, { useState, useEffect } from 'react';

function GraphicDesignerBookings() {

    useEffect(() => {
        document.title = "Graphic-Designer-Sahay-CRM";
    }, []);

    return (
        <div>
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
                                            class="form-control"
                                            placeholder="Search Company"
                                            aria-label="Search in website"
                                        // value={searchText}
                                        // onChange={handleSearchChange}
                                        />
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container-xl">
                    <div className="booking_list_Dtl_box">
                        <div className="row m-0">

                            {/* --------booking list left-part---------*/}
                            <div className="col-4 p-0">
                                <div className="booking-list-card">
                                    <div className="booking-list-heading">
                                        <div className="d-flex justify-content-between">
                                            <div className="b_dtl_C_name">Booking List</div>
                                        </div>
                                    </div>

                                    <div className="booking-list-body">
                                        {/* {leadFormData.length !== 0 && leadFormData.map((obj, index) => ( */}
                                        {/* <div className={currentLeadform && currentLeadform["Company Name"] === obj["Company Name"]
                                                ? "bookings_Company_Name activeBox"
                                                : "bookings_Company_Name"
                                            } */}
                                        <div className="bookings_Company_Name activeBox"
                                        // onClick={() => {
                                        //     // Combine main booking and more bookings into one array
                                        //     const allBookings = [obj, ...obj.moreBookings];

                                        //     // Find the latest booking by comparing booking dates
                                        //     const latestBooking = allBookings.reduce((latest, current) => {
                                        //         const latestDate = new Date(latest.bookingDate);
                                        //         const currentDate = new Date(current.bookingDate);
                                        //         return currentDate > latestDate ? current : latest;
                                        //     });
                                        //     // console.log(latestBooking);

                                        //     // Set current lead form to the clicked object
                                        //     setCurrentLeadform(leadFormData.find((data) => data["Company Name"] === obj["Company Name"]));

                                        //     // Set active index to the index of the latest booking in the combined array
                                        //     setActiveIndexBooking(allBookings.indexOf(latestBooking) + 1); // This will now set the active index to the latest booking
                                        //     setActiveIndex(0);
                                        //     setActiveIndexMoreBookingServices(0);
                                        // }}
                                        >

                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="b_cmpny_name cName-text-wrap">
                                                    Graphic Designer Service Booking
                                                </div>
                                                <div className="b_cmpny_time">
                                                    December 15, 2024
                                                </div>
                                            </div>

                                            <div className="d-flex justify-content-between align-items-center mt-2">
                                                <div className="b_Services_name d-flex flex-wrap">
                                                    <div className="sname mb-1">
                                                        Start-Up India Certificate
                                                    </div>

                                                    {/* {(obj.services.length !== 0 || (obj.moreBookings && obj.moreBookings.length !== 0)) && (() => {
                                                            // Combine services from both main and more bookings
                                                            const allBookings = [
                                                                ...obj.moreBookings,
                                                                // Creating a dummy booking object for obj.services with a default date
                                                                {
                                                                    services: obj.services,
                                                                    bookingDate: "1970-01-01",
                                                                }, // Default date for main services
                                                            ];

                                                            // Convert bookingDate strings to Date objects
                                                            const servicesWithDates = allBookings.flatMap((booking) =>
                                                                booking.services.map((service) => ({
                                                                    ...service,
                                                                    bookingDate: new Date(booking.bookingDate),
                                                                }))
                                                            );

                                                            // Find the latest booking date
                                                            const latestDate = new Date(Math.max(
                                                                ...servicesWithDates.map((service) =>
                                                                    service.bookingDate.getTime()
                                                                )));

                                                            // Filter services based on the latest booking date
                                                            const latestServices = servicesWithDates.filter((service) => service.bookingDate.getTime() === latestDate.getTime());

                                                            // Slice the filtered services to show only the first 3
                                                            const displayedServices = latestServices.slice(0, 3);

                                                            // Calculate the count of additional services
                                                            const additionalCount = Math.max(servicesWithDates.length - 3, 0);

                                                            return (
                                                                <>
                                                                    {displayedServices.map((service, index) => (
                                                                        <div key={service.serviceId} className="sname mb-1">
                                                                            {service.serviceName}
                                                                        </div>
                                                                    )
                                                                    )}

                                                                    {additionalCount > 0 && (
                                                                        <div className="sname mb-1">
                                                                            {`+${additionalCount}`}
                                                                        </div>
                                                                    )}
                                                                </>
                                                            );
                                                        })()} */}
                                                </div>
                                            </div>
                                        </div>
                                        {/* ))} */}

                                        {/* {leadFormData.length === 0 && (
                                            <div className="d-flex align-items-center justify-content-center" style={{ height: "inherit" }}>
                                                <Nodata />
                                            </div>
                                        )} */}
                                    </div>
                                </div>

                                {/* <div className="booking-list-heading position-sticky bottom-0">
                                    <div className="d-flex justify-content-center">
                                        <div className="b_dtl_C_name text-center">
                                            <div className="btn-group mr-1" role="group" aria-label="Basic example">
                                                <button className="btn mybtn" onClick={handlePrev} disabled={page === 1}>
                                                    <FaCircleChevronLeft className="ep_right_button" />
                                                </button>

                                                <button className="btn mybtn">Page {page} of {totalPages}</button>
                                                
                                                <button className="btn mybtn" onClick={handleNext} disabled={page === totalPages}>
                                                    <FaCircleChevronRight className="ep_left_button" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                            </div>

                            {/* --------booking Details Right Part---------*/}
                            <div className="col-8 p-0">
                                <div className="booking-deatils-card">

                                    <div className="booking-deatils-body">
                                        {/* --------Basic Information Which is Common For all bookingdd  ---------*/}
                                        <div className="my-card mt-2">
                                            <div className="my-card-head">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div>Basic Informations</div>
                                                    <div>
                                                        Total Services: 1
                                                        {/* Total Services:{" "}
                                                        {currentLeadform && (currentLeadform.services.length !== 0 || currentLeadform.moreBookings.length !== 0)
                                                            ? [...currentLeadform.services, ...(currentLeadform.moreBookings || []).flatMap((booking) => booking.services),].length
                                                            : null} */}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="my-card-body">
                                                <div className="row m-0 bdr-btm-eee">
                                                    <div className="col-lg-6 col-sm-6 p-0 align-self-stretch">
                                                        <div class="row m-0 h-100">
                                                            <div class="col-sm-4 align-self-stretch p-0">
                                                                <div class="booking_inner_dtl_h h-100">
                                                                    Company Name
                                                                </div>
                                                            </div>
                                                            <div class="col-sm-8 align-self-stretch p-0">
                                                                <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                                                    {/* {currentLeadform && Object.keys(currentLeadform).length !== 0
                                                                        ? currentLeadform["Company Name"]
                                                                        : leadFormData && leadFormData.length !== 0
                                                                            ? leadFormData[0]["Company Name"]
                                                                            : "-"} */}
                                                                    Graphic Designer Service Booking
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6 col-sm-6 p-0 align-self-stretch">
                                                        <div class="row m-0 h-100">
                                                            <div class="col-sm-4 align-self-stretch p-0">
                                                                <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                                                    Email Address
                                                                </div>
                                                            </div>
                                                            <div class="col-sm-6 align-self-stretch p-0">
                                                                <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                                                    {/* {currentLeadform && Object.keys(currentLeadform).length !== 0
                                                                        ? currentLeadform["Company Email"]
                                                                        : leadFormData && leadFormData.length !== 0
                                                                            ? leadFormData[0]["Company Email"]
                                                                            : "-"} */}
                                                                    company@mail.com
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row m-0 bdr-btm-eee">
                                                    <div className="col-lg-4 col-sm-6 p-0 align-self-stretch">
                                                        <div class="row m-0 h-100">
                                                            <div class="col-sm-6 align-self-stretch p-0">
                                                                <div class="booking_inner_dtl_h h-100">
                                                                    Phone No
                                                                </div>
                                                            </div>
                                                            <div class="col-sm-6 align-self-stretch p-0">
                                                                <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                                                    {/* {currentLeadform && Object.keys(currentLeadform).length !== 0
                                                                        ? currentLeadform["Company Number"]
                                                                        : leadFormData && leadFormData.length !== 0
                                                                            ? leadFormData[0]["Company Number"]
                                                                            : "-"} */}
                                                                    9856332201
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-4 col-sm-6 p-0 align-self-stretch">
                                                        <div class="row m-0 h-100">
                                                            <div class="col-sm-7 align-self-stretch p-0">
                                                                <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                                                    Incorporation date
                                                                </div>
                                                            </div>
                                                            <div class="col-sm-5 align-self-stretch p-0">
                                                                <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                                                    {/* {currentLeadform &&
                                                                        formatDatePro(Object.keys(currentLeadform).length !== 0
                                                                            ? currentLeadform.incoDate
                                                                            : leadFormData && leadFormData.length !== 0
                                                                                ? leadFormData[0].incoDate
                                                                                : "-"
                                                                        )} */}
                                                                    July 13, 2022
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* --------If Multipal Booking (Bookign heading) ---------*/}
                                        <div className="rm_all_bkng_right mt-3">

                                            {/* <ul className="nav nav-tabs rm_bkng_items align-items-center">
                                                {currentLeadform && currentLeadform.moreBookings && currentLeadform.moreBookings.length !== 0 ? (
                                                    <>
                                                        <li className="nav-item rm_bkng_item_no">
                                                            <a className={activeIndexBooking === 1 ? "nav-link active" : "nav-link"}
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

                                                        {currentLeadform.moreBookings.map( (obj, index) => (
                                                                <li key={index} className="nav-item rm_bkng_item_no">
                                                                    <a className={index + 2 === activeIndexBooking ? "nav-link active" : "nav-link"}
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
                                                            )
                                                        )}

                                                        {activeIndexBooking === 1 && currentLeadform.bookingPublishDate ? (
                                                            <li className="nav-item rm_bkng_item_no ms-auto">
                                                                <div className="rm_bkng_item_no nav-link clr-ff8800">
                                                                    <span style={{color: "#797373", marginRight: "2px"}}>
                                                                        {"Publish On : "} 
                                                                    </span>
                                                                    {formatDatePro(currentLeadform.bookingPublishDate)}{" "}
                                                                    at{" "} {formatTime(currentLeadform.bookingPublishDate)}
                                                                </div>
                                                            </li>
                                                        ) : (
                                                            currentLeadform.moreBookings && currentLeadform.moreBookings.map((obj, index) =>
                                                                    index + 2 === activeIndexBooking && obj.bookingPublishDate && (
                                                                        <li key={index} className="nav-item rm_bkng_item_no ms-auto">
                                                                            <div className="rm_bkng_item_no nav-link clr-ff8800">
                                                                                <span style={{color: "#797373", marginRight: "2px"}}>
                                                                                    {"Publish On : "} 
                                                                                </span>
                                                                                {formatDatePro(obj.bookingPublishDate)}{" "}
                                                                                at{" "}{formatTime(obj.bookingPublishDate)}
                                                                            </div>
                                                                        </li>
                                                                    )
                                                            )
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                        <li className="nav-item rm_bkng_item_no">
                                                            <a className={activeIndexBooking === 1 ? "nav-link active" : "nav-link"}
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
                                                                <span style={{color: "#797373", marginRight: "2px"}}>
                                                                    {"Publish On : "} 
                                                                </span>
                                                                {currentLeadform && currentLeadform.bookingPublishDate
                                                                    ? `${formatDatePro(currentLeadform.bookingPublishDate)} at ${formatTime(currentLeadform.bookingPublishDate)}`
                                                                    : "No Date Available"}
                                                            </div>
                                                        </li>
                                                    </>
                                                )}
                                            </ul> */}

                                            <div className="tab-content rm_bkng_item_details">
                                                {/* -------- Booking Details ---------*/}
                                                {/* {currentLeadform && ( */}

                                                {/* <div className={`tab-pane fade rm_bkng_item_detail_inner ${activeIndexBooking === 1 ? "show active" : ""}`} id="Booking_1" > */}
                                                <div className="tab-pane fade rm_bkng_item_detail_inner show active" id="Booking_1" >


                                                    <div className="mul-booking-card mt-2">
                                                        {/* -------- Step 2 ---------*/}
                                                        <div className="mb-2 mul-booking-card-inner-head d-flex justify-content-between">
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
                                                                                    {/* {currentLeadform && currentLeadform.bdeName} */}
                                                                                    Mahesh
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* <div className="col-lg-4 col-sm-6 p-0">
                                                                            <div class="row m-0">
                                                                                <div class="col-sm-4 align-self-stretch p-0">
                                                                                    <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                                                                        BDE Email
                                                                                    </div>
                                                                                </div>
                                                                                <div class="col-sm-8 align-self-stretch p-0">
                                                                                    <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                                                                        {currentLeadform && currentLeadform.bdeEmail}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div> */}

                                                                    <div className="col-lg-4 col-sm-6 p-0">
                                                                        <div class="row m-0">
                                                                            <div class="col-sm-4 align-self-stretch p-0">
                                                                                <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                                                                    BDM Name
                                                                                </div>
                                                                            </div>
                                                                            <div class="col-sm-8 align-self-stretch p-0">
                                                                                <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                                                                    {/* {currentLeadform && currentLeadform.bdmName} */}
                                                                                    Mahesh
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-lg-4 col-sm-6 p-0">
                                                                        <div class="row m-0">
                                                                            <div class="col-sm-4 align-self-stretch p-0">
                                                                                <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                                                                    Booking Date
                                                                                </div>
                                                                            </div>
                                                                            <div class="col-sm-8 align-self-stretch p-0">
                                                                                <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                                                                    {/* {currentLeadform && currentLeadform.bdmName} */}
                                                                                    2024-12-05
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* <div className="row m-0 bdr-btm-eee">
                                                                        <div className="col-lg-4 col-sm-6 p-0">
                                                                            <div class="row m-0">
                                                                                <div class="col-sm-4 align-self-stretch p-0">
                                                                                    <div class="booking_inner_dtl_h h-100">
                                                                                        BDM Email
                                                                                    </div>
                                                                                </div>
                                                                                <div class="col-sm-8 align-self-stretch p-0">
                                                                                    <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                                                                        {currentLeadform && currentLeadform.bdmEmail}
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
                                                                                        {currentLeadform && currentLeadform.bookingDate}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div> */}
                                                            </div>
                                                        </div>
                                                        {/* -------- Step 3 ---------*/}
                                                        <div className="mb-2 mt-3 mul-booking-card-inner-head">
                                                            <b>Services Details:</b>
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
                                                                                    {/* {currentLeadform && currentLeadform.services.length} */}
                                                                                    1
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* {currentLeadform && currentLeadform.services.map((obj, index) => ( */}
                                                        <div className="my-card mt-1">
                                                            <div className="my-card-body">
                                                                <div className="row m-0 bdr-btm-eee">
                                                                    <div className="col-lg-6 col-sm-6 p-0">
                                                                        <div class="row m-0">
                                                                            <div class="col-sm-4 align-self-stretch p-0">
                                                                                <div class="booking_inner_dtl_h h-100">
                                                                                    {/* {getOrdinal(index + 1)} Services Name */}
                                                                                    Service Name
                                                                                </div>
                                                                            </div>
                                                                            <div class="col-sm-8 align-self-stretch p-0">
                                                                                <div class="booking_inner_dtl_b bdr-left-eee h-100 services-name">
                                                                                    {/* {obj.serviceName}{" "}
                                                                                                {obj.withDSC && 
                                                                                                    obj.serviceName ===
                                                                                                    "Start-Up India Certificate" &&
                                                                                                    "With DSC"} */}
                                                                                    Start-Up India Certificate
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="row m-0 bdr-btm-eee">
                                                                    <div className="col-lg-6 col-sm-5 p-0">
                                                                        <div class="row m-0">
                                                                            <div class="col-sm-3 align-self-stretch p-0">
                                                                                <div class="booking_inner_dtl_h h-100 bdr-left-eee">
                                                                                    Notes
                                                                                </div>
                                                                            </div>
                                                                            <div class="col-sm-9 align-self-stretch p-0">
                                                                                <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap">
                                                                                    {/* {obj.paymentRemarks ? obj.paymentRemarks : "N/A"} */}
                                                                                    Booking Notes
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* ))} */}

                                                        {/* -------- CA Case -------- */}
                                                        <div className="my-card mt-1">
                                                            <div className="my-card-body">
                                                                <div className="row m-0 bdr-btm-eee">
                                                                    <div className="col-lg-12 col-sm-6 p-0">
                                                                        <div class="row m-0">
                                                                            <div class="col-sm-2 align-self-stretc p-0">
                                                                                <div class="booking_inner_dtl_h h-100">
                                                                                    CA Case
                                                                                </div>
                                                                            </div>
                                                                            <div class="col-sm-10 align-self-stretc p-0">
                                                                                <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                                                                    {/* {currentLeadform && currentLeadform.caCase} */}
                                                                                    Yes
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* {currentLeadform && currentLeadform.caCase !== "No" && ( */}
                                                                <div className="row m-0 bdr-btm-eee">
                                                                    <div className="col-lg-4 col-sm-6 p-0">
                                                                        <div class="row m-0">
                                                                            <div class="col-sm-6 align-self-stretc p-0">
                                                                                <div class="booking_inner_dtl_h h-100">
                                                                                    CA's Number
                                                                                </div>
                                                                            </div>
                                                                            <div class="col-sm-6 align-self-stretc p-0">
                                                                                <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                                                                    {/* {currentLeadform && currentLeadform.caNumber} */}
                                                                                    9874563322
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {/* )} */}
                                                            </div>
                                                        </div>

                                                        {/* {currentLeadform && (currentLeadform.paymentReceipt.length !== 0 || currentLeadform.otherDocs !== 0) && ( */}
                                                        <>
                                                            <div className="mb-2 mt-3 mul-booking-card-inner-head">
                                                                <b>Payment Receipt and Additional Documents:</b>
                                                            </div>
                                                            <div className="row">
                                                                {/* {currentLeadform.paymentReceipt.length !== 0 && (
                                                                    <div className="col-sm-2 mb-1">
                                                                        <div className="booking-docs-preview">
                                                                            <div className="booking-docs-preview-img"
                                                                                onClick={() => handleViewPdfReciepts(currentLeadform.paymentReceipt[0].filename,currentLeadform["Company Name"])}
                                                                            >
                                                                                {currentLeadform && currentLeadform.paymentReceipt && currentLeadform.paymentReceipt[0]
                                                                                    && currentLeadform.paymentReceipt[0].filename && // Ensure filename exists
                                                                                    (currentLeadform.paymentReceipt[0].filename.toLowerCase().endsWith(".pdf") 
                                                                                    ? (
                                                                                        <PdfImageViewerAdmin type="paymentrecieptpdf"
                                                                                            path={currentLeadform.paymentReceipt[0].filename}
                                                                                            companyName={currentLeadform["Company Name"]}
                                                                                        />
                                                                                    ) : currentLeadform.paymentReceipt[0].filename.toLowerCase().endsWith(".png")
                                                                                        || currentLeadform.paymentReceipt[0].filename.toLowerCase().endsWith(".jpg")
                                                                                        || currentLeadform.paymentReceipt[0].filename.toLowerCase().endsWith(".jpeg")
                                                                                        ? (
                                                                                            <img src={`${secretKey}/bookings/recieptpdf/${currentLeadform["Company Name"]}/${currentLeadform.paymentReceipt[0].filename}`} alt="Receipt Image" />
                                                                                        ) : (
                                                                                            <img src={wordimg} alt="Default Image" />
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

                                                                {currentLeadform.remainingPayments.length !== 0 && 
                                                                    currentLeadform.remainingPayments.some((obj) => obj.paymentReceipt.length !== 0) &&
                                                                    currentLeadform.remainingPayments.map((remainingObject, index) =>
                                                                        remainingObject.paymentReceipt.length !== 0 && (
                                                                            
                                                                            <div className="col-sm-2 mb-1" key={index}>
                                                                                <div className="booking-docs-preview">
                                                                                    <div className="booking-docs-preview-img"
                                                                                        onClick={() => handleViewPdfReciepts(remainingObject.paymentReceipt[0].filename,currentLeadform["Company Name"])}
                                                                                    >
                                                                                        {remainingObject.paymentReceipt[0].filename.toLowerCase().endsWith(".pdf")
                                                                                            ? (
                                                                                                <PdfImageViewerAdmin
                                                                                                    type="paymentrecieptpdf"
                                                                                                    path={remainingObject.paymentReceipt[0].filename}
                                                                                                    companyName={currentLeadform["Company Name"]}
                                                                                                />
                                                                                            ) : remainingObject.paymentReceipt[0].filename.endsWith(".png")
                                                                                                || remainingObject.paymentReceipt[0].filename.endsWith(".jpg")
                                                                                                || remainingObject.paymentReceipt[0].filename.endsWith(".jpeg")
                                                                                                ? (
                                                                                                    <img src={`${secretKey}/bookings/recieptpdf/${currentLeadform["Company Name"]}/${remainingObject.paymentReceipt[0].filename}`} alt="Receipt Image"/>
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
                                                                    )}

                                                                {currentLeadform && currentLeadform.otherDocs && currentLeadform.otherDocs.map((obj) => (
                                                                    <div className="col-sm-2 mb-1" key={obj.filename}>
                                                                        <div className="booking-docs-preview">
                                                                            <div className="booking-docs-preview-img"
                                                                                onClick={() => handleViewPdOtherDocs(obj.filename, currentLeadform["Company Name"])}
                                                                            >
                                                                                {obj.filename && obj.filename.toLowerCase().endsWith(".pdf")
                                                                                    ? (
                                                                                        <PdfImageViewerAdmin
                                                                                            type="pdf"
                                                                                            path={obj.filename}
                                                                                            companyName={currentLeadform["Company Name"]}
                                                                                        />
                                                                                    ) : (
                                                                                        obj.filename && (
                                                                                            <img src={`${secretKey}/bookings/otherpdf/${currentLeadform["Company Name"]}/${obj.filename}`} alt={pdfimg} />
                                                                                        )
                                                                                    )}
                                                                            </div>
                                                                            
                                                                            <div className="booking-docs-preview-text">
                                                                                <p className="booking-img-name-txtwrap text-wrap m-auto m-0" title={obj.originalname}>
                                                                                    {obj.originalname}
                                                                                </p>
                                                                            </div>
                                                                        </div>

                                                                    </div>
                                                                ))} */}
                                                            </div>
                                                        </>
                                                        {/* )} */}
                                                    </div>

                                                </div>
                                                {/* )} */}
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

export default GraphicDesignerBookings;