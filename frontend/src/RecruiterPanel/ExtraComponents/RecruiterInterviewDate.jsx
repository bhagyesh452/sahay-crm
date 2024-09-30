import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Dialog, DialogContent, DialogTitle, IconButton, DialogActions } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";


const RecruiterInterviewDate = ({
    empName,
    empEmail,
    mainStatus,
    interViewDate,
    refreshData
}) => {

  
    const [interViewDateNew, setInterViewDateNew] = useState(interViewDate ? new Date(interViewDate).toISOString().substring(0, 10) : "Not Confirmed Yet"); // Format date for input
  

    const secretKey = process.env.REACT_APP_SECRET_KEY;

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
            const response = await axios.post(`${secretKey}/recruiter/post-save-interviewdate-recruiter`, {
                empName,
                empEmail,
                value: fullDateTime
            });
            if (response.status === 200) {
                
                refreshData();
            }
        } catch (error) {
            console.error("Error saving expense date:", error.message);
        }
    };


    return (
        <section className="rm_status_dropdown d-flex align-items-center justify-content-around">
            
                <div className="card-footer">
                    <div className="remarks-input">
                        <input
                            style={{ width: "100%", borderRadius: "6px", padding: "3px 5px 4px 5px" }}
                            value={interViewDateNew}
                            type='date'
                            onChange={(e) => {
                                setInterViewDateNew(e.target.value);
                                handleSubmitExpenseDate(empName , empEmail, e.target.value);
                            }}
                        />
                    </div>
                </div>
            
        </section>
    );
};

export default RecruiterInterviewDate;
