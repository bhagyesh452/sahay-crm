import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    FormControlLabel,
    Typography,
    Grid,
    Radio,
    RadioGroup,
} from "@mui/material";
import Swal from "sweetalert2";
import axios from "axios";

function SlotSelectionDialog({ open, onClose, completeData, onSelectSlot ,availableSlots , selectedSlotId , setSelectedSlotId}) {
    // const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(""); // Single slot selection
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const secretKey = process.env.REACT_APP_SECRET_KEY;

    // useEffect(() => {
    //     filterAvailableSlots();
    // }, [completeData]);

    // Filter slots based on the availability logic
    // const filterAvailableSlots = () => {
    //     const slots = completeData.map((slot) => {
    //         return {
    //             label: slot.slotIndex.toUpperCase(),
    //             value: slot._id,
    //             questions: slot.questions || [], // Attach questions for each slot
    //             isAvailable: slot.slotIndex.toUpperCase(), // Slot must have at least 10 questions
    //         };
    //     });
    //     setAvailableSlots(slots.filter((slot) => slot.isAvailable));
    // };

    // Handle slot selection
    // const handleSlotSelection = (slotId) => {
    //     setSelectedSlot(slotId); // Update the selected slot

    //     // Update selected questions based on the selected slot
    //     const updatedQuestions = completeData
    //         .filter((slot) => slot._id === slotId)
    //         .flatMap((slot) => slot.questions);
    //     setSelectedQuestions(updatedQuestions);
    // };

    // Submit the selected slot
    const handleSubmit = () => {
        if (!selectedSlot) {
            Swal.fire({
                title: "No Slot Selected",
                text: "Please select a slot to proceed.",
                icon: "warning",
                confirmButtonText: "Okay",
            });
            return;
        }
        onSelectSlot(selectedSlot); // Pass the selected slot to the parent
        onClose(); // Close the dialog
        Swal.fire({
            title: "Slot Selected",
            text: "Slot has been successfully selected and activated.",
            icon: "success",
            confirmButtonText: "Okay",
        });
    };
     const pushQuestions = async (slotId) => {
            try {
                const response = await axios.post(`${secretKey}/question_related_api/push-questions`, { slotId });
                Swal.fire({
                    title: "Success!",
                    text: response.data.message,
                    icon: "success",
                    confirmButtonText: "Okay",
                });
                onClose();
                setSelectedSlotId(null);
            } catch (error) {
                console.error("Error pushing questions:", error);
                Swal.fire({
                    title: "Error",
                    text: error.response?.data?.message || "Could not push questions.",
                    icon: "error",
                    confirmButtonText: "Retry",
                });
            }
        };

    return (
        <Dialog className="My_Mat_Dialog" open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Select Slot</DialogTitle>
            <DialogContent>
                <FormControl component="fieldset" fullWidth>
                    <RadioGroup
                        value={selectedSlotId} // Controlled value
                        onChange={(event) => onSelectSlot(event.target.value)}
                        row
                    >
                        {availableSlots.map((slot) => (
                            <FormControlLabel
                                key={slot.id}
                                value={slot.id}
                                control={<Radio color="primary" />}
                                label={slot.label}
                            />
                        ))}
                    </RadioGroup>
                </FormControl>
                {selectedQuestions.length > 0 && (
                    <div style={{ marginTop: "20px" }}>
                        {/* <Typography variant="h6">Questions in Selected Slot:</Typography> */}
                        <Grid container spacing={2}>
                            {selectedQuestions.map((question, index) => (
                                <Grid item xs={12} key={index} style={{ padding: "5px", borderBottom: "1px solid #ddd" }}>
                                    <Typography variant="subtitle2">{index + 1}. {question.question}</Typography>
                                </Grid>
                            ))}
                        </Grid>
                    </div>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary" variant="outlined">
                    Cancel
                </Button>
                <Button onClick={()=> pushQuestions(selectedSlotId)} color="primary" variant="contained">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default SlotSelectionDialog;
