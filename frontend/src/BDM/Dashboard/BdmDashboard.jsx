import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import Header from '../Components/Header/Header.jsx'
import Navbar from '../Components/Navbar/Navbar.jsx';
import axios from "axios";
import { debounce } from "lodash";
import Select from "react-select";

function BdmDashboard() {
  const { userId } = useParams();
  const [data, setData] = useState([])
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const frontendKey = process.env.REACT_APP_FRONTEND_KEY;
  //const bdmName = localStorage.getItem("bdmName")
  const [forwardEmployeeData, setForwardEmployeeData] = useState([])
  const [forwardEmployeeDataFilter, setForwardEmployeeDataFilter] = useState([])
  const [forwardEmployeeDataNew, setForwardEmployeeDataNew] = useState([])



  const fetchData = async () => {
    try {
      const response = await axios.get(`${secretKey}/einfo`);

      // Set the retrieved data in the state
      const tempData = response.data;
      const userData = tempData.find((item) => item._id === userId);
      console.log(tempData);
      setData(userData);
      setForwardEmployeeData(tempData.filter((employee) => (employee.designation === "Sales Executive" || employee.designation === "Sales Manager") && employee.branchOffice === "Sindhu Bhawan"))
      setForwardEmployeeDataFilter(tempData.filter((employee) => (employee.designation === "Sales Executive" || employee.designation === "Sales Manager") && employee.branchOffice === "Sindhu Bhawan"))
      setForwardEmployeeDataNew(tempData.filter((employee) => (employee.designation === "Sales Executive" || employee.designation === "Sales Manager") && employee.branchOffice === "Sindhu Bhawan"))
      //setmoreFilteredData(userData);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    fetchData()

  }, [])

  const [moreEmpData, setmoreEmpData] = useState([])
  const [tempData, setTempData] = useState([]);
  const [teamLeadsDataFilter, setTeamLeadsDataFilter] = useState([])

  const fetchNewData = async () => {
    try {
      const response = await axios.get(`${secretKey}/employees/${data.ename}`);
      const tempData = response.data;
      setTempData(tempData);
      setmoreEmpData(tempData)
    } catch (error) {
      console.error("Error fetching new data:", error);
    }
  };

  useEffect(() => {
    fetchNewData();
    fetchRedesignedBookings();
  }, [data]);

  function formatDateNow(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }

  const [teamLeadsData, setTeamLeadsData] = useState([])
  const [teamData, setTeamData] = useState([])

  const fetchTeamLeadsData = async () => {

    try {
      const response = await axios.get(`${secretKey}/forwardedbybdedata/${data.ename}`)
      setTeamLeadsData(response.data)
      setTeamData(response.data)

    } catch (error) {
      console.log("Error fetching data", error.message)
    }
  }

  const [companyData, setCompanyData] = useState([]);
  const [companyDataFilter, setCompanyDataFilter] = useState([]);

  const fetchCompanyData = async () => {
    fetch(`${secretKey}/leads`)
      .then((response) => response.json())
      .then((data) => {
        setCompanyData(data.filter((obj) => obj.ename !== "Not Alloted"));
        setCompanyDataFilter(data.filter((obj) => obj.ename !== "Not Alloted"));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    // Call the fetchData function when the component mounts
    fetchCompanyData()
  }, []);

  console.log(teamLeadsData)

  useEffect(() => {
    fetchTeamLeadsData()
  }, [data.ename])

  const [followDataToday, setfollowDataToday] = useState([]);
  const [followDataTodayFilter, setfollowDataTodayFilter] = useState([]);
  const [FollowData, setfollowData] = useState([]);
  const [followData, setFollowData] = useState([]);
  const [followDataFilter, setFollowDataFilter] = useState([]);
  const [followDataNew, setFollowDataNew] = useState([])

  const fetchFollowUpData = async () => {
    try {
      const response = await fetch(
        `${secretKey}/projection-data/${data.ename}`
      );
      const followdata = await response.json();
      setfollowData(followdata);
      setFollowDataFilter(followdata);
      setfollowDataToday(
        followdata.filter((company) => {
          // Assuming you want to filter companies with an estimated payment date for today
          const today = new Date().toISOString().split("T")[0]; // Get today's date in the format 'YYYY-MM-DD'
          return company.estPaymentDate === today;
        })
      );
      setfollowDataTodayFilter(
        followdata.filter((company) => {
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
  }, [data]);

  const [redesignedData, setRedesignedData] = useState([]);

  const fetchRedesignedBookings = async () => {
    try {
      const response = await axios.get(
        `${secretKey}/redesigned-final-leadData`
      );
      const bookingsData = response.data;


      setRedesignedData(bookingsData.filter(obj => obj.bdeName === data.ename || (obj.bdmName === data.ename && obj.bdmType === "Close-by")));
    } catch (error) {
      console.log("Error Fetching Bookings Data", error);
    }
  };

  const [selectedMonthOption, setSelectedMonthOption] = useState("")
  const [selectedMonthOptionForBdm, setSelectedMonthOptionForBdm] = useState("")

  const monthOptions = [
    { value: 'current_month', label: 'Current Month' },
    { value: 'last_month', label: 'Last Month' },
    { value: 'total', label: 'Total' }
  ];


  const filterTeamLeadsDataByMonth = (teamData, followData, selectedMonthOption) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    let filteredTeamData = [];
    let filteredFollowData = [];

    switch (selectedMonthOption) {
      case 'current_month':
        filteredTeamData = teamData.filter(obj => {
          const objDate = new Date(obj.bdeForwardDate);
          return objDate.getMonth() === currentMonth && objDate.getFullYear() === currentYear;
        });
        filteredFollowData = followDataFilter.filter(obj => {
          const objDate = new Date(obj.estPaymentDate);
          return objDate.getMonth() === currentMonth && objDate.getFullYear() === currentYear;
        });
        break;
      case 'last_month':
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = lastMonth === 11 ? currentYear - 1 : currentYear;
        filteredTeamData = teamData.filter(obj => {
          const objDate = new Date(obj.bdeForwardDate);
          return objDate.getMonth() === lastMonth && objDate.getFullYear() === lastMonthYear;
        });
        filteredFollowData = followDataFilter.filter(obj => {
          const objDate = new Date(obj.estPaymentDate);
          return objDate.getMonth() === lastMonth && objDate.getFullYear() === lastMonthYear;
        })
        break;
      case 'total':
        filteredTeamData = teamData;
        filteredFollowData = followData;
        break;
      default:
        filteredTeamData = teamData;
        filteredFollowData = followData;
        break;
    }

    return { filteredTeamData, filteredFollowData };
  };

  const handleChangeForBdm = (selectedOption) => {
    console.log(selectedOption);
    setSelectedMonthOptionForBdm(selectedOption.value);

    if (selectedOption === "current_month" || selectedOption === "last_month") {
      const { filteredTeamData, filteredFollowData } = filterTeamLeadsDataByMonth(teamLeadsData, followDataFilter, selectedOption);
      setTeamData(filteredTeamData);
      setFollowData(filteredFollowData);
    } else {
      // Handle 'total' case
      // If 'total', no need to filter, so you can directly set the team data
      setTeamData(teamLeadsData);
      setFollowData(followDataFilter);
    }
  }


  const filterMoreEmpDataDataByMonth = (tempData, followDataFilter, selectedMonthOption) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    let filteredMoreEmpData = [];
    let filteredFollowData = [];

    switch (selectedMonthOption) {
      case 'current_month':
        filteredMoreEmpData = tempData.filter(obj => {
          const objDate = new Date(obj.bdeForwardDate);
          return objDate.getMonth() === currentMonth && objDate.getFullYear() === currentYear;
        });
        filteredFollowData = followDataFilter.filter(obj => {
          const objDate = new Date(obj.estPaymentDate);
          return objDate.getMonth() === currentMonth && objDate.getFullYear() === currentYear;
        });
        break;
      case 'last_month':
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = lastMonth === 11 ? currentYear - 1 : currentYear;
        filteredMoreEmpData = tempData.filter(obj => {
          const objDate = new Date(obj.bdeForwardDate);
          return objDate.getMonth() === lastMonth && objDate.getFullYear() === lastMonthYear;
        });
        filteredFollowData = followDataFilter.filter(obj => {
          const objDate = new Date(obj.estPaymentDate);
          return objDate.getMonth() === lastMonth && objDate.getFullYear() === lastMonthYear
        })
        break;
      case 'total':
        filteredMoreEmpData = tempData;
        filteredFollowData = followDataFilter;
        break;
      default:
        filteredMoreEmpData = tempData;
        filteredFollowData = followDataFilter;
        break;
    }

    return { filteredMoreEmpData, filteredFollowData };
  };

  const handleChange = (selectedOption) => {
    console.log(selectedOption);
    setSelectedMonthOptionForBdm(selectedOption.value);

    if (selectedOption === "current_month" || selectedOption === "last_month") {
      const { filteredMoreEmpData, filteredFollowData } = filterMoreEmpDataDataByMonth(tempData, followDataFilter, selectedOption);
      setmoreEmpData(filteredMoreEmpData);
      setFollowData(filteredFollowData);
    } else {
      // Handle 'total' case
      // If 'total', no need to filter, so you can directly set the team data
      setmoreEmpData(tempData);
      setFollowData(followDataFilter);
    }
  }

  function functionCalculateGeneratedRevenue(isBdm) {

    let generatedRevenue = 0;
    const requiredObj = moreEmpData.filter((obj) => formatDateNow(obj.bdmStatusChangeDate) === new Date().toISOString().slice(0, 10) && (obj.bdmAcceptStatus === "Accept") && obj.Status === "Matured");
    requiredObj.forEach((object) => {
      const newObject = isBdm ? redesignedData.find(value => value["Company Name"] === object["Company Name"] && value.bdmName === data.ename) : redesignedData.find(value => value["Company Name"] === object["Company Name"] && value.bdeName === data.ename);
      if (newObject) {
        generatedRevenue = generatedRevenue + newObject.generatedReceivedAmount;
      }

    });

    return generatedRevenue;
    //  const generatedRevenue =  redesignedData.reduce((total, obj) => total + obj.receivedAmount, 0);
    //  console.log("This is generated Revenue",requiredObj);

  }

  function functionCalculateGeneratedTotalRevenue(isBdm) {
    let generatedRevenue = 0;
    const requiredObj = moreEmpData.filter((obj) => (obj.bdmAcceptStatus === "Accept") && obj.Status === "Matured");
    requiredObj.forEach((object) => {
      const newObject = isBdm ? redesignedData.find(value => value["Company Name"] === object["Company Name"] && value.bdmName === data.ename) : redesignedData.find(value => value["Company Name"] === object["Company Name"] && value.bdeName === data.ename);
      if (newObject) {
        generatedRevenue = generatedRevenue + newObject.generatedReceivedAmount;
      }

    });

    return generatedRevenue;
    //  const generatedRevenue =  redesignedData.reduce((total, obj) => total + obj.receivedAmount, 0);
    //  console.log("This is generated Revenue",requiredObj);

  }

  const [selectedValue, setSelectedValue] = useState("")

  const handleFilterForwardCaseBranchOffice = (branchName) => {

    console.log(branchName)

    if (branchName === "none") {
      setForwardEmployeeData(forwardEmployeeDataFilter)
      setCompanyData(companyDataFilter)
      setfollowData(followDataFilter)
      setTeamLeadsData(teamLeadsDataFilter)
    } else {
      const filteredData = forwardEmployeeDataNew.filter(obj => obj.branchOffice === branchName);

      //console.log("kuch to h" , filteredData , followDataFilter)

      const filteredFollowDataforwarded = followDataFilter.filter((obj) =>
        forwardEmployeeDataNew.some((empObj) =>
          empObj.branchOffice === branchName &&
          (empObj.ename === obj.bdeName)
        )
      );



      //console.log(filteredFollowData)


      const filteredCompanyData = companyDataFilter.filter(obj => (
        (obj.bdmAcceptStatus === "Pending" || obj.bdmAcceptStatus === "Accept") &&
        forwardEmployeeDataNew.some(empObj => empObj.branchOffice === branchName && empObj.ename === obj.ename)
      ));

      const filteredTeamLeadsData = teamLeadsDataFilter.filter((obj) => forwardEmployeeDataNew.some((empObj) => empObj.branchOffice === branchName && (empObj.ename === obj.ename || empObj.ename === obj.bdmName)))


      setForwardEmployeeData(filteredData)
      setCompanyData(filteredCompanyData)
      setfollowData(filteredFollowDataforwarded)
      setFollowDataNew(filteredFollowDataforwarded)
      setTeamLeadsData(filteredTeamLeadsData)
    }
  }


  const debouncedFilterSearchForwardData = debounce(filterSearchForwardData, 100);
  const [searchTermForwardData, setSearchTermForwardData] = useState("")


  // Modified filterSearch function with debounce
  function filterSearchForwardData(searchTerm) {
    setSearchTermForwardData(searchTerm);

    setForwardEmployeeData(
      forwardEmployeeDataFilter.filter((company) =>
        company.ename.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    setCompanyData(
      companyDataFilter.filter(
        (obj) =>
          (obj.bdmAcceptStatus === "Pending" || obj.bdmAcceptStatus === "Accept") &&
          forwardEmployeeDataNew.some((empObj) => (obj.ename === empObj.ename) &&
            empObj.ename.toLowerCase().includes(searchTerm.toLowerCase())
          )
      )
    );

    setTeamLeadsData(
      teamLeadsDataFilter.filter((obj) =>
        forwardEmployeeDataNew.some(
          (empObj) =>
            (obj.bdmName === empObj.ename) &&
            empObj.ename.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
    // setfollowData(
    //   followDataFilter.filter(obj =>
    //     forwardEmployeeDataNew.some(empObj =>
    //       (empObj.ename === obj.ename || empObj.bdeName === obj.ename) &&
    //       (empObj.ename.toLowerCase().includes(searchTerm.toLowerCase()) || empObj.bdeName.toLowerCase().includes(searchTerm.toLowerCase()))
    //     )
    //   )
    // );

  }

  //console.log("followData", followData, followDataFilter)

  const [selectedValues, setSelectedValues] = useState([]);

  const options = forwardEmployeeDataNew.map((obj) => ({ value: obj.ename, label: obj.ename }));

  console.log("options", options);

  const handleSelectForwardedEmployeeData = (selectedEmployeeNames) => {
    console.log(selectedEmployeeNames, "selected employees");
    // Assuming you have forwardEmployeeDataFilter, companyDataFilter, and teamLeadsDataFilter defined somewhere

    const filteredForwardEmployeeData = forwardEmployeeDataFilter.filter((company) =>
      selectedEmployeeNames.includes(company.ename)
    );

    setForwardEmployeeData(filteredForwardEmployeeData);

    const filteredCompanyData = companyDataFilter.filter(
      (obj) =>
        (obj.bdmAcceptStatus === "Pending" || obj.bdmAcceptStatus === "Accept") &&
        forwardEmployeeDataNew.some((empObj) => empObj.ename === obj.ename && selectedEmployeeNames.includes(empObj.ename))
    );

    setCompanyData(filteredCompanyData);

    const filteredTeamLeadsData = teamLeadsDataFilter.filter((obj) =>
      selectedEmployeeNames.includes(obj.bdmName)
    );

    setTeamLeadsData(filteredTeamLeadsData);
  };



  return (
    <div>
      <Header bdmName={data.ename} />
      <Navbar userId={userId} />
      <div className="as-bde-bdm-daSH mt-4 mb-2">
        <div className="container-xl">
          <div className="as-bde-bdm-daSH-inner">
            <ul class="nav nav-tabs" id="myTab" role="tablist">
              {data.bdmWork && (<li class="nav-item" role="presentation">
                <button class="nav-link active" id="receivedAsBDM-tab" data-bs-toggle="tab" data-bs-target="#receivedAsBDM" type="button" role="tab" aria-controls="receivedAsBDM" aria-selected="false">
                  Recieved as BDM cases report
                </button>
              </li>)}
            </ul>
            <div class="tab-content" id="myTabContent">


              {/* ------------------------recieved as bdm report------------------------------------------- */}

              <div class="tab-pane fade show active" id="receivedAsBDM" role="tabpanel" aria-labelledby="receivedAsBDM-tab">
                <div className="mt-3 mb-3">
                  <div className="row m-0">
                    <div className="dashboard-headings">
                      <h3 className="m-0">Today's Report</h3>
                    </div>
                    {/* recieved bdm report today */}
                    <div className="col-lg-2 col-md-4 col-sm-6 col-12">
                      <div className="dash-card-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="dash-card-2-head">TOTAL</div>
                          <div className="dash-card-2-body">
                            <div className="dash-card-2-num">
                              {teamData.filter((obj) => formatDateNow(obj.bdeForwardDate) === new Date().toISOString().slice(0, 10)).length}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2 mb-2 col-md-4 col-sm-6 col-12">
                      <div className="dash-card-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="dash-card-2-head">GENERAL</div>
                          <div className="dash-card-2-body">
                            <div className="dash-card-2-num">
                              {teamData.filter((obj) => formatDateNow(obj.bdeForwardDate) === new Date().toISOString().slice(0, 10) && obj.bdmStatus === "Untouched").length}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2 col-md-4 col-sm-6 col-12">
                      <div className="dash-card-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="dash-card-2-head">INTERESTED</div>
                          <div className="dash-card-2-body">
                            <div className="dash-card-2-num">
                              {teamData.filter((obj) => formatDateNow(obj.bdmStatusChangeDate) === new Date().toISOString().slice(0, 10) && obj.bdmStatus === "Interested").length}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2 col-md-4 col-sm-6 col-12">
                      <div className="dash-card-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="dash-card-2-head">FOLLOW UP</div>
                          <div className="dash-card-2-body">
                            <div className="dash-card-2-num">
                              {teamData.filter((obj) => formatDateNow(obj.bdmStatusChangeDate) === new Date().toISOString().slice(0, 10) && obj.bdmStatus === "FollowUp").length}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2 col-md-4 col-sm-6 col-12">
                      <div className="dash-card-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="dash-card-2-head">MATURED</div>
                          <div className="dash-card-2-body">
                            <div className="dash-card-2-num">
                              {teamData.filter((obj) => formatDateNow(obj.bdmStatusChangeDate) === new Date().toISOString().slice(0, 10) && obj.bdmStatus === "Matured").length}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2 col-md-4 col-sm-6 col-12">
                      <div className="dash-card-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="dash-card-2-head">NOT INTERESTED</div>
                          <div className="dash-card-2-body">
                            <div className="dash-card-2-num">
                              {teamData.filter((obj) => formatDateNow(obj.bdmStatusChangeDate) === new Date().toISOString().slice(0, 10) && obj.bdmStatus === "Not Interested").length}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2 col-md-4 col-sm-6 col-12">
                      <div className="dash-card-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="dash-card-2-head">PROJECTED REVENUE</div>
                          <div className="dash-card-2-body">
                            <div className="dash-card-2-num">
                              ₹{(followDataToday
                                .filter(obj => obj.ename === data.ename)
                                .reduce((total, obj) => total + obj.totalPayment, 0)).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2 col-md-4 col-sm-6 col-12">
                      <div className="dash-card-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="dash-card-2-head">GENERATED REVENUE</div>
                          <div className="dash-card-2-body">
                            <div className="dash-card-2-num">
                              ₹ {functionCalculateGeneratedRevenue(true).toLocaleString()}
                              {/* ₹{(redesignedData.reduce((total, obj) => total + obj.receivedAmount, 0)).toLocaleString()} */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 mb-3">
                  <div className="row m-0">
                    <div className="d-flex align-items-center justify-content-between p-0">
                      <div className="dashboard-headings ">
                        <h3 className="m-0">Total Report</h3>
                      </div>
                      <div className="pr-1">
                        <select className="pr-2"
                          style={{
                            border: "none",
                            outline: "none",

                          }}
                          value={monthOptions.find(option => option.value === selectedMonthOption)}
                          onChange={(e) => handleChangeForBdm(e.target.value)}
                        >
                          <option disabled value="">Select...</option>
                          {monthOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>

                        {/* <Select
                            options={monthOptions}
                            placeholder="Select..."
                            onChange={handleChangeForBdm}
                            value={monthOptions.find(option => option.value === selectedMonthOptionForBdm)}
                          /> */}
                      </div>
                    </div>



                    {/* recieved bdm report total */}
                    <div className="col-lg-2 col-md-4 col-sm-6 col-12">
                      <div className="dash-card-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="dash-card-2-head">TOTAL</div>
                          <div className="dash-card-2-body">
                            <div className="dash-card-2-num">
                              {teamData.length}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2 mb-2 col-md-4 col-sm-6 col-12">
                      <div className="dash-card-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="dash-card-2-head">GENERAL</div>
                          <div className="dash-card-2-body">
                            <div className="dash-card-2-num">
                              {teamData.filter((obj) => obj.bdmStatus === "Untouched").length}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2 col-md-4 col-sm-6 col-12">
                      <div className="dash-card-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="dash-card-2-head">INTERESTED</div>
                          <div className="dash-card-2-body">
                            <div className="dash-card-2-num">
                              {teamData.filter((obj) => obj.bdmStatus === "Interested").length}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2 col-md-4 col-sm-6 col-12">
                      <div className="dash-card-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="dash-card-2-head">FOLLOW UP</div>
                          <div className="dash-card-2-body">
                            <div className="dash-card-2-num">
                              {teamData.filter((obj) => obj.bdmStatus === "FollowUp").length}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2 col-md-4 col-sm-6 col-12">
                      <div className="dash-card-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="dash-card-2-head">MATURED</div>
                          <div className="dash-card-2-body">
                            <div className="dash-card-2-num">
                              {teamData.filter((obj) => obj.bdmStatus === "Matured").length}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2 col-md-4 col-sm-6 col-12">
                      <div className="dash-card-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="dash-card-2-head">NOT INTERESTED</div>
                          <div className="dash-card-2-body">
                            <div className="dash-card-2-num">
                              {teamData.filter((obj) => obj.bdmStatus === "Not Interested").length}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2 col-md-4 col-sm-6 col-12">
                      <div className="dash-card-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="dash-card-2-head">PROJECTED REVENUE</div>
                          <div className="dash-card-2-body">
                            <div className="dash-card-2-num">
                              ₹{(FollowData
                                .filter(obj => (obj.ename === data.ename) && obj.bdeName)
                                .reduce((total, obj) => total + obj.totalPayment, 0)).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2 col-md-4 col-sm-6 col-12">
                      <div className="dash-card-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="dash-card-2-head">GENERATED REVENUE</div>
                          <div className="dash-card-2-body">
                            <div className="dash-card-2-num">
                              ₹ {functionCalculateGeneratedTotalRevenue(true).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='container-xl'>
        <div className="employee-dashboard">
          <div className="card">
            <div className="card-header employeedashboard d-flex align-items-center justify-content-between">
              <div className="d-flex justify-content-between">
                <div
                  style={{ minWidth: "14vw" }}
                  className="dashboard-title"
                >
                  <h2 style={{ marginBottom: "5px" }}>
                    Employees Forwaded Data Report
                  </h2>
                </div>
              </div>
              <div className="d-flex gap-2">
                <div className="general-searchbar form-control d-flex justify-content-center align-items-center input-icon mt-1">
                  <span className="input-icon-addon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon"
                      width="20"
                      height="24"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="currentColor"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path
                        stroke="none"
                        d="M0 0h24v24H0z"
                        fill="none"
                      />
                      <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                      <path d="M21 21l-6 -6" />
                    </svg>
                  </span>
                  <input
                    value={searchTermForwardData}
                    onChange={(e) =>
                      debouncedFilterSearchForwardData(e.target.value)
                    }
                    placeholder="Enter BDE Name..."
                    style={{
                      border: "none",
                      padding: "0px 0px 0px 21px",
                      width: "100%",
                    }}
                    type="text"
                    name="bdeName-search"
                    id="bdeName-search"
                  />
                </div>
                {/* <div
                  style={{ m: 1, padding: "0px" }}
                  className="filter-booking d-flex align-items-center"
                >
                  <div className="filter-main">
                    <select
                      className="form-select mt-1"
                      id={`branch-filter`}
                      value={selectedValue}
                      onChange={(e) => {
                        setSelectedValue(e.target.value)
                        handleFilterForwardCaseBranchOffice(e.target.value)
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
                </div> */}
                {/* <LocalizationProvider
                            dateAdapter={AdapterDayjs}
                            style={{ padding: "0px" }}
                          >
                            <DemoContainer
                              components={["SingleInputDateRangeField"]}
                            >
                              <DateRangePicker
                                onChange={(values) => {
                                  const startDateEmp = moment(values[0]).format(
                                    "DD/MM/YYYY"
                                  );
                                  const endDateEmp = moment(values[1]).format(
                                    "DD/MM/YYYY"
                                  );
                                  setSelectedDateRangeEmployee([
                                    startDateEmp,
                                    endDateEmp,
                                  ]);
                                  handleSelectEmployee(values); // Call handleSelect with the selected values
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
                          </LocalizationProvider> */}
                {/* <div>
                            <select className="form-select mt-1" 
                              onChange={(e) => {
                                handleSelectForwardedEmployeeData(e.target.value); // You missed passing the value to the function
                              }}>
                              <option disabled value="">Select...</option>
                              {forwardEmployeeDataNew.map((obj) => (
                                <option key={obj.id} value={obj.ename}>
                                  {obj.ename}
                                </option>
                              ))}
                            </select>
                          </div> */}
                <div className="services mt-1 mr-3" style={{ zIndex: "9999" }}>
                  <Select
                    isMulti
                    options={options}
                    onChange={(selectedOptions) => {
                      setSelectedValues(selectedOptions.map((option) => option.value));
                      const selectedEmployeeNames = selectedOptions.map((option) => option.label);
                      handleSelectForwardedEmployeeData(selectedEmployeeNames);
                    }}
                    value={selectedValues.map((value) => ({ value, label: value }))}
                    placeholder="Select..."
                  />
                </div>
              </div>
            </div>
            <div className='card-body'>
              <div className="row"
                style={{
                  overflowX: "auto",
                  overflowY: "auto",
                  maxHeight: "60vh",
                  lineHeight: "32px",
                }}>
                <table style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  border: "1px solid #ddd",
                  marginBottom: "5px",
                  lineHeight: "32px",
                  position: "relative", // Make the table container relative
                }}
                  className="table-vcenter table-nowrap">
                  <thead style={{
                    position: "sticky", // Make the header sticky
                    top: "-1px", // Stick it at the top
                    backgroundColor: "#ffb900",
                    color: "black",
                    fontWeight: "bold",
                    zIndex: 1, // Ensure it's above other content
                  }}>
                    <tr>
                      <th style={{
                        lineHeight: "32px",
                      }}>
                        Sr.No
                      </th>
                      <th>BDE/BDM Name</th>
                      <th >Branch Name</th>
                      <th >Forwarded Cases</th>
                      <th >Recieved Cases</th>
                      <th >Forwarded Case Projection</th>
                      <th >Recieved Case Projection</th>
                      <th >Matured Case</th>
                      <th>Generated Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {forwardEmployeeData.length !== 0 &&
                      forwardEmployeeData.map((obj, index) => (
                        <tr key={`row-${index}`}>
                          <td style={{
                            lineHeight: "32px",
                            color: "black",
                            textDecoration: "none",
                          }} >{index + 1}</td>
                          <td >{obj.ename}</td>
                          <td>{obj.branchOffice}</td>
                          <td >
                            {companyData.filter((company) => company.ename === obj.ename && (company.bdmAcceptStatus === "Pending" || company.bdmAcceptStatus === "Accept")).length}
                          </td>
                          <td >
                            {teamLeadsData.filter((company) => company.bdmName === obj.ename).length}
                          </td>
                          <td>₹{(FollowData
                            .filter(company => company.bdeName === obj.ename)
                            .reduce((total, obj) => total + obj.totalPayment, 0)).toLocaleString()}</td>

                          <td>₹{followDataNew
                            .filter(company => company.ename === obj.ename && company.bdeName)
                            .reduce((total, obj) => total + obj.totalPayment, 0).toLocaleString()
                          }</td>

                          <td>
                            {companyData.filter((company) => company.ename === obj.ename && company.bdmAcceptStatus === "Accept" && company.Status === "Matured").length}
                          </td>
                          <td>₹ {functionCalculateGeneratedTotalRevenue(obj.ename).toLocaleString()}</td>
                        </tr>
                      ))}
                  </tbody>

                  <tfoot
                    style={{
                      position: "sticky", // Make the footer sticky
                      bottom: -1, // Stick it at the bottom
                      backgroundColor: "#f6f2e9",
                      color: "black",
                      fontWeight: 500,
                      zIndex: 2, // Ensure it's above the content
                    }}
                  >
                    <tr style={{ fontWeight: 500 }}>
                      <td
                        style={{ lineHeight: "32px" }}
                        colSpan="3"
                      >
                        Total
                      </td>
                      <td>
                        {companyData.filter(company =>
                          (company.bdmAcceptStatus === "Pending" || company.bdmAcceptStatus === "Accept") &&
                          forwardEmployeeDataNew.some(empObj => empObj.branchOffice === "Sindhu Bhawan" && company.ename === empObj.ename)
                        ).length}

                      </td>
                      <td>
                      {teamLeadsData.filter(obj =>
                          forwardEmployeeDataNew.some(empObj => empObj.branchOffice === "Sindhu Bhawan" || (obj.ename === empObj.ename && obj.bdmName === empObj.ename))
                        ).length}

                      </td>
                      <td>₹{companyData
                        .filter(company => company.bdmAcceptStatus === "Accept" || company.bdmAcceptStatus === "Pending")
                        .reduce((total, company) => {
                          const totalPayment = followData
                            .filter(followCompany => followCompany.companyName === company["Company Name"] && followCompany.bdeName)
                            .reduce((sum, obj) => sum + obj.totalPayment, 0);
                          return total + totalPayment;
                        }, 0)
                      }
                      </td>
                      <td>
                        ₹{companyData
                          .filter(company => company.bdmAcceptStatus === "Accept")
                          .reduce((total, company) => {
                            const totalPayment = followDataNew
                              .filter(followCompany => followCompany.companyName === company["Company Name"])
                              .reduce((sum, obj) => sum + obj.totalPayment, 0);
                            return total + totalPayment;
                          }, 0)
                        }
                      </td>
                      <td>
                        {companyData.filter(company => company.bdmAcceptStatus === "Accept" && company.Status === "Matured").length}
                      </td>
                      <td>
                        -
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>



    </div>
  )
}

export default BdmDashboard