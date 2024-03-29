import React from "react";
import pdfimg from "../static/my-images/pdf.png";
import Swal from "sweetalert2";
import img from "../static/my-images/image.png";

function LeadFormPreview({ setOpenAnchor, currentLeadForm }) {
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    function formatDate(inputDate) {
        const date = new Date(inputDate);
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Adding 1 to month because it's zero-based
        const day = String(date.getUTCDate()).padStart(2, "0");
    
        return `${year}-${month}-${day}`;
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
      <div className="steprForm-inner">
        <div className="stepOnePreview">
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
                  {currentLeadForm["Company Name"]}
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
                <div className="form-label-data">
                  {currentLeadForm["Company Email"]}
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
                <div className="form-label-data">
                  {currentLeadForm["Company Number"]}
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
                <div className="form-label-data">
                  {formatDate(currentLeadForm.incoDate)}
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
                <div className="form-label-data">
                  {currentLeadForm.panNumber ? currentLeadForm.panNumber : "-"}
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
                <div className="form-label-data">
                  {currentLeadForm.gstNumber ? currentLeadForm.gstNumber : "-"}
                </div>
              </div>
            </div>
          </div>
        </div>
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
                <div className="form-label-data">{currentLeadForm.bdeName}</div>
              </div>
            </div>
            <div className="row m-0">
              <div className="col-sm-3 p-0">
                <div className="form-label-name">
                  <b>BDE Email</b>
                </div>
              </div>
              <div className="col-sm-9 p-0">
                <div className="form-label-data">{currentLeadForm.bdeEmail}</div>
              </div>
            </div>
            <div className="row m-0">
              <div className="col-sm-3 p-0">
                <div className="form-label-name">
                  <b>BDM Name</b>
                </div>
              </div>
              <div className="col-sm-9 p-0">
                <div className="form-label-data">{currentLeadForm.bdmName}</div>
              </div>
            </div>
            <div className="row m-0">
              <div className="col-sm-3 p-0">
                <div className="form-label-name">
                  <b>BDM Email</b>
                </div>
              </div>
              <div className="col-sm-9 p-0">
                <div className="form-label-data">{currentLeadForm.bdmEmail}</div>
              </div>
            </div>
            <div className="row m-0">
              <div className="col-sm-3 p-0">
                <div className="form-label-name">
                  <b>Booking Date</b>
                </div>
              </div>
              <div className="col-sm-9 p-0">
                <div className="form-label-data">{currentLeadForm.bookingDate}</div>
              </div>
            </div>
            <div className="row m-0">
              <div className="col-sm-3 p-0">
                <div className="form-label-name">
                  <b>Lead Source</b>
                </div>
              </div>
              <div className="col-sm-9 p-0">
                <div className="form-label-data">
                  {currentLeadForm.bookingSource !== "" ? currentLeadForm.bookingSource : "-"}
                </div>
              </div>
            </div>
            <div className="row m-0">
              <div className="col-sm-3 p-0">
                <div className="form-label-name">
                  <b>Other Lead Source</b>
                </div>
              </div>
              <div className="col-sm-9 p-0">
                <div className="form-label-data">
                  {currentLeadForm.bookingSource !== "" ? currentLeadForm.bookingSource : "-"}
                </div>
              </div>
            </div>
          </div>
        </div>
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
                <div className="form-label-data">{currentLeadForm.services.length}</div>
              </div>
            </div>
            {currentLeadForm.services.map((obj, index) => (
              <div className="parServicesPreview mt-3">
                <div className="row m-0">
                  <div className="col-sm-3 p-0">
                    <div className="form-label-name">
                      <b>{getOrdinal(index + 1)} Services Name</b>
                    </div>
                  </div>
                  <div className="col-sm-9 p-0">
                    <div className="form-label-data">{obj.serviceName}</div>
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
                    <div className="form-label-data">
                      {obj.totalPaymentWGST !== undefined
                        ? Number(obj.totalPaymentWGST).toFixed(2)
                        : "0"}
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
                    <div className="form-label-data">{obj.paymentTerms}</div>
                  </div>
                </div>
                <div className="row m-0">
                  <div className="col-sm-3 p-0">
                    <div className="form-label-name">
                      <b>First Payment</b>
                    </div>
                  </div>
                  <div className="col-sm-9 p-0">
                    <div className="form-label-data">{obj.firstPayment}</div>
                  </div>
                </div>
                <div className="row m-0">
                  <div className="col-sm-3 p-0">
                    <div className="form-label-name">
                      <b>Second Payment</b>
                    </div>
                  </div>
                  <div className="col-sm-9 p-0">
                    <div className="form-label-data">{obj.secondPayment}</div>
                  </div>
                </div>
                <div className="row m-0">
                  <div className="col-sm-3 p-0">
                    <div className="form-label-name">
                      <b>Third Payment</b>
                    </div>
                  </div>
                  <div className="col-sm-9 p-0">
                    <div className="form-label-data">{obj.thirdPayment}</div>
                  </div>
                </div>
                <div className="row m-0">
                  <div className="col-sm-3 p-0">
                    <div className="form-label-name">
                      <b>Fourth Payment</b>
                    </div>
                  </div>
                  <div className="col-sm-9 p-0">
                    <div className="form-label-data">{obj.fourthPayment}</div>
                  </div>
                </div>
                <div className="row m-0">
                  <div className="col-sm-3 p-0">
                    <div className="form-label-name">
                      <b>Notes</b>
                    </div>
                  </div>
                  <div className="col-sm-9 p-0">
                    <div className="form-label-data">
                      {obj.paymentRemarks !== "" ? obj.paymentRemarks : "-"}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* total amount */}
          </div>
        </div>
        <div className="stepThreePreview">
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
                  <div className="col-sm-4 p-0">
                    <div className="form-label-name">
                      <b>Total Payment</b>
                    </div>
                  </div>
                  <div className="col-sm-8 p-0">
                    <div className="form-label-data">
                      ₹ {(Number(currentLeadForm.totalAmount).toFixed(2)).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="row">
                  <div className="col-sm-5 p-0">
                    <div className="form-label-name">
                      <b>Received Payment</b>
                    </div>
                  </div>
                  <div className="col-sm-7 p-0">
                    <div className="form-label-data">
                      ₹ {(Number(currentLeadForm.receivedAmount).toFixed(2)).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="row">
                  <div className="col-sm-4 p-0">
                    <div className="form-label-name">
                      <b>Pending Payment</b>
                    </div>
                  </div>
                  <div className="col-sm-8 p-0">
                    <div className="form-label-data">
                      ₹ {(Number(currentLeadForm.pendingAmount).toFixed(2)).toLocaleString()}
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
                        currentLeadForm.paymentReceipt[0].filename
                          ? currentLeadForm.paymentReceipt[0].filename
                          : currentLeadForm.paymentReceipt[0].name
                      );
                    }}
                  >
                    {currentLeadForm.paymentReceipt[0].filename ? (
                      <>
                        <div className="docItemImg">
                          <img
                            src={
                              currentLeadForm.paymentReceipt[0].filename.endsWith(
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
                            currentLeadForm.paymentReceipt[0].filename.split("-")[1]
                          }
                        >
                          {currentLeadForm.paymentReceipt[0].filename.split("-")[1]}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="docItemImg">
                          <img
                            src={
                              currentLeadForm.paymentReceipt[0].name.endsWith(".pdf")
                                ? pdfimg
                                : img
                            }
                          ></img>
                        </div>
                        <div
                          className="docItemName wrap-MyText"
                          title={currentLeadForm.paymentReceipt[0].name.split("-")[1]}
                        >
                          {currentLeadForm.paymentReceipt[0].name.split("-")[1]}
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
                <div className="form-label-data">{currentLeadForm.paymentMethod}</div>
              </div>
            </div>
            <div className="row m-0">
              <div className="col-sm-3 p-0">
                <div className="form-label-name">
                  <b>Extra Remarks</b>
                </div>
              </div>
              <div className="col-sm-9 p-0">
                <div className="form-label-data">{currentLeadForm.extraNotes}</div>
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
                  {currentLeadForm.otherDocs.map((val) =>
                    val.filename ? (
                      <>
                        <div
                          className="UploadDocPreview"
                          onClick={() => {
                            handleViewPdOtherDocs(val.filename);
                          }}
                        >
                          <div className="docItemImg">
                            <img
                              src={val.filename.endsWith(".pdf") ? pdfimg : img}
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
                    ) : (
                      <>
                        <div
                          className="UploadDocPreview"
                          onClick={() => {
                            handleViewPdOtherDocs(val.name);
                          }}
                        >
                          <div className="docItemImg">
                            <img
                              src={val.name.endsWith(".pdf") ? pdfimg : img}
                            ></img>
                          </div>
                          <div
                            className="docItemName wrap-MyText"
                            title="logo.png"
                          >
                            {val.name.split("-")[1]}
                          </div>
                        </div>
                      </>
                    )
                  )}

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
      </div>
    </div>
  );
}

export default LeadFormPreview;
