import React, { useState,useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

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


    return (
        <section className="rm_status_dropdown d-flex align-items-center justify-content-around">
            <div className={mainStatus === "Approved" ? "disabled" : `dropdown custom-dropdown status_dropdown ${statusClass}`}>
                <button
                    className="btn dropdown-toggle w-100 d-flex align-items-center justify-content-between status__btn"
                    type="button"
                    id="dropdownMenuButton1"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    {!status ? "Select Expense Status" : status}
                </button>
                <ul className="dropdown-menu status_change" aria-labelledby="dropdownMenuButton1">
                    <li>
                        <span className="dropdown-item disabled" style={{ cursor: 'not-allowed' }}>
                            Select Expense Status
                        </span>
                    </li>
                    <li>
                        <a className="dropdown-item"
                            onClick={() =>
                                handleStatusChange('Unpaid', 'untouched_status')} href="#"
                        >
                            Unpaid
                        </a>
                    </li>
                    <li>
                        <a className="dropdown-item"
                            onClick={() =>
                                handleStatusChange('Paid', 'cdbp-status')} href="#">
                            Paid
                        </a>
                    </li>
                </ul>
            </div>
            <div>
                <input
                    value={expenseDateNew}
                    type='date'
                    disabled={dscExpenseStatus !== "Paid"} 
                    onChange={(e) => {
                        setExpenseDateNew(e.target.value);
                        handleSubmitExpenseDate(companyName, serviceName, e.target.value);
                    }}
                />
            </div>
        </section>
    );
};

export default DscExpanceReimbursement;
