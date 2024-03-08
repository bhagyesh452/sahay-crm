import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import EmpNav from "./EmpNav";
import axios from "axios";
import { useParams } from "react-router-dom";
import { options } from "../components/Options.js";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRangePicker } from "react-date-range";
import { FaRegCalendar } from "react-icons/fa";
import { Drawer, IconButton } from "@mui/material";
import Swal from "sweetalert2";
import Select from "react-select";
import EditIcon from "@mui/icons-material/Edit";

function EmployeeDashboard() {
  const { userId } = useParams();
  const [data, setData] = useState([]);
  const [isEditProjection, setIsEditProjection] = useState(false);
  const [projectingCompany, setProjectingCompany] = useState("");
  const [openProjection, setOpenProjection] = useState(false);
  const [selectedValues, setSelectedValues] = useState([]);
  const [currentProjection, setCurrentProjection] = useState({
    companyName: "",
    ename: "",
    offeredPrize: 0,
    offeredServices: [],
    lastFollowUpdate: "",
    estPaymentDate: "",
    date: "",
    time: "",
  });
  const [empData, setEmpData] = useState([]);
  const [followData, setFollowData] = useState([]);
  const [displayDateRange, setDateRangeDisplay] = useState(false);
  const [buttonToggle, setButtonToggle] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [filteredDataDateRange, setFilteredDataDateRange] = useState([]);
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const convertedDate = date.toLocaleDateString();
    return convertedDate;
  };
  const fetchData = async () => {
    try {
      const response = await axios.get(`${secretKey}/einfo`);
      // Set the retrieved data in the state
      const tempData = response.data;
      const userData = tempData.find((item) => item._id === userId);

      setData(userData);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const fetchEmployeeData = async () => {
    fetch(`${secretKey}/edata-particular/${data.ename}`)
      .then((response) => response.json())
      .then((data) => {
        setEmpData(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    fetchEmployeeData();
  }, [data]);
  const formattedDates =
    empData.length !== 0 && empData.map((data) => formatDate(data.AssignDate));

  const uniqueArray = formattedDates && [...new Set(formattedDates)];
  //console.log(uniqueArray)

  // ---------------------------projectiondata-------------------------------------

  const fetchFollowUpData = async () => {
    try {
      const response = await fetch(
        `${secretKey}/projection-data/${data.ename}`
      );
      const followdata = await response.json();
      setFollowData(followdata);
    } catch (error) {
      console.error("Error fetching data:", error);
      return { error: "Error fetching data" };
    }
  };

  function calculateSum(data) {
    const initialValue = {
      totalPaymentSum: 0,
      offeredPaymentSum: 0,
      offeredServices: [],
    };

    const sum = data.reduce((accumulator, currentValue) => {
      // Concatenate offeredServices from each object into a single array
      const offeredServices = accumulator.offeredServices.concat(
        currentValue.offeredServices
      );

      return {
        totalPaymentSum:
          accumulator.totalPaymentSum + currentValue.totalPayment,
        offeredPaymentSum:
          accumulator.offeredPaymentSum + currentValue.offeredPrize,
        offeredServices: offeredServices,
      };
    }, initialValue);

    // // Remove duplicate services from the array
    // sum.offeredServices = Array.from(new Set(sum.offeredServices));

    return sum;
  }

  // Calculate the sums
  const { totalPaymentSum, offeredPaymentSum, offeredServices } =
    calculateSum(followData);

  useEffect(() => {
    fetchFollowUpData();
  }, [data]);

  const functionopenprojection = (comName) => {
    
    setProjectingCompany(comName);
    setOpenProjection(true);
    const findOneprojection =
      followData.length !== 0 &&
      followData.find((item) => item.companyName === comName);
    if (findOneprojection) {
      setCurrentProjection({
        companyName: findOneprojection.companyName,
        ename: findOneprojection.ename,
        offeredPrize: findOneprojection.offeredPrize,
        offeredServices: findOneprojection.offeredServices,
        lastFollowUpdate: findOneprojection.lastFollowUpdate,
        estPaymentDate: findOneprojection.estPaymentDate,
        totalPayment:findOneprojection.totalPayment,
        remarks:findOneprojection.remarks,
        date: "",
        time: "",
      });
      setSelectedValues(findOneprojection.offeredServices);
    }
  };
  const closeProjection = () => {
    setOpenProjection(false);
    setProjectingCompany("");
    setCurrentProjection({
      companyName: "",
      ename: "",
      offeredPrize: "",
      offeredServices: "",
      lastFollowUpdate: "",
      date: "",
      time: "",
    });
    setSelectedValues([]);
  };
  
  const handleProjectionSubmit = async () => {
    try {
     
      const finalData = {
        ...currentProjection,
        companyName: projectingCompany,
        ename: data.ename,
        offeredServices: selectedValues,
      };
      if(finalData.offeredServices.length === 0){
        Swal.fire({title:'Services is required!' , icon:'warning'});
      }else if(finalData.remarks === ""){
        Swal.fire({title:'Remarks is required!' , icon:'warning'});
      }else if(finalData.totalPayment === 0){
        Swal.fire({title:'Payment is required!' , icon:'warning'});
      }
      else if(finalData.offeredPrize === 0){
        Swal.fire({title:'Offered Prize is required!' , icon:'warning'});
      }
      else if(finalData.lastFollowUpdate === null){
        Swal.fire({title:'Last FollowUp Date is required!' , icon:'warning'});
      }
      else if(finalData.estPaymentDate === 0){
        Swal.fire({title:'Estimated Payment Date is required!' , icon:'warning'});
      }
   
   
   

      // Send data to backend API
      const response = await axios.post(
        `${secretKey}/update-followup`,
        finalData
      );
      Swal.fire({ title: "Projection Submitted!", icon: "success" });
      setOpenProjection(false);
      setCurrentProjection({
        companyName: "",
        ename: "",
        offeredPrize: 0,
        offeredServices: [],
        lastFollowUpdate: "",
        remarks: "",
        date: "",
        time: "",
      });
      fetchFollowUpData();

  // Log success message
    } catch (error) {
      console.error("Error updating or adding data:", error.message);
    }
  };

  // -------------------------------date-range-picker-------------------------------------------

  const handleIconClick = () => {
    if (!buttonToggle) {
      setDateRangeDisplay(true);
    } else {
      setDateRangeDisplay(false);
    }
    setButtonToggle(!buttonToggle);
  };

  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: "selection",
  };

  const handleSelect = (date) => {
    const filteredDataDateRange = followData.filter((product) => {
      const productDate = new Date(product["lastFollowUpdate"]);

      if (
        formatDate(date.selection.startDate) ===
        formatDate(date.selection.endDate)
      ) {
        return formatDate(productDate) == formatDate(date.selection.startDate);
      } else {
        return (
          productDate >= date.selection.startDate &&
          productDate <= date.selection.endDate
        );
      }
    });
    setStartDate(date.selection.startDate);
    setEndDate(date.selection.endDate);
    setFilteredDataDateRange(filteredDataDateRange);
    console.log(filteredDataDateRange);
  };

  function calculateSumFilter(data) {
    const initialValue = {
      totalPaymentSumFilter: 0,
      offeredPaymentSumFilter: 0,
      offeredServicesFilter: [],
    };

    const sum = data.reduce((accumulator, currentValue) => {
      // Concatenate offeredServices from each object into a single array
      const offeredServices = accumulator.offeredServicesFilter.concat(
        currentValue.offeredServices
      );

      return {
        totalPaymentSumFilter:
          accumulator.totalPaymentSumFilter + currentValue.totalPayment,
        offeredPaymentSumFilter:
          accumulator.offeredPaymentSumFilter + currentValue.offeredPrize,
        offeredServicesFilter: offeredServices,
      };
    }, initialValue);

    // // Remove duplicate services from the array
    // sum.offeredServices = Array.from(new Set(sum.offeredServices));

    return sum;
  }

  // Calculate the sums
  const {
    totalPaymentSumFilter,
    offeredPaymentSumFilter,
    offeredServicesFilter,
  } = calculateSumFilter(filteredDataDateRange);

console.log('follow data:' , currentProjection)
  return (
    <div>
      <Header name={data.ename} designation={data.designation} />
      <EmpNav userId={userId} />
      <div className="container-xl mt-2">
        <div className="card">
          <div className="card-header">
            <h2>Your Dashboard</h2>
          </div>
          <div className="card-body">
            <div
              id="table-default"
              style={{
                overflowX: "auto",
                overflowY: "auto",
                maxHeight: "60vh",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  border: "1px solid #ddd",
                  marginBottom: "10px",
                }}
                className="table-vcenter table-nowrap"
              >
                <thead stSyle={{ backgroundColor: "grey" }}>
                  <tr
                    style={{
                      backgroundColor: "#ffb900",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    <th
                      style={{
                        lineHeight: "32px",
                      }}
                    >
                      Sr. No
                    </th>
                    <th>Lead Assign Date</th>
                    <th>Untouched</th>
                    <th>Busy</th>
                    <th>Not Picked Up</th>
                    <th>Junk</th>
                    <th>Follow Up</th>
                    <th>Interested</th>
                    <th>Not Interested</th>
                    <th>Matured</th>
                    <th>Total Leads</th>
                  </tr>
                </thead>
                <tbody>
                  {uniqueArray &&
                    uniqueArray.map((obj, index) => (
                      <tr key={`row-${index}`}>
                        <td
                          style={{
                            lineHeight: "32px",
                          }}
                        >
                          {index + 1}
                        </td>
                        <td>{obj}</td>
                        <td>
                          {
                            empData.filter(
                              (partObj) =>
                                formatDate(partObj.AssignDate) === obj &&
                                partObj.Status === "Untouched"
                            ).length
                          }
                        </td>
                        <td>
                          {
                            empData.filter(
                              (partObj) =>
                                formatDate(partObj.AssignDate) === obj &&
                                partObj.Status === "Busy"
                            ).length
                          }
                        </td>
                        <td>
                          {
                            empData.filter(
                              (partObj) =>
                                formatDate(partObj.AssignDate) === obj &&
                                partObj.Status === "Not Picked Up"
                            ).length
                          }
                        </td>
                        <td>
                          {
                            empData.filter(
                              (partObj) =>
                                formatDate(partObj.AssignDate) === obj &&
                                partObj.Status === "Junk"
                            ).length
                          }
                        </td>
                        <td>
                          {
                            empData.filter(
                              (partObj) =>
                                formatDate(partObj.AssignDate) === obj &&
                                partObj.Status === "FollowUp"
                            ).length
                          }
                        </td>
                        <td>
                          {
                            empData.filter(
                              (partObj) =>
                                formatDate(partObj.AssignDate) === obj &&
                                partObj.Status === "Interested"
                            ).length
                          }
                        </td>
                        <td>
                          {
                            empData.filter(
                              (partObj) =>
                                formatDate(partObj.AssignDate) === obj &&
                                partObj.Status === "Not Interested"
                            ).length
                          }
                        </td>
                        <td>
                          {
                            empData.filter(
                              (partObj) =>
                                formatDate(partObj.AssignDate) === obj &&
                                partObj.Status === "Matured"
                            ).length
                          }
                        </td>
                        <td>
                          {
                            empData.filter(
                              (partObj) =>
                                formatDate(partObj.AssignDate) === obj
                            ).length
                          }
                        </td>
                      </tr>
                    ))}
                </tbody>
                {uniqueArray && (
                  <tfoot>
                    <tr style={{ fontWeight: 500 }}>
                      <td style={{ lineHeight: "32px" }} colSpan="2">
                        Total
                      </td>
                      <td>
                        {
                          empData.filter(
                            (partObj) => partObj.Status === "Untouched"
                          ).length
                        }
                      </td>
                      <td>
                        {
                          empData.filter((partObj) => partObj.Status === "Busy")
                            .length
                        }
                      </td>
                      <td>
                        {
                          empData.filter(
                            (partObj) => partObj.Status === "Not Picked Up"
                          ).length
                        }
                      </td>
                      <td>
                        {
                          empData.filter((partObj) => partObj.Status === "Junk")
                            .length
                        }
                      </td>
                      <td>
                        {
                          empData.filter(
                            (partObj) => partObj.Status === "FollowUp"
                          ).length
                        }
                      </td>
                      <td>
                        {
                          empData.filter(
                            (partObj) => partObj.Status === "Interested"
                          ).length
                        }
                      </td>
                      <td>
                        {
                          empData.filter(
                            (partObj) => partObj.Status === "Not Interested"
                          ).length
                        }
                      </td>
                      <td>
                        {
                          empData.filter(
                            (partObj) => partObj.Status === "Matured"
                          ).length
                        }
                      </td>
                      <td>{empData.length}</td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* -----------------------------------------------projection dashboard-------------------------------------------------- */}

      <div className="container-xl mt-2">
        <div className="card">
          <div
            className="card-header d-flex align-items-center justify-content-between"
            onClick={handleIconClick}
          >
            <div>
              <h2>Projection Dashboard</h2>
            </div>
            <div
              className="form-control d-flex align-items-center justify-content-between"
              style={{ width: "15vw" }}
            >
              <div>{`${formatDate(startDate)} - ${formatDate(endDate)}`}</div>
              <button
                onClick={handleIconClick}
                style={{
                  border: "none",
                  padding: "0px",
                  backgroundColor: "white",
                }}
              >
                <FaRegCalendar
                  style={{
                    width: "20px",
                    height: "20px",
                    color: "#bcbaba",
                    color: "black",
                  }}
                />
              </button>
            </div>
          </div>
          {displayDateRange && (
            <div
              className="position-absolute "
              style={{ zIndex: "1", top: "20%", left: "75%" }}
            >
              <DateRangePicker
                ranges={[selectionRange]}
                onClose={() => setDateRangeDisplay(false)}
                onChange={handleSelect}
              />
            </div>
          )}
          <div className="card-body">
            <div
              id="table-default"
              style={{
                overflowX: "auto",
                overflowY: "auto",
                maxHeight: "60vh",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  border: "1px solid #ddd",
                  marginBottom: "10px",
                }}
                className="table-vcenter table-nowrap"
              >
                <thead stSyle={{ backgroundColor: "grey" }}>
                  <tr
                    style={{
                      backgroundColor: "#ffb900",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    <th
                      style={{
                        lineHeight: "32px",
                      }}
                    >
                      Sr. No
                    </th>
                    <th>Company Name</th>
                    <th>Offered Services</th>
                    <th>Total Offered Price</th>
                    <th>Expected Amount</th>
                    <th>Remarks</th>
                    <th>Estimated Payment Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDataDateRange &&
                    // (
                    //   followData.map((obj, index) => (
                    //     <tr key={`row-${index}`}>
                    //       <td style={{
                    //         lineHeight: "32px",
                    //       }}>{index + 1}</td>
                    //       <td>{obj.companyName}</td>
                    //       <td>{obj.offeredServices.join(', ')}</td>
                    //       <td>{obj.totalPayment && obj.totalPayment.toLocaleString()}
                    //       </td>
                    //       <td>{obj.offeredPrize.toLocaleString()}
                    //       </td>
                    //       <td>{obj.estPaymentDate}
                    //       </td>
                    //     </tr>
                    //   ))) :
                    filteredDataDateRange.map((obj, index) => (
                      <tr key={`row-${index}`}>
                        <td
                          style={{
                            lineHeight: "32px",
                          }}
                        >
                          {index + 1}
                        </td>
                        <td>{obj.companyName}</td>
                        <td>{obj.offeredServices.join(", ")}</td>
                        <td>
                        ₹{obj.totalPayment &&
                            obj.totalPayment.toLocaleString()}
                        </td>
                        <td>₹{obj.offeredPrize.toLocaleString()}</td>
                        <td>{obj.remarks}</td>
                        <td>{obj.estPaymentDate}</td>
                        <td>
                          <IconButton
                            onClick={() => {
                              functionopenprojection(obj.companyName);
                            }}
                          >
                            <EditIcon color="primary"></EditIcon>
                          </IconButton>
                        </td>
                      </tr>
                    ))}
                </tbody>
                {filteredDataDateRange && (
                  // (
                  //   <tfoot>
                  //     <tr style={{ fontWeight: 500 }}>
                  //       <td style={{ lineHeight: '32px' }} colSpan="2">Total</td>
                  //       <td>{offeredServices.length}
                  //       </td>
                  //       <td> {totalPaymentSum.toLocaleString()}
                  //       </td>
                  //       <td>
                  //         {offeredPaymentSum.toLocaleString()}
                  //       </td>
                  //       <td>-
                  //       </td>
                  //     </tr>
                  //   </tfoot>
                  // ) :
                  <tfoot>
                    <tr style={{ fontWeight: 500 }}>
                      <td style={{ lineHeight: "32px" }} colSpan="2">
                        Total
                      </td>
                      <td>{offeredServicesFilter.length}</td>
                      <td> ₹{totalPaymentSumFilter.toLocaleString()}</td>
                      <td>₹{offeredPaymentSumFilter.toLocaleString()}</td>
                      <td>-</td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* Drawer for Follow Up Projection  */}
      <div>
        <Drawer
          style={{ top: "50px" }}
          anchor="right"
          open={openProjection}
          onClose={closeProjection}
        >
          <div style={{ width: "31em" }} className="container-xl">
            <div className="header d-flex justify-content-between align-items-center">
              <h1 style={{ marginBottom: "0px" }} className="title">
                Projection Form
              </h1>
              <IconButton>
                <EditIcon color="primary"></EditIcon>
              </IconButton>
            </div>
            <hr style={{ marginBottom: "10px" }} />
            <div className="body-projection">
              <div className="header mb-2">
              <strong style={{ fontSize: "20px" }}>
                  {projectingCompany}
                </strong>
              </div>
              <div className="label">
                <strong>Offered Services :</strong>
                <div className="services mb-3">
                  <Select
                    // styles={{
                    //   customStyles,
                    //   container: (provided) => ({
                    //     border: "1px solid #ffb900",
                    //     borderRadius: "5px",
                    //   }),
                    // }}
                    isMulti
                    options={options}
                    placeholder="Select Services..."
                    onChange={(selectedOptions) => {
                      setSelectedValues(
                        selectedOptions.map((option) => option.value)
                      );
                    }}
                    value={selectedValues.map((value) => ({
                      value,
                      label: value,
                    }))}
                  />
                </div>
              </div>
              <div className="label">
                <strong>Offered prizes :</strong>
                <div className="services mb-3">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Please enter offered Prize"
                    value={currentProjection.offeredPrize}
                    onChange={(e) => {
                      setCurrentProjection((prevLeadData) => ({
                        ...prevLeadData,
                        offeredPrize: e.target.value,
                      }));
                    }}
                  />
                </div>
              </div>
              <div className="label">
                <strong>Total Payment :</strong>
                <div className="services mb-3">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Please enter total Payment"
                    value={currentProjection.totalPayment}
                    onChange={(e) => {
                      setCurrentProjection((prevLeadData) => ({
                        ...prevLeadData,
                        totalPayment: e.target.value,
                      }));
                    }}
                  />
                </div>
              </div>
              <div className="label">
                <strong>Last Follow Up Date: </strong>
                <div className="services mb-3">
                  <input
                    type="date"
                    className="form-control"
                    placeholder="Please enter offered Prize"
                    value={currentProjection.lastFollowUpdate}
                    onChange={(e) => {
                      setCurrentProjection((prevLeadData) => ({
                        ...prevLeadData,
                        lastFollowUpdate: e.target.value,
                      }));
                    }}
                  />
                </div>
              </div>
              <div className="label">
                <strong>Payment Expected on :</strong>
                <div className="services mb-3">
                  <input
                    type="date"
                    className="form-control"
                    placeholder="Please enter Estimated Payment Date"
                    value={currentProjection.estPaymentDate}
                    onChange={(e) => {
                      setCurrentProjection((prevLeadData) => ({
                        ...prevLeadData,
                        estPaymentDate: e.target.value,
                      }));
                    }}
                 
                  />
                </div>
              </div>
              <div className="label">
                <strong>Remarks :</strong>
                <div className="remarks mb-3">
                  <textarea
                    type="text"
                    className="form-control"
                    placeholder="Enter any Remarks"
                    value={currentProjection.remarks}
                    onChange={(e) => {
                      setCurrentProjection((prevLeadData) => ({
                        ...prevLeadData,
                        remarks: e.target.value,
                      }));
                    }}
                  />
                </div>
              </div>
              <div className="submitBtn">
                <button
                  style={{ width: "100%" }}
                  type="submit"
                  class="btn btn-primary mb-3"
                  onClick={handleProjectionSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </Drawer>
      </div>
    </div>
  );
}

export default EmployeeDashboard;
