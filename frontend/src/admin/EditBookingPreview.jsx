import React from "react";
import pdfimg from "../static/my-images/pdf.png";
import Swal from "sweetalert2";
import axios from "axios";
import img from "../static/my-images/image.png";

function EditBookingPreview({ requestedBooking, existingBooking , setCompareBooking , setCurrentBooking , setCurrentCompany }) {
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  function formatDate(inputDate) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(inputDate).toLocaleDateString(
      "en-US",
      options
    );
    return formattedDate;
  }
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
  const getOrdinal = (number) => {
    const suffixes = ["th", "st", "nd", "rd"];
    const lastDigit = number % 10;
    const suffix = suffixes[lastDigit <= 3 ? lastDigit : 0];
    return `${number}${suffix}`;
  };

  console.log("Requested Booking",requestedBooking, "Existing Booking",  existingBooking);
  const handleRejectClick = async ()=>{

    try {
      const response = await axios.delete(`${secretKey}/delete-redesigned-booking-request/${existingBooking["Company Name"]}`);
     Swal.fire({title:"Request Deleted" , icon:"success"}) // Display success message
    } catch (error) {
      console.log("Error updating data" ,error) ;
      Swal.fire({title:"Error Deleting Request" , icon:"error"})// Display error message
    }
  }

  const handleAcceptClick =async () => {
    const updatedBooking = { ...existingBooking }; // Create a copy of existingBooking

    // Loop through requestedBooking properties
    for (const key in requestedBooking) {
        if (
          requestedBooking.hasOwnProperty(key) &&
          (
            (Array.isArray(requestedBooking[key]) && requestedBooking[key].length > 0) || // Check for non-empty arrays
            requestedBooking[key] !== null ||
            requestedBooking[key] !== undefined
          )
        ) {
          // Check if property exists in existingBooking and is different
          if (
            requestedBooking.hasOwnProperty(key) &&
            (
              (!Array.isArray(requestedBooking[key])) || // Not an array OR
              (
                Array.isArray(requestedBooking[key]) && // Is an array AND
                requestedBooking[key].length > 0 && // Length is non-zero AND
                (
                  !existingBooking.hasOwnProperty(key) || // Doesn't exist in existingBooking OR
                  JSON.stringify(requestedBooking[key]) !== JSON.stringify(existingBooking[key]) // Different values
                )
              )
            )
          ) {
            updatedBooking[key] = requestedBooking[key]; // Update the value in updatedBooking
          }
        }
      }
      if(requestedBooking.bookingIndex === 0){
        try {
          const response = await axios.post(`${secretKey}/update-redesigned-final-form/${updatedBooking["Company Name"]}`, updatedBooking);
         Swal.fire({title:"Data Updated" , icon:"success"}) // Display success message
        } catch (error) {
          console.log("Error updating data" ,error) ;
          Swal.fire({title:"Error Updating Data" , icon:"error"})// Display error message
        }
      }else {
        try {
          const response = await axios.put(`${secretKey}/update-more-booking/${updatedBooking["Company Name"]}/${updatedBooking.bookingIndex}`, updatedBooking);
         Swal.fire({title:"Data Updated" , icon:"success"}) // Display success message
        } catch (error) {
          console.log("Error updating data" ,error) ;
          Swal.fire({title:"Error Updating Data" , icon:"error"})// Display error message
        }
      }
    
      

    

    console.log('Updated Booking:', updatedBooking);
    // Set the updated booking object in state or perform further actions as needed
  };

  return (
    <div>
      <div className="row">
        <div className="col requested-booking container-xl">
          <div className="header mt-3 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
            <div className="company-name">
                <h3 className="">
                  {requestedBooking["Company Name"]}
                </h3>
              </div>
              <div className="requested-by ml-1">
                <h3> {"("} Requested by - {requestedBooking.requestBy} {")"}</h3>
              </div>

              
            </div>
            <div className="back-button">
            <button onClick={()=>{
                  setCurrentBooking(null);
                  setCompareBooking(null);
                  setCurrentCompany("");
                }} className="btn btn-primary ml-1">
                      Back
                  </button>
            </div>
          </div>
          <div className="steprForm-inner mt-2">
           {(!requestedBooking.bookingIndex
            || requestedBooking.bookingIndex===0) && <div className="stepOnePreview">
              <div className="d-flex align-items-center">
                <div className="services_No">1</div>
                <div className="ml-1">
                  <h3 className="m-0">Company's Basic Informations</h3>
                </div>
              </div>
              <div className="servicesFormCard mt-3">
                <div className="row m-0">
                  <div className="col-sm-3 p-0">
                    <div className="form-label-name">
                      <b>Company name</b>
                    </div>
                  </div>
                  <div className="col-sm-9 p-0">
                    <div className="form-label-data">
                      {requestedBooking["Company Name"]}
                    </div>
                  </div>
                </div>
                <div className="row m-0">
                  <div className="col-sm-3 p-0">
                    <div className="form-label-name">
                      <b>Email Address:</b>
                    </div>
                  </div>
                  <div className="col-sm-9 p-0">
                    <div
                      className={
                        requestedBooking["Company Email"] &&
                        requestedBooking["Company Email"] !==
                          existingBooking["Company Email"]
                          ? "form-label-data highlight-changes"
                          : "form-label-data"
                      }
                    >
                      {requestedBooking["Company Email"] &&
                      requestedBooking["Company Email"] !==
                        existingBooking["Company Email"] ? (
                        <span>
                          <span>Old : {existingBooking["Company Email"]}</span>
                          <span className="ml-2">
                            New : {requestedBooking["Company Email"]}
                          </span>
                        </span>
                      ) : (
                        existingBooking["Company Email"]
                      )}
                    </div>
                  </div>
                </div>
                <div className="row m-0">
                  <div className="col-sm-3 p-0">
                    <div className="form-label-name">
                      <b>Phone No:</b>
                    </div>
                  </div>
                  <div className="col-sm-9 p-0">
                    <div
                      className={
                        requestedBooking["Company Number"] &&
                        requestedBooking["Company Number"] !==
                          existingBooking["Company Number"]
                          ? "form-label-data highlight-changes"
                          : "form-label-data"
                      }
                    >
                      {requestedBooking["Company Number"] &&
                      requestedBooking["Company Number"] !==
                        existingBooking["Company Number"] ? (
                        <span>
                          <span>Old : {existingBooking["Company Number"]}</span>
                          <span className="ml-2">
                            New : {requestedBooking["Company Number"]}
                          </span>
                        </span>
                      ) : (
                        existingBooking["Company Number"]
                      )}
                    </div>
                  </div>
                </div>
                <div className="row m-0">
                  <div className="col-sm-3 p-0">
                    <div className="form-label-name">
                      <b>Incorporation date:</b>
                    </div>
                  </div>
                  <div className="col-sm-9 p-0">
                    <div
                      className={
                        requestedBooking.incoDate &&
                        requestedBooking.incoDate !== existingBooking.incoDate
                          ? "form-label-data highlight-changes"
                          : "form-label-data"
                      }
                    >
                      {requestedBooking.incoDate &&
                      requestedBooking.incoDate !== existingBooking.incoDate ? (
                        <span>
                          <span>
                            Old : {formatDate(existingBooking.incoDate)}
                          </span>
                          <span className="ml-2">
                            New : {formatDate(requestedBooking.incoDate)}
                          </span>
                        </span>
                      ) : (
                        formatDate(existingBooking.incoDate)
                      )}
                    </div>
                  </div>
                </div>
                <div className="row m-0">
                  <div className="col-sm-3 p-0">
                    <div className="form-label-name">
                      <b>Company's PAN:</b>
                    </div>
                  </div>
                  <div className="col-sm-9 p-0">
                    <div
                      className={
                        requestedBooking.panNumber &&
                        requestedBooking.panNumber !== existingBooking.panNumber
                          ? "form-label-data highlight-changes"
                          : "form-label-data"
                      }
                    >
                      {requestedBooking.panNumber &&
                      requestedBooking.panNumber !==
                        existingBooking.panNumber ? (
                        <span>
                          <span>Old : {existingBooking.panNumber}</span>
                          <span className="ml-2">
                            New : {requestedBooking.panNumber}
                          </span>
                        </span>
                      ) : (
                        existingBooking.panNumber
                      )}
                    </div>
                  </div>
                </div>
                <div className="row m-0">
                  <div className="col-sm-3 p-0">
                    <div className="form-label-name">
                      <b>Company's GST:</b>
                    </div>
                  </div>
                  <div className="col-sm-9 p-0">
                    <div
                      className={
                        requestedBooking.gstNumber &&
                        requestedBooking.gstNumber !== existingBooking.gstNumber
                          ? "form-label-data highlight-changes"
                          : "form-label-data"
                      }
                    >
                      {requestedBooking.gstNumber &&
                      requestedBooking.gstNumber !==
                        existingBooking.gstNumber ? (
                        <span>
                          <span>Old : {existingBooking.gstNumber}</span>
                          <span className="ml-2">
                            New : {requestedBooking.gstNumber}
                          </span>
                        </span>
                      ) : (
                        existingBooking.gstNumber
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>}
            {/* -------------------------------------------- Step 1 Ends Here ----------------------------------------- */}
            <div className="stepTWOPreview">
              <div className="d-flex align-items-center mt-3">
                <div className="services_No">2</div>
                <div className="ml-1">
                  <h3 className="m-0">Booking Details</h3>
                </div>
              </div>
              <div className="servicesFormCard mt-3">
                <div className="row m-0">
                  <div className="col-sm-3 p-0">
                    <div className="form-label-name">
                      <b>BDE Name:</b>
                    </div>
                  </div>
                  <div className="col-sm-9 p-0">
                    <div className="form-label-data">
                      {existingBooking.bdeName}
                    </div>
                  </div>
                </div>
                <div className="row m-0">
                  <div className="col-sm-3 p-0">
                    <div className="form-label-name">
                      <b>BDE Email</b>
                    </div>
                  </div>
                  <div className="col-sm-9 p-0">
                    <div className="form-label-data">
                      {existingBooking.bdeEmail}
                    </div>
                  </div>
                </div>
                <div className="row m-0">
                  <div className="col-sm-3 p-0">
                    <div className="form-label-name">
                      <b>BDM Name</b>
                    </div>
                  </div>
                  <div className="col-sm-9 p-0">
                    <div
                      className={
                        requestedBooking.bdmName &&
                        requestedBooking.bdmName !== existingBooking.bdmName
                          ? "form-label-data highlight-changes"
                          : "form-label-data"
                      }
                    >
                      {requestedBooking.bdmName &&
                      requestedBooking.bdmName !== existingBooking.bdmName ? (
                        <span>
                          <span>Old : {existingBooking.bdmName}</span>
                          <span className="ml-2">
                            New : {requestedBooking.bdmName}
                          </span>
                        </span>
                      ) : (
                        existingBooking.bdmName
                      )}
                    </div>
                  </div>
                </div>
                <div className="row m-0">
                  <div className="col-sm-3 p-0">
                    <div className="form-label-name">
                      <b>BDM Email</b>
                    </div>
                  </div>
                  <div className="col-sm-9 p-0">
                    <div
                      className={
                        requestedBooking.bdmEmail &&
                        requestedBooking.bdmEmail !== existingBooking.bdmEmail
                          ? "form-label-data highlight-changes"
                          : "form-label-data"
                      }
                    >
                      {requestedBooking.bdmEmail &&
                      requestedBooking.bdmEmail !== existingBooking.bdmEmail ? (
                        <span>
                          <span>Old : {existingBooking.bdmEmail}</span>
                          <span className="ml-2">
                            New : {requestedBooking.bdmEmail}
                          </span>
                        </span>
                      ) : (
                        existingBooking.bdmEmail
                      )}
                    </div>
                  </div>
                </div>
                <div className="row m-0">
                  <div className="col-sm-3 p-0">
                    <div className="form-label-name">
                      <b>Booking Date</b>
                    </div>
                  </div>
                  <div className="col-sm-9 p-0">
                    <div
                      className={
                        requestedBooking.bookingDate &&
                        requestedBooking.bookingDate !==
                          existingBooking.bookingDate
                          ? "form-label-data highlight-changes"
                          : "form-label-data"
                      }
                    >
                      {requestedBooking.bookingDate &&
                      requestedBooking.bookingDate !==
                        existingBooking.bookingDate ? (
                        <span>
                          <span>Old : {existingBooking.bookingDate}</span>
                          <span className="ml-2">
                            New : {requestedBooking.bookingDate}
                          </span>
                        </span>
                      ) : (
                        existingBooking.bookingDate
                      )}
                    </div>
                  </div>
                </div>
                <div className="row m-0">
                  <div className="col-sm-3 p-0">
                    <div className="form-label-name">
                      <b>Lead Source</b>
                    </div>
                  </div>
                  <div className="col-sm-9 p-0">
                    <div
                      className={
                        requestedBooking.bookingSource &&
                        requestedBooking.bookingSource !==
                          existingBooking.bookingSource
                          ? "form-label-data highlight-changes"
                          : "form-label-data"
                      }
                    >
                      {requestedBooking.bookingSource &&
                      requestedBooking.bookingSource !==
                        existingBooking.bookingSource ? (
                        <span>
                          <span>Old : {existingBooking.bookingSource}</span>
                          <span className="ml-2">
                            New : {requestedBooking.bookingSource}
                          </span>
                        </span>
                      ) : (
                        existingBooking.bookingSource
                      )}
                    </div>
                  </div>
                </div>
                {requestedBooking.bookingSource === "Other" && (
                  <div className="row m-0">
                    <div className="col-sm-3 p-0">
                      <div
                        className={
                          requestedBooking.otherBookingSource &&
                          requestedBooking.otherBookingSource !==
                            existingBooking.otherBookingSource
                            ? "form-label-data highlight-changes"
                            : "form-label-data"
                        }
                      >
                        <b>Other Lead Source</b>
                      </div>
                    </div>
                    <div className="col-sm-9 p-0">
                      <div className="form-label-data">
                        {requestedBooking.otherBookingSource &&
                        requestedBooking.otherBookingSource !==
                          existingBooking.otherBookingSource ? (
                          <span>
                            <span>
                              Old : {existingBooking.otherBookingSource}
                            </span>
                            <span className="ml-2">
                              New : {requestedBooking.otherBookingSource}
                            </span>
                          </span>
                        ) : (
                          existingBooking.otherBookingSource
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* ----------------------------------------------- Step 2 Ends Here --------------------------------------------------- */}
            <div className="stepThreePreview">
              <div className="d-flex align-items-center mt-3">
                <div className="services_No">3</div>
                <div className="ml-1">
                  <h3 className="m-0">Services And Payment Details</h3>
                </div>
              </div>
              <div className="servicesFormCard mt-3">
                <div className="row m-0">
                  <div className="col-sm-3 p-0">
                    <div className="form-label-name">
                      <b>Total Selected Services</b>
                    </div>
                  </div>
                  <div className="col-sm-9 p-0">
                    <div className="form-label-data">
                      {requestedBooking.services.length !== 0
                        ? requestedBooking.services.length
                        : existingBooking.services.length}
                    </div>
                  </div>
                </div>
                {(requestedBooking.services.length !== 0 &&
                requestedBooking.services !== existingBooking.services
                  ? requestedBooking
                  : existingBooking
                ).services.map((obj, index) => (
                  <div className="parServicesPreview mt-3">
                    <div className="row m-0">
                      <div className="col-sm-3 p-0">
                        <div className="form-label-name">
                          <b>{getOrdinal(index + 1)} Services Name</b>
                        </div>
                      </div>
                      <div className="col-sm-9 p-0">
                        <div
                        className={
                          requestedBooking.services.length !== 0 &&
                          requestedBooking.services[index] &&
                          existingBooking.services[index] &&
                          requestedBooking.services[index].serviceName !== existingBooking.services[index].serviceName
                            ? "form-label-data highlight-changes"
                            : "form-label-data"
                        }
                        
                        
                        >
                          {( requestedBooking.services[index].serviceName && requestedBooking.services[index].serviceName !== existingBooking.services[index].serviceName) ? 
                          <span>
                          <span>
                            Old : {existingBooking.services[index].serviceName }
                          </span>
                          <span className="ml-2">
                            New : {obj.serviceName}
                          </span>
                        </span> : <span>{obj.serviceName}</span>
                        }
                        </div>
                      </div>
                    </div>
                    {/* <!-- Optional --> */}
                    {obj.serviceName === "Start-Up India Certificate" && (
                      <div className="row m-0">
                        <div className="col-sm-3 p-0">
                          <div className="form-label-name">
                            <b>With DSC</b>
                          </div>
                        </div>
                        <div className="col-sm-9 p-0">
                          <div className="form-label-data">
                            {obj.withDSC === true ? "Yes" : "No"}
                          </div>
                        </div>
                      </div>
                    )}
                    {/* total amount */}
                    <div className="row m-0">
                      <div className="col-sm-3 p-0">
                        <div className="form-label-name">
                          <b>Total Amount</b>
                        </div>
                      </div>
                      <div className="col-sm-9 p-0">
                        <div
                          className={
                            requestedBooking.services.length !== 0 &&
                            requestedBooking.services[index] &&
                            requestedBooking.services[index].totalPaymentWGST !== existingBooking.services[index].totalPaymentWGST
                              ? "form-label-data highlight-changes"
                              : "form-label-data"
                          }
                          
                        >
                         {( requestedBooking.services[index].totalPaymentWGST && requestedBooking.services[index].totalPaymentWGST !== existingBooking.services[index].totalPaymentWGST) ? 
                          <span> 
                          <span>
                            Old : {Number(existingBooking.services[index].totalPaymentWGST).toFixed(2) }
                          </span>
                          <span className="ml-2">
                            New : {Number(obj.totalPaymentWGST).toFixed(2)}
                          </span>
                        </span> : <span>{Number(obj.totalPaymentWGST).toFixed(2)}</span>
                        }
                        </div>
                      </div>
                    </div>
                    <div className="row m-0">
                      <div className="col-sm-3 p-0">
                        <div className="form-label-name">
                          <b>With GST</b>
                        </div>
                      </div>
                      <div className="col-sm-9 p-0">
                        <div className="form-label-data">
                          {obj.withGST === true ? "Yes" : "No"}
                        </div>
                      </div>
                    </div>
                    <div className="row m-0">
                      <div className="col-sm-3 p-0">
                        <div className="form-label-name">
                          <b>Payment Terms</b>
                        </div>
                      </div>
                      <div className="col-sm-9 p-0">
                        <div
                         className={
                          requestedBooking.services.length !== 0 &&
                          requestedBooking.services[index] &&
                          requestedBooking.services[index].paymentTerms !== existingBooking.services[index].paymentTerms
                            ? "form-label-data highlight-changes"
                            : "form-label-data"
                        }
                        
                        >
                          {obj.paymentTerms === "Full Advanced"
                            ? "Full Advanced"
                            : "Part-payment"}
                        </div>
                      </div>
                    </div>
                    {obj.firstPayment !== 0 && (
                      <div className="row m-0">
                        <div className="col-sm-3 p-0">
                          <div className="form-label-name">
                            <b>First Payment</b>
                          </div>
                        </div>
                        <div className="col-sm-9 p-0">
                          <div
                            className={
                              requestedBooking.services.length !== 0 &&
                              requestedBooking.services[index] &&
                              requestedBooking.services[index].firstPayment !== existingBooking.services[index].firstPayment
                                ? "form-label-data highlight-changes"
                                : "form-label-data"
                            }
                            
                          >
                            {" "}
                            ₹ {Number(obj.firstPayment).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    )}
                    {obj.secondPayment !== 0 && (
                      <div className="row m-0">
                        <div className="col-sm-3 p-0">
                          <div className="form-label-name">
                            <b>Second Payment</b>
                          </div>
                        </div>
                        <div className="col-sm-9 p-0">
                          <div
                           className={
                            requestedBooking.services.length !== 0 &&
                            requestedBooking.services[index] &&
                            requestedBooking.services[index].secondPayment !== existingBooking.services[index].secondPayment
                              ? "form-label-data highlight-changes"
                              : "form-label-data"
                          }
                          
                          >
                            ₹ {Number(obj.secondPayment).toFixed(2)} -{" "}
                            {isNaN(new Date(obj.secondPaymentRemarks))
                              ? obj.secondPaymentRemarks
                              : `Payment On ${obj.secondPaymentRemarks}`}
                          </div>
                        </div>
                      </div>
                    )}
                    {obj.thirdPayment !== 0 && (
                      <div className="row m-0">
                        <div className="col-sm-3 p-0">
                          <div className="form-label-name">
                            <b>Third Payment</b>
                          </div>
                        </div>
                        <div className="col-sm-9 p-0">
                          <div
                            className={
                              requestedBooking.services.length !== 0 &&
                              requestedBooking.services[index].thirdPayment !==
                                existingBooking.services[index].thirdPayment
                                ? "form-label-data highlight-changes"
                                : "form-label-data"
                            }
                          >
                            ₹ {Number(obj.thirdPayment).toFixed(2)} -{" "}
                            {isNaN(new Date(obj.thirdPaymentRemarks))
                              ? obj.thirdPaymentRemarks
                              : `Payment On ${obj.thirdPaymentRemarks}`}
                          </div>
                        </div>
                      </div>
                    )}
                    {obj.fourthPayment !== 0 && (
                      <div className="row m-0">
                        <div className="col-sm-3 p-0">
                          <div className="form-label-name">
                            <b>Fourth Payment</b>
                          </div>
                        </div>
                        <div className="col-sm-9 p-0">
                          <div
                            className={
                              requestedBooking.services.length !== 0 &&
                              requestedBooking.services[index].fourthPayment !==
                                existingBooking.services[index].fourthPayment
                                ? "form-label-data highlight-changes"
                                : "form-label-data"
                            }
                          >
                            {" "}
                            ₹ {Number(obj.fourthPayment).toFixed(2)} -{" "}
                            {isNaN(new Date(obj.fourthPaymentRemarks))
                              ? obj.fourthPaymentRemarks
                              : `Payment On ${obj.fourthPaymentRemarks}`}
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="row m-0">
                      <div className="col-sm-3 p-0">
                        <div className="form-label-name">
                          <b>Notes</b>
                        </div>
                      </div>
                      <div className="col-sm-9 p-0">
                        <div
                          className={
                            requestedBooking.services.length !== 0 &&
                            requestedBooking.services[index].paymentRemarks !==
                              existingBooking.services[index].paymentRemarks
                              ? "form-label-data highlight-changes"
                              : "form-label-data"
                          }
                        >
                          {obj.paymentRemarks !== "" ? obj.paymentRemarks : "-"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* total amount */}
              </div>
            </div>

            {/* ------------------------------------------------- Step 3 Ends Here ------------------------------------------------------ */}
            <div className="stepFourPreview">
              <div className="d-flex align-items-center mt-3">
                <div className="services_No">4</div>
                <div className="ml-1">
                  <h3 className="m-0">Payment Summary</h3>
                </div>
              </div>
              <div className="servicesFormCard mt-3">
                <div className="row m-0">
                  <div className="col-sm-4">
                    <div className="row">
                      <div className="col-sm-6 p-0">
                        <div className="form-label-name">
                          <b>Total Payment</b>
                        </div>
                      </div>
                      <div className="col-sm-6 p-0">
                        <div
                          className={
                            requestedBooking.totalAmount &&
                            requestedBooking.totalAmount !==
                              existingBooking.totalAmount
                              ? "form-label-data highlight-changes"
                              : "form-label-data"
                          }
                        >
                          ₹{" "}
                          {Number(
                            requestedBooking.totalAmount
                              ? requestedBooking.totalAmount
                              : existingBooking.totalAmount
                          )
                            .toFixed(2)
                            .toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="row">
                      <div className="col-sm-6 p-0">
                        <div className="form-label-name">
                          <b>Received Payment</b>
                        </div>
                      </div>
                      <div className="col-sm-6 p-0">
                        <div
                          className={
                            requestedBooking.receivedAmount &&
                            requestedBooking.receivedAmount !==
                              existingBooking.receivedAmount
                              ? "form-label-data highlight-changes"
                              : "form-label-data"
                          }
                        >
                          ₹{" "}
                          {Number(
                            requestedBooking.receivedAmount
                              ? requestedBooking.receivedAmount
                              : existingBooking.receivedAmount
                          )
                            .toFixed(2)
                            .toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="row">
                      <div className="col-sm-6 p-0">
                        <div className="form-label-name">
                          <b>Pending Payment</b>
                        </div>
                      </div>
                      <div className="col-sm-6 p-0">
                        <div
                          className={
                            requestedBooking.pendingAmount &&
                            requestedBooking.pendingAmount !==
                              existingBooking.pendingAmount
                              ? "form-label-data highlight-changes"
                              : "form-label-data"
                          }
                        >
                          ₹{" "}
                          {Number(
                            requestedBooking.pendingAmount
                              ? requestedBooking.pendingAmount
                              : existingBooking.receivedAmount
                          )
                            .toFixed(2)
                            .toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row m-0">
                  <div className="col-sm-3 align-self-stretc p-0">
                    <div className="form-label-name h-100">
                      <b>Upload Payment Receipt</b>
                    </div>
                  </div>
                  <div className="col-sm-9 p-0">
                    <div className="form-label-data">
                      <div
                        className="UploadDocPreview"
                        onClick={() => {
                          handleViewPdfReciepts(
                            requestedBooking.paymentReceipt.length !== 0
                              ? requestedBooking.paymentReceipt[0].filename
                              : existingBooking.paymentReceipt[0].filename , requestedBooking["Company Name"]
                          );
                        }}
                      >
                        {requestedBooking.paymentReceipt.length !== 0 ? (
                          <>
                            <div className="docItemImg">
                              <img
                                src={
                                  requestedBooking.paymentReceipt[0].filename.endsWith(
                                    ".pdf"
                                  )
                                    ? pdfimg
                                    : img
                                }
                              ></img>
                            </div>
                            <div
                              className="docItemName wrap-MyText"
                              title={
                                requestedBooking.paymentReceipt[0].filename.split(
                                  "-"
                                )[1]
                              }
                            >
                              {
                                requestedBooking.paymentReceipt[0].filename.split(
                                  "-"
                                )[1]
                              }
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="docItemImg">
                              <img
                                src={
                                  existingBooking.paymentReceipt[0].filename.endsWith(
                                    ".pdf"
                                  )
                                    ? pdfimg
                                    : img
                                }
                              ></img>
                            </div>
                            <div
                              className="docItemName wrap-MyText"
                              title={
                                existingBooking.paymentReceipt[0].filename.split(
                                  "-"
                                )[1]
                              }
                            >
                              {
                                existingBooking.paymentReceipt[0].filename.split(
                                  "-"
                                )[1]
                              }
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row m-0">
                  <div className="col-sm-3 p-0">
                    <div className="form-label-name">
                      <b>Payment Method</b>
                    </div>
                  </div>
                  <div className="col-sm-9 p-0">
                    <div
                      className={
                        requestedBooking.paymentMethod &&
                        requestedBooking.paymentMethod !==
                          existingBooking.paymentMethod
                          ? "form-label-data highlight-changes"
                          : "form-label-data"
                      }
                    >
                      {requestedBooking.paymentMethod
                        ? requestedBooking.paymentMethod
                        : existingBooking.paymentMethod}
                    </div>
                  </div>
                </div>
                <div className="row m-0">
                  <div className="col-sm-3 p-0">
                    <div className="form-label-name">
                      <b>Extra Remarks</b>
                    </div>
                  </div>
                  <div className="col-sm-9 p-0">
                    <div
                      className={
                        requestedBooking.extraNotes &&
                        requestedBooking.extraNotes !==
                          existingBooking.extraNotes
                          ? "form-label-data highlight-changes"
                          : "form-label-data"
                      }
                    >
                      {requestedBooking.extraNotes
                        ? requestedBooking.extraNotes
                        : existingBooking.extraNotes}
                    </div>
                  </div>
                </div>
                <div className="row m-0">
                  <div className="col-sm-3 align-self-stretc p-0">
                    <div className="form-label-name h-100">
                      <b>Additional Docs</b>
                    </div>
                  </div>
                  <div className="col-sm-9 p-0">
                    <div className="form-label-data d-flex flex-wrap">
                      {requestedBooking.otherDocs.length !== 0 &&
                      requestedBooking.otherDocs !== existingBooking.otherDocs
                        ? requestedBooking.otherDocs.map((val) => (
                            <>
                              <div
                                className="UploadDocPreview"
                                onClick={() => {
                                  handleViewPdOtherDocs(val.filename , requestedBooking["Company Name"]);
                                }}
                              >
                                <div className="docItemImg">
                                  <img
                                    src={
                                      val.filename.endsWith(".pdf")
                                        ? pdfimg
                                        : img
                                    }
                                  ></img>
                                </div>

                                <div
                                  className="docItemName wrap-MyText"
                                  title="logo.png"
                                >
                                  {val.filename.split("-")[1]}
                                </div>
                              </div>
                            </>
                          ))
                        : existingBooking.otherDocs.map((val) => (
                            <>
                              <div
                                className="UploadDocPreview"
                                onClick={() => {
                                  handleViewPdOtherDocs(val.filename , requestedBooking["Company Name"]);
                                }}
                              >
                                <div className="docItemImg">
                                  <img
                                    src={
                                      val.filename.endsWith(".pdf")
                                        ? pdfimg
                                        : img
                                    }
                                  ></img>
                                </div>

                                <div
                                  className="docItemName wrap-MyText"
                                  title="logo.png"
                                >
                                  {val.filename.split("-")[1]}
                                </div>
                              </div>
                            </>
                          ))}

                      {/* <div className="UploadDocPreview">
                                          <div className="docItemImg">
                                            <img src={img}></img>
                                          </div>
                                          <div
                                            className="docItemName wrap-MyText"
                                            title="logo.png"
                                          >
                                            logo.png
                                          </div>
                                        </div>
                                        <div className="UploadDocPreview">
                                          <div className="docItemImg">
                                            <img src={wordimg}></img>
                                          </div>
                                          <div
                                            className="docItemName wrap-MyText"
                                            title=" information.word"
                                          >
                                            information.word
                                          </div>
                                        </div>
                                        <div className="UploadDocPreview">
                                          <div className="docItemImg">
                                            <img src={excelimg}></img>
                                          </div>
                                          <div
                                            className="docItemName wrap-MyText"
                                            title="financials.csv"
                                          >
                                            financials.csv
                                          </div>
                                        </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* --------------------------------------------- Step 4 Ends Here  ------------------------------------ */}

            <div className="preview-footer"  style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "10px",
        }}>
                <button 
                 style={{
                    width: "45%",
                    borderRadius: "4px",
                    backgroundColor: "#ceedce",
                    color:  "#2e830b" ,
                    border: "none",
                    padding: "6px",
                    cursor:  "pointer",
                    transition: "background-color 0.3s",
                    fontSize: "14px",
                  }}
                  className="btn btn-primary d-none d-sm-inline-block"
                  onClick={handleAcceptClick}
                  >
                    Accept
                </button>
                <button 
                 style={{
                    width: "45%",
                    borderRadius: "4px",
                    backgroundColor: "#f4d0d0",
                    color:  "#bc2929" ,
                    border: "none",
                    padding: "6px",
                    cursor:  "pointer",
                    transition: "background-color 0.3s",
                    fontSize: "14px",
                  }}
                  className="btn btn-primary d-none d-sm-inline-block"
                  onClick={handleRejectClick}
                  >
                 
                    Reject
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditBookingPreview;
