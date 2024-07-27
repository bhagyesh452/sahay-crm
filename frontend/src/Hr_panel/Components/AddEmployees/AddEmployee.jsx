import React, { useEffect, useState } from "react";
import axios from "axios";
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import man from "../../../static/my-images/man.png";
import woman from "../../../static/my-images/woman.png";
import HrEmployees from "../HrEmployees";
import NewEmployees from "../NewEmployees";
import Swal from "sweetalert2";

const steps = ['Personal Information', 'Employment Information',
  'Payroll Information', 'Emergency Contact', ' Employee Documents', 'Preview'];

export default function HorizontalNonLinearStepper() {
  const secretKey = process.env.REACT_APP_SECRET_KEY;

  const [isStepperOpen, setIsStepperOpen] = useState(true);
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
    empId: empId || "",
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
    firstMonthSalary: "",
    offerLetter: "",
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
    setPayrollInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
    setEmergencyInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleRadioChange = (e) => {
    const { name, value } = e.target;

    // Update the respective state based on radio button selection
    if (name === 'gender') {
      setPersonalInfo(prevState => ({
        ...prevState,
        gender: value
      }));
    } else if (name === 'firstMonthSalary') {
      setPayrollInfo(prevState => ({
        ...prevState,
        firstMonthSalary: value
      }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setPayrollInfo(prevState => ({
      ...prevState,
      [name]: files[0] // Get the first file selected
    }));
    setEmpDocumentInfo(prevState => ({
      ...prevState,
      [name]: files[0] // Get the first file selected
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
    if (activeStep === 0) {
      setIsStepperOpen(false); // Hide the stepper form
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
      // handlePrev();
    }
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  // console.log("Active step :", activeStep);

  const handleComplete = async () => {
    setCompleted((prevCompleted) => ({
      ...prevCompleted,
      [activeStep]: true
    }));
    if (activeStep === 0) {
      try {
        const res = await axios.post(`${secretKey}/employee/einfo`, personalInfo);
        console.log("Employee created successfully", res.data);
      } catch (error) {
        console.log("Error creating employee :", error);
      }
    }
    if (activeStep === 1) {
      try {
        const res = await axios.put(`${secretKey}/employee/updateEmployeeFromPersonalEmail/${personalInfo.personalEmail}`, employeementInfo);
        console.log("Employee updated successfully at step-1 :", res.data.data);
      } catch (error) {
        console.log("Error updating employee :", error);
      }
    }
    if (activeStep === 2) {
      // console.log("Payroll Info is :", payrollInfo);
      try {
        const res = await axios.put(`${secretKey}/employee/updateEmployeeFromPersonalEmail/${personalInfo.personalEmail}`, payrollInfo, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
        console.log("Employee updated successfully at step-2 :", res.data.data);
      } catch (error) {
        console.log("Error updating employee :", error);
      }
    }
    if (activeStep === 3) {
      try {
        const res = await axios.put(`${secretKey}/employee/updateEmployeeFromPersonalEmail/${personalInfo.personalEmail}`, emergencyInfo);
        console.log("Employee updated successfully at step-3 :", res.data.data);
      } catch (error) {
        console.log("Error updating employee :", error);
      }
    }
    if (activeStep === 4) {
      try {
        const res = await axios.put(`${secretKey}/employee/updateEmployeeFromPersonalEmail/${personalInfo.personalEmail}`, empDocumentInfo, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
        console.log("Employee updated successfully at step-4 :", res.data.data);
      } catch (error) {
        console.log("Error updating employee :", error);
      }
    }
    if (activeStep === 5) {
      if(personalInfo && employeementInfo && payrollInfo && emergencyInfo && employeementInfo) {
        Swal.fire({
          icon: "success",
          title: "Form Submitted",
          text: "Employee created successfully!",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "There was an error submitting the form. Please try again later.",
        });
      }
    }
    handleNext();
  };

  const handleSubmit = async () => {
    const finalData = {
      personalInfo,
      employeementInfo,
      payrollInfo,
      emergencyInfo,
      empDocumentInfo,
    };

    // try {
    //   const res = await axios.post(`${secretKey}/employee/einfo`, finalData);
    //   console.log("Employee successfully created:", res.data);
    //   // Show success message or handle success response
    // } catch (error) {
    //   console.log("Error creating employee", error);
    //   // Show error message or handle error response
    // }
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  const fetchEmployee = async () => {
    try {
      const res = await axios.get(`${secretKey}/employee/fetchEmployeeFromPersonalEmail/${personalInfo.personalEmail}`);
      // console.log("Fetched employee is :", res.data.data);
      setEmpId(res.data.data._id);
      // console.log("Employee id is :", res.data.data._id);
    } catch (error) {
      console.log("Error fetching employee", error);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, [activeStep]);

  return (
    <>
      {isStepperOpen ? (
        <>
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
                                  <label for="Employeeid">Employee ID<span style={{ color: "red" }}> * </span></label><input
                                    type="text"
                                    className="form-control mt-1"
                                    name="empId"
                                    id="Employeeid"
                                    placeholder="Employee ID"
                                    value={empId}
                                    onChange={handleInputChange}
                                    disabled
                                  />
                                </div>
                              </div>
                              <div className="col-sm-4">
                                <div className="form-group mt-2 mb-2">
                                  <label for="Department">Department<span style={{ color: "red" }}> * </span></label>
                                  <select
                                    className="form-select mt-1"
                                    name="department"
                                    id="Department"
                                    value={employeementInfo.department}
                                    onChange={handleInputChange}
                                  >
                                    <option value="Select Department" selected> Select Department</option>
                                    <option value="Admin">Admin</option>
                                    <option value="Sales">Sales</option>
                                    <option value="Others">Others</option>
                                  </select>
                                </div>
                              </div>
                              <div className="col-sm-4">
                                <div className="form-group mt-2 mb-2">
                                  <label for="Designation">Designation/Job Title<span style={{ color: "red" }}> * </span></label>
                                  <select
                                    className="form-select mt-1"
                                    name="designation"
                                    id="Designation"
                                    value={employeementInfo.designation}
                                    onChange={handleInputChange}
                                  >
                                    <option value="Select Designation" selected>Select Designation</option>
                                    <option value="Sales-executive">Sales Exexutive</option>
                                    <option value="Sales-manager">Sales Manager</option>
                                    <option value="Graphic-designer">Graphic Designer</option>
                                    <option value="Software-developer">Software Developer</option>
                                    <option value="Finance-analyst">Finance Analyst</option>
                                    <option value="Content-writer">Content Writer</option>
                                    <option value="Data-manager">Data Manager</option>
                                    <option value="Admin-team">Admin Team</option>
                                    <option value="HR">HR</option>
                                    <option value="RM-certification">RM-Certification</option>
                                    <option value="RM-funding">RM-Funding</option>
                                    <option value="Others">Others</option>
                                  </select>
                                </div>
                              </div>
                              <div className="col-sm-4">
                                <div className="form-group mt-2 mb-2">
                                  <label for="DateofJoinin">Date of Joining<span style={{ color: "red" }}> * </span></label>
                                  <input
                                    type="date"
                                    className="form-control mt-1"
                                    name="joiningDate"
                                    id="DateofJoining"
                                    placeholder="Date of Joining"
                                    value={employeementInfo.joiningDate}
                                    onChange={handleInputChange}
                                  />
                                </div>
                              </div>
                              <div className="col-sm-4">
                                <div className="form-group mt-2 mb-2">
                                  <label for="Location">Branch/Location<span style={{ color: "red" }}> * </span></label>
                                  <select
                                    className="form-select mt-1"
                                    name="branch"
                                    id="branch"
                                    value={employeementInfo.branch}
                                    onChange={handleInputChange}
                                  >
                                    <option value="Select Branch" selected>Select Branch</option>
                                    <option value="Gota">Gota</option>
                                    <option value="Sindhu Bhavan">Sindhu Bhavan</option>
                                  </select>
                                </div>
                              </div>
                              <div className="col-sm-4">
                                <div className="form-group mt-2 mb-2">
                                  <label for="Employmenttype">Employment Type<span style={{ color: "red" }}> * </span></label>
                                  <select
                                    className="form-select mt-1"
                                    name="employeementType"
                                    id="Employmenttype"
                                    value={employeementInfo.employeementType}
                                    onChange={handleInputChange}
                                  >
                                    <option value="Select Employeement Type" selected>Select Employeement Type</option>
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Contract">Contract</option>
                                    <option value="Intern">Intern</option>
                                    <option value="Other">Other</option>
                                  </select>
                                </div>
                              </div>
                              <div className="col-sm-4">
                                <div className="form-group mt-2 mb-2">
                                  <label for="Reporting">Reporting Manager<span style={{ color: "red" }}> * </span></label>
                                  <input
                                    type="text"
                                    className="form-control mt-1"
                                    name="manager"
                                    id="Reporting"
                                    placeholder="Reporting Manager"
                                    value={employeementInfo.manager}
                                    onChange={handleInputChange}
                                  />
                                </div>
                              </div>
                              <div className="col-sm-4">
                                <div className="form-group mt-2 mb-2">
                                  <label for="Officialno">Official Mobile Number<span style={{ color: "red" }}> * </span></label>
                                  <input
                                    type="tel"
                                    className="form-control mt-1"
                                    name="officialNo"
                                    id="Officialno"
                                    placeholder="Official Mobile Number"
                                    value={employeementInfo.officialNo}
                                    onChange={handleInputChange}
                                  />
                                </div>
                              </div>
                              <div className="col-sm-4">
                                <div className="form-group mt-2 mb-2">
                                  <label for="Officialemail">Official Email ID<span style={{ color: "red" }}> * </span></label>
                                  <input
                                    type="email"
                                    className="form-control mt-1"
                                    name="officialEmail"
                                    id="Officialemail"
                                    placeholder="Official Email ID"
                                    value={employeementInfo.officialEmail}
                                    onChange={handleInputChange}
                                  />
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
                                      <input
                                        type="text"
                                        className="form-control mt-1"
                                        name="accountNo"
                                        placeholder="Account Number"
                                        value={payrollInfo.accountNo}
                                        onChange={handleInputChange}
                                      />
                                    </div>
                                    <div className="col">
                                      <input
                                        type="text"
                                        className="form-control mt-1"
                                        name="bankName"
                                        placeholder="Name as per Bank Record"
                                        value={payrollInfo.bankName}
                                        onChange={handleInputChange}
                                      />
                                    </div>
                                    <div className="col">
                                      <input
                                        type="text"
                                        className="form-control mt-1"
                                        name="ifscCode"
                                        placeholder="IFSC Code"
                                        value={payrollInfo.ifscCode}
                                        onChange={handleInputChange}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-sm-4">
                                <div className="form-group mt-2 mb-2">
                                  <label>Salary Details<span style={{ color: "red" }}> * </span></label>
                                  <input
                                    type="text"
                                    className="form-control mt-1"
                                    name="salary"
                                    placeholder="Basic Salary"
                                    value={payrollInfo.salary}
                                    onChange={handleInputChange}
                                  />
                                </div>
                              </div>
                              <div className="col-sm-4">
                                <div className="form-group mt-2 mb-2">
                                  <label for="Company">1st Month Salary Condition<span style={{ color: "red" }}> * </span></label>
                                  <div className="d-flex align-items-center">
                                    <div className="stepper_radio_custom mr-1">
                                      <input
                                        type="radio"
                                        name="firstMonthSalary"
                                        value="50"
                                        id="r1"
                                        checked={payrollInfo.firstMonthSalary === "50"}
                                        onChange={handleRadioChange}
                                      />
                                      <label class="stepper_radio-alias" for="r1">
                                        <div className="d-flex align-items-center justify-content-center">
                                          <div className="radio-alias-t ">
                                            50%
                                          </div>
                                        </div>
                                      </label>
                                    </div>
                                    <div className="stepper_radio_custom">
                                      <input
                                        type="radio"
                                        name="firstMonthSalary"
                                        value="100"
                                        id="r2"
                                        checked={payrollInfo.firstMonthSalary === "100"}
                                        onChange={handleRadioChange}
                                      />
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
                              <div className="col-sm-4">
                                <div class="form-group mt-2">
                                  <label class="form-label" for="offerLetter">Offer Letter<span style={{ color: "red" }}> * </span></label>
                                  <input
                                    type="file"
                                    className="form-control mt-1"
                                    name="offerLetter"
                                    id="offerLetter"
                                    onChange={handleFileChange}
                                  />
                                </div>
                              </div>
                              <div className="col-sm-4">
                                <div className="form-group mt-2 mb-2">
                                  <label for="PANNumber">PAN Number<span style={{ color: "red" }}> * </span></label>
                                  <input
                                    type="text"
                                    className="form-control mt-1"
                                    name="panNumber"
                                    id="PANNumber"
                                    placeholder="PAN Number"
                                    value={payrollInfo.panNumber}
                                    onChange={handleInputChange}
                                  />
                                </div>
                              </div>
                              <div className="col-sm-4">
                                <div className="form-group mt-2 mb-2">
                                  <label for="AdharNumber">Adhar Number<span style={{ color: "red" }}> * </span></label>
                                  <input
                                    type="text"
                                    className="form-control mt-1"
                                    name="aadharNumber"
                                    id="AdharNumber"
                                    placeholder="Adhar Number"
                                    value={payrollInfo.aadharNumber}
                                    onChange={handleInputChange}
                                  />
                                </div>
                              </div>
                              <div className="col-sm-4">
                                <div className="form-group mt-2 mb-2">
                                  <label for="UANNumber">UAN  Number<span style={{ color: "red" }}> * </span></label>
                                  <input
                                    type="text"
                                    className="form-control mt-1"
                                    name="uanNumber"
                                    id="UANNumber"
                                    placeholder="Universal Account Number for Provident Fund"
                                    value={payrollInfo.uanNumber}
                                    onChange={handleInputChange}
                                  />
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
                                  <input
                                    type="text"
                                    className="form-control mt-1"
                                    name="personName"
                                    id="personName"
                                    placeholder="Emergency Contact Person Name"
                                    value={emergencyInfo.personName}
                                    onChange={handleInputChange}
                                  />
                                </div>
                              </div>
                              <div className="col-sm-4">
                                <div className="form-group mt-2 mb-2">
                                  <label for="relationship">Relationship<span style={{ color: "red" }}> * </span></label>
                                  <select
                                    className="form-select mt-1"
                                    name="relationship"
                                    id="relationship"
                                    value={emergencyInfo.relationship}
                                    onChange={handleInputChange}
                                  >
                                    <option value="Select Relationship" selected>Select Relationship</option>
                                    <option value="Father">Father</option>
                                    <option value="Mother">Mother</option>
                                    <option value="Spouse">Spouse</option>
                                  </select>
                                </div>
                              </div>
                              <div className="col-sm-4">
                                <div className="form-group mt-2 mb-2">
                                  <label for="personPhoneNo">Emergency Contact Number<span style={{ color: "red" }}> * </span></label>
                                  <input
                                    type="text"
                                    className="form-control mt-1"
                                    name="personPhoneNo"
                                    id="personPhoneNo"
                                    placeholder="Emergency Contact Number"
                                    value={emergencyInfo.personPhoneNo}
                                    onChange={handleInputChange}
                                  />
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
                                  <input
                                    type="file"
                                    className="form-control mt-1"
                                    name="aadharCard"
                                    id="aadharCard"
                                    onChange={handleFileChange}
                                  />
                                </div>
                              </div>
                              <div className="col-sm-4">
                                <div class="form-group">
                                  <label class="form-label" for="panCard">Pan Card<span style={{ color: "red" }}> * </span></label>
                                  <input
                                    type="file"
                                    className="form-control mt-1"
                                    name="panCard"
                                    id="panCard"
                                    onChange={handleFileChange}
                                  />
                                </div>
                              </div>
                              <div className="col-sm-4">
                                <div class="form-group">
                                  <label class="form-label" for="educationCertificate">Education Certificate<span style={{ color: "red" }}> * </span></label>
                                  <input
                                    type="file"
                                    className="form-control mt-1"
                                    name="educationCertificate"
                                    id="educationCertificate"
                                    onChange={handleFileChange}
                                  />
                                </div>
                              </div>
                              <div className="col-sm-4">
                                <div class="form-group mt-3">
                                  <label class="form-label" for="relievingCertificate">Relieving Certificate<span style={{ color: "red" }}> * </span></label>
                                  <input
                                    type="file"
                                    className="form-control mt-1"
                                    name="relievingCertificate"
                                    id="relievingCertificate"
                                    onChange={handleFileChange}
                                  />
                                </div>
                              </div>
                              <div className="col-sm-4">
                                <div class="form-group mt-3">
                                  <label class="form-label" for="salarySlip">Salary Slip<span style={{ color: "red" }}> * </span></label>
                                  <input
                                    type="file"
                                    className="form-control mt-1"
                                    name="salarySlip"
                                    id="salarySlip"
                                    onChange={handleFileChange}
                                  />
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
                          Step:6 - Preview
                        </h2>
                        <div className="steprForm-inner">

                          <div className="stepOnePreview">
                            <div className="d-flex align-items-center">
                              <div className="services_No">1</div>
                              <div className="ml-1">
                                <h3 className="m-0">
                                  Personal Information
                                </h3>
                              </div>
                            </div>
                            <div className="servicesFormCard mt-3">
                              <div className="row m-0">
                                <div className="col-sm-3 p-0">
                                  <div className="form-label-name">
                                    <b>Employee's Full Name</b>
                                  </div>
                                </div>
                                <div className="col-sm-9 p-0">
                                  <div className="form-label-data">
                                    {(personalInfo.firstName && personalInfo.lastName) ?
                                      `${personalInfo.firstName.toUpperCase()} ${personalInfo.lastName.toUpperCase()}` :
                                      "-"
                                    }
                                  </div>
                                </div>
                              </div>
                              <div className="row m-0">
                                <div className="col-sm-3 p-0">
                                  <div className="form-label-name">
                                    <b>Date of Birth</b>
                                  </div>
                                </div>
                                <div className="col-sm-9 p-0">
                                  <div className="form-label-data">
                                    {personalInfo.dob || "-"}
                                  </div>
                                </div>
                              </div>
                              <div className="row m-0">
                                <div className="col-sm-3 p-0">
                                  <div className="form-label-name">
                                    <b>Gender</b>
                                  </div>
                                </div>
                                <div className="col-sm-9 p-0">
                                  <div className="form-label-data">
                                    {personalInfo.gender || "-"}
                                  </div>
                                </div>
                              </div>
                              <div className="row m-0">
                                <div className="col-sm-3 p-0">
                                  <div className="form-label-name">
                                    <b>Phone No.</b>
                                  </div>
                                </div>
                                <div className="col-sm-9 p-0">
                                  <div className="form-label-data">
                                    {personalInfo.personalPhoneNo || "-"}
                                  </div>
                                </div>
                              </div>
                              <div className="row m-0">
                                <div className="col-sm-3 p-0">
                                  <div className="form-label-name">
                                    <b>Email Address</b>
                                  </div>
                                </div>
                                <div className="col-sm-9 p-0">
                                  <div className="form-label-data">
                                    {personalInfo.personalEmail || "-"}
                                  </div>
                                </div>
                              </div>
                              <div className="row m-0">
                                <div className="col-sm-3 p-0">
                                  <div className="form-label-name">
                                    <b>Current Address</b>
                                  </div>
                                </div>
                                <div className="col-sm-9 p-0">
                                  <div className="form-label-data">
                                    {personalInfo.address || "-"}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="stepTWOPreview">
                            <div className="d-flex align-items-center mt-3">
                              <div className="services_No">2</div>
                              <div className="ml-1">
                                <h3 className="m-0">Employeement Information</h3>
                              </div>
                            </div>
                            <div className="servicesFormCard mt-3">
                              <div className="row m-0">
                                <div className="col-sm-3 p-0">
                                  <div className="form-label-name">
                                    <b>Employee ID</b>
                                  </div>
                                </div>
                                <div className="col-sm-9 p-0">
                                  <div className="form-label-data">
                                    {empId || "-"}
                                  </div>
                                </div>
                              </div>
                              <div className="row m-0">
                                <div className="col-sm-3 p-0">
                                  <div className="form-label-name">
                                    <b>Department</b>
                                  </div>
                                </div>
                                <div className="col-sm-9 p-0">
                                  <div className="form-label-data">
                                    {employeementInfo.department || "-"}
                                  </div>
                                </div>
                              </div>
                              <div className="row m-0">
                                <div className="col-sm-3 p-0">
                                  <div className="form-label-name">
                                    <b>Designation</b>
                                  </div>
                                </div>
                                <div className="col-sm-9 p-0">
                                  <div className="form-label-data">
                                    {employeementInfo.designation || "-"}
                                  </div>
                                </div>
                              </div>
                              <div className="row m-0">
                                <div className="col-sm-3 p-0">
                                  <div className="form-label-name">
                                    <b>Joining Date</b>
                                  </div>
                                </div>
                                <div className="col-sm-9 p-0">
                                  <div className="form-label-data">
                                    {employeementInfo.joiningDate || "-"}
                                  </div>
                                </div>
                              </div>
                              <div className="row m-0">
                                <div className="col-sm-3 p-0">
                                  <div className="form-label-name">
                                    <b>Branch Office</b>
                                  </div>
                                </div>
                                <div className="col-sm-9 p-0">
                                  <div className="form-label-data">
                                    {employeementInfo.branch || "-"}
                                  </div>
                                </div>
                              </div>
                              <div className="row m-0">
                                <div className="col-sm-3 p-0">
                                  <div className="form-label-name">
                                    <b>Employeement Type</b>
                                  </div>
                                </div>
                                <div className="col-sm-9 p-0">
                                  <div className="form-label-data">
                                    {employeementInfo.employeementType || "-"}
                                  </div>
                                </div>
                              </div>
                              <div className="row m-0">
                                <div className="col-sm-3 p-0">
                                  <div className="form-label-name">
                                    <b>Reporting Manager</b>
                                  </div>
                                </div>
                                <div className="col-sm-9 p-0">
                                  <div className="form-label-data">
                                    {employeementInfo.manager || "-"}
                                  </div>
                                </div>
                              </div>
                              <div className="row m-0">
                                <div className="col-sm-3 p-0">
                                  <div className="form-label-name">
                                    <b>Official Phone No.</b>
                                  </div>
                                </div>
                                <div className="col-sm-9 p-0">
                                  <div className="form-label-data">
                                    {employeementInfo.officialNo || "-"}
                                  </div>
                                </div>
                              </div>
                              <div className="row m-0">
                                <div className="col-sm-3 p-0">
                                  <div className="form-label-name">
                                    <b>Official Email ID</b>
                                  </div>
                                </div>
                                <div className="col-sm-9 p-0">
                                  <div className="form-label-data">
                                    {employeementInfo.officialEmail || "-"}
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
                                  Payroll Information
                                </h3>
                              </div>
                            </div>
                            <div className="servicesFormCard mt-3">
                              <div className="row m-0">
                                <div className="col-sm-3 p-0">
                                  <div className="form-label-name">
                                    <b>Account Number</b>
                                  </div>
                                </div>
                                <div className="col-sm-9 p-0">
                                  <div className="form-label-data">
                                    {payrollInfo.accountNo || "-"}
                                  </div>
                                </div>
                              </div>
                              <div className="row m-0">
                                <div className="col-sm-3 p-0">
                                  <div className="form-label-name">
                                    <b>Bank Name</b>
                                  </div>
                                </div>
                                <div className="col-sm-9 p-0">
                                  <div className="form-label-data">
                                    {payrollInfo.bankName || "-"}
                                  </div>
                                </div>
                              </div>
                              <div className="row m-0">
                                <div className="col-sm-3 p-0">
                                  <div className="form-label-name">
                                    <b>IFSC Code</b>
                                  </div>
                                </div>
                                <div className="col-sm-9 p-0">
                                  <div className="form-label-data">
                                    {payrollInfo.ifscCode || "-"}
                                  </div>
                                </div>
                              </div>
                              <div className="row m-0">
                                <div className="col-sm-3 p-0">
                                  <div className="form-label-name">
                                    <b>Basic Salary</b>
                                  </div>
                                </div>
                                <div className="col-sm-9 p-0">
                                  <div className="form-label-data">
                                    {payrollInfo.salary || "-"}
                                  </div>
                                </div>
                              </div>
                              <div className="row m-0">
                                <div className="col-sm-3 p-0">
                                  <div className="form-label-name">
                                    <b>First Month Salary</b>
                                  </div>
                                </div>
                                <div className="col-sm-9 p-0">
                                  <div className="form-label-data">
                                    {payrollInfo.firstMonthSalary === "50" ? "50%" : payrollInfo.firstMonthSalary === "100" ? "100%" : "-"}
                                  </div>
                                </div>
                              </div>
                              <div className="row m-0">
                                <div className="col-sm-3 p-0">
                                  <div className="form-label-name">
                                    <b>Offer Letter</b>
                                  </div>
                                </div>
                                <div className="col-sm-9 p-0">
                                  <div className="form-label-data">
                                    {payrollInfo.offerLetter ? payrollInfo.offerLetter.name : "-"}
                                  </div>
                                </div>
                              </div>
                              <div className="row m-0">
                                <div className="col-sm-3 p-0">
                                  <div className="form-label-name">
                                    <b>Pan Number</b>
                                  </div>
                                </div>
                                <div className="col-sm-9 p-0">
                                  <div className="form-label-data">
                                    {payrollInfo.panNumber || "-"}
                                  </div>
                                </div>
                              </div>
                              <div className="row m-0">
                                <div className="col-sm-3 p-0">
                                  <div className="form-label-name">
                                    <b>Adhar Number</b>
                                  </div>
                                </div>
                                <div className="col-sm-9 p-0">
                                  <div className="form-label-data">
                                    {payrollInfo.aadharNumber || "-"}
                                  </div>
                                </div>
                              </div>
                              <div className="row m-0">
                                <div className="col-sm-3 p-0">
                                  <div className="form-label-name">
                                    <b>UAN Number</b>
                                  </div>
                                </div>
                                <div className="col-sm-9 p-0">
                                  <div className="form-label-data">
                                    {payrollInfo.uanNumber || "-"}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="stepFourPreview">
                            <div className="d-flex align-items-center mt-3">
                              <div className="services_No">4</div>
                              <div className="ml-1">
                                <h3 className="m-0">
                                  Emergency Contact
                                </h3>
                              </div>
                            </div>
                            <div className="servicesFormCard mt-3">
                              <div className="row m-0">
                                <div className="col-sm-3 p-0">
                                  <div className="form-label-name">
                                    <b>Person Name</b>
                                  </div>
                                </div>
                                <div className="col-sm-9 p-0">
                                  <div className="form-label-data">
                                    {emergencyInfo.personName || "-"}
                                  </div>
                                </div>
                              </div>
                              <div className="row m-0">
                                <div className="col-sm-3 p-0">
                                  <div className="form-label-name">
                                    <b>Relationship</b>
                                  </div>
                                </div>
                                <div className="col-sm-9 p-0">
                                  <div className="form-label-data">
                                    {emergencyInfo.relationship || "-"}
                                  </div>
                                </div>
                              </div>
                              <div className="row m-0">
                                <div className="col-sm-3 p-0">
                                  <div className="form-label-name">
                                    <b>Emergency Contact Number</b>
                                  </div>
                                </div>
                                <div className="col-sm-9 p-0">
                                  <div className="form-label-data">
                                    {emergencyInfo.personPhoneNo || "-"}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="stepFivePreview">
                            <div className="d-flex align-items-center mt-3">
                              <div className="services_No">5</div>
                              <div className="ml-1">
                                <h3 className="m-0">
                                  Employee Documents
                                </h3>
                              </div>
                            </div>
                            <div className="servicesFormCard mt-3">
                              <div className="row m-0">
                                <div className="col-sm-3 p-0">
                                  <div className="form-label-name">
                                    <b>Adhar Card</b>
                                  </div>
                                </div>
                                <div className="col-sm-9 p-0">
                                  <div className="form-label-data">
                                    {empDocumentInfo.aadharCard ? empDocumentInfo.aadharCard.name : "-"}
                                  </div>
                                </div>
                              </div>
                              <div className="row m-0">
                                <div className="col-sm-3 p-0">
                                  <div className="form-label-name">
                                    <b>Pancard</b>
                                  </div>
                                </div>
                                <div className="col-sm-9 p-0">
                                  <div className="form-label-data">
                                    {empDocumentInfo.panCard ? empDocumentInfo.panCard.name : "-"}
                                  </div>
                                </div>
                              </div>
                              <div className="row m-0">
                                <div className="col-sm-3 p-0">
                                  <div className="form-label-name">
                                    <b>Education Certificate</b>
                                  </div>
                                </div>
                                <div className="col-sm-9 p-0">
                                  <div className="form-label-data">
                                    {empDocumentInfo.educationCertificate ? empDocumentInfo.educationCertificate.name : "-"}
                                  </div>
                                </div>
                              </div>
                              <div className="row m-0">
                                <div className="col-sm-3 p-0">
                                  <div className="form-label-name">
                                    <b>Relieving Certificate</b>
                                  </div>
                                </div>
                                <div className="col-sm-9 p-0">
                                  <div className="form-label-data">
                                    {empDocumentInfo.relievingCertificate ? empDocumentInfo.relievingCertificate.name : "-"}
                                  </div>
                                </div>
                              </div>
                              <div className="row m-0">
                                <div className="col-sm-3 p-0">
                                  <div className="form-label-name">
                                    <b>Salary Slip</b>
                                  </div>
                                </div>
                                <div className="col-sm-9 p-0">
                                  <div className="form-label-data">
                                    {empDocumentInfo.salarySlip ? empDocumentInfo.salarySlip.name : "-"}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

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
                      {/* {completedSteps() === totalSteps() && (
                        <Button
                          onClick={handleSubmit}
                          variant="contained"
                          sx={{ background: "#ffba00 " }}
                        >
                          Submit
                        </Button>
                      )} */}
                    </Box>
                  </React.Fragment>
                )}
              </div>
            </div>
          </Box>
        </>
      ) : (
        <HrEmployees />
      )}
    </>
  );
}