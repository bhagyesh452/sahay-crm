import React from "react";
import myImage from "../static/nodatalogo.png";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import Navbar from "../admin/Navbar";
import { IconButton } from "@mui/material";
import { IconChevronLeft } from "@tabler/icons-react";

function LoginDetails() {
  const [loginDetails, setLoginDetails] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [employeeName, setEmployeeName] = useState("");
  const { id } = useParams();
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  useEffect(() => {
    // Fetch employee details and related data when the component mounts or id changes
    fetchEmployeeDetails();
  }, [id]);
  
  useEffect(() => {
    // Fetch login details only when employeeData is available
    if (employeeData) {
      axios
        .get(`${secretKey}/loginDetails`)
        .then((response) => {
          const tempData = response.data;
          // Update state with fetched login details
          setLoginDetails(tempData.filter(obj => obj.ename === employeeData.email));
        })
        .catch((error) => {
          console.error("Error fetching login details:", error);
        });
    }
  }, [employeeData]); // Add employeeData to the dependency array
  
  const fetchEmployeeDetails = async () => {
    try {
      const response = await axios.get(`${secretKey}/einfo`);
  
      // Find the employee by id and set the name
      const selectedEmployee = response.data.find(
        (employee) => employee._id === id
      );
      if (selectedEmployee) {
        setEmployeeData(selectedEmployee);
        setEmployeeName(selectedEmployee.ename);
        console.log(employeeData); // Print employeeData after setting it
      } else {
        // Handle the case where no employee is found with the given id
        setEmployeeName("Employee not found");
      }
    } catch (error) {
      console.error("Error fetching employee details:", error.message);
    }
  };
  
  
  function goBack() {
    window.history.back();
  }
  return (
    <div>
      <Header />
      <Navbar />
      <div className="container-xl">
        <div className="row g-2 align-items-center">
          <div className="col d-flex">
            {/* <!-- Page pre-title --> */}

            <IconButton onClick={goBack}>
              <IconChevronLeft />
            </IconButton>

            <h2 className="page-title">{employeeName}</h2>
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
        <div className="card mt-2">
          <div className="card-body p-0">
            <div style={{ overflowX: "auto" }}>
              {loginDetails.length !== 0 ? (
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loginDetails.map((details, index) => (
                      <tr key={index}>
                        <td>{details.ename}</td>
                        <td>{details.date}</td>
                        <td>{details.time}</td>
                        <td>{details.address}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <>
                  <img src={myImage} alt="myImage" />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginDetails;
