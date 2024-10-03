import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from "sweetalert2";

const RecruiterJoiningDate = ({
    empName,
    empEmail,
    joiningDate,
    refreshData
}) => {

    const [joiningDateNew, setJoiningDateNew] = useState(joiningDate ? new Date(joiningDate).toISOString().substring(0, 10) : "Not Confirmed Yet");

    const secretKey = process.env.REACT_APP_SECRET_KEY;

    const handleSubmitJoiningDate = async (cname, sname, value) => {
        const selectedDate = new Date(value);
        const currentTime = new Date();

        // Combine the selected date with the current time
        selectedDate.setHours(currentTime.getHours());
        selectedDate.setMinutes(currentTime.getMinutes());
        selectedDate.setSeconds(currentTime.getSeconds());
        selectedDate.setMilliseconds(currentTime.getMilliseconds());

        const fullDateTime = selectedDate.toISOString();
        //console.log("joiningDate", fullDateTime);

        try {
            const response = await axios.post(`${secretKey}/recruiter/post-save-joiningDate-recruiter`, {
                empName: cname,
                empEmail: sname,
                value: fullDateTime
            });

            if (response.status === 200) {
                // Swal.fire({
                //     icon: 'success',
                //     title: 'Joining date saved successfully!',
                //     timer: 2000,
                // });
                refreshData();
            }
        } catch (error) {
            console.error("Error saving joining date:", error.message);
            Swal.fire({
                icon: 'error',
                title: 'Failed to save joining date.',
                text: error.message,
            });
        }
    };

    return (
        <section className="rm_status_dropdown d-flex align-items-center justify-content-around">
            <div className="card-footer">
                <div className="remarks-input">
                    <input
                        style={{ width: "100%", borderRadius: "6px", padding: "3px 5px 4px 5px" }}
                        value={joiningDateNew}
                        type='date'
                        onChange={(e) => {
                            setJoiningDateNew(e.target.value);
                            handleSubmitJoiningDate(empName, empEmail, e.target.value);
                        }}
                    />
                </div>
            </div>
        </section>
    );
};

export default RecruiterJoiningDate;
