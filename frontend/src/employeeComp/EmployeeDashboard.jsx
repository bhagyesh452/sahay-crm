import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import EmpNav from "./EmpNav";
import axios from "axios";
import { useParams } from "react-router-dom";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import { FaRegCalendar } from "react-icons/fa";


function EmployeeDashboard() {
  const { userId } = useParams();
  const [data, setData] = useState([]);
  const [empData, setEmpData] = useState([]);
  const [followData, setFollowData] = useState([])
  const [displayDateRange, setDateRangeDisplay] = useState(false)
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
    empData.length !== 0 &&
    empData.map((data) => formatDate(data.AssignDate));

  const uniqueArray = formattedDates && [...new Set(formattedDates)];
  //console.log(uniqueArray)


  // ---------------------------projectiondata-------------------------------------

  const fetchFollowUpData = async () => {

    try {
      const response = await fetch(`${secretKey}/projection-data/${data.ename}`);
      const followdata = await response.json();
      setFollowData(followdata);
    } catch (error) {
      console.error('Error fetching data:', error);
      return { error: 'Error fetching data' };
    }
  }

  console.log(followData)

  function calculateSum(data) {
    const initialValue = { totalPaymentSum: 0, offeredPaymentSum: 0, offeredServices: [] };

    const sum = data.reduce((accumulator, currentValue) => {
      // Concatenate offeredServices from each object into a single array
      const offeredServices = accumulator.offeredServices.concat(currentValue.offeredServices);

      return {
        totalPaymentSum: accumulator.totalPaymentSum + currentValue.totalPayment,
        offeredPaymentSum: accumulator.offeredPaymentSum + currentValue.offeredPrize,
        offeredServices: offeredServices
      };
    }, initialValue);

    // // Remove duplicate services from the array
    // sum.offeredServices = Array.from(new Set(sum.offeredServices));

    return sum;
  }

  // Calculate the sums
  const { totalPaymentSum, offeredPaymentSum, offeredServices } = calculateSum(followData);

  useEffect(() => {
    fetchFollowUpData();
  }, [data]);


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
    key: 'selection',
  };

  const handleSelect = (date) => {
    const filteredDataDateRange = followData.filter(product => {
      const productDate = new Date(product["lastFollowUpdate"]);
      
      if (formatDate(date.selection.startDate) === formatDate(date.selection.endDate)){
        return (
          formatDate(productDate) == formatDate(date.selection.startDate)
        )

      }else{
        return (
          productDate >= date.selection.startDate &&
          productDate <= date.selection.endDate
        );
      }

     
    });
    setStartDate(date.selection.startDate);
    setEndDate(date.selection.endDate);
    setFilteredDataDateRange(filteredDataDateRange);
    console.log(filteredDataDateRange)
  };

  function calculateSumFilter(data) {
    const initialValue = { totalPaymentSumFilter: 0, offeredPaymentSumFilter: 0, offeredServicesFilter: [] };

    const sum = data.reduce((accumulator, currentValue) => {
      // Concatenate offeredServices from each object into a single array
      const offeredServices = accumulator.offeredServicesFilter.concat(currentValue.offeredServices);

      return {
        totalPaymentSumFilter: accumulator.totalPaymentSumFilter + currentValue.totalPayment,
        offeredPaymentSumFilter: accumulator.offeredPaymentSumFilter + currentValue.offeredPrize,
        offeredServicesFilter: offeredServices
      };
    }, initialValue);

    // // Remove duplicate services from the array
    // sum.offeredServices = Array.from(new Set(sum.offeredServices));

    return sum;
  }

  // Calculate the sums
  const { totalPaymentSumFilter, offeredPaymentSumFilter, offeredServicesFilter } = calculateSumFilter(filteredDataDateRange);

  console.log(totalPaymentSumFilter)
  console.log(offeredPaymentSumFilter)
  console.log(offeredServicesFilter)

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
                        <td style={{
                          lineHeight: "32px",
                        }}>{index + 1}</td>
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
                              (partObj) => formatDate(partObj.AssignDate) === obj
                            ).length
                          }
                        </td>
                      </tr>
                    ))}

                </tbody>
                {uniqueArray && (
                  <tfoot>
                    <tr style={{ fontWeight: 500 }}>
                      <td style={{ lineHeight: '32px' }} colSpan="2">Total</td>
                      <td>
                        {
                          empData.filter(
                            (partObj) => partObj.Status === "Untouched"
                          ).length
                        }
                      </td>
                      <td>
                        {
                          empData.filter(
                            (partObj) => partObj.Status === "Busy"
                          ).length
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
                          empData.filter(
                            (partObj) => partObj.Status === "Junk"
                          ).length
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
          <div className="card-header d-flex align-items-center justify-content-between" onClick={handleIconClick}>
            <div>
              <h2>Projection Dashboard</h2>
            </div>
            <div className="form-control d-flex align-items-center justify-content-between" style={{ width: "15vw" }}>
              <div>{`${formatDate(startDate)} - ${formatDate(endDate)}`}</div>
              <button onClick={handleIconClick} style={{ border: "none", padding: "0px", backgroundColor: "white" }}>
                <FaRegCalendar style={{ width: "20px", height: "20px", color: "#bcbaba", color: "black" }} />
              </button>
            </div>
          </div>
          {displayDateRange && (
            <div className="position-absolute " style={{ zIndex: "1", top: "20%", left: "75%" }} >
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
                    <th>Employee Projection Date</th>
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
                    (filteredDataDateRange.map((obj, index) => (
                      <tr key={`row-${index}`}>
                        <td style={{
                          lineHeight: "32px",
                        }}>{index + 1}</td>
                        <td>{obj.companyName}</td>
                        <td>{obj.offeredServices.join(', ')}</td>
                        <td>{obj.totalPayment && obj.totalPayment.toLocaleString()}
                        </td>
                        <td>{obj.offeredPrize.toLocaleString()}
                        </td>
                        <td>{obj.estPaymentDate}
                        </td>
                      </tr>)))}
                </tbody>
                {filteredDataDateRange && 
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
                (<tfoot>
                  <tr style={{ fontWeight: 500 }}>
                    <td style={{ lineHeight: '32px' }} colSpan="2">Total</td>
                    <td>{offeredServicesFilter.length}
                    </td>
                    <td> {totalPaymentSumFilter.toLocaleString()}
                    </td>
                    <td>
                      {offeredPaymentSumFilter.toLocaleString()}
                    </td>
                    <td>-
                    </td>
                  </tr>
                </tfoot>)}
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;
