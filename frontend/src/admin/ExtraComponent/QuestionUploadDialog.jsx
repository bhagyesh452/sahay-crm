import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Radio,
    RadioGroup,
    FormControlLabel,
    Typography,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { MdOutlineFileUpload } from "react-icons/md";
import { SiGoogledocs } from "react-icons/si";
import { MdDelete } from "react-icons/md";
import { AiOutlineDownload } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import Swal from "sweetalert2"

function QuestionUploadDialog({ 
    dialogOpen, 
    handleDialogToggle, 
    completeData,
    editMode,
    selectedQuestionData,
    onSubmit,
    setEditMode,
    fetchingData
 }) {
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const [uploadMethod, setUploadMethod] = useState("form");
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        question: "",
        option1: "",
        option2: "",
        option3: "",
        option4: "",
        correctOption: "",
        rightResponse: "",
        wrongResponse: "",
        slot: "",
    });
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [slotOptions, setSlotOptions] = useState(["slot 1", "slot 2"]);

    useEffect(() => {
        if (completeData && completeData.length > 0) {
            // Extract numeric parts from slotIndex and ensure valid numbers
            const slotIndices = completeData
                .map((slot) => {
                    const match = slot.slotIndex.match(/\d+$/); // Extract numeric part
                    return match ? parseInt(match[0], 10) : NaN;
                })
                .filter((index) => !isNaN(index)); // Filter out invalid entries

            let maxSlotIndex = Math.max(...slotIndices);
            if (isNaN(maxSlotIndex)) {
                maxSlotIndex = 0; // Default to 0 if no valid slots are found
            }

            const validSlots = [];
            completeData.forEach((slot) => {
                const match = slot.slotIndex.match(/\d+$/);
                const slotNumber = match ? parseInt(match[0], 10) : NaN;
                const questionCount = slot.questions?.length || 0;

                if (!isNaN(slotNumber)) {
                    // Slots with less than 45 questions are enabled
                    if (questionCount < 45) {
                        validSlots.push({ label: `slot ${slotNumber}`, disabled: false });
                    }
                    // Slots with exactly 45 questions are disabled
                    if (questionCount === 45) {
                        validSlots.push({ label: `slot ${slotNumber}`, disabled: true });
                    }
                }
            });

            //console.log("Valid Slots Before Adding New Slots:", validSlots);

            // Add next two slots only if all current slots are full (at 45 questions)
            if (!validSlots.some((slot) => !slot.disabled)) {
                validSlots.push(
                    { label: `slot ${maxSlotIndex + 1}`, disabled: false },
                    { label: `slot ${maxSlotIndex + 2}`, disabled: false }
                );
            }

            setSlotOptions(validSlots);
            //console.log("Final Slot Options:", validSlots);
        } else {
            // Default slots if no data is available
            setSlotOptions([
                { label: "slot 1", disabled: false },
                { label: "slot 2", disabled: false },
            ]);
        }
    }, [completeData]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear the error for the field when the user types
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDragEnter = () => {
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        setFile(droppedFile);
    };

    const handleRemoveFile = () => {
        setFile(null);
    };

    const validateForm = () => {
        let validationErrors = {};
        if (!formData.question) validationErrors.question = "Question is required.";
        if (!formData.option1) validationErrors.option1 = "Option 1 is required.";
        if (!formData.option2) validationErrors.option2 = "Option 2 is required.";
        if (!formData.option3) validationErrors.option3 = "Option 3 is required.";
        if (!formData.option4) validationErrors.option4 = "Option 4 is required.";
        if (formData.correctOption === "") validationErrors.correctOption = "Correct option is required.";
        if (!formData.rightResponse) validationErrors.rightResponse = "Right response is required.";
        if (!formData.wrongResponse) validationErrors.wrongResponse = "Wrong response is required.";
        if (!formData.slot) validationErrors.slot = "Slot is required.";
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            Swal.fire({
                title: "Incomplete Form",
                text: "Please fill all mandatory fields before submitting.",
                icon: "warning",
                confirmButtonText: "Okay",
            });
            return;
        }
        try {
            let response;
            if (uploadMethod === "form") {
                let options = [formData.option1, formData.option2, formData.option3, formData.option4];
                // Transforming formData to match backend schema
                const payload = {
                    question: formData.question,
                    options: [formData.option1, formData.option2, formData.option3, formData.option4],
                    correctOption: options[parseInt(formData.correctOption, 10)], // Store value instead of index
                    rightResponse: formData.rightResponse,
                    wrongResponse: formData.wrongResponse,
                    slot: formData.slot,
                };

                response = await axios.post(`${secretKey}/question_related_api/post_form_data`, payload);
            } else if (uploadMethod === "excel") {
                const excelData = new FormData();
                excelData.append("file", file);
                excelData.append("slot", formData.slot); // Append slot to the form data
                response = await axios.post(`${secretKey}/question_related_api/upload-excel`, excelData);
            }

            // Show success alert
            Swal.fire({
                title: "Success!",
                text: "Questions uploaded successfully!",
                icon: "success",
                confirmButtonText: "Great!",
            });
            handleDialogToggle();
            setErrors({});
            setFormData({
                question: "",
                option1: "",
                option2: "",
                option3: "",
                option4: "",
                correctOption: "",
                rightResponse: "",
                wrongResponse: "",
                slot: "",
            })
        } catch (error) {
            console.error("Error:", error);
            Swal.fire({
                title: "Error",
                text: error.response.data.message || "Error uploading question. Please try again.",
                icon: "error",
                confirmButtonText: "Retry",
            });
        }
    };

    const handleSubmitExcel = async () => {
        if (!file || !formData.slot) {
            Swal.fire({
                title: "Incomplete Form",
                text: "Please upload a file and select a slot.",
                icon: "warning",
                confirmButtonText: "Okay",
            });
            return;
        }

        try {
            const formDataExcel = new FormData();
            formDataExcel.append("file", file);
            formDataExcel.append("slot", formData.slot);

            const response = await axios.post(
                `${secretKey}/question_related_api/upload-questions_excel`,
                formDataExcel,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            Swal.fire({
                title: "Success!",
                text: `${response.data.totalUploaded} questions uploaded successfully. Skipped ${response.data.skippedInvalid} invalid and ${response.data.skippedDuplicates} duplicate entries.`,
                icon: "success",
                confirmButtonText: "Great!",
            });

            handleDialogToggle();
            setFile(null); // Clear the file
            setFormData((prev) => ({ ...prev, slot: "" })); // Reset the slot
        } catch (error) {
            console.error("Error uploading Excel:", error);
            Swal.fire({
                title: "Error",
                text: error.response?.data?.message || "Error uploading Excel. Please try again.",
                icon: "error",
                confirmButtonText: "Retry",
            });
        }
    };

// Handle Submit for QuestionUploadDialog
const handleUpdateQuestion = async () => {
    const payload = {
        questionId:selectedQuestionData._id,
        question: formData.question,
        options: [formData.option1, formData.option2, formData.option3, formData.option4],
        correctOption: [formData.option1, formData.option2, formData.option3, formData.option4][parseInt(formData.correctOption, 10)],
        rightResponse: formData.rightResponse,
        wrongResponse: formData.wrongResponse,
        slot: formData.slot,
    };
    console.log("payload" , payload)
    try {
        const response = await axios.put(`${secretKey}/question_related_api/update-question`, payload);
        Swal.fire("Updated!", "The question has been updated successfully.", "success");
        handleDialogToggle();
        fetchingData();
    } catch (error) {
        console.error("Error updating question", error);
        Swal.fire("Error!", "Failed to update the question.", "error");
    }
};

// Populate form data in edit mode
useEffect(() => {
    if (editMode && selectedQuestionData) {
        const { question, options, correctOption, responses, slotIndex } = selectedQuestionData;
        setFormData({
            question,
            option1: options[0],
            option2: options[1],
            option3: options[2],
            option4: options[3],
            correctOption: options.indexOf(correctOption).toString(),
            rightResponse: responses?.right || "",
            wrongResponse: responses?.wrong || "",
            slot: slotIndex || "",
        });
    } else {
        setFormData({
            question: "",
            option1: "",
            option2: "",
            option3: "",
            option4: "",
            correctOption: "",
            rightResponse: "",
            wrongResponse: "",
            slot: "",
        });
    }
}, [editMode, selectedQuestionData]);

    return (
        <Dialog
            className="My_Mat_Dialog"
            open={dialogOpen}
            onClose={handleDialogToggle}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                style: {
                    display: "flex",
                    flexDirection: "column",
                    height: "auto",
                },
            }}
        >
            <DialogTitle>
                <div className="d-flex align-items-center justify-content-between">
                    <div>{editMode ? "Edit Question" :  "Upload Questions"}</div>
                    <div>
                        <button type="button"
                            className="btn-close new_question_dailog_button"
                            aria-label="Close"
                            onClick={handleDialogToggle}
                        >
                        </button>
                    </div>
                </div>
            </DialogTitle>
            <hr style={{ border: "1px solid #ddd", margin: "0" }} />
            <DialogContent>
                <Grid container spacing={2}>
                    <div
                        className="modal-header"
                        style={{
                            display: "flex",
                            justifyContent: "space-between", // Space between left and right components
                            alignItems: "center",
                            width: "100%", // Ensure full width
                            padding: "0 0.2rem 0 1rem"
                        }}
                    >
                        {/* Left Side: Form and Excel */}
                        {!editMode && <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input rounded-circle"
                                    type="radio"
                                    name="employeeOption"
                                    id="addSingleEmployee"
                                    value="form"
                                    checked={uploadMethod === "form"} // Bind checked property
                                    onChange={(e) => setUploadMethod(e.target.value)}
                                />
                                <label className="form-check-label" htmlFor="addSingleEmployee">
                                    Form
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input rounded-circle"
                                    type="radio"
                                    name="employeeOption"
                                    id="bulkUpload"
                                    value="excel"
                                    checked={uploadMethod === "excel"} // Bind checked property
                                    onChange={(e) => setUploadMethod(e.target.value)}
                                />
                                <label className="form-check-label" htmlFor="bulkUpload">
                                    Excel
                                </label>
                            </div>
                        </div>}

                        {/* Right Side: Slot Selection */}
                        <div style={{ width: "200px" }}>
                            <select
                                className="form-select"
                                name="slot"
                                value={formData.slot}
                                required
                                onChange={handleFormChange}
                                disabled={editMode}
                            >
                                <option value="" disabled>
                                    Select Slot
                                </option>
                                {slotOptions.map((slot, index) => (
                                    <option key={index} value={slot.label} disabled={slot.disabled}>
                                        {slot.label}
                                    </option>
                                ))}
                            </select>
                            {errors.slot && <Typography color="error">{errors.slot}</Typography>}
                        </div>
                    </div>
                    {uploadMethod === "form" && (
                        <>
                            <Grid item xs={12}>
                                <TextField
                                    label="Add Question"
                                    name="question"
                                    value={formData.question}
                                    onChange={handleFormChange}
                                    fullWidth
                                    size="small"
                                    error={!!errors.question}
                                    helperText={errors.question}
                                />
                            </Grid>
                            {[1, 2, 3, 4].map((num) => (
                                <Grid item xs={6} key={num}>
                                    <TextField
                                        label={`Option ${num}`}
                                        name={`option${num}`}
                                        value={formData[`option${num}`]}
                                        onChange={handleFormChange}
                                        fullWidth
                                        size="small"
                                        error={!!errors[`option${num}`]}
                                        helperText={errors[`option${num}`]}
                                    />
                                </Grid>
                            ))}
                            <Grid item xs={12}>
                                <Typography color="#6c6a6a">Mark Correct Option :-</Typography>
                                <RadioGroup
                                    sx={{ color: "#6c6a6a" }} // Color for the entire group
                                    row
                                    value={formData.correctOption}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, correctOption: e.target.value }))
                                    }
                                >
                                    {[0, 1, 2, 3].map((index) => (
                                        <FormControlLabel
                                           
                                            key={index}
                                            value={`${index}`}
                                            control={<Radio />}
                                            label={`Option ${index + 1}`}
                                        />
                                    ))}
                                </RadioGroup>
                                {errors.correctOption && (
                                    <Typography color="error">{errors.correctOption}</Typography>
                                )}
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Right Response"
                                    name="rightResponse"
                                    value={formData.rightResponse}
                                    onChange={handleFormChange}
                                    fullWidth
                                    size="small"
                                    error={!!errors.rightResponse}
                                    helperText={errors.rightResponse}
                                    multiline // Enable textarea
                                    rows={3} // Number of rows for the textarea
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Wrong Response"
                                    name="wrongResponse"
                                    value={formData.wrongResponse}
                                    onChange={handleFormChange}
                                    fullWidth
                                    size="small"
                                    error={!!errors.wrongResponse}
                                    helperText={errors.wrongResponse}
                                    multiline // Enable textarea
                                    rows={3} // Number of rows for the textarea
                                    variant="outlined"
                                />
                            </Grid>
                        </>
                    )}
                    {uploadMethod === "excel" && (
                        <Grid item xs={12}>
                            <div
                                className={`drag-file-area ${isDragging ? "dragging" : ""}`}
                                onDragOver={handleDragOver}
                                onDragEnter={handleDragEnter}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <div className="upload-icon">
                                    <MdOutlineFileUpload />
                                </div>
                                <h3 className="dynamic-message">Drag & drop any file here</h3>
                                <label className="browse-files-text">
                                    Browse Files Here
                                    <input
                                        type="file"
                                        className="default-file-input"
                                        onChange={handleFileChange}
                                    />
                                </label>
                            </div>
                            {file && (
                                <div className="file-block">
                                    <div className="file-info">
                                        <span className="material-icons-outlined file-icon">
                                            <SiGoogledocs />
                                        </span>
                                        <span className="file-name">{file.name}</span>
                                    </div>
                                    <span
                                        className="material-icons remove-file-icon"
                                        onClick={handleRemoveFile}
                                    >
                                        <MdDelete />
                                    </span>
                                </div>
                            )}
                            <a
                                className="hr_bulk_upload_a"
                                href={`${process.env.PUBLIC_URL}/QuestionUploadFormat.xlsx`}
                                download={"QuestionUploadFormat.xlsx"}
                            >
                                <div className="hr_bulk_upload">
                                    <div style={{ marginRight: "5px" }}>
                                        <AiOutlineDownload />
                                    </div>
                                    <div>Download Sample</div>
                                </div>
                            </a>
                        </Grid>
                    )}
                </Grid>
            </DialogContent>
            <DialogActions className="d-flex w-100 m-0 mt-1">
                <Button
                    style={{ border: "none", borderRadius: "0px" }}
                    className="btn btn-danger w-50 m-0"
                    color="error"
                    variant="contained"
                    onClick={handleDialogToggle}
                >
                    Cancel
                </Button>
                {uploadMethod === "form" ?
                    (
                        <Button
                            style={{ border: "none", borderRadius: "0px" }}
                            className="btn btn-primary w-50 m-0"
                            color="primary"
                            variant="contained"
                            onClick={editMode ? handleUpdateQuestion : handleSubmit}
                        >
                            {editMode ? "Update" : "Submit"}
                        </Button>
                    ) :
                    (
                        <Button
                            style={{ border: "none", borderRadius: "0px" }}
                            className="btn btn-primary w-50 m-0"
                            color="primary"
                            variant="contained"
                            onClick={handleSubmitExcel}
                        >Upload</Button>
                    )}
            </DialogActions>
        </Dialog>
    );
}

export default QuestionUploadDialog;
