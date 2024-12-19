import React from 'react';
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

function EmployeeAnsweredQuestionDetailsDialog({
    employeeAnsDialog,
    setEmployeeAnsDialog,
    selectedQuestionFull,
    employeesAnswered,
    formatDatePro
}) {
  return (
    <div>
        <Dialog
                className="My_Mat_Dialog"
                open={employeeAnsDialog}
                onClose={() => setEmployeeAnsDialog(false)}
                maxWidth="sm" fullWidth
            >
                <DialogTitle>
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="new_question_dailog_title">
                            {selectedQuestionFull}
                        </div>
                        <div>
                            <button type="button"
                                className="btn-close new_question_dailog_button"
                                aria-label="Close"
                                onClick={() => setEmployeeAnsDialog(false)}
                            >

                            </button>
                        </div>
                    </div>
                </DialogTitle>
                <hr style={{ border: "1px solid #ddd", margin: "0" }} />
                <DialogContent>
                    {employeesAnswered.length > 0 ? (
                        <div className='table table-responsive table-style-2 m-0'>
                            <table className="table">
                                <thead>
                                    <tr className='tr-sticky'>
                                        <th>Employee Name</th>
                                        <th>Answer Given</th>
                                        <th>Is Correct</th>
                                        <th>Date Answered</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employeesAnswered.map((employee, index) => {
                                        console.log("employee", employee)
                                        return (
                                            <tr key={index}>
                                                <td>{employee.employeeName}</td>
                                                <td>{employee.answerGiven}</td>
                                                <td>{employee.isCorrect === true ? "Correct" : "Incorrect"}</td>
                                                <td>{formatDatePro(employee.dateAnswered)}</td>
                                            </tr>
                                        )

                                    }
                                    )}
                                </tbody>
                            </table>
                        </div>

                    ) : (
                        <Typography>No responses available for this question.</Typography>
                    )}
                </DialogContent>
            </Dialog>
    </div>
  )
}

export default EmployeeAnsweredQuestionDetailsDialog