import React from 'react'
import { debounce } from "lodash";

function EmployeesThisMonthBooking() {
    const [employeeData, setEmployeeData] = useState([])
    const[employeeDataFilter , setEmployeeDataFilter] = useState([])
    const[employeeInfo , setEmployeeInfo] = useState([])


    //----------------------fetching employee info----------------------------------------
    const fetchEmployeeInfo = async () => {
        fetch(`${secretKey}/einfo`)
          .then((response) => response.json())
          .then((data) => {
            setEmployeeData(data.filter((employee) => employee.designation === "Sales Executive" || employee.designation === "Sales Manager"));
            setEmployeeDataFilter(data.filter((employee) => employee.designation === "Sales Executive" || employee.designation === "Sales Manager"));
            setEmployeeInfo(data.filter((employee) => employee.designation === "Sales Executive" || employee.designation === "Sales Manager"))
            // setEmployeeDataFilter(data.filter)
          })
          .catch((error) => {
            console.error(`Error Fetching Employee Data `, error);
          });
      };

      const debounceDelay = 300;
      const debouncedFetchEmployeeInfo = debounce(fetchEmployeeInfo, debounceDelay);

      const uniqueBDEobjects =
    employeeData.length !== 0 &&
    uniqueBDE.size !== 0 &&
    employeeData.filter((obj) => Array.from(uniqueBDE).includes(obj.ename));

      useEffect(()=>{
        fetchEmployeeInfo()

      },[])

      // ------------------------------------------------------- Redesigned Total Bookings Functions ------------------------------------------------------------------
  let totalMaturedCount = 0;
  let totalTargetAmount = 0;
  let totalAchievedAmount = 0;
  const currentYear = new Date().getFullYear();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentMonth = monthNames[new Date().getMonth()];

  const functionCalculateMatured = (bdeName) => {
    let maturedCount = 0;
    redesignedData.map((mainBooking) => {

      if (monthNames[new Date(mainBooking.bookingDate).getMonth()] === currentMonth) {
        if (mainBooking.bdeName === bdeName || mainBooking.bdmName === bdeName) {
          if (mainBooking.bdeName === mainBooking.bdmName) {
            maturedCount = maturedCount + 1
          } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Close-by") {
            maturedCount = maturedCount + 0.5;
          } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Supported-by") {
            if (mainBooking.bdeName === bdeName) {
              maturedCount = maturedCount + 1;
            }
          }
        }
      }
      mainBooking.moreBookings.map((moreObject) => {
        if (monthNames[new Date(moreObject.bookingDate).getMonth()] === currentMonth) {
          if (moreObject.bdeName === bdeName || moreObject.bdmName === bdeName) {
            if (moreObject.bdeName === moreObject.bdmName) {
              maturedCount = maturedCount + 1;
            } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Close-by") {
              maturedCount = maturedCount + 0.5
            } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Supported-by") {
              if (moreObject.bdeName === bdeName) {
                maturedCount = maturedCount + 1;
              }
            }
          }
        }
      })


    })
    totalMaturedCount = totalMaturedCount + maturedCount;
    return maturedCount;
  };


  const functionCalculateAchievedAmount = (bdeName) => {
    let achievedAmount = 0;
    let remainingAmount = 0;
    let expanse = 0;
    redesignedData.map((mainBooking)=>{
     
      if(monthNames[new Date(mainBooking.bookingDate).getMonth()] === currentMonth){
        if(mainBooking.bdeName === bdeName || mainBooking.bdmName === bdeName){
          
          if(mainBooking.bdeName === mainBooking.bdmName){
            achievedAmount = achievedAmount + Math.round(mainBooking.generatedReceivedAmount);
           
            mainBooking.services.map(serv=>{
              // console.log(serv.expanse , bdeName ,"this is services");
              expanse = serv.expanse ?  expanse + serv.expanse : expanse;
            });
          }else if(mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Close-by"){
            achievedAmount = achievedAmount + Math.round(mainBooking.generatedReceivedAmount)/2;
            mainBooking.services.map(serv=>{
              expanse = serv.expanse ?  expanse + serv.expanse : expanse;
            })
          }else if(mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Supported-by"){
            if(mainBooking.bdeName === bdeName){
              achievedAmount += Math.round(mainBooking.generatedReceivedAmount);
              mainBooking.services.map(serv=>{

                expanse = serv.expanse ?  expanse + serv.expanse : expanse;
              })
            }
          }
        }
        
      }else if(mainBooking.remainingPayments.length !== 0){
        mainBooking.remainingPayments.map((remainingObj)=>{
          if(monthNames[new Date(remainingObj.paymentDate).getMonth()] === currentMonth && (mainBooking.bdeName === bdeName || mainBooking.bdmName === bdeName)){
            const findService = mainBooking.services.find((services) => services.serviceName === remainingObj.serviceName)
            const tempAmount = findService.withGST ? Math.round(remainingObj.receivedPayment) / 1.18 : Math.round(remainingObj.receivedPayment);
            if (mainBooking.bdeName === mainBooking.bdmName) {
              remainingAmount += Math.round(tempAmount);
            } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Close-by") {
              remainingAmount += Math.round(tempAmount) / 2;
            } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Supported-by") {
              if (mainBooking.bdeName === bdeName) {
                remainingAmount += Math.round(tempAmount);
              }
            }
          }
        })
      }
        mainBooking.moreBookings.map((moreObject)=>{
          if(monthNames[new Date(moreObject.bookingDate).getMonth()] === currentMonth){
            if(moreObject.bdeName === bdeName || moreObject.bdmName === bdeName){
              if(moreObject.bdeName === moreObject.bdmName){
                achievedAmount = achievedAmount + Math.round(moreObject.generatedReceivedAmount);
                moreObject.services.map(serv=>{
                  expanse = serv.expanse ?  expanse + serv.expanse : expanse;
                })
              }else if(moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Close-by"){
                achievedAmount = achievedAmount + Math.round(moreObject.generatedReceivedAmount)/2;
                moreObject.services.map(serv=>{
                  expanse = serv.expanse ?  expanse + serv.expanse : expanse;
                })
              }else if(moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Supported-by"){
                if(moreObject.bdeName === bdeName){
                  achievedAmount += Math.round(moreObject.generatedReceivedAmount);
                  moreObject.services.map(serv=>{
                    expanse = serv.expanse ?  expanse + serv.expanse : expanse;
                  })
                }
              }
            }
          }else if(moreObject.remainingPayments.length!==0){
           
            moreObject.remainingPayments.map((remainingObj)=>{
              if(monthNames[new Date(remainingObj.paymentDate).getMonth()] === currentMonth && (moreObject.bdeName === bdeName || moreObject.bdmName === bdeName)){
                
                const findService = moreObject.services.find((services) => services.serviceName === remainingObj.serviceName)
                const tempAmount = findService.withGST ? Math.round(remainingObj.receivedPayment) / 1.18 : Math.round(remainingObj.receivedPayment);
                if(moreObject.bdeName === moreObject.bdmName){
                    remainingAmount += Math.round(tempAmount);
                }else if(moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Close-by"){
                  remainingAmount += Math.round(tempAmount)/2;
                }else if(moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Supported-by"){
                  if(moreObject.bdeName === bdeName){
                    remainingAmount += Math.round(tempAmount);
                  }
                }         
              }
            })
          }
        })
      
        
      
    })
    totalAchievedAmount =
      Math.round(totalAchievedAmount) + Math.round(achievedAmount) + Math.round(remainingAmount);
      console.log(bdeName , "ka expanse :-", expanse)

    return achievedAmount + Math.round(remainingAmount) - expanse;
  };

  const functionGetAmount = (object) => {
    if (object.targetDetails.length !== 0) {
      const foundObject = object.targetDetails.find(
        (item) =>
          Math.round(item.year) === currentYear && item.month === currentMonth
      );
      totalTargetAmount =
        foundObject &&
        Math.round(totalTargetAmount) + Math.round(foundObject.amount);
    
      return foundObject ? foundObject.amount : 0;
    } else {
      return 0;
    }
  };

  function functionGetLastBookingDate(bdeName) {
    let tempBookingDate = null;
    // Filter objects based on bdeName
    redesignedData.map((mainBooking) => {

      if (monthNames[new Date(mainBooking.bookingDate).getMonth()] === currentMonth) {
        if (mainBooking.bdeName === bdeName || mainBooking.bdmName === bdeName) {
          const bookingDate = new Date(mainBooking.bookingDate);
          tempBookingDate = bookingDate > tempBookingDate ? bookingDate : tempBookingDate;
        }
      }
      mainBooking.moreBookings.map((moreObject) => {
        if (monthNames[new Date(moreObject.bookingDate).getMonth()] === currentMonth) {
          if (moreObject.bdeName === bdeName || moreObject.bdmName === bdeName) {
            const bookingDate = new Date(moreObject.bookingDate);
            tempBookingDate = bookingDate > tempBookingDate ? bookingDate : tempBookingDate;
          }
        }
      })


    })
    return tempBookingDate ? formatDateFinal(tempBookingDate) : "No Booking";
  }

  let generatedTotalRevenue = 0;


  function functionCalculateGeneratedTotalRevenue(ename) {
    const filterData = bdeResegnedData.filter(obj => obj.bdeName === ename || (obj.bdmName === ename && obj.bdmType === "Close-by"));
    let generatedRevenue = 0;
    const requiredObj = companyData.filter((obj) => (obj.bdmAcceptStatus === "Accept") && obj.Status === "Matured");
    requiredObj.forEach((object) => {
      const newObject = filterData.find(value => value["Company Name"] === object["Company Name"] && value.bdeName === ename);
      if (newObject) {
        generatedRevenue = generatedRevenue + newObject.generatedReceivedAmount;
      }

    });
    generatedTotalRevenue = generatedTotalRevenue + generatedRevenue;
    return generatedRevenue;


  }

  return (
    <div>{/*------------------------------------------------------ Bookings Dashboard ------------------------------------------------------------ */}
    <div className="employee-dashboard mt-2">
      <div className="card todays-booking totalbooking" id="totalbooking"   >
        <div className="card-header employeedashboard d-flex align-items-center justify-content-between p-1">
          <div className="dashboard-title">
            <h2 className="m-0 pl-1">
              This Month's Bookings
            </h2>
          </div>
          <div className="filter-booking d-flex align-items-center">
            <div className="filter-booking mr-1 d-flex align-items-center" >
              <div className="filter-title">
                <h2 className="m-0 mr-2">
                  {" "}
                  Filter Branch : {"  "}
                </h2>
              </div>
              <div className="filter-main ml-2">
                <select
                  className="form-select"
                  id={`branch-filter`}
                  onChange={(e) => {
                    if (e.target.value === "none") {
                      setEmployeeData(employeeDataFilter)
                    } else {
                      setEmployeeData(employeeDataFilter.filter(obj => obj.branchOffice === e.target.value))
                    }

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
            <div class='input-icon mr-1'>
              <span class="input-icon-addon">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
                  <path d="M21 21l-6 -6"></path>
                </svg>
              </span>
              <input
                value={searchBookingBde}
                onChange={(e) => {
                  setSearchBookingBde(e.target.value)
                  debouncedFilterSearchThisMonthBookingBde(e.target.value)
                }}
                className="form-control"
                placeholder="Enter BDE Name..."
                type="text"
                name="bdeName-search"
                id="bdeName-search" />
            </div>
            <div className="data-filter">
              <LocalizationProvider
                dateAdapter={AdapterDayjs} >
                <DemoContainer
                  components={["SingleInputDateRangeField"]} sx={{
                    padding: '0px',
                    with: '220px'
                  }}  >
                  <DateRangePicker className="form-control my-date-picker form-control-sm p-0"
                    onChange={(values) => {
                      const startDateEmp = moment(values[0]).format(
                        "DD/MM/YYYY"
                      );
                      const endDateEmp = moment(values[1]).format(
                        "DD/MM/YYYY"
                      );
                      // setSelectedDateRangeForwardedEmployee([
                      //   startDateEmp,
                      //   endDateEmp,
                      // ]);
                      handleThisMonthBookingDateRange(values); // Call handleSelect with the selected values
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
                  value={monthBookingPerson}
                  onChange={(event) => {
                    setMonthBookingPerson(event.target.value)
                    handleSelectThisMonthBookingEmployees(event.target.value)
                  }}
                  input={<OutlinedInput label="Name" />}
                  MenuProps={MenuProps}
                >
                  {options.map((name) => (
                    <MenuItem
                      key={name}
                      value={name}
                      style={getStyles(name,monthBookingPerson, theme)}
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
          <div className="row tbl-scroll">
            <table className="table-vcenter table-nowrap admin-dash-tbl">
              <thead className="admin-dash-tbl-thead">
                <tr  >
                  <th>SR.NO</th>
                  <th>BDE/BDM NAME</th>
                  <th>BRANCH</th>
                  <th>MATURED CASES</th>
                  <th>TARGET AMOUNT</th>
                  <th>ACHIEVED AMOUNT</th>
                  <th>TARGET/ACHIEVED RATIO</th>
                  <th>LAST BOOKING DATE</th>
                </tr>
              </thead>
              {uniqueBDEobjects ? (
                <>
                  <tbody>
                    {employeeData &&
                      employeeData
                        .filter(
                          (item) =>
                            item.designation ===
                            "Sales Executive" &&
                            item.targetDetails.length !== 0 && item.targetDetails.find(target => target.year === (currentYear).toString() && target.month === (currentMonth.toString()))
                        )
                        .map((obj, index) => (
                          <>
                            <tr>
                              <td>{index + 1}</td>
                              <td>
                                {obj.ename}
                              </td>
                              <td>{obj.branchOffice}</td>
                              <td>
                                {functionCalculateMatured(
                                  obj.ename
                                )}
                              </td>
                              <td>
                                ₹{" "}
                                {Math.round(
                                  functionGetAmount(obj)
                                ).toLocaleString()}
                              </td>
                              <td>
                                ₹{" "}
                                {functionCalculateAchievedAmount(
                                  obj.ename
                                ).toLocaleString()}
                              </td>
                              <td>
                                {" "}
                                {(
                                  (functionCalculateAchievedAmount(
                                    obj.ename
                                  ) /
                                    functionGetAmount(obj)) *
                                  100
                                ).toFixed(2)}{" "}
                                %
                              </td>
                              <td>
                                {functionGetLastBookingDate(
                                  obj.ename
                                )}
                              </td>
                            </tr>
                          </>
                        ))}
                  </tbody>
                  <tfoot className="admin-dash-tbl-tfoot">
                    <tr>
                      <td
                        colSpan={2}

                      >
                        Total:
                      </td>
                      <td>-</td>
                      <td>
                        {" "}
                        {totalMaturedCount.toLocaleString()}
                      </td>
                      <td>
                        ₹{" "}
                        {(totalTargetAmount / 2).toLocaleString()}
                      </td>
                      <td>
                        ₹{" "}
                        {(
                          totalAchievedAmount / 2
                        ).toLocaleString()}
                      </td>
                      <td>
                        {(
                          (totalAchievedAmount /
                            totalTargetAmount) *
                          100
                        ).toFixed(2)}{" "}
                        %
                      </td>
                      <td>-</td>
                    </tr>
                  </tfoot>
                </>
              ) : (
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
    </div></div>
  )
}

export default EmployeesThisMonthBooking