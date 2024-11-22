import React, { useState, useEffect } from 'react';
import { CgClose } from "react-icons/cg";
import { FaCheck } from "react-icons/fa6";
import { options } from "../../components/Options.js";
import Select from "react-select";
import axios from 'axios';
import Swal from "sweetalert2";
import { FaChevronUp } from "react-icons/fa6";
import { FaChevronDown } from "react-icons/fa";
import { moment } from 'moment';

function EmployeeInterestedInformationDialog({
    modalId,
    companyName,
    refetch,
    ename,
    secretKey,
    status,
    setStatus,
    setStatusClass,
    companyStatus,
    interestedInformation = [], // Existing interested information
    forView,
    fordesignation,
    id,


}) {

    // console.log("interesedinfostatus", status, companyStatus)

    // console.log("inetsredtedInform", interestedInformation)
    const [visibleQuestions, setVisibleQuestions] = useState({}); // Track which question's options are visible
    const [isSubmitted, setIsSubmitted] = useState(false); // To disable submit button
    // Function to handle Yes click (show options)
    // Pre-fill form data with existing interested information
    const prefilledData = interestedInformation.length > 0 ? interestedInformation[0] : {};
    function formatDatePro(inputDate) {
        const date = new Date(inputDate);
        const day = date.getDate();
        const month = date.toLocaleString('en-US', { month: 'long' });
        const year = date.getFullYear();
        return `${day} ${month}, ${year}`;
    }


    useEffect(() => {
        // Highlight "Yes" buttons based on pre-filled data
        if (formData.clientWhatsAppRequest.nextFollowUpDate || formData.clientWhatsAppRequest.remarks) {
            setVisibleQuestions((prev) => ({ ...prev, q1: true }));
        }
        if (formData.clientEmailRequest.nextFollowUpDate || formData.clientEmailRequest.remarks) {
            setVisibleQuestions((prev) => ({ ...prev, q2: true }));
        }
        if (formData.interestedInServices.servicesPitched.length > 0 || formData.interestedInServices.servicesInterestedIn.length > 0) {
            setVisibleQuestions((prev) => ({ ...prev, q3: true }));
        }
        if (formData.interestedButNotNow.servicesPitched.length > 0 || formData.interestedButNotNow.servicesInterestedIn.length > 0) {
            setVisibleQuestions((prev) => ({ ...prev, q4: true }));
        }
    }, []);
    const handleYesClick = (questionId) => {
        setVisibleQuestions({
            [questionId]: true, // Toggle the visibility of the question content
        });
    };

    const handleYesClickNew = (questionId) => {
        setVisibleQuestions((prevState) => ({
            ...prevState,
            [questionId]: !prevState[questionId], // Toggle the visibility of the question
        }));
    };

    // When "No" is clicked for a specific question, reset related fields
    const handleNoClick = (questionId) => {
        clearFieldsForQuestion(questionId); // Clear fields for that specific question
        setVisibleQuestions((prev) => ({
            ...prev,
            [questionId]: false // Hide the options for this question
        }));
    };
    const mapServicesToSelectOptions = (servicesArray) => {
        return servicesArray?.map(service => ({
            label: service,
            value: service
        })) || [];
    };

    const [formData, setFormData] = useState({
        clientWhatsAppRequest: {
            nextFollowUpDate: prefilledData?.clientWhatsAppRequest?.nextFollowUpDate
                ? new Date(prefilledData.clientWhatsAppRequest.nextFollowUpDate).toISOString().split('T')[0]
                : '',
            remarks: prefilledData?.clientWhatsAppRequest?.remarks || '',
            date: prefilledData?.clientWhatsAppRequest?.date
                ? new Date(prefilledData.clientWhatsAppRequest.date).toISOString().split('T')[0]
                : new Date().toISOString().split('T')[0], // Default to today
        },
        clientEmailRequest: {
            nextFollowUpDate: prefilledData?.clientEmailRequest?.nextFollowUpDate
                ? new Date(prefilledData.clientEmailRequest.nextFollowUpDate).toISOString().split('T')[0]
                : '',
            remarks: prefilledData?.clientEmailRequest?.remarks || '',
            date: prefilledData?.clientEmailRequest?.date
                ? new Date(prefilledData.clientEmailRequest.date).toISOString().split('T')[0]
                : new Date().toISOString().split('T')[0], // Default to today

        },
        interestedInServices: {
            servicesPitched: mapServicesToSelectOptions(prefilledData?.interestedInServices?.servicesPitched || []),
            servicesInterestedIn: mapServicesToSelectOptions(prefilledData?.interestedInServices?.servicesInterestedIn || []),
            offeredPrice: prefilledData?.interestedInServices?.offeredPrice || '',
            nextFollowUpDate: prefilledData?.interestedInServices?.nextFollowUpDate
                ? new Date(prefilledData.interestedInServices.nextFollowUpDate).toISOString().split('T')[0]
                : '',
            remarks: prefilledData?.interestedInServices?.remarks || '',
            date: prefilledData?.interestedInServices?.date
                ? new Date(prefilledData.interestedInServices.date).toISOString().split('T')[0]
                : new Date().toISOString().split('T')[0], // Default to today
        },
        interestedButNotNow: {
            servicesPitched: mapServicesToSelectOptions(prefilledData?.interestedButNotNow?.servicesPitched || []),
            servicesInterestedIn: mapServicesToSelectOptions(prefilledData?.interestedButNotNow?.servicesInterestedIn || []),
            offeredPrice: prefilledData?.interestedButNotNow?.offeredPrice || '',
            nextFollowUpDate: prefilledData?.interestedButNotNow?.nextFollowUpDate
                ? new Date(prefilledData.interestedButNotNow.nextFollowUpDate).toISOString().split('T')[0]
                : '',
            remarks: prefilledData?.interestedButNotNow?.remarks || '',
            date: prefilledData?.interestedButNotNow?.date
                ? new Date(prefilledData.interestedButNotNow.date).toISOString().split('T')[0]
                : new Date().toISOString().split('T')[0], // Default to today
        },
        mainQuestion: [], // This tracks the Yes/No responses
        ename: ename,
        "Company Name": companyName
    });
    const handleInputChange = (section, field, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [section]: {
                ...prevData[section],
                [field]: value
            }
        }));
    };

    // Example for multi-select (servicesPitched, servicesInterestedIn)
    const handleMultiSelectChange = (section, field, selectedOptions) => {
        setFormData((prevData) => ({
            ...prevData,
            [section]: {
                ...prevData[section],
                [field]: selectedOptions.map((option) => option.value)
            }
        }));
    };

    const handleSubmitInformation = () => {
        // Validation logic based on the status
        if (status === "Docs/Info Sent (W)" || status === "Docs/Info Sent (E)" || status === "Docs/Info Sent (W&E)") {
            const isQuestion1Filled = formData.clientWhatsAppRequest.nextFollowUpDate &&
                formData.clientWhatsAppRequest.remarks;

            const isQuestion2Filled = formData.clientEmailRequest.nextFollowUpDate &&
                formData.clientEmailRequest.remarks;

            if (!isQuestion1Filled && !isQuestion2Filled) {
                Swal.fire("Please complete either Question 1 or Question 2 with at least one required field.");
                return;
            }
        } else if (status === "Interested") {
            // Ensure either question 3 or question 4 is filled
            const isQuestion3Filled = formData.interestedInServices.servicesPitched.length > 0 &&
                formData.interestedInServices.servicesInterestedIn.length > 0 &&
                formData.interestedInServices.offeredPrice &&
                formData.interestedInServices.nextFollowUpDate &&
                formData.interestedInServices.remarks;

            const isQuestion4Filled = formData.interestedButNotNow.servicesPitched.length > 0 &&
                formData.interestedButNotNow.servicesInterestedIn.length > 0 &&
                formData.interestedButNotNow.offeredPrice &&
                formData.interestedButNotNow.nextFollowUpDate &&
                formData.interestedButNotNow.remarks;

            if (!isQuestion3Filled && !isQuestion4Filled) {
                Swal.fire("Please complete either Question 3 or Question 4 with at least one required field.");
                return;
            }
        }

        // If validation passes, proceed with submission
        handleSubmitToBackend();
    };


    const handleSubmitToBackend = async () => {
        const DT = new Date();
        const updatedFormData = { ...formData };

        // Iterate through each key in the formData
        Object.keys(updatedFormData).forEach((key) => {
            if (typeof updatedFormData[key] === "object" && !Array.isArray(updatedFormData[key])) {
                // Check if fields (other than 'date') have been modified
                const hasDataChanged = Object.entries(updatedFormData[key]).some(([subKey, value]) => {
                    return subKey !== "date" && value !== "" && value !== null;
                });

                // Update 'date' only if changes exist; otherwise, retain the section as is
                if (hasDataChanged) {
                    updatedFormData[key].date = new Date().toISOString().split("T")[0];
                } else if (!hasDataChanged) {
                    delete updatedFormData[key].date; // Remove 'date' field but retain other data in the section
                }
            }
        });

        // Create payload without excluding entire sections
        const payload = {
            ename,
            "Company Name": companyName,
            ...updatedFormData, // Send all sections including unchanged ones
        };

        console.log("payload", payload)

        try {
            const response = await axios.post(`${secretKey}/company-data/company/${companyName}/interested-info`, {
                newInterestedInfo: payload,
                status,
                id,
                ename,
                date: DT.toLocaleDateString(),
                time: DT.toLocaleTimeString(),
            });

            if (response.status === 200) {
                Swal.fire("Data saved successfully");

                // Handle modal and UI cleanup
                const modalElement = document.getElementById(modalId);
                modalElement.classList.remove("show");
                modalElement.setAttribute("aria-hidden", "true");
                modalElement.style.display = "none";

                const modalBackdrop = document.querySelector(".modal-backdrop");
                if (modalBackdrop) {
                    modalBackdrop.parentNode.removeChild(modalBackdrop);
                }

                document.body.classList.remove("modal-open");
                document.body.style.removeProperty("overflow");
                document.body.style.removeProperty("padding-right");

                handleClearInterestedInformation();
                refetch();
            }
        } catch (error) {
            console.error("Error saving data:", error);
        }
    };




    // Reset form data to initial state
    const handleClearInterestedInformation = () => {
        {
            !forView &&

                setFormData({
                    clientWhatsAppRequest: {
                        nextFollowUpDate: '',
                        remarks: '',
                        date: ""
                    },
                    clientEmailRequest: {
                        nextFollowUpDate: '',
                        remarks: '',
                        date: ""
                    },
                    interestedInServices: {
                        servicesPitched: [],
                        servicesInterestedIn: [],
                        offeredPrice: '',
                        nextFollowUpDate: '',
                        remarks: '',
                        date: ""
                    },
                    interestedButNotNow: {
                        servicesPitched: [],
                        servicesInterestedIn: [],
                        offeredPrice: '',
                        nextFollowUpDate: '',
                        remarks: '',
                        date: ""
                    },
                    mainQuestion: [], // Reset the main questions tracking
                    ename: ename,
                    "Company Name": companyName
                })
            // Call setStatus and setStatusClass only if they are available
            if (typeof setStatus === 'function' && typeof refetch === 'function') {
                setStatus(companyStatus);
                refetch();
            }
            if (typeof setStatusClass === 'function') {
                setStatusClass(companyStatus === "Untouched" ? "untouched_status" : companyStatus === "Busy" ? "dfaulter-status" : "cdbp-status");
            }
            if (typeof refetch === 'function') {
                refetch();
            }
            setVisibleQuestions({})
            refetch();
        }
        // // Manually hide the modal
        // const modalElement = document.getElementById(modalId);
        // modalElement.classList.remove("show");
        // modalElement.setAttribute("aria-hidden", "true");
        // modalElement.style.display = "none";

        // // Remove the backdrop if it exists
        // const modalBackdrop = document.querySelector('.modal-backdrop');
        // if (modalBackdrop) {
        //     modalBackdrop.parentNode.removeChild(modalBackdrop);
        // }

        // // Cleanup: Remove any leftover 'modal-open' classes and inline styles from body
        // document.body.classList.remove('modal-open');
        // document.body.style.removeProperty('overflow');
        // document.body.style.removeProperty('padding-right');
        refetch();
    };

    // Clear fields related to a specific question
    const clearFieldsForQuestion = (questionId) => {
        switch (questionId) {
            case "q1":
                setFormData((prevData) => ({
                    ...prevData,
                    clientWhatsAppRequest: {
                        nextFollowUpDate: '',
                        remarks: '',
                        date: ""
                    }
                }));
                break;
            case "q2":
                setFormData((prevData) => ({
                    ...prevData,
                    clientEmailRequest: {
                        nextFollowUpDate: '',
                        remarks: '',
                        date: ""
                    }
                }));
                break;
            case "q3":
                setFormData((prevData) => ({
                    ...prevData,
                    interestedInServices: {
                        servicesPitched: [],
                        servicesInterestedIn: [],
                        offeredPrice: '',
                        nextFollowUpDate: '',
                        remarks: '',
                        date: ""
                    }
                }));
                break;
            case "q4":
                setFormData((prevData) => ({
                    ...prevData,
                    interestedButNotNow: {
                        servicesPitched: [],
                        servicesInterestedIn: [],
                        offeredPrice: '',
                        nextFollowUpDate: '',
                        remarks: '',
                        date: ""
                    }
                }));
                break;
            default:
                break;
        }
    };
    const isEmptyAnswer = (fieldData) => {
        if (Array.isArray(fieldData)) {
            return fieldData.length === 0;
        }
        return !fieldData;
    };

    const getVisibleQuestions = () => {
        const visibleKeys = Object.keys(visibleQuestions).filter((key) => visibleQuestions[key]);

        // If no questions are visible, assume q1 and q2 are visible by default
        if (visibleKeys.length === 0) {
            return ["q1", "q2"];
        }


        return visibleKeys;
    };

    const calculateQuestionNumber = (questionId) => {
        const visibleKeys = getVisibleQuestions(); // Get visible question keys dynamically

        // Check if the question is in the visibleKeys list
        const questionIndex = visibleKeys.indexOf(questionId);

        if (questionIndex !== -1) {
            return questionIndex + 1; // Return the actual index + 1 if the question is visible
        }

        // If not in the list, explicitly handle q1 and q2
        if (questionId === "q3") {
            return 1;
        } else if (questionId === "q4") {
            return 2;
        }

        // Return 0 for other cases
        return 0;
    };

    // console.log("formData", formData);

    //console.log("visiblequestions", visibleQuestions)
    return (<>
        <div className="modal fade" id={modalId} data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-scrollable modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">Why are you moving this lead to Interested?</h5>
                        <button type="button"
                            className="btn-close"
                            aria-label="Close"
                            data-bs-dismiss="modal"
                            onClick={handleClearInterestedInformation}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <div className='d-flex align-items-center justify-content-between'>
                            <div className="company_name_int-_mod">
                                {companyName}
                            </div>
                            {/* <div className="company_name_int-_mod">
                                {prefilledData?.updatedAt ? formatDatePro(prefilledData?.updatedAt) : ""}
                            </div> */}
                        </div>

                        <div className="accordion" id="accordionQue">
                            {/* <div className="accordion-part">
                          
                                <div className="d-flex justify-content-end align-items-center mb-2">
                                    <span className="part-date">
                                        {visibleQuestions["q2"]
                                            ? formatDatePro(prefilledData?.clientEmailRequest?.date)
                                            : visibleQuestions["q1"]
                                                ? formatDatePro(prefilledData?.clientWhatsAppRequest?.date)
                                                : ""}
                                    </span>
                                </div>
                            </div> */}
                            {((!forView) && (status !== "Interested") || (!isEmptyAnswer(formData.clientWhatsAppRequest.nextFollowUpDate) || !isEmptyAnswer(formData.clientWhatsAppRequest.remarks))) &&
                                (
                                    <>
                                        <div className="accordion-part">
                                            <div className="d-flex justify-content-end align-items-center mb-2">
                                                <span className="part-date">
                                                    {prefilledData?.clientWhatsAppRequest?.date ? formatDatePro(prefilledData?.clientWhatsAppRequest?.date) :""}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="accordion-item int-accordion-item">
                                            <div className="accordion-header p-2" id="accordionQueOne">
                                                <div className="d-flex align-items-center justify-content-between"  >
                                                    <div className="int-que mr-2">
                                                        <div className="question-container">
                                                            <span>{calculateQuestionNumber("q1")}. Client asked to send documents/information on WhatsApp for review!</span>
                                                            {/* <span className="date">{formatDatePro(prefilledData?.clientWhatsAppRequest?.date) || ""}</span> */}
                                                        </div>
                                                        {/* {calculateQuestionNumber("q1")}. Client asked to send documents/information on WhatsApp for review! */}
                                                    </div>
                                                    {(forView) ? (
                                                        <div className="custom-toggle d-flex align-items-center int-opt">
                                                            <div className="custom-Yes-No d-flex align-items-center int-opt">
                                                                <div
                                                                    className="yes-no"
                                                                    onClick={() => handleYesClickNew("q1")}
                                                                >
                                                                    <button className="yes-no-alias">
                                                                        {visibleQuestions["q1"] ? <FaChevronUp /> : <FaChevronDown />}
                                                                    </button>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="custom-Yes-No d-flex align-items-center int-opt">
                                                            <div className="yes-no"
                                                                onClick={() => handleYesClick("q1")}>
                                                                <input
                                                                    type="radio"
                                                                    name="rGroup"
                                                                    value="1"
                                                                    id="r1"
                                                                //checked={formData.clientWhatsAppRequest.nextFollowUpDate && formData.clientWhatsAppRequest.remarks ? true : false}  
                                                                />
                                                                <label
                                                                    className="yes-no-alias"
                                                                    for="r1"
                                                                    data-bs-toggle="collapse"
                                                                    data-bs-target="#collapseOneQue"
                                                                    aria-expanded="true"
                                                                    aria-controls="collapseOneQue"
                                                                >
                                                                    <div className="yes-alias-i"><FaCheck /></div>
                                                                    <div className="ml-1">Yes</div>
                                                                </label>
                                                            </div>
                                                            <div className="yes-no ml-1" onClick={() => handleNoClick("q1")}>
                                                                <input type="radio" name="rGroup" value="2" id="r2" />
                                                                <label className="yes-no-alias" for="r2">
                                                                    <div className="no-alias-i"><CgClose /></div>
                                                                    <div className="ml-1">No</div>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    )}

                                                </div>
                                            </div>
                                            {visibleQuestions["q1"] &&
                                                (
                                                    <div
                                                        id="collapseOneQue"
                                                        className="accordion-collapse collapse show"
                                                        aria-labelledby="accordionQueOne"
                                                        data-bs-parent="#accordionQue"
                                                    >
                                                        <div className="accordion-body int-sub-que">
                                                            <div className="row">
                                                                <div className="col-6">
                                                                    <div class="form-group mt-2 mb-2">
                                                                        <label for="date">Next Follow-Up Date ?</label>
                                                                        <input
                                                                            type="date"
                                                                            class="form-control mt-1"
                                                                            id="date"
                                                                            value={formData.clientWhatsAppRequest.nextFollowUpDate}
                                                                            onChange={(e) => handleInputChange('clientWhatsAppRequest', 'nextFollowUpDate', e.target.value)}
                                                                            disabled={forView}

                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-6">
                                                                    <div class="form-group mt-2 mb-2">
                                                                        <label for="text">Remark Box: </label>
                                                                        <input type="text"
                                                                            class="form-control mt-1"
                                                                            placeholder="Add Remarks"
                                                                            id="text"
                                                                            value={formData.clientWhatsAppRequest.remarks}
                                                                            onChange={(e) => handleInputChange('clientWhatsAppRequest', 'remarks', e.target.value)}
                                                                            disabled={forView}

                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </>)}
                            {((!forView) && (status !== "Interested") || (!isEmptyAnswer(formData.clientEmailRequest.nextFollowUpDate) || !isEmptyAnswer(formData.clientEmailRequest.remarks))) && (
                                <>
                                    <div className="accordion-part">
                                        <div className="d-flex justify-content-end align-items-center mb-2">
                                            <span className="part-date">
                                                {prefilledData?.clientEmailRequest?.date ? formatDatePro(prefilledData?.clientEmailRequest?.date) : ""}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="accordion-item int-accordion-item">
                                        <div className="accordion-header p-2" id="accordionQuetwo">
                                            <div className="d-flex align-items-center justify-content-between"  >
                                                <div className="int-que">
                                                    <div className="question-container">
                                                        <span>{calculateQuestionNumber("q2")}. Client asked to send documents/information via email for review.</span>
                                                        {/* <span className="date">{formatDatePro(prefilledData?.clientEmailRequest?.date) || ""}</span> */}
                                                    </div>
                                                </div>
                                                {forView ? (
                                                    <div className="custom-toggle d-flex align-items-center int-opt">
                                                        <div className="custom-Yes-No d-flex align-items-center int-opt">
                                                            <div
                                                                className="yes-no"
                                                                onClick={() => handleYesClickNew("q2")}
                                                            >
                                                                <button className="yes-no-alias">
                                                                    {visibleQuestions["q2"] ? <FaChevronUp /> : <FaChevronDown />}
                                                                </button>

                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="custom-Yes-No d-flex align-items-center int-opt">
                                                        <div className="yes-no" onClick={() => handleYesClick("q2")}>
                                                            <input type="radio" name="rGroup2" value="3" id="r3" />
                                                            <label
                                                                className="yes-no-alias"
                                                                for="r3"
                                                                data-bs-toggle="collapse"
                                                                data-bs-target="#collapsetwoQue"
                                                                aria-expanded="true"
                                                                aria-controls="collapsetwoQue"
                                                            >
                                                                <div className="yes-alias-i"><FaCheck /></div>
                                                                <div className="ml-1">Yes</div>
                                                            </label>
                                                        </div>
                                                        <div className="yes-no ml-1" onClick={() => handleNoClick("q2")}>
                                                            <input type="radio" name="rGroup2" value="4" id="r4" />
                                                            <label className="yes-no-alias" for="r4">
                                                                <div className="no-alias-i"><CgClose /></div>
                                                                <div className="ml-1">No</div>
                                                            </label>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {visibleQuestions["q2"] &&
                                            (<div
                                                id="collapsetwoQue"
                                                className="accordion-collapse collapse show"
                                                aria-labelledby="accordionQuetwo"
                                                data-bs-parent="#accordionQue"
                                            >
                                                <div className="accordion-body int-sub-que">
                                                    <div className="row">
                                                        <div className="col-6">
                                                            <div class="form-group mt-2 mb-2">
                                                                <label for="date">Next Follow-Up Date ?</label>
                                                                <input type="date"
                                                                    class="form-control mt-1"
                                                                    id="date"
                                                                    value={formData.clientEmailRequest.nextFollowUpDate}
                                                                    onChange={(e) => handleInputChange('clientEmailRequest', 'nextFollowUpDate', e.target.value)}
                                                                    disabled={forView}

                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-6">
                                                            <div class="form-group mt-2 mb-2">
                                                                <label for="text">Remark Box: </label>
                                                                <input type="text"
                                                                    class="form-control mt-1"
                                                                    placeholder="Add Remarks"
                                                                    id="text"
                                                                    value={formData.clientEmailRequest.remarks}
                                                                    onChange={(e) => handleInputChange('clientEmailRequest', 'remarks', e.target.value)}
                                                                    disabled={forView}

                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            )}
                                    </div>
                                </>
                            )}

                            <hr className="mb-2 mt-2" style={{ border: "1px solid #ddd" }} />
                            {/* <div className="accordion-part">
                                
                                <div className="d-flex justify-content-end align-items-center mb-2">
                                    <span className="part-date">
                                        {visibleQuestions["q4"]
                                            ? formatDatePro(prefilledData?.interestedButNotNow?.date)
                                            : visibleQuestions["q3"]
                                                ? formatDatePro(prefilledData?.interestedInServices?.date)
                                                : ""}
                                    </span>
                                </div>
                            </div> */}
                            {((!forView) && (status !== "Docs/Info Sent (W)" && status !== "Docs/Info Sent (E)" && status !== "Docs/Info Sent (W&E)") || (!isEmptyAnswer(formData.interestedInServices.nextFollowUpDate) ||
                                !isEmptyAnswer(formData.interestedInServices.remarks) ||
                                !isEmptyAnswer(formData.interestedInServices.servicesPitched) ||
                                !isEmptyAnswer(formData.interestedInServices.servicesInterestedIn) ||
                                !isEmptyAnswer(formData.interestedInServices.offeredPrice))) && (
                                    <>
                                    <div className="accordion-part">
                                            <div className="d-flex justify-content-end align-items-center mb-2">
                                                <span className="part-date">
                                                    {
                                                     prefilledData?.interestedInServices?.date ?   formatDatePro(prefilledData?.interestedInServices?.date) :""
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                <div className="accordion-item int-accordion-item">
                                    <div className="accordion-header p-2" id="accordionQuethree">
                                        <div className="d-flex align-items-center justify-content-between"  >
                                            <div className="int-que mr-2">
                                                <span>{calculateQuestionNumber("q3")}. Interested in one of our services</span>
                                                {/* <span className="date">{formatDatePro(prefilledData?.interestedInServices?.date) || ""}</span> */}
                                                {/* {calculateQuestionNumber("q3")}. Interested in one of our services. */}
                                            </div>
                                            {forView ? (
                                                <div className="custom-toggle d-flex align-items-center int-opt">
                                                    <div className="custom-Yes-No d-flex align-items-center int-opt">
                                                        <div
                                                            className="yes-no"
                                                            onClick={() => handleYesClickNew("q3")}
                                                        >
                                                            <button className="yes-no-alias">
                                                                {visibleQuestions["q3"] ? <FaChevronUp /> : <FaChevronDown />}
                                                            </button>

                                                        </div>
                                                    </div>
                                                </div>
                                            ) :
                                                (
                                                    <div className="custom-Yes-No d-flex align-items-center int-opt">
                                                        <div className="yes-no"
                                                            onClick={() => handleYesClick("q3")}
                                                        >
                                                            <input type="radio" name="rGroup3" value="5" id="r5" />
                                                            <label
                                                                className="yes-no-alias"
                                                                for="r5"
                                                                data-bs-toggle="collapse"
                                                                data-bs-target="#collapsethreeQue"
                                                                aria-expanded="true"
                                                                aria-controls="collapsethreeQue"
                                                            >
                                                                <div className="yes-alias-i"><FaCheck /></div>
                                                                <div className="ml-1">Yes</div>
                                                            </label>
                                                        </div>
                                                        <div className="yes-no ml-1" onClick={() => handleNoClick("q3")}>
                                                            <input type="radio" name="rGroup3" value="6" id="r6" />
                                                            <label className="yes-no-alias" for="r6">
                                                                <div className="no-alias-i"><CgClose /></div>
                                                                <div className="ml-1">No</div>
                                                            </label>
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                    {visibleQuestions["q3"] && (
                                        <div
                                            id="collapsethreeQue"
                                            className="accordion-collapse collapse show"
                                            aria-labelledby="accordionQuethree"
                                            data-bs-parent="#accordionQue">
                                            <div className="accordion-body int-sub-que">
                                                <div className="row">
                                                    <div className="col-6">
                                                        <div class="form-group mt-2 mb-2">
                                                            <label for="date">Services Pitched:</label>
                                                            {forView ? (
                                                                <Select
                                                                    isMulti
                                                                    options={options}
                                                                    value={formData.interestedInServices.servicesPitched}
                                                                    onChange={(selectedOptions) => handleMultiSelectChange('interestedInServices', 'servicesPitched', selectedOptions)}
                                                                    placeholder="Select Services..."
                                                                    isDisabled={forView}  // This will disable the select input
                                                                />) : (
                                                                <Select
                                                                    isMulti
                                                                    options={options}
                                                                    //value={formData.interestedInServices.servicesPitched}
                                                                    onChange={(selectedOptions) => handleMultiSelectChange('interestedInServices', 'servicesPitched', selectedOptions)}
                                                                    placeholder="Select Services..."
                                                                    isDisabled={forView}  // This will disable the select input
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="col-6">
                                                        <div class="form-group mt-2 mb-2">
                                                            <label for="date">Services Interested In :</label>
                                                            {forView ? (
                                                                <Select
                                                                    isMulti
                                                                    options={options}
                                                                    value={formData.interestedInServices.servicesInterestedIn}
                                                                    onChange={(selectedOptions) => handleMultiSelectChange('interestedInServices', 'servicesInterestedIn', selectedOptions)}
                                                                    placeholder="Select Services..."
                                                                    isDisabled={forView}  // This will disable the select input

                                                                />
                                                            ) : (
                                                                <Select
                                                                    isMulti
                                                                    options={options}
                                                                    //value={formData.interestedInServices.servicesInterestedIn}
                                                                    onChange={(selectedOptions) => handleMultiSelectChange('interestedInServices', 'servicesInterestedIn', selectedOptions)}
                                                                    placeholder="Select Services..."
                                                                    isDisabled={forView}  // This will disable the select input

                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-6">
                                                        <div class="form-group mt-2 mb-2">
                                                            <label for="date">Offered Price: </label>
                                                            <input
                                                                type="text"
                                                                class="form-control mt-1"
                                                                placeholder="Offered Price"
                                                                id="text"
                                                                value={formData.interestedInServices.offeredPrice}
                                                                onChange={(e) => handleInputChange('interestedInServices', 'offeredPrice', e.target.value)}
                                                                disabled={forView}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-6">
                                                        <div class="form-group mt-2 mb-2">
                                                            <label for="text">Next Follow-Up Date: </label>
                                                            <input
                                                                type="date"
                                                                class="form-control mt-1"
                                                                id="date"
                                                                value={formData.interestedInServices.nextFollowUpDate}
                                                                onChange={(e) => handleInputChange('interestedInServices', 'nextFollowUpDate', e.target.value)}
                                                                disabled={forView}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-12">
                                                        <div class="form-group mt-2 mb-2">
                                                            <label for="date">Remarks: </label>
                                                            <textarea
                                                                type="text"
                                                                class="form-control mt-1"
                                                                placeholder="Add Remarks"
                                                                id="text"
                                                                value={formData.interestedInServices.remarks}
                                                                onChange={(e) => handleInputChange('interestedInServices', 'remarks', e.target.value)}
                                                                disabled={forView}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>)}
                                </div>
                                </>)}
                            {((!forView) && (status !== "Docs/Info Sent (W)" && status !== "Docs/Info Sent (E)" && status !== "Docs/Info Sent (W&E)") || (!isEmptyAnswer(formData.interestedButNotNow.nextFollowUpDate) ||
                                !isEmptyAnswer(formData.interestedButNotNow.remarks) ||
                                !isEmptyAnswer(formData.interestedButNotNow.servicesPitched) ||
                                !isEmptyAnswer(formData.interestedButNotNow.servicesInterestedIn) ||
                                !isEmptyAnswer(formData.interestedButNotNow.offeredPrice))) && (
                                    <>
                                        <div className="accordion-part">
                                            <div className="d-flex justify-content-end align-items-center mb-2">
                                                <span className="part-date">
                                                    {
                                                      prefilledData?.interestedButNotNow?.date?  formatDatePro(prefilledData?.interestedButNotNow?.date) :""
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                        <div className="accordion-item int-accordion-item">
                                            <div className="accordion-header p-2" id="accordionQueFour">
                                                <div className="d-flex align-items-center justify-content-between"  >
                                                    <div className="int-que mr-2">
                                                        <span>{calculateQuestionNumber("q4")}. Interested, but doesn't need the service right now.</span>
                                                        {/* <span className="date">{formatDatePro(prefilledData?.interestedButNotNow?.date) || ""}</span> */}
                                                        {/* {calculateQuestionNumber("q4")}. Interested, but doesn't need the service right now. */}
                                                    </div>
                                                    {forView ? (
                                                        <div className="custom-toggle d-flex align-items-center int-opt">
                                                            <div className="custom-Yes-No d-flex align-items-center int-opt">
                                                                <div
                                                                    className="yes-no"
                                                                    onClick={() => handleYesClickNew("q4")}
                                                                >
                                                                    <button className="yes-no-alias">
                                                                        {visibleQuestions["q4"] ? <FaChevronUp /> : <FaChevronDown />}
                                                                    </button>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (<div className="custom-Yes-No d-flex align-items-center int-opt">
                                                        <div className="yes-no" onClick={() => handleYesClick("q4")}>
                                                            <input type="radio" name="rGroup4" value="7" id="r7" />
                                                            <label
                                                                className="yes-no-alias"
                                                                for="r7"
                                                                data-bs-toggle="collapse"
                                                                data-bs-target="#collapseFourQue"
                                                                aria-expanded="true"
                                                                aria-controls="collapseFourQue">
                                                                <div className="yes-alias-i"><FaCheck /></div>
                                                                <div className="ml-1">Yes</div>
                                                            </label>
                                                        </div>
                                                        <div className="yes-no ml-1" onClick={() => handleNoClick("q4")}>
                                                            <input type="radio" name="rGroup4" value="8" id="r8" />
                                                            <label className="yes-no-alias" for="r8">
                                                                <div className="no-alias-i"><CgClose /></div>
                                                                <div className="ml-1">No</div>
                                                            </label>
                                                        </div>
                                                    </div>)}

                                                </div>
                                            </div>
                                            {visibleQuestions["q4"] && (
                                                <div
                                                    id="collapseFourQue"
                                                    className="accordion-collapse collapse show"
                                                    aria-labelledby="accordionQueFour"
                                                    data-bs-parent="#accordionQue">
                                                    <div className="accordion-body int-sub-que">
                                                        <div className="row">
                                                            <div className="col-6">
                                                                <div class="form-group mt-2 mb-2">
                                                                    <label for="date">Services Pitched:</label>
                                                                    {forView ? (<Select
                                                                        isMulti
                                                                        options={options}
                                                                        value={formData.interestedButNotNow.servicesPitched}
                                                                        onChange={(selectedOptions) => handleMultiSelectChange('interestedButNotNow', 'servicesPitched', selectedOptions)}
                                                                        placeholder="Select Services..."
                                                                        isDisabled={forView}  // This will disable the select input

                                                                    />) : (
                                                                        <Select
                                                                            isMulti
                                                                            options={options}
                                                                            //value={formData.interestedButNotNow.servicesPitched}
                                                                            onChange={(selectedOptions) => handleMultiSelectChange('interestedButNotNow', 'servicesPitched', selectedOptions)}
                                                                            placeholder="Select Services..."
                                                                            isDisabled={forView}  // This will disable the select input

                                                                        />
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="col-6">
                                                                <div class="form-group mt-2 mb-2">
                                                                    <label for="date">Services Interested In :</label>
                                                                    {forView ? (
                                                                        <Select
                                                                            isMulti
                                                                            options={options}
                                                                            value={formData.interestedButNotNow.servicesInterestedIn}
                                                                            onChange={(selectedOptions) => handleMultiSelectChange('interestedButNotNow', 'servicesInterestedIn', selectedOptions)}
                                                                            placeholder="Select Services..."
                                                                            isDisabled={forView}  // This will disable the select input

                                                                        />) : (
                                                                        <Select
                                                                            isMulti
                                                                            options={options}
                                                                            //value={formData.interestedButNotNow.servicesInterestedIn}
                                                                            onChange={(selectedOptions) => handleMultiSelectChange('interestedButNotNow', 'servicesInterestedIn', selectedOptions)}
                                                                            placeholder="Select Services..."
                                                                            isDisabled={forView}  // This will disable the select input

                                                                        />
                                                                    )
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-6">
                                                                <div class="form-group mt-2 mb-2">
                                                                    <label for="date">Offered Price: </label>
                                                                    <input
                                                                        type="text"
                                                                        class="form-control mt-1"
                                                                        placeholder="Offered Price"
                                                                        id="text"
                                                                        value={formData.interestedButNotNow.offeredPrice}
                                                                        onChange={(e) => handleInputChange('interestedButNotNow', 'offeredPrice', e.target.value)}
                                                                        disabled={forView}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-6">
                                                                <div class="form-group mt-2 mb-2">
                                                                    <label for="text">Next Follow-Up Date: </label>
                                                                    <input
                                                                        type="date"
                                                                        class="form-control mt-1"
                                                                        id="date"
                                                                        value={formData.interestedButNotNow.nextFollowUpDate}
                                                                        onChange={(e) => handleInputChange('interestedButNotNow', 'nextFollowUpDate', e.target.value)}
                                                                        disabled={forView}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-12">
                                                                <div class="form-group mt-2 mb-2">
                                                                    <label for="date">Remarks: </label>
                                                                    <textarea
                                                                        type="text"
                                                                        class="form-control mt-1"
                                                                        placeholder="Add Remarks"
                                                                        id="text"
                                                                        value={formData.interestedButNotNow.remarks}
                                                                        onChange={(e) => handleInputChange('interestedButNotNow', 'remarks', e.target.value)}
                                                                        disabled={forView}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>)}
                                        </div>
                                    </>
                                )}
                        </div>
                        <div className="accordion-item int-accordion-item">
                            <div className="accordion-header p-2" id="accordionQueFive">
                                <div className="d-flex align-items-center justify-content-between"  >
                                    <div className="int-que mr-2 disclamer">
                                        Disclaimer: At least one question must be answered to move the lead to 'Interested.' Remember that the backend team will verify all responses. False answers may result in management action, including but not limited to revoking the lead."
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer p-0 m-0">
                        <div className='d-flex w-100 m-0'>
                            <button
                                type="button"
                                class="btn btn-danger w-50 m-0"
                                data-bs-dismiss="modal"
                                style={{ border: "none", borderRadius: "0px" }}
                                onClick={handleClearInterestedInformation}>Close</button>
                            <button
                                type="button"
                                class="btn btn-primary w-50 m-0"
                                // data-bs-dismiss="modal"
                                style={{ border: "none", borderRadius: "0px" }} onClick={handleSubmitInformation} disabled={forView}>Submit</button>
                        </div>
                    </div>
                </div>
            </div >
        </div>
    </>)
}

export default EmployeeInterestedInformationDialog