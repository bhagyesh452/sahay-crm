import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Header from "../Header/Header";
import Navbar from "../Navbar/Navbar";
import Swal from "sweetalert2";
import { FaCopy } from "react-icons/fa";

const steps = ['Personal Information', 'Employment Information',
  'Payroll Information', 'Emergency Contact', ' Employee Documents', 'Preview'];

export default function HREditEmployee() {
  const secretKey = process.env.REACT_APP_SECRET_KEY;

  const { empId } = useParams();

  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const [errors, setErrors] = useState({});

  const [offerLetterDocument, setOfferLetterDocument] = useState([]);
  const [aadharCardDocument, setAadharCardDocument] = useState([]);
  const [panCardDocument, setPanCardDocument] = useState([]);
  const [educationCertificateDocument, setEducationCertificateDocument] = useState([]);
  const [relievingCertificateDocument, setRelievingCertificateDocument] = useState([]);
  const [salarySlipDocument, setSalarySlipDocument] = useState([]);
  const [profilePhotoDocument, setProfilePhotoDocument] = useState([]);

  const [isPersonalInfoNext, setIsPersonalInfoNext] = useState(true);
  const [isEmployeementInfoNext, setIsEmployeementInfoNext] = useState(true);
  const [isPayrollInfoNext, setIsPayrollInfoNext] = useState(true);
  const [isEmergencyInfoNext, setIsEmergencyInfoNext] = useState(true);
  const [isDocumentInfoNext, setIsDocumentInfoNext] = useState(true);

  const [isDesignationEnabled, setIsDesignationEnabled] = useState(false);
  const [isManagerEnabled, setIsManagerEnabled] = useState(false);

  const [isPersonalInfoEditable, setIsPersonalInfoEditable] = useState(false);
  const [isEmployeementInfoEditable, setIsEmployeementInfoEditable] = useState(false);
  const [isPayrollInfoEditable, setIsPayrollInfoEditable] = useState(false);
  const [isEmergencyInfoEditable, setIsEmergencyInfoEditable] = useState(false);
  const [isEmployeeDocsInfoEditable, setIsEmployeeDocsInfoEditable] = useState(false);

  const navigate = useNavigate();

  const formatSalary = (amount) => {
    return new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(amount);
  };

  // const formatDate = (isoDateString) => {
  //   const date = new Date(isoDateString);
  //   const day = String(date.getDate()).padStart(2, '0');
  //   const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  //   const year = date.getFullYear();
  //   return `${day}-${month}-${year}`;
  // };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const convertToDateInputFormat = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };


  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const isValidMobileNumber = (mobileNumber) => {
    const mobileNumberRegex = /^[6-9]\d{9}$/;
    return mobileNumberRegex.test(mobileNumber);
  };

  const isValidPAN = (pan) => {
    const regex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return regex.test(pan);
  };

  const isValidAadhar = (aadhar) => {
    const regex = /^\d{12}$/;
    return regex.test(aadhar);
  };

  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    gender: "",
    personalPhoneNo: "",
    personalEmail: "",
    currentAddress: "",
    permanentAddress: ""
  });
  const validatePersonalInfo = () => {
    const newErrors = {};
    const { firstName, middleName, lastName, dob, gender, personalPhoneNo, personalEmail, currentAddress, permanentAddress } = personalInfo;

    if (!firstName) newErrors.firstName = "First name is required";
    if (!middleName) newErrors.middleName = "Middle name is required";
    if (!lastName) newErrors.lastName = "Last name is required";
    if (!dob) newErrors.dob = "Date of birth is required";
    if (!gender) newErrors.gender = "Gender is required";
    if (!personalPhoneNo) newErrors.personalPhoneNo = "Phone number is required";
    else if (!isValidMobileNumber(personalPhoneNo)) newErrors.personalPhoneNo = "Invalid mobile number";
    if (!personalEmail) newErrors.personalEmail = "Email address is required";
    else if (!isValidEmail(personalEmail)) newErrors.personalEmail = "Invalid email address";
    if (!currentAddress) newErrors.currentAddress = "Current Address is required";
    if (!permanentAddress) newErrors.permanentAddress = "Permanent Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const departmentDesignations = {
    "Start-Up": [
      "Admin Head",
      "Accountant",
      "Data Analyst",
      "Content Writer",
      "Graphic Designer",
      "Company Secretary",
      "Relationship Manager",
      "Admin Executive",
    ],
    HR: ["HR Manager", "HR Recruiter"],
    Operation: [
      "Finance Analyst",
      "Content Writer",
      "Relationship Manager",
      "Graphic Designer",
      "Research Analyst",
    ],
    IT: [
      "Web Developer",
      "Software Developer",
      "SEO Executive",
      "Graphic Designer",
      "Content Writer",
      "App Developer",
      "Digital Marketing Executive",
      "Social Media Executive",
    ],
    Sales: [
      "Business Development Executive",
      "Business Development Manager",
      "Sales Manager",
      "Team Leader",
      "Floor Manager",
    ],
    Others: ["Receptionist"],
  };

  const departmentManagers = {
    "Start-Up": [
      "Mr. Ronak Kumar",
      "Mr. Krunal Pithadia",
      "Mr. Saurav Mevada",
      "Miss. Dhruvi Gohel"
    ],
    HR: [
      "Mr. Ronak Kumar",
      "Mr. Krunal Pithadia",
      "Mr. Saurav Mevada",
      "Miss. Hiral Panchal"
    ],
    Operation: [
      "Miss. Subhi Banthiya",
      "Mr. Rahul Pancholi",
      "Mr. Ronak Kumar",
      "Mr. Nimesh Parekh"
    ],
    IT: ["Mr. Nimesh Parekh"],
    Sales: [
      "Mr. Vaibhav Acharya",
      "Mr. Vishal Gohel"
    ],
    Others: ["Miss. Hiral Panchal"],
  }

  const renderDesignationOptions = () => {
    const designations = departmentDesignations[employeementInfo.department] || [];
    return designations.map((designation, index) => (
      <option key={index} value={designation}>
        {designation}
      </option>
    ));
  };

  const renderManagerOptions = () => {
    const managers = departmentManagers[employeementInfo.department] || [];
    return managers.map((manager, index) => (
      <option key={index} value={manager}>
        {manager}
      </option>
    ));
  };

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
  const validateEmploymentInfo = () => {
    const newErrors = {};
    const { department, designation, joiningDate, branch, employeementType, manager, officialNo, officialEmail } = employeementInfo;

    if (!department) newErrors.department = "Please select Department";
    if (!designation) newErrors.designation = "Please select Employee Designation";
    if (!joiningDate) newErrors.joiningDate = "Date of Joining is required";
    if (!branch) newErrors.branch = "Please select Branch Office";
    if (!employeementType) newErrors.employeementType = "Please select Employment Type";
    if (!manager) newErrors.manager = "Reporting Manager is required";
    if (!officialNo) newErrors.officialNo = "Mobile Number is required";
    else if (!isValidMobileNumber(officialNo)) newErrors.officialNo = "Invalid mobile number";
    if (!officialEmail) newErrors.officialEmail = "Email ID is required";
    else if (!isValidEmail(officialEmail)) newErrors.officialEmail = "Invalid email address";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [payrollInfo, setPayrollInfo] = useState({
    accountNo: "",
    nameAsPerBankRecord: "",
    ifscCode: "",
    salary: "",
    firstMonthSalaryCondition: "",
    firstMonthSalary: "",
    offerLetter: "",
    panNumber: "",
    aadharNumber: "",
    uanNumber: ""
  });
  const validatePayrollInfo = () => {
    const newErrors = {};
    const { accountNo, nameAsPerBankRecord, ifscCode, salary, firstMonthSalary, offerLetter, panNumber, aadharNumber, uanNumber } = payrollInfo;

    if (!accountNo) newErrors.accountNo = "Account Number is required";
    if (!nameAsPerBankRecord) newErrors.nameAsPerBankRecord = "Name as per bank record is required";
    if (!ifscCode) newErrors.ifscCode = "IFSC Code is required";

    // Validate Salary Details
    if (!salary) newErrors.salary = "Basic Salary is required";
    else if (isNaN(salary) || salary <= 0) newErrors.salary = "Invalid Salary amount";

    // Validate First Month Salary Condition
    if (!firstMonthSalary) newErrors.firstMonthSalary = "First Month Salary Condition is required";

    // Validate Offer Letter (File Upload)
    if (!offerLetter) newErrors.offerLetter = "Offer Letter is required";

    // Validate PAN Number
    if (!panNumber) newErrors.panNumber = "PAN Number is required";
    else if (!isValidPAN(panNumber)) newErrors.panNumber = "Invalid PAN Number";

    // Validate Aadhar Number
    if (!aadharNumber) newErrors.aadharNumber = "Aadhar Number is required";
    else if (!isValidAadhar(aadharNumber)) newErrors.aadharNumber = "Invalid Aadhar Number";

    // Validate UAN Number
    // if (!uanNumber) newErrors.uanNumber = "UAN Number is required";

    setErrors(newErrors); // Assuming `setErrors` is used to manage error state
    return Object.keys(newErrors).length === 0;
  };

  const [emergencyInfo, setEmergencyInfo] = useState({
    personName: "",
    relationship: "",
    personPhoneNo: ""
  });
  const validateEmergencyInfo = () => {
    const newErrors = {};
    const { personName, relationship, personPhoneNo } = emergencyInfo;

    // Validate Emergency Contact Details
    if (!personName) newErrors.personName = "Emergency Contact Name is required";
    if (!relationship) newErrors.relationship = "Please select Relationship";
    if (!personPhoneNo) newErrors.personPhoneNo = "Emergency Contact Number is required";
    else if (!isValidMobileNumber(personPhoneNo)) newErrors.personPhoneNo = "Invalid Phone Number";

    setErrors(newErrors); // Assuming `setErrors` is used to manage error state
    return Object.keys(newErrors).length === 0;
  };

  const [empDocumentInfo, setEmpDocumentInfo] = useState({
    aadharCard: "",
    panCard: "",
    educationCertificate: "",
    relievingCertificate: "",
    salarySlip: "",
    profilePhoto: ""
  });
  const validateEmpDocumentInfo = () => {
    const newErrors = {};
    const { aadharCard, panCard, educationCertificate, relievingCertificate, salarySlip, profilePhoto } = empDocumentInfo;

    // Validate Document Uploads
    if (!aadharCard) newErrors.aadharCard = "Aadhar Card is required";
    if (!panCard) newErrors.panCard = "PAN Card is required";
    if (!educationCertificate) newErrors.educationCertificate = "Education Certificate is required";
    // if (!relievingCertificate) newErrors.relievingCertificate = "Relieving Certificate is required";
    // if (!salarySlip) newErrors.salarySlip = "Salary Slip is required";
    // if (!profilePhoto) newErrors.profilePhoto = "Profile Photo is required";

    setErrors(newErrors); // Assuming `setErrors` is used to manage error state
    return Object.keys(newErrors).length === 0;
  };

  const fetchEmployee = async () => {
    try {
      const res = await axios.get(`${secretKey}/employee/fetchEmployeeFromId/${empId}`);
      const data = res.data.data;
      console.log("Fetched employee is :", res.data.data);
      // setEmployee(res.data.data);

      // Update personalInfo state with fetched data
      setPersonalInfo({
        firstName: (data.ename || "").split(" ")[0] || "",
        middleName: (data.ename || "").split(" ")[1] || "",
        lastName: (data.ename || "").split(" ")[2] || "",
        dob: convertToDateInputFormat(data.dob) || "",
        gender: data.gender || "",
        personalPhoneNo: data.personal_number || "",
        personalEmail: data.personal_email || "",
        currentAddress: data.currentAddress || "",
        permanentAddress: data.permanentAddress || ""
      });

      setEmployeementInfo({
        empId: "",
        department: data.department || "",
        designation: data.newDesignation || "",
        joiningDate: convertToDateInputFormat(data.jdate) || "",
        branch: data.branchOffice || "",
        employeementType: data.employeementType || "",
        manager: data.reportingManager || "",
        officialNo: data.number || "",
        officialEmail: data.email || ""
      });

      setPayrollInfo({
        accountNo: data.accountNo || "",
        nameAsPerBankRecord: data.nameAsPerBankRecord || "",
        ifscCode: data.ifscCode || "",
        salary: data.salary || "",
        firstMonthSalary: data.firstMonthSalaryCondition || "",
        salaryCalculation: data.firstMonthSalary || "",
        offerLetter: offerLetterDocument,
        panNumber: data.panNumber || "",
        aadharNumber: data.aadharNumber || "",
        uanNumber: data.uanNumber || ""
      });

      setEmergencyInfo({
        personName: data.personal_contact_person || "",
        relationship: data.personal_contact_person_relationship || "",
        personPhoneNo: data.personal_contact_person_number || ""
      });

      setEmpDocumentInfo({
        aadharCard: aadharCardDocument,
        panCard: panCardDocument,
        educationCertificate: educationCertificateDocument,
        relievingCertificate: relievingCertificateDocument,
        salarySlip: salarySlipDocument,
        profilePhoto: profilePhotoDocument
      });

      setOfferLetterDocument(data.offerLetter ? data.offerLetter : []);
      // console.log("Offer letter is :", data.offerLetter);
      setAadharCardDocument(data.aadharCard ? data.aadharCard : []);
      setPanCardDocument(data.panCard ? data.panCard : []);
      setEducationCertificateDocument(data.educationCertificate ? data.educationCertificate : []);
      setRelievingCertificateDocument(data.relievingCertificate ? data.relievingCertificate : []);
      setSalarySlipDocument(data.salarySlip ? data.salarySlip : []);
      setProfilePhotoDocument(data.profilePhoto ? data.profilePhoto : []);
    } catch (error) {
      console.log("Error fetching employee", error);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, [activeStep]);

  useEffect(() => {
    if (activeStep === 0 && !isPersonalInfoEditable && personalInfo) {
      setCompleted((prevCompleted) => ({
        ...prevCompleted,
        [activeStep]: true
      }));
    } else if (activeStep === 1 && !isEmployeementInfoEditable && employeementInfo) {
      setCompleted((prevCompleted) => ({
        ...prevCompleted,
        [activeStep]: true
      }));
    } else if (activeStep === 2 && !isPayrollInfoEditable && payrollInfo) {
      setCompleted((prevCompleted) => ({
        ...prevCompleted,
        [activeStep]: true
      }));
    } else if (activeStep === 3 && !isEmergencyInfoEditable && emergencyInfo) {
      setCompleted((prevCompleted) => ({
        ...prevCompleted,
        [activeStep]: true
      }));
    } else if (activeStep === 4 && !isEmployeeDocsInfoEditable && empDocumentInfo) {
      setCompleted((prevCompleted) => ({
        ...prevCompleted,
        [activeStep]: true
      }));
    }
  }, [activeStep])

  const calculateSalary = (salary, firstMonthSalary) => {
    if (!salary || !firstMonthSalary) return '';
    const percentage = parseFloat(firstMonthSalary) / 100;
    return (parseFloat(salary) * percentage);
  };

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
    if (name === 'department' && value !== 'Select Department') {
      setIsDesignationEnabled(true);
      setIsManagerEnabled(true);
    } else if (name === 'department' && value === 'Select Department') {
      setIsDesignationEnabled(false);
      setIsManagerEnabled(false);
    }

    setPayrollInfo((prevState) => {
      const updatedState = { ...prevState, [name]: value };

      if (name === "salary" || name === "firstMonthSalary") {
        updatedState.salaryCalculation = calculateSalary(
          name === "salary" ? value : prevState.salary,
          name === "firstMonthSalary" ? value : prevState.firstMonthSalary
        );
      }

      return updatedState;
    });

    setEmergencyInfo(prevState => ({
      ...prevState,
      [name]: value
    }));

    // Clear error for this field
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: ""
    }));
  };

  const handleAddressChange = (e) => {
    const { value } = e.target;
    setPersonalInfo((prevInfo) => ({
      ...prevInfo,
      isAddressSame: value,
      permanentAddress: value === "yes" ? prevInfo.currentAddress : ""
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      isAddressSame: ""
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      const maxSizeMB = 24;
      const maxSizeBytes = maxSizeMB * 1024 * 1024;

      if (!allowedTypes.includes(file.type)) {
        // Update the error state if file type is invalid
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Invalid file type. Only JPG, JPEG, PNG, and PDF files are allowed."
        }));
        return;
      }

      if (file.size > maxSizeBytes) {
        // Update the error state if file size exceeds limit
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: `File size exceeds ${maxSizeMB} MB limit.`
        }));
        return;
      }

      setPayrollInfo(prevState => ({
        ...prevState,
        [name]: files[0] // Get the first file selected
      }));

      setEmpDocumentInfo(prevState => ({
        ...prevState,
        [name]: files[0] // Get the first file selected
      }));

      // Clear error for this field
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: ""
      }));
    }
  };

  const totalSteps = () => steps.length;

  const completedSteps = () => Object.keys(completed).length;

  const isLastStep = () => activeStep === totalSteps() - 1;

  const allStepsCompleted = () => completedSteps() === totalSteps();

  const handleNext = () => {
    if (activeStep === 0 && validatePersonalInfo()) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setIsPersonalInfoNext(true);
    } else if (activeStep === 1 && validateEmploymentInfo()) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setIsEmployeementInfoNext(true);
    } else if (activeStep === 2 && validatePayrollInfo()) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setIsPayrollInfoNext(true);
    } else if (activeStep === 3 && validateEmergencyInfo()) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setIsEmergencyInfoNext(true);
    } else if (activeStep === 4 && validateEmpDocumentInfo()) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setIsDocumentInfoNext(true);
    }
  };

  const handleEdit = () => {
    if (activeStep === 0) {
      setIsPersonalInfoEditable(true);
      setIsPersonalInfoNext(false);
    } else if (activeStep === 1) {
      setIsEmployeementInfoEditable(true);
      setIsEmployeementInfoNext(false);
    } else if (activeStep === 2) {
      setIsPayrollInfoEditable(true);
      setIsPayrollInfoNext(false);
    } else if (activeStep === 3) {
      setIsEmergencyInfoEditable(true);
      setIsEmergencyInfoNext(false);
    } else if (activeStep === 4) {
      setIsEmployeeDocsInfoEditable(true);
      setIsDocumentInfoNext(false);
    }
    setCompleted((prevCompleted) => ({
      ...prevCompleted,
      [activeStep]: false,
    }));
  };

  const handleBack = () => {
    if (activeStep === 0) {
      navigate("/hr/employees");
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const saveDraft = async () => {
    if (activeStep === 0) {
      try {
        const res = await axios.put(`${secretKey}/employee/updateEmployeeFromId/${empId}`, personalInfo);
        console.log("Employee updated successfully at step-0 :", res.data.data);
        setCompleted((prevCompleted) => ({
          ...prevCompleted,
          [activeStep]: true
        }));
        setIsPersonalInfoEditable(false);
        setIsPersonalInfoNext(true);
      } catch (error) {
        console.log("Error creating or updating employee:", error);
      }
    } else if (activeStep === 1) {
      try {
        const res = await axios.put(`${secretKey}/employee/updateEmployeeFromId/${empId}`, employeementInfo);
        console.log("Employee updated successfully at step-1 :", res.data.data);
        setCompleted((prevCompleted) => ({
          ...prevCompleted,
          [activeStep]: true
        }));
        setIsEmployeementInfoEditable(false);
        setIsEmployeementInfoNext(true);
      } catch (error) {
        console.log("Error updating employee :", error);
      }
    } else if (activeStep === 2) {
      try {
        const res = await axios.put(`${secretKey}/employee/updateEmployeeFromId/${empId}`, payrollInfo, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log("Employee updated successfully at step-2 :", res.data.data);
        setCompleted((prevCompleted) => ({
          ...prevCompleted,
          [activeStep]: true
        }));
        setIsPayrollInfoEditable(false);
        setIsPayrollInfoNext(true);
      } catch (error) {
        console.log("Error updating employee:", error);
      }
    } else if (activeStep === 3) {
      try {
        const res = await axios.put(`${secretKey}/employee/updateEmployeeFromId/${empId}`, emergencyInfo);
        console.log("Emergency info updated successfully at step-3 :", res.data.data);
        setCompleted((prevCompleted) => ({
          ...prevCompleted,
          [activeStep]: true
        }));
        setIsEmergencyInfoEditable(false);
        setIsEmergencyInfoNext(true);
      } catch (error) {
        console.log("Error updating emergency info:", error);
      }
    } else if (activeStep === 4) {
      try {
        const res = await axios.put(`${secretKey}/employee/updateEmployeeFromId/${empId}`, empDocumentInfo, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log("Document info updated successfully at step-4 :", res.data.data);
        setCompleted((prevCompleted) => ({
          ...prevCompleted,
          [activeStep]: true
        }));
        setIsEmployeeDocsInfoEditable(false);
        setIsDocumentInfoNext(true);
      } catch (error) {
        console.log("Error updating document info:", error);
      }
    }
  };

  const handleComplete = () => {
    if (personalInfo && employeementInfo && payrollInfo && emergencyInfo && employeementInfo) {
      Swal.fire({
        icon: "success",
        title: "Form Submitted",
        text: "Employee updated successfully!",
      });
      navigate("/hr/employees");
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "There was an error updating the form. Please try again later.",
      });
    }
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
            <Box sx={{ width: '100%' }}>
              {/* <Stepper nonLinear activeStep={activeStep}> */}
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

              <div className="mb-4 steprForm-bg he_steprForm_e_add">
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
                                      <label for="fullName">Full Name<span style={{ color: "red" }}> * </span></label>
                                      <div className="row">
                                        <div className="col">
                                          <input
                                            type="tefalsext"
                                            name="firstName"
                                            className="form-control mt-1"
                                            placeholder="First name"
                                            value={personalInfo.firstName.trim()}
                                            onChange={handleInputChange}
                                            disabled={!isPersonalInfoEditable}
                                          />
                                          {errors.firstName && <p style={{ color: "red" }}>{errors.firstName}</p>}
                                        </div>
                                        <div className="col">
                                          <input
                                            type="text"
                                            name="middleName"
                                            className="form-control mt-1"
                                            placeholder="Middle name"
                                            value={personalInfo.middleName?.trim()}
                                            onChange={handleInputChange}
                                            disabled={!isPersonalInfoEditable}
                                          />
                                          {errors.middleName && <p style={{ color: "red" }}>{errors.middleName}</p>}
                                        </div>
                                        <div className="col">
                                          <input
                                            type="text"
                                            name="lastName"
                                            className="form-control mt-1"
                                            placeholder="Last name"
                                            value={personalInfo.lastName.trim()}
                                            onChange={handleInputChange}
                                            disabled={!isPersonalInfoEditable}
                                          />
                                          {errors.lastName && <p style={{ color: "red" }}>{errors.lastName}</p>}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-sm-2">
                                    <div className="form-group mt-2 mb-2">
                                      <label for="dob">Date of Birth<span style={{ color: "red" }}> * </span></label>
                                      <input
                                        type="date"
                                        name="dob"
                                        className="form-control mt-1"
                                        value={personalInfo.dob}
                                        onChange={handleInputChange}
                                        disabled={!isPersonalInfoEditable}
                                      />
                                      {errors.dob && <p style={{ color: "red" }}>{errors.dob}</p>}
                                    </div>
                                  </div>
                                  <div className="col-sm-2">
                                    <div className="form-group mt-2 mb-2">
                                      <label for="geneder">Select Gender<span style={{ color: "red" }}> * </span></label>
                                      <select
                                        className="form-select mt-1"
                                        name="gender"
                                        id="Gender"
                                        value={personalInfo.gender}
                                        onChange={handleInputChange}
                                        disabled={!isPersonalInfoEditable}
                                      >
                                        <option value="Select Gender" selected> Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                      </select>
                                      {errors.gender && <p style={{ color: "red" }}>{errors.gender}</p>}
                                    </div>
                                  </div>
                                  <div className="col-sm-3">
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
                                        disabled={!isPersonalInfoEditable}
                                      />
                                      {errors.personalPhoneNo && <p style={{ color: "red" }}>{errors.personalPhoneNo}</p>}
                                    </div>
                                  </div>
                                </div>
                                <div className="row">
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
                                        disabled={!isPersonalInfoEditable}
                                      />
                                      {errors.personalEmail && <p style={{ color: "red" }}>{errors.personalEmail}</p>}
                                    </div>
                                  </div>
                                  <div className="col-sm-4">
                                    <div className="form-group mt-2 mb-2">
                                      <label for="currentAddress">Current Address<span style={{ color: "red" }}> * </span></label>
                                      <div>
                                        <textarea
                                          rows={1}
                                          name="currentAddress"
                                          className="form-control mt-1"
                                          id="currentAddress"
                                          placeholder="Current address"
                                          value={personalInfo.currentAddress}
                                          onChange={handleInputChange}
                                          disabled={!isPersonalInfoEditable}
                                        ></textarea>
                                        {errors.currentAddress && <p style={{ color: "red" }}>{errors.currentAddress}</p>}
                                      </div>
                                    </div>
                                  </div>
                                  {/* <div className="col-sm-3">
                                    <div className="form-group mt-2 mb-2">
                                      <label>Is permanent address same as current?</label>
                                      <select
                                        className="form-select mt-1"
                                        name="isAddressSame"
                                        id="isAddressSame"
                                        value={personalInfo.isAddressSame}
                                        onChange={handleAddressChange}
                                        disabled={!isPersonalInfoEditable}
                                      >
                                        <option value="Select Option" selected>Select Option</option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                      </select>
                                      {errors.isAddressSame && <p style={{ color: "red" }}>{errors.isAddressSame}</p>}
                                    </div>
                                  </div> */}
                                  <div className="col-sm-4">
                                    <div className="form-group mt-1 mb-2">
                                      <div className="d-flex align-items-center justify-content-between">
                                        <label htmlFor="permanentAddress">
                                          Permanent Address<span style={{ color: "red" }}> *</span>
                                        </label>
                                        <div>
                                          <button className="action-btn action-btn-primary m-0" title="Is permanent address same as current?"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              setPersonalInfo(prevState => ({
                                                ...prevState,
                                                permanentAddress: prevState.currentAddress
                                              }));
                                            }}
                                          >
                                            <FaCopy />
                                          </button>
                                        </div>
                                      </div>
                                      <textarea
                                        rows={1}
                                        name="permanentAddress"
                                        className="form-control mt-1"
                                        id="permanentAddress"
                                        placeholder="Permanent address"
                                        value={personalInfo.permanentAddress}
                                        onChange={handleInputChange}
                                        disabled={!isPersonalInfoEditable}
                                      ></textarea>
                                      {errors.permanentAddress && <p style={{ color: "red" }}>{errors.permanentAddress}</p>}
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
                                      disabled={!isEmployeementInfoEditable}
                                    >
                                      <option value="Select Department" selected> Select Department</option>
                                      <option value="Start-Up">Start-Up</option>
                                      <option value="HR">HR</option>
                                      <option value="Operation">Operation</option>
                                      <option value="IT">IT</option>
                                      <option value="Sales">Sales</option>
                                      <option value="Others">Others</option>
                                    </select>
                                    {errors.department && <p style={{ color: "red" }}>{errors.department}</p>}
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
                                      disabled={!isEmployeementInfoEditable}
                                    >
                                      <option value="Select Designation">Select Designation</option>
                                      {renderDesignationOptions()}
                                    </select>
                                    {errors.designation && <p style={{ color: "red" }}>{errors.designation}</p>}
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
                                      disabled={!isEmployeementInfoEditable}
                                    />
                                    {errors.joiningDate && <p style={{ color: "red" }}>{errors.joiningDate}</p>}
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
                                      disabled={!isEmployeementInfoEditable}
                                    >
                                      <option value="Select Branch" selected>Select Branch</option>
                                      <option value="Gota">Gota</option>
                                      <option value="Sindhu Bhawan">Sindhu Bhawan</option>
                                    </select>
                                    {errors.branch && <p style={{ color: "red" }}>{errors.branch}</p>}
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
                                      disabled={!isEmployeementInfoEditable}
                                    >
                                      <option value="Select Employeement Type" selected>Select Employeement Type</option>
                                      <option value="Full-time">Full-time</option>
                                      <option value="Part-time">Part-time</option>
                                      <option value="Contract">Contract</option>
                                      <option value="Intern">Intern</option>
                                      <option value="Other">Other</option>
                                    </select>
                                    {errors.employeementType && <p style={{ color: "red" }}>{errors.employeementType}</p>}
                                  </div>
                                </div>
                                <div className="col-sm-4">
                                  <div className="form-group mt-2 mb-2">
                                    <label for="Reporting">Reporting Manager
                                      <span style={{ color: "red" }}> * </span>
                                    </label>
                                    <select
                                      className="form-select mt-1"
                                      name="manager"
                                      id="Reporting"
                                      value={employeementInfo.manager}
                                      onChange={handleInputChange}
                                      disabled={!isEmployeementInfoEditable}
                                    >
                                      <option value="Select Manager">Select Manager</option>
                                      {renderManagerOptions()}
                                    </select>
                                    {errors.manager && <p style={{ color: "red" }}>{errors.manager}</p>}
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
                                      disabled={!isEmployeementInfoEditable}
                                    />
                                    {errors.officialNo && <p style={{ color: "red" }}>{errors.officialNo}</p>}
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
                                      disabled={!isEmployeementInfoEditable}
                                    />
                                    {errors.officialEmail && <p style={{ color: "red" }}>{errors.officialEmail}</p>}
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
                                          disabled={!isPayrollInfoEditable}
                                        />
                                        {errors.accountNo && <p style={{ color: "red" }}>{errors.accountNo}</p>}
                                      </div>
                                      <div className="col">
                                        <input
                                          type="text"
                                          className="form-control mt-1"
                                          name="nameAsPerBankRecord"
                                          placeholder="Name as per Bank Record"
                                          value={payrollInfo.nameAsPerBankRecord}
                                          onChange={handleInputChange}
                                          disabled={!isPayrollInfoEditable}
                                        />
                                        {errors.nameAsPerBankRecord && <p style={{ color: "red" }}>{errors.nameAsPerBankRecord}</p>}
                                      </div>
                                      <div className="col">
                                        <input
                                          type="text"
                                          className="form-control mt-1"
                                          name="ifscCode"
                                          placeholder="IFSC Code"
                                          value={payrollInfo.ifscCode}
                                          onChange={handleInputChange}
                                          disabled={!isPayrollInfoEditable}
                                        />
                                        {errors.ifscCode && <p style={{ color: "red" }}>{errors.ifscCode}</p>}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-sm-3">
                                  <div className="form-group mt-2 mb-2">
                                    <label>Salary Details<span style={{ color: "red" }}> * </span></label>
                                    <input
                                      type="text"
                                      className="form-control mt-1"
                                      name="salary"
                                      placeholder="Basic Salary"
                                      value={payrollInfo.salary}
                                      onChange={handleInputChange}
                                      disabled={!isPayrollInfoEditable}
                                    />
                                    {errors.salary && <p style={{ color: "red" }}>{errors.salary}</p>}
                                  </div>
                                </div>
                                <div className="col-sm-3">
                                  <div className="form-group mt-2 mb-2">
                                    <label for="Company">1st Month Salary Condition<span style={{ color: "red" }}> * </span></label>
                                    <div className="d-flex align-items-center">
                                      <div className="stepper_radio_custom mr-1">
                                        <select
                                          className="form-select mt-1"
                                          name="firstMonthSalary"
                                          id="firstMonthSalary"
                                          value={payrollInfo.firstMonthSalary}
                                          onChange={handleInputChange}
                                          disabled={!isPayrollInfoEditable}
                                        >
                                          <option value="Select First Month Salary Percentage" selected> Select First Month Salary Percentage</option>
                                          <option value="50">50%</option>
                                          <option value="75">75%</option>
                                          <option value="100">100%</option>
                                        </select>
                                      </div>
                                    </div>
                                    {errors.firstMonthSalary && <p style={{ color: "red" }}>{errors.firstMonthSalary}</p>}
                                  </div>
                                </div>
                                <div className="col-sm-3">
                                  <div className="form-group mt-2 mb-2">
                                    <label>1<sup>st</sup> Month's Salary Calculation</label>
                                    <input
                                      type="text"
                                      className="form-control mt-1"
                                      name="salaryCalculation"
                                      placeholder="Calculated Salary"
                                      value={payrollInfo.salaryCalculation}
                                      onChange={handleInputChange}
                                      disabled
                                    />
                                  </div>
                                </div>
                                <div className="col-sm-3">
                                  <div class="form-group mt-2">
                                    <label class="form-label" for="offerLetter">Offer Letter<span style={{ color: "red" }}> * </span></label>
                                    <input
                                      type="file"
                                      className="form-control mt-1"
                                      name="offerLetter"
                                      id="offerLetter"
                                      onChange={handleFileChange}
                                      disabled={!isPayrollInfoEditable}
                                    />
                                    {errors.offerLetter && <p style={{ color: "red" }}>{errors.offerLetter}</p>}
                                  </div>
                                  {offerLetterDocument.length !== 0 && <div class="uploaded-filename-main d-flex flex-wrap">
                                    <div class="uploaded-fileItem d-flex align-items-center">
                                      <p class="m-0">{offerLetterDocument[0]?.originalname}</p>
                                      <button onClick={(e) => e.preventDefault()} class="fileItem-dlt-btn" disabled=""><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="close-icon">
                                        <path d="M18 6l-12 12"></path><path d="M6 6l12 12"></path></svg>
                                      </button>
                                    </div>
                                  </div>}
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
                                      disabled={!isPayrollInfoEditable}
                                    />
                                    {errors.panNumber && <p style={{ color: "red" }}>{errors.panNumber}</p>}
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
                                      disabled={!isPayrollInfoEditable}
                                    />
                                    {errors.aadharNumber && <p style={{ color: "red" }}>{errors.aadharNumber}</p>}
                                  </div>
                                </div>
                                <div className="col-sm-4">
                                  <div className="form-group mt-2 mb-2">
                                    <label for="UANNumber">UAN  Number
                                      {/* <span style={{ color: "red" }}> * </span> */}
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control mt-1"
                                      name="uanNumber"
                                      id="UANNumber"
                                      placeholder="Universal Account Number for Provident Fund"
                                      value={payrollInfo.uanNumber}
                                      onChange={handleInputChange}
                                      disabled={!isPayrollInfoEditable}
                                    />
                                    {/* {errors.uanNumber && <p style={{ color: "red" }}>{errors.uanNumber}</p>} */}
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
                                      disabled={!isEmergencyInfoEditable}
                                    />
                                    {errors.personName && <p style={{ color: "red" }}>{errors.personName}</p>}
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
                                      disabled={!isEmergencyInfoEditable}
                                    >
                                      <option value="Select Relationship" selected>Select Relationship</option>
                                      <option value="Father">Father</option>
                                      <option value="Mother">Mother</option>
                                      <option value="Spouse">Spouse</option>
                                    </select>
                                    {errors.relationship && <p style={{ color: "red" }}>{errors.relationship}</p>}
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
                                      disabled={!isEmergencyInfoEditable}
                                    />
                                    {errors.personPhoneNo && <p style={{ color: "red" }}>{errors.personPhoneNo}</p>}
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
                                      disabled={!isEmployeeDocsInfoEditable}
                                    />
                                    {errors.aadharCard && <p style={{ color: "red" }}>{errors.aadharCard}</p>}
                                  </div>
                                  {aadharCardDocument.length !== 0 && <div class="uploaded-filename-main d-flex flex-wrap">
                                    <div class="uploaded-fileItem d-flex align-items-center">
                                      <p class="m-0">{aadharCardDocument[0]?.originalname}</p>
                                      <button onClick={(e) => e.preventDefault()} class="fileItem-dlt-btn" disabled=""><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="close-icon">
                                        <path d="M18 6l-12 12"></path><path d="M6 6l12 12"></path></svg>
                                      </button>
                                    </div>
                                  </div>}
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
                                      disabled={!isEmployeeDocsInfoEditable}
                                    />
                                    {errors.panCard && <p style={{ color: "red" }}>{errors.panCard}</p>}
                                  </div>
                                  {panCardDocument.length !== 0 && <div class="uploaded-filename-main d-flex flex-wrap">
                                    <div class="uploaded-fileItem d-flex align-items-center">
                                      <p class="m-0">{panCardDocument[0]?.originalname}</p>
                                      <button onClick={(e) => e.preventDefault()} class="fileItem-dlt-btn" disabled=""><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="close-icon">
                                        <path d="M18 6l-12 12"></path><path d="M6 6l12 12"></path></svg>
                                      </button>
                                    </div>
                                  </div>}
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
                                      disabled={!isEmployeeDocsInfoEditable}
                                    />
                                    {errors.educationCertificate && <p style={{ color: "red" }}>{errors.educationCertificate}</p>}
                                  </div>
                                  {educationCertificateDocument.length !== 0 && <div class="uploaded-filename-main d-flex flex-wrap">
                                    <div class="uploaded-fileItem d-flex align-items-center">
                                      <p class="m-0">{educationCertificateDocument[0]?.originalname}</p>
                                      <button onClick={(e) => e.preventDefault()} class="fileItem-dlt-btn" disabled=""><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="close-icon">
                                        <path d="M18 6l-12 12"></path><path d="M6 6l12 12"></path></svg>
                                      </button>
                                    </div>
                                  </div>}
                                </div>
                                <div className="col-sm-4">
                                  <div class="form-group mt-3">
                                    <label class="form-label" for="relievingCertificate">
                                      Relieving Certificate
                                      {/* <span style={{ color: "red" }}> * </span> */}
                                    </label>
                                    <input
                                      type="file"
                                      className="form-control mt-1"
                                      name="relievingCertificate"
                                      id="relievingCertificate"
                                      onChange={handleFileChange}
                                      disabled={!isEmployeeDocsInfoEditable}
                                    />
                                    {/* {errors.relievingCertificate && <p style={{ color: "red" }}>{errors.relievingCertificate}</p>} */}
                                  </div>
                                  {relievingCertificateDocument.length !== 0 && <div class="uploaded-filename-main d-flex flex-wrap">
                                    <div class="uploaded-fileItem d-flex align-items-center">
                                      <p class="m-0">{relievingCertificateDocument[0]?.originalname}</p>
                                      <button onClick={(e) => e.preventDefault()} class="fileItem-dlt-btn" disabled=""><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="close-icon">
                                        <path d="M18 6l-12 12"></path><path d="M6 6l12 12"></path></svg>
                                      </button>
                                    </div>
                                  </div>}
                                </div>
                                <div className="col-sm-4">
                                  <div class="form-group mt-3">
                                    <label class="form-label" for="salarySlip">
                                      Salary Slip
                                      {/* <span style={{ color: "red" }}> * </span> */}
                                    </label>
                                    <input
                                      type="file"
                                      className="form-control mt-1"
                                      name="salarySlip"
                                      id="salarySlip"
                                      onChange={handleFileChange}
                                      disabled={!isEmployeeDocsInfoEditable}
                                    />
                                    {/* {errors.salarySlip && <p style={{ color: "red" }}>{errors.salarySlip}</p>} */}
                                  </div>
                                  {salarySlipDocument.length !== 0 && <div class="uploaded-filename-main d-flex flex-wrap">
                                    <div class="uploaded-fileItem d-flex align-items-center">
                                      <p class="m-0">{salarySlipDocument[0]?.originalname}</p>
                                      <button onClick={(e) => e.preventDefault()} class="fileItem-dlt-btn" disabled=""><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="close-icon">
                                        <path d="M18 6l-12 12"></path><path d="M6 6l12 12"></path></svg>
                                      </button>
                                    </div>
                                  </div>}
                                </div>
                                <div className="col-sm-4">
                                  <div class="form-group mt-3">
                                    <label class="form-label" for="profilePhoto">Profile Photo</label>
                                    <input
                                      type="file"
                                      className="form-control mt-1"
                                      name="profilePhoto"
                                      id="profilePhoto"
                                      onChange={handleFileChange}
                                      disabled={!isEmployeeDocsInfoEditable}
                                    />
                                    {/* {errors.profilePhoto && <p style={{ color: "red" }}>{errors.profilePhoto}</p>} */}
                                  </div>
                                  {profilePhotoDocument.length !== 0 && <div class="uploaded-filename-main d-flex flex-wrap">
                                    <div class="uploaded-fileItem d-flex align-items-center">
                                      <p class="m-0">{profilePhotoDocument[0]?.originalname}</p>
                                      <button onClick={(e) => e.preventDefault()} class="fileItem-dlt-btn" disabled=""><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="close-icon">
                                        <path d="M18 6l-12 12"></path><path d="M6 6l12 12"></path></svg>
                                      </button>
                                    </div>
                                  </div>}
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
                                      {formatDate(personalInfo.dob) || "-"}
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
                                      {personalInfo.currentAddress || "-"}
                                    </div>
                                  </div>
                                  <div className="col-sm-3 p-0">
                                    <div className="form-label-name">
                                      <b>Permanent Address</b>
                                    </div>
                                  </div>
                                  <div className="col-sm-9 p-0">
                                    <div className="form-label-data">
                                      {personalInfo.permanentAddress || "-"}
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
                                      {formatDate(employeementInfo.joiningDate) || "-"}
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
                                      <b>Name as per Bank Record</b>
                                    </div>
                                  </div>
                                  <div className="col-sm-9 p-0">
                                    <div className="form-label-data">
                                      {payrollInfo.nameAsPerBankRecord || "-"}
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
                                      ₹ {formatSalary(payrollInfo.salary) || 0}
                                    </div>
                                  </div>
                                </div>
                                <div className="row m-0">
                                  <div className="col-sm-3 p-0">
                                    <div className="form-label-name">
                                      <b>First Month Salary Condition</b>
                                    </div>
                                  </div>
                                  <div className="col-sm-9 p-0">
                                    <div className="form-label-data">
                                      {(payrollInfo.firstMonthSalary === "50" && "50%" ||
                                        payrollInfo.firstMonthSalary === "75" && "75%" ||
                                        payrollInfo.firstMonthSalary === "100" && "100%") || "-"
                                      }
                                    </div>
                                  </div>
                                </div>
                                <div className="row m-0">
                                  <div className="col-sm-3 p-0">
                                    <div className="form-label-name">
                                      <b>First Month Calculated Salary</b>
                                    </div>
                                  </div>
                                  <div className="col-sm-9 p-0">
                                    <div className="form-label-data">
                                      ₹ {formatSalary(payrollInfo.salaryCalculation) || 0}
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
                                      {offerLetterDocument[0]?.originalname || "-"}
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
                                      {aadharCardDocument[0]?.originalname || "-"}
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
                                      {panCardDocument[0]?.originalname || "-"}
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
                                      {educationCertificateDocument[0]?.originalname || "-"}
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
                                      {relievingCertificateDocument[0]?.originalname || "-"}
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
                                      {salarySlipDocument[0]?.originalname || "-"}
                                    </div>
                                  </div>
                                </div>
                                <div className="row m-0">
                                  <div className="col-sm-3 p-0">
                                    <div className="form-label-name">
                                      <b>Profile Photo</b>
                                    </div>
                                  </div>
                                  <div className="col-sm-9 p-0">
                                    <div className="form-label-data">
                                      {profilePhotoDocument[0]?.originalname || "-"}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>
                      )}

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
                        {!isLastStep() && <Button
                          onClick={() => handleEdit()}
                          variant="contained"
                          sx={{ mr: 1, background: "#ffba00 " }}
                        >
                          Edit
                        </Button>}

                        {/* Show "Save Draft" on all steps except the last one */}
                        {!isLastStep() && (
                          <Button
                            onClick={() => {
                              saveDraft();
                            }}
                            variant="contained"
                            sx={{ mr: 1, background: "#ffba00 " }}
                          >
                            Save Draft
                          </Button>
                        )}

                        {/* Show "Submit" only on the last step */}
                        {isLastStep() && (
                          <Button
                            onClick={() => {
                              handleComplete();
                            }}
                            variant="contained"
                            sx={{ mr: 1, background: "#ffba00 " }}
                          >
                            Submit
                          </Button>
                        )}

                        {/* Show "Next" button if not on the last step */}
                        {!isLastStep() && (
                          <Button
                            onClick={handleNext}
                            variant="contained"
                            sx={{ mr: 1 }}
                            disabled={(
                              (activeStep === 0 && !isPersonalInfoNext) ||
                              (activeStep === 1 && !isEmployeementInfoNext) ||
                              (activeStep === 2 && !isPayrollInfoNext) ||
                              (activeStep === 3 && !isEmergencyInfoNext) ||
                              (activeStep === 4 && !isDocumentInfoNext)
                            )}
                          >
                            Next
                          </Button>
                        )}
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