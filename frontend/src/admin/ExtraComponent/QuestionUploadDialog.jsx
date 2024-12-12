import React, { useState ,useEffect} from "react";
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

function QuestionUploadDialog({ dialogOpen, handleDialogToggle, completeData }) {
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const [uploadMethod, setUploadMethod] = useState("form");
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
            // Get the highest slot index
            const latestSlotIndex = Math.max(...completeData.map((slot) => slot.slotIndex));
            setSlotOptions([`slot ${latestSlotIndex}`, `slot ${latestSlotIndex + 1}`]);
        } else {
            // Default slots
            setSlotOptions(["slot 1", "slot 2"]);
        }
    }, [completeData]);
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
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

    const handleSubmit = async () => {
        try {
            if (
                !formData.slot || // Slot is mandatory
                !formData.question || // Question is mandatory
                !formData.option1 || // Option 1 is mandatory
                !formData.option2 || // Option 2 is mandatory
                !formData.option3 || // Option 3 is mandatory
                !formData.option4 || // Option 4 is mandatory
                formData.correctOption === "" // Correct option is mandatory
            ) {
                Swal.fire("Please fill all mandatory fields before submitting.");
                return;
            }

            if (uploadMethod === "form") {
                // Transforming formData to match backend schema
                const payload = {
                    question: formData.question,
                    options: [formData.option1, formData.option2, formData.option3, formData.option4],
                    correctOption: parseInt(formData.correctOption, 10), // Ensure correctOption is a number
                    rightResponse: formData.rightResponse,
                    wrongResponse: formData.wrongResponse,
                    slot: formData.slot,
                };

                await axios.post(`${secretKey}/question_related_api/post_form_data`, payload);
            } else if (uploadMethod === "excel") {
                const excelData = new FormData();
                excelData.append("file", file);
                excelData.append("slot", formData.slot); // Append slot to the form data
                await axios.post(`${secretKey}/question_related_api/upload-excel`, excelData);
            }

            alert("Questions uploaded successfully!");
            handleDialogToggle();
        } catch (error) {
            console.error("Error:", error);
            alert("Error uploading questions");
        }
    };


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
                <div className="d-flex justify-content-between align-items-center">
                    <div>Upload Questions</div>
                    <div>
                        <button
                            onClick={handleDialogToggle}
                            className="btn btn-link"
                            style={{ fontSize: "20px", padding: "0" }}
                        >
                            <IoClose />
                        </button>
                    </div>
                </div>
            </DialogTitle>
            <DialogContent style={{ flex: "1 1 auto", overflowY: "auto" }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={6}>
                        <RadioGroup
                            row
                            value={uploadMethod}
                            onChange={(e) => setUploadMethod(e.target.value)}
                        >
                            <FormControlLabel
                                value="form"
                                control={<Radio />}
                                label="Form"
                            />
                            <FormControlLabel
                                value="excel"
                                control={<Radio />}
                                label="Excel"
                            />
                        </RadioGroup>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth size="small">
                            {/* <InputLabel>Select Slot</InputLabel> */}
                            <Select
                                name="slot"
                                value={formData.slot}
                                onChange={handleFormChange}
                                required
                            >
                                {slotOptions.map((slot, index) => (
                                    <MenuItem key={index} value={slot}>
                                        {slot}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {uploadMethod === "form" && (
                        <>
                            <Grid item xs={12}>
                                <TextField
                                    label="Question"
                                    name="question"
                                    value={formData.question}
                                    onChange={handleFormChange}
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Option 1"
                                    name="option1"
                                    value={formData.option1}
                                    onChange={handleFormChange}
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Option 2"
                                    name="option2"
                                    value={formData.option2}
                                    onChange={handleFormChange}
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Option 3"
                                    name="option3"
                                    value={formData.option3}
                                    onChange={handleFormChange}
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Option 4"
                                    name="option4"
                                    value={formData.option4}
                                    onChange={handleFormChange}
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography>Mark Correct Option</Typography>
                                <RadioGroup
                                    row
                                    value={formData.correctOption}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            correctOption: e.target.value,
                                        }))
                                    }
                                >
                                    <FormControlLabel
                                        value="0"
                                        control={<Radio />}
                                        label="Option 1"
                                    />
                                    <FormControlLabel
                                        value="1"
                                        control={<Radio />}
                                        label="Option 2"
                                    />
                                    <FormControlLabel
                                        value="2"
                                        control={<Radio />}
                                        label="Option 3"
                                    />
                                    <FormControlLabel
                                        value="3"
                                        control={<Radio />}
                                        label="Option 4"
                                    />
                                </RadioGroup>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Right Response"
                                    name="rightResponse"
                                    value={formData.rightResponse}
                                    onChange={handleFormChange}
                                    fullWidth
                                    multiline
                                    rows={3}
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Wrong Response"
                                    name="wrongResponse"
                                    value={formData.wrongResponse}
                                    onChange={handleFormChange}
                                    fullWidth
                                    multiline
                                    rows={3}
                                    size="small"
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
                                        <span className="file-name">
                                            {file.name}
                                        </span>
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
                                href={`${process.env.PUBLIC_URL}/AddNewEmployeeFormat.xlsx`}
                                download={"AddNewEmployeeFormat.xlsx"}
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
                <Button
                    style={{ border: "none", borderRadius: "0px" }}
                    className="btn btn-primary w-50 m-0"
                    color="primary"
                    variant="contained"
                    onClick={handleSubmit}
                >
                    Forward
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default QuestionUploadDialog;
