import React from "react";
import Header from "./Header";
import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../assets/styles.css";
import { IconPhoneFilled } from "@tabler/icons-react";
import { IconMailFilled } from "@tabler/icons-react";
import { IconClockFilled } from "@tabler/icons-react";

function CompanyParticular({}) {
  const [employeeHistory, setEmployeeHistory] = useState([]);
  const [companyObject, setCompanyObject] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const { companyId } = useParams();

  const fetchCompany = async () => {
    try {
      // Make a GET request to fetch data of the specific company by its name
      const response = await axios.get(
        `${secretKey}/specific-company/${companyId}`
      );
      // Extract the data from the response
      const data = response.data;
      console.log(data);
      setCompanyName(data["Company Name"]);
      // Set the fetched company data to the state
      setCompanyObject(data);
    } catch (error) {
      console.error("Error fetching company:", error);
    }
  };
  useEffect(() => {
    fetchCompany();
  }, []);
  useEffect(() => {
    const fetchEmployeeHistory = async () => {
      try {
        // Make a GET request to fetch data based on the companyName
        const response = await axios.get(
          `${secretKey}/employee-history/${companyName}`
        );
        // Extract the data from the response
        const data = response.data;
      
        // Set the fetched employee history data to the state
        setEmployeeHistory(data);
      } catch (error) {
        console.error("Error fetching employee history:", error);
      }
    };

    // Call the fetchEmployeeHistory function when the component mounts
    if (companyName !== "") {
      fetchEmployeeHistory();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyName]);
  function formatDate(inputDate) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(inputDate).toLocaleDateString(
      "en-US",
      options
    );
    return formattedDate;
  }
  return (
    <div>
      <Header />
      <Navbar />
      {companyObject !== null && (
        <div className="container-xl mt-2">
          <div className="company-introduction-card card">
            <div className="card-body">
              <div
                style={{ alignItems: "inherit" }}
                className="card-header m-0 p-0 d-flex flex-column"
              >
                <strong style={{ fontSize: "20px" }}>
                  {companyName !== "" ? companyName : "Company Name"}
                </strong>
                <i>
                  {companyObject.City}, {companyObject.State}
                </i>
              </div>

              <div className="company-details">
                <div className="row mt-2">
                  <div className="col">
                    <p className="bde-info">
                      <div className="info-label">
                        <span style={{ color: "#313c52" }}>BDE:</span>{" "}
                        <strong>{companyObject.ename} </strong>
                      </div>

                      <div className="info-label">
                        <span style={{ color: "#313c52" }}>Assigned On:</span>{" "}
                        <strong>{formatDate(companyObject.AssignDate)}</strong>
                      </div>

                      <div className="info-label">
                        <span style={{ color: "#313c52" }}>Status:</span>
                        <strong>{companyObject.Status}</strong>
                      </div>
                    </p>
                  </div>
                  <div className="col">
                    <p className="contact-info">
                      <div className="info-label ">
                        <IconPhoneFilled />
                        <strong>+91 {companyObject["Company Number"]}</strong>
                      </div>

                      <div className="info-label">
                        <IconMailFilled />{" "}
                        <strong>{companyObject["Company Email"]}</strong>
                      </div>

                      <div className="info-label">
                        <IconClockFilled />{" "}
                        <strong>
                          {formatDate(
                            companyObject["Company Incorporation Date  "]
                          )}
                        </strong>
                      </div>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {companyObject!== null && <div className="container-xl">
        <div style={{ width: "fit-content" }} className="card p-2 mt-2">
          <div className="heading">
            <h1>Company History</h1>
          </div>
          <div className="wrapper">
            <ul className="StepProgress">
              <li className="StepProgress-item is-done">
                <div class="step-content">
                  <strong>Company Added</strong>
                  <span class="step-date">Feb 15, 2024</span>
                </div>
              </li>
              <li className="StepProgress-item is-done">
                <div class="step-content">
                  {companyObject.ename !== "Not Alloted" ? (
                    <> {employeeHistory.length!==0 && employeeHistory.map(()=>(
                        <>
                        <strong>Company Assigned to {companyObject.ename}</strong>
                    
                        <span class="step-date">
                          {formatDate(companyObject.AssignDate)}
                        </span>
                        </>
                    )) }
                      
                    </>
                  ) : (
                    <>
                      <strong>Company Unassigned</strong>
                    </>
                  )}
                </div>
              </li>
              <li className={companyObject.Status==="Interested" ? "StepProgress-item current" : "StepProgress-item"}>
                <div class="step-content">
                  <strong>Interested</strong>
                  <span class="step-date">Feb 17, 2024</span>
                </div>
              </li>
              <li className="StepProgress-item">
                <div class="step-content">
                  <strong>Handover</strong>
                  <span class="step-date">Feb 18, 2024</span>
                </div>
              </li>
              <li className="StepProgress-item">
                <div class="step-content">
                  <strong>Provide feedback</strong>
                  <span class="step-date">Feb 19, 2024</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>}
    </div>
  );
}

export default CompanyParticular;
