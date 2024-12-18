import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Select,
    MenuItem,
    Typography,
    Checkbox,
    FormControlLabel,
} from "@mui/material";
import Swal from "sweetalert2";
import axios from "axios";

function SlotSelectionDialog({ open, onClose, availableSlots, fetchAvailableSlots }) {
    const [selectedSlots, setSelectedSlots] = useState({}); // Tracks the selected slot for each employee
    const [selectedEmployees, setSelectedEmployees] = useState([]); // Tracks selected employees
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const [isSelectAllEnabled, setIsSelectAllEnabled] = useState(false); // Tracks the status of "Select All" checkbox


    const handleEmployeeSelection = (employeeId) => {
        setSelectedEmployees((prev) => {
            if (prev.includes(employeeId)) {
                return prev.filter((id) => id !== employeeId);
            } else {
                return [...prev, employeeId];
            }
        });
    };

    // const handleSelectAll = (e) => {
    //     if (e.target.checked) {
    //         // Select all employees
    //         setSelectedEmployees(availableSlots.map((employee) => employee.employeeId));
    //     } else {
    //         // Deselect all employees
    //         setSelectedEmployees([]);
    //     }
    // };

    const handleSlotChange = (employeeId, slotId) => {
        setSelectedSlots((prev) => ({
            ...prev,
            [employeeId]: slotId,
        }));
    };

    const handleSubmit = async () => {
        if (selectedEmployees.length === 0) {
            Swal.fire({
                title: "No Employee Selected",
                text: "Please select at least one employee to assign slots.",
                icon: "warning",
                confirmButtonText: "Okay",
            });
            return;
        }

        const unassignedEmployees = selectedEmployees.filter(
            (employeeId) => !selectedSlots[employeeId]
        );

        if (unassignedEmployees.length > 0) {
            Swal.fire({
                title: "Incomplete Slot Selection",
                text: "Please select a slot for all selected employees.",
                icon: "error",
                confirmButtonText: "Retry",
            });
            return;
        }

        try {
            const assignedSlots = {};
            selectedEmployees.forEach((employeeId) => {
                assignedSlots[employeeId] = selectedSlots[employeeId];
            });

            const response = await axios.post(
                `${secretKey}/question_related_api/push-questions`,
                { assignedSlots }
            );

            Swal.fire({
                title: "Success!",
                text: response.data.message,
                icon: "success",
                confirmButtonText: "Okay",
            });
            setIsSelectAllEnabled(false)
            setSelectedSlots({});
            setSelectedEmployees([]);
            fetchAvailableSlots(); // Refresh available slots
            onClose(); // Close the dialog
        } catch (error) {
            console.error("Error submitting slot assignments:", error);
            Swal.fire({
                title: "Error",
                text: error.response?.data?.message || "Could not assign slots.",
                icon: "error",
                confirmButtonText: "Retry",
            });
        }
    };

    // ===================select All===========================
    const handleSelectAllNew = (e) => {
        const isChecked = e.target.checked;

        if (isChecked) {
            setIsSelectAllEnabled(true); // Enable Select All on click
            setSelectedEmployees(
                availableSlots
                    .filter((employee) => employee.availableSlots.some((slot) => slot.isAvailable))
                    .map((employee) => employee.employeeId)
            );

            // Pre-fill slots based on the first available slot for each employee
            setSelectedSlots((prev) => {
                const newSlots = {};
                availableSlots.forEach((employee) => {
                    const availableSlot = employee.availableSlots.find((slot) => slot.isAvailable);
                    if (availableSlot) {
                        newSlots[employee.employeeId] = availableSlot.slotId;
                    }
                });
                return newSlots;
            });
        } else {
            // Deselect all employees and clear slots
            setSelectedEmployees([]);
            setSelectedSlots({});
        }
    };

    const handleCommonSlotChange = (e) => {
        const selectedSlotId = e.target.value;

        setSelectedEmployees(
            availableSlots
                .filter((employee) =>
                    employee.availableSlots.some(
                        (slot) => slot.slotId === selectedSlotId && slot.isAvailable
                    )
                )
                .map((employee) => employee.employeeId)
        );
        // Update selected slots only for employees where the selected slot is available
        setSelectedSlots((prev) => {
            const newSlots = { ...prev };
            availableSlots.forEach((employee) => {
                const isSlotAvailable = employee.availableSlots.some(
                    (slot) => slot.slotId === selectedSlotId && slot.isAvailable
                );

                if (isSlotAvailable) {
                    newSlots[employee.employeeId] = selectedSlotId;
                }
            });
            return newSlots;
        });
    };



    return (
        <Dialog className="My_Mat_Dialog" open={open}
            onClose={() => {
                onClose()
                setSelectedSlots({});
                setSelectedEmployees([]);
                fetchAvailableSlots(); // Refresh available slots
                setIsSelectAllEnabled(false)
            }}
            maxWidth="sm"
            fullWidth>
            {/* <DialogTitle>Assign Slots to Employees</DialogTitle> */}
            <DialogTitle>
                <div className="d-flex align-items-center justify-content-between">
                    <div className="new_question_dailog_title" style={{ fontSize: "17px" }}>
                        Assign Slots to Employees
                    </div>
                    <div>
                        <button type="button"
                            className="btn-close new_question_dailog_button"
                            aria-label="Close"
                            onClick={() => {
                                onClose()
                                setSelectedSlots({});
                                setSelectedEmployees([]);
                                fetchAvailableSlots(); // Refresh available slots
                                setIsSelectAllEnabled(false)
                            }}
                        >
                        </button>
                    </div>
                </div>
            </DialogTitle>
            <hr style={{ border: "1px solid #ddd", margin: "0" }} />
            <div className="d-flex align-items-center justify-content-end mt-1"
                style={{
                    width: "100%",
                    padding: "10px 35px 0px 0px",
                }}>
                <select
                    onChange={handleCommonSlotChange}
                    disabled={!isSelectAllEnabled} // Disable by default
                    style={{
                        width: "25%",
                        padding: "6px",
                        fontSize: "12px",
                        cursor: isSelectAllEnabled ? "pointer" : "not-allowed"
                    }}
                >
                    <option value="">Select Common Slot</option>
                    {availableSlots.length > 0 &&
                        availableSlots[0].availableSlots.map((slot) => (
                            <option key={slot.slotId} value={slot.slotId}>
                                {slot.slotIndex}
                            </option>
                        ))}
                </select>

            </div>
            <DialogContent>
                {availableSlots.length === 0 ? (
                    <Typography>No employees found or slots unavailable.</Typography>
                ) : (
                    <div className='table table-responsive table-style-2'>
                        <table className="table">
                            <thead>
                                <tr className='tr-sticky'>
                                    <th>
                                        <input
                                            type="checkbox"
                                            checked={
                                                selectedEmployees.length > 0 &&
                                                selectedEmployees.length ===
                                                availableSlots.filter((employee) =>
                                                    employee.availableSlots.some((slot) => slot.isAvailable)
                                                ).length
                                            }
                                            indeterminate={
                                                selectedEmployees.length > 0 &&
                                                selectedEmployees.length <
                                                availableSlots.filter((employee) =>
                                                    employee.availableSlots.some((slot) => slot.isAvailable)
                                                ).length
                                            }
                                            onChange={handleSelectAllNew}
                                            style={{ cursor: "pointer" }}
                                        />
                                    </th>
                                    <th>Sr. No</th>
                                    <th>Employee Name</th>
                                    <th>Available Slots</th>
                                </tr>
                            </thead>
                            <tbody>
                                {availableSlots.map((employee, index) => {
                                    //console.log("employee", employee)
                                    return (
                                        <tr key={employee.employeeId}>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedEmployees.includes(employee.employeeId)}
                                                    onChange={() => handleEmployeeSelection(employee.employeeId)}
                                                    style={{ cursor: "pointer" }}
                                                />
                                            </td>
                                            <td>{index + 1}</td>
                                            <td>{employee.employeeName}</td>
                                            <td
                                                style={{
                                                    width: "150px",
                                                    textAlign: "center",
                                                    padding: "8px",
                                                }}
                                            >
                                                {/* Native HTML Select */}
                                                <select
                                                    value={selectedSlots[employee.employeeId] || ""}
                                                    onChange={(e) =>
                                                        handleSlotChange(employee.employeeId, e.target.value)
                                                    }
                                                    style={{
                                                        width: "100%",
                                                        padding: "6px",
                                                        fontSize: "14px",
                                                        cursor: selectedEmployees.includes(employee.employeeId)
                                                            ? "pointer"
                                                            : "not-allowed",
                                                        backgroundColor: selectedEmployees.includes(
                                                            employee.employeeId
                                                        )
                                                            ? "#fff"
                                                            : "#f0f0f0",
                                                    }}
                                                    disabled={
                                                        !selectedEmployees.includes(employee.employeeId)
                                                    }
                                                >
                                                    <option value="" disabled>
                                                        Select Slot
                                                    </option>
                                                    {employee.availableSlots.map((slot) => (
                                                        <option
                                                            key={slot.slotId}
                                                            value={slot.slotId}
                                                            disabled={!slot.isAvailable}
                                                        >
                                                            {slot.slotIndex}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                        </tr>
                                    )
                                }
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    onClose()
                    setSelectedSlots({});
                    setSelectedEmployees([]);
                    fetchAvailableSlots(); // Refresh available slots
                    setIsSelectAllEnabled(false)
                }} color="secondary" variant="outlined">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} color="primary" variant="contained">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default SlotSelectionDialog;
