import React from 'react'




function EmployeesProjectionSummary() {
const [followDataToday, setfollowDataToday] = useState([]);
  const [followDataTodayNew, setfollowDataTodayNew] = useState([]);
  const [followDataFilter, setFollowDataFilter] = useState([])
  const [followDataNew, setFollowDataNew] = useState([])
  const [followData, setfollowData] = useState([]);
  const [searchTermProjection, setSearchTermProjection] = useState("")
  const [selectedDateRange, setSelectedDateRange] = useState([]);
  const [projectionNames, setProjectionNames] = useState([])
  
  //-----------------------------------fetching function follow up data-----------------------------------


  const fetchFollowUpData = async () => {
    try {
      const response = await fetch(`${secretKey}/projection-data`);
      const followdata = await response.json();
      setfollowData(followdata);
      setFollowDataFilter(followdata)
      setFollowDataNew(followdata)
      //console.log("followdata", followdata)
      setfollowDataToday(
        followdata
          .filter((company) => {
            // Assuming you want to filter companies with an estimated payment date for today
            const today = new Date().toISOString().split("T")[0]; // Get today's date in the format 'YYYY-MM-DD'
            return company.estPaymentDate === today;
          })
      );
      setfollowDataTodayNew(
        followdata
          .filter((company) => {
            // Assuming you want to filter companies with an estimated payment date for today
            const today = new Date().toISOString().split("T")[0]; // Get today's date in the format 'YYYY-MM-DD'
            return company.estPaymentDate === today;
          })
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      return { error: "Error fetching data" };
    }
  };

  useEffect(() => {
    fetchFollowUpData();
  }, []);


//--------------------filter branch office function--------------------------------------
const handleFilterBranchOffice = (branchName) => {
    // Filter the followdataToday array based on branchName
    if (branchName === "none") {
      setfollowDataToday(followData);
      setEmployeeDataProjectionSummary(employeeDataFilter)

    } else {
      //console.log("yahan chala")
      const filteredFollowData = followData.filter((obj) =>
        employeeData.some((empObj) => empObj.branchOffice === branchName && empObj.ename === obj.ename)
      );

      const filteredemployeedata = employeeInfo.filter(obj => obj.branchOffice === branchName)


      setfollowDataToday(filteredFollowData);
      setEmployeeDataProjectionSummary(filteredemployeedata)

      //console.log(filteredemployeedata)
    }
  };

//---------------------filter particular bde ---------------------------------------

  const filterSearchProjection = (searchTerm) => {
    setSearchTermProjection(searchTerm)
    const fileteredData = followData.filter((company) => company.ename.toLowerCase().includes(searchTerm.toLowerCase()))
    const filteredEmployee = employeeDataFilter.filter((company) => company.ename.toLowerCase().includes(searchTerm.toLowerCase()))
    setfollowDataToday(fileteredData)
    setEmployeeData(filteredEmployee)
  }
  const debouncedFilterSearchProjection = debounce(filterSearchProjection, 100);

  //-------------------------date -range filter function-------------------------------------------

  const handleSelect = (values) => {
    // Extract startDate and endDate from the values array
    const startDate = values[0];
    const endDate = values[1];

    // Filter followData based on the selected date range
    const filteredDataDateRange = followData.filter((product) => {
      const productDate = new Date(product["estPaymentDate"]);

      // Check if the productDate is within the selected date range
      return productDate >= startDate && productDate <= endDate;
    });

    // Set the startDate, endDate, and filteredDataDateRange states
    setStartDate(startDate);
    setEndDate(endDate);
    setFilteredDataDateRange(filteredDataDateRange);
  };

  useEffect(() => {
    // Filter followData based on the selected date range
    const filteredDataDateRange = followData.filter((product) => {
      const productDate = new Date(product["estPaymentDate"]);

      // Convert productDate to the sameformat as startDate and endDate
      const formattedProductDate = dayjs(productDate).startOf("day");
      const formattedStartDate = startDate
        ? dayjs(startDate).startOf("day")
        : null;
      const formattedEndDate = endDate ? dayjs(endDate).endOf("day") : null;

      // Check if the formatted productDate is within the selected date range
      if (
        formattedStartDate &&
        formattedEndDate &&
        formattedStartDate.isSame(formattedEndDate)
      ) {
        // If both startDate and endDate are the same, filter for transactions on that day
        return formattedProductDate.isSame(formattedStartDate);
      } else if (formattedStartDate && formattedEndDate) {
        // If different startDate and endDate, filter within the range
        return (
          formattedProductDate >= formattedStartDate &&
          formattedProductDate <= formattedEndDate
        );
      } else {
        // If either startDate or endDate is null, return false
        return false;
      }
    });

    setfollowDataToday(filteredDataDateRange);
  }, [startDate, endDate]);

  //-----------------------------------filter multiple employee selection function----------------------------------
  

  const handleSelectProjectionSummary = (selectedEmployeeNames) => {
    const filteredProjectionData = followData.filter((company) => selectedEmployeeNames.includes(company.ename))
    const filteredEmployees = employeeDataFilter.filter((company) => selectedEmployeeNames.includes(company.ename))

    if (filteredProjectionData.length > 0 || filteredEmployees.length > 0) {
      setfollowDataToday(filteredProjectionData);
      setEmployeeDataProjectionSummary(filteredEmployees)
    } else if (filteredProjectionData.length === 0 || filteredEmployees.length === 0) {
      setfollowDataToday(followDataTodayNew)
      setEmployeeDataProjectionSummary(employeeDataFilter)
    }
  };
  

 // -------------------------------------sorting projection summary-------------------------------------------
 const uniqueEnames = [...new Set(followDataToday.map((item) => item.ename))];

 const [sortTypeProjection, setSortTypeProjection] = useState({
   totalCompanies: "ascending",
 });
 const [sortTypeServices, setSortTypeServices] = useState({
   offeredServices: "ascending",
 });

 const [sortTypePrice, setSortTypePrice] = useState({
   offeredPrice: "ascending",
 });

 const [sortTypeExpectedPayment, setSortTypeExpectedPayment] = useState({
   expectedPayment: "ascending",
 });

 const handleSortTotalCompanies = (newSortType) => {
   setSortTypeProjection(newSortType);
 };

 const handleSortOfferedServices = (newSortType) => {
   setSortTypeServices(newSortType);
 };

 const handleSortOffredPrize = (newSortType) => {
   setSortTypePrice(newSortType);
 };

 const handleSortExpectedPayment = (newSortType) => {
   //console.log(newSortType);
   setSortTypeExpectedPayment(newSortType);
 };
 const sortedData = uniqueEnames.slice().sort((a, b) => {
   // Sorting logic for total companies
   if (sortTypeProjection === "ascending") {
     return (
       followDataToday.filter((partObj) => partObj.ename === a).length -
       followDataToday.filter((partObj) => partObj.ename === b).length
     );
   } else if (sortTypeProjection === "descending") {
     return (
       followDataToday.filter((partObj) => partObj.ename === b).length -
       followDataToday.filter((partObj) => partObj.ename === a).length
     );
   }

   // Sorting logic for offered services
   if (sortTypeServices === "ascending") {
     return (
       followDataToday.reduce((totalServicesA, partObj) => {
         if (partObj.ename === a) {
           totalServicesA += partObj.offeredServices.length;
         }
         return totalServicesA;
       }, 0) -
       followDataToday.reduce((totalServicesB, partObj) => {
         if (partObj.ename === b) {
           totalServicesB += partObj.offeredServices.length;
         }
         return totalServicesB;
       }, 0)
     );
   } else if (sortTypeServices === "descending") {
     return (
       followDataToday.reduce((totalServicesB, partObj) => {
         if (partObj.ename === b) {
           totalServicesB += partObj.offeredServices.length;
         }
         return totalServicesB;
       }, 0) -
       followDataToday.reduce((totalServicesA, partObj) => {
         if (partObj.ename === a) {
           totalServicesA += partObj.offeredServices.length;
         }
         return totalServicesA;
       }, 0)
     );
   }
   if (sortTypePrice === "ascending") {
     return (
       followDataToday.reduce((totalOfferedPriceA, partObj) => {
         if (partObj.ename === a) {
           totalOfferedPriceA += partObj.offeredPrize;
         }
         return totalOfferedPriceA;
       }, 0) -
       followDataToday.reduce((totalOfferedPriceB, partObj) => {
         if (partObj.ename === b) {
           totalOfferedPriceB += partObj.offeredPrize;
         }
         return totalOfferedPriceB;
       }, 0)
     );
   } else if (sortTypePrice === "descending") {
     return (
       followDataToday.reduce((totalOfferedPriceB, partObj) => {
         if (partObj.ename === b) {
           totalOfferedPriceB += partObj.offeredPrize;
         }
         return totalOfferedPriceB;
       }, 0) -
       followDataToday.reduce((totalOfferedPriceA, partObj) => {
         if (partObj.ename === a) {
           totalOfferedPriceA += partObj.offeredPrize;
         }
         return totalOfferedPriceA;
       }, 0)
     );
   }
   // Sorting logic for expected amount
   if (sortTypeExpectedPayment === "ascending") {
     return (
       followDataToday.reduce((totalExpectedPaymentA, partObj) => {
         if (partObj.ename === a) {
           totalExpectedPaymentA += partObj.totalPayment;
         }
         return totalExpectedPaymentA;
       }, 0) -
       followDataToday.reduce((totalExpectedPaymentB, partObj) => {
         if (partObj.ename === b) {
           totalExpectedPaymentB += partObj.totalPayment;
         }
         return totalExpectedPaymentB;
       }, 0)
     );
   } else if (sortTypeExpectedPayment === "descending") {
     return (
       followDataToday.reduce((totalExpectedPaymentB, partObj) => {
         if (partObj.ename === b) {
           totalExpectedPaymentB += partObj.totalPayment;
         }
         return totalExpectedPaymentB;
       }, 0) -
       followDataToday.reduce((totalExpectedPaymentA, partObj) => {
         if (partObj.ename === a) {
           totalExpectedPaymentA += partObj.totalPayment;
         }
         return totalExpectedPaymentA;
       }, 0)
     );
   }

   // If sortType is "none", return original order
   return 0;
 });


  return (
    <div>
          <div className="employee-dashboard mt-3"
                    id="projectionsummaryadmin"   >
                    <div className="card">
                      <div className="card-header p-1 employeedashboard d-flex align-items-center justify-content-between">
                        <div className="dashboard-title pl-1"  >
                          <h2 className="m-0">
                            Projection Summary
                          </h2>
                        </div>
                        <div className="d-flex align-items-center pr-1">
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
                        </div>
                      </div>
                      <div className="card-body">
                        <div id="table-default" className="row tbl-scroll" >
                          <table className="table-vcenter table-nowrap admin-dash-tbl"  >
                            <thead className="admin-dash-tbl-thead">
                              <tr>
                                <th>
                                  Sr. No
                                </th>
                                <th>Employee Name</th>
                                <th>
                                  Total Companies
                                  <SwapVertIcon
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
                                  />
                                </th>
                                <th>
                                  Offered Services
                                  <SwapVertIcon
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
                                  />
                                </th>
                                <th>
                                  Total Offered Price
                                  <SwapVertIcon
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
                                  />
                                </th>
                                <th>
                                  Expected Amount
                                  <SwapVertIcon
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
                                  />
                                </th>
                                {/* <th>Est. Payment Date</th> */}
                              </tr>
                            </thead>
                            <tbody>
                              {sortedData && sortedData.length !== 0 ? (
                                <>
                                  {sortedData.map((obj, index) => (
                                    <tr key={`row-${index}`}>
                                      <td>{index + 1}</td>
                                      <td>{obj}</td>
                                      <td>
                                        {
                                          followDataToday.filter(
                                            (partObj) => partObj.ename === obj
                                          ).length
                                        }
                                        <FcDatabase
                                          onClick={() => {
                                            functionOpenProjectionTable(obj);
                                          }}
                                          style={{
                                            cursor: "pointer",
                                            marginRight: "-71px",
                                            marginLeft: "58px",
                                          }}
                                        />
                                      </td>
                                      <td>
                                        {followDataToday.reduce(
                                          (totalServices, partObj) => {
                                            if (partObj.ename === obj) {
                                              totalServices += partObj.offeredServices.length;
                                            }
                                            return totalServices;
                                          },
                                          0
                                        )}
                                      </td>
                                      <td>
                                        {followDataToday
                                          .reduce((totalOfferedPrize, partObj) => {
                                            if (partObj.ename === obj) {
                                              totalOfferedPrize += partObj.offeredPrize;
                                            }
                                            return totalOfferedPrize;
                                          }, 0)
                                          .toLocaleString("en-IN", numberFormatOptions)}
                                      </td>
                                      <td>
                                        {followDataToday
                                          .reduce((totalPaymentSum, partObj) => {
                                            if (partObj.ename === obj) {
                                              totalPaymentSum += partObj.totalPayment;
                                            }
                                            return totalPaymentSum;
                                          }, 0)
                                          .toLocaleString("en-IN", numberFormatOptions)}
                                      </td>
                                    </tr>
                                  ))}
                                  {/* Map employeeData with default fields */}
                                  {employeeDataProjectionSummary
                                    .filter((employee) => (employee.designation === "Sales Executive") && !sortedData.includes(employee.ename)) // Filter out enames already included in sortedData
                                    .map((employee, index) => (
                                      <tr key={`employee-row-${index}`}>
                                        <td>{sortedData.length + index + 1}</td>
                                        <td>{employee.ename}</td>
                                        <td>0 <FcDatabase
                                          onClick={() => {
                                            functionOpenProjectionTable(employee.ename);
                                          }}
                                          style={{
                                            cursor: "pointer",
                                            marginRight: "-71px",
                                            marginLeft: "58px",
                                          }}
                                        /></td>
                                        <td>0</td>
                                        <td>0</td>
                                        <td>0</td>
                                      </tr>
                                    ))}
                                </>
                              ) : (
                                employeeDataProjectionSummary
                                  .filter((employee) => !sortedData.includes(employee.ename)) // Filter out enames already included in sortedData
                                  .map((employee, index) => (

                                    <tr key={`employee-row-${index}`}>
                                      <td>{index + 1}</td>
                                      <td>{employee.ename}</td>
                                      <td>0 <FcDatabase
                                        onClick={() => {
                                          functionOpenProjectionTable(employee.ename);
                                        }}
                                        style={{
                                          cursor: "pointer",
                                          marginRight: "-71px",
                                          marginLeft: "58px",
                                        }}
                                      /></td>
                                      <td>0</td>
                                      <td>0</td>
                                      <td>0</td>
                                    </tr>

                                  ))
                              )}
                            </tbody>
                            <tfoot className="admin-dash-tbl-tfoot"    >
                              <tr style={{ fontWeight: 500 }}>
                                <td colSpan="2">
                                  Total
                                </td>
                                <td>
                                  {
                                    followDataToday.filter((partObj) => partObj.ename)
                                      .length
                                  }
                                  <FcDatabase
                                    onClick={() => {
                                      functionCompleteProjectionTable();
                                    }}
                                    style={{
                                      cursor: "pointer",
                                      marginRight: "-71px",
                                      marginLeft: "55px",
                                    }}
                                  />
                                </td>
                                <td>
                                  {followDataToday.reduce(
                                    (totalServices, partObj) => {
                                      totalServices += partObj.offeredServices.length;
                                      return totalServices;
                                    },
                                    0
                                  )}
                                </td>
                                <td>
                                  {followDataToday
                                    .reduce((totalOfferedPrize, partObj) => {
                                      totalOfferedPrize += partObj.offeredPrize;
                                      return totalOfferedPrize;
                                    }, 0)
                                    .toLocaleString("en-IN", numberFormatOptions)}
                                </td>
                                <td>
                                  {followDataToday
                                    .reduce((totalPaymentSum, partObj) => {
                                      totalPaymentSum += partObj.totalPayment;
                                      return totalPaymentSum;
                                    }, 0)
                                    .toLocaleString("en-IN", numberFormatOptions)}
                                </td>
                              </tr>
                            </tfoot>
                            {((sortedData && sortedData.length === 0) && employeeData.length === 0) && (
                              <tbody>
                                <tr>
                                  <td className="particular" colSpan={9}>
                                    <Nodata />
                                  </td>
                                </tr>
                              </tbody>
                            )}
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
    </div>
  )
}

export default EmployeesProjectionSummary