import React, { useState, useEffect } from 'react';
import { CgClose } from "react-icons/cg";
import { FaCheck, FaChevronUp, FaChevronDown } from "react-icons/fa";
import { options } from "../../components/Options.js";
import Select from "react-select";
import axios from 'axios';
import Swal from "sweetalert2";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    TextField,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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
    interestedInformation = [],
    forView,
    fordesignation,
    id,
    setOpenBacdrop,
    open,
    setOpen
}) {
    const [visibleQuestions, setVisibleQuestions] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    // const [open, setOpen] = useState(false); // State to control dialog visibility

    const prefilledData = interestedInformation.length > 0 ? interestedInformation[0] : {};

    const mapServicesToSelectOptions = (servicesArray) =>
        servicesArray?.map(service => ({
            label: service,
            value: service
        })) || [];

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
        mainQuestion: [],
        ename: ename,
        "Company Name": companyName
    });

    // useEffect(() => {
    //     setOpen(true); // Open the dialog when component mounts
    // }, []);

    const handleClose = () => {
        setOpen(false);
        handleClearInterestedInformation();
    };

    const handleInputChange = (section, field, value) => {
        setFormData(prevData => ({
            ...prevData,
            [section]: {
                ...prevData[section],
                [field]: value
            }
        }));
    };

    const handleMultiSelectChange = (section, field, selectedOptions) => {
        setFormData(prevData => ({
            ...prevData,
            [section]: {
                ...prevData[section],
                [field]: selectedOptions.map(option => option.value)
            }
        }));
    };

    const handleSubmitInformation = () => {
        const isWhatsAppRequestFilled = formData.clientWhatsAppRequest.nextFollowUpDate && formData.clientWhatsAppRequest.remarks;
        const isEmailRequestFilled = formData.clientEmailRequest.nextFollowUpDate && formData.clientEmailRequest.remarks;
        const isInterestedServicesFilled = formData.interestedInServices.servicesPitched.length > 0 && formData.interestedInServices.servicesInterestedIn.length > 0 && formData.interestedInServices.offeredPrice && formData.interestedInServices.nextFollowUpDate && formData.interestedInServices.remarks;
        const isInterestedButNotNowFilled = formData.interestedButNotNow.servicesPitched.length > 0 && formData.interestedButNotNow.servicesInterestedIn.length > 0 && formData.interestedButNotNow.offeredPrice && formData.interestedButNotNow.nextFollowUpDate && formData.interestedButNotNow.remarks;

        if (isWhatsAppRequestFilled || isEmailRequestFilled || isInterestedServicesFilled || isInterestedButNotNowFilled) {
            handleSubmitToBackend();
        } else {
            Swal.fire("Please complete at least one question with all required fields.");
        }
    };

    const handleSubmitToBackend = async () => {
        const DT = new Date();
        const date = DT.toLocaleDateString();
        const time = DT.toLocaleTimeString();
        const payload = {
            ...formData,
            "Company Name": companyName,
            ename: ename
        };
        setOpenBacdrop(true);
        try {
            const response = await axios.post(`${secretKey}/company-data/company/${companyName}/interested-info`, {
                newInterestedInfo: payload,
                status: status,
                id: id,
                ename: ename,
                date: date,
                time: time
            });
            if (response.status === 200) {
                Swal.fire('Data saved successfully');
                handleClearInterestedInformation();
                refetch();
            }
        } catch (error) {
            console.error('Error saving data:', error);
        } finally {
            setOpenBacdrop(false);
        }
    };

    const handleClearInterestedInformation = () => {
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
            mainQuestion: [],
            ename: ename,
            "Company Name": companyName
        });
        refetch();
        setVisibleQuestions({});
    };

    const handleYesClickNew = (questionId) => {
        setVisibleQuestions((prevState) => ({
            ...prevState,
            [questionId]: !prevState[questionId], // Toggle the visibility of the question
        }));
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm">
            <DialogTitle>
                <h5 className="modal-title" id="staticBackdropLabel">Why are you moving this lead to Interested?</h5>
                <IconButton onClick={handleClose} style={{ position: 'absolute', right: 8, top: 8 }}>
                    <CgClose />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Typography variant="h6">{formData["Company Name"]}</Typography>

                {/* WhatsApp Request Section */}
                <Accordion expanded={!!visibleQuestions["q1"]} onChange={() => handleYesClickNew("q1")}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>1. Client asked to send documents/information on WhatsApp for review!</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <TextField
                            label="Next Follow-Up Date"
                            type="date"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={formData.clientWhatsAppRequest.nextFollowUpDate}
                            onChange={(e) => handleInputChange('clientWhatsAppRequest', 'nextFollowUpDate', e.target.value)}
                            margin="normal"
                        />
                        <TextField
                            label="Remark Box"
                            placeholder="Add Remarks"
                            fullWidth
                            multiline
                            value={formData.clientWhatsAppRequest.remarks}
                            onChange={(e) => handleInputChange('clientWhatsAppRequest', 'remarks', e.target.value)}
                            margin="normal"
                        />
                    </AccordionDetails>
                </Accordion>

                {/* Email Request Section */}
                <Accordion expanded={!!visibleQuestions["q2"]} onChange={() => handleYesClickNew("q2")}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>2. Client asked to send documents/information via email for review.</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <TextField
                            label="Next Follow-Up Date"
                            type="date"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={formData.clientEmailRequest.nextFollowUpDate}
                            onChange={(e) => handleInputChange('clientEmailRequest', 'nextFollowUpDate', e.target.value)}
                            margin="normal"
                        />
                        <TextField
                            label="Remark Box"
                            placeholder="Add Remarks"
                            fullWidth
                            multiline
                            value={formData.clientEmailRequest.remarks}
                            onChange={(e) => handleInputChange('clientEmailRequest', 'remarks', e.target.value)}
                            margin="normal"
                        />
                    </AccordionDetails>
                </Accordion>

                {/* Interested in Services Section */}
                <Accordion expanded={!!visibleQuestions["q3"]} onChange={() => handleYesClickNew("q3")}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>3. Interested in one of our services.</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>Services Pitched:</Typography>
                        <Select
                            isMulti
                            options={[]} // Add appropriate options
                            value={formData.interestedInServices.servicesPitched}
                            onChange={(selectedOptions) => handleMultiSelectChange('interestedInServices', 'servicesPitched', selectedOptions)}
                            placeholder="Select Services..."
                        />
                        <Typography>Services Interested In:</Typography>
                        <Select
                            isMulti
                            options={[]} // Add appropriate options
                            value={formData.interestedInServices.servicesInterestedIn}
                            onChange={(selectedOptions) => handleMultiSelectChange('interestedInServices', 'servicesInterestedIn', selectedOptions)}
                            placeholder="Select Services..."
                        />
                        <TextField
                            label="Offered Price"
                            placeholder="Offered Price"
                            fullWidth
                            value={formData.interestedInServices.offeredPrice}
                            onChange={(e) => handleInputChange('interestedInServices', 'offeredPrice', e.target.value)}
                            margin="normal"
                        />
                        <TextField
                            label="Next Follow-Up Date"
                            type="date"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={formData.interestedInServices.nextFollowUpDate}
                            onChange={(e) => handleInputChange('interestedInServices', 'nextFollowUpDate', e.target.value)}
                            margin="normal"
                        />
                        <TextField
                            label="Remarks"
                            placeholder="Add Remarks"
                            fullWidth
                            multiline
                            value={formData.interestedInServices.remarks}
                            onChange={(e) => handleInputChange('interestedInServices', 'remarks', e.target.value)}
                            margin="normal"
                        />
                    </AccordionDetails>
                </Accordion>

                {/* Interested But Not Now Section */}
                <Accordion expanded={!!visibleQuestions["q4"]} onChange={() => handleYesClickNew("q4")}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>4. Interested, but doesn't need the service right now.</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>Services Pitched:</Typography>
                        <Select
                            isMulti
                            options={[]} // Add appropriate options
                            value={formData.interestedButNotNow.servicesPitched}
                            onChange={(selectedOptions) => handleMultiSelectChange('interestedButNotNow', 'servicesPitched', selectedOptions)}
                            placeholder="Select Services..."
                        />
                        <Typography>Services Interested In:</Typography>
                        <Select
                            isMulti
                            options={[]} // Add appropriate options
                            value={formData.interestedButNotNow.servicesInterestedIn}
                            onChange={(selectedOptions) => handleMultiSelectChange('interestedButNotNow', 'servicesInterestedIn', selectedOptions)}
                            placeholder="Select Services..."
                        />
                        <TextField
                            label="Offered Price"
                            placeholder="Offered Price"
                            fullWidth
                            value={formData.interestedButNotNow.offeredPrice}
                            onChange={(e) => handleInputChange('interestedButNotNow', 'offeredPrice', e.target.value)}
                            margin="normal"
                        />
                        <TextField
                            label="Next Follow-Up Date"
                            type="date"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={formData.interestedButNotNow.nextFollowUpDate}
                            onChange={(e) => handleInputChange('interestedButNotNow', 'nextFollowUpDate', e.target.value)}
                            margin="normal"
                        />
                        <TextField
                            label="Remarks"
                            placeholder="Add Remarks"
                            fullWidth
                            multiline
                            value={formData.interestedButNotNow.remarks}
                            onChange={(e) => handleInputChange('interestedButNotNow', 'remarks', e.target.value)}
                            margin="normal"
                        />
                    </AccordionDetails>
                </Accordion>

                {/* Disclaimer */}
                <Typography variant="body2" color="textSecondary" style={{ marginTop: '16px' }}>
                    Disclaimer: At least one question must be answered to move the lead to 'Interested.' Remember that the backend team will verify all responses. False answers may result in management action, including but not limited to revoking the lead.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="error" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="contained" color="primary">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default EmployeeInterestedInformationDialog;
