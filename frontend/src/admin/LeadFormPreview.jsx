import React, { useState, useEffect } from "react";

import pdfimg from "../static/my-images/pdf.png";
import Swal from "sweetalert2";
import PdfImageViewerAdmin from "./PdfViewerAdmin";
import { IoAdd } from "react-icons/io5";
import CloseIcon from "@mui/icons-material/Close";
import { IconX } from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";


function LeadFormPreview({ setOpenAnchor, currentLeadForm }) {
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [sendingIndex, setSendingIndex] = useState(0);
  const [openOtherDocs, setOpenOtherDocs] = useState(false);
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  function formatDate(inputDate) {
    const date = new Date(inputDate);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Adding 1 to month because it's zero-based
    const day = String(date.getUTCDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }
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
  const handleViewPdfReciepts = (paymentreciept , companyName) => {
    const pathname = paymentreciept;
    //console.log(pathname);
    window.open(`${secretKey}/recieptpdf/${companyName}/${pathname}`, "_blank");
  };

  const handleViewPdOtherDocs = (pdfurl , companyName) => {
    const pathname = pdfurl;
    console.log(pathname);
    window.open(`${secretKey}/otherpdf/${companyName}/${pathname}`, "_blank");
  };

  
  // ----------------------------------------- Upload documents Section -----------------------------------------------------

  const handleOtherDocsUpload = (updatedFiles) => {
    setSelectedDocuments((prevSelectedDocuments) => {
      return [...prevSelectedDocuments, ...updatedFiles];
    });
  };

  const handleRemoveFile = (index) => {
    setSelectedDocuments((prevSelectedDocuments) => {
      // Create a copy of the array of selected documents
      const updatedDocuments = [...prevSelectedDocuments];
      // Remove the document at the specified index
      updatedDocuments.splice(index, 1);
      // Return the updated array of selected documents
      return updatedDocuments;
    });
  };

  const closeOtherDocsPopup = () => {
    setOpenOtherDocs(false);
  };
  const handleotherdocsAttachment = async () => {
    try {
      const files = selectedDocuments;
      console.log(files);

      if (files.length === 0) {
        // No files selected
        return;
      }

      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("otherDocs", files[i]);
      }
      console.log(formData);
      const response = await fetch(
        `${secretKey}/uploadotherdocsAttachment/${currentLeadForm["Company Name"]}/${sendingIndex}`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (response.ok) {
        Swal.fire({
          title: "Success!",
          html: `<small> File Uploaded successfully </small>
        `,
          icon: "success",
        });
        setSelectedDocuments([]);
        setOpenOtherDocs(false);

        
        
      } else {
        Swal.fire({
          title: "Error uploading file",

          icon: "error",
        });
        console.error("Error uploading file");
      }
    } catch (error) {
      Swal.fire({
        title: "Error uploading file",
        icon: "error",
      });
      console.error("Error uploading file:", error);
    }
  };
  return (
    <>
      <div className="booking-deatils-body-preview">
        <div className="my-card mt-2">
          <div className="my-card-head">Basic Informations:</div>
          <div className="my-card-body">
            <div className="row m-0 bdr-btm-eee">
              <div className="col-lg-7 col-sm-6 p-0">
                <div class="row m-0">
                  <div class="col-sm-4 align-self-stretc p-0">
                    <div class="booking_inner_dtl_h h-100">Company Name:</div>
                  </div>
                  <div class="col-sm-8 align-self-stretc p-0">
                    <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                      {currentLeadForm["Company Name"]}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-5 col-sm-6 p-0">
                <div class="row m-0">
                  <div class="col-sm-5 align-self-stretc p-0">
                    <div class="booking_inner_dtl_h bdr-left-eee h-100">
                      Email Address
                    </div>
                  </div>
                  <div class="col-sm-7 align-self-stretc p-0">
                    <div class="booking_inner_dtl_b bdr-left-eee h-100">
                      {currentLeadForm["Company Email"]}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row m-0 bdr-btm-eee">
              <div className="col-lg-3 col-sm-6 p-0">
                <div class="row m-0">
                  <div class="col-sm-5 align-self-stretc p-0">
                    <div class="booking_inner_dtl_h bdr-left-eee h-100">
                      Phone No
                    </div>
                  </div>
                  <div class="col-sm-7 align-self-stretc p-0">
                    <div class="booking_inner_dtl_b bdr-left-eee h-100">
                      {currentLeadForm["Company Number"]}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-sm-6 p-0">
                <div class="row m-0">
                  <div class="col-sm-7 align-self-stretc p-0">
                    <div class="booking_inner_dtl_h h-100">
                      Incorporation date
                    </div>
                  </div>
                  <div class="col-sm-5 align-self-stretc p-0">
                    <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                      {formatDate(currentLeadForm.incoDate)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-sm-6">
                <div class="row m-0">
                  <div class="col-sm-6 align-self-stretc p-0">
                    <div class="booking_inner_dtl_h bdr-left-eee h-100">
                      PAN/GST No.
                    </div>
                  </div>
                  <div class="col-sm-6 align-self-stretc p-0">
                    <div class="booking_inner_dtl_b bdr-left-eee h-100">
                      {currentLeadForm.panNumber}
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="col-lg-3 col-sm-6">
                <div class="row m-0">
                  <div class="col-sm-5 align-self-stretc p-0">
                    <div class="booking_inner_dtl_h bdr-left-eee h-100">
                      GST No:
                    </div>
                  </div>
                  <div class="col-sm-7 align-self-stretc p-0">
                    <div class="booking_inner_dtl_b bdr-left-eee h-100">
                      {currentLeadForm.gstNumber
                        ? currentLeadForm.gstNumber
                        : "N/A"}
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
        {/* ---------------------------------------------------- For More Bookings --------------------------------------- */}

        {currentLeadForm.moreBookings.length !== 0 && (
          <div className="row align-items-center m-0 justify-content-between mb-1 mt-3">
            <div className="mul_booking_heading col-6">
              <b>Booking 1</b>
            </div>
            <div className="mul_booking_date col-6">
              <b>{formatDatePro(currentLeadForm.bookingDate)}</b>
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
                    <div class="col-sm-4 align-self-stretc p-0">
                      <div class="booking_inner_dtl_h h-100">BDE Name</div>
                    </div>
                    <div class="col-sm-8 align-self-stretc p-0">
                      <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                        {currentLeadForm.bdeName}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-sm-6 p-0">
                  <div class="row m-0">
                    <div class="col-sm-4 align-self-stretc p-0">
                      <div class="booking_inner_dtl_h bdr-left-eee h-100">
                        BDE Email
                      </div>
                    </div>
                    <div class="col-sm-8 align-self-stretc p-0">
                      <div class="booking_inner_dtl_b bdr-left-eee h-100">
                        {currentLeadForm.bdeEmail}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-sm-6 p-0">
                  <div class="row m-0">
                    <div class="col-sm-4 align-self-stretc p-0">
                      <div class="booking_inner_dtl_h bdr-left-eee h-100">
                        BDM Name
                      </div>
                    </div>
                    <div class="col-sm-8 align-self-stretc p-0">
                      <div class="booking_inner_dtl_b bdr-left-eee h-100">
                        {currentLeadForm.bdmName} {currentLeadForm.bdmType}
                      </div>
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
                      <div class="booking_inner_dtl_b bdr-left-eee h-100">
                        {currentLeadForm.bdmEmail}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-sm-6 p-0">
                  <div class="row m-0">
                    <div class="col-sm-5 align-self-stretc p-0">
                      <div class="booking_inner_dtl_h h-100 bdr-left-eee">
                        Booking Date{" "}
                      </div>
                    </div>
                    <div class="col-sm-7 align-self-stretc p-0">
                      <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                        {formatDate(currentLeadForm.bookingDate)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-sm-6 p-0">
                  <div class="row m-0">
                    <div class="col-sm-4 align-self-stretc p-0">
                      <div class="booking_inner_dtl_h bdr-left-eee h-100">
                        Lead Source
                      </div>
                    </div>
                    <div class="col-sm-8 align-self-stretc p-0">
                      <div class="booking_inner_dtl_b bdr-left-eee h-100">
                        {currentLeadForm.bookingSource !== "Other"
                          ? currentLeadForm.bookingSource
                          : currentLeadForm.otherBookingSource}
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
                    <div class="col-sm-4 align-self-stretc p-0">
                      <div class="booking_inner_dtl_h h-100">
                        No. Of Services
                      </div>
                    </div>
                    <div class="col-sm-8 align-self-stretc p-0">
                      <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                        {currentLeadForm.services.length}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {currentLeadForm.services.map((obj, index) => (
            <div className="my-card mt-1">
              <div className="my-card-body">
                <div className="row m-0 bdr-btm-eee">
                  <div className="col-lg-6 col-sm-6 p-0">
                    <div class="row m-0">
                      <div class="col-sm-4 align-self-stretc p-0">
                        <div class="booking_inner_dtl_h h-100">
                          {getOrdinal(index + 1)} Services Name
                        </div>
                      </div>
                      <div class="col-sm-8 align-self-stretc p-0">
                        <div class="booking_inner_dtl_b bdr-left-eee h-100 services-name">
                          {obj.serviceName} {obj.withDSC && "With DSC"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-6 p-0">
                    <div class="row m-0">
                      <div class="col-sm-4 align-self-stretc p-0">
                        <div class="booking_inner_dtl_h h-100 bdr-left-eee">
                          Total Amount
                        </div>
                      </div>
                      <div class="col-sm-8 align-self-stretc p-0">
                        <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                          ₹ {obj.totalPaymentWGST}/- {"("}
                          {obj.totalPaymentWGST !== obj.totalPaymentWOGST
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
                      <div class="col-sm-4 align-self-stretc p-0">
                        <div class="booking_inner_dtl_h h-100">
                          Payment Terms
                        </div>
                      </div>
                      <div class="col-sm-8 align-self-stretc p-0">
                        <div class="booking_inner_dtl_b bdr-left-eee h-100">
                          {obj.paymentTerms === "two-part" ? "Part-Payment" : "Full Advanced"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-6 p-0">
                    <div class="row m-0">
                      <div class="col-sm-4 align-self-stretc p-0">
                        <div class="booking_inner_dtl_h h-100 bdr-left-eee">
                          Notes
                        </div>
                      </div>
                      <div class="col-sm-8 align-self-stretc p-0">
                        <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                          {obj.paymentRemarks ? obj.paymentRemarks : "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row m-0 bdr-btm-eee">
                  {obj.firstPayment !== 0 && (
                    <div className="col-lg-6 col-sm-6 p-0">
                      <div class="row m-0">
                        <div class="col-sm-4 align-self-stretc p-0">
                          <div class="booking_inner_dtl_h h-100">
                            First payment
                          </div>
                        </div>
                        <div class="col-sm-8 align-self-stretc p-0">
                          <div class="booking_inner_dtl_b bdr-left-eee h-100">
                            ₹ {Number(obj.firstPayment).toFixed(2)}/-
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {obj.secondPayment !== 0 && (
                    <div className="col-lg-6 col-sm-6 p-0">
                      <div class="row m-0">
                        <div class="col-sm-4 align-self-stretc p-0">
                          <div class="booking_inner_dtl_h h-100 bdr-left-eee">
                            Second Paymnet
                          </div>
                        </div>
                        <div class="col-sm-8 align-self-stretc p-0">
                          <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                            ₹{Number(obj.secondPayment).toFixed(2)}/- {"("}
                            {isNaN(new Date(obj.secondPaymentRemarks))
                              ? obj.secondPaymentRemarks
                              : "On " + obj.secondPaymentRemarks + ")"}
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
                        <div class="col-sm-4 align-self-stretc p-0">
                          <div class="booking_inner_dtl_h h-100">
                            Third Payment
                          </div>
                        </div>
                        <div class="col-sm-8 align-self-stretc p-0">
                          <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                            ₹ {Number(obj.thirdPayment).toFixed(2)}/- {"("}
                            {isNaN(new Date(obj.thirdPaymentRemarks))
                              ? obj.thirdPaymentRemarks
                              : "On " + obj.thirdPaymentRemarks + ")"}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {obj.fourthPayment !== 0 && (
                    <div className="col-lg-6 col-sm-6 p-0">
                      <div class="row m-0">
                        <div class="col-sm-4 align-self-stretc p-0">
                          <div class="booking_inner_dtl_h h-100 bdr-left-eee">
                            Fourth Payment
                          </div>
                        </div>
                        <div class="col-sm-8 align-self-stretc p-0">
                          <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                            ₹ {Number(obj.fourthPayment).toFixed(2)} /- {"("}
                            {isNaN(new Date(obj.fourthPaymentRemarks))
                              ? obj.fourthPaymentRemarks
                              : "On " + obj.fourthPaymentRemarks + ")"}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {/* -------------------------------------------- CA Case ------------------------------------------- */}
                              <div className="my-card mt-1">
                                <div className="my-card-body">
                                  <div className="row m-0 bdr-btm-eee">
                                    <div className="col-lg-12 col-sm-6 p-0">
                                      <div class="row m-0">
                                        <div class="col-sm-2 align-self-stretc p-0">
                                            <div class="booking_inner_dtl_h h-100">CA Case</div>
                                        </div>
                                        <div class="col-sm-10 align-self-stretc p-0">
                                            <div class="booking_inner_dtl_b h-100 bdr-left-eee">{currentLeadForm.caCase}</div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {currentLeadForm.caCase !== "No" && <div className="row m-0 bdr-btm-eee">
                                    <div className="col-lg-4 col-sm-6 p-0">
                                      <div class="row m-0">
                                        <div class="col-sm-5 align-self-stretc p-0">
                                            <div class="booking_inner_dtl_h h-100">CA's Number</div>
                                        </div>
                                        <div class="col-sm-7 align-self-stretc p-0">
                                            <div class="booking_inner_dtl_b bdr-left-eee h-100">{currentLeadForm.caNumber}</div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-lg-4 col-sm-6 p-0">
                                      <div class="row m-0">
                                        <div class="col-sm-4 align-self-stretc p-0">
                                            <div class="booking_inner_dtl_h bdr-left-eee h-100">CA's Email</div>
                                        </div>
                                        <div class="col-sm-8 align-self-stretc p-0">
                                            <div class="booking_inner_dtl_b bdr-left-eee h-100">{currentLeadForm.caEmail}</div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-lg-4 col-sm-6 p-0">
                                      <div class="row m-0">
                                        <div class="col-sm-5 align-self-stretc p-0">
                                            <div class="booking_inner_dtl_h bdr-left-eee h-100">CA's Commission</div>
                                        </div>
                                        <div class="col-sm-7 align-self-stretc p-0">
                                            <div class="booking_inner_dtl_b bdr-left-eee h-100">₹ {currentLeadForm.caCommission}</div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>}
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
                      <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                        ₹ {Number(currentLeadForm.totalAmount).toFixed(2)}/-
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-sm-6 p-0">
                  <div class="row m-0">
                    <div class="col-sm-6 align-self-stretc p-0">
                      <div class="booking_inner_dtl_h bdr-left-eee h-100">
                        Received Amount
                      </div>
                    </div>
                    <div class="col-sm-6 align-self-stretc p-0">
                      <div class="booking_inner_dtl_b bdr-left-eee h-100">
                        ₹ {Number(currentLeadForm.receivedAmount).toFixed(2)}/-
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-sm-6 p-0">
                  <div class="row m-0">
                    <div class="col-sm-5 align-self-stretc p-0">
                      <div class="booking_inner_dtl_h bdr-left-eee h-100">
                        Pending Amount
                      </div>
                    </div>
                    <div class="col-sm-7 align-self-stretc p-0">
                      <div class="booking_inner_dtl_b bdr-left-eee h-100">
                        ₹ {Number(currentLeadForm.pendingAmount).toFixed(2)}/-
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row m-0 bdr-btm-eee">
                <div className="col-lg-6 col-sm-6 p-0">
                  <div class="row m-0">
                    <div class="col-sm-4 align-self-stretc p-0">
                      <div class="booking_inner_dtl_h h-100">
                        Payment Method
                      </div>
                    </div>
                    <div class="col-sm-8 align-self-stretc p-0">
                      <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                        {currentLeadForm.paymentMethod}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-sm-6 p-0 align-self-stretch">
                  <div class="row h-100 m-0">
                    <div class="col-sm-4 align-self-stretc p-0">
                      <div class="booking_inner_dtl_h h-100 bdr-left-eee">
                        Extra Remarks
                      </div>
                    </div>
                    <div class="col-sm-8 align-self-stretc p-0">
                      <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                        {currentLeadForm.extraNotes}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {(currentLeadForm.paymentReceipt.length!==0 || currentLeadForm.otherDocs.length!==0) && (<> <div className="mb-2 mt-3 mul-booking-card-inner-head">
            <b>Payment Receipt and Additional Documents:</b>
          </div>
          <div className="row">
            {currentLeadForm.paymentReceipt.length!==0 && <div className="col-sm-2 mb-1">
              <div className="booking-docs-preview">
                <div
                  className="booking-docs-preview-img"
                  onClick={() =>
                    handleViewPdfReciepts(
                      currentLeadForm.paymentReceipt[0].filename , currentLeadForm["Company Name"]
                    )
                  }
                >
                  {currentLeadForm.paymentReceipt[0].filename.endsWith(
                    ".pdf"
                  ) ? (
                    <PdfImageViewerAdmin
                      type="paymentrecieptpdf"
                      companyName={currentLeadForm["Company Name"]}
                      path={currentLeadForm.paymentReceipt[0].filename}
                    />
                  ) : (
                    <img
                      src={`${secretKey}/recieptpdf/${currentLeadForm["Company Name"]}/${currentLeadForm.paymentReceipt[0].filename}`}
                      alt={pdfimg}
                    ></img>
                  )}
                </div>
                <div className="booking-docs-preview-text">
                  <p className="rematkText text-wrap m-auto m-0">Receipt.pdf</p>
                </div>
              </div>
            </div>}
            { currentLeadForm.otherDocs.map((obj) => (
              <div className="col-sm-2 mb-1">
                <div className="booking-docs-preview">
                  <div
                    className="booking-docs-preview-img"
                    onClick={() => handleViewPdOtherDocs(obj.filename , currentLeadForm["Company Name"])}
                  >
                    {obj.filename.endsWith(".pdf") ? (
                      <PdfImageViewerAdmin  type="pdf" path={obj.filename} companyName = {currentLeadForm["Company Name"]} />
                    ) : (
                      <img
                        src={`${secretKey}/otherpdf/${currentLeadForm["Company Name"]}/${obj.filename}`}
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
              <div className="col-sm-2 mb-1">
                                  <div
                                    className="booking-docs-preview"
                                    title="Upload More Documents"
                                  >
                                    <div
                                      className="upload-Docs-BTN"
                                      onClick={() => {
                                        setOpenOtherDocs(true);
                                        setSendingIndex(0);
                                      }}
                                    >
                                      <IoAdd />
                                    </div>
                                  </div>
                                </div>

                                <Dialog
                                  open={openOtherDocs}
                                  onClose={closeOtherDocsPopup}
                                  fullWidth
                                  maxWidth="sm"
                                >
                                  <DialogTitle>
                                    Upload Your Attachments
                                    <IconButton
                                      onClick={closeOtherDocsPopup}
                                      style={{ float: "right" }}
                                    >
                                      <CloseIcon color="primary"></CloseIcon>
                                    </IconButton>{" "}
                                  </DialogTitle>
                                  <DialogContent>
                                    <div className="maincon">
                                      {/* Single file input for multiple documents */}
                                      <div
                                        style={{
                                          justifyContent: "space-between",
                                        }}
                                        className="con1 d-flex"
                                      >
                                        <div
                                          style={{ paddingTop: "9px" }}
                                          className="uploadcsv"
                                        >
                                          <label
                                            style={{
                                              margin: "0px 0px 6px 0px",
                                            }}
                                            htmlFor="attachmentfile"
                                          >
                                            Upload Files
                                          </label>
                                        </div>
                                      </div>
                                      <div
                                        style={{ margin: "5px 0px 0px 0px" }}
                                        className="form-control"
                                      >
                                        <input
                                          type="file"
                                          name="attachmentfile"
                                          id="attachmentfile"
                                          onChange={(e) => {
                                            handleOtherDocsUpload(
                                              e.target.files
                                            );
                                          }}
                                          multiple // Allow multiple files selection
                                        />
                                        {selectedDocuments &&
                                          selectedDocuments.length > 0 && (
                                            <div className="uploaded-filename-main d-flex flex-wrap">
                                              {selectedDocuments.map(
                                                (file, index) => (
                                                  <div
                                                    className="uploaded-fileItem d-flex align-items-center"
                                                    key={index}
                                                  >
                                                    <p className="m-0">
                                                      {file.name}
                                                    </p>
                                                    <button
                                                      className="fileItem-dlt-btn"
                                                      onClick={() =>
                                                        handleRemoveFile(index)
                                                      }
                                                    >
                                                      <IconX className="close-icon" />
                                                    </button>
                                                  </div>
                                                )
                                              )}
                                            </div>
                                          )}
                                      </div>
                                    </div>
                                  </DialogContent>
                                  <button
                                    className="btn btn-primary"
                                    onClick={handleotherdocsAttachment}
                                  >
                                    Submit
                                  </button>
                                </Dialog>
          </div></>)}
        </div>
        {currentLeadForm.moreBookings &&
          currentLeadForm.moreBookings.map((objMain, index) => (
            <>
              <div className="row align-items-center m-0 justify-content-between mb-1 mt-3">
                <div className="mul_booking_heading col-6">
                  <b>Booking {index + 2}</b>
                </div>
                <div className="mul_booking_date col-6">
                  <b>{formatDatePro(objMain.bookingDate)}</b>
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
                          <div class="col-sm-4 align-self-stretc p-0">
                            <div class="booking_inner_dtl_h h-100">
                              BDE Name
                            </div>
                          </div>
                          <div class="col-sm-8 align-self-stretc p-0">
                            <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                              {objMain.bdeName}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-sm-6 p-0">
                        <div class="row m-0">
                          <div class="col-sm-4 align-self-stretc p-0">
                            <div class="booking_inner_dtl_h bdr-left-eee h-100">
                              BDE Email
                            </div>
                          </div>
                          <div class="col-sm-8 align-self-stretc p-0">
                            <div class="booking_inner_dtl_b bdr-left-eee h-100">
                              {objMain.bdeEmail}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-sm-6 p-0">
                        <div class="row m-0">
                          <div class="col-sm-4 align-self-stretc p-0">
                            <div class="booking_inner_dtl_h bdr-left-eee h-100">
                              BDM Name
                            </div>
                          </div>
                          <div class="col-sm-8 align-self-stretc p-0">
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
                          <div class="col-sm-4 align-self-stretc p-0">
                            <div class="booking_inner_dtl_h h-100">
                              BDM Email
                            </div>
                          </div>
                          <div class="col-sm-8 align-self-stretc p-0">
                            <div class="booking_inner_dtl_b bdr-left-eee h-100">
                              {objMain.bdmEmail}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-sm-6 p-0">
                        <div class="row m-0">
                          <div class="col-sm-5 align-self-stretc p-0">
                            <div class="booking_inner_dtl_h h-100 bdr-left-eee">
                              Booking Date{" "}
                            </div>
                          </div>
                          <div class="col-sm-7 align-self-stretc p-0">
                            <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                              {formatDate(objMain.bookingDate)}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-sm-6 p-0">
                        <div class="row m-0">
                          <div class="col-sm-4 align-self-stretc p-0">
                            <div class="booking_inner_dtl_h bdr-left-eee h-100">
                              Lead Source
                            </div>
                          </div>
                          <div class="col-sm-8 align-self-stretc p-0">
                            <div class="booking_inner_dtl_b bdr-left-eee h-100">
                              {objMain.bookingSource !== "Other"
                                ? objMain.bookingSource
                                : objMain.otherBookingSource}
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
                          <div class="col-sm-4 align-self-stretc p-0">
                            <div class="booking_inner_dtl_h h-100">
                              No. Of Services
                            </div>
                          </div>
                          <div class="col-sm-8 align-self-stretc p-0">
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
                            <div class="col-sm-4 align-self-stretc p-0">
                              <div class="booking_inner_dtl_h h-100">
                                {index + 1} Services Name
                              </div>
                            </div>
                            <div class="col-sm-8 align-self-stretc p-0">
                              <div class="booking_inner_dtl_b bdr-left-eee h-100 services-name">
                                {obj.serviceName} {obj.withDSC && "With DSC"}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 col-sm-6 p-0">
                          <div class="row m-0">
                            <div class="col-sm-4 align-self-stretc p-0">
                              <div class="booking_inner_dtl_h h-100 bdr-left-eee">
                                Total Amount
                              </div>
                            </div>
                            <div class="col-sm-8 align-self-stretc p-0">
                              <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                ₹ {obj.totalPaymentWGST}/- {"("}
                                {obj.totalPaymentWGST !== obj.totalPaymentWOGST
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
                            <div class="col-sm-4 align-self-stretc p-0">
                              <div class="booking_inner_dtl_h h-100">
                                Payment Terms
                              </div>
                            </div>
                            <div class="col-sm-8 align-self-stretc p-0">
                              <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                {obj.paymentTerms === "two-part" ? "Part-Payment" : "Full Advanced"}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 col-sm-6 p-0">
                          <div class="row m-0">
                            <div class="col-sm-4 align-self-stretc p-0">
                              <div class="booking_inner_dtl_h h-100 bdr-left-eee">
                                Notes
                              </div>
                            </div>
                            <div class="col-sm-8 align-self-stretc p-0">
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
                              <div class="col-sm-4 align-self-stretc p-0">
                                <div class="booking_inner_dtl_h h-100">
                                  First payment
                                </div>
                              </div>
                              <div class="col-sm-8 align-self-stretc p-0">
                                <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                  ₹ {Number(obj.firstPayment).toFixed(2)}/-
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        {obj.secondPayment !== 0 && (
                          <div className="col-lg-6 col-sm-6 p-0">
                            <div class="row m-0">
                              <div class="col-sm-4 align-self-stretc p-0">
                                <div class="booking_inner_dtl_h h-100 bdr-left-eee">
                                  Second Paymnet
                                </div>
                              </div>
                              <div class="col-sm-8 align-self-stretc p-0">
                                <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                  ₹{Number(obj.secondPayment).toFixed(2)}/-{" "}
                                  {"("}
                                  {isNaN(new Date(obj.secondPaymentRemarks))
                                    ? obj.secondPaymentRemarks
                                    : "On" + obj.secondPaymentRemarks}
                                  {")"}
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
                              <div class="col-sm-4 align-self-stretc p-0">
                                <div class="booking_inner_dtl_h h-100">
                                  Third Payment
                                </div>
                              </div>
                              <div class="col-sm-8 align-self-stretc p-0">
                                <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                  ₹ {Number(obj.thirdPayment).toFixed(2)}/-{" "}
                                  {"("}
                                  {obj.thirdPaymentRemarks}
                                  {")"}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        {obj.fourthPayment !== 0 && (
                          <div className="col-lg-6 col-sm-6 p-0">
                            <div class="row m-0">
                              <div class="col-sm-4 align-self-stretc p-0">
                                <div class="booking_inner_dtl_h h-100 bdr-left-eee">
                                  Fourth Payment
                                </div>
                              </div>
                              <div class="col-sm-8 align-self-stretc p-0">
                                <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                  ₹ {Number(obj.fourthPayment).toFixed(2)} /-{" "}
                                  {"("}
                                  {obj.fourthPaymentRemarks}
                                  {")"}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {/* -------------------------------------------- CA Case ------------------------------------------- */}
                <div className="my-card mt-1">
                                <div className="my-card-body">
                                  <div className="row m-0 bdr-btm-eee">
                                    <div className="col-lg-12 col-sm-6 p-0">
                                      <div class="row m-0">
                                        <div class="col-sm-2 align-self-stretc p-0">
                                            <div class="booking_inner_dtl_h h-100">CA Case</div>
                                        </div>
                                        <div class="col-sm-10 align-self-stretc p-0">
                                            <div class="booking_inner_dtl_b h-100 bdr-left-eee">{objMain.caCase}</div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {objMain.caCase !== "No" && <div className="row m-0 bdr-btm-eee">
                                    <div className="col-lg-4 col-sm-6 p-0">
                                      <div class="row m-0">
                                        <div class="col-sm-5 align-self-stretc p-0">
                                            <div class="booking_inner_dtl_h h-100">CA's Number</div>
                                        </div>
                                        <div class="col-sm-7 align-self-stretc p-0">
                                            <div class="booking_inner_dtl_b bdr-left-eee h-100">{objMain.caNumber}</div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-lg-4 col-sm-6 p-0">
                                      <div class="row m-0">
                                        <div class="col-sm-4 align-self-stretc p-0">
                                            <div class="booking_inner_dtl_h bdr-left-eee h-100">CA's Email</div>
                                        </div>
                                        <div class="col-sm-8 align-self-stretc p-0">
                                            <div class="booking_inner_dtl_b bdr-left-eee h-100">{objMain.caEmail}</div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-lg-4 col-sm-6 p-0">
                                      <div class="row m-0">
                                        <div class="col-sm-5 align-self-stretc p-0">
                                            <div class="booking_inner_dtl_h bdr-left-eee h-100">CA's Commission</div>
                                        </div>
                                        <div class="col-sm-7 align-self-stretc p-0">
                                            <div class="booking_inner_dtl_b bdr-left-eee h-100">₹ {objMain.caCommission}</div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>}
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
                            <div class="booking_inner_dtl_h h-100">
                              Total Amount
                            </div>
                          </div>
                          <div class="col-sm-7 align-self-stretc p-0">
                            <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                              ₹ {Number(objMain.totalAmount).toFixed(2)}/-
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-sm-6 p-0">
                        <div class="row m-0">
                          <div class="col-sm-6 align-self-stretc p-0">
                            <div class="booking_inner_dtl_h bdr-left-eee h-100">
                              Received Amount
                            </div>
                          </div>
                          <div class="col-sm-6 align-self-stretc p-0">
                            <div class="booking_inner_dtl_b bdr-left-eee h-100">
                              ₹ {Number(objMain.receivedAmount).toFixed(2)}/-
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-sm-6 p-0">
                        <div class="row m-0">
                          <div class="col-sm-5 align-self-stretc p-0">
                            <div class="booking_inner_dtl_h bdr-left-eee h-100">
                              Pending Amount
                            </div>
                          </div>
                          <div class="col-sm-7 align-self-stretc p-0">
                            <div class="booking_inner_dtl_b bdr-left-eee h-100">
                              ₹ {Number(objMain.pendingAmount).toFixed(2)}/-
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row m-0 bdr-btm-eee">
                      <div className="col-lg-6 col-sm-6 p-0">
                        <div class="row m-0">
                          <div class="col-sm-4 align-self-stretc p-0">
                            <div class="booking_inner_dtl_h h-100">
                              Payment Method
                            </div>
                          </div>
                          <div class="col-sm-8 align-self-stretc p-0">
                            <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                              {objMain.paymentMethod}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 col-sm-6 p-0">
                        <div class="row m-0">
                          <div class="col-sm-4 align-self-stretc p-0">
                            <div class="booking_inner_dtl_h h-100 bdr-left-eee">
                              Extra Remarks
                            </div>
                          </div>
                          <div class="col-sm-8 align-self-stretc p-0">
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
               {(objMain.paymentReceipt.length!==0 || objMain.otherDocs.length!==0) && <>
               
                <div className="row">
                  {objMain.paymentReceipt.length!==0 && <div className="col-sm-2 mb-1">
                    <div className="booking-docs-preview">
                      <div
                        className="booking-docs-preview-img"
                        onClick={() =>
                          handleViewPdfReciepts(
                            objMain.paymentReceipt[0].filename , currentLeadForm["Company Name"]
                          )
                        }
                      >
                        {objMain.paymentReceipt[0].filename.endsWith(".pdf") ? (
                          <PdfImageViewerAdmin
                            type="paymentrecieptpdf"
                            path={objMain.paymentReceipt[0].filename}
                            companyName={currentLeadForm["Company Name"]}
                          />
                        ) : (
                          <img
                            src={`${secretKey}/recieptpdf/${currentLeadForm["Company Name"]}/${objMain.paymentReceipt[0].filename}`}
                            alt={pdfimg}
                          ></img>
                        )}
                      </div>
                      <div className="booking-docs-preview-text">
                        <p className="rematkText text-wrap m-auto m-0">
                          {objMain.paymentReceipt[0].originalname}
                        </p>
                      </div>
                    </div>
                  </div>}
                  {objMain.otherDocs.length!==0 && objMain.otherDocs.map((obj) => (
                    <div className="col-sm-2 mb-1">
                      <div className="booking-docs-preview">
                        <div
                          className="booking-docs-preview-img"
                          onClick={() => handleViewPdOtherDocs(obj.filename , currentLeadForm["Company Name"])}
                        >
                          {obj.filename.endsWith(".pdf") ? (
                            <PdfImageViewerAdmin
                              type="pdf"
                              companyName = {currentLeadForm["Company Name"]}
                              path={obj.filename}
                            />
                          ) : (
                            <img
                              src={`${secretKey}/otherpdf/${currentLeadForm["Company Name"]}/${obj.filename}`}
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
              
                </>}
                <div className="col-sm-2 mb-1">
                                  <div
                                    className="booking-docs-preview"
                                    title="Upload More Documents"
                                  >
                                    <div
                                      className="upload-Docs-BTN"
                                      onClick={() => {
                                        setOpenOtherDocs(true);
                                        setSendingIndex(index+1);
                                      }}
                                    >
                                      <IoAdd />
                                    </div>
                                  </div>
                                </div>

                                <Dialog
                                  open={openOtherDocs}
                                  onClose={closeOtherDocsPopup}
                                  fullWidth
                                  maxWidth="sm"
                                >
                                  <DialogTitle>
                                    Upload Your Attachments
                                    <IconButton
                                      onClick={closeOtherDocsPopup}
                                      style={{ float: "right" }}
                                    >
                                      <CloseIcon color="primary"></CloseIcon>
                                    </IconButton>{" "}
                                  </DialogTitle>
                                  <DialogContent>
                                    <div className="maincon">
                                      {/* Single file input for multiple documents */}
                                      <div
                                        style={{
                                          justifyContent: "space-between",
                                        }}
                                        className="con1 d-flex"
                                      >
                                        <div
                                          style={{ paddingTop: "9px" }}
                                          className="uploadcsv"
                                        >
                                          <label
                                            style={{
                                              margin: "0px 0px 6px 0px",
                                            }}
                                            htmlFor="attachmentfile"
                                          >
                                            Upload Files
                                          </label>
                                        </div>
                                      </div>
                                      <div
                                        style={{ margin: "5px 0px 0px 0px" }}
                                        className="form-control"
                                      >
                                        <input
                                          type="file"
                                          name="attachmentfile"
                                          id="attachmentfile"
                                          onChange={(e) => {
                                            handleOtherDocsUpload(
                                              e.target.files
                                            );
                                          }}
                                          multiple // Allow multiple files selection
                                        />
                                        {selectedDocuments &&
                                          selectedDocuments.length > 0 && (
                                            <div className="uploaded-filename-main d-flex flex-wrap">
                                              {selectedDocuments.map(
                                                (file, index) => (
                                                  <div
                                                    className="uploaded-fileItem d-flex align-items-center"
                                                    key={index}
                                                  >
                                                    <p className="m-0">
                                                      {file.name}
                                                    </p>
                                                    <button
                                                      className="fileItem-dlt-btn"
                                                      onClick={() =>
                                                        handleRemoveFile(index)
                                                      }
                                                    >
                                                      <IconX className="close-icon" />
                                                    </button>
                                                  </div>
                                                )
                                              )}
                                            </div>
                                          )}
                                      </div>
                                    </div>
                                  </DialogContent>
                                  <button
                                    className="btn btn-primary"
                                    onClick={handleotherdocsAttachment}
                                  >
                                    Submit
                                  </button>
                                </Dialog>
                
              </div>
            </>
          ))}
      </div>
    </>
    // <div>
    //   <div className="steprForm-inner">
    //     <div className="stepOnePreview">
    //       <div className="d-flex align-items-center">
    //         <div className="services_No">1</div>
    //         <div className="ml-1">
    //           <h3 className="m-0">Company's Basic Informations</h3>
    //         </div>
    //       </div>
    //       <div className="servicesFormCard mt-3">
    //         <div className="row m-0">
    //           <div className="col-sm-3 p-0">
    //             <div className="form-label-name">
    //               <b>Company name</b>
    //             </div>
    //           </div>
    //           <div className="col-sm-9 p-0">
    //             <div className="form-label-data">
    //               {currentLeadForm["Company Name"]}
    //             </div>
    //           </div>
    //         </div>
    //         <div className="row m-0">
    //           <div className="col-sm-3 p-0">
    //             <div className="form-label-name">
    //               <b>Email Address:</b>
    //             </div>
    //           </div>
    //           <div className="col-sm-9 p-0">
    //             <div className="form-label-data">
    //               {currentLeadForm["Company Email"]}
    //             </div>
    //           </div>
    //         </div>
    //         <div className="row m-0">
    //           <div className="col-sm-3 p-0">
    //             <div className="form-label-name">
    //               <b>Phone No:</b>
    //             </div>
    //           </div>
    //           <div className="col-sm-9 p-0">
    //             <div className="form-label-data">
    //               {currentLeadForm["Company Number"]}
    //             </div>
    //           </div>
    //         </div>
    //         <div className="row m-0">
    //           <div className="col-sm-3 p-0">
    //             <div className="form-label-name">
    //               <b>Incorporation date:</b>
    //             </div>
    //           </div>
    //           <div className="col-sm-9 p-0">
    //             <div className="form-label-data">
    //               {formatDate(currentLeadForm.incoDate)}
    //             </div>
    //           </div>
    //         </div>
    //         <div className="row m-0">
    //           <div className="col-sm-3 p-0">
    //             <div className="form-label-name">
    //               <b>Company's PAN:</b>
    //             </div>
    //           </div>
    //           <div className="col-sm-9 p-0">
    //             <div className="form-label-data">
    //               {currentLeadForm.panNumber ? currentLeadForm.panNumber : "-"}
    //             </div>
    //           </div>
    //         </div>
    //         <div className="row m-0">
    //           <div className="col-sm-3 p-0">
    //             <div className="form-label-name">
    //               <b>Company's GST:</b>
    //             </div>
    //           </div>
    //           <div className="col-sm-9 p-0">
    //             <div className="form-label-data">
    //               {currentLeadForm.gstNumber ? currentLeadForm.gstNumber : "-"}
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //     <div className="stepTWOPreview">
    //       <div className="d-flex align-items-center mt-3">
    //         <div className="services_No">2</div>
    //         <div className="ml-1">
    //           <h3 className="m-0">Booking Details</h3>
    //         </div>
    //       </div>
    //       <div className="servicesFormCard mt-3">
    //         <div className="row m-0">
    //           <div className="col-sm-3 p-0">
    //             <div className="form-label-name">
    //               <b>BDE Name:</b>
    //             </div>
    //           </div>
    //           <div className="col-sm-9 p-0">
    //             <div className="form-label-data">{currentLeadForm.bdeName}</div>
    //           </div>
    //         </div>
    //         <div className="row m-0">
    //           <div className="col-sm-3 p-0">
    //             <div className="form-label-name">
    //               <b>BDE Email</b>
    //             </div>
    //           </div>
    //           <div className="col-sm-9 p-0">
    //             <div className="form-label-data">{currentLeadForm.bdeEmail ? currentLeadForm.bdeEmail : "-"}</div>
    //           </div>
    //         </div>
    //         <div className="row m-0">
    //           <div className="col-sm-3 p-0">
    //             <div className="form-label-name">
    //               <b>BDM Name</b>
    //             </div>
    //           </div>
    //           <div className="col-sm-9 p-0">
    //             <div className="form-label-data">{currentLeadForm.bdmName}</div>
    //           </div>
    //         </div>
    //         <div className="row m-0">
    //           <div className="col-sm-3 p-0">
    //             <div className="form-label-name">
    //               <b>BDM Email</b>
    //             </div>
    //           </div>
    //           <div className="col-sm-9 p-0">
    //             <div className="form-label-data">{currentLeadForm.bdmEmail ? currentLeadForm.bdmEmail : "-"}</div>
    //           </div>
    //         </div>
    //         <div className="row m-0">
    //           <div className="col-sm-3 p-0">
    //             <div className="form-label-name">
    //               <b>Booking Date</b>
    //             </div>
    //           </div>
    //           <div className="col-sm-9 p-0">
    //             <div className="form-label-data">{currentLeadForm.bookingDate}</div>
    //           </div>
    //         </div>
    //         <div className="row m-0">
    //           <div className="col-sm-3 p-0">
    //             <div className="form-label-name">
    //               <b>Lead Source</b>
    //             </div>
    //           </div>
    //           <div className="col-sm-9 p-0">
    //             <div className="form-label-data">
    //               {currentLeadForm.bookingSource !== "" ? currentLeadForm.bookingSource : "-"}
    //             </div>
    //           </div>
    //         </div>
    //         {currentLeadForm.bookingSource==="Other" && <div className="row m-0">
    //           <div className="col-sm-3 p-0">
    //             <div className="form-label-name">
    //               <b>Other Lead Source</b>
    //             </div>
    //           </div>
    //           <div className="col-sm-9 p-0">
    //             <div className="form-label-data">
    //               {currentLeadForm.otherBookingSource}
    //             </div>
    //           </div>
    //         </div>}
    //       </div>
    //     </div>
    //     <div className="stepThreePreview">
    //       <div className="d-flex align-items-center mt-3">
    //         <div className="services_No">3</div>
    //         <div className="ml-1">
    //           <h3 className="m-0">Services And Payment Details</h3>
    //         </div>
    //       </div>
    //       <div className="servicesFormCard mt-3">
    //         <div className="row m-0">
    //           <div className="col-sm-3 p-0">
    //             <div className="form-label-name">
    //               <b>Total Selected Services</b>
    //             </div>
    //           </div>
    //           <div className="col-sm-9 p-0">
    //             <div className="form-label-data">{currentLeadForm.services.length}</div>
    //           </div>
    //         </div>
    //         {currentLeadForm.services.map((obj, index) => (
    //           <div className="parServicesPreview mt-3">
    //             <div className="row m-0">
    //               <div className="col-sm-3 p-0">
    //                 <div className="form-label-name">
    //                   <b>{getOrdinal(index + 1)} Services Name</b>
    //                 </div>
    //               </div>
    //               <div className="col-sm-9 p-0">
    //                 <div className="form-label-data">{obj.serviceName}</div>
    //               </div>
    //             </div>
    //             {/* <!-- Optional --> */}
    //             {obj.serviceName === "Start-Up India Certificate" && (
    //               <div className="row m-0">
    //                 <div className="col-sm-3 p-0">
    //                   <div className="form-label-name">
    //                     <b>With DSC</b>
    //                   </div>
    //                 </div>
    //                 <div className="col-sm-9 p-0">
    //                   <div className="form-label-data">
    //                     {obj.withDSC === true ? "Yes" : "No"}
    //                   </div>
    //                 </div>
    //               </div>
    //             )}
    //             {/* total amount */}
    //             <div className="row m-0">
    //               <div className="col-sm-3 p-0">
    //                 <div className="form-label-name">
    //                   <b>Total Amount</b>
    //                 </div>
    //               </div>
    //               <div className="col-sm-9 p-0">
    //                 <div className="form-label-data">
    //                   {obj.totalPaymentWGST !== undefined
    //                     ? Number(obj.totalPaymentWGST).toFixed(2)
    //                     : "0"}
    //                 </div>
    //               </div>
    //             </div>
    //             <div className="row m-0">
    //               <div className="col-sm-3 p-0">
    //                 <div className="form-label-name">
    //                   <b>With GST</b>
    //                 </div>
    //               </div>
    //               <div className="col-sm-9 p-0">
    //                 <div className="form-label-data">
    //                   {obj.withGST === true ? "Yes" : "No"}
    //                 </div>
    //               </div>
    //             </div>
    //             <div className="row m-0">
    //               <div className="col-sm-3 p-0">
    //                 <div className="form-label-name">
    //                   <b>Payment Terms</b>
    //                 </div>
    //               </div>
    //               <div className="col-sm-9 p-0">
    //                 <div className="form-label-data">{obj.paymentTerms === "Full Advanced" ? "Full Advanced" : "Part-payment"}</div>
    //               </div>
    //             </div>
    //             {obj.firstPayment!==0 && <div className="row m-0">
    //               <div className="col-sm-3 p-0">
    //                 <div className="form-label-name">
    //                   <b>First Payment</b>
    //                 </div>
    //               </div>
    //               <div className="col-sm-9 p-0">
    //                 <div className="form-label-data"> ₹ {Number(obj.firstPayment).toFixed(2)}</div>
    //               </div>
    //             </div>}
    //             {obj.secondPayment!==0 && <div className="row m-0">
    //               <div className="col-sm-3 p-0">
    //                 <div className="form-label-name">
    //                   <b>Second Payment</b>
    //                 </div>
    //               </div>
    //               <div className="col-sm-9 p-0">
    //                 <div className="form-label-data">₹ {Number(obj.secondPayment).toFixed(2)} - { isNaN(new Date(obj.secondPaymentRemarks)) ? obj.secondPaymentRemarks : `Payment On ${obj.secondPaymentRemarks}`}</div>
    //               </div>
    //             </div>}
    //             {obj.thirdPayment!==0 && <div className="row m-0">
    //               <div className="col-sm-3 p-0">
    //                 <div className="form-label-name">
    //                   <b>Third Payment</b>
    //                 </div>
    //               </div>
    //               <div className="col-sm-9 p-0">
    //                 <div className="form-label-data">₹ {Number(obj.thirdPayment).toFixed(2)} - {isNaN(new Date(obj.thirdPaymentRemarks)) ? obj.thirdPaymentRemarks : `Payment On ${obj.thirdPaymentRemarks}`}</div>
    //               </div>
    //             </div>}
    //            {obj.fourthPayment!==0 && <div className="row m-0">
    //               <div className="col-sm-3 p-0">
    //                 <div className="form-label-name">
    //                   <b>Fourth Payment</b>
    //                 </div>
    //               </div>
    //               <div className="col-sm-9 p-0">
    //                 <div className="form-label-data"> ₹ {Number(obj.fourthPayment).toFixed(2)} - {isNaN(new Date(obj.fourthPaymentRemarks)) ? obj.fourthPaymentRemarks : `Payment On ${obj.fourthPaymentRemarks}`}</div>
    //               </div>
    //             </div>}
    //             <div className="row m-0">
    //               <div className="col-sm-3 p-0">
    //                 <div className="form-label-name">
    //                   <b>Notes</b>
    //                 </div>
    //               </div>
    //               <div className="col-sm-9 p-0">
    //                 <div className="form-label-data">
    //                   {obj.paymentRemarks !== "" ? obj.paymentRemarks : "-"}
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         ))}

    //         {/* total amount */}
    //       </div>
    //     </div>
    //     <div className="stepThreePreview">
    //       <div className="d-flex align-items-center mt-3">
    //         <div className="services_No">4</div>
    //         <div className="ml-1">
    //           <h3 className="m-0">Payment Summary</h3>
    //         </div>
    //       </div>
    //       <div className="servicesFormCard mt-3">
    //         <div className="row m-0">
    //           <div className="col-sm-4">
    //             <div className="row">
    //               <div className="col-sm-6 p-0">
    //                 <div className="form-label-name">
    //                   <b>Total Payment</b>
    //                 </div>
    //               </div>
    //               <div className="col-sm-6 p-0">
    //                 <div className="form-label-data">
    //                   ₹ {(Number(currentLeadForm.totalAmount).toFixed(2)).toLocaleString()}
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //           <div className="col-sm-4">
    //             <div className="row">
    //               <div className="col-sm-6 p-0">
    //                 <div className="form-label-name">
    //                   <b>Received Payment</b>
    //                 </div>
    //               </div>
    //               <div className="col-sm-6 p-0">
    //                 <div className="form-label-data">
    //                   ₹ {(Number(currentLeadForm.receivedAmount).toFixed(2)).toLocaleString()}
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //           <div className="col-sm-4">
    //             <div className="row">
    //               <div className="col-sm-6 p-0">
    //                 <div className="form-label-name">
    //                   <b>Pending Payment</b>
    //                 </div>
    //               </div>
    //               <div className="col-sm-6 p-0">
    //                 <div className="form-label-data">
    //                   ₹ {(Number(currentLeadForm.pendingAmount).toFixed(2)).toLocaleString()}
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //         <div className="row m-0">
    //           <div className="col-sm-3 align-self-stretc p-0">
    //             <div className="form-label-name h-100">
    //               <b>Upload Payment Receipt</b>
    //             </div>
    //           </div>
    //           <div className="col-sm-9 p-0">
    //             <div className="form-label-data">
    //               <div
    //                 className="UploadDocPreview"
    //                 onClick={() => {
    //                   handleViewPdfReciepts(
    //                     currentLeadForm.paymentReceipt[0].filename
    //                       ? currentLeadForm.paymentReceipt[0].filename
    //                       : currentLeadForm.paymentReceipt[0].name
    //                   );
    //                 }}
    //               >
    //                 {currentLeadForm.paymentReceipt[0].filename ? (
    //                   <>
    //                     <div className="docItemImg">
    //                       <img
    //                         src={
    //                           currentLeadForm.paymentReceipt[0].filename.endsWith(
    //                             ".pdf"
    //                           )
    //                             ? pdfimg
    //                             : img
    //                         }
    //                       ></img>
    //                     </div>
    //                     <div
    //                       className="docItemName wrap-MyText"
    //                       title={
    //                         currentLeadForm.paymentReceipt[0].filename.split("-")[1]
    //                       }
    //                     >
    //                       {currentLeadForm.paymentReceipt[0].filename.split("-")[1]}
    //                     </div>
    //                   </>
    //                 ) : (
    //                   <>
    //                     <div className="docItemImg">
    //                       <img
    //                         src={
    //                           currentLeadForm.paymentReceipt[0].name.endsWith(".pdf")
    //                             ? pdfimg
    //                             : img
    //                         }
    //                       ></img>
    //                     </div>
    //                     <div
    //                       className="docItemName wrap-MyText"
    //                       title={currentLeadForm.paymentReceipt[0].name.split("-")[1]}
    //                     >
    //                       {currentLeadForm.paymentReceipt[0].name.split("-")[1]}
    //                     </div>
    //                   </>
    //                 )}
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //         <div className="row m-0">
    //           <div className="col-sm-3 p-0">
    //             <div className="form-label-name">
    //               <b>Payment Method</b>
    //             </div>
    //           </div>
    //           <div className="col-sm-9 p-0">
    //             <div className="form-label-data">{currentLeadForm.paymentMethod}</div>
    //           </div>
    //         </div>
    //         <div className="row m-0">
    //           <div className="col-sm-3 p-0">
    //             <div className="form-label-name">
    //               <b>Extra Remarks</b>
    //             </div>
    //           </div>
    //           <div className="col-sm-9 p-0">
    //             <div className="form-label-data">{currentLeadForm.extraNotes}</div>
    //           </div>
    //         </div>
    //         <div className="row m-0">
    //           <div className="col-sm-3 align-self-stretc p-0">
    //             <div className="form-label-name h-100">
    //               <b>Additional Docs</b>
    //             </div>
    //           </div>
    //           <div className="col-sm-9 p-0">
    //             <div className="form-label-data d-flex flex-wrap">
    //               {currentLeadForm.otherDocs.map((val) =>
    //                 val.filename ? (
    //                   <>
    //                     <div
    //                       className="UploadDocPreview"
    //                       onClick={() => {
    //                         handleViewPdOtherDocs(val.filename);
    //                       }}
    //                     >
    //                       <div className="docItemImg">
    //                         <img
    //                           src={val.filename.endsWith(".pdf") ? pdfimg : img}
    //                         ></img>
    //                       </div>

    //                       <div
    //                         className="docItemName wrap-MyText"
    //                         title="logo.png"
    //                       >
    //                         {val.filename.split("-")[1]}
    //                       </div>
    //                     </div>
    //                   </>
    //                 ) : (
    //                   <>
    //                     <div
    //                       className="UploadDocPreview"
    //                       onClick={() => {
    //                         handleViewPdOtherDocs(val.name);
    //                       }}
    //                     >
    //                       <div className="docItemImg">
    //                         <img
    //                           src={val.name.endsWith(".pdf") ? pdfimg : img}
    //                         ></img>
    //                       </div>
    //                       <div
    //                         className="docItemName wrap-MyText"
    //                         title="logo.png"
    //                       >
    //                         {val.name.split("-")[1]}
    //                       </div>
    //                     </div>
    //                   </>
    //                 )
    //               )}

    //               {/* <div className="UploadDocPreview">
    //                                       <div className="docItemImg">
    //                                         <img src={img}></img>
    //                                       </div>
    //                                       <div
    //                                         className="docItemName wrap-MyText"
    //                                         title="logo.png"
    //                                       >
    //                                         logo.png
    //                                       </div>
    //                                     </div>
    //                                     <div className="UploadDocPreview">
    //                                       <div className="docItemImg">
    //                                         <img src={wordimg}></img>
    //                                       </div>
    //                                       <div
    //                                         className="docItemName wrap-MyText"
    //                                         title=" information.word"
    //                                       >
    //                                         information.word
    //                                       </div>
    //                                     </div>
    //                                     <div className="UploadDocPreview">
    //                                       <div className="docItemImg">
    //                                         <img src={excelimg}></img>
    //                                       </div>
    //                                       <div
    //                                         className="docItemName wrap-MyText"
    //                                         title="financials.csv"
    //                                       >
    //                                         financials.csv
    //                                       </div>
    //                                     </div> */}
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}

export default LeadFormPreview;
