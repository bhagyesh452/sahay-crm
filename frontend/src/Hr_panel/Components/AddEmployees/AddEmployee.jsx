import React, { useState } from "react";
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import man from "../../../static/my-images/man.png";
import woman from "../../../static/my-images/woman.png";

const steps = ['Personal Information', 'Employment Information', 
  'Payroll Information', 'Emergency Contact', ' Employee Documents', 'Official Documents'];

export default function HorizontalNonLinearStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});

  const totalSteps = () => steps.length;

  const completedSteps = () => Object.keys(completed).length;

  const isLastStep = () => activeStep === totalSteps() - 1;

  const allStepsCompleted = () => completedSteps() === totalSteps();

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? steps.findIndex((_, i) => !(i in completed))
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
    setCompleted((prevCompleted) => ({
      ...prevCompleted,
      [activeStep]: true
    }));
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  return (
 
    <Box sx={{ width: '100%', padding:'0px' }}>
      <Stepper nonLinear activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label} completed={completed[index]}>
            <StepButton color="inherit" onClick={handleStep(index)} className={
                  activeStep === index ? "form-tab-active" : "No-active"
                }>
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
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button  className="btn btn-primary"  onClick={handleReset}>Reset</Button>
              </Box>
            </React.Fragment>
          ) : (
            <React.Fragment>

              {activeStep === 0 && (
                <>
                  <div className="step-1">
                    <h2 className="text-center">
                      Step:1 - Employee's Personal Information
                    </h2>
                    <div className="steprForm-inner">
                      <form>
                        <div className="row">
                          <div className="col-sm-5">
                            <div className="form-group mt-2 mb-2">
                              <label for="Company">Employee's Full Name<span style={{ color: "red" }}> * </span></label>
                              <div className="row">
                                <div className="col">
                                  <input type="text"  className="form-control mt-1" placeholder="First name"></input>
                                </div>
                                <div className="col">
                                  <input type="text"  className="form-control mt-1" placeholder="Last name"></input>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-sm-3">
                            <div className="form-group mt-2 mb-2">
                              <label for="Company">Date of Birth<span style={{ color: "red" }}> * </span></label>
                              <input type="date" className="form-control mt-1"></input>
                            </div>
                          </div>
                          <div className="col-sm-4">
                            <div className="form-group mt-2 mb-2">
                              <label for="Company">Select Gender<span style={{ color: "red" }}> * </span></label>
                              <div className="d-flex align-items-center">
                                <div className="stepper_radio_custom mr-1">
                                  <input type="radio" name="rGroup" value="1" id="r1" />
                                  <label class="stepper_radio-alias" for="r1">
                                    <div className="d-flex align-items-center justify-content-center">
                                      <div className="radio-alias-i">
                                          <img src={man}></img>
                                      </div> 
                                      <div className="radio-alias-t ">
                                          Male
                                      </div>
                                    </div>
                                  </label>
                                </div>
                                <div className="stepper_radio_custom">
                                  <input type="radio" name="rGroup" value="2" id="r2" />
                                  <label class="stepper_radio-alias" for="r2">
                                    <div className="d-flex align-items-center justify-content-center">
                                      <div className="radio-alias-i">
                                        <img src={woman}></img>
                                      </div> 
                                      <div className="radio-alias-t">
                                          Female
                                      </div>
                                    </div> 
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-sm-4">
                            <div className="form-group mt-2 mb-2">
                              <label for="phoneno">Phone No<span style={{ color: "red" }}> * </span></label>
                              <input type="tel"  className="form-control mt-1" id="phoneno" placeholder="Phone No"></input>
                            </div>
                          </div>
                          <div className="col-sm-4">
                            <div className="form-group mt-2 mb-2">
                              <label for="email">Email Address<span style={{ color: "red" }}> * </span></label>
                              <input type="email"  className="form-control mt-1" id="email" placeholder="Email address"></input>
                            </div>
                          </div>
                          <div className="col-sm-4">
                            <div className="form-group mt-2 mb-2">
                              <label for="address">Email Address<span style={{ color: "red" }}> * </span></label>
                              <textarea rows={1} className="form-control mt-1" id="address" placeholder="Address"></textarea>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </>
              )}

              {activeStep === 1 && (
                <div className="step-2">
                  <h2 className="text-center">
                    Step:2 - Employment Information
                  </h2>
                  <div className="steprForm-inner">
                      <form>
                        <div className="row">
                          <div className="col-sm-4">
                            <div className="form-group mt-2 mb-2">
                              <label for="Employeeid">Employee ID<span style={{ color: "red" }}> * </span></label>
                              <input type="text"  className="form-control mt-1" id="Employeeid" placeholder="Email address"></input>
                            </div>
                          </div>
                          <div className="col-sm-4">
                            <div className="form-group mt-2 mb-2">
                              <label for="Department">Department<span style={{ color: "red" }}> * </span></label>
                              <input type="text"  className="form-control mt-1" id="Department" placeholder="Department"></input>
                            </div>
                          </div>
                          <div className="col-sm-4">
                            <div className="form-group mt-2 mb-2">
                              <label for="Designation">Designation/Job Title<span style={{ color: "red" }}> * </span></label>
                              <input type="text"  className="form-control mt-1" id="Designation" placeholder="Designation"></input>
                            </div>
                          </div>
                          <div className="col-sm-4">
                            <div className="form-group mt-2 mb-2">
                              <label for="DateofJoinin">Date of Joining<span style={{ color: "red" }}> * </span></label>
                              <input type="date"  className="form-control mt-1" id="DateofJoinin" placeholder="Designation"></input>
                            </div>
                          </div>
                          <div className="col-sm-4">
                            <div className="form-group mt-2 mb-2">
                              <label for="Location">Branch/Location<span style={{ color: "red" }}> * </span></label>
                              <input type="text"  className="form-control mt-1" id="Location" placeholder="Branch/Location"></input>
                            </div>
                          </div>
                          <div className="col-sm-4">
                            <div className="form-group mt-2 mb-2">
                              <label for="Employmenttype">Employment Type<span style={{ color: "red" }}> * </span></label>
                              <select className="form-select mt-1" id="Employmenttype">
                                  <option>
                                    Full-time
                                  </option>
                                  <option>
                                    Part-time
                                  </option>
                                  <option>
                                    Contract
                                  </option>
                                  <option>
                                    Intern
                                  </option>
                                  <option>
                                    Other
                                  </option>
                              </select>
                            </div>
                          </div>
                          <div className="col-sm-4">
                            <div className="form-group mt-2 mb-2">
                              <label for="Reporting">Reporting Manager<span style={{ color: "red" }}> * </span></label>
                              <input type="text"  className="form-control mt-1" id="Reporting" placeholder="Reporting Manager"></input>
                            </div>
                          </div>
                          <div className="col-sm-4">
                            <div className="form-group mt-2 mb-2">
                              <label for="Officialno">Official Mobile Number<span style={{ color: "red" }}> * </span></label>
                              <input type="tel"  className="form-control mt-1" id="Officialno" placeholder="Official Mobile Number"></input>
                            </div>
                          </div>
                          <div className="col-sm-4">
                            <div className="form-group mt-2 mb-2">
                              <label for="Officialemail">Official Email ID<span style={{ color: "red" }}> * </span></label>
                              <input type="email"  className="form-control mt-1" id="Officialemail" placeholder="Official Email ID"></input>
                            </div>
                          </div>
                        </div>
                      </form>
                  </div>
              </div>
              )}

              {activeStep === 2 && (
                <div className="step-3">
                  <h2 className="text-center">
                    Step:3 - Payroll Information
                  </h2>
                  <div className="steprForm-inner">
                    <form>
                      <div className="row">
                        <div className="col-sm-12">
                          <div className="form-group mt-2 mb-2">
                            <label>Bank Account Details<span style={{ color: "red" }}> * </span></label>
                            <div className="row">
                              <div className="col">
                                <input type="text"  className="form-control mt-1" placeholder="Account Number"></input>
                              </div>
                              <div className="col">
                                <input type="text"  className="form-control mt-1" placeholder="Bank Name"></input>
                              </div>
                              <div className="col">
                                <input type="text"  className="form-control mt-1" placeholder="IFSC Code"></input>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-12">
                          <div className="form-group mt-2 mb-2">
                            <label>Salary Details<span style={{ color: "red" }}> * </span></label>
                            <div className="row">
                              <div className="col">
                                <input type="text"  className="form-control mt-1" placeholder="Basic Salary"></input>
                              </div>
                              <div className="col">
                                <input type="text"  className="form-control mt-1" placeholder="Allowances"></input>
                              </div>
                              <div className="col">
                                <input type="text"  className="form-control mt-1" placeholder="Deductions"></input>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-3">
                          <div className="form-group mt-2 mb-2">
                            <label for="Company">1st Month Salary Condition<span style={{ color: "red" }}> * </span></label>
                            <div className="d-flex align-items-center">
                              <div className="stepper_radio_custom mr-1">
                                <input type="radio" name="rGroup" value="1" id="r1" />
                                <label class="stepper_radio-alias" for="r1">
                                  <div className="d-flex align-items-center justify-content-center">
                                    <div className="radio-alias-t ">
                                        50%
                                    </div>
                                  </div>
                                </label>
                              </div>
                              <div className="stepper_radio_custom">
                                <input type="radio" name="rGroup" value="2" id="r2" />
                                <label class="stepper_radio-alias" for="r2">
                                  <div className="d-flex align-items-center justify-content-center">
                                    <div className="radio-alias-t">
                                        100%
                                    </div>
                                  </div> 
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-3">
                          <div className="form-group mt-2 mb-2">
                            <label for="PANNumber">PAN Number<span style={{ color: "red" }}> * </span></label>
                            <input type="text"  className="form-control mt-1" id="PANNumber" placeholder="PAN Number"></input>
                          </div>
                        </div>
                        <div className="col-sm-3">
                          <div className="form-group mt-2 mb-2">
                            <label for="AdharNumber">Adhar Number<span style={{ color: "red" }}> * </span></label>
                            <input type="text"  className="form-control mt-1" id="AdharNumber" placeholder="Adhar Number"></input>
                          </div>
                        </div>
                        <div className="col-sm-3">
                          <div className="form-group mt-2 mb-2">
                            <label for="UANNumber">UAN  Number<span style={{ color: "red" }}> * </span></label>
                            <input type="text"  className="form-control mt-1" id="UANNumber" placeholder="Universal Account Number for Provident Fund"></input>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
              </div>
              )}

              {activeStep === 3 && (
                <div className="step-4">
                  <h2 className="text-center">
                    Step:4 - Emergency Contact
                  </h2>
                  <div className="steprForm-inner">

                  </div>
              </div>
              )}


              {activeStep === 4 && (
                <div className="step-5">
                  <h2 className="text-center">
                    Step:5 - Employee Documents
                  </h2>
                  <div className="steprForm-inner">

                  </div>
              </div>
              )}

              {activeStep === 5 && (
                <div className="step-6">
                  <h2 className="text-center">
                    Step:6 - Official Documents
                  </h2>
                  <div className="steprForm-inner">

                  </div>
              </div>
              )}

                <Box
                  sx={{ display: "flex", flexDirection: "row", pt: 2 }}
                >
                  <Button
                    variant="contained"
                    onClick={handleBack}
                    sx={{ mr: 1, background: "#ffba00 " }}
                  >
                    {activeStep !== 0 ? "Back" : "Back to Main"}
                  </Button>
                  <Button
                    color="primary"
                    variant="contained"
                    disabled={activeStep === 0}
                    sx={{ mr: 1, background: "#ffba00 " }}
                  >
                    Reset
                  </Button>
                  <Box sx={{ flex: "1 1 auto" }} />
                  <Button
                    onClick={handleNext}
                    variant="contained"
                    sx={{ mr: 1 }}
                    disabled={!completed[activeStep]}
                  >
                    Next
                  </Button>
                  {activeStep !== steps.length &&
                    (completed[activeStep] ? (
                      <>
                        <Button
                          onClick={() => {
                            setCompleted((prevCompleted) => ({
                              ...prevCompleted,
                              [activeStep]: false,
                            }));
                          }}
                          variant="contained"
                          sx={{ mr: 1, background: "#ffba00 " }}
                        >
                          Edit
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={handleComplete}
                        variant="contained"
                        sx={{ mr: 1, background: "#ffba00 " }}
                      >
                        {completedSteps() === totalSteps() - 1
                          ? "Submit"
                          : "Save Draft"}
                      </Button>
                    ))}
                </Box>
            </React.Fragment>
          )}
        </div>
      </div>
    </Box>

  );
}
