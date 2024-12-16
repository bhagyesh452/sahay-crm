import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, CircularProgress } from "@mui/material";
import { IoClose } from "react-icons/io5";

function AdminBookingDetailDialog({
    loadingDetails,
    dialogOpen,
    handleCloseDialog,
    selectedCompanyName,
    bookingDetails,
}) {
    const [activeIndexBooking, setActiveIndexBooking] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);
    const [activeIndexMoreBookingServices, setActiveIndexMoreBookingServices] = useState(0);

    useEffect(() => {
        if (!bookingDetails || typeof bookingDetails !== "object") return; // Ensure bookingDetails exists and is an object

        // Default moreBookings to an empty array if it doesn't exist or isn't iterable
        const moreBookings = Array.isArray(bookingDetails.moreBookings) ? bookingDetails.moreBookings : [];

        // Combine the main booking and more bookings into one array
        const allBookings = [bookingDetails, ...moreBookings];

        // Find the latest booking by comparing booking dates
        const latestBooking = allBookings.reduce((latest, current) => {
            const latestDate = new Date(latest.bookingDate);
            const currentDate = new Date(current.bookingDate);
            return currentDate > latestDate ? current : latest;
        });

        // Set the active index to the index of the latest booking in the combined array
        setActiveIndexBooking(allBookings.indexOf(latestBooking) + 1); // Adjust index for the latest booking
        setActiveIndex(0);
        setActiveIndexMoreBookingServices(0);
    }, [bookingDetails]);


    const formatTime = (dateString) => {
        //const dateString = "Sat Jun 29 2024 15:15:12 GMT+0530 (India Standard Time)";
        const date = new Date(dateString);
        let hours = date.getHours();
        let minutes = date.getMinutes();
        const ampm = hours >= 12 ? "pm" : "am";

        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? "0" + minutes : minutes;

        const strTime = `${hours}:${minutes} ${ampm}`;
        return strTime;
    };
    const calculateTotalAmount = (obj) => {
        let total = parseInt(obj.totalAmount);
        if (obj.moreBookings && obj.moreBookings.length > 0) {
            total += obj.moreBookings.reduce(
                (acc, booking) => acc + parseInt(booking.totalAmount),
                0
            );
        }
        return total.toFixed(2);
    };

    const calculateTotalAmountLatestBooking = (obj) => {
        // Combine services from both main and more bookings
        const allBookings = [
            ...obj.moreBookings,
            {
                services: obj.services,
                totalAmount: obj.totalAmount,
                bookingDate: "1970-01-01", // Default date for main services
            }
        ];

        // Convert bookingDate strings to Date objects
        const bookingsWithDates = allBookings.map((booking) => ({
            ...booking,
            bookingDate: new Date(booking.bookingDate),
        }));

        // Find the latest booking date
        const latestDate = new Date(
            Math.max(...bookingsWithDates.map((booking) => booking.bookingDate.getTime()))
        );

        // Filter to find the latest booking based on the latest date
        const latestBooking = bookingsWithDates.find(
            (booking) => booking.bookingDate.getTime() === latestDate.getTime()
        );
        // console.log("latestBooking", latestBooking.totalAmount)
        // Return the total amount for the latest booking (parse it to ensure it is a number)
        return latestBooking
            ? parseInt(latestBooking.totalAmount)
            : '0';
    };


    const calculateReceivedAmount = (obj) => {
        let received = parseInt(obj.receivedAmount);
        if (obj.moreBookings && obj.moreBookings.length > 0) {
            received += obj.moreBookings.reduce(
                (acc, booking) => acc + parseInt(booking.receivedAmount),
                0
            );
        }
        return received.toFixed(2);
    };

    const calculateReceivedAmountLatestBooking = (obj) => {
        // Combine services from both main and more bookings
        const allBookings = [
            ...obj.moreBookings,
            {
                services: obj.services,
                receivedAmount: obj.receivedAmount,
                bookingDate: "1970-01-01", // Default date for main services
            }
        ];

        // Convert bookingDate strings to Date objects
        const bookingsWithDates = allBookings.map((booking) => ({
            ...booking,
            bookingDate: new Date(booking.bookingDate),
        }));

        // Find the latest booking date
        const latestDate = new Date(
            Math.max(...bookingsWithDates.map((booking) => booking.bookingDate.getTime()))
        );

        // Filter to find the latest booking based on the latest date
        const latestBooking = bookingsWithDates.find(
            (booking) => booking.bookingDate.getTime() === latestDate.getTime()
        );

        // Return the received amount for the latest booking (parse it to ensure it is a number)
        return latestBooking
            ? parseInt(latestBooking.receivedAmount)
            : '0.00';
    };


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

    const calculatePendingAmountLatestBooking = (obj) => {
        // Combine services from both main and more bookings
        const allBookings = [
            ...obj.moreBookings,
            {
                services: obj.services,
                pendingAmount: obj.pendingAmount,
                bookingDate: "1970-01-01", // Default date for main services
            }
        ];

        // Convert bookingDate strings to Date objects
        const bookingsWithDates = allBookings.map((booking) => ({
            ...booking,
            bookingDate: new Date(booking.bookingDate),
        }));

        // Find the latest booking date
        const latestDate = new Date(
            Math.max(...bookingsWithDates.map((booking) => booking.bookingDate.getTime()))
        );

        // Filter to find the latest booking based on the latest date
        const latestBooking = bookingsWithDates.find(
            (booking) => booking.bookingDate.getTime() === latestDate.getTime()
        );

        // Return the pending amount for the latest booking (parse it to ensure it is a number)
        return latestBooking
            ? parseInt(latestBooking.pendingAmount)
            : '0.00';
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
    return (
        <div>
            {/* ====================dialog to see booking details============================== */}
            <Dialog className="My_Mat_Dialog" open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogContent>
                    {loadingDetails ? (
                        <div className="text-center">
                            <CircularProgress />
                        </div>
                    ) : bookingDetails ? (
                        <div className="p-0">
                            <div className="booking-deatils-card">
                                <div className="booking-deatils-heading">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="b_dtl_C_name">
                                            {bookingDetails &&
                                                Object.keys(bookingDetails).length !== 0
                                                ? bookingDetails["Company Name"]
                                                : bookingDetails && bookingDetails.length !== 0
                                                    ? bookingDetails[0]["Company Name"]
                                                    : "-"}
                                        </div>
                                        <div>
                                            <button
                                                onClick={handleCloseDialog}
                                                className="btn btn-link"
                                                style={{ fontSize: "20px", padding: "0" }}
                                            >
                                                <IoClose />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="booking-deatils-body">
                                    {/* --------Basic Information Which is Common For all bookingdd  ---------*/}
                                    <div className="my-card mt-2">
                                        <div className="my-card-head">
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div>Basic Informations</div>
                                                <div>
                                                    Total Services:{" "}
                                                    {bookingDetails &&
                                                        (bookingDetails?.services?.length !== 0 ||
                                                            bookingDetails?.moreBookings?.length !== 0)
                                                        ? [
                                                            ...bookingDetails.services,
                                                            ...(
                                                                bookingDetails.moreBookings || []
                                                            ).flatMap(
                                                                (booking) => booking.services
                                                            ),
                                                        ].length
                                                        : null}
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
                                                                {bookingDetails &&
                                                                    Object.keys(bookingDetails).length !== 0
                                                                    ? bookingDetails["Company Name"]
                                                                    : bookingDetails &&
                                                                        bookingDetails.length !== 0
                                                                        ? bookingDetails[0]["Company Name"]
                                                                        : "-"}
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
                                                                {bookingDetails &&
                                                                    Object.keys(bookingDetails).length !== 0
                                                                    ? bookingDetails["Company Email"]
                                                                    : bookingDetails &&
                                                                        bookingDetails.length !== 0
                                                                        ? bookingDetails[0]["Company Email"]
                                                                        : "-"}
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
                                                                {bookingDetails &&
                                                                    Object.keys(bookingDetails).length !== 0
                                                                    ? bookingDetails["Company Number"]
                                                                    : bookingDetails &&
                                                                        bookingDetails.length !== 0
                                                                        ? bookingDetails[0]["Company Number"]
                                                                        : "-"}
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
                                                                {bookingDetails &&
                                                                    formatDatePro(
                                                                        Object.keys(bookingDetails).length !==
                                                                            0
                                                                            ? bookingDetails.incoDate
                                                                            : bookingDetails &&
                                                                                bookingDetails.length !== 0
                                                                                ? bookingDetails[0].incoDate
                                                                                : "-"
                                                                    )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-sm-6 p-0 align-self-stretch">
                                                    <div class="row m-0 h-100">
                                                        <div class="col-sm-5 align-self-stretch p-0">
                                                            <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                                                PAN/GST
                                                            </div>
                                                        </div>
                                                        <div class="col-sm-7 align-self-stretch p-0">
                                                            <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                                                {bookingDetails &&
                                                                    Object.keys(bookingDetails).length !== 0
                                                                    ? bookingDetails.panNumber
                                                                    : bookingDetails &&
                                                                        bookingDetails.length !== 0
                                                                        ? bookingDetails[0].panNumber
                                                                        : "-"}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row m-0 bdr-btm-eee">
                                                <div className="col-lg-4 col-sm-6 p-0">
                                                    <div class="row m-0">
                                                        <div class="col-sm-4 align-self-stretc p-0">
                                                            <div class="booking_inner_dtl_h h-100">
                                                                Total
                                                            </div>
                                                        </div>
                                                        <div class="col-sm-8 align-self-stretc p-0">
                                                            {bookingDetails && (
                                                                <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                                                    ₹{" "}
                                                                    {
                                                                        parseInt(calculateTotalAmount(bookingDetails))
                                                                            .toLocaleString()}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-sm-6 p-0">
                                                    <div class="row m-0">
                                                        <div class="col-sm-4 align-self-stretc p-0">
                                                            <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                                                Received
                                                            </div>
                                                        </div>
                                                        <div class="col-sm-8 align-self-stretc p-0">
                                                            {bookingDetails && (
                                                                <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                                                    ₹{" "}
                                                                    {
                                                                        parseInt(calculateReceivedAmount(bookingDetails))
                                                                            .toLocaleString()}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-sm-6 p-0">
                                                    <div class="row m-0">
                                                        <div class="col-sm-4 align-self-stretc p-0">
                                                            <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                                                Pending
                                                            </div>
                                                        </div>
                                                        <div class="col-sm-8 align-self-stretc p-0">
                                                            {bookingDetails && (
                                                                <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                                                    ₹{" "}
                                                                    {
                                                                        parseInt(calculatePendingAmount(bookingDetails))
                                                                            .toLocaleString()}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* --------If Multipal Booking (Bookign heading) ---------*/}
                                    <div className="rm_all_bkng_right mt-3">
                                        <ul className="nav nav-tabs rm_bkng_items align-items-center">
                                            {bookingDetails &&
                                                bookingDetails.moreBookings &&
                                                bookingDetails.moreBookings.length !== 0 ? (
                                                <>
                                                    <li className="nav-item rm_bkng_item_no">
                                                        <a
                                                            className={
                                                                activeIndexBooking === 1
                                                                    ? "nav-link active"
                                                                    : "nav-link"
                                                            }
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
                                                    {bookingDetails.moreBookings.map(
                                                        (obj, index) => (
                                                            <li
                                                                key={index}
                                                                className="nav-item rm_bkng_item_no"
                                                            >
                                                                <a
                                                                    className={
                                                                        index + 2 === activeIndexBooking
                                                                            ? "nav-link active"
                                                                            : "nav-link"
                                                                    }
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
                                                    {activeIndexBooking === 1 &&
                                                        bookingDetails.bookingPublishDate ? (
                                                        <li className="nav-item rm_bkng_item_no ms-auto">
                                                            <div className="rm_bkng_item_no nav-link clr-ff8800">
                                                                <span style={{
                                                                    color: "#797373",
                                                                    marginRight: "2px"
                                                                }}
                                                                >{"Publish On : "} </span>
                                                                {formatDatePro(
                                                                    bookingDetails.bookingPublishDate
                                                                )}{" "}
                                                                at{" "}
                                                                {formatTime(
                                                                    bookingDetails.bookingPublishDate
                                                                )}
                                                            </div>
                                                        </li>
                                                    ) : (
                                                        bookingDetails.moreBookings &&
                                                        bookingDetails.moreBookings.map(
                                                            (obj, index) =>
                                                                index + 2 === activeIndexBooking &&
                                                                obj.bookingPublishDate && (
                                                                    <li
                                                                        key={index}
                                                                        className="nav-item rm_bkng_item_no ms-auto"
                                                                    >
                                                                        <div className="rm_bkng_item_no nav-link clr-ff8800">
                                                                            <span style={{
                                                                                color: "#797373",
                                                                                marginRight: "2px"
                                                                            }}
                                                                            >{"Publish On : "} </span>
                                                                            {formatDatePro(
                                                                                obj.bookingPublishDate
                                                                            )}{" "}
                                                                            at{" "}
                                                                            {formatTime(obj.bookingPublishDate)}
                                                                        </div>
                                                                    </li>
                                                                )
                                                        )
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    <li className="nav-item rm_bkng_item_no">
                                                        <a
                                                            className={
                                                                activeIndexBooking === 1
                                                                    ? "nav-link active"
                                                                    : "nav-link"
                                                            }
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
                                                            <span style={{
                                                                color: "#797373",
                                                                marginRight: "2px"
                                                            }}
                                                            >{"Publish On : "} </span>
                                                            {bookingDetails &&
                                                                bookingDetails.bookingPublishDate
                                                                ? `${formatDatePro(
                                                                    bookingDetails.bookingPublishDate
                                                                )} at ${formatTime(
                                                                    bookingDetails.bookingPublishDate
                                                                )}`
                                                                : "No Date Available"}
                                                        </div>
                                                    </li>
                                                </>
                                            )}
                                        </ul>

                                        <div className="tab-content rm_bkng_item_details">
                                            {/* -------- Booking Details ---------*/}
                                            {bookingDetails && (
                                                <div
                                                    className={`tab-pane fade rm_bkng_item_detail_inner ${activeIndexBooking === 1 ? "show active" : ""
                                                        }`}
                                                    id="Booking_1" >


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
                                                                                    {bookingDetails &&
                                                                                        bookingDetails.bdeName}
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
                                                                                    {bookingDetails &&
                                                                                        bookingDetails.bdeEmail}
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
                                                                                    <span>
                                                                                        <i>
                                                                                            {bookingDetails &&
                                                                                                bookingDetails.bdmType}
                                                                                        </i>
                                                                                    </span>{" "}
                                                                                    {bookingDetails &&
                                                                                        bookingDetails.bdmName}
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
                                                                                    {bookingDetails &&
                                                                                        bookingDetails.bdmEmail}
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
                                                                                    {bookingDetails &&
                                                                                        bookingDetails.bookingDate}
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
                                                                                    {bookingDetails &&
                                                                                        (bookingDetails.bookingSource ===
                                                                                            "Other"
                                                                                            ? bookingDetails.otherBookingSource
                                                                                            : bookingDetails.bookingSource)}
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
                                                                                    {bookingDetails &&
                                                                                        bookingDetails.services.length}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {bookingDetails &&
                                                            bookingDetails.services.map((obj, index) => (
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
                                                                                            {obj.withDSC &&
                                                                                                obj.serviceName ===
                                                                                                "Start-Up India Certificate" &&
                                                                                                "With DSC"}
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
                                                                                            <div className="d-flex align-items-center justify-content-between">
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

                                                                                                {/* --------------------------------------------------------------   ADD expense Section  --------------------------------------------------- */}

                                                                                                {/* -------------------------------------   Expanse Section Ends Here  -------------------------------------------------- */}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="row m-0 bdr-btm-eee">
                                                                            <div className="col-lg-6 col-sm-5 p-0">
                                                                                <div class="row m-0">
                                                                                    <div class="col-sm-4 align-self-stretch p-0">
                                                                                        <div class="booking_inner_dtl_h h-100">
                                                                                            Payment Terms
                                                                                        </div>
                                                                                    </div>
                                                                                    <div class="col-sm-8 align-self-stretch p-0">
                                                                                        <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                                                                            {obj.paymentTerms === "two-part"
                                                                                                ? "Part-Payment"
                                                                                                : "Full Advanced"}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-lg-6 col-sm-5 p-0">
                                                                                <div class="row m-0">
                                                                                    <div class="col-sm-3 align-self-stretch p-0">
                                                                                        <div class="booking_inner_dtl_h h-100 bdr-left-eee">
                                                                                            Notes
                                                                                        </div>
                                                                                    </div>
                                                                                    <div class="col-sm-9 align-self-stretch p-0">
                                                                                        <div
                                                                                            class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap"
                                                                                            title={
                                                                                                obj.paymentRemarks
                                                                                                    ? obj.paymentRemarks
                                                                                                    : "N/A"
                                                                                            }
                                                                                        >
                                                                                            {obj.paymentRemarks
                                                                                                ? obj.paymentRemarks
                                                                                                : "N/A"}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        {obj.expanse !== 0 && obj.expanse && (
                                                                            <div className="row m-0 bdr-btm-eee">
                                                                                <div className="col-lg-6 col-sm-2 p-0">
                                                                                    <div class="row m-0">
                                                                                        <div class="col-sm-4 align-self-stretch p-0">
                                                                                            <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                                                                                Expense
                                                                                            </div>
                                                                                        </div>
                                                                                        <div class="col-sm-8 align-self-stretch p-0">
                                                                                            <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                                                                                - ₹{" "}
                                                                                                {obj.expanse
                                                                                                    ? obj.expanse.toLocaleString()
                                                                                                    : "N/A"}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-lg-6 col-sm-2 p-0">
                                                                                    <div class="row m-0">
                                                                                        <div class="col-sm-4 align-self-stretch p-0">
                                                                                            <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                                                                                expense Date
                                                                                            </div>
                                                                                        </div>
                                                                                        <div class="col-sm-8 align-self-stretch p-0">
                                                                                            <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                                                                                {formatDatePro(
                                                                                                    obj.expanseDate
                                                                                                        ? obj.expanseDate
                                                                                                        : bookingDetails.bookingDate
                                                                                                )}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                        <div className="row m-0 bdr-btm-eee">
                                                                            {obj.paymentTerms === "two-part" && (
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
                                                                                                {parseInt(
                                                                                                    obj.firstPayment
                                                                                                ).toLocaleString()}
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
                                                                                                Second Payment
                                                                                            </div>
                                                                                        </div>
                                                                                        <div class="col-sm-8 align-self-stretch p-0">
                                                                                            <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                                                                                <div className="d-flex align-items-center justify-content-between">
                                                                                                    <div>
                                                                                                        ₹
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
                                                                                                <div className="d-flex align-items-center justify-content-between">
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
                                                                                                <div className="d-flex align-items-center justify-content-between">
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
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    {/* Remaining Payment View Sections */}
                                                                    {bookingDetails.remainingPayments.length !== 0 &&
                                                                        bookingDetails.remainingPayments.some(
                                                                            (boom) => boom.serviceName === obj.serviceName
                                                                        ) && (
                                                                            <div
                                                                                className="my-card-body accordion"
                                                                                id={`accordionExample${index}`}
                                                                            >
                                                                                <div class="accordion-item bdr-none">
                                                                                    <div
                                                                                        id={`headingOne${index}`}
                                                                                        className="pr-10 accordion-header"
                                                                                    >
                                                                                        <div
                                                                                            className="row m-0 bdr-btm-eee accordion-button p-0"
                                                                                            data-bs-toggle="collapse"
                                                                                            data-bs-target={`#collapseOne${index}`}
                                                                                            aria-expanded="true"
                                                                                            aria-controls={`collapseOne${index}`}
                                                                                        >
                                                                                            <div className="w-95 p-0">
                                                                                                <div className="booking_inner_dtl_h h-100">
                                                                                                    <div>Remaining Payment </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div
                                                                                        id={`collapseOne${index}`}
                                                                                        class="accordion-collapse collapse show"
                                                                                        aria-labelledby={`headingOne${index}`}
                                                                                        data-bs-parent="#accordionExample"
                                                                                    // Add a unique key prop for each rendered element
                                                                                    >
                                                                                        {bookingDetails.remainingPayments
                                                                                            .length !== 0 &&
                                                                                            bookingDetails.remainingPayments
                                                                                                .filter(
                                                                                                    (boom) =>
                                                                                                        boom.serviceName ===
                                                                                                        obj.serviceName
                                                                                                )
                                                                                                .map(
                                                                                                    (paymentObj, index) =>
                                                                                                        paymentObj.serviceName ===
                                                                                                            obj.serviceName ? (
                                                                                                            <div class="accordion-body bdr-none p-0">
                                                                                                                <div>
                                                                                                                    <div className="row m-0 bdr-btm-eee bdr-top-eee">
                                                                                                                        <div className="col-lg-12 col-sm-6 p-0 align-self-stretc bg-fffafa">
                                                                                                                            <div class="booking_inner_dtl_h h-100 d-flex align-items-center justify-content-between">
                                                                                                                                <div>
                                                                                                                                    {bookingDetails
                                                                                                                                        .remainingPayments
                                                                                                                                        .length !== 0 &&
                                                                                                                                        (() => {
                                                                                                                                            if (
                                                                                                                                                index === 0
                                                                                                                                            )
                                                                                                                                                return "Second ";
                                                                                                                                            else if (
                                                                                                                                                index === 1
                                                                                                                                            )
                                                                                                                                                return "Third ";
                                                                                                                                            else if (
                                                                                                                                                index === 2
                                                                                                                                            )
                                                                                                                                                return "Fourth ";
                                                                                                                                            // Add more conditions as needed
                                                                                                                                            return ""; // Return default value if none of the conditions match
                                                                                                                                        })()}
                                                                                                                                    Remaining Payment
                                                                                                                                </div>
                                                                                                                                <div>
                                                                                                                                    {"(" +
                                                                                                                                        formatDatePro(
                                                                                                                                            paymentObj.publishDate
                                                                                                                                                ? paymentObj.publishDate
                                                                                                                                                : paymentObj.paymentDate
                                                                                                                                        ) +
                                                                                                                                        ")"}
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="row m-0 bdr-btm-eee">
                                                                                                                        <div className="col-lg-3 col-sm-6 p-0 align-self-stretc">
                                                                                                                            <div class="row m-0 h-100">
                                                                                                                                <div class="col-sm-5 align-self-stretc p-0">
                                                                                                                                    <div class="booking_inner_dtl_h h-100">
                                                                                                                                        Amount
                                                                                                                                    </div>
                                                                                                                                </div>
                                                                                                                                <div class="col-sm-7 align-self-stretc p-0">
                                                                                                                                    <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                                                                                                                        ₹{" "}
                                                                                                                                        {paymentObj.receivedPayment.toLocaleString()}
                                                                                                                                    </div>
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-lg-3 col-sm-6 p-0 align-self-stretc">
                                                                                                                            <div class="row m-0 h-100">
                                                                                                                                <div class="col-sm-5 align-self-stretc p-0">
                                                                                                                                    <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                                                                                                                        Pending
                                                                                                                                    </div>
                                                                                                                                </div>
                                                                                                                                <div class="col-sm-7 align-self-stretc p-0">
                                                                                                                                    <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                                                                                                                        ₹{" "}
                                                                                                                                        {bookingDetails
                                                                                                                                            .remainingPayments
                                                                                                                                            .length !==
                                                                                                                                            0 &&
                                                                                                                                            (() => {
                                                                                                                                                const filteredPayments =
                                                                                                                                                    bookingDetails.remainingPayments.filter(
                                                                                                                                                        (pay) =>
                                                                                                                                                            pay.serviceName ===
                                                                                                                                                            obj.serviceName
                                                                                                                                                    );

                                                                                                                                                const filteredLength =
                                                                                                                                                    filteredPayments.length;
                                                                                                                                                if (
                                                                                                                                                    index ===
                                                                                                                                                    0
                                                                                                                                                )
                                                                                                                                                    return (
                                                                                                                                                        parseInt(
                                                                                                                                                            obj.totalPaymentWGST
                                                                                                                                                        ) -
                                                                                                                                                        parseInt(
                                                                                                                                                            obj.firstPayment
                                                                                                                                                        ) -
                                                                                                                                                        parseInt(
                                                                                                                                                            paymentObj.receivedPayment
                                                                                                                                                        )
                                                                                                                                                    );
                                                                                                                                                else if (
                                                                                                                                                    index ===
                                                                                                                                                    1
                                                                                                                                                )
                                                                                                                                                    return (
                                                                                                                                                        parseInt(
                                                                                                                                                            obj.totalPaymentWGST
                                                                                                                                                        ) -
                                                                                                                                                        parseInt(
                                                                                                                                                            obj.firstPayment
                                                                                                                                                        ) -
                                                                                                                                                        parseInt(
                                                                                                                                                            paymentObj.receivedPayment
                                                                                                                                                        ) -
                                                                                                                                                        parseInt(
                                                                                                                                                            filteredPayments[0]
                                                                                                                                                                .receivedPayment
                                                                                                                                                        )
                                                                                                                                                    );
                                                                                                                                                else if (
                                                                                                                                                    index ===
                                                                                                                                                    2
                                                                                                                                                )
                                                                                                                                                    return parseInt(
                                                                                                                                                        bookingDetails.pendingAmount
                                                                                                                                                    );
                                                                                                                                                // Add more conditions as needed
                                                                                                                                                return ""; // Return default value if none of the conditions match
                                                                                                                                            })()}
                                                                                                                                    </div>
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-lg-6 col-sm-6 p-0 align-self-stretc">
                                                                                                                            <div class="row m-0 h-100">
                                                                                                                                <div class="col-sm-5 align-self-stretc p-0">
                                                                                                                                    <div class="booking_inner_dtl_h h-100 bdr-left-eee">
                                                                                                                                        Payment Date
                                                                                                                                    </div>
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
                                                                                                                    <div className="row m-0 bdr-btm-eee">
                                                                                                                        <div className="col-lg-6 col-sm-6 p-0 align-self-stretc">
                                                                                                                            <div class="row m-0 h-100">
                                                                                                                                <div class="col-sm-5 align-self-stretc p-0">
                                                                                                                                    <div class="booking_inner_dtl_h h-100">
                                                                                                                                        Payment Method
                                                                                                                                    </div>
                                                                                                                                </div>
                                                                                                                                <div class="col-sm-7 align-self-stretc p-0">
                                                                                                                                    <div
                                                                                                                                        class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap"
                                                                                                                                        title={
                                                                                                                                            paymentObj.paymentMethod
                                                                                                                                        }
                                                                                                                                    >
                                                                                                                                        {
                                                                                                                                            paymentObj.paymentMethod
                                                                                                                                        }
                                                                                                                                    </div>
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-lg-6 col-sm-4 p-0 align-self-stretc">
                                                                                                                            <div class="row m-0 h-100">
                                                                                                                                <div class="col-sm-4 align-self-stretc p-0">
                                                                                                                                    <div class="booking_inner_dtl_h h-100 bdr-left-eee">
                                                                                                                                        Extra Remarks
                                                                                                                                    </div>
                                                                                                                                </div>
                                                                                                                                <div class="col-sm-8 align-self-stretc p-0">
                                                                                                                                    <div
                                                                                                                                        class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap"
                                                                                                                                        title={
                                                                                                                                            paymentObj.extraRemarks
                                                                                                                                        }
                                                                                                                                    >
                                                                                                                                        {
                                                                                                                                            paymentObj.extraRemarks
                                                                                                                                        }
                                                                                                                                    </div>
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        ) : null // Render null for elements that don't match the condition
                                                                                                )}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                </div>
                                                            ))}
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
                                                                                    {bookingDetails &&
                                                                                        bookingDetails.caCase}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {bookingDetails &&
                                                                    bookingDetails.caCase !== "No" && (
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
                                                                                            {bookingDetails &&
                                                                                                bookingDetails.caNumber}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-lg-4 col-sm-6 p-0">
                                                                                <div class="row m-0">
                                                                                    <div class="col-sm-4 align-self-stretc p-0">
                                                                                        <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                                                                            CA's Email
                                                                                        </div>
                                                                                    </div>
                                                                                    <div class="col-sm-8 align-self-stretc p-0">
                                                                                        <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                                                                            {bookingDetails &&
                                                                                                bookingDetails.caEmail}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-lg-4 col-sm-6 p-0">
                                                                                <div class="row m-0">
                                                                                    <div class="col-sm-5 align-self-stretc p-0">
                                                                                        <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                                                                            CA's Commission
                                                                                        </div>
                                                                                    </div>
                                                                                    <div class="col-sm-7 align-self-stretc p-0">
                                                                                        <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                                                                            ₹{" "}
                                                                                            {bookingDetails &&
                                                                                                bookingDetails.caCommission}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                            </div>
                                                        </div>

                                                        {/* -------- Step 4 ---------*/}
                                                        <div className="mb-2 mt-3 mul-booking-card-inner-head">
                                                            <b>Payment Summary:</b>
                                                        </div>

                                                        <div className="my-card">
                                                            <div className="my-card-body">
                                                                <div className="row m-0 bdr-btm-eee">
                                                                    <div className="col-lg-4 col-sm-6 p-0 align-self-stretch">
                                                                        <div class="row m-0 h-100">
                                                                            <div class="col-sm-5 align-self-stretch p-0">
                                                                                <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                                                                    Total Amount
                                                                                </div>
                                                                            </div>
                                                                            <div class="col-sm-7 align-self-stretch p-0">
                                                                                <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                                                                    ₹{" "}
                                                                                    {bookingDetails &&
                                                                                        parseInt(
                                                                                            bookingDetails.totalAmount
                                                                                        ).toLocaleString()}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-lg-4 col-sm-6 p-0 align-self-stretch">
                                                                        <div class="row m-0 h-100">
                                                                            <div class="col-sm-5 align-self-stretch p-0">
                                                                                <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                                                                    Received Amount
                                                                                </div>
                                                                            </div>
                                                                            <div class="col-sm-7 align-self-stretch p-0">
                                                                                <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                                                                    ₹{" "}
                                                                                    {bookingDetails &&
                                                                                        parseInt(
                                                                                            bookingDetails.receivedAmount
                                                                                        ).toLocaleString()}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-lg-4 col-sm-5 p-0 align-self-stretch">
                                                                        <div class="row m-0 h-100">
                                                                            <div class="col-sm-6 align-self-stretch p-0">
                                                                                <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                                                                    Pending Amount
                                                                                </div>
                                                                            </div>
                                                                            <div class="col-sm-6 align-self-stretch p-0">
                                                                                <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                                                                    ₹{" "}
                                                                                    {bookingDetails &&
                                                                                        parseInt(
                                                                                            bookingDetails.pendingAmount
                                                                                        ).toLocaleString()}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="row m-0 bdr-btm-eee">
                                                                    <div className="col-lg-6 col-sm-6 p-0 align-self-stretch">
                                                                        <div class="row m-0 h-100">
                                                                            <div class="col-sm-4 align-self-stretch p-0">
                                                                                <div class="booking_inner_dtl_h h-100 ">
                                                                                    Payment Method
                                                                                </div>
                                                                            </div>
                                                                            <div class="col-sm-8 align-self-stretch p-0">
                                                                                <div
                                                                                    class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap"
                                                                                    title={
                                                                                        bookingDetails &&
                                                                                        bookingDetails.paymentMethod
                                                                                    }
                                                                                >
                                                                                    {bookingDetails &&
                                                                                        bookingDetails.paymentMethod}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-lg-6 col-sm-6 p-0 align-self-stretch">
                                                                        <div class="row m-0 h-100">
                                                                            <div class="col-sm-4 align-self-stretch p-0">
                                                                                <div class="booking_inner_dtl_h h-100 bdr-left-eee">
                                                                                    Extra Remarks
                                                                                </div>
                                                                            </div>
                                                                            <div class="col-sm-8 align-self-stretch p-0">
                                                                                <div
                                                                                    class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap"
                                                                                    title={
                                                                                        bookingDetails &&
                                                                                        bookingDetails.extraNotes
                                                                                    }
                                                                                >
                                                                                    {bookingDetails &&
                                                                                        bookingDetails.extraNotes}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>

                                                </div>
                                            )}
                                            {/* ------------------------------------------ Multiple Booking Section Starts here ----------------------------- */}
                                            {bookingDetails &&
                                                bookingDetails.moreBookings.length !== 0 &&
                                                bookingDetails.moreBookings.map((objMain, index) => (
                                                    <div
                                                        key={index + 2}
                                                        className={`tab-pane fade rm_bkng_item_detail_inner ${activeIndexBooking === index + 2
                                                            ? "show active"
                                                            : ""
                                                            }`}
                                                        id={`Booking_${index + 2}`} >


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
                                                                                        <span>
                                                                                            <i>
                                                                                                {objMain.bdmType === "Close-by"
                                                                                                    ? "Closed-by"
                                                                                                    : "Supported-by"}
                                                                                            </i>
                                                                                        </span>{" "}
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
                                                                                        {objMain.bookingSource === "Other"
                                                                                            ? objMain.otherBookingSource
                                                                                            : objMain.bookingSource}
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
                                                                                            {getOrdinal(index + 1)} Services
                                                                                            Name
                                                                                        </div>
                                                                                    </div>
                                                                                    <div class="col-sm-8 align-self-stretch p-0">
                                                                                        <div class="booking_inner_dtl_b bdr-left-eee h-100 services-name">
                                                                                            {obj.serviceName}{" "}
                                                                                            {obj.withDSC &&
                                                                                                obj.serviceName ===
                                                                                                "Start-Up India Certificate" &&
                                                                                                "With DSC"}
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
                                                                                            <div className="d-flex align-item-center justify-content-between">
                                                                                                <div>
                                                                                                    ₹{" "}
                                                                                                    {parseInt(
                                                                                                        obj.totalPaymentWGST
                                                                                                    ).toLocaleString()}
                                                                                                    {"("}
                                                                                                    {obj.totalPaymentWGST !==
                                                                                                        obj.totalPaymentWOGST
                                                                                                        ? "With GST"
                                                                                                        : "Without GST"}
                                                                                                    {")"}
                                                                                                </div>
                                                                                                {/* --------------------------------------------------------------   ADD expense Section  --------------------------------------------------- */}

                                                                                                {/* -------------------------------------   Expanse Section Ends Here  -------------------------------------------------- */}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="row m-0 bdr-btm-eee">
                                                                            <div className="col-lg-6 col-sm-5 p-0">
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
                                                                            <div className="col-lg-6 col-sm-5 p-0">
                                                                                <div class="row m-0">
                                                                                    <div class="col-sm-3 align-self-stretch p-0">
                                                                                        <div class="booking_inner_dtl_h h-100 bdr-left-eee">
                                                                                            Notes
                                                                                        </div>
                                                                                    </div>
                                                                                    <div class="col-sm-9 align-self-stretch p-0">
                                                                                        <div
                                                                                            class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap"
                                                                                            title={
                                                                                                obj.paymentRemarks
                                                                                                    ? obj.paymentRemarks
                                                                                                    : "N/A"
                                                                                            }
                                                                                        >
                                                                                            {obj.paymentRemarks
                                                                                                ? obj.paymentRemarks
                                                                                                : "N/A"}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        {obj.expanse !== 0 && obj.expanse && (
                                                                            <div className="row m-0 bdr-btm-eee">
                                                                                <div className="col-lg-6 col-sm-2 p-0">
                                                                                    <div class="row m-0">
                                                                                        <div class="col-sm-4 align-self-stretch p-0">
                                                                                            <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                                                                                Expense
                                                                                            </div>
                                                                                        </div>
                                                                                        <div class="col-sm-8 align-self-stretch p-0">
                                                                                            <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                                                                                - ₹{" "}
                                                                                                {obj.expanse
                                                                                                    ? obj.expanse.toLocaleString()
                                                                                                    : "N/A"}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-lg-6 col-sm-2 p-0">
                                                                                    <div class="row m-0">
                                                                                        <div class="col-sm-4 align-self-stretch p-0">
                                                                                            <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                                                                                expense Date
                                                                                            </div>
                                                                                        </div>
                                                                                        <div class="col-sm-8 align-self-stretch p-0">
                                                                                            <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                                                                                {formatDatePro(
                                                                                                    obj.expanseDate
                                                                                                        ? obj.expanseDate
                                                                                                        : objMain.bookingDate
                                                                                                )}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                        <div className="row m-0 bdr-btm-eee">
                                                                            {obj.paymentTerms === "two-part" && (
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
                                                                                                {parseInt(
                                                                                                    obj.firstPayment
                                                                                                ).toLocaleString()}
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
                                                                                                Second Payment
                                                                                            </div>
                                                                                        </div>
                                                                                        <div class="col-sm-8 align-self-stretch p-0">
                                                                                            <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                                                                                <div className="d-flex align-items-center justify-content-between">
                                                                                                    <div>
                                                                                                        ₹
                                                                                                        {parseInt(
                                                                                                            obj.secondPayment
                                                                                                        ).toLocaleString()}
                                                                                                        /- {"("}
                                                                                                        {isNaN(
                                                                                                            new Date(
                                                                                                                obj.secondPaymentRemarks
                                                                                                            )
                                                                                                        )
                                                                                                            ? obj.secondPaymentRemarks
                                                                                                            : "On " +
                                                                                                            obj.secondPaymentRemarks +
                                                                                                            ")"}
                                                                                                    </div>
                                                                                                </div>
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
                                                                                                <div className="d-flex align-items-center justify-content-between">
                                                                                                    <div>
                                                                                                        ₹{" "}
                                                                                                        {parseInt(
                                                                                                            obj.thirdPayment
                                                                                                        ).toLocaleString()}
                                                                                                        /- {"("}
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
                                                                                                <div className="d-flex align-items-center justify-content-between">
                                                                                                    <div>
                                                                                                        ₹{" "}
                                                                                                        {parseInt(
                                                                                                            obj.fourthPayment
                                                                                                        ).toLocaleString()}{" "}
                                                                                                        /- {"("}
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
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    {objMain.remainingPayments.length !== 0 &&
                                                                        objMain.remainingPayments.some(
                                                                            (boom) =>
                                                                                boom.serviceName === obj.serviceName
                                                                        ) && (
                                                                            <div
                                                                                className="my-card-body accordion"
                                                                                id={`accordionExample${index}`}
                                                                            >
                                                                                <div class="accordion-item bdr-none">
                                                                                    <div
                                                                                        id={`headingOne${index}`}
                                                                                        className="pr-10 accordion-header"
                                                                                    >
                                                                                        <div
                                                                                            className="row m-0 bdr-btm-eee accordion-button p-0"
                                                                                            data-bs-toggle="collapse"
                                                                                            data-bs-target={`#collapseOne${index}`}
                                                                                            aria-expanded="true"
                                                                                            aria-controls={`collapseOne${index}`}
                                                                                        >
                                                                                            <div className="w-95 p-0">
                                                                                                <div className="booking_inner_dtl_h h-100 d-flex align-items-center justify-content-between">
                                                                                                    <div>Remaining Payment </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div
                                                                                        id={`collapseOne${index}`}
                                                                                        class="accordion-collapse collapse show"
                                                                                        aria-labelledby={`headingOne${index}`}
                                                                                        data-bs-parent="#accordionExample"
                                                                                    // Add a unique key prop for each rendered element
                                                                                    >
                                                                                        {objMain.remainingPayments
                                                                                            .length !== 0 &&
                                                                                            objMain.remainingPayments
                                                                                                .filter(
                                                                                                    (boom) =>
                                                                                                        boom.serviceName ===
                                                                                                        obj.serviceName
                                                                                                )
                                                                                                .map(
                                                                                                    (paymentObj, index) =>
                                                                                                        paymentObj.serviceName ===
                                                                                                            obj.serviceName ? (
                                                                                                            <div class="accordion-body bdr-none p-0">
                                                                                                                <div>
                                                                                                                    <div className="row m-0 bdr-btm-eee bdr-top-eee">
                                                                                                                        <div className="col-lg-12 col-sm-6 p-0 align-self-stretc bg-fffafa">
                                                                                                                            <div class="booking_inner_dtl_h h-100 d-flex align-items-center justify-content-between">
                                                                                                                                <div>
                                                                                                                                    {objMain
                                                                                                                                        .remainingPayments
                                                                                                                                        .length !==
                                                                                                                                        0 &&
                                                                                                                                        (() => {
                                                                                                                                            if (
                                                                                                                                                index ===
                                                                                                                                                0
                                                                                                                                            )
                                                                                                                                                return "Second ";
                                                                                                                                            else if (
                                                                                                                                                index ===
                                                                                                                                                1
                                                                                                                                            )
                                                                                                                                                return "Third ";
                                                                                                                                            else if (
                                                                                                                                                index ===
                                                                                                                                                2
                                                                                                                                            )
                                                                                                                                                return "Fourth ";
                                                                                                                                            else if (
                                                                                                                                                index >
                                                                                                                                                2
                                                                                                                                            )
                                                                                                                                                return "Other ";
                                                                                                                                            // Add more conditions as needed
                                                                                                                                            return ""; // Return default value if none of the conditions match
                                                                                                                                        })()}
                                                                                                                                    Remaining
                                                                                                                                    Payment
                                                                                                                                </div>
                                                                                                                                <div className="d-flex align-items-center">
                                                                                                                                    <div>
                                                                                                                                        {"(" +
                                                                                                                                            formatDatePro(
                                                                                                                                                paymentObj.publishDate
                                                                                                                                                    ? paymentObj.publishDate
                                                                                                                                                    : paymentObj.paymentDate
                                                                                                                                            ) +
                                                                                                                                            ")"}
                                                                                                                                    </div>
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="row m-0 bdr-btm-eee">
                                                                                                                        <div className="col-lg-3 col-sm-6 p-0 align-self-stretc">
                                                                                                                            <div class="row m-0 h-100">
                                                                                                                                <div class="col-sm-5 align-self-stretc p-0">
                                                                                                                                    <div class="booking_inner_dtl_h h-100">
                                                                                                                                        Amount
                                                                                                                                    </div>
                                                                                                                                </div>
                                                                                                                                <div class="col-sm-7 align-self-stretc p-0">
                                                                                                                                    <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                                                                                                                        ₹{" "}
                                                                                                                                        {paymentObj.receivedPayment.toLocaleString()}
                                                                                                                                    </div>
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-lg-3 col-sm-6 p-0 align-self-stretc">
                                                                                                                            <div class="row m-0 h-100">
                                                                                                                                <div class="col-sm-5 align-self-stretc p-0">
                                                                                                                                    <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                                                                                                                        Pending
                                                                                                                                    </div>
                                                                                                                                </div>
                                                                                                                                <div class="col-sm-7 align-self-stretc p-0">
                                                                                                                                    <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                                                                                                                        ₹{" "}
                                                                                                                                        {objMain
                                                                                                                                            .remainingPayments
                                                                                                                                            .length !==
                                                                                                                                            0 &&
                                                                                                                                            (() => {
                                                                                                                                                const filteredPayments =
                                                                                                                                                    objMain.remainingPayments.filter(
                                                                                                                                                        (
                                                                                                                                                            pay
                                                                                                                                                        ) =>
                                                                                                                                                            pay.serviceName ===
                                                                                                                                                            obj.serviceName
                                                                                                                                                    );

                                                                                                                                                const filteredLength =
                                                                                                                                                    filteredPayments.length;
                                                                                                                                                if (
                                                                                                                                                    index ===
                                                                                                                                                    0
                                                                                                                                                )
                                                                                                                                                    return (
                                                                                                                                                        Math.round(
                                                                                                                                                            obj.totalPaymentWGST
                                                                                                                                                        ) -
                                                                                                                                                        Math.round(
                                                                                                                                                            obj.firstPayment
                                                                                                                                                        ) -
                                                                                                                                                        Math.round(
                                                                                                                                                            paymentObj.receivedPayment
                                                                                                                                                        )
                                                                                                                                                    );
                                                                                                                                                else if (
                                                                                                                                                    index ===
                                                                                                                                                    1
                                                                                                                                                )
                                                                                                                                                    return (
                                                                                                                                                        Math.round(
                                                                                                                                                            obj.totalPaymentWGST
                                                                                                                                                        ) -
                                                                                                                                                        Math.round(
                                                                                                                                                            obj.firstPayment
                                                                                                                                                        ) -
                                                                                                                                                        Math.round(
                                                                                                                                                            paymentObj.receivedPayment
                                                                                                                                                        ) -
                                                                                                                                                        Math.round(
                                                                                                                                                            filteredPayments[0]
                                                                                                                                                                .receivedPayment
                                                                                                                                                        )
                                                                                                                                                    );
                                                                                                                                                else if (
                                                                                                                                                    index ===
                                                                                                                                                    2
                                                                                                                                                )
                                                                                                                                                    return Math.round(
                                                                                                                                                        objMain.pendingAmount
                                                                                                                                                    );
                                                                                                                                                // Add more conditions as needed
                                                                                                                                                return ""; // Return default value if none of the conditions match
                                                                                                                                            })()}
                                                                                                                                        {/* {index === 0
                                                                        ? Math.round(obj.totalPaymentWGST) - Math.round(obj.firstPayment) - Math.round(paymentObj.receivedPayment)
                                                                        : index === 1
                                                                        ? Math.round(obj.totalPaymentWGST) - Math.round(obj.firstPayment) - Math.round(paymentObj.receivedPayment) - Math.round(bookingDetails.remainingPayments[0].receivedPayment)
                                                                        : Math.round(bookingDetails.pendingAmount)} */}
                                                                                                                                    </div>
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-lg-6 col-sm-6 p-0 align-self-stretc">
                                                                                                                            <div class="row m-0 h-100">
                                                                                                                                <div class="col-sm-5 align-self-stretc p-0">
                                                                                                                                    <div class="booking_inner_dtl_h h-100 bdr-left-eee">
                                                                                                                                        Payment Date
                                                                                                                                    </div>
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
                                                                                                                    <div className="row m-0 bdr-btm-eee">
                                                                                                                        <div className="col-lg-6 col-sm-6 p-0 align-self-stretc">
                                                                                                                            <div class="row m-0 h-100">
                                                                                                                                <div class="col-sm-5 align-self-stretc p-0">
                                                                                                                                    <div class="booking_inner_dtl_h h-100">
                                                                                                                                        Payment
                                                                                                                                        Method
                                                                                                                                    </div>
                                                                                                                                </div>
                                                                                                                                <div class="col-sm-7 align-self-stretc p-0">
                                                                                                                                    <div
                                                                                                                                        class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap"
                                                                                                                                        title={
                                                                                                                                            paymentObj.paymentMethod
                                                                                                                                        }
                                                                                                                                    >
                                                                                                                                        {
                                                                                                                                            paymentObj.paymentMethod
                                                                                                                                        }
                                                                                                                                    </div>
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-lg-6 col-sm-6 p-0 align-self-stretc">
                                                                                                                            <div class="row m-0 h-100">
                                                                                                                                <div class="col-sm-4 align-self-stretc p-0">
                                                                                                                                    <div class="booking_inner_dtl_h h-100 bdr-left-eee">
                                                                                                                                        Extra
                                                                                                                                        Remarks
                                                                                                                                    </div>
                                                                                                                                </div>
                                                                                                                                <div class="col-sm-8 align-self-stretc p-0">
                                                                                                                                    <div
                                                                                                                                        class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap"
                                                                                                                                        title={
                                                                                                                                            paymentObj.extraRemarks
                                                                                                                                        }
                                                                                                                                    >
                                                                                                                                        {
                                                                                                                                            paymentObj.extraRemarks
                                                                                                                                        }
                                                                                                                                    </div>
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        ) : null // Render null for elements that don't match the condition
                                                                                                )}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                </div>
                                                            ))}

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
                                                                                        {objMain.caCase}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    {objMain.caCase !== "No" && (
                                                                        <div className="row m-0 bdr-btm-eee">
                                                                            <div className="col-lg-4 col-sm-6 p-0">
                                                                                <div class="row m-0">
                                                                                    <div class="col-sm-5 align-self-stretc p-0">
                                                                                        <div class="booking_inner_dtl_h h-100">
                                                                                            CA's Number
                                                                                        </div>
                                                                                    </div>
                                                                                    <div class="col-sm-7 align-self-stretc p-0">
                                                                                        <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                                                                            {objMain.caNumber}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-lg-4 col-sm-6 p-0">
                                                                                <div class="row m-0">
                                                                                    <div class="col-sm-4 align-self-stretc p-0">
                                                                                        <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                                                                            CA's Email
                                                                                        </div>
                                                                                    </div>
                                                                                    <div class="col-sm-8 align-self-stretc p-0">
                                                                                        <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                                                                            {objMain.caEmail}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-lg-4 col-sm-6 p-0">
                                                                                <div class="row m-0">
                                                                                    <div class="col-sm-5 align-self-stretc p-0">
                                                                                        <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                                                                            CA's Commission
                                                                                        </div>
                                                                                    </div>
                                                                                    <div class="col-sm-7 align-self-stretc p-0">
                                                                                        <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                                                                            ₹ {objMain.caCommission}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>

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
                                                                                        {parseInt(
                                                                                            objMain.totalAmount
                                                                                        ).toLocaleString()}
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
                                                                                        {parseInt(
                                                                                            objMain.receivedAmount
                                                                                        ).toLocaleString()}
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
                                                                                        {parseInt(
                                                                                            objMain.pendingAmount
                                                                                        ).toLocaleString()}
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
                                                                                    <div
                                                                                        class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap"
                                                                                        title={objMain.paymentMethod}
                                                                                    >
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
                                                                                    <div
                                                                                        class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap"
                                                                                        title={objMain.extraNotes}
                                                                                    >
                                                                                        {objMain.extraNotes}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                ))}

                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    ) : (
                        <p>No details available.</p>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AdminBookingDetailDialog