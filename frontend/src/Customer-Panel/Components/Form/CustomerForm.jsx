import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Select from "react-select";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

function CustomerForm() {
    const secretKey = process.env.REACT_APP_SECRET_KEY;

    const companyName = localStorage.getItem("companyName");
    // console.log("Company name is :", companyName);

    const [companyData, setCompanyData] = useState({});
    const [formSubmitted, setFormSubmitted] = useState(false);

    const fetchCompanyData = async () => {
        try {
            const response = await axios.get(`${secretKey}/customer/fetch-company-data/${companyName}`);
            console.log("Company data is :", response.data.data);
            setCompanyData(response.data.data);
            if(response.data.data.formSubmitted){
                setFormSubmitted(true)
            }
        } catch (error) {
            console.log("Error fetching company data :", error);
        }
    };

    useEffect(() => {
        fetchCompanyData();
    }, []);

    useEffect(() => {
        if (companyData) {
            setFormData((prevData) => ({
                ...prevData,
                ...companyData,
            }));
            setNumberOfDirectors(companyData.DirectorDetails?.length || 1);
            setShowFinance(companyData.FinanceCondition === "Yes");
            setShowLinks(companyData.SocialMedia === "Yes");
            setShowTechnologyDetails(companyData.TechnologyInvolved === "Yes");
            setShowPhotos(companyData.ProductPhoto === "Yes");
            setShowIp(companyData.AnyIpFiledResponse === "Yes");
            setShowItr(companyData.ItrStatus === "Yes" ? true : companyData.ItrStatus === "No" ? false : null);
        }
    }, [companyData]);

    const DirectorForm = {
        DirectorName: "",
        DirectorEmail: "",
        DirectorMobileNo: "",
        DirectorQualification: "",
        DirectorWorkExperience: "",
        DirectorAnnualIncome: "",
        DirectorPassportPhoto: "",
        DirectorAdharCard: "",
        LinkedInProfileLink: "",
        DirectorDesignation: "",
        DirectorAdharCardNumber: "",
        DirectorGender: "",
        IsMainDirector: false,
    };

    const [formData, setFormData] = useState({
        CompanyName: localStorage.getItem("companyName"),
        CompanyEmail: localStorage.getItem("companyEmail"),
        CompanyNo: localStorage.getItem("companyPhoneNo"),
        BrandName: "",
        WebsiteLink: "",
        CompanyAddress: "",
        CompanyPanNumber: localStorage.getItem("companyPanNo"),
        SelectServices: [],
        UploadMOA: "",
        UploadAOA: "",
        SocialMedia: "",
        FacebookLink: "",
        InstagramLink: "",
        LinkedInLink: "",
        YoutubeLink: "",
        CompanyActivities: "",
        ProductService: "",
        CompanyUSP: "",
        ValueProposition: "",
        TechnologyInvolved: "",
        TechnologyDetails: "",
        ProductPhoto: "",
        UploadPhotos: null,
        AnyIpFiledResponse: "",
        RelevantDocument: null,
        RelevantDocumentComment: "",
        ItrStatus: "",
        UploadAuditedStatement: null,
        UploadProvisionalStatement: null,
        DirectInDirectMarket: "",
        BusinessModel: "",
        Finance: "",
        FinanceCondition: "No",
        UploadDeclaration: "",
        UploadRelevantDocs: "",
        DirectorDetails: [DirectorForm],
        formSubmitted:false
    });

    const [errors, setErrors] = useState({});
    const [emailError, setEmailError] = useState("");

    const [showLinks, setShowLinks] = useState(false);
    const [showTechnologyDetails, setShowTechnologyDetails] = useState(false);
    const [showPhotos, setShowPhotos] = useState(false);
    const [showIp, setShowIp] = useState(false);
    const [showItr, setShowItr] = useState(null);
    const [showOptional, setShowOptional] = useState(false);
    const [showFinance, setShowFinance] = useState(false);
    const [numberOfDirectors, setNumberOfDirectors] = useState(1);

    // Select Your Services
    const options1 = [
        { value: "Pitch Deck Development ", label: "Pitch Deck Development" },
        { value: "Financial Modeling", label: "Financial Modeling" },
        { value: "DPR Development", label: "DPR Developmen" },
        { value: "CMA Report Development", label: "CMA Report Development" },
        { value: "Company Profile Write-Up", label: "Company Profile" },
        { value: "Business Profile", label: "Business Profile" },
        { value: "Seed Funding Support", label: "Seed Funding Support" },
        { value: "Angel Funding Support", label: "Angel Funding Support" },
        { value: "VC Funding Support", label: "VC Funding Support" },
        { value: "Crowd Funding Support", label: "Crowd Funding Support" },
        { value: "I-Create", label: "I-Create" },
        { value: "Chunauti ", label: "Chunauti " },
        { value: "Nidhi Seed Support Scheme", label: "Nidhi Seed Support Scheme" },
        { value: "Nidhi Prayash Yojna", label: "Nidhi Prayash Yojna" },
        { value: "NAIF", label: "NAIF" },
        { value: "Raftaar", label: "Raftaar" },
        { value: "CSR Funding", label: "CSR Funding" },
        { value: "Stand-Up India", label: "Stand-Up India" },
        { value: "PMEGP", label: "PMEGP" },
        { value: "USAID", label: "USAID" },
        { value: "UP Grant", label: "UP Grant" },
        { value: "DBS Grant", label: "DBS Grant" },
        { value: "MSME Innovation", label: "MSME Innovation" },
        { value: "MSME Hackathon", label: "MSME Hackathon" },
        { value: "Gujarat Grant", label: "Gujarat Grant" },
        { value: "CGTMSC", label: "CGTMSC" },
        { value: "Income Tax Exemption", label: "Income Tax Exemption" },
        { value: "Mudra Loan", label: "Mudra Loan" },
        { value: "SIDBI Loan", label: "SIDBI Loan" },
        { value: "Incubation Support", label: "Incubation Support" },
    ];

    // const [selectedOptions, setSelectedOptions] = useState([]);

    const [openBacdrop, setOpenBacdrop] = useState(false); // state for backdrop loader

    // pattern validation

    function isValidEmail(email) {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(email);
    }

    function isValidMobileNo(Mobile) {
        const pattern = /^\d{10}$/;
        return pattern.test(Mobile);
    }

    function isValidAadhaarNumber(aadhaarNumber) {
        const pattern = /^\d{12}$/;
        return pattern.test(aadhaarNumber);
    }

    const handleChange = (selectedOptions) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            SelectServices: selectedOptions.map((option) => option.value),
        }));
    };

    // console.log(formData);

    const [directorLength, setDirectorLength] = useState(1);

    // console.log(directorLength);

    useEffect(() => {
        const simpleArray = [];

        for (let index = 0; index < directorLength; index++) {
            simpleArray.push(DirectorForm);
        }
        const tempFormData = {
            ...formData,
            DirectorDetails: simpleArray,
        };
        setFormData(tempFormData);
    }, [directorLength]);

    // console.log(formData);

    async function sendDataToBackend() {
        setOpenBacdrop(true);
        setFormData((prevState)=>({
            ...prevState,
            formSubmitted:true
        })) // show backdrop loader
        console.log("formData" , formData)
        try {
            const data = new FormData();

            Object.keys(formData).forEach((key) => {
                if (!["DirectorDetails", "SelectServices"].includes(key)) {
                    data.append(key, formData[key]);
                } else if (key === "SelectServices") {
                    Object.keys(formData.SelectServices).forEach((serviceProp, index) => {
                        data.append(
                            `SelectServices[${index}]`,
                            formData.SelectServices[index]
                        );
                    });

                    // data.append(key, JSON.stringify(formData[key]));
                } else {
                    formData.DirectorDetails.forEach((director, index) => {
                        Object.keys(director).forEach((prop) => {
                            if (
                                prop === "DirectorPassportPhoto" ||
                                prop === "DirectorAdharCard"
                            ) {
                                data.append(`${prop}`, director[prop]);
                            } else {
                                data.append(
                                    `DirectorDetails[${index}][${prop}]`,
                                    director[prop]
                                );
                            }
                        });
                    });
                }
            });

            data.append("isFormSubmitted", true);

            const response = await fetch(
                `${secretKey}/clientform/basicinfo-form/${formData.CompanyName}`,
                {
                    method: "POST",
                    body: data
                }
            );

            if (response.ok) {
                // Call function to handle success and show SweetAlert
                handleSuccess();
            } else {
                setFormSubmitted(false);
                console.error("Failed to submit form data:", response.statusText);
                // Handle error case here, optionally show an error message
                Swal.fire({
                    title: "Error!",
                    text: "Failed to submit form data.",
                    icon: "error",
                });
            }
            return response.data; // You can return data from the backend if needed
        } catch (error) {
            console.error("Error sending data to backend:", error);
            Swal.fire({
                title: "Error!",
                text: "Failed to submit form data.",
                icon: "error",
            });
            throw error; // Rethrow the error for handling it in the calling code
        } finally {
            setOpenBacdrop(false); // hide backdrop loader in any case
        }
    }

    const handleSuccess = () => {
        // Show success message using SweetAlert
        Swal.fire({
            title: "Success!",
            text: "Form submitted successfully.",
            icon: "success",
        }).then(() => {
            // Optionally reload the page or handle further actions
            setFormSubmitted(true);
            window.location.reload();
        });
    };

    const maxSizeMB = 24;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    const handleFileChange = (e, fieldName, index = null) => {
        const file = e.target.files[0];
        if (file && file.size > maxSizeBytes) {
            Swal.fire({
                title: "Error!",
                text: `File size should not exceed ${maxSizeMB}MB`,
                icon: "error",
            });
            if (index !== null) {
                setFormData((prevFormData) => {
                    const updatedDirectorDetails = prevFormData.DirectorDetails.map(
                        (director, i) => {
                            if (i === index) {
                                return { ...director, [fieldName]: "" };
                            }
                            return director;
                        }
                    );
                    return { ...prevFormData, DirectorDetails: updatedDirectorDetails };
                });
            } else {
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    [fieldName]: "",
                }));
            }
        } else {
            if (index !== null) {
                setFormData((prevFormData) => {
                    const updatedDirectorDetails = prevFormData.DirectorDetails.map(
                        (director, i) => {
                            if (i === index) {
                                return { ...director, [fieldName]: file };
                            }
                            return director;
                        }
                    );
                    return { ...prevFormData, DirectorDetails: updatedDirectorDetails };
                });
            } else {
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    [fieldName]: file,
                }));
            }
        }
    };

    const handleInputChange = (e, fieldName) => {
        const value = e.target.value;
        const checked = e.target.checked;

        if (fieldName === "BusinessModel") {
            const updatedBusinessModel = [...formData.BusinessModel];
            if (checked) {
                updatedBusinessModel.push(value);
            } else {
                const index = updatedBusinessModel.indexOf(value);
                if (index > -1) {
                    updatedBusinessModel.splice(index, 1);
                }
            }
            setFormData((prevState) => ({
                ...prevState,
                BusinessModel: updatedBusinessModel,
            }));
        } else {
            setFormData((prevState) => ({
                ...prevState,
                [fieldName]: value,
            }));
        }
    };

    const handleDirectorsChange = (e) => {
        const number = parseInt(e.target.value, 10);
        setNumberOfDirectors(number);

        const updatedDirectorDetails = [...formData.DirectorDetails];
        if (number > updatedDirectorDetails.length) {
            for (let i = updatedDirectorDetails.length; i < number; i++) {
                updatedDirectorDetails.push({ name: '', email: '', phone: '' });
            }
        } else {
            updatedDirectorDetails.length = number;
        }

        setFormData({
            ...formData,
            DirectorDetails: updatedDirectorDetails
        });
    };

    const handleSave = async () => {
        console.log("Form data is :", formData);
        try {
            // Post formData using axios
            const response = await axios.post(`${secretKey}/customer/save-company-data`, formData);

            Swal.fire("Data successfully saved", "success");
            console.log("Saved data is:", response.data);
        } catch (error) {
            console.error('Error saving data:', error.response || error.message);
            Swal.fire("Error saving data", "error");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!formData.CompanyName) {
            newErrors.CompanyName = "Company name is required";
        }
        if (!formData.CompanyEmail) {
            newErrors.CompanyEmail = "Email is required";
        }
        if (formData.CompanyEmail !== "" && !isValidEmail(formData.CompanyEmail)) {
            newErrors.CompanyEmail = "Please enter a valid email";
        }
        if (!formData.CompanyNo) {
            newErrors.CompanyNo = "Mobile No is required";
        }
        if (formData.CompanyNo !== "" && !isValidMobileNo(formData.CompanyNo)) {
            newErrors.CompanyNo = "Please enter a valid mobile number";
        }
        if (!formData.CompanyPanNumber) {
            newErrors.CompanyPanNumber = "Pan No is required";
        }
        if (!formData.BrandName && formData.BrandName !== "") {
            newErrors.BrandName = "Enter Brand Name";
        }
        if (!formData.WebsiteLink && formData.WebsiteLink !== "") {
            newErrors.WebsiteLink = "Enter Website Link";
        }
        if (!formData.CompanyAddress && formData.CompanyAddress !== "") {
            newErrors.CompanyAddress = "Enter Company Address";
        }
        if (!formData.CompanyPanNumber && formData.CompanyPanNumber !== "") {
            newErrors.CompanyPanNumber = "Enter Pan Number";
        }
        if (!formData.SelectServices.length && formData.SelectServices !== "") {
            newErrors.SelectServices = "Select Your Services";
        }
        // if (!formData.UploadMOA) {
        //     newErrors.UploadMOA = "Select Your MOA";
        // }
        // if (!formData.UploadAOA) {
        //     newErrors.UploadAOA = "Select Your AOA";
        // }
        if (!formData.CompanyActivities && formData.CompanyActivities !== "") {
            newErrors.CompanyActivities = "Enter Your Company Activities";
        }
        if (!formData.ProductService && formData.ProductService !== "") {
            newErrors.ProductService = "Enter Your Products/Services";
        }
        if (!formData.CompanyUSP && formData.CompanyUSP !== "") {
            newErrors.CompanyUSP = "Enter Your USP";
        }
        if (!formData.ValueProposition && formData.ValueProposition !== "") {
            newErrors.ValueProposition = "Enter Your Company Value Proposition";
        }
        if (!formData.TechnologyInvolved && formData.TechnologyInvolved !== "") {
            newErrors.TechnologyInvolved = "Enter Your Technology Details";
        }
        if (showPhotos && !formData.UploadPhotos) {
            newErrors.UploadPhotos = "Upload Photos of Logo or Product/Prototype";
        }
        if (showIp && !formData.RelevantDocument) {
            newErrors.RelevantDocument = "Upload Relevant Documents";
        }
        // if (!formData.UploadAuditedStatement) {
        //   newErrors.UploadAuditedStatement =
        //     "Upload Audited Profit & Loss and Balance sheet Statment ";
        // }
        // if (
        //   !formData.UploadProvisionalStatement &&
        //   formData.UploadProvisionalStatement !== ""
        // ) {
        //   newErrors.UploadProvisionalStatement =
        //     " Upload Provisional Statement or Accounts report till date for Projection ";
        // }
        if (!formData.CompanyActivities) {
            newErrors.CompanyActivities = "Please enter company's activity";
        }
        if (!formData.ProductService) {
            newErrors.ProductService = "Please enter your service";
        }
        if (!formData.CompanyUSP) {
            newErrors.CompanyUSP = "Please enter company's USP";
        }
        if (!formData.ValueProposition) {
            newErrors.ValueProposition = "Please enter company's value proposition";
        }
        // ITR related validations
        if (showItr === null) {
            newErrors.ITR = "Please select ITR Option";
        } else if (showItr && !formData.UploadAuditedStatement) {
            newErrors.UploadAuditedStatement =
                "Upload Audited Profit & Loss and Balance Sheet Statement is required.";
        }
        if (!formData.DirectInDirectMarket) {
            newErrors.DirectInDirectMarket = "Enter Direct/InDirect Competitor";
        }
        if (!formData.BusinessModel) {
            newErrors.BusinessModel = "Please Select Business Model";
        }
        if (!formData.Finance && formData.Finance !== "") {
            newErrors.Finance = "Enter The Details of Grant";
        }
        // if (!formData.UploadDeclaration) {
        //     newErrors.UploadDeclaration = "Please Upload Declaration";
        // }
        // if (!formData.UploadRelevantDocs) {
        //     newErrors.UploadRelevantDocs = "Please Upload Relevant Docs";
        // }
        if (!formData.DirectorDetails.some((obj) => obj.IsMainDirector === true)) {
            newErrors.IsMainDirector = "Please Select Authorised person";
        }

        formData.DirectorDetails.forEach((director, index) => {
            if (!director.DirectorName) {
                newErrors[`DirectorName${index}`] = `Enter Director Name for Director ${index + 1
                    }`;
            }
            if (!director.DirectorEmail) {
                newErrors[
                    `DirectorEmail${index}`
                ] = `Enter Director Email Id for Director ${index + 1}`;
            } else if (!isValidEmail(director.DirectorEmail)) {
                newErrors[
                    `DirectorEmail${index}`
                ] = `Please enter a valid email for Director ${index + 1}`;
            }
            if (!director.DirectorMobileNo) {
                newErrors[
                    `DirectorMobileNo${index}`
                ] = `Enter Director Mobile No for Director ${index + 1}`;
            }
            if (!director.DirectorQualification) {
                newErrors[
                    `DirectorQualification${index}`
                ] = `Enter Director Qualification for Director ${index + 1}`;
            }
            if (!director.DirectorWorkExperience) {
                newErrors[
                    `DirectorWorkExperience${index}`
                ] = `Enter Director Work Experience for Director ${index + 1}`;
            }
            if (!director.DirectorAnnualIncome) {
                newErrors[
                    `DirectorAnnualIncome${index}`
                ] = `Enter Director Annual Income for Director ${index + 1}`;
            }
            // if (!director.DirectorPassportPhoto) {
            //     newErrors[
            //         `DirectorPassportPhoto${index}`
            //     ] = `Upload Photo for Director ${index + 1}`;
            // }
            if (!director.DirectorAdharCard) {
                newErrors[
                    `DirectorAdharCard${index}`
                ] = `Upload your Adhar Card for Director ${index + 1}`;
            }
            if (!director.DirectorAdharCardNumber) {
                newErrors[
                    `DirectorAdharCardNumber${index}`
                ] = `Enter Director Adhar Card Number for Director ${index + 1}`;
            } else if (!isValidAadhaarNumber(director.DirectorAdharCardNumber)) {
                newErrors[
                    `DirectorAdharCardNumber${index}`
                ] = `Please enter a valid 12-digit Aadhaar Card Number for Director ${index + 1
                }`;
            }
            if (!director.DirectorDesignation) {
                newErrors[
                    `DirectorDesignation${index}`
                ] = `Enter Director Designation for Director ${index + 1}`;
            }
            if (!director.DirectorGender) {
                newErrors[
                    `DirectorGender${index}`
                ] = `Select Director Gender for Director ${index + 1}`;
            }
        });

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            setFormSubmitted(true);
            Swal.fire({
                icon: "error",
                title: "Incorrect Details",
                html: Object.values(newErrors).join("<br>"),
            });
            return;
        }

        // console.log(newErrors);

        // setFormSubmitted(true);
        await sendDataToBackend();
    };

    const functionShowSizeLimit = (file) => {
        const maxSizeMB = 24;
        const maxSizeBytes = maxSizeMB * 1024 * 1024;

        if (file.size > maxSizeBytes) {
            Swal.fire(
                "Size limit exceeded!",
                "Please upload a file less than 24MB",
                "warning"
            );
            return false;
        } else {
            return true;
        }
    };

    const handleRadioChange = (e, index) => {
        setShowLinks(e.target.value === "Yes");

        setFormData((prevState) => ({
            ...prevState,
            SocialMedia: e.target.value,
            DirectorDetails: prevState.DirectorDetails.map((director, i) => ({
                ...director,
                IsMainDirector: i === index,
            })),
        }));
    };

    const handleRadioChanges = (event) => {
        const selectedValue = event.target.value;
        setShowTechnologyDetails(selectedValue === "Yes");
        setFormData((prevState) => ({
            ...prevState,
            TechnologyInvolved: selectedValue,
            TechnologyDetails: selectedValue === "No" ? "" : prevState.TechnologyDetails,
        }));
    };

    const handlePhotos = (event) => {
        const isYesSelected = event.target.value === "Yes";
        setShowPhotos(isYesSelected);
        setFormData((prevState) => ({
            ...prevState,
            ProductPhoto: isYesSelected ? "Yes" : "No",
            // Reset ProductPhoto if "No" is selected
            //UploadPhotos: !isYesSelected ? null : prevState.UploadPhotos
            UploadPhotos: null
        }));
    };


    const handleIp = (event) => {
        const isYesSelected = event.target.value === "Yes";
        setShowIp(isYesSelected);
        setFormData((prevState) => ({
            ...prevState,
            AnyIpFiledResponse: isYesSelected ? "Yes" : "No",
            // Clear IP file if "No" is selected
            RelevantDocument: !isYesSelected ? null : prevState.RelevantDocument
        }));
    };

    const handleItr = (event) => {
        const selectedValue = event.target.value;
        setShowItr(selectedValue === "Yes");
        setFormData((prevState) => ({
            ...prevState,
            ItrStatus: selectedValue,
            UploadAuditedStatement: selectedValue === "No" ? null : prevState.UploadAuditedStatement,
            UploadProvisionalStatement: selectedValue === "Yes" ? null : prevState.UploadProvisionalStatement,
        }));
    };

    const handleFinance = (event) => {
        setShowFinance(event.target.value === "Yes");
        setFormData({
            ...formData,
            FinanceCondition: event.target.value,
        });
    };

    // console.log("showfinance" , showFinance);

    const getEmailContent = () => {
        const { BusinessModel } = formData;
        return <div>{BusinessModel.join(", ")}</div>;
    };

    // Director and Team Details code
    const renderDirectorFields = () => {
        return Array.from({ length: numberOfDirectors }, (_, index) => (
            <div className="card mt-2">
                <div className="card-body p-3">
                    <div className="directors-details-box p-3" key={index}>
                        <div className="row">

                            <div className="col-lg-12 d-flex align-items-center justify-content-between">
                                <h5>{index + 1}</h5>
                                <div>
                                    <label className="Director">
                                        Authorized Person {" "}
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <input
                                        type="radio"
                                        name="maindirector_radio"
                                        checked={formData.DirectorDetails[index.IsMainDirector]}
                                        disabled={formSubmitted}
                                        onChange={() => {
                                            setFormData((prevState) => ({
                                                ...prevState,
                                                DirectorDetails: prevState.DirectorDetails.map(
                                                    (director, i) =>
                                                        i === index
                                                            ? { ...director, IsMainDirector: true }
                                                            : { ...director, IsMainDirector: false }
                                                ),
                                            }));
                                        }}
                                    />
                                    {formSubmitted && errors.IsMainDirector && (
                                        <div style={{ color: "red" }}>{errors.IsMainDirector}</div>
                                    )}
                                </div>
                            </div>

                            <div className="col-lg-3">
                                <div className="form-group mt-2 mb-2">
                                    <label htmlFor={`DirectorName${index}`}>
                                        Enter Director's Name{" "}
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        className="form-control mt-1"
                                        placeholder="Enter Director's Name "
                                        id={`DirectorName${index}`}
                                        value={formData.DirectorDetails[index]?.DirectorName || ""}
                                        disabled={formSubmitted}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setFormData((prevState) => ({
                                                ...prevState,
                                                DirectorDetails: prevState.DirectorDetails.map(
                                                    (DirectorDetails, i) =>
                                                        i === index
                                                            ? { ...DirectorDetails, DirectorName: value }
                                                            : DirectorDetails
                                                ),
                                            }));
                                        }}
                                    />
                                    {formSubmitted &&
                                        !formData.DirectorDetails[index]?.DirectorName && (
                                            <div style={{ color: "red" }}>Enter Director Name</div>
                                        )}
                                </div>
                            </div>

                            <div className="col-lg-3">
                                <div className="form-group mt-2 mb-2">
                                    <label htmlFor={`DirectorEmail${index}`}>
                                        Enter Director's Email{" "}
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <input
                                        required
                                        type="email"
                                        className="form-control mt-1"
                                        placeholder="Enter Director's Email"
                                        id={`DirectorEmail${index}`}
                                        value={formData.DirectorDetails[index]?.DirectorEmail || ""}
                                        disabled={formSubmitted}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setFormData((prevState) => ({
                                                ...prevState,
                                                DirectorDetails: prevState.DirectorDetails.map(
                                                    (director, i) =>
                                                        i === index
                                                            ? { ...director, DirectorEmail: value }
                                                            : director
                                                ),
                                            }));
                                        }}
                                    />
                                    {formSubmitted &&
                                        !formData.DirectorDetails[index]?.DirectorEmail && (
                                            <div style={{ color: "red" }}>Enter Director Email</div>
                                        )}
                                </div>
                            </div>

                            <div className="col-lg-3">
                                <div className="form-group mt-2 mb-2">
                                    <label htmlFor={`DirectorMobileNo${index}`}>
                                        Enter Director's Mobile No{" "}
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        className="form-control mt-1"
                                        placeholder="Enter Director's Mobile No "
                                        id={`DirectorMobileNo${index}`}
                                        value={formData.DirectorDetails[index]?.DirectorMobileNo || ""}
                                        disabled={formSubmitted}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setFormData((prevState) => ({
                                                ...prevState,
                                                DirectorDetails: prevState.DirectorDetails.map(
                                                    (director, i) =>
                                                        i === index
                                                            ? { ...director, DirectorMobileNo: value }
                                                            : director
                                                ),
                                            }));
                                        }}
                                    />
                                    {formSubmitted &&
                                        !formData.DirectorDetails[index]?.DirectorMobileNo && (
                                            <div style={{ color: "red" }}>
                                                Enter Director Mobile No
                                            </div>
                                        )}
                                </div>
                            </div>

                            <div className="col-lg-3">
                                <div className="form-group mt-2 mb-2">
                                    <label htmlFor={`DirectorQualification${index}`}>
                                        Enter Director's Qualification{" "}
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        className="form-control mt-1"
                                        placeholder="Enter Director's Qualification"
                                        id={`DirectorQualification${index}`}
                                        value={formData.DirectorDetails[index]?.DirectorQualification || ""}
                                        disabled={formSubmitted}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setFormData((prevState) => ({
                                                ...prevState,
                                                DirectorDetails: prevState.DirectorDetails.map(
                                                    (director, i) =>
                                                        i === index
                                                            ? { ...director, DirectorQualification: value }
                                                            : director
                                                ),
                                            }));
                                        }}
                                    />
                                    {formSubmitted &&
                                        !formData.DirectorDetails[index]?.DirectorQualification && (
                                            <div style={{ color: "red" }}>
                                                Enter Director Qualification
                                            </div>
                                        )}
                                </div>
                            </div>

                            <div className="col-lg-3">
                                <div className="form-group mt-2 mb-2">
                                    <label htmlFor={`Directorexp${index}`}>
                                        Director's Work Experience (In Detail){" "}
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        className="form-control mt-1"
                                        placeholder="Enter Director's Work Experience (In Detail)"
                                        id={`Directorexp${index}`}
                                        value={formData.DirectorDetails[index]?.DirectorWorkExperience || ""}
                                        disabled={formSubmitted}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setFormData((prevState) => ({
                                                ...prevState,
                                                DirectorDetails: prevState.DirectorDetails.map(
                                                    (director, i) =>
                                                        i === index
                                                            ? { ...director, DirectorWorkExperience: value }
                                                            : director
                                                ),
                                            }));
                                        }}
                                    />
                                    {formSubmitted &&
                                        !formData.DirectorDetails[index]
                                            ?.DirectorWorkExperience && (
                                            <div style={{ color: "red" }}>
                                                Enter Director Work Experience
                                            </div>
                                        )}
                                </div>
                            </div>

                            <div className="col-lg-3">
                                <div className="form-group mt-2 mb-2">
                                    <label htmlFor={`Directorincome${index}`}>
                                        Annual Income Of Director's Family (Approx):{" "}
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        className="form-control mt-1"
                                        placeholder="Enter Annual Income Of Director's Family (Approx):"
                                        id={`Directorincome${index}`}
                                        value={formData.DirectorDetails[index]?.DirectorAnnualIncome || ""}
                                        disabled={formSubmitted}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setFormData((prevState) => ({
                                                ...prevState,
                                                DirectorDetails: prevState.DirectorDetails.map(
                                                    (director, i) =>
                                                        i === index
                                                            ? { ...director, DirectorAnnualIncome: value }
                                                            : director
                                                ),
                                            }));
                                        }}
                                    />
                                    {formSubmitted &&
                                        !formData.DirectorDetails[index]
                                            ?.DirectorAnnualIncome && (
                                            <div style={{ color: "red" }}>
                                                Enter Director Annual Income (Approx)
                                            </div>
                                        )}
                                </div>
                            </div>

                            <div className="col-lg-3">
                                <div className="form-group mt-2 mb-2">
                                    <label htmlFor={`DirectorPassportPhoto${index}`}>
                                        Director's Passport Size Photo{" "}
                                        {/* <span style={{ color: "red" }}>*</span> */}
                                    </label>
                                    <input
                                        required
                                        type="file"
                                        className="form-control mt-1"
                                        id={`DirectorPassportPhoto${index}`}
                                        // value={formData.DirectorDetails[index]?.DirectorPassportPhoto || ""}
                                        disabled={formSubmitted}
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (functionShowSizeLimit(file)) {
                                                setFormData((prevState) => ({
                                                    ...prevState,
                                                    DirectorDetails: prevState.DirectorDetails.map(
                                                        (director, i) =>
                                                            i === index
                                                                ? {
                                                                    ...director,
                                                                    DirectorPassportPhoto: file,
                                                                }
                                                                : director
                                                    ),
                                                }));
                                            } else {
                                                e.target.value = null; // Clear the input value to prevent invalid file selection
                                            }
                                        }}
                                    />
                                    <div className="input-note">
                                        (Files size should be less than 24MB)
                                    </div>
                                    {/* {formSubmitted &&
                                        !formData.DirectorDetails[index]?.DirectorPassportPhoto && (
                                            <div style={{ color: "red" }}>
                                                Upload Director Photo
                                            </div>
                                        )} */}
                                </div>
                            </div>

                            <div className="col-lg-3">
                                <div className="form-group mt-2 mb-2">
                                    <label htmlFor={`DirectorAdharCard${index}`}>
                                        Director's Aadhaar Card{" "}
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <input
                                        required
                                        type="file"
                                        className="form-control mt-1"
                                        id={`DirectorAdharCard${index}`}
                                        // value={formData.DirectorDetails[index]?.DirectorAdharCard || ""}
                                        disabled={formSubmitted}
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (functionShowSizeLimit(file)) {
                                                setFormData((prevState) => ({
                                                    ...prevState,
                                                    DirectorDetails: prevState.DirectorDetails.map(
                                                        (director, i) =>
                                                            i === index
                                                                ? {
                                                                    ...director,
                                                                    DirectorAdharCard: file,
                                                                }
                                                                : director
                                                    ),
                                                }));
                                            } else {
                                                e.target.value = null; // Clear the input value to prevent invalid file selection
                                            }
                                        }}
                                    />
                                    <div className="input-note">
                                        (Files size should be less than 24MB)
                                    </div>
                                    {formSubmitted &&
                                        !formData.DirectorDetails[index]?.DirectorAdharCard && (
                                            <div style={{ color: "red" }}>
                                                Upload Director AdharCard
                                            </div>
                                        )}
                                </div>
                            </div>

                            <div className="col-lg-3">
                                <div className="form-group mt-2 mb-2">
                                    <label htmlFor={`DirectorAdharCardNumber${index}`}>
                                        Director's Aadhaar Number
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control mt-1"
                                        placeholder="Enter Director AdharCard Number"
                                        id={`DirectorAdharCardNumber${index}`}
                                        value={formData.DirectorDetails[index]?.DirectorAdharCardNumber || ""}
                                        disabled={formSubmitted}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setFormData((prevState) => ({
                                                ...prevState,
                                                DirectorDetails: prevState.DirectorDetails.map(
                                                    (director, i) =>
                                                        i === index
                                                            ? { ...director, DirectorAdharCardNumber: value }
                                                            : director
                                                ),
                                            }));
                                        }}
                                    />
                                    {formSubmitted &&
                                        (!formData.DirectorDetails[index]
                                            ?.DirectorAdharCardNumber ||
                                            !isValidAadhaarNumber(
                                                formData.DirectorDetails[index]
                                            )) && (
                                            <div style={{ color: "red", marginTop: "0.5rem" }}>
                                                {!formData.DirectorDetails[index]
                                                    ?.DirectorAdharCardNumber
                                                    ? "Enter Director AdharCard Number"
                                                    : !isValidAadhaarNumber(
                                                        formData.DirectorDetails[index]
                                                            ?.DirectorAdharCardNumber
                                                    )
                                                        ? "Enter a valid 12-digit Aadhaar Card Number"
                                                        : null}
                                            </div>
                                        )}
                                </div>
                            </div>

                            <div className="col-lg-3">
                                <div className="form-group mt-2 mb-2">
                                    <label htmlFor={`DirectorDesignation${index}`}>
                                        Director's Designation
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control mt-1"
                                        placeholder="Enter Director Designation"
                                        id={`DirectorDesignation${index}`}
                                        value={formData.DirectorDetails[index]?.DirectorDesignation || ""}
                                        disabled={formSubmitted}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setFormData((prevState) => ({
                                                ...prevState,
                                                DirectorDetails: prevState.DirectorDetails.map(
                                                    (director, i) =>
                                                        i === index
                                                            ? { ...director, DirectorDesignation: value }
                                                            : director
                                                ),
                                            }));
                                        }}
                                    />
                                    {formSubmitted &&
                                        !formData.DirectorDetails[index]?.DirectorDesignation && (
                                            <div style={{ color: "red" }}>
                                                Enter Director Designation
                                            </div>
                                        )}
                                </div>
                            </div>

                            <div className="col-lg-3">
                                <div className="form-group mt-2 mb-2 gender">
                                    <label htmlFor={`DirectorGender${index}`}>
                                        Choose Director's Gender
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <div className="d-flex align-items-center mt-2">
                                        <label className="form-check form-check-inline m-0 me-2">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name={`DirectorGender${index}`}
                                                value="Male"
                                                checked={formData.DirectorDetails[index]?.DirectorGender === "Male"}
                                                disabled={formSubmitted}
                                                onChange={(e) => {
                                                    setFormData((prevState) => ({
                                                        ...prevState,
                                                        DirectorDetails: prevState.DirectorDetails.map(
                                                            (DirectorDetails, i) =>
                                                                i === index
                                                                    ? {
                                                                        ...DirectorDetails,
                                                                        DirectorGender: e.target.value,
                                                                    }
                                                                    : DirectorDetails
                                                        ),
                                                    }));
                                                }}
                                            />
                                            <span className="form-check-label">Male</span>
                                        </label>
                                        <label className="form-check form-check-inline m-0">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name={`DirectorGender${index}`}
                                                value="Female"
                                                checked={formData.DirectorDetails[index]?.DirectorGender === "Female"}
                                                disabled={formSubmitted}
                                                onChange={(e) => {
                                                    setFormData((prevState) => ({
                                                        ...prevState,
                                                        DirectorDetails: prevState.DirectorDetails.map(
                                                            (DirectorDetails, i) =>
                                                                i === index
                                                                    ? {
                                                                        ...DirectorDetails,
                                                                        DirectorGender: e.target.value,
                                                                    }
                                                                    : DirectorDetails
                                                        ),
                                                    }));
                                                }}
                                            />
                                            <span className="form-check-label">Female</span>
                                        </label>
                                    </div>
                                    {formSubmitted &&
                                        !formData.DirectorDetails[index]?.DirectorGender && (
                                            <div style={{ color: "red" }}>
                                                Select the Director Gender
                                            </div>
                                        )}
                                </div>
                            </div>

                            <div className="col-lg-3">
                                <div className="form-group mt-2 mb-2">
                                    <label htmlFor={`DirectorLinkedIn${index}`}>
                                        LinkedIn Profile Link
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control mt-1"
                                        placeholder="Enter LinkedIn Profile Link"
                                        id={`DirectorLinkedIn${index}`}
                                        value={formData.DirectorDetails[index]?.LinkedInProfileLink || ""}
                                        disabled={formSubmitted}
                                        onChange={(e) => {
                                            setFormData((prevState) => ({
                                                ...prevState,
                                                DirectorDetails: prevState.DirectorDetails.map(
                                                    (DirectorDetails, i) =>
                                                        i === index
                                                            ? {
                                                                ...DirectorDetails,
                                                                LinkedInProfileLink: e.target.value,
                                                            }
                                                            : DirectorDetails
                                                ),
                                            }));
                                        }}
                                    />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        ));
    };

    return (
        <div>
            <div className="basic-info-page-body">

                <form className="basic-info-form" onSubmit={handleSubmit}>
                    <div className="container-xl">
                        <div className="basic-info-form-head mt-4 mb-2">
                            <h2 className="m-0">Basic Information</h2>
                        </div>
                        <div className="card mt-2">
                            <div className="card-body p-3">
                                <div className="row">

                                    <div className="col-lg-4">
                                        <div className="form-group mt-2 mb-2">
                                            <label htmlFor="Company">
                                                Company Name: <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <input
                                                required
                                                type="text"
                                                className="form-control mt-1"
                                                placeholder="Enter Company Name"
                                                id="Company"
                                                value={formData.CompanyName}
                                                disabled={formSubmitted}
                                                onChange={(e) => handleInputChange(e, "CompanyName")}
                                            />
                                            {formSubmitted && errors.CompanyName && (
                                                <div style={{ color: "red" }}>{errors.CompanyName}</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-lg-4">
                                        <div className="form-group mt-2 mb-2">
                                            <label htmlFor="CompanyEmail">
                                                Email Address: <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <input
                                                required
                                                type="email"
                                                className="form-control mt-1"
                                                placeholder="Enter Company Email"
                                                id="CompanyEmail"
                                                value={formData.CompanyEmail}
                                                disabled={formSubmitted}
                                                onChange={(e) => handleInputChange(e, "CompanyEmail")}
                                                pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                                                title="Enter a valid email address"
                                            />
                                            {formSubmitted &&
                                                formData.CompanyEmail !== "" &&
                                                !isValidEmail(formData.CompanyEmail) || (
                                                    <div style={{ color: "red" }}>
                                                        {errors.CompanyEmail}
                                                    </div>
                                                )}
                                        </div>
                                    </div>

                                    <div className="col-lg-4">
                                        <div className="form-group mt-2 mb-2">
                                            <label htmlFor="CompanyNo">
                                                Phone No: <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <input
                                                required
                                                type="tel"
                                                className="form-control mt-1"
                                                placeholder="Enter Company Phone No."
                                                id="CompanyNo"
                                                value={formData.CompanyNo}
                                                disabled={formSubmitted}
                                                onChange={(e) => handleInputChange(e, "CompanyNo")}
                                            />
                                            {formSubmitted && !formData.CompanyNo && (
                                                <div style={{ color: "red" }}>
                                                    {"Enter Mobile Number"}
                                                </div>
                                            )}
                                            {formSubmitted &&
                                                formData.CompanyNo !== "" &&
                                                !isValidMobileNo(formData.CompanyNo) && (
                                                    <div style={{ color: "red" }}>{errors.CompanyNo}</div>
                                                )}
                                        </div>
                                    </div>

                                    <div className="col-lg-3">
                                        <div className="form-group mt-2 mb-2">
                                            <label htmlFor="Brand-Name">Brand Name (If any):</label>
                                            <input
                                                required
                                                type="text"
                                                className="form-control mt-1"
                                                placeholder="Enter Brand Name"
                                                id="Brand-Name"
                                                value={formData.BrandName}
                                                disabled={formSubmitted}
                                                onChange={(e) => handleInputChange(e, "BrandName")}
                                            />
                                            {/* {formSubmitted && !formData.BrandName && (
                                                <div style={{ color: "red" }}>{"Enter Brand Name"}</div>
                                            )} */}
                                        </div>
                                    </div>

                                    <div className="col-lg-3">
                                        <div className="form-group mt-2 mb-2">
                                            <label htmlFor="WebsiteLink">
                                                Website's Link (If any):
                                            </label>
                                            <input
                                                required
                                                type="text"
                                                className="form-control mt-1"
                                                placeholder="Enter Website's Link"
                                                id="WebsiteLink"
                                                value={formData.WebsiteLink}
                                                disabled={formSubmitted}
                                                onChange={(e) => handleInputChange(e, "WebsiteLink")}
                                            />
                                            {/* {formSubmitted && !formData.WebsiteLink && (
                                                <div style={{ color: "red" }}>
                                                    {"Mention Website Link"}
                                                </div>
                                            )} */}
                                        </div>
                                    </div>

                                    <div className="col-lg-3">
                                        <div className="form-group mt-2 mb-2">
                                            <label htmlFor="WebsiteLink">Company Address: </label>
                                            <input
                                                required
                                                type="text"
                                                className="form-control mt-1"
                                                placeholder="Enter Company Address"
                                                id="CompanyAddress"
                                                value={formData.CompanyAddress}
                                                disabled={formSubmitted}
                                                onChange={(e) => handleInputChange(e, "CompanyAddress")}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-3">
                                        <div className="form-group mt-2 mb-2">
                                            <label htmlFor="WebsiteLink">
                                                Company Pan Number:{" "}
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <input
                                                required
                                                type="text"
                                                className="form-control mt-1"
                                                placeholder="Enter Pan Number"
                                                id="CompanyPanNumber"
                                                value={formData.CompanyPanNumber}
                                                disabled={formSubmitted}
                                                onChange={(e) => handleInputChange(e, "CompanyPanNumber")}
                                            />
                                            {formSubmitted && !formData.CompanyPanNumber && (
                                                <div style={{ color: "red" }}>{"Enter Pan Number"}</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-lg-4">
                                        <div className="mt-2 mb-2">
                                            <label htmlFor="Services">
                                                Select Your Services{" "}
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <Select
                                                className="mt-1"
                                                isMulti
                                                options={options1}
                                                id="Services"
                                                value={options1.filter((option) =>
                                                    formData.SelectServices.includes(option.value)
                                                )}
                                                placeholder="SelectServices"
                                                onChange={handleChange}
                                            >
                                                {options1.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </Select>
                                            {formSubmitted && !formData.SelectServices.length && (
                                                <div style={{ color: "red" }}>
                                                    {"Select Your Services"}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-lg-4">
                                        <div className="form-group mt-2 mb-2">
                                            <label htmlFor="Upload-MOA">Upload MOA{" "}
                                                {/* <span style={{ color: "red" }}>*</span> */}
                                            </label>
                                            <input
                                                type="file"
                                                class="form-control mt-1"
                                                id="Upload-MOA"
                                                disabled={formSubmitted}
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    // console.log("file" , file);
                                                    if (functionShowSizeLimit(file)) {
                                                        setFormData((prevState) => ({
                                                            ...prevState,
                                                            UploadMOA: file,
                                                        }));
                                                    } else {
                                                        e.target.value = null; // Clear the input value to prevent invalid file selection
                                                    }
                                                }}
                                            />
                                            <div className="input-note">
                                                (Files size should be less than 24MB)
                                            </div>
                                            {/* {formSubmitted && errors.UploadMOA && (
                                                <div style={{ color: "red" }}>
                                                    {errors.UploadMOA}
                                                </div>
                                            )} */}
                                        </div>
                                    </div>

                                    <div className="col-lg-4">
                                        <div className="form-group mt-2 mb-2">
                                            <label htmlFor="Upload-AOA">Upload AOA{" "}
                                                {/* <span style={{ color: "red" }}>*</span> */}
                                            </label>
                                            <input
                                                type="file"
                                                className="form-control mt-1"
                                                id="Upload-AOA"
                                                disabled={formSubmitted}
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (functionShowSizeLimit(file)) {
                                                        setFormData((prevState) => ({
                                                            ...prevState,
                                                            UploadAOA: file,
                                                        }));
                                                    } else {
                                                        e.target.value = null; // Clear the input value to prevent invalid file selection
                                                    }
                                                }}
                                            />
                                            <div className="input-note">
                                                (Files size should be less than 24MB)
                                            </div>
                                            {/* {formSubmitted && errors.UploadAOA && (
                                                <div style={{ color: "red" }}>
                                                    {errors.UploadAOA}
                                                </div>
                                            )} */}
                                        </div>
                                    </div>

                                    <div className="col-lg-12">
                                        <div className="form-group d-flex align-items-center mt-2 mb-2">
                                            <label className="m-0" htmlFor="SocialMediaLink">
                                                Do You have Social Media Link?
                                            </label>
                                            <div className="d-flex ms-2">
                                                <label className="form-check form-check-inline m-0 me-2">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="socialMediaLink"
                                                        value="Yes"
                                                        disabled={formSubmitted}
                                                        onChange={handleRadioChange}
                                                        checked={formData.SocialMedia === "Yes"}
                                                    />
                                                    <span className="form-check-label">Yes</span>
                                                </label>
                                                <label className="form-check form-check-inline m-0">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="socialMediaLink"
                                                        value="No"
                                                        disabled={formSubmitted}
                                                        onChange={handleRadioChange}
                                                        checked={formData.SocialMedia === "No"}
                                                    />
                                                    <span className="form-check-label">No</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {showLinks && (
                                        <div className="col-lg-12">
                                            <div className="row">

                                                <div className="col-lg-3">
                                                    <div className="form-group mt-2 mb-2">
                                                        <label htmlFor="Facebook_link">
                                                            Facebook link:
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control mt-1"
                                                            placeholder="Enter Facebook link"
                                                            id="Facebook_link"
                                                            value={formData.FacebookLink}
                                                            disabled={formSubmitted}
                                                            onChange={(e) => handleInputChange(e, "FacebookLink")}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-3">
                                                    <div className="form-group mt-2 mb-2">
                                                        <label htmlFor="Instagram_link">
                                                            Instagram link:
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control mt-1"
                                                            placeholder="Enter Instagram link"
                                                            id="Instagram_link"
                                                            value={formData.InstagramLink}
                                                            disabled={formSubmitted}
                                                            onChange={(e) => handleInputChange(e, "InstagramLink")}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-3">
                                                    <div className="form-group mt-2 mb-2">
                                                        <label htmlFor="LinkedIn_link">
                                                            LinkedIn link:
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control mt-1"
                                                            placeholder="Enter LinkedIn link"
                                                            id="LinkedIn_link"
                                                            value={formData.LinkedInLink}
                                                            disabled={formSubmitted}
                                                            onChange={(e) => handleInputChange(e, "LinkedInLink")}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-3">
                                                    <div className="form-group mt-2 mb-2">
                                                        <label htmlFor="YouTube_link">YouTube link:</label>
                                                        <input
                                                            type="text"
                                                            className="form-control mt-1"
                                                            placeholder="Enter YouTube link"
                                                            id="YouTube_link"
                                                            value={formData.YoutubeLink}
                                                            disabled={formSubmitted}
                                                            onChange={(e) =>handleInputChange(e, "YoutubeLink")}
                                                        />
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="basic-info-form-head mt-4 mb-2">
                            <h2 className="m-0">Brief About Your Business</h2>
                        </div>

                        <div className="card mt-2">
                            <div className="card-body p-3">
                                <div className="row">

                                    <div className="col-lg-6">
                                        <div className="form-group mt-2 mb-2">
                                            <label htmlFor="Brief">
                                                Brief Of Your Business/Product/Service (Company's
                                                Activities): <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <textarea
                                                required
                                                className="form-control mt-1"
                                                placeholder="Brief Of Your Business"
                                                id="Brief"
                                                value={formData.CompanyActivities}
                                                disabled={formSubmitted}
                                                onChange={(e) => handleInputChange(e, "CompanyActivities")}
                                            ></textarea>
                                            {formSubmitted && !formData.CompanyActivities && (
                                                <div style={{ color: "red" }}>
                                                    {"Enter Company Activities"}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-lg-6">
                                        <div className="form-group mt-2 mb-2">
                                            <label htmlFor="Problems">
                                                What Are The Problems That Your Product Or Service
                                                Proposes To Solve And How?{" "}
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <textarea
                                                required
                                                className="form-control mt-1"
                                                placeholder="Brief Of Problems and Solutions"
                                                id="Problems"
                                                value={formData.ProductService}
                                                disabled={formSubmitted}
                                                onChange={(e) => handleInputChange(e, "ProductService")}
                                            ></textarea>
                                            {formSubmitted && !formData.ProductService && (
                                                <div style={{ color: "red" }}>
                                                    {"Enter Problems And Solutions"}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-lg-6">
                                        <div className="form-group mt-2 mb-2">
                                            <label htmlFor="USP">
                                                Core Strength Of Your Business Which Differs Your
                                                Company From Other Business In The Industry (USP) <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <textarea
                                                required
                                                className="form-control mt-1"
                                                placeholder="USP"
                                                id="USP"
                                                value={formData.CompanyUSP}
                                                disabled={formSubmitted}
                                                onChange={(e) => handleInputChange(e, "CompanyUSP")}
                                            ></textarea>
                                            {formSubmitted && !formData.CompanyUSP && (
                                                <div style={{ color: "red" }}>
                                                    {"Enter Company USP"}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-lg-6">
                                        <div className="form-group mt-2 mb-2">
                                            <label htmlFor="ValueProposition">
                                                Value Proposition Of Your Project{" "}
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <textarea
                                                required
                                                className="form-control mt-1"
                                                placeholder="Value Proposition"
                                                id="ValueProposition"
                                                value={formData.ValueProposition}
                                                disabled={formSubmitted}
                                                onChange={(e) => handleInputChange(e, "ValueProposition")}
                                            ></textarea>
                                            {formSubmitted && !formData.ValueProposition && (
                                                <div style={{ color: "red" }}>
                                                    {"Enter Company Value Proposition Of Your Project"}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-lg-12">
                                        <hr className="mt-1 mb-1" />
                                    </div>

                                    <div className="col-lg-6">
                                        <div className="form-group mt-2 mb-2">
                                            <label className="m-0">
                                                Any Kind Of Technology Is Involved In Your Product Or
                                                Service?
                                            </label>
                                            <div className="d-flex align-items-center">
                                                <label className="form-check form-check-inline m-0 me-2">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="technologyInvolved"
                                                        value="Yes"
                                                        disabled={formSubmitted}
                                                        onChange={handleRadioChanges}
                                                        checked={formData.TechnologyInvolved === "Yes"}
                                                    />
                                                    <span className="form-check-label">Yes</span>
                                                </label>
                                                <label className="form-check form-check-inline m-0">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="technologyInvolved"
                                                        value="No"
                                                        disabled={formSubmitted}
                                                        onChange={handleRadioChanges}
                                                        checked={formData.TechnologyInvolved === "No"}
                                                    />
                                                    <span className="form-check-label">No</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {showTechnologyDetails && (
                                        <div className="col-lg-6">
                                            <div className="form-group mt-2 mb-2">
                                                <label className="m-0">
                                                    Add Details About Technology Involved
                                                    <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <textarea
                                                    className="form-control mt-1"
                                                    placeholder="Technology details"
                                                    id="TechnologyDetails"
                                                    value={formData.TechnologyDetails}
                                                    disabled={formSubmitted}
                                                    onChange={(e) => handleInputChange(e, "TechnologyDetails")}
                                                ></textarea>
                                                {formSubmitted && !formData.TechnologyInvolved && (
                                                    <div style={{ color: "red" }}>
                                                        {"Enter Technology"}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div class="col-lg-12">
                                        <hr class="mt-1 mb-1" />
                                    </div>

                                    <div class="col-lg-6">
                                        <div class="form-group mt-2 mb-2">
                                            <label class="m-0">
                                                {" "}
                                                Do You Have Photos Of Product/Prototype Or LOGO?
                                            </label>
                                            <div class="d-flex align-items-center">
                                                <label class="form-check form-check-inline m-0 me-2">
                                                    <input
                                                        class="form-check-input"
                                                        type="radio"
                                                        name="Photos"
                                                        value="Yes"
                                                        disabled={formSubmitted}
                                                        onChange={handlePhotos}
                                                        checked={formData.ProductPhoto === "Yes"}
                                                    />
                                                    <span class="form-check-label">Yes</span>
                                                </label>
                                                <label class="form-check form-check-inline m-0">
                                                    <input
                                                        class="form-check-input"
                                                        type="radio"
                                                        name="Photos"
                                                        value="No"
                                                        disabled={formSubmitted}
                                                        onChange={handlePhotos}
                                                        checked={formData.ProductPhoto === "No"}
                                                    />
                                                    <span class="form-check-label">No</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {showPhotos && (
                                        <div className="col-lg-6">
                                            <div className="form-group mt-2 mb-2">
                                                <label htmlFor="Photos-logos">
                                                    Upload Photos of LOGO Or Product/Prototype <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <input
                                                    type="file"
                                                    className="form-control mt-1"
                                                    id="Photos-logos"
                                                    disabled={formSubmitted}
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        console.log("Upload photos :", formData.UploadPhotos);
                                                        if (functionShowSizeLimit(file)) {
                                                          setFormData((prevState) => ({
                                                            ...prevState,
                                                            UploadPhotos: file,
                                                          }));
                                                        } else {
                                                          e.target.value = null; // Clear the input value to prevent invalid file selection
                                                        }
                                                    }}
                                                />
                                                <div className="input-note">(Files size should be less than 24MB)</div>
                                                {formSubmitted && !formData.UploadPhotos && (
                                                    <div style={{ color: "red" }}>{errors.UploadPhotos}</div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div class="col-lg-12">
                                        <hr class="mt-1 mb-1" />
                                    </div>

                                    <div class="col-lg-6">
                                        <div class="form-group mt-2 mb-2">
                                            <label class="m-0">
                                                {" "}
                                                Any IP (Trademark/Copyright/Patent/Geographical
                                                Identification) Filed?
                                            </label>
                                            <div class="d-flex align-items-center">
                                                <label class="form-check form-check-inline m-0 me-2">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="ip"
                                                        value="Yes"
                                                        disabled={formSubmitted}
                                                        onChange={handleIp}
                                                        checked={formData.AnyIpFiledResponse === "Yes"}

                                                    />
                                                    <span class="form-check-label">Yes</span>
                                                </label>
                                                <label class="form-check form-check-inline m-0">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="ip"
                                                        value="No"
                                                        disabled={formSubmitted}
                                                        onChange={handleIp}
                                                        checked={formData.AnyIpFiledResponse === "No"}
                                                    />
                                                    <span class="form-check-label">No</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {showIp && (
                                        <div className="col-lg-6">
                                            <div className="form-group mt-2 mb-2">
                                                <label htmlFor="Technologyinvolve">
                                                    Provide The Option to Upload the Relevant Document:
                                                    <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <textarea
                                                    className="form-control mt-1"
                                                    placeholder="Any Comment"
                                                    id="Technologyinvolve"
                                                    value={formData.RelevantDocumentComment}
                                                    disabled={formSubmitted}
                                                    onChange={(e) => {
                                                        setFormData({
                                                            ...formData,
                                                            RelevantDocumentComment: e.target.value,
                                                        });
                                                    }}
                                                ></textarea>
                                                <input
                                                    type="file"
                                                    className="form-control mt-1"
                                                    id="ip"
                                                    disabled={formSubmitted}
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if (functionShowSizeLimit(file)) {
                                                            setFormData((prevState) => ({
                                                                ...prevState,
                                                                RelevantDocument: file,
                                                            }));
                                                        } else {
                                                            e.target.value = null; // Clear the input value to prevent invalid file selection
                                                        }
                                                    }}
                                                />
                                                <div className="input-note">
                                                    (Files size should be less than 24MB)
                                                </div>
                                                {formSubmitted && !formData.RelevantDocument && (
                                                    <div style={{ color: "red" }}>
                                                        {"Upload Relevant Document"}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div class="col-lg-12">
                                        <hr class="mt-1 mb-1" />
                                    </div>

                                    <div className="col-lg-6">
                                        <div className="form-group mt-2 mb-2">
                                            <label className="m-0">
                                                Do You have ITR Filled for Previous Year?{" "}
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <div className="d-flex align-items-center">
                                                <label className="form-check form-check-inline m-0 me-2">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="Itr"
                                                        value="Yes"
                                                        disabled={formSubmitted}
                                                        onChange={handleItr}
                                                        checked={formData.ItrStatus === "Yes"}
                                                    />
                                                    <span className="form-check-label">Yes</span>
                                                </label>
                                                <label className="form-check form-check-inline m-0">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="Itr"
                                                        value="No"
                                                        disabled={formSubmitted}
                                                        onChange={handleItr}
                                                        checked={formData.ItrStatus === "No"}
                                                    />
                                                    <span className="form-check-label">No</span>
                                                </label>
                                            </div>
                                            {formSubmitted && !showItr && showItr !== false && (
                                                <div style={{ color: "red" }}>
                                                    Please select whether you have ITR filled for the previous year.
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-lg-6">
                                        {showItr === true && (
                                            <div className="col-lg-12">
                                                <div className="form-group mt-2 mb-2">
                                                    <label htmlFor="UploadAuditedStatement">
                                                        Upload Audited Profit & Loss and Balance Sheet Statement (Mandatory)
                                                        <span style={{ color: "red" }}>*</span>
                                                    </label>
                                                    <input
                                                        type="file"
                                                        className="form-control mt-1"
                                                        id="UploadAuditedStatement"
                                                        disabled={formSubmitted}
                                                        onChange={(e) => handleFileChange(e, 'UploadAuditedStatement')}
                                                    />
                                                    <div className="input-note">
                                                        (Files size should be less than 24MB)
                                                    </div>
                                                    {formSubmitted && showItr && errors.UploadAuditedStatement && (
                                                        <div style={{ color: "red" }}>
                                                            {errors.UploadAuditedStatement}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {showItr === false && (
                                            <div className="col-lg-12">
                                                <div className="form-group mt-2 mb-2">
                                                    <label htmlFor="UploadProvisionalStatement">
                                                        Upload Provisional Statement or Accounts report till date for Projection (Optional)
                                                    </label>
                                                    <input
                                                        type="file"
                                                        className="form-control mt-1"
                                                        id="UploadProvisionalStatement"
                                                        disabled={formSubmitted}
                                                        onChange={(e) => handleFileChange(e, 'UploadProvisionalStatement')}
                                                    />
                                                    <div className="input-note">
                                                        (Files size should be less than 24MB)
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div class="col-lg-12">
                                        <hr class="mt-1 mb-1" />
                                    </div>

                                    <div class="col-lg-6">
                                        <div class="form-group mt-2 mb-2">
                                            <label for="Competitor">
                                                Name Closest Direct/Indirect Competitor In The Market{" "}
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                class="form-control mt-1"
                                                placeholder="Closest Direct/Indirect Competitor In The Market"
                                                id="Competitor"
                                                value={formData.DirectInDirectMarket}
                                                disabled={formSubmitted}
                                                onChange={(e) => handleInputChange(e, "DirectInDirectMarket")}
                                            />
                                            {formSubmitted && errors.DirectInDirectMarket && (
                                                <div style={{ color: "red" }}>
                                                    {errors.DirectInDirectMarket}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div class="col-lg-6">
                                        <div class="form-group mt-2 mb-2">
                                            <label class="m-0">
                                                Select Your Business Models{" "}
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <div class="d-flex align-items-center mt-2">
                                                {["B2B", "B2C", "B2G", "D2C", "C2C"].map((model) => (
                                                    <label
                                                        class="form-check form-check-inline m-0 me-2"
                                                        key={model}
                                                    >
                                                        <input
                                                            class="form-check-input"
                                                            type="checkbox" // Change type to radio
                                                            name="BusinessModel" // Use same name for all radios to group them
                                                            value={model}
                                                            checked={formData.BusinessModel.includes(model)} // Check if model is in array
                                                            disabled={formSubmitted}
                                                            onChange={(e) => handleInputChange(e, "BusinessModel")}
                                                        />
                                                        <span class="form-check-label">{model}</span>
                                                    </label>
                                                ))}
                                                {formSubmitted &&
                                                    formData.BusinessModel.length === 0 && (
                                                        <div style={{ color: "red" }}>
                                                            Please select at least one business model.
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-lg-12">
                                        <hr class="mt-1 mb-1" />
                                    </div>

                                    <div class="col-lg-6">
                                        <div class="form-group mt-2 mb-2">
                                            <label class="m-0">
                                                Have You Raised Any Financing Thus Far <br />
                                                (Grants, Loans, Investments, Friends And Family, Etc.)
                                            </label>
                                            <div class="d-flex align-items-center">
                                                <label class="form-check form-check-inline m-0 me-2">
                                                    <input
                                                        class="form-check-input"
                                                        type="radio"
                                                        name="Raised"
                                                        value="Yes"
                                                        disabled={formSubmitted}
                                                        onChange={handleFinance}
                                                        checked={formData.FinanceCondition === "Yes"}
                                                    />
                                                    <span class="form-check-label">Yes</span>
                                                </label>
                                                <label class="form-check form-check-inline m-0">
                                                    <input
                                                        class="form-check-input"
                                                        type="radio"
                                                        name="Raised"
                                                        value="No"
                                                        disabled={formSubmitted}
                                                        onChange={handleFinance}
                                                        checked={formData.FinanceCondition === "No"}
                                                    />
                                                    <span class="form-check-label">No</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {showFinance && (
                                        <div class="col-lg-6">
                                            <div class="form-group mt-2 mb-2">
                                                <label for="grants">
                                                    Provide The Option to Mentioned The Same and Explain
                                                    <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <textarea
                                                    class="form-control mt-1"
                                                    placeholder="grants, loans, investments, friends and family, etc"
                                                    id="grants"
                                                    value={formData.Finance}
                                                    disabled={formSubmitted}
                                                    onChange={(e) => handleInputChange(e, "Finance")}
                                                ></textarea>
                                                {formSubmitted && !formData.Finance && (
                                                    <div style={{ color: "red" }}>
                                                        {"Enter details about Finance"}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div class="col-lg-12">
                                        <hr class="mt-1 mb-1" />
                                    </div>

                                    <div className="col-lg-6">
                                        <div className="form-group mt-2 mb-2">
                                            <label htmlFor="Declaration">
                                                Upload Declaration
                                                {/* <span style={{ color: "red" }}>*</span>: */}
                                            </label>
                                            <input
                                                type="file"
                                                class="form-control mt-1"
                                                id="Declaration"
                                                disabled={formSubmitted}
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (functionShowSizeLimit(file)) {
                                                        setFormData((prevState) => ({
                                                            ...prevState,
                                                            UploadDeclaration: file,
                                                        }));
                                                    } else {
                                                        e.target.value = null; // Clear the input value to prevent invalid file selection
                                                    }
                                                }}
                                            />
                                            <div className="input-note">
                                                (Files size should be less than 24MB)
                                            </div>
                                            {/* {formSubmitted && errors.UploadDeclaration && (
                                                <div style={{ color: "red" }}>
                                                    {errors.UploadDeclaration}
                                                </div>
                                            )} */}
                                        </div>
                                    </div>

                                    <div className="col-lg-6">
                                        <div className="form-group mt-2 mb-2">
                                            <label htmlFor="Declaration">
                                                Upload Relevant Docs{" "}
                                                {/* <span style={{ color: "red" }}>*</span> */}
                                            </label>
                                            <input
                                                type="file"
                                                class="form-control mt-1"
                                                id="Declaration"
                                                disabled={formSubmitted}
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (functionShowSizeLimit(file)) {
                                                        setFormData((prevState) => ({
                                                            ...prevState,
                                                            UploadRelevantDocs: file,
                                                        }));
                                                    } else {
                                                        e.target.value = null; // Clear the input value to prevent invalid file selection
                                                    }
                                                }}
                                            />
                                            <div className="input-note">
                                                (Files size should be less than 24MB)
                                            </div>
                                            {/* {formSubmitted && errors.UploadRelevantDocs && (
                                                <div style={{ color: "red" }}>
                                                    {errors.UploadRelevantDocs}
                                                </div>
                                            )} */}
                                        </div>
                                    </div>

                                    <div class="col-lg-12">
                                        <hr class="mt-1 mb-1" />
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div class="basic-info-form-head mt-4 mb-2">
                            {/* <h3>Directors And Team Details</h3> */}
                        </div>

                        <div className="row">

                            <div className="col-lg-12">
                                <div className="form-group d-flex align-items-center mt-2 mb-2">
                                    <h2 className="m-0" htmlFor="DirectorsNO">
                                        How Many Directors/Partners Are There?
                                    </h2>
                                    <select
                                        className="form-select mt-1 ms-2"
                                        id="DirectorsNO"
                                        style={{ width: "70px" }}
                                        disabled={formSubmitted}
                                        onChange={handleDirectorsChange}
                                        value={numberOfDirectors}
                                    >
                                        {Array.from({ length: 6 }, (_, i) => (
                                            <option key={i + 1} value={i + 1}>
                                                {i + 1}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            {renderDirectorFields()}
                        </div>

                        <div className="row">
                            <div className="col-lg-12 text-left">
                                <button
                                    type="submit"
                                    onClick={handleSave}
                                    className="btn btn-info btn-lg mt-4 mb-4"
                                    style={{ width: "100px" }}
                                >
                                    Save
                                </button>

                                <button
                                    type="submit"
                                    onClick={handleSubmit}
                                    className="btn btn-primary btn-lg mt-4 mb-4 ms-4"
                                    style={{ width: "100px" }}
                                >
                                    Submit
                                </button>
                            </div>
                        </div>

                    </div>
                </form>
                {formSubmitted && formData.BusinessModel && (
                    <div className="mt-4">{getEmailContent()}</div>
                )}
            </div>

            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={openBacdrop}
                onClick={() => setOpenBacdrop(false)}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    )
}

export default CustomerForm;








// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Swal from "sweetalert2";
// import Select from "react-select";
// import Backdrop from "@mui/material/Backdrop";
// import CircularProgress from "@mui/material/CircularProgress";

// function CustomerForm() {
//     const secretKey = process.env.REACT_APP_SECRET_KEY;

//     const companyName = localStorage.getItem("companyName");
//     // console.log("Company name is :", companyName);

//     const [companyData, setCompanyData] = useState({});
//     const [formSubmitted, setFormSubmitted] = useState(false);

//     const fetchCompanyData = async () => {
//         try {
//             const response = await axios.get(`${secretKey}/customer/fetch-company-data/${companyName}`);
//             console.log("Company data is :", response.data.data);
//             setCompanyData(response.data.data);
//             setFormSubmitted(response.data.data.formSubmitted);
//         } catch (error) {
//             console.log("EEror fetching company data :", error);
//         }
//     };

//     useEffect(() => {
//         fetchCompanyData();
//     }, []);

//     useEffect(() => {
//         if (companyData) {
//             setFormData((prevData) => ({
//                 ...prevData,
//                 ...companyData,
//             }));
//             setNumberOfDirectors(companyData.DirectorDetails?.length || 1);
//             setShowFinance(companyData.FinanceCondition === "Yes");
//             setShowLinks(companyData.SocialMedia === "Yes");
//             setShowTechnologyDetails(companyData.TechnologyInvolved === "Yes");
//             setShowPhotos(companyData.UploadPhotos === "Yes");
//             setShowIp(companyData.AnyIpFiledResponse === "Yes");
//             setShowItr(companyData.ItrStatus === "Yes" ? true : companyData.ItrStatus === "No" ? false : null);
//         }
//     }, [companyData]);

//     const DirectorForm = {
//         DirectorName: "",
//         DirectorEmail: "",
//         DirectorMobileNo: "",
//         DirectorQualification: "",
//         DirectorWorkExperience: "",
//         DirectorAnnualIncome: "",
//         DirectorPassportPhoto: "",
//         DirectorAdharCard: "",
//         LinkedInProfileLink: "",
//         DirectorDesignation: "",
//         DirectorAdharCardNumber: "",
//         DirectorGender: "",
//         IsMainDirector: false,
//     };

//     const [formData, setFormData] = useState({
//         CompanyName: localStorage.getItem("companyName"),
//         CompanyEmail: localStorage.getItem("companyEmail"),
//         CompanyNo: localStorage.getItem("companyPhoneNo"),
//         BrandName: "",
//         WebsiteLink: "",
//         CompanyAddress: "",
//         CompanyPanNumber: localStorage.getItem("companyPanNo"),
//         SelectServices: [],
//         UploadMOA: "",
//         UploadAOA: "",
//         SocialMedia: "",
//         FacebookLink: "",
//         InstagramLink: "",
//         LinkedInLink: "",
//         YoutubeLink: "",
//         CompanyActivities: "",
//         ProductService: "",
//         CompanyUSP: "",
//         ValueProposition: "",
//         TechnologyInvolved: "",
//         TechnologyDetails: "",
//         UploadPhotos: "",
//         ProductPhoto: null,
//         AnyIpFiledResponse: "",
//         RelevantDocument: null,
//         RelevantDocumentComment: "",
//         ItrStatus: "",
//         UploadAuditedStatement: null,
//         UploadProvisionalStatement: null,
//         DirectInDirectMarket: "",
//         BusinessModel: "",
//         Finance: "",
//         FinanceCondition: "No",
//         UploadDeclaration: "",
//         UploadRelevantDocs: "",
//         DirectorDetails: [DirectorForm],
//         isFormSubmitted: formSubmitted
//     });

//     const [errors, setErrors] = useState({});
//     const [emailError, setEmailError] = useState("");
    
//     const [showLinks, setShowLinks] = useState(false);
//     const [showTechnologyDetails, setShowTechnologyDetails] = useState(false);
//     const [showPhotos, setShowPhotos] = useState(false);
//     const [showIp, setShowIp] = useState(false);
//     const [showItr, setShowItr] = useState(null);
//     const [showOptional, setShowOptional] = useState(false);
//     const [showFinance, setShowFinance] = useState(false);
//     const [numberOfDirectors, setNumberOfDirectors] = useState(1);

//     // Select Your Services
//     const options1 = [
//         { value: "Pitch Deck Development ", label: "Pitch Deck Development" },
//         { value: "Financial Modeling", label: "Financial Modeling" },
//         { value: "DPR Development", label: "DPR Developmen" },
//         { value: "CMA Report Development", label: "CMA Report Development" },
//         { value: "Company Profile Write-Up", label: "Company Profile" },
//         { value: "Business Profile", label: "Business Profile" },
//         { value: "Seed Funding Support", label: "Seed Funding Support" },
//         { value: "Angel Funding Support", label: "Angel Funding Support" },
//         { value: "VC Funding Support", label: "VC Funding Support" },
//         { value: "Crowd Funding Support", label: "Crowd Funding Support" },
//         { value: "I-Create", label: "I-Create" },
//         { value: "Chunauti ", label: "Chunauti " },
//         { value: "Nidhi Seed Support Scheme", label: "Nidhi Seed Support Scheme" },
//         { value: "Nidhi Prayash Yojna", label: "Nidhi Prayash Yojna" },
//         { value: "NAIF", label: "NAIF" },
//         { value: "Raftaar", label: "Raftaar" },
//         { value: "CSR Funding", label: "CSR Funding" },
//         { value: "Stand-Up India", label: "Stand-Up India" },
//         { value: "PMEGP", label: "PMEGP" },
//         { value: "USAID", label: "USAID" },
//         { value: "UP Grant", label: "UP Grant" },
//         { value: "DBS Grant", label: "DBS Grant" },
//         { value: "MSME Innovation", label: "MSME Innovation" },
//         { value: "MSME Hackathon", label: "MSME Hackathon" },
//         { value: "Gujarat Grant", label: "Gujarat Grant" },
//         { value: "CGTMSC", label: "CGTMSC" },
//         { value: "Income Tax Exemption", label: "Income Tax Exemption" },
//         { value: "Mudra Loan", label: "Mudra Loan" },
//         { value: "SIDBI Loan", label: "SIDBI Loan" },
//         { value: "Incubation Support", label: "Incubation Support" },
//     ];

//     // const [selectedOptions, setSelectedOptions] = useState([]);

//     const [openBacdrop, setOpenBacdrop] = useState(false); // state for backdrop loader

//     // pattern validation

//     function isValidEmail(email) {
//         const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         return pattern.test(email);
//     }

//     function isValidMobileNo(Mobile) {
//         const pattern = /^\d{10}$/;
//         return pattern.test(Mobile);
//     }

//     function isValidAadhaarNumber(aadhaarNumber) {
//         const pattern = /^\d{12}$/;
//         return pattern.test(aadhaarNumber);
//     }

//     const handleChange = (selectedOptions) => {
//         setFormData((prevFormData) => ({
//             ...prevFormData,
//             SelectServices: selectedOptions.map((option) => option.value),
//         }));
//     };

//     // console.log(formData);

//     const [directorLength, setDirectorLength] = useState(1);

//     // console.log(directorLength);

//     useEffect(() => {
//         const simpleArray = [];

//         for (let index = 0; index < directorLength; index++) {
//             simpleArray.push(DirectorForm);
//         }
//         const tempFormData = {
//             ...formData,
//             DirectorDetails: simpleArray,
//         };
//         setFormData(tempFormData);
//     }, [directorLength]);

//     // console.log(formData);

//     async function sendDataToBackend() {
//         setOpenBacdrop(true); // show backdrop loader
//         try {
//             const data = new FormData();

//             Object.keys(formData).forEach((key) => {
//                 if (!["DirectorDetails", "SelectServices"].includes(key)) {
//                     data.append(key, formData[key]);
//                 } else if (key === "SelectServices") {
//                     Object.keys(formData.SelectServices).forEach((serviceProp, index) => {
//                         data.append(
//                             `SelectServices[${index}]`,
//                             formData.SelectServices[index]
//                         );
//                     });

//                     // data.append(key, JSON.stringify(formData[key]));
//                 } else {
//                     formData.DirectorDetails.forEach((director, index) => {
//                         Object.keys(director).forEach((prop) => {
//                             if (
//                                 prop === "DirectorPassportPhoto" ||
//                                 prop === "DirectorAdharCard"
//                             ) {
//                                 data.append(`${prop}`, director[prop]);
//                             } else {
//                                 data.append(
//                                     `DirectorDetails[${index}][${prop}]`,
//                                     director[prop]
//                                 );
//                             }
//                         });
//                     });
//                 }
//             });

//             const response = await fetch(
//                 `${secretKey}/clientform/basicinfo-form/${formData.CompanyName}`,
//                 {
//                     method: "POST",
//                     body: data,
//                 }
//             );
//             if (response.ok) {
//                 // Call function to handle success and show SweetAlert
//                 handleSuccess();
//                 // setFormSubmitted(true);
//             } else {
//                 console.error("Failed to submit form data:", response.statusText);
//                 // Handle error case here, optionally show an error message
//                 Swal.fire({
//                     title: "Error!",
//                     text: "Failed to submit form data.",
//                     icon: "error",
//                 });
//             }
//             return response.data; // You can return data from the backend if needed
//         } catch (error) {
//             console.error("Error sending data to backend:", error);
//             Swal.fire({
//                 title: "Error!",
//                 text: "Failed to submit form data.",
//                 icon: "error",
//             });
//             throw error; // Rethrow the error for handling it in the calling code
//         } finally {
//             setOpenBacdrop(false); // hide backdrop loader in any case
//         }
//     }

//     const handleSuccess = () => {
//         // Show success message using SweetAlert
//         Swal.fire({
//             title: "Success!",
//             text: "Form submitted successfully.",
//             icon: "success",
//         }).then(() => {
//             // Optionally reload the page or handle further actions
//             window.location.reload();
//         });
//     };

//     const maxSizeMB = 24;
//     const maxSizeBytes = maxSizeMB * 1024 * 1024;

//     const handleFileChange = (e, fieldName, index = null) => {
//         const file = e.target.files[0];
//         if (file && file.size > maxSizeBytes) {
//             Swal.fire({
//                 title: "Error!",
//                 text: `File size should not exceed ${maxSizeMB}MB`,
//                 icon: "error",
//             });
//             if (index !== null) {
//                 setFormData((prevFormData) => {
//                     const updatedDirectorDetails = prevFormData.DirectorDetails.map(
//                         (director, i) => {
//                             if (i === index) {
//                                 return { ...director, [fieldName]: "" };
//                             }
//                             return director;
//                         }
//                     );
//                     return { ...prevFormData, DirectorDetails: updatedDirectorDetails };
//                 });
//             } else {
//                 setFormData((prevFormData) => ({
//                     ...prevFormData,
//                     [fieldName]: "",
//                 }));
//             }
//         } else {
//             if (index !== null) {
//                 setFormData((prevFormData) => {
//                     const updatedDirectorDetails = prevFormData.DirectorDetails.map(
//                         (director, i) => {
//                             if (i === index) {
//                                 return { ...director, [fieldName]: file };
//                             }
//                             return director;
//                         }
//                     );
//                     return { ...prevFormData, DirectorDetails: updatedDirectorDetails };
//                 });
//             } else {
//                 setFormData((prevFormData) => ({
//                     ...prevFormData,
//                     [fieldName]: file,
//                 }));
//             }
//         }
//     };

//     const handleInputChange = (e, fieldName) => {
//         const value = e.target.value;
//         const checked = e.target.checked;

//         if (fieldName === "BusinessModel") {
//             const updatedBusinessModel = [...formData.BusinessModel];
//             if (checked) {
//                 updatedBusinessModel.push(value);
//             } else {
//                 const index = updatedBusinessModel.indexOf(value);
//                 if (index > -1) {
//                     updatedBusinessModel.splice(index, 1);
//                 }
//             }
//             setFormData((prevState) => ({
//                 ...prevState,
//                 BusinessModel: updatedBusinessModel,
//             }));
//         } else {
//             setFormData((prevState) => ({
//                 ...prevState,
//                 [fieldName]: value,
//             }));
//         }
//     };

//     const handleDirectorsChange = (e) => {
//         const number = parseInt(e.target.value, 10);
//         setNumberOfDirectors(number);

//         const updatedDirectorDetails = [...formData.DirectorDetails];
//         if (number > updatedDirectorDetails.length) {
//             for (let i = updatedDirectorDetails.length; i < number; i++) {
//                 updatedDirectorDetails.push({ name: '', email: '', phone: '' });
//             }
//         } else {
//             updatedDirectorDetails.length = number;
//         }

//         setFormData({
//             ...formData,
//             DirectorDetails: updatedDirectorDetails
//         });
//     };

//     const handleSave = async () => {
//         console.log("Form data is :", formData);
//         try {
//             // Post formData using axios
//             const response = await axios.post(`${secretKey}/customer/save-company-data`, formData);

//             Swal.fire("Data successfully saved", "success");
//             console.log("Saved data is:", response.data);
//         } catch (error) {
//             console.error('Error saving data:', error.response || error.message);
//             Swal.fire("Error saving data", "error");
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
        
//         if (formSubmitted) {
//             Swal.fire({
//                 title: "Form already submitted!",
//                 text: "You cannot submit the form again.",
//                 icon: "info",
//             });
//             return;
//         }

//         const newErrors = {};
//         if (!formData.CompanyName) {
//             newErrors.CompanyName = "Company name is required";
//         }
//         if (!formData.CompanyEmail) {
//             newErrors.CompanyEmail = "Email is required";
//         }
//         if (formData.CompanyEmail !== "" && !isValidEmail(formData.CompanyEmail)) {
//             newErrors.CompanyEmail = "Please enter a valid email";
//         }
//         if (!formData.CompanyNo) {
//             newErrors.CompanyNo = "Mobile No is required";
//         }
//         if (formData.CompanyNo !== "" && !isValidMobileNo(formData.CompanyNo)) {
//             newErrors.CompanyNo = "Please enter a valid mobile number";
//         }
//         if (!formData.CompanyPanNumber) {
//             newErrors.CompanyPanNumber = "Pan No is required";
//         }
//         if (!formData.BrandName && formData.BrandName !== "") {
//             newErrors.BrandName = "Enter Brand Name";
//         }
//         if (!formData.WebsiteLink && formData.WebsiteLink !== "") {
//             newErrors.WebsiteLink = "Enter Website Link";
//         }
//         if (!formData.CompanyAddress && formData.CompanyAddress !== "") {
//             newErrors.CompanyAddress = "Enter Company Address";
//         }
//         if (!formData.CompanyPanNumber && formData.CompanyPanNumber !== "") {
//             newErrors.CompanyPanNumber = "Enter Pan Number";
//         }
//         if (!formData.SelectServices.length && formData.SelectServices !== "") {
//             newErrors.SelectServices = "Select Your Services";
//         }
//         // if (!formData.UploadMOA) {
//         //     newErrors.UploadMOA = "Select Your MOA";
//         // }
//         // if (!formData.UploadAOA) {
//         //     newErrors.UploadAOA = "Select Your AOA";
//         // }
//         if (!formData.CompanyActivities && formData.CompanyActivities !== "") {
//             newErrors.CompanyActivities = "Enter Your Company Activities";
//         }
//         if (!formData.ProductService && formData.ProductService !== "") {
//             newErrors.ProductService = "Enter Your Products/Services";
//         }
//         if (!formData.CompanyUSP && formData.CompanyUSP !== "") {
//             newErrors.CompanyUSP = "Enter Your USP";
//         }
//         if (!formData.ValueProposition && formData.ValueProposition !== "") {
//             newErrors.ValueProposition = "Enter Your Company Value Proposition";
//         }
//         if (!formData.TechnologyInvolved && formData.TechnologyInvolved !== "") {
//             newErrors.TechnologyInvolved = "Enter Your Technology Details";
//         }
//         if (showPhotos && !formData.ProductPhoto) {
//             newErrors.ProductPhoto = "Upload Photos of Logo or Product/Prototype";
//         }
//         if (showIp && !formData.RelevantDocument) {
//             newErrors.RelevantDocument = "Upload Relevant Documents";
//         }
//         // if (!formData.UploadAuditedStatement) {
//         //   newErrors.UploadAuditedStatement =
//         //     "Upload Audited Profit & Loss and Balance sheet Statment ";
//         // }
//         // if (
//         //   !formData.UploadProvisionalStatement &&
//         //   formData.UploadProvisionalStatement !== ""
//         // ) {
//         //   newErrors.UploadProvisionalStatement =
//         //     " Upload Provisional Statement or Accounts report till date for Projection ";
//         // }
//         if (!formData.CompanyActivities) {
//             newErrors.CompanyActivities = "Please enter company's activity";
//         }
//         if (!formData.ProductService) {
//             newErrors.ProductService = "Please enter your service";
//         }
//         if (!formData.CompanyUSP) {
//             newErrors.CompanyUSP = "Please enter company's USP";
//         }
//         if (!formData.ValueProposition) {
//             newErrors.ValueProposition = "Please enter company's value proposition";
//         }
//         // ITR related validations
//         if (showItr === null) {
//             newErrors.ITR = "Please select ITR Option";
//         } else if (showItr && !formData.UploadAuditedStatement) {
//             newErrors.UploadAuditedStatement =
//                 "Upload Audited Profit & Loss and Balance Sheet Statement is required.";
//         }
//         if (!formData.DirectInDirectMarket) {
//             newErrors.DirectInDirectMarket = "Enter Direct/InDirect Competitor";
//         }
//         if (!formData.BusinessModel) {
//             newErrors.BusinessModel = "Please Select Business Model";
//         }
//         if (!formData.Finance && formData.Finance !== "") {
//             newErrors.Finance = "Enter The Details of Grant";
//         }
//         // if (!formData.UploadDeclaration) {
//         //     newErrors.UploadDeclaration = "Please Upload Declaration";
//         // }
//         // if (!formData.UploadRelevantDocs) {
//         //     newErrors.UploadRelevantDocs = "Please Upload Relevant Docs";
//         // }
//         if (!formData.DirectorDetails.some((obj) => obj.IsMainDirector === true)) {
//             newErrors.IsMainDirector = "Please Select Authorised person";
//         }

//         formData.DirectorDetails.forEach((director, index) => {
//             if (!director.DirectorName) {
//                 newErrors[`DirectorName${index}`] = `Enter Director Name for Director ${index + 1
//                     }`;
//             }
//             if (!director.DirectorEmail) {
//                 newErrors[
//                     `DirectorEmail${index}`
//                 ] = `Enter Director Email Id for Director ${index + 1}`;
//             } else if (!isValidEmail(director.DirectorEmail)) {
//                 newErrors[
//                     `DirectorEmail${index}`
//                 ] = `Please enter a valid email for Director ${index + 1}`;
//             }
//             if (!director.DirectorMobileNo) {
//                 newErrors[
//                     `DirectorMobileNo${index}`
//                 ] = `Enter Director Mobile No for Director ${index + 1}`;
//             }
//             if (!director.DirectorQualification) {
//                 newErrors[
//                     `DirectorQualification${index}`
//                 ] = `Enter Director Qualification for Director ${index + 1}`;
//             }
//             if (!director.DirectorWorkExperience) {
//                 newErrors[
//                     `DirectorWorkExperience${index}`
//                 ] = `Enter Director Work Experience for Director ${index + 1}`;
//             }
//             if (!director.DirectorAnnualIncome) {
//                 newErrors[
//                     `DirectorAnnualIncome${index}`
//                 ] = `Enter Director Annual Income for Director ${index + 1}`;
//             }
//             // if (!director.DirectorPassportPhoto) {
//             //     newErrors[
//             //         `DirectorPassportPhoto${index}`
//             //     ] = `Upload Photo for Director ${index + 1}`;
//             // }
//             if (!director.DirectorAdharCard) {
//                 newErrors[
//                     `DirectorAdharCard${index}`
//                 ] = `Upload your Adhar Card for Director ${index + 1}`;
//             }
//             if (!director.DirectorAdharCardNumber) {
//                 newErrors[
//                     `DirectorAdharCardNumber${index}`
//                 ] = `Enter Director Adhar Card Number for Director ${index + 1}`;
//             } else if (!isValidAadhaarNumber(director.DirectorAdharCardNumber)) {
//                 newErrors[
//                     `DirectorAdharCardNumber${index}`
//                 ] = `Please enter a valid 12-digit Aadhaar Card Number for Director ${index + 1
//                 }`;
//             }
//             if (!director.DirectorDesignation) {
//                 newErrors[
//                     `DirectorDesignation${index}`
//                 ] = `Enter Director Designation for Director ${index + 1}`;
//             }
//             if (!director.DirectorGender) {
//                 newErrors[
//                     `DirectorGender${index}`
//                 ] = `Select Director Gender for Director ${index + 1}`;
//             }
//         });

//         setErrors(newErrors);

//         if (Object.keys(newErrors).length > 0) {
//             Swal.fire({
//                 icon: "error",
//                 title: "Incorrect Details",
//                 html: Object.values(newErrors).join("<br>"),
//             });
//             return;
//         }

//         // console.log(newErrors);

//         // setFormSubmitted(true);
//         await sendDataToBackend();
//     };

//     const functionShowSizeLimit = (file) => {
//         const maxSizeMB = 24;
//         const maxSizeBytes = maxSizeMB * 1024 * 1024;

//         if (file.size > maxSizeBytes) {
//             Swal.fire(
//                 "Size limit exceeded!",
//                 "Please upload a file less than 24MB",
//                 "warning"
//             );
//             return false;
//         } else {
//             return true;
//         }
//     };

//     const handleRadioChange = (e, index) => {
//         setShowLinks(e.target.value === "Yes");

//         setFormData((prevState) => ({
//             ...prevState,
//             SocialMedia: e.target.value,
//             DirectorDetails: prevState.DirectorDetails.map((director, i) => ({
//                 ...director,
//                 IsMainDirector: i === index,
//             })),
//         }));
//     };

//     const handleRadioChanges = (event) => {
//         const selectedValue = event.target.value;
//         setShowTechnologyDetails(selectedValue === "Yes");
//         setFormData((prevState) => ({
//             ...prevState,
//             TechnologyInvolved: selectedValue,
//             TechnologyDetails: selectedValue === "No" ? "" : prevState.TechnologyDetails,
//         }));
//     };

//     const handlePhotos = (event) => {
//         const isYesSelected = event.target.value === "Yes";
//         setShowPhotos(isYesSelected);
//         setFormData((prevState) => ({
//             ...prevState,
//             UploadPhotos: isYesSelected ? "Yes" : "No",
//             // Reset ProductPhoto if "No" is selected
//             ProductPhoto: !isYesSelected ? null : prevState.ProductPhoto
//         }));
//     };

//     const handleIp = (event) => {
//         const isYesSelected = event.target.value === "Yes";
//         setShowIp(isYesSelected);
//         setFormData((prevState) => ({
//             ...prevState,
//             AnyIpFiledResponse: isYesSelected ? "Yes" : "No",
//             // Clear IP file if "No" is selected
//             RelevantDocument: !isYesSelected ? null : prevState.RelevantDocument
//         }));
//     };

//     const handleItr = (event) => {
//         const selectedValue = event.target.value;
//         setShowItr(selectedValue === "Yes");
//         setFormData((prevState) => ({
//             ...prevState,
//             ItrStatus: selectedValue,
//             UploadAuditedStatement: selectedValue === "No" ? null : prevState.UploadAuditedStatement,
//             UploadProvisionalStatement: selectedValue === "Yes" ? null : prevState.UploadProvisionalStatement,
//         }));
//     };

//     const handleFinance = (event) => {
//         setShowFinance(event.target.value === "Yes");
//         setFormData({
//             ...formData,
//             FinanceCondition: event.target.value,
//         });
//     };

//     // console.log("showfinance" , showFinance);

//     const getEmailContent = () => {
//         const { BusinessModel } = formData;
//         return <div>{BusinessModel.join(", ")}</div>;
//     };

//     // Director and Team Details code
//     const renderDirectorFields = () => {
//         return Array.from({ length: numberOfDirectors }, (_, index) => (
//             <div className="card mt-2">
//                 <div className="card-body p-3">
//                     <div className="directors-details-box p-3" key={index}>
//                         <div className="row">

//                             <div className="col-lg-12 d-flex align-items-center justify-content-between">
//                                 <h5>{index + 1}</h5>
//                                 <div>
//                                     <label className="Director">
//                                         Authorized Person {" "}
//                                         <span style={{ color: "red" }}>*</span>
//                                     </label>
//                                     <input
//                                         type="radio"
//                                         name="maindirector_radio"
//                                         checked={formData.DirectorDetails[index.IsMainDirector]}
//                                         disabled={formSubmitted}
//                                         onChange={() => {
//                                             setFormData((prevState) => ({
//                                                 ...prevState,
//                                                 DirectorDetails: prevState.DirectorDetails.map(
//                                                     (director, i) =>
//                                                         i === index
//                                                             ? { ...director, IsMainDirector: true }
//                                                             : { ...director, IsMainDirector: false }
//                                                 ),
//                                             }));
//                                         }}
//                                     />
//                                     {formSubmitted && errors.IsMainDirector && (
//                                         <div style={{ color: "red" }}>{errors.IsMainDirector}</div>
//                                     )}
//                                 </div>
//                             </div>

//                             <div className="col-lg-3">
//                                 <div className="form-group mt-2 mb-2">
//                                     <label htmlFor={`DirectorName${index}`}>
//                                         Enter Director's Name{" "}
//                                         <span style={{ color: "red" }}>*</span>
//                                     </label>
//                                     <input
//                                         required
//                                         type="text"
//                                         className="form-control mt-1"
//                                         placeholder="Enter Director's Name "
//                                         id={`DirectorName${index}`}
//                                         value={formData.DirectorDetails[index]?.DirectorName || ""}
//                                         disabled={formSubmitted}
//                                         onChange={(e) => {
//                                             const value = e.target.value;
//                                             setFormData((prevState) => ({
//                                                 ...prevState,
//                                                 DirectorDetails: prevState.DirectorDetails.map(
//                                                     (DirectorDetails, i) =>
//                                                         i === index
//                                                             ? { ...DirectorDetails, DirectorName: value }
//                                                             : DirectorDetails
//                                                 ),
//                                             }));
//                                         }}
//                                     />
//                                     {formSubmitted &&
//                                         !formData.DirectorDetails[index]?.DirectorName && (
//                                             <div style={{ color: "red" }}>Enter Director Name</div>
//                                         )}
//                                 </div>
//                             </div>

//                             <div className="col-lg-3">
//                                 <div className="form-group mt-2 mb-2">
//                                     <label htmlFor={`DirectorEmail${index}`}>
//                                         Enter Director's Email{" "}
//                                         <span style={{ color: "red" }}>*</span>
//                                     </label>
//                                     <input
//                                         required
//                                         type="email"
//                                         className="form-control mt-1"
//                                         placeholder="Enter Director's Email"
//                                         id={`DirectorEmail${index}`}
//                                         value={formData.DirectorDetails[index]?.DirectorEmail || ""}
//                                         disabled={formSubmitted}
//                                         onChange={(e) => {
//                                             const value = e.target.value;
//                                             setFormData((prevState) => ({
//                                                 ...prevState,
//                                                 DirectorDetails: prevState.DirectorDetails.map(
//                                                     (director, i) =>
//                                                         i === index
//                                                             ? { ...director, DirectorEmail: value }
//                                                             : director
//                                                 ),
//                                             }));
//                                         }}
//                                     />
//                                     {formSubmitted &&
//                                         !formData.DirectorDetails[index]?.DirectorEmail && (
//                                             <div style={{ color: "red" }}>Enter Director Email</div>
//                                         )}
//                                 </div>
//                             </div>

//                             <div className="col-lg-3">
//                                 <div className="form-group mt-2 mb-2">
//                                     <label htmlFor={`DirectorMobileNo${index}`}>
//                                         Enter Director's Mobile No{" "}
//                                         <span style={{ color: "red" }}>*</span>
//                                     </label>
//                                     <input
//                                         required
//                                         type="text"
//                                         className="form-control mt-1"
//                                         placeholder="Enter Director's Mobile No "
//                                         id={`DirectorMobileNo${index}`}
//                                         value={formData.DirectorDetails[index]?.DirectorMobileNo || ""}
//                                         disabled={formSubmitted}
//                                         onChange={(e) => {
//                                             const value = e.target.value;
//                                             setFormData((prevState) => ({
//                                                 ...prevState,
//                                                 DirectorDetails: prevState.DirectorDetails.map(
//                                                     (director, i) =>
//                                                         i === index
//                                                             ? { ...director, DirectorMobileNo: value }
//                                                             : director
//                                                 ),
//                                             }));
//                                         }}
//                                     />
//                                     {formSubmitted &&
//                                         !formData.DirectorDetails[index]?.DirectorMobileNo && (
//                                             <div style={{ color: "red" }}>
//                                                 Enter Director Mobile No
//                                             </div>
//                                         )}
//                                 </div>
//                             </div>

//                             <div className="col-lg-3">
//                                 <div className="form-group mt-2 mb-2">
//                                     <label htmlFor={`DirectorQualification${index}`}>
//                                         Enter Director's Qualification{" "}
//                                         <span style={{ color: "red" }}>*</span>
//                                     </label>
//                                     <input
//                                         required
//                                         type="text"
//                                         className="form-control mt-1"
//                                         placeholder="Enter Director's Qualification"
//                                         id={`DirectorQualification${index}`}
//                                         value={formData.DirectorDetails[index]?.DirectorQualification || ""}
//                                         disabled={formSubmitted}
//                                         onChange={(e) => {
//                                             const value = e.target.value;
//                                             setFormData((prevState) => ({
//                                                 ...prevState,
//                                                 DirectorDetails: prevState.DirectorDetails.map(
//                                                     (director, i) =>
//                                                         i === index
//                                                             ? { ...director, DirectorQualification: value }
//                                                             : director
//                                                 ),
//                                             }));
//                                         }}
//                                     />
//                                     {formSubmitted &&
//                                         !formData.DirectorDetails[index]?.DirectorQualification && (
//                                             <div style={{ color: "red" }}>
//                                                 Enter Director Qualification
//                                             </div>
//                                         )}
//                                 </div>
//                             </div>

//                             <div className="col-lg-3">
//                                 <div className="form-group mt-2 mb-2">
//                                     <label htmlFor={`Directorexp${index}`}>
//                                         Director's Work Experience (In Detail){" "}
//                                         <span style={{ color: "red" }}>*</span>
//                                     </label>
//                                     <input
//                                         required
//                                         type="text"
//                                         className="form-control mt-1"
//                                         placeholder="Enter Director's Work Experience (In Detail)"
//                                         id={`Directorexp${index}`}
//                                         value={formData.DirectorDetails[index]?.DirectorWorkExperience || ""}
//                                         disabled={formSubmitted}
//                                         onChange={(e) => {
//                                             const value = e.target.value;
//                                             setFormData((prevState) => ({
//                                                 ...prevState,
//                                                 DirectorDetails: prevState.DirectorDetails.map(
//                                                     (director, i) =>
//                                                         i === index
//                                                             ? { ...director, DirectorWorkExperience: value }
//                                                             : director
//                                                 ),
//                                             }));
//                                         }}
//                                     />
//                                     {formSubmitted &&
//                                         !formData.DirectorDetails[index]
//                                             ?.DirectorWorkExperience && (
//                                             <div style={{ color: "red" }}>
//                                                 Enter Director Work Experience
//                                             </div>
//                                         )}
//                                 </div>
//                             </div>

//                             <div className="col-lg-3">
//                                 <div className="form-group mt-2 mb-2">
//                                     <label htmlFor={`Directorincome${index}`}>
//                                         Annual Income Of Director's Family (Approx):{" "}
//                                         <span style={{ color: "red" }}>*</span>
//                                     </label>
//                                     <input
//                                         required
//                                         type="text"
//                                         className="form-control mt-1"
//                                         placeholder="Enter Annual Income Of Director's Family (Approx):"
//                                         id={`Directorincome${index}`}
//                                         value={formData.DirectorDetails[index]?.DirectorAnnualIncome || ""}
//                                         disabled={formSubmitted}
//                                         onChange={(e) => {
//                                             const value = e.target.value;
//                                             setFormData((prevState) => ({
//                                                 ...prevState,
//                                                 DirectorDetails: prevState.DirectorDetails.map(
//                                                     (director, i) =>
//                                                         i === index
//                                                             ? { ...director, DirectorAnnualIncome: value }
//                                                             : director
//                                                 ),
//                                             }));
//                                         }}
//                                     />
//                                     {formSubmitted &&
//                                         !formData.DirectorDetails[index]
//                                             ?.DirectorAnnualIncome && (
//                                             <div style={{ color: "red" }}>
//                                                 Enter Director Annual Income (Approx)
//                                             </div>
//                                         )}
//                                 </div>
//                             </div>

//                             <div className="col-lg-3">
//                                 <div className="form-group mt-2 mb-2">
//                                     <label htmlFor={`DirectorPassportPhoto${index}`}>
//                                         Director's Passport Size Photo{" "}
//                                         {/* <span style={{ color: "red" }}>*</span> */}
//                                     </label>
//                                     <input
//                                         required
//                                         type="file"
//                                         className="form-control mt-1"
//                                         id={`DirectorPassportPhoto${index}`}
//                                         // value={formData.DirectorDetails[index]?.DirectorPassportPhoto || ""}
//                                         disabled={formSubmitted}
//                                         onChange={(e) => {
//                                             const file = e.target.files[0];
//                                             if (functionShowSizeLimit(file)) {
//                                                 setFormData((prevState) => ({
//                                                     ...prevState,
//                                                     DirectorDetails: prevState.DirectorDetails.map(
//                                                         (director, i) =>
//                                                             i === index
//                                                                 ? {
//                                                                     ...director,
//                                                                     DirectorPassportPhoto: file,
//                                                                 }
//                                                                 : director
//                                                     ),
//                                                 }));
//                                             } else {
//                                                 e.target.value = null; // Clear the input value to prevent invalid file selection
//                                             }
//                                         }}
//                                     />
//                                     <div className="input-note">
//                                         (Files size should be less than 24MB)
//                                     </div>
//                                     {/* {formSubmitted &&
//                                         !formData.DirectorDetails[index]?.DirectorPassportPhoto && (
//                                             <div style={{ color: "red" }}>
//                                                 Upload Director Photo
//                                             </div>
//                                         )} */}
//                                 </div>
//                             </div>

//                             <div className="col-lg-3">
//                                 <div className="form-group mt-2 mb-2">
//                                     <label htmlFor={`DirectorAdharCard${index}`}>
//                                         Director's Aadhaar Card{" "}
//                                         <span style={{ color: "red" }}>*</span>
//                                     </label>
//                                     <input
//                                         required
//                                         type="file"
//                                         className="form-control mt-1"
//                                         id={`DirectorAdharCard${index}`}
//                                         // value={formData.DirectorDetails[index]?.DirectorAdharCard || ""}
//                                         disabled={formSubmitted}
//                                         onChange={(e) => {
//                                             const file = e.target.files[0];
//                                             if (functionShowSizeLimit(file)) {
//                                                 setFormData((prevState) => ({
//                                                     ...prevState,
//                                                     DirectorDetails: prevState.DirectorDetails.map(
//                                                         (director, i) =>
//                                                             i === index
//                                                                 ? {
//                                                                     ...director,
//                                                                     DirectorAdharCard: file,
//                                                                 }
//                                                                 : director
//                                                     ),
//                                                 }));
//                                             } else {
//                                                 e.target.value = null; // Clear the input value to prevent invalid file selection
//                                             }
//                                         }}
//                                     />
//                                     <div className="input-note">
//                                         (Files size should be less than 24MB)
//                                     </div>
//                                     {formSubmitted &&
//                                         !formData.DirectorDetails[index]?.DirectorAdharCard && (
//                                             <div style={{ color: "red" }}>
//                                                 Upload Director AdharCard
//                                             </div>
//                                         )}
//                                 </div>
//                             </div>

//                             <div className="col-lg-3">
//                                 <div className="form-group mt-2 mb-2">
//                                     <label htmlFor={`DirectorAdharCardNumber${index}`}>
//                                         Director's Aadhaar Number
//                                         <span style={{ color: "red" }}>*</span>
//                                     </label>
//                                     <input
//                                         type="text"
//                                         className="form-control mt-1"
//                                         placeholder="Enter Director AdharCard Number"
//                                         id={`DirectorAdharCardNumber${index}`}
//                                         value={formData.DirectorDetails[index]?.DirectorAdharCardNumber || ""}
//                                         disabled={formSubmitted}
//                                         onChange={(e) => {
//                                             const value = e.target.value;
//                                             setFormData((prevState) => ({
//                                                 ...prevState,
//                                                 DirectorDetails: prevState.DirectorDetails.map(
//                                                     (director, i) =>
//                                                         i === index
//                                                             ? { ...director, DirectorAdharCardNumber: value }
//                                                             : director
//                                                 ),
//                                             }));
//                                         }}
//                                     />
//                                     {formSubmitted &&
//                                         (!formData.DirectorDetails[index]
//                                             ?.DirectorAdharCardNumber ||
//                                             !isValidAadhaarNumber(
//                                                 formData.DirectorDetails[index]
//                                             )) && (
//                                             <div style={{ color: "red", marginTop: "0.5rem" }}>
//                                                 {!formData.DirectorDetails[index]
//                                                     ?.DirectorAdharCardNumber
//                                                     ? "Enter Director AdharCard Number"
//                                                     : !isValidAadhaarNumber(
//                                                         formData.DirectorDetails[index]
//                                                             ?.DirectorAdharCardNumber
//                                                     )
//                                                         ? "Enter a valid 12-digit Aadhaar Card Number"
//                                                         : null}
//                                             </div>
//                                         )}
//                                 </div>
//                             </div>

//                             <div className="col-lg-3">
//                                 <div className="form-group mt-2 mb-2">
//                                     <label htmlFor={`DirectorDesignation${index}`}>
//                                         Director's Designation
//                                         <span style={{ color: "red" }}>*</span>
//                                     </label>
//                                     <input
//                                         type="text"
//                                         className="form-control mt-1"
//                                         placeholder="Enter Director Designation"
//                                         id={`DirectorDesignation${index}`}
//                                         value={formData.DirectorDetails[index]?.DirectorDesignation || ""}
//                                         disabled={formSubmitted}
//                                         onChange={(e) => {
//                                             const value = e.target.value;
//                                             setFormData((prevState) => ({
//                                                 ...prevState,
//                                                 DirectorDetails: prevState.DirectorDetails.map(
//                                                     (director, i) =>
//                                                         i === index
//                                                             ? { ...director, DirectorDesignation: value }
//                                                             : director
//                                                 ),
//                                             }));
//                                         }}
//                                     />
//                                     {formSubmitted &&
//                                         !formData.DirectorDetails[index]?.DirectorDesignation && (
//                                             <div style={{ color: "red" }}>
//                                                 Enter Director Designation
//                                             </div>
//                                         )}
//                                 </div>
//                             </div>

//                             <div className="col-lg-3">
//                                 <div className="form-group mt-2 mb-2 gender">
//                                     <label htmlFor={`DirectorGender${index}`}>
//                                         Choose Director's Gender
//                                         <span style={{ color: "red" }}>*</span>
//                                     </label>
//                                     <div className="d-flex align-items-center mt-2">
//                                         <label className="form-check form-check-inline m-0 me-2">
//                                             <input
//                                                 className="form-check-input"
//                                                 type="radio"
//                                                 name={`DirectorGender${index}`}
//                                                 value="Male"
//                                                 checked={formData.DirectorDetails[index]?.DirectorGender === "Male"}
//                                                 disabled={formSubmitted}
//                                                 onChange={(e) => {
//                                                     setFormData((prevState) => ({
//                                                         ...prevState,
//                                                         DirectorDetails: prevState.DirectorDetails.map(
//                                                             (DirectorDetails, i) =>
//                                                                 i === index
//                                                                     ? {
//                                                                         ...DirectorDetails,
//                                                                         DirectorGender: e.target.value,
//                                                                     }
//                                                                     : DirectorDetails
//                                                         ),
//                                                     }));
//                                                 }}
//                                             />
//                                             <span className="form-check-label">Male</span>
//                                         </label>
//                                         <label className="form-check form-check-inline m-0">
//                                             <input
//                                                 className="form-check-input"
//                                                 type="radio"
//                                                 name={`DirectorGender${index}`}
//                                                 value="Female"
//                                                 checked={
//                                                     formData.DirectorDetails[index]?.DirectorGender ===
//                                                     "Female"
//                                                 }
//                                                 onChange={(e) => {
//                                                     setFormData((prevState) => ({
//                                                         ...prevState,
//                                                         DirectorDetails: prevState.DirectorDetails.map(
//                                                             (DirectorDetails, i) =>
//                                                                 i === index
//                                                                     ? {
//                                                                         ...DirectorDetails,
//                                                                         DirectorGender: e.target.value,
//                                                                     }
//                                                                     : DirectorDetails
//                                                         ),
//                                                     }));
//                                                 }}
//                                             />
//                                             <span className="form-check-label">Female</span>
//                                         </label>
//                                     </div>
//                                     {formSubmitted &&
//                                         !formData.DirectorDetails[index]?.DirectorGender && (
//                                             <div style={{ color: "red" }}>
//                                                 Select the Director Gender
//                                             </div>
//                                         )}
//                                 </div>
//                             </div>

//                             <div className="col-lg-3">
//                                 <div className="form-group mt-2 mb-2">
//                                     <label htmlFor={`DirectorLinkedIn${index}`}>
//                                         LinkedIn Profile Link
//                                     </label>
//                                     <input
//                                         type="text"
//                                         className="form-control mt-1"
//                                         placeholder="Enter LinkedIn Profile Link"
//                                         id={`DirectorLinkedIn${index}`}
//                                         value={formData.DirectorDetails[index]?.LinkedInProfileLink || ""}
//                                         disabled={formSubmitted}
//                                         onChange={(e) => {
//                                             setFormData((prevState) => ({
//                                                 ...prevState,
//                                                 DirectorDetails: prevState.DirectorDetails.map(
//                                                     (DirectorDetails, i) =>
//                                                         i === index
//                                                             ? {
//                                                                 ...DirectorDetails,
//                                                                 LinkedInProfileLink: e.target.value,
//                                                             }
//                                                             : DirectorDetails
//                                                 ),
//                                             }));
//                                         }}
//                                     />
//                                 </div>
//                             </div>

//                         </div>
//                     </div>
//                 </div>
//             </div>
//         ));
//     };

//     return (
//         <div>
//             <div className="basic-info-page-body">

//                 <form className="basic-info-form" onSubmit={handleSubmit}>
//                     <div className="container-xl">
//                         <div className="basic-info-form-head mt-4 mb-2">
//                             <h2 className="m-0">Basic Information</h2>
//                         </div>
//                         <div className="card mt-2">
//                             <div className="card-body p-3">
//                                 <div className="row">

//                                     <div className="col-lg-4">
//                                         <div className="form-group mt-2 mb-2">
//                                             <label htmlFor="Company">
//                                                 Company Name: <span style={{ color: "red" }}>*</span>
//                                             </label>
//                                             <input
//                                                 required
//                                                 type="text"
//                                                 className="form-control mt-1"
//                                                 placeholder="Enter Company Name"
//                                                 id="Company"
//                                                 value={formData.CompanyName}
//                                                 disabled={formSubmitted}
//                                                 onChange={(e) => handleInputChange(e, "CompanyName")}
//                                             />
//                                             {formSubmitted && errors.CompanyName && (
//                                                 <div style={{ color: "red" }}>{errors.CompanyName}</div>
//                                             )}
//                                         </div>
//                                     </div>

//                                     <div className="col-lg-4">
//                                         <div className="form-group mt-2 mb-2">
//                                             <label htmlFor="CompanyEmail">
//                                                 Email Address: <span style={{ color: "red" }}>*</span>
//                                             </label>
//                                             <input
//                                                 required
//                                                 type="email"
//                                                 className="form-control mt-1"
//                                                 placeholder="Enter Company Email"
//                                                 id="CompanyEmail"
//                                                 value={formData.CompanyEmail}
//                                                 disabled={formSubmitted}
//                                                 onChange={(e) => handleInputChange(e, "CompanyEmail")}
//                                                 pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
//                                                 title="Enter a valid email address"
//                                             />
//                                             {formSubmitted &&
//                                                 formData.CompanyEmail !== "" &&
//                                                 !isValidEmail(formData.CompanyEmail) || (
//                                                     <div style={{ color: "red" }}>
//                                                         {errors.CompanyEmail}
//                                                     </div>
//                                                 )}
//                                         </div>
//                                     </div>

//                                     <div className="col-lg-4">
//                                         <div className="form-group mt-2 mb-2">
//                                             <label htmlFor="CompanyNo">
//                                                 Phone No: <span style={{ color: "red" }}>*</span>
//                                             </label>
//                                             <input
//                                                 required
//                                                 type="tel"
//                                                 className="form-control mt-1"
//                                                 placeholder="Enter Company Phone No."
//                                                 id="CompanyNo"
//                                                 value={formData.CompanyNo}
//                                                 disabled={formSubmitted}
//                                                 onChange={(e) => handleInputChange(e, "CompanyNo")}
//                                             />
//                                             {formSubmitted && !formData.CompanyNo && (
//                                                 <div style={{ color: "red" }}>
//                                                     {"Enter Mobile Number"}
//                                                 </div>
//                                             )}
//                                             {formSubmitted &&
//                                                 formData.CompanyNo !== "" &&
//                                                 !isValidMobileNo(formData.CompanyNo) && (
//                                                     <div style={{ color: "red" }}>{errors.CompanyNo}</div>
//                                                 )}
//                                         </div>
//                                     </div>

//                                     <div className="col-lg-3">
//                                         <div className="form-group mt-2 mb-2">
//                                             <label htmlFor="Brand-Name">Brand Name (If any):</label>
//                                             <input
//                                                 required
//                                                 type="text"
//                                                 className="form-control mt-1"
//                                                 placeholder="Enter Brand Name"
//                                                 id="Brand-Name"
//                                                 value={formData.BrandName}
//                                                 disabled={formSubmitted}
//                                                 onChange={(e) => handleInputChange(e, "BrandName")}
//                                             />
//                                             {/* {formSubmitted && !formData.BrandName && (
//                                                 <div style={{ color: "red" }}>{"Enter Brand Name"}</div>
//                                             )} */}
//                                         </div>
//                                     </div>

//                                     <div className="col-lg-3">
//                                         <div className="form-group mt-2 mb-2">
//                                             <label htmlFor="WebsiteLink">
//                                                 Website's Link (If any):
//                                             </label>
//                                             <input
//                                                 required
//                                                 type="text"
//                                                 className="form-control mt-1"
//                                                 placeholder="Enter Website's Link"
//                                                 id="WebsiteLink"
//                                                 value={formData.WebsiteLink}
//                                                 disabled={formSubmitted}
//                                                 onChange={(e) => handleInputChange(e, "WebsiteLink")}
//                                             />
//                                             {/* {formSubmitted && !formData.WebsiteLink && (
//                                                 <div style={{ color: "red" }}>
//                                                     {"Mention Website Link"}
//                                                 </div>
//                                             )} */}
//                                         </div>
//                                     </div>

//                                     <div className="col-lg-3">
//                                         <div className="form-group mt-2 mb-2">
//                                             <label htmlFor="WebsiteLink">Company Address: </label>
//                                             <input
//                                                 required
//                                                 type="text"
//                                                 className="form-control mt-1"
//                                                 placeholder="Enter Company Address"
//                                                 id="CompanyAddress"
//                                                 value={formData.CompanyAddress}
//                                                 disabled={formSubmitted}
//                                                 onChange={(e) => handleInputChange(e, "CompanyAddress")}
//                                             />
//                                         </div>
//                                     </div>

//                                     <div className="col-lg-3">
//                                         <div className="form-group mt-2 mb-2">
//                                             <label htmlFor="WebsiteLink">
//                                                 Company Pan Number:{" "}
//                                                 <span style={{ color: "red" }}>*</span>
//                                             </label>
//                                             <input
//                                                 required
//                                                 type="text"
//                                                 className="form-control mt-1"
//                                                 placeholder="Enter Pan Number"
//                                                 id="CompanyPanNumber"
//                                                 value={formData.CompanyPanNumber}
//                                                 disabled={formSubmitted}
//                                                 onChange={(e) => handleInputChange(e, "CompanyPanNumber")}
//                                             />
//                                             {formSubmitted && !formData.CompanyPanNumber && (
//                                                 <div style={{ color: "red" }}>{"Enter Pan Number"}</div>
//                                             )}
//                                         </div>
//                                     </div>

//                                     <div className="col-lg-4">
//                                         <div className="mt-2 mb-2">
//                                             <label htmlFor="Services">
//                                                 Select Your Services{" "}
//                                                 <span style={{ color: "red" }}>*</span>
//                                             </label>
//                                             <Select
//                                                 className="mt-1"
//                                                 isMulti
//                                                 options={options1}
//                                                 id="Services"
//                                                 value={options1.filter((option) => formData.SelectServices.includes(option.value))}
//                                                 placeholder="SelectServices"
//                                                 disabled={formSubmitted}
//                                                 onChange={handleChange}
//                                             >
//                                                 {options1.map((option) => (
//                                                     <option key={option.value} value={option.value}>
//                                                         {option.label}
//                                                     </option>
//                                                 ))}
//                                             </Select>
//                                             {formSubmitted && !formData.SelectServices.length && (
//                                                 <div style={{ color: "red" }}>
//                                                     {"Select Your Services"}
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </div>

//                                     <div className="col-lg-4">
//                                         <div className="form-group mt-2 mb-2">
//                                             <label htmlFor="Upload-MOA">Upload MOA{" "}
//                                                 {/* <span style={{ color: "red" }}>*</span> */}
//                                             </label>
//                                             <input
//                                                 type="file"
//                                                 class="form-control mt-1"
//                                                 id="UploadMOA"
//                                                 disabled={formSubmitted}
//                                                 onChange={(e) => {
//                                                     const file = e.target.files[0];
//                                                     // console.log("file" , file);
//                                                     if (functionShowSizeLimit(file)) {
//                                                         setFormData((prevState) => ({
//                                                             ...prevState,
//                                                             // UploadMOA: file,
//                                                             UploadMOA: file.name,
//                                                         }));
//                                                     } else {
//                                                         e.target.value = null; // Clear the input value to prevent invalid file selection
//                                                     }
//                                                 }}
//                                             />
//                                             <div className="input-note">
//                                                 (Files size should be less than 24MB)
//                                             </div>
//                                             {/* {formSubmitted && errors.UploadMOA && (
//                                                 <div style={{ color: "red" }}>
//                                                     {errors.UploadMOA}
//                                                 </div>
//                                             )} */}
//                                         </div>
//                                     </div>

//                                     <div className="col-lg-4">
//                                         <div className="form-group mt-2 mb-2">
//                                             <label htmlFor="Upload-AOA">Upload AOA{" "}
//                                                 {/* <span style={{ color: "red" }}>*</span> */}
//                                             </label>
//                                             <input
//                                                 type="file"
//                                                 className="form-control mt-1"
//                                                 id="Upload-AOA"
//                                                 disabled={formSubmitted}
//                                                 onChange={(e) => {
//                                                     const file = e.target.files[0];
//                                                     if (functionShowSizeLimit(file)) {
//                                                         setFormData((prevState) => ({
//                                                             ...prevState,
//                                                             UploadAOA: file,
//                                                         }));
//                                                     } else {
//                                                         e.target.value = null; // Clear the input value to prevent invalid file selection
//                                                     }
//                                                 }}
//                                             />
//                                             <div className="input-note">
//                                                 (Files size should be less than 24MB)
//                                             </div>
//                                             {/* {formSubmitted && errors.UploadAOA && (
//                                                 <div style={{ color: "red" }}>
//                                                     {errors.UploadAOA}
//                                                 </div>
//                                             )} */}
//                                         </div>
//                                     </div>

//                                     <div className="col-lg-12">
//                                         <div className="form-group d-flex align-items-center mt-2 mb-2">
//                                             <label className="m-0" htmlFor="SocialMediaLink">
//                                                 Do You have Social Media Link?
//                                             </label>
//                                             <div className="d-flex ms-2">
//                                                 <label className="form-check form-check-inline m-0 me-2">
//                                                     <input
//                                                         className="form-check-input"
//                                                         type="radio"
//                                                         name="socialMediaLink"
//                                                         value="Yes"
//                                                         onChange={handleRadioChange}
//                                                         disabled={formSubmitted}
//                                                         checked={formData.SocialMedia === "Yes"}
//                                                     />
//                                                     <span className="form-check-label">Yes</span>
//                                                 </label>
//                                                 <label className="form-check form-check-inline m-0">
//                                                     <input
//                                                         className="form-check-input"
//                                                         type="radio"
//                                                         name="socialMediaLink"
//                                                         value="No"
//                                                         onChange={handleRadioChange}
//                                                         disabled={formSubmitted}
//                                                         checked={formData.SocialMedia === "No"}
//                                                     />
//                                                     <span className="form-check-label">No</span>
//                                                 </label>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {showLinks && (
//                                         <div className="col-lg-12">
//                                             <div className="row">

//                                                 <div className="col-lg-3">
//                                                     <div className="form-group mt-2 mb-2">
//                                                         <label htmlFor="Facebook_link">
//                                                             Facebook link:
//                                                         </label>
//                                                         <input
//                                                             type="text"
//                                                             className="form-control mt-1"
//                                                             placeholder="Enter Facebook link"
//                                                             id="Facebook_link"
//                                                             value={formData.FacebookLink}
//                                                             disabled={formSubmitted}
//                                                             onChange={(e) => handleInputChange(e, "FacebookLink")}
//                                                         />
//                                                     </div>
//                                                 </div>

//                                                 <div className="col-lg-3">
//                                                     <div className="form-group mt-2 mb-2">
//                                                         <label htmlFor="Instagram_link">
//                                                             Instagram link:
//                                                         </label>
//                                                         <input
//                                                             type="text"
//                                                             className="form-control mt-1"
//                                                             placeholder="Enter Instagram link"
//                                                             id="Instagram_link"
//                                                             value={formData.InstagramLink}
//                                                             disabled={formSubmitted}
//                                                             onChange={(e) => handleInputChange(e, "InstagramLink")}
//                                                         />
//                                                     </div>
//                                                 </div>

//                                                 <div className="col-lg-3">
//                                                     <div className="form-group mt-2 mb-2">
//                                                         <label htmlFor="LinkedIn_link">
//                                                             LinkedIn link:
//                                                         </label>
//                                                         <input
//                                                             type="text"
//                                                             className="form-control mt-1"
//                                                             placeholder="Enter LinkedIn link"
//                                                             id="LinkedIn_link"
//                                                             value={formData.LinkedInLink}
//                                                             disabled={formSubmitted}
//                                                             onChange={(e) => handleInputChange(e, "LinkedInLink")}
//                                                         />
//                                                     </div>
//                                                 </div>

//                                                 <div className="col-lg-3">
//                                                     <div className="form-group mt-2 mb-2">
//                                                         <label htmlFor="YouTube_link">YouTube link:</label>
//                                                         <input
//                                                             type="text"
//                                                             className="form-control mt-1"
//                                                             placeholder="Enter YouTube link"
//                                                             id="YouTube_link"
//                                                             value={formData.YoutubeLink}
//                                                             disabled={formSubmitted}
//                                                             onChange={(e) => handleInputChange(e, "YoutubeLink")}
//                                                         />
//                                                     </div>
//                                                 </div>

//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="basic-info-form-head mt-4 mb-2">
//                             <h2 className="m-0">Brief About Your Business</h2>
//                         </div>

//                         <div className="card mt-2">
//                             <div className="card-body p-3">
//                                 <div className="row">

//                                     <div className="col-lg-6">
//                                         <div className="form-group mt-2 mb-2">
//                                             <label htmlFor="Brief">
//                                                 Brief Of Your Business/Product/Service (Company's
//                                                 Activities): <span style={{ color: "red" }}>*</span>
//                                             </label>
//                                             <textarea
//                                                 required
//                                                 className="form-control mt-1"
//                                                 placeholder="Brief Of Your Business"
//                                                 id="Brief"
//                                                 value={formData.CompanyActivities}
//                                                 disabled={formSubmitted}
//                                                 onChange={(e) => handleInputChange(e, "CompanyActivities")}
//                                             ></textarea>
//                                             {formSubmitted && !formData.CompanyActivities && (
//                                                 <div style={{ color: "red" }}>
//                                                     {"Enter Company Activities"}
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </div>

//                                     <div className="col-lg-6">
//                                         <div className="form-group mt-2 mb-2">
//                                             <label htmlFor="Problems">
//                                                 What Are The Problems That Your Product Or Service
//                                                 Proposes To Solve And How?{" "}
//                                                 <span style={{ color: "red" }}>*</span>
//                                             </label>
//                                             <textarea
//                                                 required
//                                                 className="form-control mt-1"
//                                                 placeholder="Brief Of Problems and Solutions"
//                                                 id="Problems"
//                                                 value={formData.ProductService}
//                                                 disabled={formSubmitted}
//                                                 onChange={(e) => handleInputChange(e, "ProductService")}
//                                             ></textarea>
//                                             {formSubmitted && !formData.ProductService && (
//                                                 <div style={{ color: "red" }}>
//                                                     {"Enter Problems And Solutions"}
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </div>

//                                     <div className="col-lg-6">
//                                         <div className="form-group mt-2 mb-2">
//                                             <label htmlFor="USP">
//                                                 Core Strength Of Your Business Which Differs Your
//                                                 Company From Other Business In The Industry (USP) <span style={{ color: "red" }}>*</span>
//                                             </label>
//                                             <textarea
//                                                 required
//                                                 className="form-control mt-1"
//                                                 placeholder="USP"
//                                                 id="USP"
//                                                 value={formData.CompanyUSP}
//                                                 disabled={formSubmitted}
//                                                 onChange={(e) => handleInputChange(e, "CompanyUSP")}
//                                             ></textarea>
//                                             {formSubmitted && !formData.CompanyUSP && (
//                                                 <div style={{ color: "red" }}>
//                                                     {"Enter Company USP"}
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </div>

//                                     <div className="col-lg-6">
//                                         <div className="form-group mt-2 mb-2">
//                                             <label htmlFor="ValueProposition">
//                                                 Value Proposition Of Your Project{" "}
//                                                 <span style={{ color: "red" }}>*</span>
//                                             </label>
//                                             <textarea
//                                                 required
//                                                 className="form-control mt-1"
//                                                 placeholder="Value Proposition"
//                                                 id="ValueProposition"
//                                                 value={formData.ValueProposition}
//                                                 disabled={formSubmitted}
//                                                 onChange={(e) => handleInputChange(e, "ValueProposition")}
//                                             ></textarea>
//                                             {formSubmitted && !formData.ValueProposition && (
//                                                 <div style={{ color: "red" }}>
//                                                     {"Enter Company Value Proposition Of Your Project"}
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </div>

//                                     <div className="col-lg-12">
//                                         <hr className="mt-1 mb-1" />
//                                     </div>

//                                     <div className="col-lg-6">
//                                         <div className="form-group mt-2 mb-2">
//                                             <label className="m-0">
//                                                 Any Kind Of Technology Is Involved In Your Product Or
//                                                 Service?
//                                             </label>
//                                             <div className="d-flex align-items-center">
//                                                 <label className="form-check form-check-inline m-0 me-2">
//                                                     <input
//                                                         className="form-check-input"
//                                                         type="radio"
//                                                         name="technologyInvolved"
//                                                         value="Yes"
//                                                         onChange={handleRadioChanges}
//                                                         disabled={formSubmitted}
//                                                         checked={formData.TechnologyInvolved === "Yes"}
//                                                     />
//                                                     <span className="form-check-label">Yes</span>
//                                                 </label>
//                                                 <label className="form-check form-check-inline m-0">
//                                                     <input
//                                                         className="form-check-input"
//                                                         type="radio"
//                                                         name="technologyInvolved"
//                                                         value="No"
//                                                         disabled={formSubmitted}
//                                                         onChange={handleRadioChanges}
//                                                         checked={formData.TechnologyInvolved === "No"}
//                                                     />
//                                                     <span className="form-check-label">No</span>
//                                                 </label>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {showTechnologyDetails && (
//                                         <div className="col-lg-6">
//                                             <div className="form-group mt-2 mb-2">
//                                                 <label className="m-0">
//                                                     Add Details About Technology Involved
//                                                     <span style={{ color: "red" }}>*</span>
//                                                 </label>
//                                                 <textarea
//                                                     className="form-control mt-1"
//                                                     placeholder="Technology details"
//                                                     id="TechnologyDetails"
//                                                     value={formData.TechnologyDetails}
//                                                     disabled={formSubmitted}
//                                                     onChange={(e) => handleInputChange(e, "TechnologyDetails")}
//                                                 ></textarea>
//                                                 {formSubmitted && !formData.TechnologyDetails && showTechnologyDetails && (
//                                                     <div style={{ color: "red" }}>
//                                                         Enter Technology
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     )}

//                                     <div class="col-lg-12">
//                                         <hr class="mt-1 mb-1" />
//                                     </div>

//                                     <div class="col-lg-6">
//                                         <div class="form-group mt-2 mb-2">
//                                             <label class="m-0">
//                                                 {" "}
//                                                 Do You Have Photos Of Product/Prototype Or LOGO?
//                                             </label>
//                                             <div class="d-flex align-items-center">
//                                                 <label class="form-check form-check-inline m-0 me-2">
//                                                     <input
//                                                         class="form-check-input"
//                                                         type="radio"
//                                                         name="Photos"
//                                                         value="Yes"
//                                                         onChange={handlePhotos}
//                                                         disabled={formSubmitted}
//                                                         checked={formData.UploadPhotos === "Yes"}
//                                                     />
//                                                     <span class="form-check-label">Yes</span>
//                                                 </label>
//                                                 <label class="form-check form-check-inline m-0">
//                                                     <input
//                                                         class="form-check-input"
//                                                         type="radio"
//                                                         name="Photos"
//                                                         value="No"
//                                                         onChange={handlePhotos}
//                                                         disabled={formSubmitted}
//                                                         checked={formData.UploadPhotos === "No"}
//                                                     />
//                                                     <span class="form-check-label">No</span>
//                                                 </label>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {showPhotos && (
//                                         <div className="col-lg-6">
//                                             <div className="form-group mt-2 mb-2">
//                                                 <label htmlFor="Photos-logos">
//                                                     Upload Photos of LOGO Or Product/Prototype <span style={{ color: "red" }}>*</span>
//                                                 </label>
//                                                 <input
//                                                     type="file"
//                                                     className="form-control mt-1"
//                                                     id="Photos-logos"
//                                                     disabled={formSubmitted}
//                                                     onChange={(e) => handleFileChange(e, "ProductPhoto")}
//                                                 />
//                                                 <div className="input-note">(Files size should be less than 24MB)</div>
//                                                 {formSubmitted && !formData.ProductPhoto && (
//                                                     <div style={{ color: "red" }}>{errors.ProductPhoto}</div>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     )}

//                                     <div class="col-lg-12">
//                                         <hr class="mt-1 mb-1" />
//                                     </div>

//                                     <div class="col-lg-6">
//                                         <div class="form-group mt-2 mb-2">
//                                             <label class="m-0">
//                                                 {" "}
//                                                 Any IP (Trademark/Copyright/Patent/Geographical
//                                                 Identification) Filed?
//                                             </label>
//                                             <div class="d-flex align-items-center">
//                                                 <label class="form-check form-check-inline m-0 me-2">
//                                                     <input
//                                                         className="form-check-input"
//                                                         type="radio"
//                                                         name="ip"
//                                                         value="Yes"
//                                                         onChange={handleIp}
//                                                         disabled={formSubmitted}
//                                                         checked={formData.AnyIpFiledResponse === "Yes"}

//                                                     />
//                                                     <span class="form-check-label">Yes</span>
//                                                 </label>
//                                                 <label class="form-check form-check-inline m-0">
//                                                     <input
//                                                         className="form-check-input"
//                                                         type="radio"
//                                                         name="ip"
//                                                         value="No"
//                                                         onChange={handleIp}
//                                                         disabled={formSubmitted}
//                                                         checked={formData.AnyIpFiledResponse === "No"}
//                                                     />
//                                                     <span class="form-check-label">No</span>
//                                                 </label>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {showIp && (
//                                         <div className="col-lg-6">
//                                             <div className="form-group mt-2 mb-2">
//                                                 <label htmlFor="Technologyinvolve">
//                                                     Provide The Option to Upload the Relevant Document:
//                                                     <span style={{ color: "red" }}>*</span>
//                                                 </label>
//                                                 <textarea
//                                                     className="form-control mt-1"
//                                                     placeholder="Any Comment"
//                                                     id="Technologyinvolve"
//                                                     value={formData.RelevantDocumentComment}
//                                                     disabled={formSubmitted}
//                                                     onChange={(e) => {
//                                                         setFormData({
//                                                             ...formData,
//                                                             RelevantDocumentComment: e.target.value,
//                                                         });
//                                                     }}
//                                                 ></textarea>
//                                                 <input
//                                                     type="file"
//                                                     className="form-control mt-1"
//                                                     id="ip"
//                                                     disabled={formSubmitted}
//                                                     onChange={(e) => {
//                                                         const file = e.target.files[0];
//                                                         if (functionShowSizeLimit(file)) {
//                                                             setFormData((prevState) => ({
//                                                                 ...prevState,
//                                                                 RelevantDocument: file,
//                                                             }));
//                                                         } else {
//                                                             e.target.value = null; // Clear the input value to prevent invalid file selection
//                                                         }
//                                                     }}
//                                                 />
//                                                 <div className="input-note">
//                                                     (Files size should be less than 24MB)
//                                                 </div>
//                                                 {formSubmitted && !formData.RelevantDocument && (
//                                                     <div style={{ color: "red" }}>
//                                                         {"Upload Relevant Document"}
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     )}

//                                     <div class="col-lg-12">
//                                         <hr class="mt-1 mb-1" />
//                                     </div>

//                                     <div className="col-lg-6">
//                                         <div className="form-group mt-2 mb-2">
//                                             <label className="m-0">
//                                                 Do You have ITR Filled for Previous Year?{" "}
//                                                 <span style={{ color: "red" }}>*</span>
//                                             </label>
//                                             <div className="d-flex align-items-center">
//                                                 <label className="form-check form-check-inline m-0 me-2">
//                                                     <input
//                                                         className="form-check-input"
//                                                         type="radio"
//                                                         name="Itr"
//                                                         value="Yes"
//                                                         onChange={handleItr}
//                                                         disabled={formSubmitted}
//                                                         checked={formData.ItrStatus === "Yes"}
//                                                     />
//                                                     <span className="form-check-label">Yes</span>
//                                                 </label>
//                                                 <label className="form-check form-check-inline m-0">
//                                                     <input
//                                                         className="form-check-input"
//                                                         type="radio"
//                                                         name="Itr"
//                                                         value="No"
//                                                         onChange={handleItr}
//                                                         disabled={formSubmitted}
//                                                         checked={formData.ItrStatus === "No"}
//                                                     />
//                                                     <span className="form-check-label">No</span>
//                                                 </label>
//                                             </div>
//                                             {formSubmitted && !showItr && showItr !== false && (
//                                                 <div style={{ color: "red" }}>
//                                                     Please select whether you have ITR filled for the previous year.
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </div>

//                                     <div className="col-lg-6">
//                                         {showItr === true && (
//                                             <div className="col-lg-12">
//                                                 <div className="form-group mt-2 mb-2">
//                                                     <label htmlFor="UploadAuditedStatement">
//                                                         Upload Audited Profit & Loss and Balance Sheet Statement (Mandatory)
//                                                         <span style={{ color: "red" }}>*</span>
//                                                     </label>
//                                                     <input
//                                                         type="file"
//                                                         className="form-control mt-1"
//                                                         id="UploadAuditedStatement"
//                                                         disabled={formSubmitted}
//                                                         onChange={(e) => handleFileChange(e, 'UploadAuditedStatement')}
//                                                     />
//                                                     <div className="input-note">
//                                                         (Files size should be less than 24MB)
//                                                     </div>
//                                                     {formSubmitted && showItr && errors.UploadAuditedStatement && (
//                                                         <div style={{ color: "red" }}>
//                                                             {errors.UploadAuditedStatement}
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         )}

//                                         {showItr === false && (
//                                             <div className="col-lg-12">
//                                                 <div className="form-group mt-2 mb-2">
//                                                     <label htmlFor="UploadProvisionalStatement">
//                                                         Upload Provisional Statement or Accounts report till date for Projection (Optional)
//                                                     </label>
//                                                     <input
//                                                         type="file"
//                                                         className="form-control mt-1"
//                                                         id="UploadProvisionalStatement"
//                                                         disabled={formSubmitted}
//                                                         onChange={(e) => handleFileChange(e, 'UploadProvisionalStatement')}
//                                                     />
//                                                     <div className="input-note">
//                                                         (Files size should be less than 24MB)
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         )}
//                                     </div>

//                                     <div class="col-lg-12">
//                                         <hr class="mt-1 mb-1" />
//                                     </div>

//                                     <div class="col-lg-6">
//                                         <div class="form-group mt-2 mb-2">
//                                             <label for="Competitor">
//                                                 Name Closest Direct/Indirect Competitor In The Market{" "}
//                                                 <span style={{ color: "red" }}>*</span>
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 class="form-control mt-1"
//                                                 placeholder="Closest Direct/Indirect Competitor In The Market"
//                                                 id="Competitor"
//                                                 value={formData.DirectInDirectMarket}
//                                                 disabled={formSubmitted}
//                                                 onChange={(e) => handleInputChange(e, "DirectInDirectMarket")}
//                                             />
//                                             {formSubmitted && errors.DirectInDirectMarket && (
//                                                 <div style={{ color: "red" }}>
//                                                     {errors.DirectInDirectMarket}
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </div>

//                                     <div class="col-lg-6">
//                                         <div class="form-group mt-2 mb-2">
//                                             <label class="m-0">
//                                                 Select Your Business Models{" "}
//                                                 <span style={{ color: "red" }}>*</span>
//                                             </label>
//                                             <div class="d-flex align-items-center mt-2">
//                                                 {["B2B", "B2C", "B2G", "D2C", "C2C"].map((model) => (
//                                                     <label
//                                                         class="form-check form-check-inline m-0 me-2"
//                                                         key={model}
//                                                     >
//                                                         <input
//                                                             class="form-check-input"
//                                                             type="checkbox" // Change type to radio
//                                                             name="BusinessModel" // Use same name for all radios to group them
//                                                             value={model}
//                                                             checked={formData.BusinessModel.includes(model)} // Check if model is in array
//                                                             disabled={formSubmitted}
//                                                             onChange={(e) => handleInputChange(e, "BusinessModel")}
//                                                         />
//                                                         <span class="form-check-label">{model}</span>
//                                                     </label>
//                                                 ))}
//                                                 {formSubmitted &&
//                                                     formData.BusinessModel.length === 0 && (
//                                                         <div style={{ color: "red" }}>
//                                                             Please select at least one business model.
//                                                         </div>
//                                                     )}
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <div class="col-lg-12">
//                                         <hr class="mt-1 mb-1" />
//                                     </div>

//                                     <div class="col-lg-6">
//                                         <div class="form-group mt-2 mb-2">
//                                             <label class="m-0">
//                                                 Have You Raised Any Financing Thus Far <br />
//                                                 (Grants, Loans, Investments, Friends And Family, Etc.)
//                                             </label>
//                                             <div class="d-flex align-items-center">
//                                                 <label class="form-check form-check-inline m-0 me-2">
//                                                     <input
//                                                         class="form-check-input"
//                                                         type="radio"
//                                                         name="Raised"
//                                                         value="Yes"
//                                                         disabled={formSubmitted}
//                                                         onChange={handleFinance}
//                                                         checked={formData.FinanceCondition === "Yes"}
//                                                     />
//                                                     <span class="form-check-label">Yes</span>
//                                                 </label>
//                                                 <label class="form-check form-check-inline m-0">
//                                                     <input
//                                                         class="form-check-input"
//                                                         type="radio"
//                                                         name="Raised"
//                                                         value="No"
//                                                         disabled={formSubmitted}
//                                                         onChange={handleFinance}
//                                                         checked={formData.FinanceCondition === "No"}
//                                                     />
//                                                     <span class="form-check-label">No</span>
//                                                 </label>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {showFinance && (
//                                         <div class="col-lg-6">
//                                             <div class="form-group mt-2 mb-2">
//                                                 <label for="grants">
//                                                     Provide The Option to Mentioned The Same and Explain
//                                                     <span style={{ color: "red" }}>*</span>
//                                                 </label>
//                                                 <textarea
//                                                     class="form-control mt-1"
//                                                     placeholder="grants, loans, investments, friends and family, etc"
//                                                     id="grants"
//                                                     value={formData.Finance}
//                                                     disabled={formSubmitted}
//                                                     onChange={(e) => handleInputChange(e, "Finance")}
//                                                 ></textarea>
//                                                 {formSubmitted && !formData.Finance && (
//                                                     <div style={{ color: "red" }}>
//                                                         {"Enter details about Finance"}
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     )}

//                                     <div class="col-lg-12">
//                                         <hr class="mt-1 mb-1" />
//                                     </div>

//                                     <div className="col-lg-6">
//                                         <div className="form-group mt-2 mb-2">
//                                             <label htmlFor="Declaration">
//                                                 Upload Declaration
//                                                 {/* <span style={{ color: "red" }}>*</span>: */}
//                                             </label>
//                                             <input
//                                                 type="file"
//                                                 class="form-control mt-1"
//                                                 id="Declaration"
//                                                 disabled={formSubmitted}
//                                                 onChange={(e) => {
//                                                     const file = e.target.files[0];
//                                                     if (functionShowSizeLimit(file)) {
//                                                         setFormData((prevState) => ({
//                                                             ...prevState,
//                                                             UploadDeclaration: file,
//                                                         }));
//                                                     } else {
//                                                         e.target.value = null; // Clear the input value to prevent invalid file selection
//                                                     }
//                                                 }}
//                                             />
//                                             <div className="input-note">
//                                                 (Files size should be less than 24MB)
//                                             </div>
//                                             {/* {formSubmitted && errors.UploadDeclaration && (
//                                                 <div style={{ color: "red" }}>
//                                                     {errors.UploadDeclaration}
//                                                 </div>
//                                             )} */}
//                                         </div>
//                                     </div>

//                                     <div className="col-lg-6">
//                                         <div className="form-group mt-2 mb-2">
//                                             <label htmlFor="Declaration">
//                                                 Upload Relevant Docs{" "}
//                                                 {/* <span style={{ color: "red" }}>*</span> */}
//                                             </label>
//                                             <input
//                                                 type="file"
//                                                 class="form-control mt-1"
//                                                 id="Declaration"
//                                                 disabled={formSubmitted}
//                                                 onChange={(e) => {
//                                                     const file = e.target.files[0];
//                                                     if (functionShowSizeLimit(file)) {
//                                                         setFormData((prevState) => ({
//                                                             ...prevState,
//                                                             UploadRelevantDocs: file,
//                                                         }));
//                                                     } else {
//                                                         e.target.value = null; // Clear the input value to prevent invalid file selection
//                                                     }
//                                                 }}
//                                             />
//                                             <div className="input-note">
//                                                 (Files size should be less than 24MB)
//                                             </div>
//                                             {/* {formSubmitted && errors.UploadRelevantDocs && (
//                                                 <div style={{ color: "red" }}>
//                                                     {errors.UploadRelevantDocs}
//                                                 </div>
//                                             )} */}
//                                         </div>
//                                     </div>

//                                     <div class="col-lg-12">
//                                         <hr class="mt-1 mb-1" />
//                                     </div>

//                                 </div>
//                             </div>
//                         </div>

//                         <div class="basic-info-form-head mt-4 mb-2">
//                             {/* <h3>Directors And Team Details</h3> */}
//                         </div>

//                         <div className="row">

//                             <div className="col-lg-12">
//                                 <div className="form-group d-flex align-items-center mt-2 mb-2">
//                                     <h2 className="m-0" htmlFor="DirectorsNO">
//                                         How Many Directors/Partners Are There?
//                                     </h2>
//                                     <select
//                                         className="form-select mt-1 ms-2"
//                                         id="DirectorsNO"
//                                         style={{ width: "70px" }}
//                                         disabled={formSubmitted}
//                                         onChange={handleDirectorsChange}
//                                         value={numberOfDirectors}
//                                     >
//                                         {Array.from({ length: 6 }, (_, i) => (
//                                             <option key={i + 1} value={i + 1}>
//                                                 {i + 1}
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </div>
//                             </div>
//                             {renderDirectorFields()}
//                         </div>

//                         <div className="row">
//                             <div className="col-lg-12 text-left">
//                                 <button
//                                     type="submit"
//                                     onClick={handleSave}
//                                     className="btn btn-info btn-lg mt-4 mb-4"
//                                     style={{ width: "100px" }}
//                                 >
//                                     Save
//                                 </button>

//                                 <button
//                                     type="submit"
//                                     onClick={handleSubmit}
//                                     className="btn btn-primary btn-lg mt-4 mb-4 ms-4"
//                                     style={{ width: "100px" }}
//                                 >
//                                     Submit
//                                 </button>
//                             </div>
//                         </div>

//                     </div>
//                 </form>
//                 {formSubmitted && formData.BusinessModel && (
//                     <div className="mt-4">{getEmailContent()}</div>
//                 )}
//             </div>

//             <Backdrop
//                 sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
//                 open={openBacdrop}
//                 onClick={() => setOpenBacdrop(false)}
//             >
//                 <CircularProgress color="inherit" />
//             </Backdrop>
//         </div>
//     )
// }

// export default CustomerForm;