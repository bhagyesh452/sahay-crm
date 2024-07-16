import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Nodata from '../../components/Nodata';

function AdminEmployeePerformanceReport() {
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const [empPerformanceData, setEmpPerformanceData] = useState([]);

  const fetchEmployeePerformance = async () => {
    try {
      const response = await axios.get(`${secretKey}/employee/einfo`);
      console.log("Employee performance data is:", response.data);
      setEmpPerformanceData(response.data);
    } catch (error) {
      console.error('Error fetching employee performance:', error);
    }
  };

  useEffect(() => {
    fetchEmployeePerformance();
  }, []);

  const [expandedEmployee, setExpandedEmployee] = useState(null);

  const toggleEmployeeDetails = (employeeId) => {
    setExpandedEmployee(expandedEmployee === employeeId ? null : employeeId);
  };

  const getCurrentMonth = () => {
    const date = new Date();
    return date.toLocaleString('default', { month: 'long' });
  };

  const getCurrentYear = () => {
    const date = new Date();
    return date.getFullYear();
  };

  const currentMonth = getCurrentMonth();
  const currentYear = getCurrentYear();

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
                <th id='my-center'>Month</th>
                <th id='my-center'>Target</th>
                <th>Achievement</th>
                <th>Ratio</th>
                <th style={{ borderRadius: '0 7px 0 0' }}>Result</th>
              </tr>
            </thead>
            <tbody>
              {empPerformanceData.length > 0 ? (
                empPerformanceData.map((employee) => {
                  const filteredTargetDetails = employee.targetDetails.filter((perData) => {
                    const monthYear = new Date(perData.year, new Date(Date.parse(perData.month + " 1, 2020")).getMonth(), 1);
                    const currentMonthYear = new Date(currentYear, new Date(Date.parse(currentMonth + " 1, 2020")).getMonth(), 1);
                    return monthYear < currentMonthYear;
                  });

                  if (filteredTargetDetails.length === 0) return null;

                  return (
                    <React.Fragment key={employee._id}>
                      <tr onClick={() => toggleEmployeeDetails(employee._id)} style={{ cursor: 'pointer' }}>
                        <td>{employee.ename}</td>
                        
                        <td id='my-center'>{filteredTargetDetails.length}</td>
                        
                        <td id='my-center'>₹ {new Intl.NumberFormat('en-IN').format(
                          filteredTargetDetails.reduce((total, obj) => total + parseFloat(obj.amount || 0), 0)
                        )}</td>
                        
                        <td id='my-center'>₹ {new Intl.NumberFormat('en-IN').format(
                          filteredTargetDetails.reduce((achieved, obj) => achieved + parseFloat(obj.achievedAmount || 0), 0)
                        )}</td>
                        
                        <td>{(() => {
                          const totalTarget = filteredTargetDetails.reduce((total, obj) => total + parseFloat(obj.amount || 0), 0);
                          const totalAchieved = filteredTargetDetails.reduce((achieved, obj) => achieved + parseFloat(obj.achievedAmount || 0), 0);
                          const ratio = totalTarget > 0 ? (totalAchieved / totalTarget) * 100 : 0;
                          return `${ratio.toFixed(2)}%`;
                        })()}</td>
                        
                        <td>{(() => {
                          const totalTarget = filteredTargetDetails.reduce((total, obj) => total + parseFloat(obj.amount || 0), 0);
                          const totalAchieved = filteredTargetDetails.reduce((achieved, obj) => achieved + parseFloat(obj.achievedAmount || 0), 0);
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
                      
                      {expandedEmployee === employee._id && (
                        filteredTargetDetails.map((perData, index) => (
                          <tr key={`${employee._id}-${index}`}>
                            <th></th>
                            <th id='my-center'>{perData.month}-{perData.year}</th>
                            <th>₹ {perData.amount || 0}</th>
                            <th>₹ {perData.achievedAmount || 0}</th>
                            <th>{perData.ratio.toFixed(2) || 0}%</th>
                            <th>{perData.result || '-'}</th>
                          </tr>
                        ))
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="text-center"><Nodata /></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminEmployeePerformanceReport;