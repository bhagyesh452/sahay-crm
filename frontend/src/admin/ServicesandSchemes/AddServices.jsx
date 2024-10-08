import React, { useState, useEffect } from 'react';
import axios from "axios";
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Swal from "sweetalert2";
import Select from "react-select";
import 'quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css"; // Import default styles
import { height } from '@mui/system';

function AddServices({ close, fetchServices }) {

    const secretKey = process.env.REACT_APP_SECRET_KEY;

    const steps = ['Step-1', 'Step-2', 'Step-3', 'Step-4', ' Step-5'];

    let modules = {
        toolbar: [
            [{ size: ["small", false, "large", "huge"] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            [
                { list: "ordered" },
                { list: "bullet" },
                { indent: "-1" },
                { indent: "+1" },
                { align: [] }
            ],
            [{ "color": ["#000000", "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff", "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff", "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff", "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2", "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466", 'custom-color'] }],
        ]
    };

    let formats = [
        "header", "height", "bold", "italic",
        "underline", "strike", "blockquote",
        "list", "color", "bullet", "indent",
        "link", "image", "align", "size",
    ];

    const [isDepartmentInfoNext, setIsDepartmentInfoNext] = useState(false);
    const [isObjectivesInfoNext, setIsObjectivesInfoNext] = useState(false);
    const [isRequirementsInfoNext, setIsRequirementsInfoNext] = useState(false);
    const [isProcessInfoNext, setIsProcessInfoNext] = useState(false);
    const [isTeamInfoNext, setIsTeamInfoNext] = useState(false);

    const [isDepartmentInfoEditable, setIsDepartmentInfoEditable] = useState(true);
    const [isObjectivesInfoEditable, setIsObjectivesInfoEditable] = useState(false);
    const [isRequirementsInfoEditable, setIsRequirementsInfoEditable] = useState(false);
    const [isProcessInfoEditable, setIsProcessInfoEditable] = useState(false);
    const [isTeamInfoEditable, setIsTeamInfoEditable] = useState(true);

    const [activeStep, setActiveStep] = useState(0);
    const [completed, setCompleted] = useState({});
    const [errors, setErrors] = useState({});

    const [departments, setDepartments] = useState([]);
    const [services, setServices] = useState([]);
    const [isServiceDisabled, setIsServiceDisabled] = useState(true);
    const [employees, setEmployees] = useState([]);
    const [id, setId] = useState("");

    const [departmentInfo, setDepartmentInfo] = useState({
        departmentName: "",
        serviceName: "",
    });
    // useEffect(() => {
    //     setDepartmentInfo({
    //         departmentName: departmentName || "",
    //         serviceName: serviceName || "",
    //     });
    // }, [departmentName, serviceName]);

    const validateDepartmentInfo = () => {
        const newErrors = {};
        const { departmentName, serviceName } = departmentInfo;

        if (!departmentName) newErrors.departmentName = "Please select Service category";
        if (!serviceName) newErrors.serviceName = "Please select Service name";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const [objectivesInfo, setObjectivesInfo] = useState({
        objectives: "",
        benefits: "",
    });
    // const validateObjectivesInfo = () => {
    //     const newErrors = {};
    //     const { objectives, benefits } = departmentInfo;

    //     if (!objectives) newErrors.objectives = "Objective is required";
    //     if (!benefits) newErrors.benefits = "Benefits is required";

    //     setErrors(newErrors);
    //     return Object.keys(newErrors).length === 0;
    // };

    const [requirementsInfo, setRequirementsInfo] = useState({
        requiredDocuments: "",
        eligibilityRequirements: ""
    });
    // const validateRequirementsInfo = () => {
    //     const newErrors = {};
    //     const { requiredDocuments, eligibilityRequirements } = departmentInfo;

    //     if (!requiredDocuments) newErrors.requiredDocuments = "Required documnets are required";
    //     if (!eligibilityRequirements) newErrors.eligibilityRequirements = "Eligibility is required";

    //     setErrors(newErrors);
    //     return Object.keys(newErrors).length === 0;
    // };

    const [processInfo, setProcessInfo] = useState({
        process: "",
        deliverables: "",
        timeline: ""
    });
    // const validateProcessInfo = () => {
    //     const newErrors = {};
    //     const { process, deliverables, timeline } = departmentInfo;

    //     if (!process) newErrors.process = "Process is required";
    //     if (!deliverables) newErrors.deliverables = "Deliverables is required";
    //     if (!timeline) newErrors.timeline = "Timeline is required";

    //     setErrors(newErrors);
    //     return Object.keys(newErrors).length === 0;
    // };

    const [teamInfo, setTeamInfo] = useState({
        employeeName: [],
        headName: [],
        portfolio: [],
        document: []
    });
    const [documentArray, setDocumentArray] = useState([]);

    const validateTeamInfo = () => {
        const newErrors = {};
        const { employeeName, headName, portfolio, document } = teamInfo;

        if (!employeeName || employeeName.length === 0) newErrors.employeeName = "Employee name is required";
        if (!headName || headName.length === 0) newErrors.headName = "Head name is required";
        // if (!portfolio || portfolio.length === 0) newErrors.portfolio = "Portfolio is required";
        // if (!document || document.length === 0) newErrors.document = "Document is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const fetchDepartments = async () => {
        try {
            const res = await axios.get(`${secretKey}/department/fetchDepartments`);
            const data = res.data.data;
            const uniqueDepartments = [...new Set(data.map((item) => item.departmentName))];
            setDepartments(uniqueDepartments);
            // console.log("Fetched departments are :", uniqueDepartments);
        } catch (error) {
            console.log("Error fetching departments :", error);
        }
    };

    // Fetch services based on selected department
    const fetchServicesByDepartment = async (departmentName) => {
        try {
            const res = await axios.get(`${secretKey}/department/fetchServicesByDepartment`, {
                params: { departmentName }
            });
            // console.log("Fetched services are :", res.data.data);
            setServices(res.data.data);
            setIsServiceDisabled(false); // Enable the service dropdown
        } catch (error) {
            console.log("Error fetching services:", error);
        }
    };

    // Handle department selection
    const handleDepartmentChange = (e) => {
        const selectedDepartment = e.target.value;
        handleInputChange(e); // Update department in state
        if (selectedDepartment !== "Select Department") {
            fetchServicesByDepartment(selectedDepartment); // Fetch services for the selected department
        } else {
            setIsServiceDisabled(true); // Disable the service dropdown if no department is selected
            setServices([]); // Clear services when no department is selected
        }
    };

    const fetchEmployees = async () => {
        try {
            const res = await axios.get(`${secretKey}/employee/einfo`);
            // console.log("Fetched employees are :", res.data);
            const formattedEmployees = res.data.map(employee => ({
                label: employee.empFullName,
                value: employee.empFullName
            }));
            setEmployees(formattedEmployees);
        } catch (error) {
            console.log("Error fetching employees :", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDepartmentInfo(prevState => ({
            ...prevState,
            [name]: value
        }));

        // Clear error for this field
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: ""
        }));
    };

    const handleTextEditorChange = (name, value) => {
        setObjectivesInfo(prevState => ({
            ...prevState,
            [name]: value
        }));

        setRequirementsInfo(prevState => ({
            ...prevState,
            [name]: value
        }));

        setProcessInfo(prevState => ({
            ...prevState,
            [name]: value
        }));

        // Clear error for this field
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: ""
        }));
    };

    const handleSelectChange = (selectedOptions, actionMeta) => {
        const name = actionMeta.name;
        const value = selectedOptions.map(option => option.value); // Extract selected values

        setTeamInfo(prevState => ({
            ...prevState,
            [name]: value
        }));

        // Clear error for this field
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: ""
        }));
    };

    const handlePortfolioChange = (tags) => {
        setTeamInfo(prevState => ({
            ...prevState,
            portfolio: tags  // Update portfolio as an array of tags
        }));

        // Clear error for portfolio
        setErrors((prevErrors) => ({
            ...prevErrors,
            portfolio: ""
        }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        const newFiles = Array.from(files);

        // console.log("Files are :", newFiles);

        // Validate files
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        const maxSizeMB = 24;
        const maxSizeBytes = maxSizeMB * 1024 * 1024;

        for (let file of newFiles) {
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
        }

        // Update the state with new files
        setTeamInfo(prevState => ({
            ...prevState,
            [name]: [...prevState[name], ...newFiles] // Append new files to the existing array
        }));

        // Clear error for this field
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: ""
        }));
    };

    const totalSteps = () => steps.length;

    const completedSteps = () => Object.keys(completed).length;

    const isLastStep = () => activeStep === totalSteps() - 1;

    const allStepsCompleted = () => completedSteps() === totalSteps();

    const handleNext = async () => {
        if (activeStep === 0 && validateDepartmentInfo()) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            setIsDepartmentInfoNext(true);
        } else if (activeStep === 1) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            setIsObjectivesInfoNext(true);
        } else if (activeStep === 2) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            setIsRequirementsInfoNext(true);
        } else if (activeStep === 3) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            setIsProcessInfoNext(true);
        } else if (activeStep === 4 && validateTeamInfo()) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            setIsTeamInfoNext(true);
        }
    };

    const handleBack = () => {
        if (activeStep === 0) {
            close();
        } else {
            setActiveStep((prevActiveStep) => prevActiveStep - 1);
        }
    };

    const handleStep = (step) => () => {
        setActiveStep(step);
    };

    const handleReset = async () => {
        setActiveStep(0);

        setDepartmentInfo({
            departmentName: "",
            serviceName: "",
        });

        setObjectivesInfo({
            objectives: "",
            benefits: "",
        });

        setRequirementsInfo({
            requiredDocuments: "",
            eligibilityRequirements: ""
        });

        setProcessInfo({
            process: "",
            deliverables: "",
            timeline: ""
        });

        setTeamInfo({
            employeeName: [],
            headName: [],
            portfolio: [],
            document: []
        });

        setCompleted({});
        if (id) {
            try {
                const res = await axios.delete(`${secretKey}/serviceDraft/deleteServiceDraft/${id}`);
                // console.log("Service successfully deleted", res.data.data);
                setId("");
                setIsDepartmentInfoEditable(true);
                setIsObjectivesInfoEditable(false);
                setIsRequirementsInfoEditable(false);
                setIsProcessInfoEditable(false);
                setIsTeamInfoEditable(true);
            } catch (error) {
                console.log("Error deleting services :", error);
            }
        }
    };

    const saveDraft = async () => {
        let res;

        if (departmentInfo.departmentName === "" || departmentInfo.serviceName === "") {
            Swal.fire("error", "Please select Service Category or Service Name before Saving", "error");
        } else {
            const requestBody = {
                ...(
                    activeStep === 0 ? departmentInfo :
                        activeStep === 1 ? objectivesInfo :
                            activeStep === 2 ? requirementsInfo :
                                activeStep === 3 ? processInfo :
                                    teamInfo
                ),
                activeStep
            };

            const url = `${secretKey}/serviceDraft/${!id ? 'saveServiceDraft' : `updateServiceDraft/${id}`}`;

            try {
                if (!id) {
                    res = await axios.post(url, requestBody);
                    // console.log(`Service created successfully at step-${activeStep}:`, res.data);
                } else {
                    res = await axios.put(url, requestBody, {
                        headers: activeStep === 4 ? { 'Content-Type': 'multipart/form-data' } : {}
                    });
                    // console.log(`Services updated successfully at step-${activeStep}:`, res.data);
                }

                // console.log(`Service ${!id ? 'created' : 'updated'} successfully at step-${activeStep}:`, res.data);

                setCompleted((prevCompleted) => ({
                    ...prevCompleted,
                    [activeStep]: true
                }));

                if (activeStep === 0) {
                    setIsDepartmentInfoEditable(false);
                    setIsDepartmentInfoNext(true);
                } else if (activeStep === 1) {
                    setIsObjectivesInfoEditable(true);
                    setIsObjectivesInfoNext(true);
                } else if (activeStep === 2) {
                    setIsRequirementsInfoEditable(true);
                    setIsRequirementsInfoNext(true);
                } else if (activeStep === 3) {
                    setIsProcessInfoEditable(true);
                    setIsProcessInfoNext(true);
                } else if (activeStep === 4) {
                    setIsTeamInfoEditable(false);
                    setIsTeamInfoNext(true);
                }
            } catch (error) {
                console.log(`Error ${!id ? 'creating' : 'updating'} employee at step-${activeStep}:`, error);
            }
        }
    };

    const handleComplete = async () => {
        // console.log("Department info before sending :", departmentInfo);
        // console.log("Objectives info before sending :", objectivesInfo);
        // console.log("Requirements info before sending :", requirementsInfo);
        // console.log("Process info before sending :", processInfo);
        // console.log("Team info before sending :", teamInfo);

        if (validateTeamInfo()) {
            try {
                // Create a FormData object
                const formData = new FormData();

                // Append text data to FormData
                formData.append('departmentInfo', JSON.stringify(departmentInfo));
                formData.append('objectivesInfo', JSON.stringify(objectivesInfo));
                formData.append('requirementsInfo', JSON.stringify(requirementsInfo));
                formData.append('processInfo', JSON.stringify(processInfo));
                formData.append('teamInfo', JSON.stringify(teamInfo));
                formData.append('id', id);

                // Append files (assuming file inputs are available in the document)
                const documentInput = document.getElementById('document');
                if (documentInput && documentInput.files) {
                    const files = documentInput.files;
                    for (let i = 0; i < files.length; i++) {
                        formData.append('document', files[i]);
                    }
                }

                // Make the POST request with FormData
                const res1 = await axios.post(`${secretKey}/services/addServices/${id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                // console.log("Created service is :", res1.data);
                Swal.fire("success", "Service details created successfully!", "success");
                close();
                fetchServices();

                // If creation is successful, delete from draft
                if (res1.status === 200) {
                    const res2 = await axios.delete(`${secretKey}/serviceDraft/deleteServiceDraft/${id}`);
                    // console.log("Service successfully deleted from draft model :", res2.data);
                }
            } catch (error) {
                console.log("Error creating service details:", error);
                Swal.fire("error", "Error creating service service details", "error");
            }
        }
    };

    const fetchService = async () => {
        try {
            const res = await axios.get(`${secretKey}/serviceDraft/fetchServiceDraft`);
            const data = res.data.data[0];
            // console.log("Fetched service is :", data);
            setId(data._id);

            setDepartmentInfo({
                departmentName: data.departmentName || "",
                serviceName: data.serviceName || ""
            });

            setObjectivesInfo({
                objectives: data.objectives || "",
                benefits: data.benefits || ""
            });

            setRequirementsInfo({
                requiredDocuments: data.requiredDocuments || "",
                eligibilityRequirements: data.eligibilityRequirements || ""
            });

            setProcessInfo({
                process: data.process || "",
                deliverables: data.deliverables || "",
                timeline: data.timeline || ""
            });

            setTeamInfo({
                employeeName: [],
                headName: [],
                portfolio: data.portfolio,
                document: data.documents
            });

            setDocumentArray(data.documents ? data.documents : []);
            // console.log("Document is :", data.documents);
        } catch (error) {
            console.log("Error fetching employee", error);
        }
    };

    useEffect(() => {
        fetchService();
    }, [activeStep]);

    useEffect(() => {
        fetchDepartments();
        fetchEmployees();
    }, []);

    return (
        <>
            <div className="container mt-2">
                <div className="card">
                    <div className="card-body p-3">
                        <Box sx={{ width: '100%' }}>
                            {/* <Stepper nonLinear activeStep={activeStep}>
                                {steps.map((label, index) => (
                                    <Step key={label} completed={completed[index]}>
                                        <StepButton color="inherit" onClick={handleStep(index)} className={
                                            activeStep === index ? "form-tab-active" : "No-active"
                                        }>
                                            {label}
                                        </StepButton>
                                    </Step>
                                ))}
                            </Stepper> */}

                            {/* Here this will not move to next step untill data is not saved for current step and not clicked on next button */}
                            <Stepper nonLinear activeStep={activeStep}>
                                {steps.map((label, index) => (
                                    <Step key={label} completed={completed[index]}>
                                        <StepButton
                                            color="inherit"
                                            onClick={handleStep(index)}
                                            className={activeStep === index ? "form-tab-active" : "No-active"}
                                            disabled={!completed[index] && index !== activeStep}
                                        >
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
                                                            Step:1 - Department and Service
                                                        </h2>
                                                        <div className="steprForm-inner">
                                                            <form>
                                                                <div className="row">
                                                                    <div className="col-sm-6">
                                                                        <div className="form-group mt-2 mb-2">
                                                                            <label for="departmentName">Service Category<span style={{ color: "red" }}> * </span></label>
                                                                            <select
                                                                                className="form-select mt-1"
                                                                                name="departmentName"
                                                                                id="departmentName"
                                                                                value={departmentInfo.departmentName}
                                                                                onChange={handleDepartmentChange}
                                                                            disabled={!isDepartmentInfoEditable}
                                                                            >
                                                                                <option value="Select Service Category" selected> Select Service Category</option>
                                                                                {departments.map((department, index) => (
                                                                                    <option key={index} value={department}>{department}</option>
                                                                                ))}
                                                                            </select>
                                                                            {/* <input
                                                                                type="text"
                                                                                value={departmentInfo.departmentName}
                                                                                className="form-control"
                                                                                placeholder="Enter Department Name"
                                                                                required
                                                                                onChange={(e) => handleInputChange(e)}
                                                                            /> */}
                                                                            {errors.departmentName && <p style={{ color: "red" }}>{errors.departmentName}</p>}
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-sm-6">
                                                                        <div className="form-group mt-2 mb-2">
                                                                            <label for="serviceName">Select Service<span style={{ color: "red" }}> * </span></label>
                                                                            <select
                                                                                className="form-select mt-1"
                                                                                name="serviceName"
                                                                                id="serviceName"
                                                                                value={departmentInfo.serviceName}
                                                                                onChange={(e) => handleInputChange(e)}
                                                                                disabled={isServiceDisabled || !isDepartmentInfoEditable}
                                                                            >
                                                                                <option value="">Select Service</option>
                                                                                {services.map((service, index) => (
                                                                                    <option key={index} value={service.serviceName}>{service.serviceName}</option>
                                                                                ))}
                                                                            </select>
                                                                            {/* <input
                                                                                type="text"
                                                                                value={departmentInfo.serviceName}
                                                                                className="form-control"
                                                                                placeholder="Enter Service Name"
                                                                                required
                                                                                onChange={(e) => handleInputChange(e)}
                                                                            /> */}
                                                                            {errors.serviceName && <p style={{ color: "red" }}>{errors.serviceName}</p>}
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
                                                    <div className="step-1">
                                                        <h2 className="text-center">
                                                            Step:2 - Objectives and Benefits
                                                        </h2>
                                                        <div className="steprForm-inner" style={{ height: "340px" }}>
                                                            <form>
                                                                <div className="row">
                                                                    <div className="col-sm-6">
                                                                        <div className="form-group mt-0 mb-0">
                                                                            <h3>Objectives</h3>
                                                                            <ReactQuill
                                                                                theme="snow"
                                                                                modules={modules}
                                                                                formats={formats}
                                                                                placeholder="write your content ...."
                                                                                value={objectivesInfo.objectives}
                                                                                onChange={(value) => handleTextEditorChange("objectives", value)}
                                                                                style={{ height: "200px" }}
                                                                                readOnly={isObjectivesInfoEditable}
                                                                            >
                                                                            </ReactQuill>
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-sm-6">
                                                                        <div className="form-group mt-0 mb-0">
                                                                            <h3>Benefits</h3>
                                                                            <ReactQuill
                                                                                theme="snow"
                                                                                modules={modules}
                                                                                formats={formats}
                                                                                placeholder="write your content ...."
                                                                                value={objectivesInfo.benefits}
                                                                                onChange={(value) => handleTextEditorChange("benefits", value)}
                                                                                style={{ height: "200px" }}
                                                                                readOnly={isObjectivesInfoEditable}
                                                                            >
                                                                            </ReactQuill>
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
                                                    <div className="step-1">
                                                        <h2 className="text-center">
                                                            Step:3 - Required Documents and Eligibility Requirements
                                                        </h2>
                                                        <div className="steprForm-inner" style={{ height: "340px" }}>
                                                            <form>
                                                                <div className="row">
                                                                    <div className="col-sm-6">
                                                                        <div className="form-group mt-0 mb-0">
                                                                            <h3>Required Documents</h3>
                                                                            <ReactQuill
                                                                                theme="snow"
                                                                                modules={modules}
                                                                                formats={formats}
                                                                                placeholder="write your content ...."
                                                                                value={requirementsInfo.requiredDocuments}
                                                                                onChange={(value) => handleTextEditorChange("requiredDocuments", value)}
                                                                                style={{ height: "200px" }}
                                                                                readOnly={isRequirementsInfoEditable}
                                                                            >
                                                                            </ReactQuill>
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-sm-6">
                                                                        <div className="form-group mt-0 mb-0">
                                                                            <h3>Eligibility Requirements</h3>
                                                                            <ReactQuill
                                                                                theme="snow"
                                                                                modules={modules}
                                                                                formats={formats}
                                                                                placeholder="write your content ...."
                                                                                value={requirementsInfo.eligibilityRequirements}
                                                                                onChange={(value) => handleTextEditorChange("eligibilityRequirements", value)}
                                                                                style={{ height: "200px" }}
                                                                                readOnly={isRequirementsInfoEditable}
                                                                            >
                                                                            </ReactQuill>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </>
                                            )}

                                            {activeStep === 3 && (
                                                <>
                                                    <div className="step-1">
                                                        <h2 className="text-center">
                                                            Step:4 - Process, Deliverables and Timeline
                                                        </h2>
                                                        <div className="steprForm-inner" style={{ height: "340px" }}>
                                                            <form>
                                                                <div className="row">
                                                                    <div className="col-sm-4">
                                                                        <div className="form-group mt-0 mb-0">
                                                                            <h3>Process</h3>
                                                                            <ReactQuill
                                                                                theme="snow"
                                                                                modules={modules}
                                                                                formats={formats}
                                                                                placeholder="write your content ...."
                                                                                value={processInfo.process}
                                                                                onChange={(value) => handleTextEditorChange("process", value)}
                                                                                style={{ height: "200px" }}
                                                                                readOnly={isProcessInfoEditable}
                                                                            >
                                                                            </ReactQuill>
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-sm-4">
                                                                        <div className="form-group mt-0 mb-0">
                                                                            <h3>Deliverables</h3>
                                                                            <ReactQuill
                                                                                theme="snow"
                                                                                modules={modules}
                                                                                formats={formats}
                                                                                placeholder="write your content ...."
                                                                                value={processInfo.deliverables}
                                                                                onChange={(value) => handleTextEditorChange("deliverables", value)}
                                                                                style={{ height: "200px" }}
                                                                                readOnly={isProcessInfoEditable}
                                                                            >
                                                                            </ReactQuill>
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-sm-4">
                                                                        <div className="form-group mt-0 mb-0">
                                                                            <h3>Timeline</h3>
                                                                            <ReactQuill
                                                                                theme="snow"
                                                                                modules={modules}
                                                                                formats={formats}
                                                                                placeholder="write your content ...."
                                                                                value={processInfo.timeline}
                                                                                onChange={(value) => handleTextEditorChange("timeline", value)}
                                                                                style={{ height: "200px" }}
                                                                                readOnly={isProcessInfoEditable}
                                                                            >
                                                                            </ReactQuill>
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
                                                    <div className="step-1">
                                                        <h2 className="text-center">
                                                            Step:5 - Concerned Team, Portfolio and Documents
                                                        </h2>
                                                        <div className="steprForm-inner">
                                                            <form>
                                                                <div className="row">
                                                                    <div className="col-sm-6">
                                                                        <div className="form-group mt-2 mb-2">
                                                                            <label for="employeeName">Select Concern Person for Sales and Marketing<span style={{ color: "red" }}> * </span></label>
                                                                            <Select
                                                                                className="mt-1"
                                                                                isMulti
                                                                                name="employeeName"  // Make sure to set the correct name
                                                                                options={employees}  // Pass the formatted employees data as options
                                                                                id="employeesName"
                                                                                placeholder="Select Concern Person for Sales and Marketing"
                                                                                value={employees.filter(employee => teamInfo.employeeName.includes(employee.value))} // Filter based on selected values
                                                                                onChange={handleSelectChange}
                                                                                disabled={!isTeamInfoEditable}
                                                                            />
                                                                            {errors.employeeName && <p style={{ color: "red" }}>{errors.employeeName}</p>}
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-sm-6">
                                                                        <div className="form-group mt-2 mb-2">
                                                                            <label for="headName">Select Concern Person for Backend Process<span style={{ color: "red" }}> * </span></label>
                                                                            <Select
                                                                                className="mt-1"
                                                                                isMulti
                                                                                name="headName"  // Make sure to set the correct name
                                                                                options={employees}  // Pass the formatted employees data as options
                                                                                id="headName"
                                                                                placeholder="Select Concern Person for Backend Process"
                                                                                value={employees.filter(employee => teamInfo.headName.includes(employee.value))} // Filter based on selected values
                                                                                onChange={handleSelectChange}
                                                                                disabled={!isTeamInfoEditable}
                                                                            />
                                                                            {errors.headName && <p style={{ color: "red" }}>{errors.headName}</p>}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="row">
                                                                    {/* <div className="col-sm-6">
                                                                        <div className="form-group">
                                                                            <label for="portfolio">Portfolio<span style={{ color: "red" }}> * </span></label>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control mt-1"
                                                                                name="portfolio"
                                                                                id="portfolio"
                                                                                placeholder="Enter portfolio link"
                                                                                value={teamInfo.portfolio}
                                                                                onChange={(e) => handleInputChange(e)}
                                                                            />
                                                                            {errors.portfolio && <p style={{ color: "red" }}>{errors.portfolio}</p>}
                                                                        </div>
                                                                    </div> */}

                                                                    <div className="col-sm-6">
                                                                        <div className="form-group">
                                                                            <label htmlFor="portfolio">Portfolio</label>
                                                                            <TagsInput
                                                                                className="multivalue-input mt-1"
                                                                                value={teamInfo.portfolio || []}
                                                                                onChange={handlePortfolioChange}
                                                                                inputProps={{
                                                                                    placeholder: "Enter links"
                                                                                }}
                                                                                disabled={!isTeamInfoEditable}
                                                                            />
                                                                            {/* {errors.portfolio && <p style={{ color: "red" }}>{errors.portfolio}</p>} */}
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-sm-6">
                                                                        <div class="form-group">
                                                                            <label htmlFor="document">Document</label>
                                                                            <input
                                                                                type="file"
                                                                                className="form-control mt-1"
                                                                                name="document"
                                                                                id="document"
                                                                                onChange={handleFileChange}
                                                                                multiple // Allow multiple file selection
                                                                                disabled={!isTeamInfoEditable}
                                                                            />
                                                                            {/* {errors.document && <p style={{ color: "red" }}>{errors.document}</p>} */}
                                                                        </div>
                                                                        {/* {documentArray.length !== 0 && <div class="uploaded-filename-main d-flex flex-wrap">
                                                                            <div class="uploaded-fileItem d-flex align-items-center">
                                                                                <p class="m-0">{documentArray[0]?.originalname}</p>
                                                                                <button onClick={(e) => e.preventDefault()} class="fileItem-dlt-btn" disabled=""><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="close-icon">
                                                                                    <path d="M18 6l-12 12"></path><path d="M6 6l12 12"></path></svg>
                                                                                </button>
                                                                            </div>
                                                                        </div>} */}
                                                                        {teamInfo.document.length > 0 && (
                                                                            <div className="uploaded-filename-main d-flex flex-wrap">
                                                                                {teamInfo.document.map((file, index) => (
                                                                                    <div key={index} className="uploaded-fileItem d-flex align-items-center">
                                                                                        <p className="m-0">{file.name}</p> {/* Display the selected file name */}
                                                                                        <button
                                                                                            onClick={(e) => {
                                                                                                e.preventDefault(); // Prevent default form submission
                                                                                                setTeamInfo(prevState => ({
                                                                                                    ...prevState,
                                                                                                    document: prevState.document.filter((_, i) => i !== index) // Remove file at the given index
                                                                                                }));
                                                                                            }}
                                                                                            className="fileItem-dlt-btn"
                                                                                        >
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="close-icon">
                                                                                                <path d="M18 6l-12 12"></path>
                                                                                                <path d="M6 6l12 12"></path>
                                                                                            </svg>
                                                                                        </button>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </>
                                            )}

                                            {/* {activeStep === 5 && (
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
                                                                        Department Information
                                                                    </h3>
                                                                </div>
                                                            </div>
                                                            <div className="servicesFormCard mt-3">
                                                                <div className="row m-0">
                                                                    <div className="col-sm-3 p-0">
                                                                        <div className="form-label-name">
                                                                            <b>Department Name</b>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-sm-9 p-0">
                                                                        <div className="form-label-data">
                                                                            {departmentInfo.departmentName || "-"}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="row m-0">
                                                                    <div className="col-sm-3 p-0">
                                                                        <div className="form-label-name">
                                                                            <b>Service Name</b>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-sm-9 p-0">
                                                                        <div className="form-label-data">
                                                                            {departmentInfo.serviceName || "-"}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="stepTWOPreview">
                                                            <div className="d-flex align-items-center mt-3">
                                                                <div className="services_No">2</div>
                                                                <div className="ml-1">
                                                                    <h3 className="m-0">Objectives Information</h3>
                                                                </div>
                                                            </div>
                                                            <div className="servicesFormCard mt-3">
                                                                <div className="row m-0">
                                                                    <div className="col-sm-3 p-0">
                                                                        <div className="form-label-name">
                                                                            <b>Objectives</b>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-sm-9 p-0">
                                                                        <div className="form-label-data">
                                                                            {objectivesInfo.objectives
                                                                                ? <div dangerouslySetInnerHTML={{ __html: objectivesInfo.objectives }} />
                                                                                : "-"
                                                                            }
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                                <div className="row m-0">
                                                                    <div className="col-sm-3 p-0">
                                                                        <div className="form-label-name">
                                                                            <b>Benefits</b>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-sm-9 p-0">
                                                                        <div className="form-label-data">
                                                                            {objectivesInfo.benefits
                                                                                ? <div dangerouslySetInnerHTML={{ __html: objectivesInfo.benefits }} />
                                                                                : "-"
                                                                            }
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
                                                                        Requirements Information
                                                                    </h3>
                                                                </div>
                                                            </div>
                                                            <div className="servicesFormCard mt-3">
                                                                <div className="row m-0">
                                                                    <div className="col-sm-3 p-0">
                                                                        <div className="form-label-name">
                                                                            <b>Required Documents</b>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-sm-9 p-0">
                                                                        <div className="form-label-data">
                                                                            {requirementsInfo.requiredDocuments
                                                                                ? <div dangerouslySetInnerHTML={{ __html: requirementsInfo.requiredDocuments }} />
                                                                                : "-"
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="row m-0">
                                                                    <div className="col-sm-3 p-0">
                                                                        <div className="form-label-name">
                                                                            <b>Eligibility Requirements</b>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-sm-9 p-0">
                                                                        <div className="form-label-data">
                                                                            {requirementsInfo.requiredDocuments
                                                                                ? <div dangerouslySetInnerHTML={{ __html: requirementsInfo.requiredDocuments }} />
                                                                                : "-"
                                                                            }
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
                                                                        Process Information
                                                                    </h3>
                                                                </div>
                                                            </div>
                                                            <div className="servicesFormCard mt-3">
                                                                <div className="row m-0">
                                                                    <div className="col-sm-3 p-0">
                                                                        <div className="form-label-name">
                                                                            <b>Process</b>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-sm-9 p-0">
                                                                        <div className="form-label-data">
                                                                            {processInfo.process
                                                                                ? <div dangerouslySetInnerHTML={{ __html: processInfo.process }} />
                                                                                : "-"
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="row m-0">
                                                                    <div className="col-sm-3 p-0">
                                                                        <div className="form-label-name">
                                                                            <b>Deliverables</b>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-sm-9 p-0">
                                                                        <div className="form-label-data">
                                                                            {processInfo.deliverables
                                                                                ? <div dangerouslySetInnerHTML={{ __html: processInfo.deliverables }} />
                                                                                : "-"
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="row m-0">
                                                                    <div className="col-sm-3 p-0">
                                                                        <div className="form-label-name">
                                                                            <b>Timeline</b>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-sm-9 p-0">
                                                                        <div className="form-label-data">
                                                                            {processInfo.timeline
                                                                                ? <div dangerouslySetInnerHTML={{ __html: processInfo.timeline }} />
                                                                                : "-"
                                                                            }
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
                                                                        Team Information
                                                                    </h3>
                                                                </div>
                                                            </div>
                                                            <div className="servicesFormCard mt-3">
                                                                <div className="row m-0">
                                                                    <div className="col-sm-3 p-0">
                                                                        <div className="form-label-name">
                                                                            <b>{teamInfo.employeeName.length > 1 ? "Employees Name" : "Employee Name"}</b>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-sm-9 p-0">
                                                                        <div className="form-label-data">
                                                                            {teamInfo.employeeName.length > 0
                                                                                ? teamInfo.employeeName.map(id => {
                                                                                    const selectedEmployee = employees.find(emp => emp.value === id);
                                                                                    return selectedEmployee ? selectedEmployee.label : '';  // Assuming the employee name is stored in `label`
                                                                                }).filter(name => name).join(', ')
                                                                                : "-"
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="row m-0">
                                                                    <div className="col-sm-3 p-0">
                                                                        <div className="form-label-name">
                                                                            <b>Head Name</b>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-sm-9 p-0">
                                                                        <div className="form-label-data">
                                                                            {teamInfo.headName.length > 0
                                                                                ? teamInfo.headName.map(id => {
                                                                                    const selectedEmployee = employees.find(emp => emp.value === id);
                                                                                    return selectedEmployee ? selectedEmployee.label : '';  // Assuming the employee name is stored in `label`
                                                                                }).filter(name => name).join(', ')
                                                                                : "-"
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="row m-0">
                                                                    <div className="col-sm-3 p-0">
                                                                        <div className="form-label-name">
                                                                            <b>Portfolio</b>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-sm-9 p-0">
                                                                        <div className="form-label-data">
                                                                            {teamInfo.portfolio || "-"}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="row m-0">
                                                                    <div className="col-sm-3 p-0">
                                                                        <div className="form-label-name">
                                                                            <b>Document</b>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-sm-9 p-0">
                                                                        <div className="form-label-data">
                                                                            {teamInfo.document.name || "-"}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            )} */}

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
                                                    sx={{ mr: 1, background: "#ffba00 " }}
                                                    onClick={handleReset}
                                                >
                                                    Reset
                                                </Button>

                                                <Box sx={{ flex: "1 1 auto" }} />
                                                {completed[activeStep] && activeStep !== totalSteps() - 1 && (
                                                    <Button
                                                        onClick={() => {
                                                            activeStep === 0 && setIsDepartmentInfoEditable(true);
                                                            activeStep === 1 && setIsObjectivesInfoEditable(false);
                                                            activeStep === 2 && setIsRequirementsInfoEditable(false);
                                                            activeStep === 3 && setIsProcessInfoEditable(false);
                                                            activeStep === 4 && setIsTeamInfoEditable(true);
                                                            setCompleted((prevCompleted) => ({
                                                                ...prevCompleted,
                                                                [activeStep]: false,
                                                            }));
                                                        }}
                                                        variant="contained" sx={{ mr: 1, background: "#ffba00 " }}>
                                                        Edit
                                                    </Button>
                                                )}

                                                {/* Show "Save Draft" on all steps except the last one */}
                                                {!isLastStep() && (
                                                    <Button onClick={() => saveDraft()} variant="contained" sx={{ mr: 1, background: "#ffba00 " }}>
                                                        Save Draft
                                                    </Button>
                                                )}

                                                {/* Show "Submit" only on the last step */}
                                                {isLastStep() && (
                                                    <Button onClick={() => handleComplete()} variant="contained" sx={{ mr: 1, background: "#ffba00 " }}>
                                                        Submit
                                                    </Button>
                                                )}

                                                {/* Show "Next" button if not on the last step */}
                                                {!isLastStep() && (
                                                    <Button onClick={handleNext} variant="contained" sx={{ mr: 1 }}
                                                        disabled={(
                                                            (activeStep === 0 && !isDepartmentInfoNext) ||
                                                            (activeStep === 1 && !isObjectivesInfoNext) ||
                                                            (activeStep === 2 && !isRequirementsInfoNext) ||
                                                            (activeStep === 3 && !isProcessInfoNext) ||
                                                            (activeStep === 4 && !isTeamInfoNext)
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
        </>
    )
}

export default AddServices