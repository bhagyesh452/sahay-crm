import React, { useState, useEffect } from 'react';
import { CgClose } from "react-icons/cg";
import { FaCheck } from "react-icons/fa6";
import { options } from "../../components/Options.js";
import Select from "react-select";
import axios from 'axios';
import Swal from "sweetalert2";
import { FaChevronUp } from "react-icons/fa6";
import { FaChevronDown } from "react-icons/fa";

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
    fordesignation
}) {

    // console.log("inetsredtedInform", interestedInformation)
    const [visibleQuestions, setVisibleQuestions] = useState({}); // Track which question's options are visible
    const [isSubmitted, setIsSubmitted] = useState(false); // To disable submit button
    // Function to handle Yes click (show options)
    // Pre-fill form data with existing interested information
    const prefilledData = interestedInformation.length > 0 ? interestedInformation[0] : {};



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
            remarks: prefilledData?.clientWhatsAppRequest?.remarks || ''
        },
        clientEmailRequest: {
            nextFollowUpDate: prefilledData?.clientEmailRequest?.nextFollowUpDate
                ? new Date(prefilledData.clientEmailRequest.nextFollowUpDate).toISOString().split('T')[0]
                : '',
            remarks: prefilledData?.clientEmailRequest?.remarks || ''
        },
        interestedInServices: {
            servicesPitched: mapServicesToSelectOptions(prefilledData?.interestedInServices?.servicesPitched || []),
            servicesInterestedIn: mapServicesToSelectOptions(prefilledData?.interestedInServices?.servicesInterestedIn || []),
            offeredPrice: prefilledData?.interestedInServices?.offeredPrice || '',
            nextFollowUpDate: prefilledData?.interestedInServices?.nextFollowUpDate
                ? new Date(prefilledData.interestedInServices.nextFollowUpDate).toISOString().split('T')[0]
                : '',
            remarks: prefilledData?.interestedInServices?.remarks || ''
        },
        interestedButNotNow: {
            servicesPitched: mapServicesToSelectOptions(prefilledData?.interestedButNotNow?.servicesPitched || []),
            servicesInterestedIn: mapServicesToSelectOptions(prefilledData?.interestedButNotNow?.servicesInterestedIn || []),
            offeredPrice: prefilledData?.interestedButNotNow?.offeredPrice || '',
            nextFollowUpDate: prefilledData?.interestedButNotNow?.nextFollowUpDate
                ? new Date(prefilledData.interestedButNotNow.nextFollowUpDate).toISOString().split('T')[0]
                : '',
            remarks: prefilledData?.interestedButNotNow?.remarks || ''
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
        // Validation: Ensure that at least one question has all required fields filled
        const isWhatsAppRequestFilled = formData.clientWhatsAppRequest.nextFollowUpDate && formData.clientWhatsAppRequest.remarks;
        const isEmailRequestFilled = formData.clientEmailRequest.nextFollowUpDate && formData.clientEmailRequest.remarks;
        const isInterestedServicesFilled = formData.interestedInServices.servicesPitched.length > 0 && formData.interestedInServices.servicesInterestedIn.length > 0 && formData.interestedInServices.offeredPrice && formData.interestedInServices.nextFollowUpDate && formData.interestedInServices.remarks;
        const isInterestedButNotNowFilled = formData.interestedButNotNow.servicesPitched.length > 0 && formData.interestedButNotNow.servicesInterestedIn.length > 0 && formData.interestedButNotNow.offeredPrice && formData.interestedButNotNow.nextFollowUpDate && formData.interestedButNotNow.remarks;

        if (isWhatsAppRequestFilled || isEmailRequestFilled || isInterestedServicesFilled || isInterestedButNotNowFilled) {
            // At least one section is fully answered, proceed with submission
            handleSubmitToBackend();
        } else {
            // Show an error if no section is fully answered
            Swal.fire("Please complete at least one question with all required fields.");
        }
    };

    const handleSubmitToBackend = async () => {
        const payload = {
            ...formData,
            "Company Name": companyName,
            ename: ename
        }
        try {
            const response = await axios.post(`${secretKey}/company-data/company/${companyName}/interested-info`,
                {
                    newInterestedInfo: payload, // The formData object
                    status: status // Include the company status
                }
            );
            if (response.status === 200) {
                Swal.fire('Data saved successfully');
                handleClearInterestedInformation()
                refetch()
            }
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    // Reset form data to initial state
    const handleClearInterestedInformation = () => {
      {fordesignation !== "admin" && fordesignation !== "datamanager" &&
          setFormData({
            clientWhatsAppRequest: {
                nextFollowUpDate: '',
                remarks: ''
            },
            clientEmailRequest: {
                nextFollowUpDate: '',
                remarks: ''
            },
            interestedInServices: {
                servicesPitched: [],
                servicesInterestedIn: [],
                offeredPrice: '',
                nextFollowUpDate: '',
                remarks: ''
            },
            interestedButNotNow: {
                servicesPitched: [],
                servicesInterestedIn: [],
                offeredPrice: '',
                nextFollowUpDate: '',
                remarks: ''
            },
            mainQuestion: [], // Reset the main questions tracking
            ename: ename,
            "Company Name": companyName
        })
    }
        if(fordesignation !== "admin" && fordesignation !== "datamanager") {
            setStatus(companyStatus)
            setStatusClass("untouched_status")
        }

        refetch()
        // Manually hide the modal
        setVisibleQuestions({});
        setIsSubmitted(false);
        const modalElement = document.getElementById(modalId);
        modalElement.classList.remove("show");
        modalElement.setAttribute("aria-hidden", "true");
        modalElement.style.display = "none";

        // Remove the backdrop if it exists
        const modalBackdrop = document.querySelector('.modal-backdrop');
        if (modalBackdrop) {
            modalBackdrop.parentNode.removeChild(modalBackdrop);
        }

        // Cleanup: Remove any leftover 'modal-open' classes and inline styles from body
        document.body.classList.remove('modal-open');
        document.body.style.removeProperty('overflow');
        document.body.style.removeProperty('padding-right');
    };

    // Clear fields related to a specific question
    const clearFieldsForQuestion = (questionId) => {
        switch (questionId) {
            case "q1":
                setFormData((prevData) => ({
                    ...prevData,
                    clientWhatsAppRequest: {
                        nextFollowUpDate: '',
                        remarks: ''
                    }
                }));
                break;
            case "q2":
                setFormData((prevData) => ({
                    ...prevData,
                    clientEmailRequest: {
                        nextFollowUpDate: '',
                        remarks: ''
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
                        remarks: ''
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
                        remarks: ''
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
    // console.log("visiblequestions" , visibleQuestions)
    return (<>
        <div className="modal fade" id={modalId} data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-scrollable modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">Why are you moving this lead to Interested?</h5>
                        <button type="button"
                            className="btn-close"
                            aria-label="Close"
                            onClick={handleClearInterestedInformation}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <div className="company_name_int-_mod">
                            {companyName}
                        </div>
                        <div className="accordion" id="accordionQue">
                            {(!forView || (!isEmptyAnswer(formData.clientWhatsAppRequest.nextFollowUpDate) || !isEmptyAnswer(formData.clientWhatsAppRequest.remarks))) && (<div className="accordion-item int-accordion-item">
                                <div className="accordion-header p-2" id="accordionQueOne">
                                    <div className="d-flex align-items-center justify-content-between"  >
                                        <div className="int-que mr-2">
                                            1. Client asked to send documents/information on WhatsApp for review!
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
                            </div>)}
                            {(!forView || (!isEmptyAnswer(formData.clientEmailRequest.nextFollowUpDate) || !isEmptyAnswer(formData.clientEmailRequest.remarks))) && (
                                <div className="accordion-item int-accordion-item">
                                    <div className="accordion-header p-2" id="accordionQuetwo">
                                        <div className="d-flex align-items-center justify-content-between"  >
                                            <div className="int-que mr-2">
                                                2. Client asked to send documents/information via email for review.
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
                                </div>)}
                            {(!forView || (!isEmptyAnswer(formData.interestedInServices.nextFollowUpDate) ||
                                !isEmptyAnswer(formData.interestedInServices.remarks) ||
                                !isEmptyAnswer(formData.interestedInServices.servicesPitched) ||
                                !isEmptyAnswer(formData.interestedInServices.servicesInterestedIn) ||
                                !isEmptyAnswer(formData.interestedInServices.offeredPrice))) && (<div className="accordion-item int-accordion-item">
                                    <div className="accordion-header p-2" id="accordionQuethree">
                                        <div className="d-flex align-items-center justify-content-between"  >
                                            <div className="int-que mr-2">
                                                3. Interested in one of our services.
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
                                </div>)}
                            {(!forView || (!isEmptyAnswer(formData.interestedButNotNow.nextFollowUpDate) ||
                                !isEmptyAnswer(formData.interestedButNotNow.remarks) ||
                                !isEmptyAnswer(formData.interestedButNotNow.servicesPitched) ||
                                !isEmptyAnswer(formData.interestedButNotNow.servicesInterestedIn) ||
                                !isEmptyAnswer(formData.interestedButNotNow.offeredPrice))) && (<div className="accordion-item int-accordion-item">
                                    <div className="accordion-header p-2" id="accordionQueFour">
                                        <div className="d-flex align-items-center justify-content-between"  >
                                            <div className="int-que mr-2">
                                                4. Interested, but doesn't need the service right now.
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
                                </div>)}
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
                                style={{ border: "none", borderRadius: "0px" }} onClick={handleClearInterestedInformation}>Close</button>
                            <button
                                type="button"
                                class="btn btn-primary w-50 m-0"
                                style={{ border: "none", borderRadius: "0px" }} onClick={handleSubmitInformation} disabled={forView}>Submit</button>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    </>)
}

export default EmployeeInterestedInformationDialog