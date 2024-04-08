import React from "react";
import Header from "../../Components/Header/Header.jsx";
import Navbar from "../../Components/Navbar/Navbar.jsx";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../../../assets/styles.css";
import { IconPhoneFilled } from "@tabler/icons-react";
import { IconMailFilled } from "@tabler/icons-react";
import { IconClockFilled } from "@tabler/icons-react";
import Nodata from "../../Components/Nodata/Nodata.jsx";

function CompanyParticular_Datamanager({}) {
  const [employeeHistory, setEmployeeHistory] = useState([]);
  const [companyObject, setCompanyObject] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [bookingObject, setBookingObject] = useState(null);
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const { companyId } = useParams();

  const fetchCompany = async () => {
    try {
      // Make a GET request to fetch data of the specific company by its name
      const response = await axios.get(
        `${secretKey}/specific-company/${companyId}`
      );
      // Extract the data from the response
      const data = response.data;
      console.log(data);
      setCompanyName(data["Company Name"]);
      // Set the fetched company data to the state
      setCompanyObject(data);
    } catch (error) {
      console.error("Error fetching company:", error);
    }
  };


  useEffect(() => {
    fetchCompany();
  }, []);

  
  useEffect(() => {
    const fetchEmployeeHistory = async () => {
      try {
        // Make a GET request to fetch data based on the companyName
        const response = await axios.get(
          `${secretKey}/employee-history/${companyName}`
        );
        // Extract the data from the response
        const data = response.data;

        // Set the fetched employee history data to the state
        setEmployeeHistory(data);
      } catch (error) {
        console.error("Error fetching employee history:", error);
      }
    };


    const fetchBookingDetails = async () => {
      try {
        // Make a GET request to fetch data based on the companyName
        const response = await axios.get(`${secretKey}/company/${companyName}`);
        // Extract the data from the response
        const data = response.data;

        // Set the fetched employee history data to the state
        setBookingObject(data);
      } catch (error) {
        console.error("Error fetching employee history:", error);
      }
    };

    // Call the fetchEmployeeHistory function when the component mounts
    if (companyName !== "") {
      fetchEmployeeHistory();
      fetchBookingDetails();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyName]);
  function formatDate(inputDate) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(inputDate).toLocaleDateString(
      "en-US",
      options
    );
    return formattedDate;
  }
  return (
    <div>
      <Header />
      <Navbar />
      {companyObject !== null && (
        <div className="container-xl mt-2">
          <div className="company-introduction-card card">
            <div className="card-body">
              <div
                style={{ alignItems: "inherit" }}
                className="card-header m-0 p-0 d-flex flex-column"
              >
                <strong style={{ fontSize: "20px" }}>
                  {companyName !== "" ? companyName : "Company Name"}
                </strong>
                <i>
                  {companyObject.City}, {companyObject.State}
                </i>
              </div>

              <div className="company-details">
                <div className="row mt-2">
                  <div className="col">
                    <p className="bde-info">
                      <div className="info-label">
                        <span style={{ color: "#313c52" }}>BDE:</span>{" "}
                        <strong>{companyObject.ename} </strong>
                      </div>

                      <div className="info-label">
                        <span style={{ color: "#313c52" }}>Assigned On:</span>{" "}
                        <strong>{formatDate(companyObject.AssignDate)}</strong>
                      </div>

                      <div className="info-label">
                        <span style={{ color: "#313c52" }}>Status:</span>
                        <strong>{companyObject.Status}</strong>
                      </div>
                    </p>
                  </div>
                  <div className="col">
                    <p className="contact-info">
                      <div className="info-label ">
                        <IconPhoneFilled />
                        <strong>+91 {companyObject["Company Number"]}</strong>
                      </div>

                      <div className="info-label">
                        <IconMailFilled />{" "}
                        <strong>{companyObject["Company Email"]}</strong>
                      </div>

                      <div className="info-label">
                        <IconClockFilled />{" "}
                        <strong>
                          {formatDate(
                            companyObject["Company Incorporation Date  "]
                          )}
                        </strong>
                      </div>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="row main-container">
        <div className="col-sm-4">
          {companyObject !== null && (
            <>
              <div className="card p-2">
                <div className="heading">
                  <h1>Company History</h1>
                </div>
                <div className="wrapper">
                  <ul className="StepProgress">
                    <li className="StepProgress-item is-done">
                      <div class="step-content">
                        <strong>Company Added</strong>
                        <span style={{ marginLeft: "-54px" }} class="step-date">
                          Feb 15, 2024
                        </span>
                      </div>
                    </li>
                    <li className="StepProgress-item is-done">
                      <div class="step-content">
                        {companyObject.ename !== "Not Alloted" ? (
                          <>
                            {" "}
                            {employeeHistory.length !== 0 &&
                              employeeHistory.map(() => (
                                <>
                                  <strong>
                                    Company Assigned to {companyObject.ename}
                                  </strong>

                                  <span
                                    style={{ marginLeft: "-54px" }}
                                    class="step-date"
                                  >
                                    {formatDate(companyObject.AssignDate)}
                                  </span>
                                </>
                              ))}
                          </>
                        ) : (
                          <>
                            <strong>Company Unassigned</strong>
                          </>
                        )}
                      </div>
                    </li>
                    <li
                      className={
                        companyObject.Status === "Interested"
                          ? "StepProgress-item current"
                          : "StepProgress-item"
                      }
                    >
                      <div class="step-content">
                        <strong>Interested</strong>
                        <span class="step-date" style={{ marginLeft: "-54px" }}>
                          Feb 17, 2024
                        </span>
                      </div>
                    </li>
                    <li className="StepProgress-item">
                      <div class="step-content">
                        <strong>Handover</strong>
                        <span class="step-date" style={{ marginLeft: "-54px" }}>
                          Feb 18, 2024
                        </span>
                      </div>
                    </li>
                    <li className="StepProgress-item">
                      <div class="step-content">
                        <strong>Provide feedback</strong>
                        <span class="step-date" style={{ marginLeft: "-54px" }}>
                          Feb 19, 2024
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="col">
          <div className="bookingDetails card p-2">
            <div className="heading">
              <h1>Booking Details</h1>
            </div>
            <div className="card-body">
              {bookingObject === null ? (
                <div style={{ marginBottom: "28px" }}>
                  {" "}
                  <Nodata />{" "}
                </div>
              ) : (
                <div>
                  <div className="row">
                    <div className="col">
                      <div className="booking-fields-view">
                        <div className="fields-view-title">BDE Name :</div>
                        <div className="fields-view-value" id="bdmNameReal">
                          {`${bookingObject.bdmName}`}
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="booking-fields-view">
                        <div className="fields-view-title">BDE Email :</div>
                        <div className="fields-view-value" id="bdmNameReal">
                          {`${bookingObject.bdeEmail})`}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <div className="booking-fields-view">
                        <div className="fields-view-title">BDM Name :</div>
                        <div className="fields-view-value" id="bdmNameReal">
                          {`${bookingObject.bdmName}(${bookingObject.bdmType})`}
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="booking-fields-view">
                        <div className="fields-view-title">BDM Email :</div>
                        <div className="fields-view-value" id="bdmNameReal">
                          {`${bookingObject.bdmEmail})`}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <div className="booking-fields-view">
                        <div className="fields-view-title">Booking Time :</div>
                        <div className="fields-view-value">
                          {bookingObject.bookingTime}
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="booking-fields-view">
                        <div className="fields-view-title">Booking Date :</div>
                        <div className="fields-view-value">
                          {formatDate(bookingObject.bookingDate)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr className="m-0 mt-2 mb-2"></hr>
                  <div className="row">
                    <div className="col-sm-3">
                      <div className="booking-fields-view">
                        <div className="fields-view-title">Ca Case :</div>
                        <div className="fields-view-value">
                          {bookingObject.caCase}
                        </div>
                      </div>
                    </div>
                    {(bookingObject.caCommission ||
                      bookingObject.caCommission !== "") && (
                      <>
                        <div className="col-sm-3">
                          <div className="booking-fields-view">
                            <div className="fields-view-title">
                              Ca commission :
                            </div>
                            <div className="fields-view-value">
                              {bookingObject.caCommission}
                            </div>
                          </div>
                        </div>

                        <div className="col-sm-3">
                          <div className="booking-fields-view">
                            <div className="fields-view-title">CA Email :</div>
                            <div className="fields-view-value">
                              {bookingObject.caEmail}
                            </div>
                          </div>
                        </div>

                        <div className="col-sm-3">
                          <div className="booking-fields-view">
                            <div className="fields-view-title">CA Number :</div>
                            <div className="fields-view-value">
                              {bookingObject.caNumber}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <hr className="m-0 mt-2 mb-2"></hr>
                  <div className="row">
                    <div className="col">
                      <div className="booking-fields-view">
                        <div className="fields-view-title">Company Name :</div>
                        <div className="fields-view-value">
                          {bookingObject.companyName}
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="booking-fields-view">
                        <div className="fields-view-title">Company Email :</div>
                        <div className="fields-view-value">
                          {bookingObject.companyEmail}
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="booking-fields-view">
                        <div className="fields-view-title">
                          Contact Number :
                        </div>
                        <div className="fields-view-value">
                          {bookingObject.contactNumber}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <div className="booking-fields-view" id="fieldValue">
                        <div className="fields-view-title">Services :</div>
                        <div className="fields-view-value" id="servicesValue">
                          {bookingObject.services}
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr className="m-0 mt-2 mb-2"></hr>
                  <div className="row">
                    <div className="col">
                      <div className="booking-fields-view">
                        <div className="fields-view-title">Payment Terms :</div>
                        <div className="fields-view-value">
                          {bookingObject.paymentTerms}
                        </div>
                      </div>
                    </div>

                    <div className="col">
                      <div className="booking-fields-view">
                        <div className="fields-view-title">
                          Original Total Payment :
                        </div>
                        <div className="fields-view-value">
                          {bookingObject.originalTotalPayment}
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="booking-fields-view">
                        <div className="fields-view-title">Total Payment :</div>
                        <div className="fields-view-value">
                          {bookingObject.totalPayment}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <div className="booking-fields-view">
                        <div className="fields-view-title">
                          Payment Method :
                        </div>
                        <div className="fields-view-value">
                          {bookingObject.paymentMethod}
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr className="m-0 mt-2 mb-2"></hr>
                  <div className="row">
                    {(bookingObject.firstPayment ||
                      bookingObject.firstPayment === " ") && (
                      <div className="col-sm-3">
                        <div className="booking-fields-view">
                          <div className="fields-view-title">
                            First Payment :
                          </div>
                          <div className="fields-view-value">
                            {bookingObject.firstPayment}
                          </div>
                        </div>
                      </div>
                    )}
                    {(bookingObject.secondPayment ||
                      bookingObject.secondPayment === " ") && (
                      <div className="col-sm-3">
                        <div className="booking-fields-view">
                          <div className="fields-view-title">
                            Second Payment :
                          </div>
                          <div className="fields-view-value">
                            {bookingObject.secondPayment}
                          </div>
                        </div>
                      </div>
                    )}
                    {(bookingObject.thirdPayment ||
                      bookingObject.thirdPayment === " ") && (
                      <div className="col-sm-3">
                        <div className="booking-fields-view">
                          <div className="fields-view-title">
                            Third Payment :
                          </div>
                          <div className="fields-view-value">
                            {bookingObject.thirdPayment}
                          </div>
                        </div>
                      </div>
                    )}
                    {(bookingObject.fourthPayment ||
                      bookingObject.fourthPayment === " ") && (
                      <div className="col-sm-3">
                        <div className="booking-fields-view">
                          <div className="fields-view-title">
                            Fourth Payment :
                          </div>
                          <div className="fields-view-value">
                            {bookingObject.fourthPayment}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="row">
                  <div className="col">
                    <div className="booking-fields-view">
                      <div className="fields-view-title">Booking Source :</div>
                      <div className="fields-view-value">
                        {bookingObject.bookingSource}
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="booking-fields-view">
                      <div className="fields-view-title">Pan or Gst :</div>
                      <div className="fields-view-value">
                        {bookingObject.cPANorGSTnum}
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="booking-fields-view">
                      <div className="fields-view-title">
                        Incorporation Date :
                      </div>
                      <div className="fields-view-value">
                        {formatDate(bookingObject.incoDate)}
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="booking-fields-view">
                      <div className="fields-view-title">Extra Notes :</div>
                      <div className="fields-view-value">
                        {bookingObject.extraNotes}
                      </div>
                    </div>
                  </div>
                </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyParticular_Datamanager;
