import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Dialog, DialogContent, DialogTitle, IconButton, DialogActions } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";

const DscExpanceReimbursement = ({
    companyName,
    serviceName,
    expanseReimbursement,
    refreshData,
    mainStatus,
    subStatus,
    dscExpenseStatus,
    expenseDate }) => {

    const [status, setStatus] = useState(dscExpenseStatus);
    const [statusClass, setStatusClass] = useState('created-status');
    const [expenseDateNew, setExpenseDateNew] = useState(expenseDate ? new Date(expenseDate).toISOString().substring(0, 10) : ""); // Format date for input
    const [openDatePopup, setOpenDatePopup] = useState(false)

    const secretKey = process.env.REACT_APP_SECRET_KEY;

    const handleStatusChange = async (newStatus, statusClass) => {
        setStatus(newStatus);
        setStatusClass(`${statusClass}-status`);

        try {
            const response = await axios.post(`${secretKey}/rm-services/post-save-reimbursemnt-adminexecutive`, {
                companyName,
                serviceName,
                expenseReimbursementStatus: newStatus
            });
            if (newStatus === "Paid") {
                setOpenDatePopup(true)
            }
            refreshData();
            console.log("Status updated successfully:", response.data);
        } catch (error) {
            console.error("Error updating status:", error.message);
        }
    };

    const handleSubmitExpenseDate = async (cname, sname, value) => {
        const selectedDate = new Date(value); // The date selected by the user
        const currentTime = new Date(); // Current time

        // Combine the selected date with the current time
        selectedDate.setHours(currentTime.getHours());
        selectedDate.setMinutes(currentTime.getMinutes());
        selectedDate.setSeconds(currentTime.getSeconds());
        selectedDate.setMilliseconds(currentTime.getMilliseconds());

        const fullDateTime = selectedDate.toISOString(); // Full date-time string
        console.log("expensedate", fullDateTime);

        try {
            const response = await axios.post(`${secretKey}/rm-services/post-save-reimbursemntdate-adminexecutive`, {
                cname,
                sname,
                value: fullDateTime
            });
            if (response.status === 200) {
                setOpenDatePopup(false)
                refreshData();
            }
        } catch (error) {
            console.error("Error saving expense date:", error.message);
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "Unpaid":
                return "untouched_status";
            case "Paid":
                return "cdbp-status";
            default:
                return "";
        }
    };

    useEffect(() => {
        setStatusClass(getStatusClass(dscExpenseStatus));
    }, [dscExpenseStatus]);

    
    const handleCloseDatePopup = async() => {
        console.log("expanseDate" , expenseDateNew)
        if(!expenseDateNew){
            try {
                const response = await axios.post(`${secretKey}/rm-services/post-save-reimbursemnt-adminexecutive`, {
                    companyName,
                    serviceName,
                    expenseReimbursementStatus: "Unpaid"
                });
                setStatus("Unpaid")
                refreshData();
                console.log("Status updated successfully:", response.data);
            } catch (error) {
                console.error("Error updating status:", error.message);
            }
        }
        setOpenDatePopup(false)
    }

    const stringDateFormat=(dateString)=>{
        if(!dateString){
            return ""
        }
        const date = new Date(dateString)

         // Check for invalid dates
    if (isNaN(date.getTime())) return "";
     return date.toLocaleDateString("en-US" , {
        year : "numeric",
        month : "long",
        day : "numeric"
     })

    }


    return (
        <section className="rm_status_dropdown d-flex align-items-center justify-content-around">


            {expenseDate ?
                (<div>
                    Paid On {stringDateFormat(expenseDateNew)}
                </div>)
                : (
                    <select
                        className={`form-select sec-indu-select ${status === "" ? "sec-indu-select-white" : "sec-indu-select-gray"}`}
                        //className={`form-select sec-indu-select ${status === "" ? "sec-indu-select-white" : "sec-indu-select-gray"}`}
                        aria-labelledby="dropdownMenuButton1"
                        onChange={(e) => handleStatusChange(e.target.value)}
                        value={!status ? "Unpaid" : status}
                    >
                        {/* <option value="" disabled>Select Expense Status</option> */}
                        <option value="Paid">Paid</option>
                        <option value="Unpaid">Unpaid</option>
                    </select>
                )}
            <Dialog
                className='My_Mat_Dialog'
                open={openDatePopup}
                onClose={handleCloseDatePopup}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>
                    <h3 className='m-0'>{companyName}</h3>
                </DialogTitle>
                <DialogContent>
                    <div className="card-footer">
                        <div className="remarks-input">
                            <input
                                style={{ width: "100%",borderRadius: "6px",padding:"3px 5px 4px 5px" }}
                                value={expenseDateNew}
                                type='date'
                                disabled={dscExpenseStatus !== "Paid"}
                                onChange={(e) => {
                                    setExpenseDateNew(e.target.value);
                                }}
                            />
                        </div>
                    </div>
                </DialogContent>
                <DialogActions className='p-0'>
                    <Button onClick={handleCloseDatePopup}
                        variant="contained"
                        color="error"
                        style={{ width: "100%", borderRadius: "0px" }} className='m-0'>Close</Button>

                    <Button
                        onClick={() => {
                            handleSubmitExpenseDate(companyName, serviceName, expenseDateNew);
                        }}
                        variant="contained"
                        color="primary"
                        style={{ width: "100%", borderRadius: "0px" }}
                        className='m-0'
                    >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </section>
    );
};

export default DscExpanceReimbursement;
