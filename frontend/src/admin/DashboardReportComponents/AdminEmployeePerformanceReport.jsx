import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminEmployeePerformanceReport() {

  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const [empPerformanceData, setEmpPerformanceData] = useState([]);

  // Function to fetch employee performance data
  const fetchEmployeePerformance = async () => {
    try {
      const response = await axios.get(`${secretKey}/employee/einfo`);
      console.log("Employee performance data is :", response.data);
      setEmpPerformanceData(response.data);
    } catch (error) {
      console.error('Error fetching employee performance:', error);
    }
  };

  // useEffect to fetch data on component mount
  useEffect(() => {
    fetchEmployeePerformance();
  }, []);

  const [expandedEmployees, setExpandedEmployees] = useState([]);

  const toggleEmployeeDetails = (employeeId) => {
    if (expandedEmployees.includes(employeeId)) {
      setExpandedEmployees(expandedEmployees.filter(id => id !== employeeId)); // Collapse if already expanded
    } else {
      setExpandedEmployees([...expandedEmployees, employeeId]); // Expand if not expanded
    }
  };

  let targetAmount;
  let achievedAmount;

  return (
    <div className="dash-card">
      <div className="dash-card-head d-flex align-items-center justify-content-between">
        <h2 className="m-0">Performance Report</h2>
      </div>
      <div className="dash-card-body">
        <div className="table table-responsive dash m-0" style={{ maxHeight: '400px' }}>
          <table className="table table-vcenter top_5_table table-nowrap dash-strip">
            <thead>
              <tr className="tr-sticky">
                <th>Name</th>
                <th>Month</th>
                <th id='my-center'>Target</th>
                <th>Achievement</th>
                <th>Ratio</th>
                <th style={{ borderRadius: '0 7px 0 0' }}>Result</th>
              </tr>
            </thead>
            <tbody>
              {empPerformanceData.length > 0 ? (
                empPerformanceData.map((employee) => (
                  <React.Fragment key={employee._id}>
                    <tr onClick={() => toggleEmployeeDetails(employee._id)} style={{ cursor: 'pointer' }}>
                      <td>{employee.ename}</td>

                      <td>{employee.targetDetails.length}</td>
                      
                      <td id='my-center'>₹ {new Intl.NumberFormat('en-IN').format(
                        employee.targetDetails.reduce((total, obj) => total + parseFloat(obj.amount || 0), 0)
                      )}</td>
                      
                      <td id='my-center'>₹ {new Intl.NumberFormat('en-IN').format(
                        employee.targetDetails.reduce((achieved, obj) => achieved + parseFloat(obj.achievedAmount || 0), 0)
                      )}</td>
                      
                      <td>{(() => {
                        const totalTarget = employee.targetDetails.reduce((total, obj) => total + parseFloat(obj.amount || 0), 0);
                        const totalAchieved = employee.targetDetails.reduce((achieved, obj) => achieved + parseFloat(obj.achievedAmount || 0), 0);
                        const ratio = totalTarget > 0 ? (totalAchieved / totalTarget) * 100 : 0;
                        return `${ratio.toFixed(2)}%`; // Format the ratio to two decimal places with a percentage symbol
                      })()}</td>
                      
                      <td>{(() => {
                        const totalTarget = employee.targetDetails.reduce((total, obj) => total + parseFloat(obj.amount || 0), 0);
                        const totalAchieved = employee.targetDetails.reduce((achieved, obj) => achieved + parseFloat(obj.achievedAmount || 0), 0);
                        const ratio = totalTarget > 0 ? (totalAchieved / totalTarget) * 100 : 0;

                        if (ratio >= 250) return "Exceptional";
                        if (ratio >= 200) return "Outstanding";
                        if (ratio >= 150) return "Extraordinary";
                        if (ratio >= 100) return "Excellent";
                        if (ratio >= 75) return "Good";
                        if (ratio >= 60) return "Average";
                        if (ratio >= 40) return "Below Average";
                        return "Poor";
                      })()}</td>
                    </tr>
                    
                    {expandedEmployees.includes(employee._id) && (
                      employee.targetDetails.map((perData, index) => (
                        <tr key={`${employee._id}-${index}`}>
                          <td></td>
                          <td>{perData.year}-{perData.month}</td>
                          <td>{perData.amount || 0}</td>
                          <td>{perData.achievedAmount || 0}</td>
                          <td>{perData.ratio || 0}</td>
                          <td>{perData.result || '-'}</td>
                        </tr>
                      ))
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminEmployeePerformanceReport