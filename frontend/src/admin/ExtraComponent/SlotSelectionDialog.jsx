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

    const handleEmployeeSelection = (employeeId) => {
        setSelectedEmployees((prev) => {
            if (prev.includes(employeeId)) {
                return prev.filter((id) => id !== employeeId);
            } else {
                return [...prev, employeeId];
            }
        });
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            // Select all employees
            setSelectedEmployees(availableSlots.map((employee) => employee.employeeId));
        } else {
            // Deselect all employees
            setSelectedEmployees([]);
        }
    };

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

    return (
        <Dialog className="My_Mat_Dialog" open={open} onClose={onClose} maxWidth="sm" fullWidth>
            {/* <DialogTitle>Assign Slots to Employees</DialogTitle> */}
            <DialogTitle>
                <div className="d-flex align-items-center justify-content-between">
                    <div className="new_question_dailog_title" style={{fontSize : "17px"}}>
                        Assign Slots to Employees
                    </div>
                    <div>
                        <button type="button"
                            className="btn-close new_question_dailog_button"
                            aria-label="Close"
                            onClick={onClose}
                        >

                        </button>
                    </div>
                </div>
            </DialogTitle>
            <hr style={{ border: "1px solid #ddd", margin: "0" }} />

            <DialogContent>
                {availableSlots.length === 0 ? (
                    <Typography>No employees found or slots unavailable.</Typography>
                ) : (
                    <div className='table table-responsive table-style-2 m-0'>
                        <table className="table">
                            <thead>
                                <tr className='tr-sticky'>
                                    <th>
                                        <input
                                            type="checkbox"
                                            checked={selectedEmployees.length === availableSlots.length}
                                            indeterminate={
                                                selectedEmployees.length > 0 &&
                                                selectedEmployees.length < availableSlots.length
                                            }
                                            onChange={handleSelectAll}
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
                                    console.log("employee", employee)
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
                                    )}
                                )}
                            </tbody>
                        </table>
                    </div>
                    // <TableContainer>
                    //     <Table>
                    //         <TableHead>
                    //             <TableRow>
                    //                 <TableCell>
                    //                     <FormControlLabel
                    //                         control={
                    //                             <Checkbox
                    //                                 checked={
                    //                                     selectedEmployees.length ===
                    //                                     availableSlots.length
                    //                                 }
                    //                                 indeterminate={
                    //                                     selectedEmployees.length > 0 &&
                    //                                     selectedEmployees.length <
                    //                                         availableSlots.length
                    //                                 }
                    //                                 onChange={handleSelectAll}
                    //                                 color="primary"
                    //                             />
                    //                         }
                    //                         // label="Select All"
                    //                     />
                    //                 </TableCell>
                    //                 <TableCell>Sr. No.</TableCell>
                    //                 <TableCell>Employee Name</TableCell>
                    //                 <TableCell>Available Slots</TableCell>
                    //             </TableRow>
                    //         </TableHead>
                    //         <TableBody>
                    //             {availableSlots.map((employeeData, index) => (
                    //                 <TableRow key={employeeData.employeeId}>
                    //                     <TableCell>
                    //                         <FormControlLabel
                    //                             control={
                    //                                 <Checkbox
                    //                                     checked={selectedEmployees.includes(
                    //                                         employeeData.employeeId
                    //                                     )}
                    //                                     onChange={() =>
                    //                                         handleEmployeeSelection(
                    //                                             employeeData.employeeId
                    //                                         )
                    //                                     }
                    //                                     color="primary"
                    //                                 />
                    //                             }
                    //                         />
                    //                     </TableCell>
                    //                     <TableCell>{index + 1}</TableCell>
                    //                     <TableCell>{employeeData.employeeName}</TableCell>
                    //                     <TableCell
                    //                         style={{
                    //                             width: "150px", // Set a fixed width
                    //                             textAlign: "center", // Center align the content
                    //                             padding: "8px", // Adjust padding as needed
                    //                         }}
                    //                     >
                    //                         <Select
                    //                             value={selectedSlots[employeeData.employeeId] || ""}
                    //                             onChange={(e) =>
                    //                                 handleSlotChange(
                    //                                     employeeData.employeeId,
                    //                                     e.target.value
                    //                                 )
                    //                             }
                    //                             size="small"
                    //                             fullWidth
                    //                             displayEmpty
                    //                             disabled={
                    //                                 !selectedEmployees.includes(
                    //                                     employeeData.employeeId
                    //                                 )
                    //                             }
                    //                         >
                    //                             <MenuItem value="" disabled>
                    //                                 Select Slot
                    //                             </MenuItem>
                    //                             {employeeData.availableSlots.map((slot) => (
                    //                                 <MenuItem
                    //                                     key={slot.slotId}
                    //                                     value={slot.slotId}
                    //                                     disabled={!slot.isAvailable}
                    //                                 >
                    //                                     {slot.slotIndex}
                    //                                 </MenuItem>
                    //                             ))}
                    //                         </Select>
                    //                     </TableCell>
                    //                 </TableRow>
                    //             ))}
                    //         </TableBody>
                    //     </Table>
                    // </TableContainer>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary" variant="outlined">
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
