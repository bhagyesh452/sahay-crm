import React, { useState } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import Header from "./Header";
import Navbar from "./Navbar";
import StepButton from "@mui/material/StepButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const steps = [
  "Basic Company Informations",
  "Booking Details",
  "Services And Payments",
  "Payment Details",
  "Final",
];

export default function HorizontalNonLinearStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});

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

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  return (
    <div>
      <Header />
      <Navbar />
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
                                        placeholder="Enter Number"
                                        id="number"
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
                                      />
                                    </div>
                                  </div>
                                  <div className="col-sm-4">
                                    <div className="form-group mt-2 mb-2">
                                      <label for="lead-source">
                                        Lead Source:
                                      </label>
                                      <select className="form-control mt-1" id="lead-source">
                                        <option>Excel Data</option>
                                        <option>Insta Lead</option>
                                        <option>Referance</option>
                                        <option>Existing Clint</option>
                                        <option>Lead By Saurav Sir</option>
                                        <option>Other</option>
                                      </select>
                                    </div>
                                  </div>
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
                              Step:3 - Services And Payments
                            </h2>
                            <div className="steprForm-inner">
                              <form>
                                
                              </form>
                            </div>
                          </div>
                        </>
                      )}
                      {activeStep === 3 && (
                        <>
                          <div className="steprForm step-1">Step 4</div>
                        </>
                      )}
                      {activeStep === 4 && (
                        <>
                          <div className="steprForm step-1">Step 5</div>
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
