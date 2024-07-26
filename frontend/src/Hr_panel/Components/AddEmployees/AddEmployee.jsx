import React, { useState } from "react";
import axios from "axios";
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
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const [empId, setEmpId] = useState("");

  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    personalPhoneNo: "",
    personalEmail: "",
    address: ""
  });

  const [employeementInfo, setEmployeementInfo] = useState({
    empId: "",
    department: "",
    designation: "",
    joiningDate: "",
    branch: "",
    employeementType: "",
    manager: "",
    officialNo: "",
    officialEmail: ""
  });

  const [payrollInfo, setPayrollInfo] = useState({
    accountNo: "",
    bankName: "",
    ifscCode: "",
    salary: "",
    allowances: "",
    deductions: "",
    firstMonthSalary: "",
    panNumber: "",
    aadharNumber: "",
    uanNumber: ""
  });

  const [emergencyInfo, setEmergencyInfo] = useState({
    personName: "",
    relationship: "",
    personPhoneNo: ""
  });

  const [empDocumentInfo, setEmpDocumentInfo] = useState({
    aadharCard: "",
    panCard: "",
    educationCertificate: "",
    relievingCertificate: "",
    salarySlip: ""
  });

  const [officialDocumentInfo, setOfficialDocumentInfo] = useState({
    offerLetter: "",
    joiningLetter: "",
    nda: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target; // name is the name attribute of the input field and value is the current value of the input field.
    setPersonalInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
    setEmployeementInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleRadioChange = (e) => {
    setPersonalInfo(prevState => ({
      ...prevState,
      gender: e.target.value
    }));
  };

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

  console.log("Active step :", activeStep);

  const handleComplete = async () => {
    setCompleted((prevCompleted) => ({
      ...prevCompleted,
      [activeStep]: true
    }));
    handleNext();
  };

  const handleSubmit = async () => {
    const finalData = {
      personalInfo,
      employeementInfo,
      payrollInfo,
      emergencyInfo,
      empDocumentInfo,
      officialDocumentInfo
    };

    try {
      const res = await axios.post(`${secretKey}/employee/einfo`, finalData);
      console.log("Employee successfully created:", res.data);
      // Show success message or handle success response
    } catch (error) {
      console.log("Error creating employee", error);
      // Show error message or handle error response
    }
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  return (
    <Box sx={{ width: '100%', padding: '0px' }}>
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
                <Button className="btn btn-primary" onClick={handleReset}>Reset</Button>
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
                                  <input
                                    type="text"
                                    name="firstName"
                                    className="form-control mt-1 text-uppercase"
                                    placeholder="First name"
                                    value={personalInfo.firstName}
                                    onChange={handleInputChange}
                                  />
                                </div>
                                <div className="col">
                                  <input
                                    type="text"
                                    name="lastName"
                                    className="form-control mt-1 text-uppercase"
                                    placeholder="Last name"
                                    value={personalInfo.lastName}
                                    onChange={handleInputChange}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-sm-3">
                            <div className="form-group mt-2 mb-2">
                              <label for="Company">Date of Birth<span style={{ color: "red" }}> * </span></label>
                              <input
                                type="date"
                                name="dob"
                                className="form-control mt-1"
                                value={personalInfo.dob}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-sm-4">
                            <div className="form-group mt-2 mb-2">
                              <label for="Company">Select Gender<span style={{ color: "red" }}> * </span></label>
                              <div className="d-flex align-items-center">
                                <div className="stepper_radio_custom mr-1">
                                  <input
                                    type="radio"
                                    name="gender"
                                    value="Male"
                                    id="r1"
                                    checked={personalInfo.gender === 'Male'}
                                    onChange={handleRadioChange}
                                  />
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
                                  <input
                                    type="radio"
                                    name="gender"
                                    value="Female"
                                    id="r2"
                                    checked={personalInfo.gender === 'Female'}
                                    onChange={handleRadioChange}
                                  />
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
                              <input
                                type="tel"
                                name="personalPhoneNo"
                                className="form-control mt-1"
                                id="phoneNo"
                                placeholder="Phone No"
                                value={personalInfo.personalPhoneNo}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-sm-4">
                            <div className="form-group mt-2 mb-2">
                              <label for="email">Email Address<span style={{ color: "red" }}> * </span></label>
                              <input
                                type="email"
                                name="personalEmail"
                                className="form-control mt-1"
                                id="email"
                                placeholder="Email address"
                                value={personalInfo.personalEmail}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-sm-4">
                            <div className="form-group mt-2 mb-2">
                              <label for="address">Current Address<span style={{ color: "red" }}> * </span></label>
                              <textarea
                                rows={1}
                                name="address"
                                className="form-control mt-1"
                                id="address"
                                placeholder="Current address"
                                value={personalInfo.address}
                                onChange={handleInputChange}
                              ></textarea>
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
                            <input type="text" className="form-control mt-1" name="empId" id="Employeeid" placeholder="Email address"></input>
                          </div>
                        </div>
                        <div className="col-sm-4">
                          <div className="form-group mt-2 mb-2">
                            <label for="Department">Department<span style={{ color: "red" }}> * </span></label>
                            <input type="text" className="form-control mt-1" name="department" id="Department" placeholder="Department"></input>
                          </div>
                        </div>
                        <div className="col-sm-4">
                          <div className="form-group mt-2 mb-2">
                            <label for="Designation">Designation/Job Title<span style={{ color: "red" }}> * </span></label>
                            <input type="text" className="form-control mt-1" name="designation" id="Designation" placeholder="Designation"></input>
                          </div>
                        </div>
                        <div className="col-sm-4">
                          <div className="form-group mt-2 mb-2">
                            <label for="DateofJoinin">Date of Joining<span style={{ color: "red" }}> * </span></label>
                            <input type="date" className="form-control mt-1" name="joiningDate" id="DateofJoinin" placeholder="Designation"></input>
                          </div>
                        </div>
                        <div className="col-sm-4">
                          <div className="form-group mt-2 mb-2">
                            <label for="Location">Branch/Location<span style={{ color: "red" }}> * </span></label>
                            <select className="form-select mt-1" name="branch" id="branch">
                              <option>
                                Gota
                              </option>
                              <option>
                                Sindhu Bhavan
                              </option>
                            </select>
                          </div>
                        </div>
                        <div className="col-sm-4">
                          <div className="form-group mt-2 mb-2">
                            <label for="Employmenttype">Employment Type<span style={{ color: "red" }}> * </span></label>
                            <select className="form-select mt-1" name="employeementType" id="Employmenttype">
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
                            <input type="text" className="form-control mt-1" name="manager" id="Reporting" placeholder="Reporting Manager"></input>
                          </div>
                        </div>
                        <div className="col-sm-4">
                          <div className="form-group mt-2 mb-2">
                            <label for="Officialno">Official Mobile Number<span style={{ color: "red" }}> * </span></label>
                            <input type="tel" className="form-control mt-1" name="officialNo" id="Officialno" placeholder="Official Mobile Number"></input>
                          </div>
                        </div>
                        <div className="col-sm-4">
                          <div className="form-group mt-2 mb-2">
                            <label for="Officialemail">Official Email ID<span style={{ color: "red" }}> * </span></label>
                            <input type="email" className="form-control mt-1" name="OfficialEmail" id="Officialemail" placeholder="Official Email ID"></input>
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
                                <input type="text" className="form-control mt-1" name="accountNo" placeholder="Account Number"></input>
                              </div>
                              <div className="col">
                                <input type="text" className="form-control mt-1" name="bankName" placeholder="Name as per Bank Record"></input>
                              </div>
                              <div className="col">
                                <input type="text" className="form-control mt-1" name="ifscCode" placeholder="IFSC Code"></input>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-3">
                          <div className="form-group mt-2 mb-2">
                            <label>Salary Details<span style={{ color: "red" }}> * </span></label>
                            <input type="text" className="form-control mt-1" name="salary" placeholder="Basic Salary"></input>
                          </div>
                        </div>
                        <div className="col-sm-3">
                          <div className="form-group mt-2 mb-2">
                            <label for="Company">1st Month Salary Condition<span style={{ color: "red" }}> * </span></label>
                            <div className="d-flex align-items-center">
                              <div className="stepper_radio_custom mr-1">
                                <input type="radio" name="firstMonthSalary" value="1" id="r1" />
                                <label class="stepper_radio-alias" for="r1">
                                  <div className="d-flex align-items-center justify-content-center">
                                    <div className="radio-alias-t ">
                                      50%
                                    </div>
                                  </div>
                                </label>
                              </div>
                              <div className="stepper_radio_custom">
                                <input type="radio" name="firstMonthSalary" value="2" id="r2" />
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
                            <label>Allowances<span style={{ color: "red" }}> * </span></label>
                            <input type="text" className="form-control mt-1" name="allowances" placeholder="Allowances"></input>
                          </div>
                        </div>
                        <div className="col-sm-3">
                          <div className="form-group mt-2 mb-2">
                            <label>Deductions<span style={{ color: "red" }}> * </span></label>
                            <input type="text" className="form-control mt-1" name="deductions" placeholder="Deductions"></input>
                          </div>
                        </div>
                        <div className="col-sm-4">
                          <div className="form-group mt-2 mb-2">
                            <label for="PANNumber">PAN Number<span style={{ color: "red" }}> * </span></label>
                            <input type="text" className="form-control mt-1" name="panNumber" id="PANNumber" placeholder="PAN Number"></input>
                          </div>
                        </div>
                        <div className="col-sm-4">
                          <div className="form-group mt-2 mb-2">
                            <label for="AdharNumber">Adhar Number<span style={{ color: "red" }}> * </span></label>
                            <input type="text" className="form-control mt-1" name="aadharNumber" id="AdharNumber" placeholder="Adhar Number"></input>
                          </div>
                        </div>
                        <div className="col-sm-4">
                          <div className="form-group mt-2 mb-2">
                            <label for="UANNumber">UAN  Number<span style={{ color: "red" }}> * </span></label>
                            <input type="text" className="form-control mt-1" name="uanNumber" id="UANNumber" placeholder="Universal Account Number for Provident Fund"></input>
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
                    <form>
                      <div className="row">
                        <div className="col-sm-4">
                          <div className="form-group mt-2 mb-2">
                            <label for="personName">Person Name<span style={{ color: "red" }}> * </span></label>
                            <input type="text" className="form-control mt-1" name="personName" id="personName" placeholder="Emergency Contact Person Name"></input>
                          </div>
                        </div>
                        <div className="col-sm-4">
                          <div className="form-group mt-2 mb-2">
                            <label for="relationship">Relationship<span style={{ color: "red" }}> * </span></label>
                            <select className="form-select mt-1" name="relationship" id="relationship">
                              <option>
                                Father
                              </option>
                              <option>
                                Mother
                              </option>
                              <option>
                                Spouse
                              </option>
                            </select>
                          </div>
                        </div>
                        <div className="col-sm-4">
                          <div className="form-group mt-2 mb-2">
                            <label for="personPhoneNo">Emergency Contact Number<span style={{ color: "red" }}> * </span></label>
                            <input type="text" className="form-control mt-1" name="personPhoneNo" id="personPhoneNo" placeholder="Emergency Contact Number"></input>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {activeStep === 4 && (
                <div className="step-5">
                  <h2 className="text-center">
                    Step:5 - Employee Documents
                  </h2>
                  <div className="steprForm-inner">
                    <form>
                      <div className="row">
                        <div className="col-sm-4">
                          <div class="form-group">
                            <label class="form-label" for="aadharCard">Adhar Card<span style={{ color: "red" }}> * </span></label>
                            <input type="file" class="form-control mt-1" name="aadharCard" id="aadharCard" multiple="" />
                          </div>
                        </div>
                        <div className="col-sm-4">
                          <div class="form-group">
                            <label class="form-label" for="panCard">Pan Card<span style={{ color: "red" }}> * </span></label>
                            <input type="file" class="form-control mt-1" name="panCard" id="panCard" multiple="" />
                          </div>
                        </div>
                        <div className="col-sm-4">
                          <div class="form-group">
                            <label class="form-label" for="educationCertificate">Education Certificate<span style={{ color: "red" }}> * </span></label>
                            <input type="file" class="form-control mt-1" name="educationCertificate" id="educationCertificate" multiple="" />
                          </div>
                        </div>
                        <div className="col-sm-4">
                          <div class="form-group mt-3">
                            <label class="form-label" for="relievingCertificate">Relieving Certificate<span style={{ color: "red" }}> * </span></label>
                            <input type="file" class="form-control mt-1" name="relievingCertificate" id="relievingCertificate" multiple="" />
                          </div>
                        </div>
                        <div className="col-sm-4">
                          <div class="form-group mt-3">
                            <label class="form-label" for="salarySlip">Salary Slip<span style={{ color: "red" }}> * </span></label>
                            <input type="file" class="form-control mt-1" name="salarySlip" id="salarySlip" multiple="" />
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {activeStep === 5 && (
                <div className="step-6">
                  <h2 className="text-center">
                    Step:6 - Official Documents
                  </h2>
                  <div className="steprForm-inner">
                    <form>
                      <div className="row">
                        <div className="col-sm-4">
                          <div class="form-group">
                            <label class="form-label" for="offerLetter">Offer Letter<span style={{ color: "red" }}> * </span></label>
                            <input type="file" class="form-control mt-1" name="offerLetter" id="offerLetter" multiple="" />
                          </div>
                        </div>
                        <div className="col-sm-4">
                          <div class="form-group">
                            <label class="form-label" for="joiningLetter">Joining Letter<span style={{ color: "red" }}> * </span></label>
                            <input type="file" class="form-control mt-1" name="joiningLetter" id="joiningLetter" multiple="" />
                          </div>
                        </div>
                        <div className="col-sm-4">
                          <div class="form-group">
                            <label class="form-label" for="nda">NDA<span style={{ color: "red" }}> * </span></label>
                            <input type="file" class="form-control mt-1" name="nda" id="nda" multiple="" />
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* <Box
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
              </Box> */}
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
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
                {completedSteps() === totalSteps() && (
                  <Button
                    onClick={handleSubmit}
                    variant="contained"
                    sx={{ background: "#ffba00 " }}
                  >
                    Submit
                  </Button>
                )}
              </Box>
            </React.Fragment>
          )}
        </div>
      </div>
    </Box>
  );
}