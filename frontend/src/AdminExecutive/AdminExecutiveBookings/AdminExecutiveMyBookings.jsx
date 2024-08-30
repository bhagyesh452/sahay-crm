import React, { useState, useEffect, useSyncExternalStore } from "react";
import axios from "axios";
import { IoFilterOutline } from "react-icons/io5";
import ClipLoader from "react-spinners/ClipLoader";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import "../../assets/table.css";
import "../../assets/styles.css";
import dummyImg from "../../static/EmployeeImg/office-man.png";
import { Link } from "react-router-dom";
import { useIsFocusVisible } from "@mui/material";
//import RmofCertificationCompanyTaskManage from "./RmofCertificationCompanyTaskManage";
import { FaRegEye } from "react-icons/fa";
import { CiUndo } from "react-icons/ci";
import { FaWhatsapp } from "react-icons/fa";
// import RmofCertificationGeneralPanel from "./RmofCertificationGeneralPanel";
// import RmofCertificationProcessPanel from "./RmofCertificationProcessPanel";
// import RmofCertificationSubmittedPanel from "./RmofCertificationSubmittedPanel";
// import RmofCertificationApprovedPanel from "./RmofCertificationApprovedPanel";
// import RmofCertificationDefaulterPanel from "./RmofCertificationDefaulterPanel";
// import RmofCertificationHoldPanel from "./RmofCertificationHoldPanel";
import io from "socket.io-client";
//import RmofCertificationReadyToSubmitPanel from "./RmofCertificationReadyToSubmitPanel";
import AdminExecutiveHeader from "../Components/AdminExecutiveHeader";
import AdminExecutiveNavbar from "../Components/AdminExecutiveNavbar";
import AdminExecutiveGeneralPanel from "./AdminExecutiveGeneralPanel";
import AdminExecutiveProcessPanel from "./AdminExecutiveProcessPanel";
import AdminExecutiveHoldPanel from "./AdminExecutiveHoldPanel";
import AdminExecutiveDefaulterPanel from "./AdminExecutiveDefaulterPanel";
import AdminExecutiveApprovedPanel from "./AdminExecutiveApprovedPanel";

function AdminExecutiveMyBookings() {
  const adminExecutiveUserId = localStorage.getItem("adminExecutiveUserId");
  const [employeeData, setEmployeeData] = useState([]);
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const [currentDataLoading, setCurrentDataLoading] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const [rmServicesData, setRmServicesData] = useState([]);
  const [search, setSearch] = useState("");
  //const [showFilterIcon, setShowFilterIcon] = useState(false)
  const [activeTab, setActiveTab] = useState("General");
  const [showFilterIcon, setShowFilterIcon] = useState({
    General: false,
    InProcess: false,
    ReadyToSubmit: false,
    Submited: false,
    Approved: false,
    Hold: false,
    Defaulter: false,
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDocumentsGeneral, setTotalDocumentsGeneral] = useState(0);
  const [totalDocumentsProcess, setTotalDocumentsProcess] = useState(0);
  const [totalDocumentsDefaulter, setTotalDocumentsDefaulter] = useState(0);
  const [totalDocumentsHold, setTotalDocumentsHold] = useState(0);
  const [totalDocumentsApproved, setTotalDocumentsApproved] = useState(0);
  const [noOfFilteredData, setnoOfFilteredData] = useState(0);
  const [showNoOfFilteredData, setShowNoOfFilteredData] = useState(true);
  const [openCompanyTaskComponent, setOpenCompanyTaskComponent] = useState(false);

  useEffect(() => {
    document.title = `AdminExecutive-Sahay-CRM`;
  }, []);

  useEffect(() => {
    const socket =
      secretKey === "http://localhost:3001/api"
        ? io("http://localhost:3001")
        : io("wss://startupsahay.in", {
          secure: true, // Use HTTPS
          path: "/socket.io",
          reconnection: true,
          transports: ["websocket"],
        });

    socket.on("adminexecutive-general-status-updated", (res) => {
      console.log("socketChala");
      fetchRMServicesData(search);
    });

    socket.on("rm-recievedamount-updated", (res) => {
      fetchRMServicesData(search);
    });

    socket.on("rm-recievedamount-deleted", (res) => {
      fetchRMServicesData(search);
    });
    socket.on("booking-deleted", (res) => {
      fetchRMServicesData(search);
    });

    socket.on("booking-updated", (res) => {
      fetchRMServicesData(search);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${secretKey}/employee/einfo`);
      // Set the retrieved data in the state
      const tempData = response.data;
      //console.log(tempData)
      const userData = tempData.find(
        (item) => item._id === adminExecutiveUserId
      );
      //console.log(userData)
      setEmployeeData(userData);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  // const fetchRMServicesData = async (searchQuery = "") => {
  //   try {
  //     setCurrentDataLoading(true);
  //     const response = await axios.get(
  //       `${secretKey}/rm-services/adminexecutivedata`,
  //       {
  //         params: { search: searchQuery },
  //       }
  //     );
  //     setRmServicesData(response.data);
  //     //console.log(response.data)
  //   } catch (error) {
  //     console.error("Error fetching data", error.message);
  //   } finally {
  //     setCurrentDataLoading(false);
  //   }
  // };

  const fetchRMServicesData = async (searchQuery = "", page = 1) => {
    try {
      setCurrentDataLoading(true);
      const response = await axios.get(`${secretKey}/rm-services/adminexecutivedata`, {
        params: { search: searchQuery, page, activeTab: activeTab }
      });

      const {
        data,
        totalPages,
        totalDocumentsGeneral,
        totalDocumentsProcess,
        totalDocumentsDefaulter,
        totalDocumentsReadyToSubmit,
        totalDocumentsSubmitted,
        totalDocumentsHold,
        totalDocumentsApproved,

      } = response.data;
      console.log("response", response.data)

      // If it's a search query, replace the data; otherwise, append for pagination
      if (page === 1) {
        // This is either the first page load or a search operation
        setRmServicesData(data);
      } else {
        // This is a pagination request
        setRmServicesData(prevData => [...prevData, ...data]);
      }
      setTotalDocumentsProcess(totalDocumentsProcess)
      setTotalDocumentsGeneral(totalDocumentsGeneral)
      setTotalDocumentsDefaulter(totalDocumentsDefaulter)
      setTotalDocumentsHold(totalDocumentsHold)
      setTotalDocumentsApproved(totalDocumentsApproved)
      setTotalPages(totalPages); // Update total pages
    } catch (error) {
      console.error("Error fetching data", error.message);
    } finally {
      setCurrentDataLoading(false);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchRMServicesData("", page); // Fetch data initially
  }, [employeeData]);


  useEffect(() => {
    fetchRMServicesData();
  }, [employeeData]);
  useEffect(() => {
    fetchRMServicesData(search, page); // Fetch data when search query changes
  }, [search]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value); // Update search query state
  };
  const setNoOfData = (number) => {
    console.log("number", number)
    setnoOfFilteredData(number)
  }

  return (
    <div>
      <AdminExecutiveHeader
        id={employeeData._id}
        name={employeeData.ename}
        empProfile={
          employeeData.profilePhoto &&
          employeeData.profilePhoto.length !== 0 &&
          employeeData.profilePhoto[0].filename
        }
        gender={employeeData.gender}
        designation={employeeData.newDesignation}
      />
      <AdminExecutiveNavbar adminExecutiveUserId={adminExecutiveUserId} />

      {!openCompanyTaskComponent && (
        <div className="page-wrapper rm-mybookingmain">
          <div className="page-header rm_Filter m-0">
            <div className="container-xl">
              <div className="d-flex aling-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <div class="input-icon ml-1">
                    <span class="input-icon-addon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon mybtn"
                        width="18"
                        height="18"
                        viewBox="0 0 22 22"
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
                        ></path>
                        <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
                        <path d="M21 21l-6 -6"></path>
                      </svg>
                    </span>
                    <input
                      className="form-control search-cantrol mybtn"
                      placeholder="Search…"
                      type="text"
                      name="bdeName-search"
                      id="bdeName-search"
                      value={search}
                      onChange={handleSearchChange}
                    />
                  </div>
                </div>
                {noOfFilteredData > 0 && (
                  <div className="selection-data">
                    Result : <b>
                      {noOfFilteredData} /
                      {activeTab === "General"
                        ? totalDocumentsGeneral
                        : activeTab === "InProcess"
                          ? totalDocumentsProcess
                          : activeTab === "Approved"
                            ? totalDocumentsApproved
                            : activeTab === "Hold"
                              ? totalDocumentsHold
                              : activeTab === "Defaulter"
                                ? totalDocumentsDefaulter
                                : 0}
                    </b>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="page-body rm_Dtl_box m-0">
            <div className="container-xl mt-2">
              <div className="rm_main_card">
                <div
                  className="my-tab card-header for_adminex"
                  style={{ marginBottom: "-2px" }}
                >
                  <ul class="nav nav-tabs rm_task_section_navtabs for_adminex_navtabs  nav-fill p-0">
                    <li class="nav-item rm_task_section_navitem">
                      <a
                        class="nav-link active"
                        data-bs-toggle="tab"
                        href="#General"
                        onClick={() => setActiveTab("General")}
                      >
                        <div className="d-flex align-items-center justify-content-between w-100">
                          <div className="rm_txt_tsn">General</div>
                          <div className="rm_tsn_bdge">
                            {totalDocumentsGeneral}
                            {/* {rmServicesData
                              ? rmServicesData.filter(
                                (item) =>
                                  item.mainCategoryStatus === "General"
                              ).length
                              : 0} */}
                          </div>
                        </div>
                      </a>
                    </li>
                    <li class="nav-item rm_task_section_navitem">
                      <a
                        class="nav-link"
                        data-bs-toggle="tab"
                        href="#InProcess"
                        onClick={() => setActiveTab("InProcess")}
                      >
                        <div className="d-flex align-items-center justify-content-between w-100">
                          <div className="rm_txt_tsn">In Process</div>
                          <div className="rm_tsn_bdge">
                            {totalDocumentsProcess}
                            {/* {rmServicesData
                              ? rmServicesData.filter(
                                (item) =>
                                  item.mainCategoryStatus === "Process"
                              ).length
                              : 0} */}
                          </div>
                        </div>
                      </a>
                    </li>
                    <li class="nav-item rm_task_section_navitem">
                      <a class="nav-link"
                        data-bs-toggle="tab"
                        href="#Approved"
                        onClick={() => setActiveTab("Approved")}
                      >
                        <div className="d-flex align-items-center justify-content-between w-100">
                          <div className="rm_txt_tsn">Approved</div>
                          <div className="rm_tsn_bdge">
                            {totalDocumentsApproved}
                            {/* {rmServicesData
                              ? rmServicesData.filter(
                                (item) =>
                                  item.mainCategoryStatus === "Approved"
                              ).length
                              : 0} */}
                          </div>
                        </div>
                      </a>
                    </li>
                    <li class="nav-item rm_task_section_navitem">
                      <a class="nav-link" 
                      data-bs-toggle="tab" 
                      href="#Hold"
                      onClick={() => setActiveTab("Hold")}
                      >
                        <div className="d-flex align-items-center justify-content-between w-100">
                          <div className="rm_txt_tsn">Hold</div>
                          <div className="rm_tsn_bdge">
                            {totalDocumentsHold}
                            {/* {rmServicesData
                              ? rmServicesData.filter(
                                (item) => item.mainCategoryStatus === "Hold"
                              ).length
                              : 0} */}
                          </div>
                        </div>
                      </a>
                    </li>
                    <li class="nav-item rm_task_section_navitem">
                      <a
                        class="nav-link"
                        data-bs-toggle="tab"
                        href="#Defaulter"
                        onClick={() => setActiveTab("Defaulter")}
                      >
                        <div className="d-flex align-items-center justify-content-between w-100">
                          <div className="rm_txt_tsn">Defaulter</div>
                          <div className="rm_tsn_bdge">
                            {totalDocumentsDefaulter}
                            {/* {rmServicesData
                              ? rmServicesData.filter(
                                (item) =>
                                  item.mainCategoryStatus === "Defaulter"
                              ).length
                              : 0} */}
                          </div>
                        </div>
                      </a>
                    </li>
                  </ul>
                </div>
                <div class="tab-content card-body">
                  <div class="tab-pane active" id="General">
                    <AdminExecutiveGeneralPanel
                      showingFilterIcon={setShowNoOfFilteredData}
                      totalFilteredData={activeTab === "General" ? setNoOfData : () => { }}
                      searchText={search}
                      activeTab={activeTab}
                      showFilter={showFilterIcon.General}
                    />
                  </div>
                  <div class="tab-pane" id="InProcess">
                    <AdminExecutiveProcessPanel
                      showingFilterIcon={setShowNoOfFilteredData}
                      totalFilteredData={activeTab === "InProcess" ? setNoOfData : () => { }}
                      searchText={search}
                      activeTab={activeTab}
                      showFilter={showFilterIcon.InProcess}
                    />
                  </div>
                  <div class="tab-pane" id="Approved">
                    <AdminExecutiveApprovedPanel
                      showingFilterIcon={setShowNoOfFilteredData}
                      totalFilteredData={activeTab === "Approved" ? setNoOfData : () => { }}
                      searchText={search}
                      activeTab={activeTab}
                      showFilter={showFilterIcon.Approved}
                    />
                  </div>
                  <div class="tab-pane" id="Hold">
                    <AdminExecutiveHoldPanel
                      showingFilterIcon={setShowNoOfFilteredData}
                      totalFilteredData={activeTab === "Hold" ? setNoOfData : () => { }}
                      searchText={search}
                      activeTab={activeTab}
                      showFilter={showFilterIcon.Hold}
                    />
                  </div>
                  <div class="tab-pane" id="Defaulter">
                    <AdminExecutiveDefaulterPanel
                      showingFilterIcon={setShowNoOfFilteredData}
                      totalFilteredData={activeTab === "Defaulter" ? setNoOfData : () => { }}
                      searchText={search}
                      activeTab={activeTab}
                      showFilter={showFilterIcon.Defaulter}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* {openCompanyTaskComponent &&
                <>
                    <RmofCertificationCompanyTaskManage />
                </>} */}
    </div>
  );
}

export default AdminExecutiveMyBookings;
