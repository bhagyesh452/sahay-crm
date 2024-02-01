import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Header from "./Header";
import { useParams } from "react-router-dom";
import { IconBoxPadding, IconChevronLeft } from "@tabler/icons-react";
import { IconButton } from "@mui/material";
import { Link } from 'react-router-dom';
// import "./styles/table.css";

import DeleteIcon from "@mui/icons-material/Delete";

const secretKey = process.env.REACT_APP_SECRET_KEY;
function EmployeeParticular() {
  const { id } = useParams();
  const [employeeData, setEmployeeData] = useState([]);
  const [employeeName, setEmployeeName] = useState('');

  // Function to fetch employee details by id
  const fetchEmployeeDetails = async () => {
    try {
      const response = await axios.get(`${secretKey}/einfo`);
      
      // Find the employee by id and set the name
      const selectedEmployee = response.data.find(
        (employee) => employee._id === id
      );

      if (selectedEmployee) {
        setEmployeeName(selectedEmployee.ename);
      } else {
        // Handle the case where no employee is found with the given id
        setEmployeeName('Employee not found');
      }
    } catch (error) {
      console.error('Error fetching employee details:', error.message);
    }
  };

  // Function to fetch new data based on employee name
  const fetchNewData = async () => {
    try {
      const response = await axios.get(`${secretKey}/api/employees/${employeeName}`);
      setEmployeeData(response.data);
    } catch (error) {
      console.error('Error fetching new data:', error);
    }
  };

  useEffect(() => {
    // Fetch employee details and related data when the component mounts or id changes
    fetchEmployeeDetails();
  });
useEffect(()=>{
  if(employeeName){
    console.log("Employee found");
    fetchNewData();
  }else{
    console.log("No employees found");
  }

},[employeeName])
  

console.log(employeeData);

  // useEffect(() => {
  //   // Fetch new data based on employee name when the name changes
  //   if (employeeName !== 'Employee not found') {
  //     fetchNewData();
  //   }
  // }, [employeeName]);


  return (
    <div>
      <Header />
      <Navbar />
      <div className="page-wrapper">
        <div className="page-header d-print-none">
          <div className="container-xl">
            <div className="row g-2 align-items-center">
              
              <div  className="col d-flex">
                {/* <!-- Page pre-title --> */}
                <Link to={`/employees`}>
                    <IconButton>
                      <IconChevronLeft />
                    </IconButton>
                  </Link>
                
                <h2 className="page-title">Employee  {">" + employeeName}</h2>
              </div>

              {/* <!-- Page title actions --> */}
              <div className="col-auto ms-auto d-print-none">
                <div className="btn-list">
                  

                  <a
                    href="#"
                    className="btn btn-primary d-sm-none btn-icon"
                    data-bs-toggle="modal"
                    data-bs-target="#modal-report"
                    aria-label="Create new report"
                  >
                    {/* <!-- Download SVG icon from http://tabler-icons.io/i/plus --> */}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div onCopy={(e)=>{
          e.preventDefault();
        }} className="page-body">
        <div className="container-xl">
          <div className="card">
            <div className="card-body p-0">
              <div id="table-default" className="table-responsive">
                <table className="table table-vcenter table-nowrap">
                  <thead>
                    <tr>
                      
                      <th>
                        <button className="table-sort" data-sort="sort-name pad">
                          Sr.No
                        </button>
                      </th>
                      <th>
                        <button className="table-sort" data-sort="sort-city">
                          Company Name
                        </button>
                      </th>
                      <th>
                        <button className="table-sort" data-sort="sort-type">
                          Company Number
                        </button>
                      </th>
                      <th>
                        <button className="table-sort" data-sort="sort-score">
                          Company Email
                        </button>
                      </th>
                      <th>
                        <button className="table-sort" data-sort="sort-date">
                          Company Incorporation Date
                        </button>
                      </th>
                      <th>
                        <button className="table-sort" data-sort="sort-date">
                          City
                        </button>
                      </th>
                      <th>
                        <button className="table-sort" data-sort="sort-date">
                          State
                        </button>
                      </th>
                      <th>
                        <button className="table-sort" data-sort="sort-date">
                          Status
                        </button>
                      </th>
                      <th>
                        <button  className="table-sort" data-sort="sort-date">
                          Remarks
                        </button>
                      </th>
                      
                    </tr>
                  </thead>
                  {employeeData.length == 0 ? (
                    <tbody>
                    <tr>
                      <td colSpan="10" style={{ textAlign: "center" }}>
                        No data available
                      </td>
                    </tr>
                  </tbody>
                  ) : (
                    employeeData.map((company, index) => (
                      <tbody>
                        <tr style={{padding:"10px"}}>
                          
                          <td className="sort-name pad">
                            {index+1}
                          </td>
                          <td className="sort-name pad">
                            {company["Company Name"]}
                          </td>
                          <td className="sort-name pad">
                            {company["Company Number"]}
                          </td>
                          <td className="sort-name pad">
                            {company["Company Email"]}
                          </td>
                          <td className="sort-name pad">
                            {company["Company Incorporation Date  "]}
                          </td>
                          <td className="sort-name pad">{company["City"]}</td>
                          <td className="sort-name pad">{company["State"]}</td>
                          <td className="sort-name pad">{company["Status"]}</td>
                          <td className="sort-name pad">{company["Remarks"]}</td>
                         
                        </tr>
                      </tbody>
                    ))
                  )}
                  <tbody className="table-tbody"></tbody>
                </table>
              </div>
              
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default EmployeeParticular;
