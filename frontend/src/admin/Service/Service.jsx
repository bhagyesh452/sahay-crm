import React, { useState, useEffect } from 'react';
import Header from '../Header';
import Navbar from '../Navbar';
import Nodata from '../../components/Nodata';
import ClipLoader from 'react-spinners/ClipLoader';
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { IconButton } from '@mui/material';
import { IconTrash } from '@tabler/icons-react';
import { IconEye, IconPlus } from '@tabler/icons-react';
import CloseIcon from "@mui/icons-material/Close";
import { Button, Dialog, DialogContent, DialogTitle, DialogActions } from "@mui/material";
import { Tooltip } from '@mui/material';
import Swal from 'sweetalert2';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import axios from 'axios';
import Select from "react-select";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";
import "react-quill/dist/quill.snow.css";
import EmployeeAssetDetailss from '../../employeeComp/EmployeeAssetDetailss';

function Service() {

    const secretKey = process.env.REACT_APP_SECRET_KEY;

    const AntSwitch = styled(Switch)(({ theme }) => ({
        width: 28,
        height: 16,
        padding: 0,
        display: 'flex',
        '&:active': {
            '& .MuiSwitch-thumb': {
                width: 15,
            },
            '& .MuiSwitch-switchBase.Mui-checked': {
                transform: 'translateX(9px)',
            },
        },
        '& .MuiSwitch-switchBase': {
            padding: 2,
            '&.Mui-checked': {
                transform: 'translateX(12px)',
                color: '#fff',
                '& + .MuiSwitch-track': {
                    opacity: 1,
                    backgroundColor: theme.palette.mode === 'dark' ? '#177ddc' : '#1890ff',
                },
            },
        },
        '& .MuiSwitch-thumb': {
            boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
            width: 12,
            height: 12,
            borderRadius: 6,
            transition: theme.transitions.create(['width'], {
                duration: 200,
            }),
        },
        '& .MuiSwitch-track': {
            borderRadius: 16 / 2,
            opacity: 1,
            backgroundColor:
                theme.palette.mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
            boxSizing: 'border-box',
        },
    }));

    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [showAddDepartment, setShowAddDepartment] = useState(false);
    const [showEditDepartment, setShowEditDepartment] = useState(false);

    const [showAddService, setShowAddService] = useState(false);
    const [showEditService, setShowEditService] = useState(false);

    const [showUpdationOptions, setShowUpdateOptions] = useState(false);

    const [showAddServiceDetails, setShowAddServiceDetails] = useState(false);
    const [showEditServiceDetails, setShowEditServiceDetails] = useState(false);
    const [showServiceDetails, setShowServiceDetails] = useState(false);

    const [departments, setDepartments] = useState([]);
    const [serviceDetails, setServiceDetails] = useState(null);

    const [departmentName, setDepartmentName] = useState("");
    const [updatedDepartmentName, setUpdatedDepartmentName] = useState("");

    const [serviceName, setServiceName] = useState("");
    const [updatedServiceName, setUpdatedServiceName] = useState("");

    const [serviceDescription, setServiceDescription] = useState("");
    const [updatedServiceDescription, setUpdatedServiceDescription] = useState("");

    const [departmentErrorMessage, setDepartmentErrorMessage] = useState("");
    const [sericeErrorMessage, setServiceErrorMessage] = useState("");
    const [descriptionErrorMessage, setDescriptionErrorMessage] = useState("");

    const [serviceId, setServiceId] = useState("");
    const [departmentColors, setDepartmentColors] = useState({});


    const handleCloseAddDepartment = () => {
        setShowAddDepartment(false);
        setShowEditDepartment(false);
        setShowEditService(false);
        setDepartmentErrorMessage("");
        setServiceErrorMessage("");
        setDescriptionErrorMessage("");
        setDepartmentName("");
        setUpdatedDepartmentName("");
        setServiceName("");
        setUpdatedServiceName("");
        setServiceDescription("");
        setUpdatedServiceDescription("");
    };

    const handleCloseAddService = () => {
        setShowAddService(false);
        setShowEditService(false);
        setShowEditDepartment(false);
        setDepartmentErrorMessage("");
        setServiceErrorMessage("");
        setDescriptionErrorMessage("");
        setDepartmentName("");
        setUpdatedDepartmentName("");
        setServiceName("");
        setUpdatedServiceName("");
        setServiceDescription("");
        setUpdatedServiceDescription("");
    };

    const handleCloseUpdateOptions = () => {
        setShowUpdateOptions(false);
    };


    const handleCloseShowServiceDetails = () => {
        setShowServiceDetails(false);
        setDepartmentName("");
        setServiceName("");
        setServiceDescription("");
        setServiceId("");
    }


    const predefinedColors = [
        "#007bff", // Blue
        "#28a745", // Green
        "#17a2b8", // Teal
        "#ffc107", // Yellow
        "#dc3545", // Red
        "#6f42c1", // Purple
        "#fd7e14", // Orange
        "#20c997", // Cyan
    ];


    const fetchServices = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get(`${secretKey}/service/getallservices`);
            const data = res.data.data;

            console.log("Fetched services:", data);

            // Extract unique departments and assign colors
            const uniqueDepartments = [...new Set(data.map(service => service.departmentName))];
            const colors = {};
            uniqueDepartments.forEach((department, index) => {
                colors[department] = predefinedColors[index % predefinedColors.length];
            });

            setDepartmentColors(colors);
            setServices(data);
        } catch (error) {
            console.log("Error fetching services:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchDepartments = async () => {
        try {
            const res = await axios.get(`${secretKey}/departments/getDepartments`);
            const data = res.data.data;
            console.log("data---->", data);
            setDepartments(data);
        } catch (error) {
            console.log("Error fetching departments :", error);
        }
    }

    const handleSubmit = async () => {
        try {
            let hasError = false;

            // Validate department name
            // if ((showAddDepartment || showAddService) && departmentName.trim().length === 0) {
            //     showAddDepartment ? setDepartmentErrorMessage("Please enter department name") : setDepartmentErrorMessage("Please select department name");
            //     hasError = true;
            // } else {
            //     setDepartmentErrorMessage("");
            // }


            if ((showAddDepartment || showAddService) && departmentName.trim().length === 0) {
                showAddDepartment ? setDepartmentErrorMessage("Please enter department name") : setDepartmentErrorMessage("Please select department name");
                hasError = true;
            } else {
                setDepartmentErrorMessage("");
            }

            // Validate department name
            // if (showAddDepartment && departmentName.trim().length === 0) {
            //     setDepartmentErrorMessage("Please enter department name");
            //     hasError = true;
            // } else {
            //     setDepartmentErrorMessage("");
            // }

            // Validate service name and description only if adding a service
            if (showAddService && serviceName.trim().length === 0) {
                setServiceErrorMessage("Please enter service name");
                hasError = true;
            } else {
                setServiceErrorMessage("");
            }

            if (showAddService && serviceDescription.trim().length === 0) {
                setDescriptionErrorMessage("Please enter service description");
                hasError = true;
            } else {
                setDescriptionErrorMessage("");
            }

            // If any errors were found, do not proceed
            if (hasError) return;

            if (showAddDepartment) {
                const payload = {
                    departmentName: departmentName,
                    // serviceName: showAddService ? serviceName : "",  
                    // serviceDescription: showAddService ? serviceDescription : "" 
                };

                // const res = await axios.post(`${secretKey}/department/addDepartment`, payload);
                // console.log("Department successfully created :", res.data.data);

                const res = await axios.post(`${secretKey}/departments/addDepartment`, payload);
                console.log("Department successfully added :", res.data.data);

                // if (showAddDepartment) {
                Swal.fire("success", "Department Successfully Created", "success");
                // } else {
                // Swal.fire("success", "Service Successfully Created", "success");
                // }
                fetchDepartments();
                setShowAddDepartment(false);
                // setShowAddService(false);
                setDepartmentName("");
                // setServiceName("");
                // setServiceDescription("");
                fetchServices();
            }
            else {
                const payload = {
                    departmentName: departmentName,
                    serviceName: serviceName,
                    serviceDescription: serviceDescription
                };

                const res = await axios.post(`${secretKey}/service/addservice`, payload);
                console.log("Services successfully added :", res.data.data);

                Swal.fire("success", "Department Successfully Created", "success");

                setShowAddService(false);
                setDepartmentName("");
                setServiceName("");
                setServiceDescription("");
                fetchServices();
            }

        } catch (error) {
            if (showAddDepartment) {
                Swal.fire("error", "Error creating department", "error");
            } else {
                Swal.fire("error", "Error creating service", "error");
            }
            console.log("Error creating department:", error);
        }
    };

    const handleUpdateDepartment = async () => {
        // console.log("Updating department");
        try {
            const encodedDepartmentName = encodeURIComponent(departmentName);
            const res = await axios.put(`${secretKey}/department/updateDepartmentInDepartmentModel/${encodedDepartmentName}`, {
                updatedDepartmentName: updatedDepartmentName
            });
            const res2 = await axios.put(`${secretKey}/services/updateDepartmentInServiceModel/${encodedDepartmentName}`, {
                updatedDepartmentName: updatedDepartmentName
            });
            // console.log("Department updated in department model :", res.data);
            // console.log("Department updated in service model :", res2.data);
            Swal.fire("success", "Department Successfully Updated", "success");
            setUpdatedDepartmentName("");
            setDepartmentName("");
            fetchServices();
            setShowAddDepartment(false);
            setShowEditDepartment(false);
            setShowEditService(false);
        } catch (error) {
            console.log("Error updating department :", error);
            Swal.fire("error", "Error updating department", "error");
        }
    };

    const handleUpdateService = async () => {
        // console.log("Updating service");
        try {
            const encodedServiceName = encodeURIComponent(serviceName);
            const res = await axios.put(`${secretKey}/department/updateServiceInDepartmentModel/${encodedServiceName}`, {
                updatedDepartmentName: updatedDepartmentName,
                updatedServiceName: updatedServiceName,
                updatedServiceDescription: updatedServiceDescription
            });
            const res2 = await axios.put(`${secretKey}/services/updateServiceInServiceModel/${encodedServiceName}`, {
                updatedDepartmentName: updatedDepartmentName,
                updatedServiceName: updatedServiceName
            });
            // console.log("Service updated in department model :", res.data);
            // console.log("Service updated in service model :", res2.data);
            Swal.fire("success", "Service Successfully Updated", "success");
            setUpdatedDepartmentName("");
            setDepartmentName("");
            setUpdatedServiceName("");
            setServiceName("");
            setUpdatedServiceDescription("");
            setServiceDescription("");
            fetchServices();
            setShowAddService(false);
            setShowEditService(false);
            setShowEditDepartment(false);
        } catch (error) {
            console.log("Error updating service :", error);
            Swal.fire("error", "Error updating service", "error");
        }
    };

    const handleDeleteService = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You want to delete this service",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.delete(`${secretKey}/service/delete/${id}`);
                    Swal.fire("success", "Service Successfully Deleted", "success");
                    fetchServices();
                } catch (error) {
                    console.log("Error deleting service:", error);
                    Swal.fire("error", "Error deleting service", "error");
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire("Cancelled", "Service data is safe :)", "error");
            }
        });
    };

    const handleToggleChange = async (serviceName) => {
        try {
            // Fetch the current status of hideService for the selected service
            const res = await axios.get(`${secretKey}/department/fetchService/${serviceName}`);
            const currentHideServiceStatus = res.data.data.hideService;

            // Toggle the hideService value
            const updatedHideService = !currentHideServiceStatus;

            // Update the hideService status in the database
            const updateRes = await axios.put(`${secretKey}/department/updateServiceHideStatus/${serviceName}`, {
                hideService: updatedHideService,
            });
            fetchServices();
            if (updatedHideService) {
                Swal.fire("success", "Service successfully hidden", "success");
            } else {
                Swal.fire("success", "Service successfully shown", "success");   
            }

            if (updateRes.data.result) {
                // console.log("Service hide status updated successfully");
                // Optionally, you can update the local state to reflect changes in the UI
            }
        } catch (error) {
            console.error("Error updating hideService status:", error);
            Swal.fire("Error", "Error hiding services", "error");
        }
    };

    useEffect(() => {
        fetchServices();
        fetchDepartments();
    }, []);



    //show more service handling

    const [step, setStep] = useState(0);
    const [fields, setFields] = useState([{ heading: "", details: "" }]);
    const [teamInfo, setTeamInfo] = useState({
        salesMarketingPersons: [],
        backendPersons: [],
        portfolio: [],
        documents: [],
    });
    const [employees, setEmployees] = useState([]);
    const [addOption, setAddOption] = useState(false);
    const [editOption, setEditOption] = useState(false);
    const [errors, setErrors] = useState({});
    
    // Step 1 Validation
    const validateStep1 = () => {
        const newErrors = {};
        fields.forEach((field, index) => {
            if (!field.heading.trim()) {
                newErrors[`heading_${index}`] = `Heading is required`;
            }
            if (!field.details.trim()) {
                newErrors[`details_${index}`] = `Details are required`;
            }
        });
        setErrors(newErrors); // Update the errors state
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    // Step 2 Validation
    const validateStep2 = () => {
        const newErrors = {};

        // Check if Sales & Marketing persons are empty
        if (teamInfo.salesMarketingPersons.length === 0) {
            newErrors.salesMarketingPersons = "At least one Sales & Marketing person is required";
        }

        // Check if Backend persons are empty
        if (teamInfo.backendPersons.length === 0) {
            newErrors.backendPersons = "At least one Backend person is required";
        }

        // Check if Portfolio links are empty
        if (teamInfo.portfolio.length === 0) {
            newErrors.portfolio = "Portfolio links are required";
        }

        // Check if Documents are empty
        if (teamInfo.documents.length === 0) {
            newErrors.documents = "At least one document is required";
        }

        setErrors(newErrors); // Update the errors state
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };



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



    // const handleNext = () => setStep((prev) => Math.min(prev + 1, 1));
    const handleNext = () => {
        if (step === 0 && !validateStep1()) return; // Validate Step 1
        setStep((prev) => Math.min(prev + 1, 2)); // Move to the next step
    };
    const handleBack = () => setStep((prev) => Math.max(prev - 1, 0));

    const fetchEmployees = async () => {
        try {
            const res = await axios.get(`${secretKey}/employee/einfo`);
            const formattedEmployees = res.data.map(employee => ({
                label: employee.empFullName,
                value: employee.empFullName
            }));
            setEmployees(formattedEmployees);
        } catch (error) {
            console.log("Error fetching employees:", error);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleFieldChange = (index, field, value) => {
        const updatedFields = [...fields];
        updatedFields[index][field] = value;
        setFields(updatedFields);
    };

    const addField = () => setFields([...fields, { heading: "", details: "" }]);
    const deleteField = (index) => setFields(fields.filter((_, i) => i !== index));

    const handlePortfolioChange = (newTags) =>
        setTeamInfo((prev) => ({ ...prev, portfolio: newTags }));

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);
        setTeamInfo((prev) => ({
            ...prev,
            documents: [...prev.documents, ...newFiles],
        }));
    };

    const handleDocumentRemove = (indexToRemove) => {
        setTeamInfo((prev) => ({
            ...prev,
            documents: prev.documents.filter((_, index) => index !== indexToRemove),
        }));
    };

    // const openDocument = (id, filename) => {
    //     const url = `${secretKey}/service/fetchServiceDocuments/${id}/${filename}`;
    //     window.open(url, "_blank"); // Open document in a new tab
    // };


    const handleSubmit1 = async () => {

        if (step === 1 && !validateStep2()) return; // Validate Step 2

        const formData = new FormData();
        formData.append("detailsPart", JSON.stringify(fields)); // Convert array to string
        // formData.append("teamInfo", JSON.stringify(teamInfo)); // Convert object to string
        formData.append("teamInfo", JSON.stringify({
            ...teamInfo,
            salesMarketingPersons: teamInfo.salesMarketingPersons.map(person => person.value), // Extract only the value field
            backendPersons: teamInfo.backendPersons.map(person => person.value), // Extract only the value field
            documents: teamInfo.documents.filter((doc) => typeof doc === "string"), // Send only paths (no File objects)
        }));

        if (teamInfo.documents.length > 0) {
            teamInfo.documents.forEach((file) => {
                formData.append("documents", file); // Append the actual File object
            });
        }

        try {
            const response = await axios.put(
                `${secretKey}/service/addmoreservices/${serviceId}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data", // Ensure multipart/form-data
                    },
                }
            );

            if (editOption) {
                Swal.fire("success", "Services Successfully Updated", "success");
            } else {
                Swal.fire("success", "Service Successfully Created", "success");
            }


            // Reset the state after submission
            setFields([{ heading: "", details: "" }]);
            setTeamInfo({
                salesMarketingPersons: [],
                backendPersons: [],
                portfolio: [],
                documents: [],
            });
            setServiceId("");
            setStep(0);
            // setshowmoreservicedetails(false);
            setAddOption(false);
            setEditOption(false);
        } catch (error) {
            console.error("Error updating service:", error);
            Swal.fire("Error", "Error in updating services", "error");
        }
    };

    const handleCheckAddOrEdit = async (id) => {
        try {
            const response = await axios.get(`${secretKey}/service/getspecificservice/${id}`);
            const { data } = response;

            console.log("data--->", response);
            setServiceId(id);

            // Check if the teamInfo and detailsPart are not empty
            if (data.result && data.service.teamInfo && data.service.detailsPart) {
                const isTeamInfoNotEmpty = data.service.teamInfo.salesMarketingPersons.length > 0 ||
                    data.service.teamInfo.backendPersons.length > 0 ||
                    data.service.teamInfo.portfolio.length > 0 ||
                    data.service.teamInfo.documents.length > 0;

                const isDetailsPartNotEmpty = data.service.detailsPart.length > 0;

                // Set state based on whether the teamInfo and detailsPart are not empty
                if (isTeamInfoNotEmpty && isDetailsPartNotEmpty) {

                    try {
                        console.log("serviceId in edit option", serviceId);
                        // Fetch data from the backend for the selected service ID
                        const response = await axios.get(`${secretKey}/service/getspecificservice/${id}`);
                        const { data } = response;

                        console.log("data11--->", data.service.teamInfo.salesMarketingPersons);
                        console.log("data.service.teamInfo.documents",data.service.teamInfo.documents)


                        if (data.result && data.service && data.service.teamInfo && data.service.detailsPart) {
                            // Populate fields and teamInfo with the fetched data
                            setFields(data.service.detailsPart || [{ heading: "", details: "" }]);
                            setTeamInfo({
                                // salesMarketingPersons: data.service.teamInfo.salesMarketingPersons || [],
                                // backendPersons: data.service.teamInfo.backendPersons || [],
                                salesMarketingPersons: (data.service.teamInfo.salesMarketingPersons || []).map(person => ({
                                    label: person,
                                    value: person,
                                })),
                                backendPersons: (data.service.teamInfo.backendPersons || []).map(person => ({
                                    label: person,
                                    value: person,
                                })),
                                portfolio: data.service.teamInfo.portfolio || [],
                                documents: data.service.teamInfo.documents || [],
                            });
                        }
                        else {
                            // Reset fields and teamInfo if no data exists
                            setFields([{ heading: "", details: "" }]);
                            setTeamInfo({
                                salesMarketingPersons: [],
                                backendPersons: [],
                                portfolio: [],
                                documents: [],
                            });
                        }

                        // Open the dialog box
                        setEditOption(true); 
                        // setshowmoreservicedetails(true);
                        // setServiceId(id);
                    } catch (error) {
                        console.error("Error fetching service data:", error);
                        // alert("Failed to fetch service data. Please try again.");
                    }
                } 
                else {
                    setFields([{ heading: "", details: "" }]);
                    setAddOption(true); // Set Add Option if both are not empty
                }
            }
        } catch (error) {
            console.error("Error fetching service:", error);
        }
    };

    // console.log("Team info data :", teamInfo.salesMarketingPersons);

    const handlecloseeditservice = () => {
        setFields([{ heading: "", details: "" }]);
        setTeamInfo({
            salesMarketingPersons: [],
            backendPersons: [],
            portfolio: [],
            documents: [],
        });
        setServiceId("");
        setStep(0);
        setEditOption(false);
    }

    const handlecloseaddservice = () => {
        setFields([{ heading: "", details: "" }]);
        setTeamInfo({
            salesMarketingPersons: [],
            backendPersons: [],
            portfolio: [],
            documents: [],
        });
        setServiceId("");
        setStep(0);
        setErrors({});
        setAddOption(false);
    }



    return (
        <div>
            {!showServiceDetails &&
                <div className="page-wrapper">

                    <div className="page-header">
                        <div className="container-xl">
                            <div className='d-flex align-items-center justify-content-between'>
                                <div className="dashboard-title"  >
                                    <h2 className="m-0">
                                        {/* Schemes and Services */}
                                        Services
                                    </h2>
                                </div>
                                <div className="d-flex align-items-center">
                                    <div className="filter-booking mr-1 d-flex align-items-center">
                                        <div className='d-flex align-items-center justify-content-between'>
                                            <div className='form-group'>
                                                <button
                                                    className="btn action-btn-primary"
                                                    onClick={() => setShowAddDepartment(true)}
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="icon"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        stroke-width="2"
                                                        stroke="currentColor"
                                                        fill="none"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                    >
                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                        <path d="M12 5l0 14" />
                                                        <path d="M5 12l14 0" />
                                                    </svg>
                                                    Add Department
                                                </button>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="page-body">
                        <div className="container">
                            <div className="row">
                                {isLoading ? (
                                    <div className="col-12 text-center">
                                        <ClipLoader
                                            color="lightgrey"
                                            size={30}
                                            aria-label="Loading Spinner"
                                            data-testid="loader"
                                        />
                                    </div>
                                ) : services.length !== 0 ? (
                                    <>
                                        {services.map((service, index) => (
                                            <div key={index} className="col-md-3 mb-4">
                                                <div
                                                    className="card h-100 border-0"
                                                    style={{
                                                        borderRadius: "18px",
                                                        transition: "transform 0.2s ease-in-out",
                                                        cursor: "pointer",
                                                        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)"
                                                    }}
                                                    onMouseEnter={(e) =>
                                                        (e.currentTarget.style.transform = "scale(1.03)")
                                                    }
                                                    onMouseLeave={(e) =>
                                                        (e.currentTarget.style.transform = "scale(1)")
                                                    }
                                                >
                                                    <div className="card-body">
                                                        <span
                                                            className="badge mb-2"
                                                            style={{
                                                                backgroundColor: departmentColors[service.departmentName] || "#6c757d", // Default color
                                                                fontSize: "12px",
                                                                fontWeight: "500",
                                                                borderRadius: "8px",
                                                                color: "#fff",
                                                            }}
                                                        >
                                                            {service.departmentName}
                                                        </span>

                                                        <h5
                                                            className="card-title"
                                                            style={{
                                                                fontWeight: "600",
                                                                fontSize: "16px",
                                                                color: "#333",
                                                            }}
                                                        >
                                                            {service.serviceName || "Need to Add Service"}
                                                        </h5>

                                                        <Tooltip
                                                            title={
                                                                <div
                                                                    style={{
                                                                        maxWidth: "250px",
                                                                        padding: "8px",
                                                                        fontSize: "14px",
                                                                        lineHeight: "1.5",
                                                                        color: "#fff",
                                                                        backgroundColor: "#1e1e2d",
                                                                        borderRadius: "8px",
                                                                        // boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
                                                                    }}
                                                                >
                                                                    {service.serviceDescription || "No details available"}
                                                                </div>
                                                            }
                                                            arrow
                                                            placement="top"
                                                            componentsProps={{
                                                                tooltip: {
                                                                    sx: {
                                                                        p: 0, // Remove default padding as custom padding is applied
                                                                    },
                                                                },
                                                                arrow: {
                                                                    sx: {
                                                                        color: "#1e1e2d",
                                                                    },
                                                                },
                                                            }}
                                                        >
                                                            <p
                                                                className="card-text text-muted"
                                                                style={{
                                                                    display: "-webkit-box",
                                                                    WebkitBoxOrient: "vertical",
                                                                    WebkitLineClamp: 2,
                                                                    overflow: "hidden",
                                                                    cursor: "pointer",
                                                                    margin: "0",
                                                                    fontSize: "14px",
                                                                }}
                                                            >
                                                                {service.serviceDescription || "No details available"}
                                                            </p>
                                                        </Tooltip>
                                                    </div>
                                                    <div
                                                        className="card-footer d-flex justify-content-between align-items-center"
                                                        style={{
                                                            backgroundColor: "#f8f9fa",
                                                            borderTop: "none",
                                                            padding: "10px 15px",
                                                            borderRadius: "0 0 12px 12px",
                                                        }}
                                                    >
                                                        <AntSwitch
                                                            checked={service.hideService}
                                                            onChange={() =>
                                                                handleToggleChange(service.serviceName)
                                                            }
                                                            inputProps={{ "aria-label": "ant design" }}
                                                        />
                                                        <div className="d-flex align-items-center">
                                                            <IconButton
                                                                onClick={() => {
                                                                    setShowServiceDetails(true);
                                                                    setDepartmentName(service.departmentName);
                                                                    setServiceName(service.serviceName);
                                                                    setServiceId(service._id);
                                                                }}
                                                            >
                                                                <IconEye
                                                                    style={{
                                                                        color: "#d6a10c",
                                                                        width: "20px",
                                                                        height: "20px",
                                                                    }}
                                                                />
                                                            </IconButton>
                                                            <IconButton
                                                                onClick={() => {                                                                  
                                                                    setServiceId(service._id);
                                                                    handleCheckAddOrEdit(service._id);
                                                                }}
                                                            >
                                                                <ModeEditIcon
                                                                    style={{
                                                                        color: "#6c757d",
                                                                        width: "20px",
                                                                        height: "20px",
                                                                    }}
                                                                />
                                                            </IconButton>
                                                            <IconButton
                                                                onClick={() =>
                                                                    handleDeleteService(service._id)
                                                                }
                                                            >
                                                                <IconTrash
                                                                    style={{
                                                                        color: "#dc3545",
                                                                        width: "20px",
                                                                        height: "20px",
                                                                    }}
                                                                />
                                                            </IconButton>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="col-md-3 mb-4">
                                            <div
                                                className="card h-100 d-flex justify-content-center align-items-center border-0 "
                                                style={{
                                                    background: "#f9f9f9",
                                                    border: "2px dashed #ddd",
                                                    cursor: "pointer",
                                                    borderRadius: "18px",
                                                    transition: "background-color 0.2s",
                                                    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)"
                                                }}
                                                onClick={() => setShowAddService(true)}
                                                onMouseEnter={(e) =>
                                                    (e.currentTarget.style.backgroundColor = "#f1f1f1")
                                                }
                                                onMouseLeave={(e) =>
                                                    (e.currentTarget.style.backgroundColor = "#f9f9f9")
                                                }
                                            >
                                                <div className="text-center">
                                                    <IconPlus
                                                        style={{ width: "50px", height: "50px", color: "#007bff" }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="col-md-3 mb-4">
                                        <div
                                            className="card h-100 d-flex justify-content-center align-items-center border-0 "
                                            style={{
                                                background: "#f9f9f9",
                                                border: "2px dashed #ddd",
                                                cursor: "pointer",
                                                borderRadius: "18px",
                                                transition: "background-color 0.2s",
                                                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)"
                                            }}
                                            onClick={() => setShowAddService(true)}
                                            onMouseEnter={(e) =>
                                                (e.currentTarget.style.backgroundColor = "#f1f1f1")
                                            }
                                            onMouseLeave={(e) =>
                                                (e.currentTarget.style.backgroundColor = "#f9f9f9")
                                            }
                                        >
                                            <div className="text-center">
                                                <IconPlus
                                                    style={{ width: "50px", height: "50px", color: "#007bff" }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            }

            {/* Dialog box to add department */}
            <Dialog
                className='My_Mat_Dialog'
                open={showAddDepartment}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    {showEditDepartment ? "Edit Service Category" : "Add Service Category"}
                    <IconButton onClick={handleCloseAddDepartment} style={{ float: "right" }}>
                        <CloseIcon color="primary" />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-body">
                                <div className="row">
                                    <div className='d-flex'>
                                        <div className="mb-3 col-12">
                                            <div className="d-flex">
                                                <label className="form-label">Service Department</label>
                                            </div>
                                            <input
                                                type="text"
                                                value={showEditDepartment ? updatedDepartmentName : departmentName}
                                                className="form-control"
                                                placeholder="Enter Service Category"
                                                required
                                                onChange={(e) => {
                                                    if (showEditDepartment) {
                                                        setUpdatedDepartmentName(e.target.value);
                                                        setDepartmentErrorMessage("");
                                                    } else {
                                                        setDepartmentName(e.target.value);
                                                        setDepartmentErrorMessage("");
                                                    }
                                                }}
                                            />
                                            {departmentErrorMessage && <p className="text-danger">{departmentErrorMessage}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
                <Button
                    className="btn btn-primary bdr-radius-none"
                    onClick={showEditDepartment ? handleUpdateDepartment : handleSubmit}
                    variant="contained"
                >
                    {showEditDepartment ? "Update" : "Submit"}
                </Button>
            </Dialog>

            {/* Dialog box to add service */}
            <Dialog
                className='My_Mat_Dialog'
                open={showAddService}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    {showEditService ? "Edit Service" : "Add Service"}
                    <IconButton onClick={handleCloseAddService} style={{ float: "right" }}>
                        <CloseIcon color="primary" />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-body">
                                <div className="row">
                                    <div className='d-flex'>
                                        <div className="mb-3 col-6">
                                            <div className="d-flex">
                                                <label className="form-label">Service Department</label>
                                            </div>
                                            <select
                                                className="form-select"
                                                value={showEditService ? updatedDepartmentName : departmentName}
                                                onChange={(e) => {
                                                    if (showEditService) {
                                                        setUpdatedDepartmentName(e.target.value);
                                                        setDepartmentErrorMessage("");
                                                    } else {
                                                        setDepartmentName(e.target.value);
                                                        setDepartmentErrorMessage("");
                                                    }
                                                }}
                                            >
                                                <option value="" disabled>Select Service Category</option>
                                                {departments.map((dept, index) => (
                                                    <option key={index} value={dept}>
                                                        {dept}
                                                    </option>
                                                ))}
                                            </select>
                                            {departmentErrorMessage && <p className="text-danger">{departmentErrorMessage}</p>}
                                        </div>

                                        <div className="mb-3 col-6 mx-1">
                                            <label className="form-label">Service Name</label>
                                            <input
                                                type="text"
                                                value={showEditService ? updatedServiceName : serviceName}
                                                className="form-control"
                                                placeholder="Enter Service Name"
                                                required
                                                onChange={(e) => {
                                                    if (showEditService) {
                                                        setUpdatedServiceName(e.target.value);
                                                        setServiceErrorMessage("");
                                                    } else {
                                                        setServiceName(e.target.value);
                                                        setServiceErrorMessage("");
                                                    }
                                                }}
                                            />
                                            {sericeErrorMessage && <p className="text-danger">{sericeErrorMessage}</p>}
                                        </div>

                                    </div>
                                    <div className="row">
                                        <div className="mb-3 col-12">
                                            <label className="form-label">Service Description</label>
                                            <textarea
                                                name="serviceDescription"
                                                value={showEditService ? updatedServiceDescription : serviceDescription}
                                                className="form-control"
                                                required
                                                onChange={(e) => {
                                                    if (showEditService) {
                                                        setUpdatedServiceDescription(e.target.value);
                                                        setDescriptionErrorMessage("");
                                                    } else {
                                                        setServiceDescription(e.target.value);
                                                        setDescriptionErrorMessage("");
                                                    }
                                                }}
                                            />
                                            {descriptionErrorMessage && <p className="text-danger">{descriptionErrorMessage}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
                <Button
                    className="btn btn-primary bdr-radius-none"
                    onClick={showEditDepartment ? handleUpdateService : handleSubmit}
                    variant="contained"
                >
                    {showEditService ? "Update" : "Submit"}
                </Button>
            </Dialog>

            {/* Dialog box to show edit details */}
            <Dialog
                className="My_Mat_Dialog"
                open={editOption}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle className='mb-4' style={{ fontSize: "20px", fontWeight: "bold", color: "#333", boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)" }}>
                    Edit Service Details
                    <IconButton onClick={handlecloseeditservice} style={{ float: "right" }}>
                        <CloseIcon color="primary" />
                    </IconButton>
                </DialogTitle>

                <DialogContent>
                    <div className="d-flex align-items-center justify-content-center mb-4">
                        <div className="d-flex align-items-center" style={{ width: '100%', maxWidth: '600px' }}>
                            {/* Step 1 */}
                            <div className="d-flex flex-column align-items-center position-relative">
                                <div
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        backgroundColor: step === 0 ? '#007bff' : '#ddd',
                                        color: step === 0 ? '#fff' : '#000',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        fontWeight: 'bold',
                                        fontSize: '16px',
                                        zIndex: 1, // Ensure it's above the line
                                    }}
                                >
                                    1
                                </div>
                                <span style={{ marginTop: '8px', fontSize: '14px', color: '#555' }}>Step 1: Details</span>
                            </div>

                            {/* Line between steps */}
                            <div
                                style={{
                                    flexGrow: 1,
                                    height: '2px',
                                    backgroundColor: step >= 1 ? '#007bff' : '#ddd',
                                    position: 'relative',
                                    top: '-15px', // Aligns the line with the center of the circles
                                    zIndex: 0, // Ensure it's below the circles
                                }}
                            ></div>

                            {/* Step 2 */}
                            <div className="d-flex flex-column align-items-center position-relative">
                                <div
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        backgroundColor: step === 1 ? '#007bff' : '#ddd',
                                        color: step === 1 ? '#fff' : '#000',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        fontWeight: 'bold',
                                        fontSize: '16px',
                                        zIndex: 1, // Ensure it's above the line
                                    }}
                                >
                                    2
                                </div>
                                <span style={{ marginTop: '8px', fontSize: '14px', color: '#555' }}>Step 2: Portfolio</span>
                            </div>
                        </div>
                    </div>

                    {step === 0 && (
                        <div>
                            {fields.map((field, index) => (
                                <div key={index} className="mb-4 p-3 border rounded">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h5 style={{ fontWeight: "bold", fontSize: "17px", color: "#4A90E2" }}>Details {index + 1}</h5>
                                        <IconButton
                                            onClick={
                                                index === fields.length - 1 ? addField : () => deleteField(index)
                                            }
                                            style={{
                                                background: index === fields.length - 1 ? "#007bff" : "#dc3545",
                                                color: "#fff",
                                                padding: "6px",
                                                borderRadius: "50%",
                                            }}
                                        >
                                            {index === fields.length - 1 ? (
                                                <IconPlus style={{ width: "18px", height: "18px" }} />
                                            ) : (
                                                <IconTrash style={{ width: "18px", height: "18px" }} />
                                            )}
                                        </IconButton>
                                    </div>
                                    <div className="row">
                                        <div className="col-12 mb-3">
                                            <label className="form-label">Heading</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter heading"
                                                value={field.heading}
                                                onChange={(e) =>
                                                    handleFieldChange(index, "heading", e.target.value)
                                                }
                                            />
                                            {errors[`heading_${index}`] && (
                                                <div
                                                    style={{
                                                        color: "#d9534f",
                                                        fontSize: "13px",
                                                        marginTop: "2.5px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        marginLeft: "5px",
                                                        gap: "3px",
                                                    }}
                                                >
                                                    <span style={{ fontSize: "13px" }}>⚠</span>
                                                    {errors[`heading_${index}`]}
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-12 mb-6">
                                            <label className="form-label">Details</label>
                                            <ReactQuill
                                                theme="snow"
                                                modules={modules}
                                                formats={formats}
                                                value={field.details || ""}
                                                onChange={(value) =>
                                                    handleFieldChange(index, "details", value)
                                                }
                                                placeholder="Write your content..."
                                                style={{ height: "170px", marginbottom: "56px" }}
                                            />
                                             {errors[`details_${index}`] && (
                                                <div
                                                    style={{
                                                        color: "#d9534f",
                                                        fontSize: "13px",
                                                        marginTop: "42px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        marginLeft: "5px",
                                                        gap: "3px",
                                                    }}
                                                >
                                                    <span style={{ fontSize: "13px" }}>⚠</span>
                                                    {errors[`details_${index}`]}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {step === 1 && (
                        <div>
                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <label className="form-label">Sales & Marketing Team</label>
                                    <Select
                                        isMulti
                                        options={employees}
                                        value={teamInfo.salesMarketingPersons}
                                        placeholder="Select persons"
                                        onChange={(selected) => {
                                            // Map the selected values back to { label, value } structure
                                            setTeamInfo((prev) => ({
                                                ...prev,
                                                salesMarketingPersons: selected.map((s) => ({
                                                    label: s.label, // Ensure both label and value are retained
                                                    value: s.value
                                                })),
                                            }));
                                        }}
                                    />
                                    {errors.salesMarketingPersons && (
                                        <div
                                            style={{
                                                color: "#d9534f",
                                                fontSize: "13px",
                                                marginTop: "2.5px",
                                                display: "flex",
                                                alignItems: "center",
                                                marginLeft: "5px",
                                                gap: "3px",
                                            }}
                                        >
                                            <span style={{ fontSize: "13px" }}>⚠</span>
                                            {errors.salesMarketingPersons}
                                        </div>
                                    )}
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Backend Team</label>
                                    <Select
                                        isMulti
                                        options={employees}
                                        value={teamInfo.backendPersons}
                                        placeholder="Select persons"
                                        onChange={(selected) => {
                                            // Map the selected values back to { label, value } structure
                                            setTeamInfo((prev) => ({
                                                ...prev,
                                                backendPersons: selected.map((s) => ({
                                                    label: s.label, // Ensure both label and value are retained
                                                    value: s.value
                                                })),
                                            }));
                                        }}
                                    />
                                    {errors.backendPersons && (
                                        <div
                                            style={{
                                                color: "#d9534f",
                                                fontSize: "13px",
                                                marginTop: "2.5px",
                                                display: "flex",
                                                alignItems: "center",
                                                marginLeft: "5px",
                                                gap: "3px",
                                            }}
                                        >
                                            <span style={{ fontSize: "13px" }}>⚠</span>
                                            {errors.backendPersons}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Portfolio</label>
                                    <TagsInput
                                        value={teamInfo.portfolio}
                                        onChange={handlePortfolioChange}
                                        inputProps={{ placeholder: "Enter links" }}
                                    />
                                    {errors.portfolio && (
                                        <div
                                            style={{
                                                color: "#d9534f",
                                                fontSize: "13px",
                                                marginTop: "2.5px",
                                                display: "flex",
                                                alignItems: "center",
                                                marginLeft: "5px",
                                                gap: "3px",
                                            }}
                                        >
                                            <span style={{ fontSize: "13px" }}>⚠</span>
                                            {errors.portfolio}
                                        </div>
                                    )}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Documents</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        multiple
                                        onChange={handleFileChange}
                                    />
                                    {errors.documents && (
                                        <div
                                            style={{
                                                color: "#d9534f",
                                                fontSize: "13px",
                                                marginTop: "2.5px",
                                                display: "flex",
                                                alignItems: "center",
                                                marginLeft: "5px",
                                                gap: "4px",
                                            }}
                                        >
                                            <span style={{ fontSize: "13px" }}>⚠</span>
                                            {errors.documents}
                                        </div>
                                    )}
                                    <div className="mt-2">
                                        {teamInfo.documents.map((file, index) => (
                                            <span
                                                // onClick={() => openDocument(serviceId, file.filename)}
                                                key={index}
                                                className="badge bg-info text-dark me-2"
                                                style={{
                                                    padding: "5px 10px",
                                                    fontSize: "12px",
                                                    cursor: "pointer",
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    margin:"2px"
                                                }}
                                            >
                                                {file.originalname ? file.originalname : file.name}
                                                <span
                                                    onClick={() => handleDocumentRemove(index)}
                                                    style={{
                                                        marginLeft: "5px",
                                                        color: "red",
                                                        fontSize: "14px",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    &times;
                                                </span>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>

                <DialogActions>
                    {step > 0 && (
                        <Button onClick={handleBack} className="btn btn-secondary">
                            Back
                        </Button>
                    )}
                    {step < 1 ? (
                        <Button onClick={handleNext} className="btn btn-primary">
                            Next
                        </Button>
                    ) : (
                        <Button onClick={handleSubmit1} className="btn btn-success">
                            Submit
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

            {/* Dialog box to show add more addservice details */}
            <Dialog
                className="My_Mat_Dialog"
                open={addOption}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle className='mb-4' style={{ fontSize: "20px", fontWeight: "bold", color: "#333", boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)" }}>
                    Add Service Details
                    <IconButton onClick={handlecloseaddservice} style={{ float: "right" }}>
                        <CloseIcon color="primary" />
                    </IconButton>
                </DialogTitle>

                <DialogContent>

                    <div className="d-flex align-items-center justify-content-center mb-4">
                        <div className="d-flex align-items-center" style={{ width: '100%', maxWidth: '600px' }}>
                            {/* Step 1 */}
                            <div className="d-flex flex-column align-items-center position-relative">
                                <div
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        backgroundColor: step === 0 ? '#007bff' : '#ddd',
                                        color: step === 0 ? '#fff' : '#000',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        fontWeight: 'bold',
                                        fontSize: '16px',
                                        zIndex: 1, // Ensure it's above the line
                                    }}
                                >
                                    1
                                </div>
                                <span style={{ marginTop: '8px', fontSize: '14px', color: '#555' }}>Step 1: Details</span>
                            </div>

                            {/* Line between steps */}
                            <div
                                style={{
                                    flexGrow: 1,
                                    height: '2px',
                                    backgroundColor: step >= 1 ? '#007bff' : '#ddd',
                                    position: 'relative',
                                    top: '-15px', // Aligns the line with the center of the circles
                                    zIndex: 0, // Ensure it's below the circles
                                }}
                            ></div>

                            {/* Step 2 */}
                            <div className="d-flex flex-column align-items-center position-relative">
                                <div
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        backgroundColor: step === 1 ? '#007bff' : '#ddd',
                                        color: step === 1 ? '#fff' : '#000',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        fontWeight: 'bold',
                                        fontSize: '16px',
                                        zIndex: 1, // Ensure it's above the line
                                    }}
                                >
                                    2
                                </div>
                                <span style={{ marginTop: '8px', fontSize: '14px', color: '#555' }}>Step 2: Portfolio</span>
                            </div>
                        </div>
                    </div>

                    {step === 0 && (
                        <div>
                            {fields.map((field, index) => (
                                <div key={index} className="mb-4 p-3 border rounded">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h5 style={{ fontWeight: "bold", fontSize: "17px", color: "#4A90E2" }}>Details {index + 1}</h5>
                                        <IconButton
                                            onClick={
                                                index === fields.length - 1 ? addField : () => deleteField(index)
                                            }
                                            style={{
                                                background: index === fields.length - 1 ? "#007bff" : "#dc3545",
                                                color: "#fff",
                                                padding: "6px",
                                                borderRadius: "50%",
                                            }}
                                        >
                                            {index === fields.length - 1 ? (
                                                <IconPlus style={{ width: "18px", height: "18px" }} />
                                            ) : (
                                                <IconTrash style={{ width: "18px", height: "18px" }} />
                                            )}
                                        </IconButton>
                                    </div>
                                    <div className="row">
                                        <div className="col-12 mb-3">
                                            <label className="form-label">Heading</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter heading"
                                                value={field.heading}
                                                onChange={(e) =>
                                                    handleFieldChange(index, "heading", e.target.value)
                                                }
                                            />
                                            {errors[`heading_${index}`] && (
                                                <div
                                                    style={{
                                                        color: "#d9534f",
                                                        fontSize: "13px",
                                                        marginTop: "2.5px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        marginLeft: "5px",
                                                        gap: "3px",
                                                    }}
                                                >
                                                    <span style={{ fontSize: "13px" }}>⚠</span>
                                                    {errors[`heading_${index}`]}
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-12 mb-6">
                                            <label className="form-label">Details</label>
                                            <ReactQuill
                                                theme="snow"
                                                modules={modules}
                                                formats={formats}
                                                value={field.details || ""}
                                                onChange={(value) =>
                                                    handleFieldChange(index, "details", value)
                                                }
                                                placeholder="Write your content..."
                                                style={{ height: "170px" }}
                                            />
                                            {errors[`details_${index}`] && (
                                                <div
                                                    style={{
                                                        color: "#d9534f",
                                                        fontSize: "13px",
                                                        marginTop: "42px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        marginLeft: "5px",
                                                        gap: "3px",
                                                    }}
                                                >
                                                    <span style={{ fontSize: "13px" }}>⚠</span>
                                                    {errors[`details_${index}`]}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {step === 1 && (
                        <div>
                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <label className="form-label">Sales & Marketing Team</label>
                                    <Select
                                        isMulti
                                        options={employees}
                                        placeholder="Select persons"
                                        onChange={(selected) => {
                                            // Map the selected values back to { label, value } structure
                                            setTeamInfo((prev) => ({
                                                ...prev,
                                                salesMarketingPersons: selected.map((s) => ({
                                                    label: s.label, // Ensure both label and value are retained
                                                    value: s.value
                                                })),
                                            }));
                                        }}
                                    />
                                    {errors.salesMarketingPersons && (
                                        <div
                                            style={{
                                                color: "#d9534f",
                                                fontSize: "13px",
                                                marginTop: "2.5px",
                                                display: "flex",
                                                alignItems: "center",
                                                marginLeft: "5px",
                                                gap: "3px",
                                            }}
                                        >
                                            <span style={{ fontSize: "13px" }}>⚠</span>
                                            {errors.salesMarketingPersons}
                                        </div>
                                    )}
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Backend Team</label>
                                    <Select
                                        isMulti
                                        options={employees}
                                        placeholder="Select persons"
                                        onChange={(selected) => {
                                            // Map the selected values back to { label, value } structure
                                            setTeamInfo((prev) => ({
                                                ...prev,
                                                backendPersons: selected.map((s) => ({
                                                    label: s.label, // Ensure both label and value are retained
                                                    value: s.value
                                                })),
                                            }));
                                        }}
                                    />
                                    {errors.backendPersons && (
                                        <div
                                            style={{
                                                color: "#d9534f",
                                                fontSize: "13px",
                                                marginTop: "2.5px",
                                                display: "flex",
                                                alignItems: "center",
                                                marginLeft: "5px",
                                                gap: "3px",
                                            }}
                                        >
                                            <span style={{ fontSize: "13px" }}>⚠</span>
                                            {errors.backendPersons}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Portfolio</label>
                                    <TagsInput
                                        value={teamInfo.portfolio}
                                        onChange={handlePortfolioChange}
                                        inputProps={{ placeholder: "Enter links" }}
                                    />
                                    {errors.portfolio && (
                                        <div
                                            style={{
                                                color: "#d9534f",
                                                fontSize: "13px",
                                                marginTop: "2.5px",
                                                display: "flex",
                                                alignItems: "center",
                                                marginLeft: "5px",
                                                gap: "3px",
                                            }}
                                        >
                                            <span style={{ fontSize: "13px" }}>⚠</span>
                                            {errors.portfolio}
                                        </div>
                                    )}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Documents</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        multiple
                                        onChange={handleFileChange}
                                    />
                                    {errors.documents && (
                                        <div
                                            style={{
                                                color: "#d9534f",
                                                fontSize: "13px",
                                                marginTop: "2.5px",
                                                display: "flex",
                                                alignItems: "center",
                                                marginLeft: "5px",
                                                gap: "4px",
                                            }}
                                        >
                                            <span style={{ fontSize: "13px" }}>⚠</span>
                                            {errors.documents}
                                        </div>
                                    )}
                                    <div className="mt-2">
                                        {teamInfo.documents.map((file, index) => (
                                            <span
                                                key={index}
                                                // onClick={() =>  editOption ? openDocument(serviceId, file.filename) : handleDownload(file)}
                                                onClick={() => handleDocumentRemove(index)}
                                                className="badge bg-info text-dark me-2"
                                                style={{
                                                    padding: "5px 10px",
                                                    fontSize: "12px",
                                                    cursor: "pointer",
                                                    // display: "inline-flex",
                                                    alignItems: "center",
                                                    margin: "2px"
                                                }}
                                            >
                                                {file.originalname ? file.originalname : file.name}
                                                <span
                                                    onClick={(e) => { e.stopPropagation(); handleDocumentRemove(index); }}
                                                    style={{
                                                        marginLeft: "5px",
                                                        color: "red",
                                                        fontSize: "14px",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    &times;
                                                </span>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>

                <DialogActions>
                    {step > 0 && (
                        <Button onClick={handleBack} className="btn btn-secondary">
                            Back
                        </Button>
                    )}
                    {step < 1 ? (
                        <Button onClick={handleNext} className="btn btn-primary">
                            Next
                        </Button>
                    ) : (
                        <Button onClick={handleSubmit1} className="btn btn-success">
                            Submit
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

            {/* Dialog box to show edit options */}
            <Dialog
                className='My_Mat_Dialog'
                open={showUpdationOptions}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    What do you want to edit?
                    <IconButton onClick={handleCloseUpdateOptions} style={{ float: "right" }}>
                        <CloseIcon color="primary" />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-body">
                                <div className="row">
                                    <div className='d-flex'>
                                        <div className="mb-3 col-4">
                                            <div className="d-flex">
                                                <div>
                                                    <button
                                                        className="btn action-btn-primary"
                                                        onClick={() => {
                                                            setShowAddDepartment(true);
                                                            setShowEditDepartment(true);
                                                            setShowUpdateOptions(false);
                                                        }}
                                                    >
                                                        <IconButton>
                                                            <ModeEditIcon
                                                                style={{
                                                                    cursor: "pointer",
                                                                    color: "orange",
                                                                    width: "14px",
                                                                    height: "14px",
                                                                    marginTop: "2px"
                                                                }}
                                                            />
                                                        </IconButton>
                                                        Edit Service Category
                                                    </button>
                                                </div>

                                                <div className="ms-3">
                                                    <button
                                                        className="btn action-btn-alert"
                                                        onClick={() => {
                                                            setShowAddService(true);
                                                            setShowEditService(true);
                                                            setShowUpdateOptions(false);
                                                        }}
                                                    >
                                                        <IconButton>
                                                            <ModeEditIcon
                                                                style={{
                                                                    cursor: "pointer",
                                                                    color: "blue",
                                                                    width: "14px",
                                                                    height: "14px",
                                                                    marginTop: "2px"
                                                                }}
                                                            />
                                                        </IconButton>
                                                        Edit Service
                                                    </button>
                                                </div>

                                                <div className="ms-3">
                                                    <div className="d-flex">
                                                        <button
                                                            className="btn action-btn-success"
                                                            onClick={() => {
                                                                if (!serviceDetails) {
                                                                    Swal.fire("Info", "Please add service details before editing", "info");
                                                                    setShowUpdateOptions(false);
                                                                    setDepartmentName("");
                                                                    setUpdatedDepartmentName("");
                                                                    setServiceName("");
                                                                    setUpdatedServiceName("");
                                                                    setServiceDescription("");
                                                                    setUpdatedServiceDescription("");
                                                                    setShowEditDepartment(false);
                                                                    setShowEditService(false);
                                                                } else {
                                                                    setShowEditServiceDetails(true);
                                                                    setShowUpdateOptions(false);
                                                                }
                                                            }}
                                                        >
                                                            <IconButton>
                                                                <ModeEditIcon
                                                                    style={{
                                                                        cursor: "pointer",
                                                                        color: "green",
                                                                        width: "14px",
                                                                        height: "14px",
                                                                        marginTop: "2px"
                                                                    }}
                                                                />
                                                            </IconButton>
                                                            Edit Service Details
                                                        </button>
                                                    </div>
                                                </div>

                                                <button
                                                    className="btn action-btn-success"
                                                    onClick={() => {
                                                        setShowAddServiceDetails(true);
                                                        setShowUpdateOptions(false);
                                                    }}
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="icon"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        stroke-width="2"
                                                        stroke="currentColor"
                                                        fill="none"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                    >
                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                        <path d="M12 5l0 14" />
                                                        <path d="M5 12l14 0" />
                                                    </svg>
                                                    Add Service Details
                                                </button>



                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

    
            {showServiceDetails && <EmployeeAssetDetailss back={handleCloseShowServiceDetails} serviceName={serviceName} departmentName={departmentName} serviceId={serviceId} />}

        </div>
    )
}

export default Service