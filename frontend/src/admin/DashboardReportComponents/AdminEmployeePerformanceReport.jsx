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
    <div className="card">
      <div className="card-header p-1 employeedashboard d-flex align-items-center justify-content-between">
        <div className="dashboard-title pl-1"  >
          <h2 className="m-0">
            Performance Report
          </h2>
        </div>
        {/* <div className="d-flex align-items-center pr-1">
              <div className="filter-booking mr-1 d-flex align-items-center">
                <div className="filter-title mr-1">
                  <h2 className="m-0">
                    Filter Branch :
                  </h2>
                </div>
                <div className="filter-main">
                  <select
                    className="form-select"
                    id={`branch-filter`}
                    onChange={(e) => {
                      handleFilterBranchOffice(e.target.value)
                    }}
                  >
                    <option value="" disabled selected>
                      Select Branch
                    </option>

                    <option value={"Gota"}>Gota</option>
                    <option value={"Sindhu Bhawan"}>
                      Sindhu Bhawan
                    </option>
                    <option value={"none"}>None</option>
                  </select>
                </div>
              </div>
              <div class="input-icon mr-1">
                <span class="input-icon-addon">
                  <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
                    <path d="M21 21l-6 -6"></path>
                  </svg>
                </span>
                <input
                  value={searchTermProjection}
                  onChange={(e) =>
                    debouncedFilterSearchProjection(e.target.value)
                  }
                  className="form-control"
                  placeholder="Enter BDE Name..."
                  type="text"
                  name="bdeName-search"
                  id="bdeName-search" />
              </div>
              <div className="date-filter">
                <LocalizationProvider dateAdapter={AdapterDayjs}  >
                  <DemoContainer components={["SingleInputDateRangeField"]} sx={{
                    padding: '0px',
                    with: '220px'
                  }}>
                    <DateRangePicker className="form-control my-date-picker form-control-sm p-0"
                      onChange={(values) => {
                        const startDate = moment(values[0]).format(
                          "DD/MM/YYYY"
                        );
                        const endDate = moment(values[1]).format(
                          "DD/MM/YYYY"
                        );
                        setSelectedDateRange([startDate, endDate]);
                        handleSelect(values); // Call handleSelect with the selected values
                      }}
                      slots={{ field: SingleInputDateRangeField }}
                      slotProps={{
                        shortcuts: {
                          items: shortcutsItems,
                        },
                        actionBar: { actions: [] },
                        textField: {
                          InputProps: { endAdornment: <Calendar /> },
                        },
                      }}
                    //calendars={1}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </div>
              <div>
                <FormControl sx={{ ml: 1, minWidth: 200 }}>
                  <InputLabel id="demo-select-small-label">Select Employee</InputLabel>
                  <Select
                    className="form-control my-date-picker my-mul-select form-control-sm p-0"
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    multiple
                    value={projectionNames}
                    onChange={(event) => {
                      setProjectionNames(event.target.value)
                      handleSelectProjectionSummary(event.target.value)
                    }}
                    input={<OutlinedInput label="Name" />}
                    MenuProps={MenuProps}
                  >
                    {options.map((name) => (
                      <MenuItem
                        key={name}
                        value={name}
                        style={getStyles(name, projectionNames, theme)}
                      >
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div> */}
      </div>
      <div className="card-body">
        <div id="table-default" className="row tbl-scroll">
          <table className="table-vcenter table-nowrap admin-dash-tbl"  >
            <thead className="admin-dash-tbl-thead">
              <tr>
                <th>Name</th>
                <th>Month</th>
                <th>
                  Target
                  {/* <SwapVertIcon
                        style={{
                          height: "15px",
                          width: "15px",
                          cursor: "pointer",
                          marginLeft: "4px",
                        }}
                        onClick={() => {
                          let newSortType;
                          if (sortTypeProjection === "ascending") {
                            newSortType = "descending";
                          } else if (sortTypeProjection === "descending") {
                            newSortType = "none";
                          } else {
                            newSortType = "ascending";
                          }
                          handleSortTotalCompanies(newSortType);
                        }}
                      /> */}
                </th>
                <th>
                  Achievement
                  {/* <SwapVertIcon
                        style={{
                          height: "15px",
                          width: "15px",
                          cursor: "pointer",
                          marginLeft: "4px",
                        }}
                        onClick={() => {
                          let newSortType;
                          if (sortTypeServices === "ascending") {
                            newSortType = "descending";
                          } else if (sortTypeServices === "descending") {
                            newSortType = "none";
                          } else {
                            newSortType = "ascending";
                          }
                          handleSortOfferedServices(newSortType);
                        }}
                      /> */}
                </th>
                <th>
                  Ratio
                  {/* <SwapVertIcon
                        style={{
                          height: "15px",
                          width: "15px",
                          cursor: "pointer",
                          marginLeft: "4px",
                        }}
                        onClick={() => {
                          let newSortType;
                          if (sortTypePrice === "ascending") {
                            newSortType = "descending";
                          } else if (sortTypePrice === "descending") {
                            newSortType = "none";
                          } else {
                            newSortType = "ascending";
                          }
                          handleSortOffredPrize(newSortType);
                        }}
                      /> */}
                </th>
                <th>
                  Result
                  {/* <SwapVertIcon
                        style={{
                          height: "15px",
                          width: "15px",
                          cursor: "pointer",
                          marginLeft: "4px",
                        }}
                        onClick={() => {
                          let newSortType;
                          if (sortTypeExpectedPayment === "ascending") {
                            newSortType = "descending";
                          } else if (
                            sortTypeExpectedPayment === "descending"
                          ) {
                            newSortType = "none";
                          } else {
                            newSortType = "ascending";
                          }
                          handleSortExpectedPayment(newSortType);
                        }}
                      /> */}
                </th>
                {/* <th>Est. Payment Date</th> */}
              </tr>
            </thead>
            <tbody>
            {empPerformanceData.length > 0 ? (
                empPerformanceData.map((employee) => {
                  const filteredTargetDetails = employee.targetDetails.filter((perData) => {
                    const monthYear = new Date(perData.year, new Date(Date.parse(perData.month + " 1, 2020")).getMonth(), 1);
                    const currentMonthYear = new Date(currentYear, new Date(Date.parse(currentMonth + " 1, 2020")).getMonth(), 1);
                    return monthYear < currentMonthYear;
                  }).sort((a, b) => {
                    // Sort by year first, then by month in descending order
                    if (b.year !== a.year) {
                      return b.year - a.year;
                    } else {
                      return new Date(Date.parse(b.month + " 1, 2020")) - new Date(Date.parse(a.month + " 1, 2020"));
                    }
                  });

                  if (filteredTargetDetails.length === 0) return null;

                  return (
                    <React.Fragment key={employee._id}>
                      <tr onClick={() => toggleEmployeeDetails(employee._id)} style={{ cursor: 'pointer' }}>
                        <td>{employee.ename}</td>

                        <td>{filteredTargetDetails.length}</td>

                        <td>₹ {new Intl.NumberFormat('en-IN').format(
                          filteredTargetDetails.reduce((total, obj) => total + parseFloat(obj.amount || 0), 0)
                        )}</td>

                        <td>₹ {new Intl.NumberFormat('en-IN').format(
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
                            <th style={{backgroundColor: "#e0e0e0", color: "#000"}}></th>
                            <th style={{backgroundColor: "#e0e0e0", color: "#000"}}>{perData.month}-{perData.year}</th>
                            <th style={{backgroundColor: "#e0e0e0", color: "#000"}}>₹ {perData.amount || 0}</th>
                            <th style={{backgroundColor: "#e0e0e0", color: "#000"}}>₹ {perData.achievedAmount || 0}</th>
                            <th style={{backgroundColor: "#e0e0e0", color: "#000"}}>{perData.ratio.toFixed(2) || 0}%</th>
                            <th style={{backgroundColor: "#e0e0e0", color: "#000"}}>{perData.result || '-'}</th>
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