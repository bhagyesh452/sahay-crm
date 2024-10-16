// EmployeeInfo.js
import React from 'react';

const EmployeeInfo = ({ employee, onClose }) => {
    return (
        <div className="employee-info">
            <button onClick={onClose}>Back</button>
            <h2>Employee Info</h2>
            <p>Name: {employee.name}</p>
            <p>Number: {employee.number}</p>
            <p>Email: {employee.email}</p>
            {/* Add more details as needed */}
        </div>
    );
};

export default EmployeeInfo;
