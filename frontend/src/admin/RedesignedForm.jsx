import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import Header from "./Header";
import Navbar from "./Navbar";
import StepButton from "@mui/material/StepButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import pdfimg from "../static/my-images/pdf.png";
import img from "../static/my-images/image.png";
import wordimg from "../static/my-images/word.png";
import excelimg from "../static/my-images/excel.png";

import axios from "axios";
const secretKey = process.env.REACT_APP_SECRET_KEY;
const steps = [
  "Basic Company Informations",
  "Booking Details",
  "Services And Payments",
  "Payment Summery",
  "Final",
];

const defaultService = {
  serviceName: "",
  withDSC:false,
  totalPaymentWOGST: "",
  totalPaymentWGST: "",
  withGST:false,
  paymentTerms: "",
  firstPayment: "",
  secondPayment: "",
  thirdPayment: "",
  fourthPayment: "",
  paymentRemarks: "No payment remarks",
};

export default function RedesignedForm({ companysName }) {
  const [totalServices, setTotalServices] = useState(1);
  const defaultLeadData = {
    "Company Name": companysName,
    "Company Number": "",
    "Company Email": "",
    panNumber: "",
    gstNumber: "",
    incoDate: "",
    bdeName: "",
    bdmName: "",
    bookingDate: "",
    bookingSource: "",
    numberOfServices: 0,
    services: [],
    caCase: false,
    caName: "",
    caEmail: "",
    caCommission: "",
    paymentMethod: "",
    paymentReceipt: "",
    extraNotes: "",
    totalAmount: 0,
    receivedAmount: 0,
    pendingAmount: 0,
  };
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const [selectedValues, setSelectedValues] = useState("");

  const [leadData, setLeadData] = useState(defaultLeadData);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${secretKey}/redesigned-leadData/${companysName}`
        );
        const data = response.data.find(
          (item) => item["Company Name"] === companysName
        );
        if (data.Step1Status === true && data.Step2Status === false) {
          setLeadData({
            ...leadData,
            "Company Name": data["Company Name"],
            "Company Email": data["Company Email"],
            "Company Number": data["Company Number"],
            incoDate: data.incoDate,
            panNumber: data.panNumber,
            gstNumber: data.gstNumber,
          });
          setCompleted({ 0: true });
          setActiveStep(1);
        } else if (data.Step2Status === true && data.Step3Status === false) {
          setSelectedValues(data.bookingSource);
          setLeadData({
            ...leadData,
            "Company Name": data["Company Name"],
            "Company Email": data["Company Email"],
            "Company Number": data["Company Number"],
            incoDate: data.incoDate,
            panNumber: data.panNumber,
            gstNumber: data.gstNumber,
            bdeName: data.bdeName,
            bdeEmail: data.bdeEmail,
            bdmName: data.bdmName,
            bdmEmail: data.bdmEmail,
            bookingDate: data.bookingDate,
            bookingSource: data.bookingSource,
          });
          setCompleted({ 0: true, 1: true });
          setActiveStep(2);
        }

        console.log(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    // Create new services array based on totalServices
    const newServices = Array.from({ length: totalServices }, () => ({
      ...defaultService,
    }));
    setLeadData((prevState) => ({ ...prevState, services: newServices }));
  }, [totalServices, defaultService]);

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleComplete = async () => {
    try {
      const newCompleted = completed;
      newCompleted[activeStep] = true;

      setCompleted(newCompleted);

      // Prepare the data to send to the backend
      let dataToSend = {
        ...leadData,
        Step1Status: true,
      };

      if (activeStep === 1) {
        dataToSend = {
          ...dataToSend,
          Step2Status: true,
          bookingSource: selectedValues,
        };
      } else if (activeStep === 2) {
        dataToSend = {
          ...dataToSend,
          Step2Status: true,
          Step3Status: true,
        };
      }

      console.log(activeStep, dataToSend);
      // Make a POST request to send data to the backend
      const response = await axios.post(
        `${secretKey}/redesigned-leadData/${companysName}`,
        dataToSend
      );
      console.log("Data sent to backend:", response.data); // Log the response from the backend

      handleNext(); // Proceed to the next step
    } catch (error) {
      console.error("Error sending data to backend:", error);
      // Handle error if needed
    }
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  const renderServices = () => {
    const services = [];
    console.log(leadData.services.length , Number(totalServices))
   if(leadData.services.length === Number(totalServices)){
    for (let i = 0; i < totalServices; i++) {
      services.push(
        <div key={i} className="servicesFormCard mt-3">
          {/* <div className="services_No">
              1
        </div> */}
          <div className="d-flex align-items-center">
            <div className="selectservices-label mr-2">
              <label for="">Select Service:</label>
            </div>
            <div className="selectservices-label-selct">
              <select
                className="form-select mt-1"
                id={`Service-${i}`}
                value={leadData.services[i].serviceName}
                onChange={(e) => {
                  setLeadData((prevState) => ({
                    ...prevState,
                    services: prevState.services.map((service, index) =>
                      index === i
                        ? { ...service, serviceName: e.target.value }
                        : service
                    ),
                  }));
                }}
              >
                <option value="" disabled selected>
                  Select Service Name
                </option>
                <option value="Start Up Certificate">
                  Startup certificate
                </option>
                <option value="Boom">Boom</option>
                <option value="Baaam">Baaam</option>
                <option value="vooooo">voooo</option>
              </select>
            </div>
            {leadData.services[i].serviceName === "Start Up Certificate" && <div className="ml-2">
              <div class="form-check m-0">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="dsc"
                  value="0"
                  checked={leadData.services[i].withDSC}
                  onChange={(e) => {
                    setLeadData((prevState) => ({
                      ...prevState,
                      services: prevState.services.map((service, index) =>
                        index === i
                          ? { ...service, withDSC: !service.withDSC }
                          : service
                      ),
                    }));
                  }}
                />
                <label class="form-check-label" for="dsc">
                  WITH DSC
                </label>
              </div>
            </div>}
          </div>
          <hr className="mt-3 mb-3"></hr>
          <div className="row align-items-center mt-2">
            <div className="col-sm-8">
              <label class="form-label">Total Amount</label>
              <div className="d-flex align-items-center">
                <div class="input-group total-payment-inputs mb-2">
                  <input
                    type="number"
                    class="form-control "
                    placeholder="Enter Amount"
                    id={`Amount-${i}`}
                    value={leadData.services[i].totalPaymentWOGST}
                    onChange={(e) => {
                      setLeadData((prevState) => ({
                        ...prevState,
                        services: prevState.services.map((service, index) =>
                          index === i
                            ? {
                                ...service,
                                totalPaymentWOGST: e.target.value,
                               totalPaymentWGST: service.withGST === true ? e.target.value * 1.8 : e.target.value
                              }
                            : service
                        ),
                      }));
                    }}
                  />
                  <button class="btn" type="button">
                    ₹
                  </button>
                </div>
                <div class="form-check ml-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="GST"
                    value="0"
                    checked={leadData.services[i].withGST}
                    onChange={(e) => {
                      setLeadData((prevState) => ({
                        ...prevState,
                        services: prevState.services.map((service, index) =>
                          index === i
                            ? { ...service, withGST: !service.withGST , totalPaymentWGST : service.withGST === false ? service.totalPaymentWOGST * 1.8 : service.totalPaymentWOGST }
                            : service
                        ),
                      }));
                    }}
                  />
                  <label class="form-check-label" for="GST">
                    WITH GST (18%)
                  </label>
                </div>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="form-group">
                <label class="form-label">Total Amount With GST</label>
                <div class="input-group mb-2">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Search for…"
                    id={`Amount-${i}`}
                    value={leadData.services[i].totalPaymentWGST}
                    disabled
                  />
                  <button class="btn" type="button">
                    ₹
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-sm-12">
              <label className="form-label">Payment Terms</label>
            </div>
            <div className="full-time col-sm-12">
              <label className="form-check form-check-inline col">
                <input
                  className="form-check-input"
                  type="radio"
                  name="radios-inline"
                  value="Full Advanced"
                />
                <span className="form-check-label">Full Advanced</span>
              </label>
              <label className="form-check form-check-inline col">
                <input
                  className="form-check-input"
                  type="radio"
                  name="radios-inline"
                  value="two-part"
                />
                <span className="form-check-label">Part Payment</span>
              </label>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-sm-3">
              <div className="form-group">
                <label class="form-label">First Payment</label>
                <div class="input-group mb-2">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Search for…"
                  />
                  <button class="btn" type="button">
                    ₹
                  </button>
                </div>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="form-group">
                <label class="form-label">Second Payment</label>
                <div class="input-group mb-2">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Search for…"
                  />
                  <button class="btn" type="button">
                    ₹
                  </button>
                </div>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="form-group">
                <label class="form-label">Third Payment</label>
                <div class="input-group mb-2">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Search for…"
                  />
                  <button class="btn" type="button">
                    ₹
                  </button>
                </div>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="form-group">
                <label class="form-label">Fourth Payment</label>
                <div class="input-group mb-2">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Search for…"
                  />
                  <button class="btn" type="button">
                    ₹
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
   }
    return services;
  };

  console.log("Default Lead Data :", leadData);
  const handleInputChange = (value, id) => {
    setLeadData({ ...leadData, [id]: value });
  };

  return (
    <div>
      <div className="container mt-2">
        <div className="card">
          <div className="card-body p-3">
            <Box sx={{ width: "100%" }}>
              <Stepper nonLinear activeStep={activeStep}>
                {steps.map((label, index) => (
                  <Step key={label} completed={completed[index]}>
                    <StepButton
                      color="inherit"
                      onClick={handleStep(index)}
                      className={
                        activeStep === index ? "form-tab-active" : "No-active"
                      }
                    >
                      {label}
                    </StepButton>
                  </Step>
                ))}
              </Stepper>
              <div className="steprForm-bg">
                <div className="steprForm">
                  {allStepsCompleted() ? (
                    <React.Fragment>
                      <Typography sx={{ mt: 2, mb: 1 }}>
                        All steps completed - you&apos;re finished
                      </Typography>
                      <Box
                        sx={{ display: "flex", flexDirection: "row", pt: 2 }}
                      >
                        <Box sx={{ flex: "1 1 auto" }} />
                        <Button onClick={handleReset}>Reset</Button>
                      </Box>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      {activeStep === 0 && (
                        <>
                          <div className="step-1">
                            <h2 className="text-center">
                              Step:1 - Company's Basic Informations
                            </h2>
                            <div className="steprForm-inner">
                              <form>
                                <div className="row">
                                  <div className="col-sm-4">
                                    <div className="form-group mt-2 mb-2">
                                      <label for="Company">Company Name:</label>
                                      <input
                                        type="text"
                                        className="form-control mt-1"
                                        placeholder="Enter Company Name"
                                        id="Company"
                                        value={leadData["Company Name"]}
                                        onChange={(e) => {
                                          handleInputChange(
                                            e.target.value,
                                            "Company Name"
                                          );
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-sm-4">
                                    <div className="form-group mt-2 mb-2">
                                      <label for="email">Email Address:</label>
                                      <input
                                        type="email"
                                        className="form-control mt-1"
                                        placeholder="Enter email"
                                        id="email"
                                        value={leadData["Company Email"]}
                                        onChange={(e) => {
                                          handleInputChange(
                                            e.target.value,
                                            "Company Email"
                                          );
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-sm-4">
                                    <div className="form-group mt-2 mb-2">
                                      <label for="number">Phone No:</label>
                                      <input
                                        type="tel"
                                        className="form-control mt-1"
                                        placeholder="Enter Number"
                                        id="number"
                                        value={leadData["Company Number"]}
                                        onChange={(e) => {
                                          handleInputChange(
                                            e.target.value,
                                            "Company Number"
                                          );
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-sm-4">
                                    <div className="form-group mt-2 mb-2">
                                      <label for="number">
                                        Incorporation date:
                                      </label>
                                      <input
                                        type="date"
                                        className="form-control mt-1"
                                        placeholder="Incorporation Date"
                                        id="inco-date"
                                        value={leadData.incoDate}
                                        onChange={(e) => {
                                          handleInputChange(
                                            e.target.value,
                                            "incoDate"
                                          );
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-sm-4">
                                    <div className="form-group mt-2 mb-2">
                                      <label for="pan">Company's PAN:</label>
                                      <input
                                        type="text"
                                        className="form-control mt-1"
                                        placeholder="Enter Company's PAN"
                                        id="pan"
                                        value={leadData.panNumber}
                                        onChange={(e) => {
                                          handleInputChange(
                                            e.target.value,
                                            "panNumber"
                                          );
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-sm-4">
                                    <div className="form-group mt-2 mb-2">
                                      <label for="gst">Company's GST:</label>
                                      <input
                                        type="text"
                                        className="form-control mt-1"
                                        placeholder="Enter Company's GST"
                                        id="gst"
                                        value={leadData.gstNumber}
                                        onChange={(e) => {
                                          handleInputChange(
                                            e.target.value,
                                            "gstNumber"
                                          );
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </form>
                            </div>
                          </div>
                        </>
                      )}
                      {activeStep === 1 && (
                        <>
                          <div className="step-2">
                            <h2 className="text-center">
                              Step:2 - Booking Details
                            </h2>
                            <div className="steprForm-inner">
                              <form>
                                <div className="row">
                                  <div className="col-sm-3">
                                    <div className="form-group mt-2 mb-2">
                                      <label for="bdeName">BDE Name:</label>
                                      <input
                                        type="text"
                                        className="form-control mt-1"
                                        placeholder="Enter BDE Name"
                                        id="bdeName"
                                        value={leadData.bdeName}
                                        onChange={(e) => {
                                          handleInputChange(
                                            e.target.value,
                                            "bdeName"
                                          );
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-sm-3">
                                    <div className="form-group mt-2 mb-2">
                                      <label for="BDEemail">
                                        BDE Email Address:
                                      </label>
                                      <input
                                        type="email"
                                        className="form-control mt-1"
                                        placeholder="Enter BDE email"
                                        id="BDEemail"
                                        value={leadData.bdeEmail}
                                        onChange={(e) => {
                                          handleInputChange(
                                            e.target.value,
                                            "bdeEmail"
                                          );
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-sm-3">
                                    <div className="form-group mt-2 mb-2">
                                      <label for="bdmName">BDM Name:</label>
                                      <input
                                        type="text"
                                        className="form-control mt-1"
                                        placeholder="Enter BDM Name"
                                        id="bdmName"
                                        value={leadData.bdmName}
                                        onChange={(e) => {
                                          handleInputChange(
                                            e.target.value,
                                            "bdmName"
                                          );
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-sm-3">
                                    <div className="form-group mt-2 mb-2">
                                      <label for="BDMemail">
                                        BDM Email Address:
                                      </label>
                                      <input
                                        type="email"
                                        className="form-control mt-1"
                                        placeholder="Enter BDM email"
                                        id="BDMemail"
                                        value={leadData.bdmEmail}
                                        onChange={(e) => {
                                          handleInputChange(
                                            e.target.value,
                                            "bdmEmail"
                                          );
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-sm-4">
                                    <div className="form-group mt-2 mb-2">
                                      <label for="booking-date">
                                        Booking Date
                                      </label>
                                      <input
                                        type="date"
                                        className="form-control mt-1"
                                        placeholder="Enter Booking date"
                                        id="booking-date"
                                        value={leadData.bookingDate}
                                        onChange={(e) => {
                                          handleInputChange(
                                            e.target.value,
                                            "bookingDate"
                                          );
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-sm-4">
                                    <div className="form-group mt-2 mb-2">
                                      <label for="lead-source">
                                        Lead Source:
                                      </label>
                                      <select
                                        value={selectedValues}
                                        onChange={(e) =>
                                          setSelectedValues(e.target.value)
                                        }
                                        className="form-select mt-1"
                                        id="lead-source"
                                      >
                                        <option value="" disabled selected>
                                          Select Lead Source
                                        </option>
                                        <option value="Excel Data">
                                          Excel Data
                                        </option>
                                        <option value="Insta Lead">
                                          Insta Lead
                                        </option>
                                        <option value="Reference">
                                          Reference
                                        </option>
                                        <option value="Existing Client">
                                          Existing Client
                                        </option>
                                        <option value="Lead By Saurav Sir">
                                          Lead By Saurav Sir
                                        </option>
                                        <option value="Other">Other</option>
                                      </select>
                                    </div>
                                  </div>
                                  {selectedValues === "Other" && (
                                    <div className="col-sm-4">
                                      <div className="form-group mt-2 mb-2">
                                        <label for="OtherLeadSource">
                                          Other Lead Source
                                        </label>
                                        <input
                                          type="text"
                                          className="form-control mt-1"
                                          placeholder="Enter Other Lead Source"
                                          id="OtherLeadSource"
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </form>
                            </div>
                          </div>
                        </>
                      )}
                      {activeStep === 2 && (
                        <>
                          <div className="step-3">
                            <h2 className="text-center">
                              Step:3 - Services & Payment
                            </h2>
                            <div className="steprForm-inner">
                              <form>
                                <div className="d-flex align-items-center">
                                  <div>
                                    {" "}
                                    <label for="lead-source">
                                      Select No of Services:
                                    </label>
                                  </div>
                                  <div className="ml-2">
                                    <select
                                      className="form-select mt-1"
                                      id="lead-source"
                                      value={totalServices}
                                      onChange={(e) =>
                                        setTotalServices(e.target.value)
                                      }
                                    >
                                      {[...Array(6 - 1).keys()].map((year) => (
                                        <option key={year} value={1 + year}>
                                          {1 + year}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                                {renderServices()}
                              </form>
                            </div>
                          </div>
                        </>
                      )}
                      {activeStep === 3 && (
                        <>
                          <div className="step-4">
                            <h2 className="text-center">
                              Step:4 - Payment Summery
                            </h2>
                            <div className="steprForm-inner">
                              <form>
                                <div className="row">
                                  <div className="col-sm-12">
                                    <span className="notes">
                                      Note: Total Selected Services is <b>4</b>.
                                    </span>
                                  </div>
                                  <div className="col-sm-4 mt-3">
                                    <div className="form-group">
                                      <label class="form-label">
                                        Total Payment
                                      </label>
                                      <div class="input-group mb-2">
                                        <input
                                          type="text"
                                          class="form-control"
                                          placeholder="Search for…"
                                        />
                                        <button class="btn" type="button">
                                          ₹
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-sm-4 mt-3">
                                    <div className="form-group">
                                      <label class="form-label">
                                        Received Payment
                                      </label>
                                      <div class="input-group">
                                        <input
                                          type="text"
                                          class="form-control"
                                          placeholder="Search for…"
                                        />
                                        <button class="btn" type="button">
                                          ₹
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-sm-4 mt-3">
                                    <div className="form-group">
                                      <label class="form-label">
                                        Pending Payment
                                      </label>
                                      <div class="input-group mb-2">
                                        <input
                                          type="text"
                                          class="form-control"
                                          placeholder="Search for…"
                                        />
                                        <button class="btn" type="button">
                                          ₹
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-sm-4 mt-2">
                                    <div className="form-group mt-2 mb-2">
                                      <label
                                        className="form-label"
                                        for="Company"
                                      >
                                        Payment Remarks
                                      </label>
                                      <textarea
                                        rows={1}
                                        className="form-control mt-1"
                                        placeholder="Enter Company Name"
                                        id="Company"
                                      ></textarea>
                                    </div>
                                  </div>
                                  <div className="col-sm-4 mt-2">
                                    <div className="form-group mt-2 mb-2">
                                      <label
                                        className="form-label"
                                        for="Company"
                                      >
                                        Upload Payment Recipt
                                      </label>
                                      <input
                                        type="file"
                                        className="form-control mt-1"
                                        id="Company"
                                      ></input>
                                    </div>
                                  </div>
                                  <div className="col-sm-4 mt-2">
                                    <div class="form-group mt-2 mb-2">
                                      <label class="form-label">
                                        Payment Method
                                      </label>
                                      <select
                                        class="form-select mb-3"
                                        id="select-emails"
                                        fdprocessedid="iey9wm"
                                      >
                                        <option value="" disabled="">
                                          Select Payment Option
                                        </option>
                                        <option value="ICICI Bank">
                                          ICICI Bank
                                        </option>
                                        <option value="SRK Seedfund(Non GST)/IDFC first Bank">
                                          SRK Seedfund(Non GST)/IDFC first Bank
                                        </option>
                                        <option value="STARTUP SAHAY SERVICES/ADVISORY(Non GST)/ IDFC First Bank">
                                          STARTUP SAHAY SERVICES/ADVISORY(Non
                                          GST)/ IDFC First Bank
                                        </option>
                                        <option value="Razorpay">
                                          Razorpay
                                        </option>
                                        <option value="PayU">PayU</option>
                                        <option value="Other">Other</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-sm-6 mt-2">
                                    <div className="form-group">
                                      <label
                                        className="form-label"
                                        for="remarks"
                                      >
                                        Any Extra Remarks
                                      </label>
                                      <textarea
                                        rows={1}
                                        className="form-control mt-1"
                                        placeholder="Enter Company Name"
                                        id="remarks"
                                      ></textarea>
                                    </div>
                                  </div>
                                  <div className="col-sm-6 mt-2">
                                    <div className="form-group">
                                      <label className="form-label" for="docs">
                                        Upload Additional Docs
                                      </label>
                                      <input
                                        type="file"
                                        className="form-control mt-1"
                                        id="docs"
                                      ></input>
                                    </div>
                                  </div>
                                </div>
                              </form>
                            </div>
                          </div>
                        </>
                      )}
                      {activeStep === 4 && (
                        <>
                          <div className="step-3">
                            <h2 className="text-center">
                              Step:5 - Booking Preview
                            </h2>
                            <div className="steprForm-inner">
                              <div className="stepOnePreview">
                                <div className="d-flex align-items-center">
                                  <div className="services_No">1</div>
                                  <div className="ml-1">
                                    <h3 className="m-0">
                                      Company's Basic Informations
                                    </h3>
                                  </div>
                                </div>
                                <div className="servicesFormCard mt-3">
                                  <div className="row m-0">
                                    <div className="col-sm-3 p-0">
                                      <div className="form-label-name">
                                        <b>Compnay name</b>
                                      </div>
                                    </div>
                                    <div className="col-sm-9 p-0">
                                      <div className="form-label-data">
                                        Startup Sahay Private Limited
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
                                        info@startupsahay.com
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
                                        9924283530
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
                                        02/06/0995
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
                                        DLGPP19567K
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
                                      <div className="form-label-data">-</div>
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
                                      <div className="form-label-data">
                                        Ravi Prajapati
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
                                        ravi@Startupsahay.com
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
                                      <div className="form-label-data">
                                        Vaibhav Acharya
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
                                      <div className="form-label-data">
                                        vaibhav@startupsahay.com
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
                                      <div className="form-label-data">
                                        10/10/2024
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
                                      <div className="form-label-data">
                                        Other
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
                                        Lead By Nimesh Sir
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="stepThreePreview">
                                <div className="d-flex align-items-center mt-3">
                                  <div className="services_No">3</div>
                                  <div className="ml-1">
                                    <h3 className="m-0">
                                      Services And Payment Details
                                    </h3>
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
                                      <div className="form-label-data">2</div>
                                    </div>
                                  </div>
                                  <div className="parServicesPreview mt-3">
                                    <div className="row m-0">
                                      <div className="col-sm-3 p-0">
                                        <div className="form-label-name">
                                          <b>1st Services Name</b>
                                        </div>
                                      </div>
                                      <div className="col-sm-9 p-0">
                                        <div className="form-label-data">
                                          Startup India Certificate
                                        </div>
                                      </div>
                                    </div>
                                    {/* <!-- Optional --> */}
                                    <div className="row m-0">
                                      <div className="col-sm-3 p-0">
                                        <div className="form-label-name">
                                          <b>With DSC</b>
                                        </div>
                                      </div>
                                      <div className="col-sm-9 p-0">
                                        <div className="form-label-data">
                                          YES
                                        </div>
                                      </div>
                                    </div>
                                    {/* total amount */}
                                    <div className="row m-0">
                                      <div className="col-sm-3 p-0">
                                        <div className="form-label-name">
                                          <b>Total Amount</b>
                                        </div>
                                      </div>
                                      <div className="col-sm-9 p-0">
                                        <div className="form-label-data">
                                          12000
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
                                          YES
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
                                        <div className="form-label-data">
                                          Part Payment
                                        </div>
                                      </div>
                                    </div>
                                    <div className="row m-0">
                                      <div className="col-sm-3 p-0">
                                        <div className="form-label-name">
                                          <b>First Payment</b>
                                        </div>
                                      </div>
                                      <div className="col-sm-9 p-0">
                                        <div className="form-label-data">
                                          6000
                                        </div>
                                      </div>
                                    </div>
                                    <div className="row m-0">
                                      <div className="col-sm-3 p-0">
                                        <div className="form-label-name">
                                          <b>Second Payment</b>
                                        </div>
                                      </div>
                                      <div className="col-sm-9 p-0">
                                        <div className="form-label-data">
                                          6000
                                        </div>
                                      </div>
                                    </div>
                                    <div className="row m-0">
                                      <div className="col-sm-3 p-0">
                                        <div className="form-label-name">
                                          <b>Notes</b>
                                        </div>
                                      </div>
                                      <div className="col-sm-9 p-0">
                                        <div className="form-label-data">-</div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="parServicesPreview mt-3">
                                    <div className="row m-0">
                                      <div className="col-sm-3 p-0">
                                        <div className="form-label-name">
                                          <b>2nd Services Name</b>
                                        </div>
                                      </div>
                                      <div className="col-sm-9 p-0">
                                        <div className="form-label-data">
                                          Seed Fund
                                        </div>
                                      </div>
                                    </div>
                                    {/* total amount */}
                                    <div className="row m-0">
                                      <div className="col-sm-3 p-0">
                                        <div className="form-label-name">
                                          <b>Total Amount</b>
                                        </div>
                                      </div>
                                      <div className="col-sm-9 p-0">
                                        <div className="form-label-data">
                                          26000
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
                                          NO
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
                                        <div className="form-label-data">
                                          Part Payment
                                        </div>
                                      </div>
                                    </div>
                                    <div className="row m-0">
                                      <div className="col-sm-3 p-0">
                                        <div className="form-label-name">
                                          <b>First Payment</b>
                                        </div>
                                      </div>
                                      <div className="col-sm-9 p-0">
                                        <div className="form-label-data">
                                          13000
                                        </div>
                                      </div>
                                    </div>
                                    <div className="row m-0">
                                      <div className="col-sm-3 p-0">
                                        <div className="form-label-name">
                                          <b>Second Payment</b>
                                        </div>
                                      </div>
                                      <div className="col-sm-9 p-0">
                                        <div className="form-label-data">
                                          13000
                                        </div>
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
                                          Second Payment at the time of
                                          application
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="stepThreePreview">
                                <div className="d-flex align-items-center mt-3">
                                  <div className="services_No">4</div>
                                  <div className="ml-1">
                                    <h3 className="m-0">Payment Summery</h3>
                                  </div>
                                </div>
                                <div className="servicesFormCard mt-3">
                                  <div className="row m-0">
                                    <div className="col-sm-4">
                                      <div className="row">
                                        <div className="col-sm-4 p-0">
                                          <div className="form-label-name">
                                            <b>Total Paymnet</b>
                                          </div>
                                        </div>
                                        <div className="col-sm-8 p-0">
                                          <div className="form-label-data">
                                            ₹ 38000
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-sm-4">
                                      <div className="row">
                                        <div className="col-sm-4 p-0">
                                          <div className="form-label-name">
                                            <b>Received Paymnet</b>
                                          </div>
                                        </div>
                                        <div className="col-sm-8 p-0">
                                          <div className="form-label-data">
                                            ₹ 19000
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-sm-4">
                                      <div className="row">
                                        <div className="col-sm-4 p-0">
                                          <div className="form-label-name">
                                            <b>Pending Paymnet</b>
                                          </div>
                                        </div>
                                        <div className="col-sm-8 p-0">
                                          <div className="form-label-data">
                                            ₹ 19000
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row m-0">
                                    <div className="col-sm-3 align-self-stretc p-0">
                                      <div className="form-label-name h-100">
                                        <b>Upload Payment Recipt</b>
                                      </div>
                                    </div>
                                    <div className="col-sm-9 p-0">
                                      <div className="form-label-data">
                                        <div className="UploadDocPreview">
                                          <div className="docItemImg">
                                            <img src={img}></img>
                                          </div>
                                          <div
                                            className="docItemName wrap-MyText"
                                            title="logo.png"
                                          >
                                            Screenshots.png
                                          </div>
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
                                      <div className="form-label-data">
                                        ICICI Account
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
                                      <div className="form-label-data">
                                        Complate work before 25 days
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
                                        <div className="UploadDocPreview">
                                          <div className="docItemImg">
                                            <img src={pdfimg}></img>
                                          </div>
                                          <div
                                            className="docItemName wrap-MyText"
                                            title="ROC.pdf"
                                          >
                                            ROC.pdf
                                          </div>
                                        </div>
                                        <div className="UploadDocPreview">
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
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                      <Box
                        sx={{ display: "flex", flexDirection: "row", pt: 2 }}
                      >
                        <Button
                          color="inherit"
                          variant="contained"
                          disabled={activeStep === 0}
                          onClick={handleBack}
                          sx={{ mr: 1 }}
                        >
                          Back
                        </Button>
                        <Box sx={{ flex: "1 1 auto" }} />
                        <Button
                          onClick={handleNext}
                          variant="contained"
                          sx={{ mr: 1 }}
                        >
                          Next
                        </Button>
                        {activeStep !== steps.length &&
                          (completed[activeStep] ? (
                            <Typography
                              variant="caption"
                              sx={{ display: "inline-block" }}
                            >
                              Step {activeStep + 1} already completed
                            </Typography>
                          ) : (
                            <Button
                              onClick={handleComplete}
                              variant="contained"
                            >
                              {completedSteps() === totalSteps() - 1
                                ? "Finish"
                                : "Complete Step"}
                            </Button>
                          ))}
                      </Box>
                    </React.Fragment>
                  )}
                </div>
              </div>
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
}
