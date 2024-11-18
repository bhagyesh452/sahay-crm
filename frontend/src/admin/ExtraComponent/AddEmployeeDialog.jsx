import React, { useEffect, useState } from 'react';
import { MdDelete } from "react-icons/md";
import { Button, Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { MdOutlineAddCircle } from "react-icons/md";
import Swal from 'sweetalert2';
import ClipLoader from 'react-spinners/ClipLoader';
import axios from 'axios';

function AddEmployeeDialog({ empId, openForAdd, closeForAdd, openForEdit, closeForEdit, refetch }) {

    if (!openForAdd) {
        // console.log("Emp id from dialog box :", empId);
    }
    // console.log("Open add employee popup :", openForAdd);
    // console.log("Open edit employee popup :", openForEdit);

    const secretKey = process.env.REACT_APP_SECRET_KEY;

    const [bdmWork, setBdmWork] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const [openPopup, setOpenPopup] = useState(false);
    const [employeeID, setEmployeeID] = useState("");
    const [ename, setEname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [number, setNumber] = useState(0);
    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [department, setDepartment] = useState("");
    const [newDesignation, setNewDesignation] = useState("");
    const [jdate, setJdate] = useState(null);
    // const [designation, setDesignation] = useState("");
    const [branchOffice, setBranchOffice] = useState("");
    const [reportingManager, setReportingManager] = useState("");
    const [nowFetched, setNowFetched] = useState(false);
    const [otherdesignation, setotherDesignation] = useState("");
    const [employeeData, setEmployeeData] = useState([]);
    const [companyData, setCompanyData] = useState([]);
    const [errors, setErrors] = useState([]);
    const [isDepartmentSelected, setIsDepartmentSelected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const defaultObject = {
        year: "",
        month: "",
        amount: 0,
        achievedAmount: 0,
        ratio: 0,
        result: "N/A"
    };
    const [targetObjects, setTargetObjects] = useState([defaultObject]);
    const [targetCount, setTargetCount] = useState(1);

    const handleClosePopup = () => {
        setOpenPopup(false);
    }

    const convertToDateInputFormat = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const validate = () => {
        const newErrors = {};
        if (!firstName) newErrors.firstName = "First name is required";
        if (!middleName) newErrors.middleName = "Middle name is required";
        if (!lastName) newErrors.lastName = "Last name is required";
        if (!email) newErrors.email = "Email is required";
        if (!password) newErrors.password = "Password is required";
        if (!department || department === "Select Department") newErrors.department = "Department is required";
        if (!newDesignation || newDesignation === "Select Designation") newErrors.newDesignation = "Designation is required";
        if (!branchOffice) newErrors.branchOffice = "Branch office is required";
        if (!reportingManager || reportingManager === "Select Manager") newErrors.reportingManager = "Reporting manager is required";
        if (!number) newErrors.number = "Phone number is required";
        if (!jdate) newErrors.jdate = "Joining date is required";


        // Email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailPattern.test(email)) newErrors.email = "Invalid email";

        // Phone number validation (Indian phone number)
        // const phonePattern = /^(?:\+91|91)?[789]\d{9}$/;
        // if (number && !phonePattern.test(number)) newErrors.number = "Invalid phone number";
        const phonePattern = /^\d{10}$/;
        if (number && !phonePattern.test(number)) {
            newErrors.number = "Invalid phone number";
        }

        return newErrors;
    };

    const departmentDesignations = {
        "Start-Up": [
            "Admin Head",
            "Accountant",
            "Data Analyst",
            "Content Writer",
            "Graphic Designer",
            "Company Secretary",
            "Admin Head",
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
            // "Sales Manager",
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
        const designations = departmentDesignations[department] || [];
        return designations.map((designation, index) => (
            <option key={index} value={designation}>
                {designation}
            </option>
        ));
    };

    const renderManagerOptions = () => {
        const managers = departmentManagers[department] || [];
        return managers.map((manager, index) => (
            <option key={index} value={manager}>
                {manager}
            </option>
        ));
    };

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get(`${secretKey}/employee/fetchEmployeeFromId/${empId}`);
            const data = res.data.data;
            // console.log("Fetched employee is :", data);
            // Set the retrieved data in the state\
            setFirstName(data.empFullName.split(" ")[0] || "");
            setMiddleName(data.empFullName.split(" ")[1] || "");
            setLastName(data.empFullName.split(" ")[2] || "");
            setEmail(data.email || "");
            setPassword(data.password || "");
            setDepartment(data.department || "");
            setNewDesignation(data.newDesignation || "");
            setBranchOffice(data.branchOffice || "");
            setReportingManager(data.reportingManager || "");
            setNumber(data.number);
            setJdate(convertToDateInputFormat(data.jdate));
            setIsUpdateMode(true);
            setTargetObjects(
                data.targetDetails.length !== 0
                    ? data.targetDetails
                    : [
                        {
                            year: "",
                            month: "",
                            amount: 0,
                            achievedAmount: 0,
                            ratio: 0,
                            result: "N/A"
                        },
                    ]
            );

            // setNumber(d);
        } catch (error) {
            console.error("Error fetching data:", error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (empId) {
            fetchData();
        }
    }, [empId, openForEdit === true]);

    const handleInputChange = (field, value) => {
        switch (field) {
            case "firstName":
                setFirstName(value);
                break;
            case "middleName":
                setMiddleName(value);
                break;
            case "lastName":
                setLastName(value);
                break;
            case "email":
                setEmail(value);
                break;
            case "password":
                setPassword(value);
                break;
            case "department":
                setDepartment(value);
                break;
            case "newDesignation":
                setNewDesignation(value);
                break;
            case "branchOffice":
                setBranchOffice(value);
                break;
            case "reportingManager":
                setReportingManager(value);
                break;
            case "number":
                setNumber(value);
                break;
            case "jdate":
                setJdate(value);
                break;
            default:
                break;
        }
        setErrors((prevErrors) => {
            const { [field]: removedError, ...restErrors } = prevErrors;
            return restErrors;
        });
    };

    const handleSubmit = async (e) => {

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            // Submit form data
            setErrors({});
            // Add your form submission logic here
            // const referenceId = uuidv4();
            const AddedOn = new Date().toLocaleDateString();
            let designation;
            if (newDesignation === "Business Development Executive" || newDesignation === "Business Development Manager") {
                designation = "Sales Executive";
            } else if (newDesignation === "Floor Manager") {
                designation = "Sales Manager";
            } else if (newDesignation === "Data Analyst") {
                designation = "Data Manager";
            } else if (newDesignation === "Admin Head") {
                designation = "RM-Certification";
            } else if (newDesignation === "HR Manager") {
                designation = "HR";
            } else {
                designation = newDesignation;
            }

            try {
                let dataToSend = {
                    email: email,
                    number: number,
                    employeeID: employeeID,
                    ename: `${firstName} ${lastName}`,
                    empFullName: `${firstName} ${middleName} ${lastName}`,
                    department: department,
                    oldDesignation: designation,
                    newDesignation: newDesignation,
                    branchOffice: branchOffice,
                    reportingManager: reportingManager,
                    password: password,
                    jdate: jdate,
                    AddedOn: AddedOn,
                    targetDetails: targetObjects,
                    // bdmWork,
                };

                let dataToSendUpdated = {
                    email: email,
                    number: number,
                    ename: `${firstName} ${lastName}`,
                    empFullName: `${firstName} ${middleName} ${lastName}`,
                    department: department,
                    designation: designation,
                    newDesignation: newDesignation,
                    branchOffice: branchOffice,
                    reportingManager: reportingManager,
                    password: password,
                    jdate: jdate,
                    AddedOn: AddedOn,
                    targetDetails: targetObjects,
                    // bdmWork,
                };

                // Set designation based on otherDesignation
                // if (otherdesignation !== "") {
                //   dataToSend.designation = otherdesignation;
                // } else {
                //   dataToSend.designation = designation;
                // }

                if (newDesignation === "Floor Manager" || newDesignation === "Business Development Manager") {
                    dataToSend.bdmWork = true;
                    dataToSendUpdated.bdmWork = true;
                } else {
                    dataToSend.bdmWork = false;
                    dataToSendUpdated.bdmWork = false;
                }
                // console.log(isUpdateMode, "updateMode")

                if (isUpdateMode) {
                    if (dataToSend.ename === "") {
                        Swal.fire("Invalid Details", "Please Enter Details Properly", "warning");
                        return true;
                    }
                    const response = await axios.put(
                        `${secretKey}/employee/einfo/${empId}`,
                        dataToSendUpdated
                    );
                    // console.log("response", response.data)
                    // console.log("dataTosendupdated", dataToSendUpdated)
                    closeForEdit();

                    // console.log("Updated employee is :", dataToSendUpdated);

                    Swal.fire({
                        title: "Data Updated Succesfully!",
                        text: "You have successfully updated the data!",
                        icon: "success",
                    });
                    refetch();

                    if (companyData && companyData.length !== 0) {
                        // Assuming ename is part of dataToSend
                        const { ename } = dataToSend;
                        try {
                            // Update companyData in the second database
                            await Promise.all(
                                companyData.map(async (item) => {
                                    await axios.put(`${secretKey}/company-data/newcompanyname/${item._id}`, {
                                        ename,
                                    });
                                    //console.log(`Updated ename for ${item._id}`);
                                })
                            );
                        } catch (error) {
                            console.error("Error updating enames:", error.message);
                            // Handle the error as needed
                        }
                    }
                } else {
                    // console.log("Before creating employee data is :", dataToSend);
                    const response = await axios.post(`${secretKey}/employee/einfo`, dataToSend);
                    // Adds data in performance report:
                    closeForAdd();
                    // console.log("Created employee is :", response.data);
                    // console.log("Close add popup", openForAdd);
                    setFirstName("");
                    setMiddleName("");
                    setLastName("");
                    setEname("");
                    setEmail("");
                    setNumber(0);
                    setPassword("");
                    setDepartment("");
                    setNewDesignation("");
                    setBranchOffice("");
                    setReportingManager("");
                    setotherDesignation("");
                    setJdate(null);
                    setIsUpdateMode(false);
                    setTargetCount(1);
                    setTargetObjects([defaultObject]);
                    //console.log("Data sent successfully");
                    Swal.fire({
                        title: "Data Added!",
                        text: "You have successfully added the data!",
                        icon: "success",
                    });
                    refetch();
                }
                //console.log("datatosend", dataToSend);
            } catch {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                });
                console.error("Internal server error");
            }
        }
    };

    const resetForm = () => {
        setIsUpdateMode(false);
        setFirstName("");
        setMiddleName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setDepartment("");
        setNewDesignation("");
        setBranchOffice("");
        setReportingManager("");
        setNumber("");
        setJdate("");
        setBdmWork("");
        setEname("");
        setTargetCount(1);
        setTargetObjects([{ year: "", month: "", amount: 0, achievedAmount: 0, ratio: 0, result: "N/A" }]);
        setShowPassword(false);
        setNowFetched(false);
        setIsDepartmentSelected(false);
        setotherDesignation("");
    };

    useEffect(() => {
        resetForm();
    }, [openForAdd === true]);

    const handleAddTarget = () => {
        const totalTargets = targetObjects;
        totalTargets.push(defaultObject);
        setTargetCount(targetCount + 1);
        setTargetObjects(totalTargets);
    };

    const handleRemoveTarget = () => {
        const totalTargets = targetObjects;
        totalTargets.pop();
        setTargetCount(targetCount - 1);
        setTargetObjects(totalTargets);
    };

    //console.log("ename" , ename)

    return (
        <div>
            <Dialog className='My_Mat_Dialog' open={openForAdd || openForEdit} fullWidth maxWidth="sm" onClose={() => {
                handleClosePopup();
                closeForAdd();
                closeForEdit();
            }}
            >
                <DialogTitle>
                    Employee Info{" "}
                    <IconButton style={{ float: "right" }} onClick={() => {
                        handleClosePopup();
                        closeForAdd();
                        closeForEdit();
                    }}
                    >
                        <CloseIcon color="primary"></CloseIcon>
                    </IconButton>{" "}
                </DialogTitle>
                <DialogContent>
                    {isLoading ?
                        <div>
                            <div className="LoaderTDSatyle w-100">
                                <ClipLoader
                                    color="lightgrey"
                                    loading={true}
                                    size={30}
                                    aria-label="Loading Spinner"
                                    data-testid="loader"
                                />
                            </div>
                        </div> :
                        <div className="modal-dialog modal-lg" role="document">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Employee Name</label>
                                        <div className="d-flex">

                                            <div className="col-4 me-1">
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    className="form-control mt-1"
                                                    placeholder="First name"
                                                    value={firstName?.trim()}
                                                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                                                />
                                                {errors.firstName && <p style={{ color: 'red' }}>{errors.firstName}</p>}
                                            </div>

                                            <div className="col-4 me-1">
                                                <input
                                                    type="text"
                                                    name="middleName"
                                                    className="form-control mt-1"
                                                    placeholder="Middle name"
                                                    value={middleName?.trim()}
                                                    onChange={(e) => handleInputChange("middleName", e.target.value)}
                                                />
                                                {errors.middleName && <p style={{ color: 'red' }}>{errors.middleName}</p>}
                                            </div>

                                            <div className="col-4">
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    className="form-control mt-1"
                                                    placeholder="Last name"
                                                    value={lastName?.trim()}
                                                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                                                />
                                                {errors.lastName && <p style={{ color: 'red' }}>{errors.lastName}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Email Address</label>
                                        <input
                                            value={email}
                                            type="email"
                                            className="form-control"
                                            name="example-text-input"
                                            placeholder="Email"
                                            onChange={(e) => handleInputChange("email", e.target.value)}
                                        />
                                        {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Password</label>
                                        <div className="input-group">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                className="form-control"
                                                name="example-text-input"
                                                placeholder="Password"
                                                required
                                                onChange={(e) => handleInputChange("password", e.target.value)}
                                            />
                                            <button
                                                className="btn btn-outline-secondary"
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? "Hide" : "Show"}
                                            </button>
                                        </div>
                                        {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
                                    </div>

                                    <div className="row">

                                        <div className="col-lg-6 mb-3">
                                            <label className="form-label">Department</label>
                                            <div >
                                                <select
                                                    className="form-select"
                                                    value={department}
                                                    required
                                                    onChange={(e) => {
                                                        handleInputChange("department", e.target.value);
                                                        setIsDepartmentSelected(e.target.value !== "Select Department");
                                                    }}
                                                >
                                                    <option value="Select Department" selected> Select Department</option>
                                                    <option value="Start-Up">Start-Up</option>
                                                    <option value="HR">HR</option>
                                                    <option value="Operation">Operation</option>
                                                    <option value="IT">IT</option>
                                                    <option value="Sales">Sales</option>
                                                    <option value="Others">Others</option>
                                                </select>
                                            </div>
                                            {errors.department && <p style={{ color: 'red' }}>{errors.department}</p>}
                                        </div>

                                        <div className="col-lg-6 mb-3">
                                            <label className="form-label">Designation/Job Title</label>
                                            <div>
                                                <select className="form-select"
                                                    name="newDesignation"
                                                    id="newDesignation"
                                                    value={newDesignation}
                                                    onChange={(e) => handleInputChange("newDesignation", e.target.value)}
                                                    disabled={!openForEdit && !isDepartmentSelected}
                                                >
                                                    <option value="Select Designation">Select Designation</option>
                                                    {renderDesignationOptions()}
                                                </select>
                                            </div>
                                            {errors.newDesignation && <p style={{ color: 'red' }}>{errors.newDesignation}</p>}
                                        </div>
                                    </div>

                                    {/* If the designation is others */}
                                    {/* {designation === "Others" && (
                                    <div className="mb-3">
                                        <input
                                            value={otherdesignation}
                                            type="email"
                                            className="form-control"
                                            name="example-text-input"
                                            placeholder="Please enter your designation"
                                            onChange={(e) => {
                                                setotherDesignation(e.target.value);
                                            }}
                                        />
                                    </div>
                                )} */}

                                    <div className="row">
                                        <div className="col-lg-6 mb-3">
                                            <label className="form-label">Branch Office</label>
                                            <div>
                                                <select
                                                    className="form-select"
                                                    value={branchOffice}
                                                    required
                                                    onChange={(e) => handleInputChange("branchOffice", e.target.value)}
                                                >
                                                    <option value="" selected>Select Branch Office</option>
                                                    <option value="Gota">Gota</option>
                                                    <option value="Sindhu Bhawan">Sindhu Bhawan</option>
                                                </select>
                                            </div>
                                            {errors.branchOffice && <p style={{ color: 'red' }}>{errors.branchOffice}</p>}
                                        </div>

                                        <div className="col-lg-6 mb-3">
                                            <label className="form-label">Manager</label>
                                            <div>
                                                <select className="form-select"
                                                    name="reportingManager"
                                                    id="reportingManager"
                                                    value={reportingManager}
                                                    onChange={(e) => handleInputChange("reportingManager", e.target.value)}
                                                    disabled={!openForEdit && !isDepartmentSelected}
                                                >
                                                    <option value="Select Designation">Select Manager</option>
                                                    {department === "Sales" && newDesignation === "Floor Manager"
                                                        ? <option value="Mr. Ronak Kumar">Mr. Ronak Kumar</option> : <>{renderManagerOptions()}</>
                                                    }
                                                </select>
                                            </div>
                                            {errors.reportingManager && <p style={{ color: 'red' }}>{errors.reportingManager}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-lg-6">
                                        <div className="mb-3">
                                            <label className="form-label">Phone No.</label>
                                            <input
                                                value={number}
                                                type="number"
                                                className="form-control"
                                                onChange={(e) => handleInputChange("number", e.target.value)}
                                            />
                                            {errors.number && <p style={{ color: 'red' }}>{errors.number}</p>}
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="mb-3">
                                            <label className="form-label">Joining Date</label>
                                            <input
                                                value={jdate}
                                                type="date"
                                                onChange={(e) => handleInputChange("jdate", e.target.value)}
                                                className="form-control"
                                            />
                                            {errors.jdate && <p style={{ color: 'red' }}>{errors.jdate}</p>}
                                        </div>
                                    </div>
                                </div>

                                <label className="form-label">ADD Target</label>
                                {targetObjects.map((obj, index) => (
                                    <div className="row">
                                        <div className="col-lg-3">
                                            <div className="mb-3">
                                                <div>
                                                    <select className="form-select"
                                                        value={obj.year}
                                                        onChange={(e) => {
                                                            setTargetObjects(prevState => {
                                                                const updatedTargets = [...prevState]; // Create a copy of the targetCount array
                                                                updatedTargets[index] = { ...updatedTargets[index], year: e.target.value }; // Update the specific object at the given index
                                                                return updatedTargets; // Set the updated array as the new state
                                                            });
                                                        }}
                                                    >
                                                        <option value="" disabled selected>
                                                            Select Year
                                                        </option>
                                                        <option value="2024">2024</option>
                                                        <option value="2023">2023</option>
                                                        <option value="2022">2022</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-3">
                                            <div className="mb-3">
                                                <div>
                                                    <select className="form-select"
                                                        value={obj.month}
                                                        onChange={(e) => {
                                                            setTargetObjects(prevState => {
                                                                const updatedTargets = [...prevState]; // Create a copy of the targetCount array
                                                                updatedTargets[index] = { ...updatedTargets[index], month: e.target.value }; // Update the specific object at the given index
                                                                return updatedTargets; // Set the updated array as the new state
                                                            });
                                                        }}
                                                    >
                                                        <option value="" disabled selected>
                                                            Select Month
                                                        </option>
                                                        <option value="January">January</option>
                                                        <option value="February">February</option>
                                                        <option value="March">March</option>
                                                        <option value="April">April</option>
                                                        <option value="May">May</option>
                                                        <option value="June">June</option>
                                                        <option value="July">July</option>
                                                        <option value="August">August</option>
                                                        <option value="September">September</option>
                                                        <option value="October">October</option>
                                                        <option value="November">November</option>
                                                        <option value="December">December</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-3">
                                            <div className="mb-3">
                                                <input
                                                    placeholder="ADD Target value"
                                                    type="number"
                                                    className="form-control"
                                                    value={obj.amount}
                                                    onChange={(e) => {
                                                        setTargetObjects(prevState => {
                                                            const updatedTargets = [...prevState]; // Create a copy of the targetCount array
                                                            updatedTargets[index] = { ...updatedTargets[index], amount: e.target.value }; // Update the specific object at the given index
                                                            return updatedTargets; // Set the updated array as the new state
                                                        });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-3">
                                            <div className="mb-3">
                                                <input
                                                    placeholder="ADD achieved amount"
                                                    type="number"
                                                    className="form-control"
                                                    value={obj.achievedAmount}
                                                    onChange={(e) => {
                                                        setTargetObjects(prevState => {
                                                            const updatedTargets = [...prevState]; // Create a copy of the targetCount array
                                                            updatedTargets[index] = { ...updatedTargets[index], achievedAmount: e.target.value }; // Update the specific object at the given index
                                                            return updatedTargets; // Set the updated array as the new state
                                                        });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-1">
                                            <div className="mb-3 d-flex">
                                                <IconButton style={{ float: "right" }} onClick={handleAddTarget}>
                                                    <MdOutlineAddCircle
                                                        color="primary"
                                                        style={{
                                                            float: "right",
                                                            width: "14px",
                                                            height: "14px",
                                                        }}

                                                    ></MdOutlineAddCircle>
                                                </IconButton>
                                                <IconButton style={{ float: "right" }} onClick={handleRemoveTarget}>
                                                    <MdDelete
                                                        color="primary"
                                                        style={{
                                                            float: "right",
                                                            width: "14px",
                                                            height: "14px",
                                                        }}
                                                    />
                                                </IconButton>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    }
                </DialogContent>
                <button className="btn btn-primary bdr-radius-none" onClick={handleSubmit} variant="contained">
                    Submit
                </button>
            </Dialog>
        </div>
    );
}

export default AddEmployeeDialog;