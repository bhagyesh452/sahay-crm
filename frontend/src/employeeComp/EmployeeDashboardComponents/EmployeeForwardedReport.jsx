import React, { useEffect, useState, CSSProperties, useRef } from "react";
import Header from "../../components/Header.js";
import EmpNav from "../EmpNav.js";
import axios from "axios";
import { useParams } from "react-router-dom";
import { options } from "../../components/Options.js";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import Swal from "sweetalert2";
import Select from "react-select";
import Nodata from "../../components/Nodata";
import { IoFileTrayFullOutline } from "react-icons/io5";
import { CiViewList } from "react-icons/ci";
import { MdImportantDevices } from "react-icons/md";
import { LiaAlgolia } from "react-icons/lia";
import { LiaClipboardCheckSolid } from "react-icons/lia";
import { RiFileCloseLine } from "react-icons/ri";

function EmployeeForwardedReport() {
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const { userId } = useParams();






  //--------------date formats-----------------------------------
  function formatDateNow(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }
  //--------------fetching employee data---------------------------

  const [data, setData] = useState([])
  const fetchData = async () => {
    try {
      const response = await axios.get(`${secretKey}/employee/einfo`)
      const userData = response.data.find((item) => item._id === userId);
      setData(userData)
    } catch (error) {
      console.log("Error fetching employee info", error.message)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])


  //--------------------- fetching company data ---------------------
  const [tempData, setTempData] = useState([])
  const [moreEmpData, setmoreEmpData] = useState([])
  const fetchNewData = async () => {
    try {
      const response = await axios.get(`${secretKey}/company-data/employees/${data.ename}`)
      setTempData(response.data)
      setmoreEmpData(response.data)
    } catch (error) {
      console.error('Error fetching new data', error)
    }
  }

  useEffect(() => {
    fetchNewData()
  }, [data])

  //--------------------fetching follow data------------------------------

  const [followDataToday, setfollowDataToday] = useState([]);
  const [followDataTodayFilter, setfollowDataTodayFilter] = useState([]);
  const [followData, setFollowData] = useState([]);
  const [followDataFilter, setFollowDataFilter] = useState([]);
  const [projectionLoading, setprojectionLoading] = useState(false);

  const fetchFollowUpData = async () => {

    try {
      setprojectionLoading(true);
      const response = await fetch(
        `${secretKey}/projection/projection-data/${data.ename}`
      );
      const followdata = await response.json();
      //console.log(followdata)
      setFollowData(followdata);
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
    } finally {
      setprojectionLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowUpData()
  }, [data])

  //------------------fetch RedesignedData-----------------------------------
  const [redesignedData, setRedesignedData] = useState([]);
  const [permanentFormData, setPermanentFormData] = useState([]);

  const fetchRedesignedBookings = async () => {
    try {
      const response = await axios.get(
        `${secretKey}/bookings/redesigned-final-leadData`
      );
      const bookingsData = response.data;


      setRedesignedData(bookingsData.filter(obj => obj.bdeName === data.ename || (obj.bdmName === data.ename && obj.bdmType === "Close-by") || (obj.moreBookings.length !== 0 && obj.moreBookings.some((more) => more.bdeName === data.ename || more.bdmName === data.ename))));
      setPermanentFormData(bookingsData.filter(obj => obj.bdeName === data.ename || (obj.bdmName === data.ename && obj.bdmType === "Close-by") || (obj.moreBookings.length !== 0 && obj.moreBookings.some((more) => more.bdeName === data.ename || more.bdmName === data.ename))));
    } catch (error) {
      console.log("Error Fetching Bookings Data", error);
    }
  };

  useEffect(() => {
    fetchRedesignedBookings()
  }, [data])

  //----------------fetching team leads data---------------------------------
  const [teamLeadsData, setTeamLeadsData] = useState([])
  const [teamData, setTeamData] = useState([])

  const fetchTeamLeadsData = async () => {
    try {
      const response = await axios.get(`${secretKey}/bdm-data/forwardedbybdedata/${data.ename}`)
      setTeamLeadsData(response.data)
      setTeamData(response.data)
    } catch (error) {
      console.log("Error fetching team leads data", error.message)
    }
  }

  useEffect(() => {
    fetchTeamLeadsData()
  }, [data.ename])

  //--------------- function to filter followDataToday -----------------------

  const handleFilterFollowDataToday = (isBdm) => {
    const today = new Date()
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    if (selectedMonthOption === 'Today') {
      const filterFollowDataForwarded = isBdm ? followData.filter((company) => 
        new Date(company.estPaymentDate).getDate() === today.getDate() && company.bdmName !== data.ename && company.caseType === "Forwarded") : followDataToday.filter((company) => company.caseType === "Forwarded")
      const filterFollowDataRecieved = isBdm ? followDataToday.filter((company) => company.estPaymentDate === today && company.bdmName !== data.ename && company.caseType === "Recieved") : followDataToday.filter((company) => company.caseType === "Recieved")
      const totalPaymentForwarded = filterFollowDataForwarded.reduce((total, obj) => total + obj.totalPayment, 0)
      const totalPaymentRecieved = filterFollowDataRecieved.reduce((total, obj) => total + obj.totalPayment / 2, 0)
      const finalPayment = totalPaymentForwarded + totalPaymentRecieved
      return finalPayment.toLocaleString();

    } else if (selectedMonthOption === 'This Month') {
      const filterFollowDataForwarded = isBdm ? followData.filter((company) =>
        new Date(company.estPaymentDate).getMonth() === currentMonth &&
        new Date(company.estPaymentDate).getFullYear() === currentYear &&
        company.bdmName !== data.ename && company.caseType === "Forwarded")
        : followData.filter((company) =>
          new Date(company.estPaymentDate).getMonth() === currentMonth &&
          new Date(company.estPaymentDate).getFullYear() === currentYear &&
          company.caseType === "Forwarded")
      const filterFollowDataRecieved = isBdm ? followDataToday.filter((company) =>
        new Date(company.estPaymentDate).getMonth() === currentMonth &&
        new Date(company.estPaymentDate).getFullYear() === currentYear &&
        company.bdmName !== data.ename && company.caseType === "Recieved")
        : followData.filter((company) =>
          new Date(company.estPaymentDate).getMonth() === currentMonth &&
          new Date(company.estPaymentDate).getFullYear() === currentYear &&
          company.caseType === "Recieved")
      const totalPaymentForwarded = filterFollowDataForwarded.reduce((total, obj) => total + obj.totalPayment, 0)
      const totalPaymentRecieved = filterFollowDataRecieved.reduce((total, obj) => total + obj.totalPayment / 2, 0)
      const finalPayment = totalPaymentForwarded + totalPaymentRecieved
      return finalPayment.toLocaleString();
    } else if (selectedMonthOption === 'Last Month') {
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = lastMonth === 11 ? currentYear - 1 : currentYear;
      const filterFollowDataForwarded = isBdm ? followData.filter((company) =>
        new Date(company.estPaymentDate).getMonth() === lastMonth &&
        new Date(company.estPaymentDate).getFullYear() === lastMonthYear &&
        company.bdmName !== data.ename && company.caseType === "Forwarded")
        : followData.filter((company) =>
          new Date(company.estPaymentDate).getMonth() === lastMonth &&
          new Date(company.estPaymentDate).getFullYear() === lastMonthYear &&
          company.caseType === "Forwarded")
      const filterFollowDataRecieved = isBdm ? followData.filter((company) =>
        new Date(company.estPaymentDate).getMonth() === lastMonth &&
        new Date(company.estPaymentDate).getFullYear() === lastMonthYear &&
        company.estPaymentDate === today && company.bdmName !== data.ename && company.caseType === "Recieved") : followData.filter((company) =>
          new Date(company.estPaymentDate).getMonth() === lastMonth &&
          new Date(company.estPaymentDate).getFullYear() === lastMonthYear &&
          company.caseType === "Recieved")
      const totalPaymentForwarded = filterFollowDataForwarded.reduce((total, obj) => total + obj.totalPayment, 0)
      const totalPaymentRecieved = filterFollowDataRecieved.reduce((total, obj) => total + obj.totalPayment / 2, 0)
      const finalPayment = totalPaymentForwarded + totalPaymentRecieved
      return finalPayment.toLocaleString();
    } else {
      return false;
    }
  }


  //---------------function to filter followdata-----------------------------

  const handleFilterFollowData = (isBdm) => {
    const filterFollowDataForwarded = isBdm ? followData.filter((company) => company.bdmName !== data.ename && company.caseType === "Forwarded") : followData.filter((company) => company.caseType === "Forwarded")
    const filterFollowDataRecieved = isBdm ? followData.filter((company) => company.bdmName !== data.ename && company.caseType === "Recieved") : followData.filter((company) => company.caseType === "Recieved")
    const totalPaymentForwarded = filterFollowDataForwarded.reduce((total, obj) => total + obj.totalPayment, 0)
    const totalPaymentRecieved = filterFollowDataRecieved.reduce((total, obj) => total + obj.totalPayment / 2, 0)
    const finalPayment = totalPaymentForwarded + totalPaymentRecieved

    return finalPayment.toLocaleString();
  }

  //---------------fucntion to filter follow data recieved case-----------------

  const handleFilterFollowDataRecievedCase = () => {

    const filterFollowDataRecieved = followData.filter((company) => company.bdmName === data.ename && company.caseType === "Recieved")
    const totalPaymentRecieved = filterFollowDataRecieved.reduce((total, obj) => total + obj.totalPayment / 2, 0)
    const finalPayment = totalPaymentRecieved
    //console.log(finalPayment)
    //console.log( filterFollowDataRecieved)

    return finalPayment.toLocaleString();
  }

  console.log(followData)

  //--------------function filter followdatatoday recieved case----------------
  const handleFilterFollowDataTodayRecievedCase = () => {
    const today = new Date()
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    if (selectedMonthOption === 'Today') {
      const filterFollowDataRecieved = followData.filter((company) => 
        new Date(company.estPaymentDate).getDate() === today.getDate() && company.bdmName === data.ename && company.caseType === "Recieved")
      console.log(filterFollowDataRecieved)
      const totalPaymentRecieved = filterFollowDataRecieved.reduce((total, obj) => total + obj.totalPayment / 2, 0)
      const finalPayment = totalPaymentRecieved
      return finalPayment.toLocaleString();

    } else if (selectedMonthOption === 'This Month') {
      const filterFollowDataRecieved = followData.filter((company) =>
        new Date(company.estPaymentDate).getMonth() === currentMonth &&
        new Date(company.estPaymentDate).getFullYear() === currentYear &&
        company.bdmName === data.ename && company.caseType === "Recieved")
      const totalPaymentRecieved = filterFollowDataRecieved.reduce((total, obj) => total + obj.totalPayment / 2, 0)
      const finalPayment = totalPaymentRecieved
      return finalPayment.toLocaleString();
    } else if (selectedMonthOption === 'Last Month') {
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = lastMonth === 11 ? currentYear - 1 : currentYear;
      const filterFollowDataRecieved = followData.filter((company) =>
        new Date(company.estPaymentDate).getMonth() === lastMonth &&
        new Date(company.estPaymentDate).getFullYear() === lastMonthYear &&
        company.bdmName === data.ename && company.caseType === "Recieved")
      const totalPaymentRecieved = filterFollowDataRecieved.reduce((total, obj) => total + obj.totalPayment / 2, 0)
      const finalPayment = totalPaymentRecieved
      return finalPayment.toLocaleString();
    }else{
      return false;
    }

  }
  //--------------function to calculate total generated revenue----------------

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

  //-----------------function to filter data on the basis of month-----------------------
  const [selectedMonthOption, setSelectedMonthOption] = useState("Today")
  const [filteredData, setFilteredData] = useState(moreEmpData);

  useEffect(() => {
    filterData(selectedMonthOption);
    filteredTeamData(selectedMonthOption)
  }, [selectedMonthOption, moreEmpData, teamData]);

  const filterData = (period) => {
    let filtered = [];
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

    if (period === 'Today') {
      filtered = moreEmpData.filter(
        (obj) => formatDateNow(obj.bdeForwardDate) === today.toISOString().slice(0, 10)
      );

    } else if (period === 'This Month') {
      filtered = moreEmpData.filter((obj) => {
        const objDate = new Date(obj.bdeForwardDate);
        return objDate >= firstDayOfMonth && objDate <= today;
      });
    } else if (period === 'Last Month') {
      const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      filtered = moreEmpData.filter((obj) => {
        const objDate = new Date(obj.bdeForwardDate);
        return objDate >= lastMonth && objDate <= lastDayOfLastMonth;
      });
    }

    setFilteredData(filtered);
  };

  const filterCategoryData = (category, period) => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

    if (period === 'Today') {
      return moreEmpData.filter(
        (obj) => formatDateNow(obj.bdmStatusChangeDate) === today.toISOString().slice(0, 10) && obj.Status === category
      );
    } else if (period === 'This Month') {
      return moreEmpData.filter((obj) => {
        const objDate = new Date(obj.bdmStatusChangeDate);
        return objDate >= firstDayOfMonth && objDate <= today && obj.Status === category;
      });
    } else if (period === 'Last Month') {
      const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      return moreEmpData.filter((obj) => {
        const objDate = new Date(obj.bdmStatusChangeDate);
        return objDate >= lastMonth && objDate <= lastDayOfLastMonth && obj.Status === category;
      });
    }

    return [];
  };

  //---------------- recieved case function------------------
  const [selectedOption, setSelectedOption] = useState("Forwarded")
  const [filteredTeamLeadData, setFilteredTeamLeadData] = useState(teamData)

  const filteredTeamData = (period) => {
    let filtered = []
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

    if (period === 'Today') {
      filtered = teamData.filter((obj) => formatDateNow(obj.bdeForwardDate) === today.toISOString().slice(0.10))
    } else if (period === 'This Month') {
      filtered = teamData.filter((obj) => new Date(obj.bdeForwardDate) >= firstDayOfMonth &&
        new Date(obj.bdeForwardDate) <= today)
    } else if (period === 'Last Month') {
      const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      filtered = teamData.filter((obj) => new Date(obj.bdeForwardDate) >= lastMonth &&
        new Date(obj.bdeForwardDate) <= lastDayOfLastMonth)
    }
    setFilteredTeamLeadData(filtered)
  }

  const filteredCategoryDataTeamLeads = (category, period) => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

    if (period === 'Today') {
      return teamData.filter(
        (obj) => formatDateNow(obj.bdmStatusChangeDate) === today.toISOString().slice(0, 10) && obj.Status === category
      );
    } else if (period === 'This Month') {
      return teamData.filter((obj) => {
        const objDate = new Date(obj.bdmStatusChangeDate);
        return objDate >= firstDayOfMonth && objDate <= today && obj.Status === category;
      });
    } else if (period === 'Last Month') {
      const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      return teamData.filter((obj) => {
        const objDate = new Date(obj.bdmStatusChangeDate);
        return objDate >= lastMonth && objDate <= lastDayOfLastMonth && obj.Status === category;
      });
    }

    return [];
  }



  return (
    <div>
      <div className="dash-card">
        <div className="dash-card-head d-flex align-items-center justify-content-between">
          <h2 className="m-0">
            <select class="head-select form-select" id="head-select" onChange={(e) => setSelectedOption(e.target.value)}>
              <option value="Forwarded" selected>Forwarded to BDM</option>
              <option value="Recieved" disabled={!data.bdmWork} >Received as BDM</option>
            </select>
          </h2>
          <div className="dash-select-filter">
            <select class="form-select form-select-sm my-filter-select"
              aria-label=".form-select-sm example"
              value={selectedMonthOption}
              onChange={(e) => (
                setSelectedMonthOption(e.target.value)
                //handleChange(e.target.value)
              )}
            >
              <option value="Today">Today</option>
              <option value="This Month">This Month</option>
              <option value="Last Month">Last Month</option>
            </select>
          </div>
        </div>
        {/* forwraded bdm case report */}
        {selectedOption === 'Forwarded' && (<div className="dash-card-body">
          <div className="row m-0 align-items-center">
            <div className="col-sm-7 p-0 align-self-stretch h-100">
              <div className="bdm-f-r-revenue h-100">
                <div className="bdm-f-r-revenue-projected">
                  <div className="roundImggreen">
                    <div className="roundImggreen-inner-text">
                      ₹{data.bdmWork ? `${handleFilterFollowDataToday(true)}` : `${handleFilterFollowDataToday()}`}
                    </div>
                  </div>
                  <div className="roundImggreen-text">Projected <br />Revenue</div>
                </div>
                <div className="bdm-f-r-revenue-generated">
                  <div className="roundImgOrg">
                    <div className="roundImgOrg-inner-text">₹ {functionCalculateGeneratedRevenue().toLocaleString()}/-</div>
                  </div>
                  <div className="roundImgOrg-text">Generated <br />Revenue</div>
                </div>
              </div>
            </div>
            <div className="col-sm-5 p-0 align-self-stretch">
              <div className="call-dr-names">
                <div className="call-dr-card d-flex align-items-center justify-content-between pl-0 pt-1 pr-0 pb-1">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="color-squre-dots clr-bg-light-1ac9bd clr-1ac9bd">
                      <CiViewList />
                    </div>
                    <div className="call-dr-name">
                      General
                    </div>
                  </div>
                  <div className="call-dr-num clr-1ac9bd" >
                    {/* {moreEmpData.filter((obj) => formatDateNow(obj.bdeForwardDate) === new Date().toISOString().slice(0, 10) && (obj.bdmAcceptStatus === "Pending")).length} */}
                    {filteredData.filter((obj) => obj.bdmAcceptStatus === 'Pending').length}
                  </div>
                </div>
                <div className="call-dr-card d-flex align-items-center justify-content-between pl-0 pt-1 pr-0 pb-1">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="color-squre-dots clr-bg-light-ffb900 clr-ffb900">
                      <MdImportantDevices />
                    </div>
                    <div className="call-dr-name">
                      Interested
                    </div>
                  </div>
                  <div className="call-dr-num clr-ffb900" >
                    {/* {moreEmpData.filter((obj) => formatDateNow(obj.bdmStatusChangeDate) === new Date().toISOString().slice(0, 10) && (obj.bdmAcceptStatus === "Pending" || obj.bdmAcceptStatus === "Accept") && obj.Status === "Interested").length} */}
                    {filterCategoryData('Interested', selectedMonthOption).filter((obj) => obj.bdmAcceptStatus === 'Pending' || obj.bdmAcceptStatus === 'Accept').length}
                  </div>
                </div>
                <div className="call-dr-card d-flex align-items-center justify-content-between pl-0 pt-1 pr-0 pb-1">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="color-squre-dots clr-bg-light-4299e1 clr-4299e1">
                      <LiaAlgolia />
                    </div>
                    <div className="call-dr-name">
                      Follow Up
                    </div>
                  </div>
                  <div className="call-dr-num clr-4299e1">
                    {/* {moreEmpData.filter((obj) => formatDateNow(obj.bdmStatusChangeDate) === new Date().toISOString().slice(0, 10) && (obj.bdmAcceptStatus === "Pending" || obj.bdmAcceptStatus === "Accept") && obj.Status === "FollowUp").length} */}
                    {filterCategoryData('FollowUp', selectedMonthOption).filter((obj) => obj.bdmAcceptStatus === 'Pending' || obj.bdmAcceptStatus === 'Accept').length}
                  </div>
                </div>
                <div className="call-dr-card d-flex align-items-center justify-content-between pl-0 pt-1 pr-0 pb-1">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="color-squre-dots clr-bg-light-1cba19 clr-1cba19">
                      <LiaClipboardCheckSolid />
                    </div>
                    <div className="call-dr-name">
                      Matured
                    </div>
                  </div>
                  <div className="call-dr-num clr-1cba19">
                    {/* {moreEmpData.filter((obj) => formatDateNow(obj.bdmStatusChangeDate) === new Date().toISOString().slice(0, 10) && (obj.bdmAcceptStatus === "Pending" || obj.bdmAcceptStatus === "Accept") && obj.Status === "Matured").length} */}
                    {filterCategoryData('Matured', selectedMonthOption).filter((obj) => obj.bdmAcceptStatus === 'Pending' || obj.bdmAcceptStatus === 'Accept').length}
                  </div>
                </div>
                <div className="call-dr-card d-flex align-items-center justify-content-between pl-0 pt-1 pr-0 pb-1">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="color-squre-dots clr-bg-light-e65b5b clr-e65b5b">
                      <RiFileCloseLine />
                    </div>
                    <div className="call-dr-name">
                      Not Interested
                    </div>
                  </div>
                  <div className="call-dr-num clr-e65b5b">
                    {filterCategoryData('Not Interested', selectedMonthOption).filter((obj) => obj.bdmAcceptStatus === 'Pending' || obj.bdmAcceptStatus === 'Accept').length}
                    {/* {moreEmpData.filter((obj) => formatDateNow(obj.bdmStatusChangeDate) === new Date().toISOString().slice(0, 10) && (obj.bdmAcceptStatus === "Pending" || obj.bdmAcceptStatus === "Accept") && obj.Status === "Not Interested").length} */}
                  </div>
                </div>
                <div className="call-dr-card d-flex align-items-center justify-content-between pl-0 pt-1 pr-0 pb-1">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="color-squre-dots clr-bg-light-00d19d clr-00d19d">
                      <IoFileTrayFullOutline />
                    </div>
                    <div className="call-dr-name">
                      Total
                    </div>
                  </div>
                  <div className="call-dr-num clr-00d19d">
                    {/* {moreEmpData.filter(
                      (obj) =>
                        formatDateNow(obj.bdeForwardDate) === new Date().toISOString().slice(0, 10) &&
                        obj.bdmAcceptStatus !== "NotForwarded"
                    ).length} */}
                    {filteredData.filter((obj) => obj.bdmAcceptStatus !== 'NotForwarded').length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>)}

        {/* recieved bdm case report */}
        {selectedOption === 'Recieved' && (<div className="dash-card-body">
          <div className="row m-0 align-items-center">
            <div className="col-sm-7 p-0 align-self-stretch h-100">
              <div className="bdm-f-r-revenue h-100">
                <div className="bdm-f-r-revenue-projected">
                  <div className="roundImggreen">
                    <div className="roundImggreen-inner-text">
                      ₹{handleFilterFollowDataTodayRecievedCase()}/-
                    </div>
                  </div>
                  <div className="roundImggreen-text">Projected <br />Revenue</div>
                </div>
                <div className="bdm-f-r-revenue-generated">
                  <div className="roundImgOrg">
                    <div className="roundImgOrg-inner-text">₹ {functionCalculateGeneratedRevenue(true).toLocaleString()}/-</div>
                  </div>
                  <div className="roundImgOrg-text">Generated <br />Revenue</div>
                </div>
              </div>
            </div>
            <div className="col-sm-5 p-0 align-self-stretch">
              <div className="call-dr-names">
                <div className="call-dr-card d-flex align-items-center justify-content-between pl-0 pt-1 pr-0 pb-1">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="color-squre-dots clr-bg-light-1ac9bd clr-1ac9bd">
                      <CiViewList />
                    </div>
                    <div className="call-dr-name">
                      General
                    </div>
                  </div>
                  <div className="call-dr-num clr-1ac9bd" >
                    {filteredTeamLeadData.filter((obj) => obj.bdmStatus === "Untouched").length}
                  </div>
                </div>
                <div className="call-dr-card d-flex align-items-center justify-content-between pl-0 pt-1 pr-0 pb-1">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="color-squre-dots clr-bg-light-ffb900 clr-ffb900">
                      <MdImportantDevices />
                    </div>
                    <div className="call-dr-name">
                      Interested
                    </div>
                  </div>
                  <div className="call-dr-num clr-ffb900" >
                    {filteredCategoryDataTeamLeads("Interested", selectedMonthOption).length}
                  </div>
                </div>
                <div className="call-dr-card d-flex align-items-center justify-content-between pl-0 pt-1 pr-0 pb-1">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="color-squre-dots clr-bg-light-4299e1 clr-4299e1">
                      <LiaAlgolia />
                    </div>
                    <div className="call-dr-name">
                      Follow Up
                    </div>
                  </div>
                  <div className="call-dr-num clr-4299e1">
                    {filteredCategoryDataTeamLeads("FollowUp", selectedMonthOption).length}
                  </div>
                </div>
                <div className="call-dr-card d-flex align-items-center justify-content-between pl-0 pt-1 pr-0 pb-1">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="color-squre-dots clr-bg-light-1cba19 clr-1cba19">
                      <LiaClipboardCheckSolid />
                    </div>
                    <div className="call-dr-name">
                      Matured
                    </div>
                  </div>
                  <div className="call-dr-num clr-1cba19">
                    {filteredCategoryDataTeamLeads("Matured", selectedMonthOption).length}
                  </div>
                </div>
                <div className="call-dr-card d-flex align-items-center justify-content-between pl-0 pt-1 pr-0 pb-1">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="color-squre-dots clr-bg-light-e65b5b clr-e65b5b">
                      <RiFileCloseLine />
                    </div>
                    <div className="call-dr-name">
                      Not Interested
                    </div>
                  </div>
                  <div className="call-dr-num clr-e65b5b">
                    {filteredCategoryDataTeamLeads('Not Interested', selectedMonthOption).length}
                  </div>
                </div>
                <div className="call-dr-card d-flex align-items-center justify-content-between pl-0 pt-1 pr-0 pb-1">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="color-squre-dots clr-bg-light-00d19d clr-00d19d">
                      <IoFileTrayFullOutline />
                    </div>
                    <div className="call-dr-name">
                      Total
                    </div>
                  </div>
                  <div className="call-dr-num clr-00d19d">
                    {filteredTeamLeadData.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>)}
      </div>
    </div>
  )
}

export default EmployeeForwardedReport