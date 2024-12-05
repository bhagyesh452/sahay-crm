import React, { useEffect, useState, useRef } from "react";
import Swal from "sweetalert2";
import Select from "react-select";
import img from "../../static/logo.jpg";
import "../../assets/styles.css";
import axios from "axios";
// import { options } from "../components/Options";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";



function ApplicationForm() {
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const [openBacdrop, setOpenBacdrop] = useState(false);
    const [selectedAppliedFor, setSelectedAppliedFor] = useState("")
    const [employeeData, setemployeeData] = useState({
        empFullName: "",
        personal_email: "",
        personal_number: "",
        appliedFor: "",
        qualification: "",
        experience: "",
        currentCTC: "",
        expectedCTC: "",
        applicationSource: "",
        notes: "",
        uploadedCV: [],
        fillingDate: null,
        fillingTime: "",
        mainCategoryStatus: "",
        subCategoryStatus: "",
        lastActionDate: ""
    });
    // Inside your component
    const fileInputRef = useRef(null);
    // List of available options from the image
    const appliedForOptions = [
        { value: "Business Development Executive", label: "Business Development Executive" },
        { value: "Sales Executive", label: "Sales Executive" },
        { value: "IT Sales Executive", label: "IT Sales Executive" },
        { value: "Graphic Designer", label: "Graphic Designer" },
        { value: "Relationship Manager", label: "Relationship Manager" },
        { value: "SEO Executive", label: "SEO Executive" },
        { value: "Financial Analyst", label: "Financial Analyst" },
        { value: "Content Writer", label: "Content Writer" },
        { value: "Company Secretary", label: "Company Secretary" },
        { value: "Web/FullStack Developer", label: "Web/FullStack Developer" },
        { value: "HR Recruiter", label: "HR Recruiter" },
        { value: "HR Executive / Manager", label: "HR Executive / Manager" },
        { value: "Receptionist", label: "Receptionist" },
        { value: "Peon", label: "Peon" },
        { value: "Business Development Manager", label: "Business Development Manager" },
        { value: "Floor Manager", label: "Floor Manager" },
        { value: "Admin Executive", label: "Admin Executive" },
        { value: "Accountant", label: "Accountant" },
        { value: "Data Analyst", label: "Data Analyst" }
    ];
    const experienceOptions = [
        { value: "Fresher", label: "Fresher" },
        { value: "6 Months - 1 Year", label: "6 Months - 1 Year" },
        { value: "1-2 Years", label: "1-2 Years" },
        { value: "2-3 Years", label: "2-3 Years" },
        { value: "3+ Years", label: "3+ Years" }
    ];

    const applicationSourceOptions = [
        { value: "Apna", label: "Apna" },
        { value: "Shine", label: "Shine" },
        { value: "Workindia", label: "Workindia" },
        { value: "Instagram", label: "Instagram" },
        { value: "Google/Website", label: "Google/Website" },
        { value: "Reference", label: "Reference" },
        { value: "Linkedin", label: "Linkedin" },
        { value: "Job hai", label: "Job hai" },
        { value: "Naukari", label: "Naukari" },
        { value: "Indeed", label: "Indeed" }
    ];

    const handleInputChange = (event) => {
        const { name, value, type, files } = event.target;

        if (type === "file") {
            // If the input type is file, handle the file input separately
            setemployeeData({ ...employeeData, [name]: files });
        } else {
            setemployeeData({ ...employeeData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        // Destructure the fields for easier validation
        const {
            empFullName,
            personal_email,
            personal_number,
            appliedFor,
            qualification,
            experience,
            currentCTC,
            expectedCTC,
            applicationSource,
            notes,
            uploadedCV
        } = employeeData;

        // Check if any of the fields are empty
        if (
            !empFullName ||
            !personal_email ||
            !personal_number ||
            !appliedFor ||
            !qualification ||
            !experience ||
            !currentCTC ||
            !expectedCTC ||
            !applicationSource ||
            uploadedCV.length === 0
        ) {
            // If any field is missing, show an error message
            Swal.fire({
                icon: 'error',
                title: 'Missing Information',
                text: 'Please fill out all required fields and upload your CV.',
            });
            return; // Exit the function if validation fails
        }

        // Create FormData to handle file uploads
        const formDataToSend = new FormData();
        // Get current date and time in ISO format
        const currentDateTime = new Date().toISOString();
        const currentDate = currentDateTime.split('T')[0]; // Extract the date part
        const currentTime = currentDateTime.split('T')[1]; // Extract the time part
        // Append each field to FormData, including fillingDate and fillingTime
        // formDataToSend.append('fillingDate', currentDate); // Add the current date
        // formDataToSend.append('fillingTime', currentTime); // Add the current time
        // Append each field to FormData
        for (let key in employeeData) {
            if (key !== 'uploadedCV') {
                formDataToSend.append(key, employeeData[key]);
            }
        }

        // Append the uploaded CV file(s)
        if (uploadedCV.length > 0) {
            formDataToSend.append('uploadedCV', uploadedCV[0]); // Only one file assumed for CV upload
        }
        // console.log("formatDataToSend", formDataToSend);
        try {
            // Send the form data to your backend using Axios
            setOpenBacdrop(true);
            const response = await axios.post(`${secretKey}/recruiter/application-form/save`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Handle successful response
            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Submitted',
                    text: 'Your application has been submitted successfully!',
                });

                // Reset the form after successful submission
                setemployeeData({
                    empFullName: "",
                    personal_email: "",
                    personal_number: "",
                    appliedFor: "",
                    qualification: "",
                    experience: "",
                    currentCTC: "",
                    expectedCTC: "",
                    applicationSource: "",
                    notes: "",
                    uploadedCV: [],
                    fillingDate: null,
                    fillingTime: "",
                    mainCategoryStatus: "",
                    subCategoryStatus: "",
                    lastActionDate: ""
                });
                // Reset the file input
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
                // Redirect to the Calendly link
                window.location.href = "https://calendly.com/requirement-startupsahay/15min";
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                // Display the specific error message for duplicate entry
                Swal.fire({
                    icon: 'error',
                    title: 'Submission Failed',
                    text: error.response.data.message,
                });
            } else {
                // General error handling
                Swal.fire({
                    icon: 'error',
                    title: 'Submission Failed',
                    text: 'There was an issue submitting the form. Please try again later.',
                });
            }
        } finally {
            setOpenBacdrop(false);
        }
    };


    console.log("employeeData", employeeData)

















    return (
        <div className="basic-information-main">
            {openBacdrop && (
                <Backdrop
                    sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={openBacdrop}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            )}
            <div className="basic-info-page-header">
                <div className="container-xl d-flex align-items-center justify-content-between">
                    <div className="basic-info-logo">
                        <a href="https://www.startupsahay.com" rel="noopener noreferrer">
                            <img src={img} alt="image" />
                        </a>
                    </div>
                    <div className="go-web-btn">
                        <button className="btn btn-md btn-primary">
                            <a
                                href="https://www.startupsahay.com"
                                rel="noopener noreferrer"
                            >
                                Go To Website
                            </a>
                        </button>
                    </div>
                </div>
            </div>
            <div className="basic-info-page-body">
                <div className="basic-info-head">
                    <div className="container-xl">
                        <h1 className="m-0">Job Application Form</h1>
                    </div>
                </div>
                <form className="basic-info-form"
                    onSubmit={handleSubmit}
                >
                    <div className="container-xl">
                        <div className="card mt-2">
                            <div className="card-body p-3" >
                                <div className="row">
                                    <div className="col-lg-4">
                                        <div className="form-group mt-2 mb-2">
                                            <label >
                                                Full Name: <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <input
                                                required
                                                type="text"
                                                className="form-control mt-1"
                                                placeholder="Enter Your Full Name"
                                                id="Company"
                                                value={employeeData.empFullName}
                                                name="empFullName"
                                                onChange={handleInputChange}
                                            />
                                            {/* {formSubmitted && errors.CompanyName && (
                                                <div style={{ color: "red" }}>{errors.CompanyName}</div>
                                            )} */}
                                        </div>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="form-group mt-2 mb-2">
                                            <label >
                                                Email Id: <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <input
                                                required
                                                type="email"
                                                className="form-control mt-1"
                                                placeholder="Enter Your Email Id"
                                                id="Company"
                                                name='personal_email'
                                                value={employeeData.personal_email}
                                                onChange={handleInputChange}
                                            />

                                        </div>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="form-group mt-2 mb-2">
                                            <label >
                                                Contact No: <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <input
                                                required
                                                type="text"
                                                className="form-control mt-1"
                                                placeholder="Enter Your Contact Number"
                                                id="Company"
                                                name="personal_number"
                                                value={employeeData.personal_number}
                                                onChange={(e) => handleInputChange(e, "personal_number")}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="form-group mt-2 mb-2">
                                            <label>
                                                Applied For: <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <select
                                                className="form-select mt-1 ms-2"
                                                name="appliedFor"
                                                value={employeeData.appliedFor}
                                                onChange={handleInputChange}
                                            >
                                                <option selected disabled value="">--Select From Options--</option>
                                                {/* Map options dynamically */}
                                                {appliedForOptions.map((option, index) => (
                                                    <option key={index} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="form-group mt-2 mb-2">
                                            <label>
                                                Qualification: <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <input
                                                required
                                                type="text"
                                                className="form-control mt-1"
                                                placeholder="Enter Your Latest Qualification"
                                                id="Company"
                                                name="qualification"
                                                value={employeeData.qualification}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="form-group mt-2 mb-2">
                                            <label >
                                                Experience: <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <select
                                                className="form-select mt-1 ms-2"
                                                name="experience"
                                                value={employeeData.experience}
                                                onChange={handleInputChange}
                                            >
                                                <option selected disabled value="">--Select From Options--</option>
                                                {/* Map options dynamically */}
                                                {experienceOptions.map((option, index) => (
                                                    <option key={index} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="form-group mt-2 mb-2">
                                            <label htmlFor="Company">
                                                Current CTC: <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <input
                                                required
                                                type="text"
                                                className="form-control mt-1"
                                                placeholder="Enter Curent CTC"
                                                id="Company"
                                                name="currentCTC"
                                                value={employeeData.currentCTC}
                                                onChange={handleInputChange}
                                            />
                                            {/* {formSubmitted && errors.CompanyName && (
                                                <div style={{ color: "red" }}>{errors.CompanyName}</div>
                                            )} */}
                                        </div>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="form-group mt-2 mb-2">
                                            <label htmlFor="Company">
                                                Expected CTC: <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <input
                                                required
                                                type="text"
                                                className="form-control mt-1"
                                                placeholder="Enter Expected CTC"
                                                id="Company"
                                                name="expectedCTC"
                                                value={employeeData.expectedCTC}
                                                onChange={handleInputChange}
                                            />
                                            {/* {formSubmitted && errors.CompanyName && (
                                                <div style={{ color: "red" }}>{errors.CompanyName}</div>
                                            )} */}
                                        </div>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="form-group mt-2 mb-2">
                                            <label htmlFor="Company">
                                                Where Did You Hear About Us? <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <select
                                                className="form-select mt-1 ms-2"
                                                name="applicationSource"
                                                value={employeeData.applicationSource}
                                                onChange={handleInputChange}
                                            >
                                                <option selected disabled value="">--Select From Options--</option>
                                                {/* Map options dynamically */}
                                                {applicationSourceOptions.map((option, index) => (
                                                    <option key={index} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="form-group mt-2 mb-2">
                                            <label htmlFor="Company">
                                                Notes: <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <textarea
                                                required
                                                className="form-control mt-1"
                                                placeholder="Enter Any Notes"
                                                id="Brief"
                                                name='notes'
                                                onChange={handleInputChange}
                                                value={employeeData.notes}
                                            ></textarea>
                                            {/* {formSubmitted && errors.CompanyName && (
                                                <div style={{ color: "red" }}>{errors.CompanyName}</div>
                                            )} */}
                                        </div>
                                    </div>
                                    <div className="form-group mt-2 mb-2">
                                        <label>Upload CV <span style={{ color: "red" }}>*</span></label>
                                        <input
                                            required
                                            type="file"
                                            className="form-control mt-1"
                                            id="Company"
                                            name="uploadedCV"  // Ensure the name matches the form state
                                            onChange={handleInputChange}
                                            res={fileInputRef}
                                        />
                                        {employeeData.uploadedCV && employeeData.uploadedCV.length > 0 && (
                                            <small className="form-text text-muted mt-2">
                                                Selected File: {employeeData.uploadedCV[0].name}
                                            </small>
                                        )}
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-12 text-center">
                                            <button
                                                type="submit"
                                                onClick={handleSubmit}
                                                className="btn btn-primary btn-ms mt-4 mb-4"
                                                style={{ width: "100px" }}
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

        </div>

    )
}

export default ApplicationForm