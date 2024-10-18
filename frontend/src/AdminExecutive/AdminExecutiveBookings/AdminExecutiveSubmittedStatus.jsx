import React, {
    useState,
    useEffect,
    useSyncExternalStore,
    useCallback,
    useRef,
} from "react";
import axios from "axios";
import { FaWhatsapp } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import { Drawer, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import debounce from "lodash/debounce";
import Swal from "sweetalert2";
import DeleteIcon from "@mui/icons-material/Delete";
import Nodata from "../../components/Nodata";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import io from "socket.io-client";
import { BsFilter } from "react-icons/bs";
import DscLetterStatusDropdown from "./../ExtraComponents/DscLetterStatusDropdown";
import DscStatusDropdown from "./../ExtraComponents/DscStatusDropdown";
import DscPortalDropdown from "./../ExtraComponents/DscPortalDropdown";
import DscValidityDropdown from "./../ExtraComponents/DscValidityDropdown";
import DscTypeDropdown from "./../ExtraComponents/DscTypeDropdown";
import DscPortalCharges from "./../ExtraComponents/DscPortalCharges";
import DscChargesPaidVia from "./../ExtraComponents/DscChargesPaidVia";
import DscExpanceReimbursement from "./../ExtraComponents/DscExpanceReimbursement";
import DscPhoneNo from "../ExtraComponents/DscPhoneNo";
import DscEmailId from "../ExtraComponents/DscEmailId";
import DscRemarks from "../ExtraComponents/DscRemarks";
import OtpVerificationStatus from "../ExtraComponents/OtpVerificationStatus";
import OtpInboxNo from "../ExtraComponents/OtpInboxNo";
import FilterableTableAdminExecutive from '../ExtraComponents/FilterableTableAdminExecutive';
import { FaFilter } from "react-icons/fa";

function AdminExecutiveSubmittedPanel({ searchText,
    totalFilteredDataPortal, 
    showFilter, 
    activeTab,
    totalFilteredData, 
    showingFilterIcon,completeEmployeeInfo 
}) {
    const adminExecutiveUserId = localStorage.getItem("adminExecutiveUserId");
    const [employeeData, setEmployeeData] = useState([]);
    const [rmServicesData, setRmServicesData] = useState([]);
    const [newStatus, setNewStatus] = useState("Untouched");
    const [openRemarksPopUp, setOpenRemarksPopUp] = useState(false);
    const [currentCompanyName, setCurrentCompanyName] = useState("");
    const [currentServiceName, setCurrentServiceName] = useState("");
    const [remarksHistory, setRemarksHistory] = useState([]);
    const [changeRemarks, setChangeRemarks] = useState("");
    const [openBacdrop, setOpenBacdrop] = useState(false);
    const [newStatusProcess, setNewStatusProcess] = useState("Application Submitted");
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const [completeRmData, setcompleteRmData] = useState([])
    const [dataToFilter, setdataToFilter] = useState([])
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isScrollLocked, setIsScrollLocked] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const [activeFilterFields, setActiveFilterFields] = useState([]); // New state for active filter fields
    const [error, setError] = useState('');
    const [noOfAvailableData, setnoOfAvailableData] = useState(0)
    const [filterField, setFilterField] = useState("")
    const [activeFilterField, setActiveFilterField] = useState(null);
    const [filterPosition, setFilterPosition] = useState({ top: 10, left: 5 });
    const fieldRefs = useRef({});
    const filterMenuRef = useRef(null); // Ref for the filter menu containe
    // Fetch Data Function
    // Fetch Data Function
    // const fetchData = async (searchQuery = "") => {
    //   setOpenBacdrop(true);
    //   try {
    //     const employeeResponse = await axios.get(`${secretKey}/employee/einfo`);
    //     const userData = employeeResponse.data.find(
    //       (item) => item._id === adminExecutiveUserId
    //     );
    //     setEmployeeData(userData);

    //     const servicesResponse = await axios.get(
    //       `${secretKey}/rm-services/adminexecutivedata`,
    //       {
    //         params: { search: searchQuery },
    //       }
    //     );
    //     const servicesData = servicesResponse.data;

    //     if (Array.isArray(servicesData)) {
    //       const filteredData = servicesData
    //         .filter((item) => item.mainCategoryStatus === "Process")
    //         .sort((a, b) => {
    //           const dateA = new Date(a.dateOfChangingMainStatus);
    //           const dateB = new Date(b.dateOfChangingMainStatus);
    //           return dateB - dateA; // Sort in descending order
    //         });
    //       setRmServicesData(filteredData);
    //       setcompleteRmData(filteredData);
    //       setdataToFilter(filteredData);
    //     } else {
    //       console.error(
    //         "Expected an array for services data, but got:",
    //         servicesData
    //       );
    //     }

    //     //setRmServicesData(filteredData);
    //   } catch (error) {
    //     console.error("Error fetching data", error.message);
    //   } finally {
    //     setOpenBacdrop(false);
    //   }
    // };

    const fetchData = async (searchQuery = "", page = 1, isFilter = false) => {
        setOpenBacdrop(true);
        try {
            const employeeResponse = await axios.get(`${secretKey}/employee/einfo`);
            const userData = employeeResponse.data.find((item) => item._id === adminExecutiveUserId);
            setEmployeeData(userData);

            let params = { search: searchQuery, page, activeTab: "Application Submitted" };

            // If filtering is active, extract companyName and serviceName from filteredData
            if (isFilter && filteredData && filteredData.length > 0) {
                const companyNames = filteredData.map(item => item["Company Name"]).join(',');
                const serviceNames = filteredData.map(item => item.serviceName).join(',');

                // Add filtered company names and service names to the params
                params.companyNames = companyNames;
                params.serviceNames = serviceNames;
            }

            const servicesResponse = await axios.get(`${secretKey}/rm-services/adminexecutivedata`, {
                params: params
            });

            const { data, totalPages } = servicesResponse.data;


            if (page === 1) {
                setRmServicesData(data);
                setcompleteRmData(data);
                setdataToFilter(data);
            } else {
                setRmServicesData(prevData => [...prevData, ...data]);
                setcompleteRmData(prevData => [...prevData, ...data]);
                setdataToFilter(prevData => [...prevData, ...data]);
            }

            setTotalPages(totalPages);

        } catch (error) {
            console.error("Error fetching data", error.message);
        } finally {
            setOpenBacdrop(false);
        }
    };

    useEffect(() => {
        const tableContainer = document.querySelector('#generalTable');

        const handleScroll = debounce(() => {
            if (tableContainer.scrollTop + tableContainer.clientHeight >= tableContainer.scrollHeight - 50) {
                if (page < totalPages) {
                    setPage(prevPage => prevPage + 1); // Load next page
                }
            }
        }, 200);

        tableContainer.addEventListener('scroll', handleScroll);
        return () => tableContainer.removeEventListener('scroll', handleScroll);
    }, [page, totalPages, filteredData]);

    useEffect(() => {
        fetchData(searchText, page);
    }, [searchText, page]);


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
            fetchData(searchText);
        });

        socket.on("rm-recievedamount-updated", (res) => {
            fetchData(searchText);
        });

        socket.on("rm-recievedamount-deleted", (res) => {
            fetchData(searchText);
        });

        socket.on("booking-deleted", (res) => {
            fetchData(searchText);
        });

        socket.on("booking-updated", (res) => {
            fetchData(searchText);
        });
        const updateDocumentInState = (updatedDocument) => {
            console.log(updatedDocument)
            setRmServicesData(prevData => prevData.map(item =>
                item._id === updatedDocument._id ? updatedDocument : item
            ));
            setcompleteRmData(prevData => prevData.map(item =>
                item._id === updatedDocument._id ? updatedDocument : item
            ));
            setdataToFilter(prevData => prevData.map(item =>
                item._id === updatedDocument._id ? updatedDocument : item
            ));
        };

        socket.on("rmcert-letter-updated", (res) => {
            //console.log("res" , res)
            if (res.updatedDocumentAdmin) {
                updateDocumentInState(res.updatedDocumentAdmin);
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [newStatusProcess]);

    const refreshData = () => {
        if (filteredData && filteredData.length > 0) {
            fetchData(searchText, 1, true)
        } else {
            fetchData(searchText, page, false);
        }
    };

    // useEffect to fetch data on component mount
    useEffect(() => {
        fetchData(searchText);
    }, [adminExecutiveUserId, secretKey]);

    const formatDatePro = (inputDate) => {
        const date = new Date(inputDate);
        const day = date.getDate();
        const month = date.toLocaleString("en-US", { month: "long" });
        const year = date.getFullYear();
        return `${day} ${month}, ${year}`;
    };

    const formatDate = (dateString) => {
        const [year, month, date] = dateString.split("-");
        return `${date}/${month}/${year}`;
    };

    // Remarks Popup Section
    const handleOpenRemarksPopup = async (companyName, serviceName) => {
        setCurrentCompanyName(companyName);
        setCurrentServiceName(serviceName);
        setOpenRemarksPopUp(true);

        try {
            const response = await axios.get(`${secretKey}/rm-services/get-remarks`, {
                params: { companyName, serviceName },
            });
            setRemarksHistory(response.data);
        } catch (error) {
            console.error("Error fetching remarks", error.message);
        }
    };

    const functionCloseRemarksPopup = () => {
        setOpenRemarksPopUp(false);
    };

    const debouncedSetChangeRemarks = useCallback(
        debounce((value) => {
            setChangeRemarks(value);
        }, 300),
        []
    );

    const handleSubmitRemarks = async () => {
        try {
            const response = await axios.post(
                `${secretKey}/rm-services/post-remarks-for-rmofcertification`,
                {
                    currentCompanyName,
                    currentServiceName,
                    changeRemarks,
                    updatedOn: new Date(),
                }
            );
            if (response.status === 200) {
                fetchData(searchText);
                functionCloseRemarksPopup();
                Swal.fire(
                    "Remarks Added!",
                    "The remarks have been successfully added.",
                    "success"
                );
            }
        } catch (error) {
            console.log("Error Submitting Remarks", error.message);
        }
    };

    // ------------------------------------------------function to send service back to recieved box --------------------------------

    const handleRevokeCompanyToRecievedBox = async (companyName, serviceName) => {
        try {
            // Show confirmation dialog
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "Do you want to revert the company back to the received box?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, revert it!",
                cancelButtonText: "No, cancel!",
                reverseButtons: true,
            });

            // Check if the user confirmed the action
            if (result.isConfirmed) {
                const response = await axios.post(
                    `${secretKey}/rm-services/delete_company_from_taskmanager_and_send_to_recievedbox-foradminexecutive`,
                    {
                        companyName,
                        serviceName,
                    }
                );

                if (response.status === 200) {
                    fetchData(searchText);
                    Swal.fire(
                        "Company Reverted Back!",
                        "Company has been sent back to the received box.",
                        "success"
                    );
                } else {
                    Swal.fire(
                        "Error",
                        "Failed to revert the company back to the received box.",
                        "error"
                    );
                }
            } else {
                Swal.fire("Cancelled", "The company has not been reverted.", "info");
            }
        } catch (error) {
            console.log("Error Deleting Company from task manager", error.message);
            Swal.fire(
                "Error",
                "An error occurred while processing your request.",
                "error"
            );
        }
    };

    //-------------------filter method-------------------------------
    const handleFilter = (newData) => {
        totalFilteredDataPortal(newData)
        setFilteredData(newData)
        setRmServicesData(newData.filter(obj => obj.mainCategoryStatus === "Application Submitted"));

    };

    useEffect(() => {
        if (noOfAvailableData) {
          showingFilterIcon(true)
          totalFilteredData(noOfAvailableData)
          if (activeFilterField === "expenseReimbursementStatus") {
            totalFilteredDataPortal(rmServicesData)
          } else {
            totalFilteredDataPortal([])
          }
    
        } else {
          showingFilterIcon(false)
          totalFilteredData(0)
          totalFilteredDataPortal([])
        }
    
      }, [noOfAvailableData, activeTab])

    const handleFilterClick = (field) => {
        if (activeFilterField === field) {
            setShowFilterMenu(!showFilterMenu);
            setIsScrollLocked(!showFilterMenu);
        } else {
            setActiveFilterField(field);
            setShowFilterMenu(true);
            setIsScrollLocked(true);

            const rect = fieldRefs.current[field].getBoundingClientRect();
            setFilterPosition({ top: rect.bottom, left: rect.left });
        }
    };

    const isActiveField = (field) => activeFilterFields.includes(field);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
                setShowFilterMenu(false);
                setIsScrollLocked(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div>
            <div className="table table-responsive table-style-3 m-0" id="processTable">
                {openBacdrop && (
                    <Backdrop
                        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={openBacdrop}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                )}
                {rmServicesData.length > 0 ? (
                    <table className="table table-vcenter table-nowrap adminEx_table">
                        <thead>
                            <tr className="tr-sticky">
                                <th className="rm-sticky-left-1">Sr.No</th>
                                <th className="rm-sticky-left-2">
                                    <div className="d-flex align-items-center justify-content-center position-relative">
                                        <div ref={el => fieldRefs.current['Company Name'] = el}>Company Name</div>
                                        <div className="RM_filter_icon">
                                            {isActiveField('Company Name') ? (
                                                <FaFilter onClick={() => handleFilterClick("Company Name")} />
                                            ) : (
                                                <BsFilter onClick={() => handleFilterClick("Company Name")} />
                                            )}
                                        </div>
                                        {/* {/* ---------------------filter component--------------------------- */}
                                        {showFilterMenu && activeFilterField === 'Company Name' && (
                                            <div
                                                ref={filterMenuRef}
                                                className="filter-menu"
                                                style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                            >
                                                <FilterableTableAdminExecutive
                                                    noofItems={setnoOfAvailableData}
                                                    allFilterFields={setActiveFilterFields}
                                                    filteredData={filteredData}
                                                    activeTab={"Process"}
                                                    data={rmServicesData}
                                                    filterField={activeFilterField}
                                                    onFilter={handleFilter}
                                                    completeData={completeRmData}
                                                    showingMenu={setShowFilterMenu}
                                                    dataForFilter={dataToFilter}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </th>
                                <th>
                                    <div className="d-flex align-items-center justify-content-center position-relative">
                                        <div ref={el => fieldRefs.current['Company Number'] = el}>Company Number</div>
                                        <div className="RM_filter_icon">
                                            {isActiveField('Company Number') ? (
                                                <FaFilter onClick={() => handleFilterClick("Company Number")} />
                                            ) : (
                                                <BsFilter onClick={() => handleFilterClick("Company Number")} />
                                            )}
                                        </div>
                                        {/* {/* ---------------------filter component--------------------------- */}
                                        {showFilterMenu && activeFilterField === 'Company Number' && (
                                            <div
                                                ref={filterMenuRef}
                                                className="filter-menu"
                                                style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                            >
                                                <FilterableTableAdminExecutive
                                                    noofItems={setnoOfAvailableData}
                                                    allFilterFields={setActiveFilterFields}
                                                    filteredData={filteredData}
                                                    activeTab={"Application Submitted"}
                                                    data={rmServicesData}
                                                    filterField={activeFilterField}
                                                    onFilter={handleFilter}
                                                    completeData={completeRmData}
                                                    showingMenu={setShowFilterMenu}
                                                    dataForFilter={dataToFilter}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </th>
                                <th>
                                    <div className="d-flex align-items-center justify-content-center position-relative">
                                        <div ref={el => fieldRefs.current['Company Email'] = el}>Company Email</div>
                                        <div className="RM_filter_icon">
                                            {isActiveField('Company Email') ? (
                                                <FaFilter onClick={() => handleFilterClick("Company Email")} />
                                            ) : (
                                                <BsFilter onClick={() => handleFilterClick("Company Email")} />
                                            )}
                                        </div>
                                        {/* {/* ---------------------filter component--------------------------- */}
                                        {showFilterMenu && activeFilterField === 'Company Email' && (
                                            <div
                                                ref={filterMenuRef}
                                                className="filter-menu"
                                                style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                            >
                                                <FilterableTableAdminExecutive
                                                    noofItems={setnoOfAvailableData}
                                                    allFilterFields={setActiveFilterFields}
                                                    filteredData={filteredData}
                                                    activeTab={"Application Submitted"}
                                                    data={rmServicesData}
                                                    filterField={activeFilterField}
                                                    onFilter={handleFilter}
                                                    completeData={completeRmData}
                                                    showingMenu={setShowFilterMenu}
                                                    dataForFilter={dataToFilter}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </th>
                                <th>
                                    <div className="d-flex align-items-center justify-content-center position-relative">
                                        <div ref={el => fieldRefs.current['caNumber'] = el}>CA Number</div>
                                        <div className="RM_filter_icon">
                                            {isActiveField('caNumber') ? (
                                                <FaFilter onClick={() => handleFilterClick("caNumber")} />
                                            ) : (
                                                <BsFilter onClick={() => handleFilterClick("caNumber")} />
                                            )}
                                        </div>
                                        {/* {/* ---------------------filter component--------------------------- */}
                                        {showFilterMenu && activeFilterField === 'caNumber' && (
                                            <div
                                                ref={filterMenuRef}
                                                className="filter-menu"
                                                style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                            >
                                                <FilterableTableAdminExecutive
                                                    noofItems={setnoOfAvailableData}
                                                    allFilterFields={setActiveFilterFields}
                                                    filteredData={filteredData}
                                                    activeTab={"Application Submitted"}
                                                    data={rmServicesData}
                                                    filterField={activeFilterField}
                                                    onFilter={handleFilter}
                                                    completeData={completeRmData}
                                                    showingMenu={setShowFilterMenu}
                                                    dataForFilter={dataToFilter}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </th>
                                <th>
                                    <div className="d-flex align-items-center justify-content-center position-relative">
                                        <div ref={el => fieldRefs.current['serviceName'] = el}>Services Name</div>
                                        <div className="RM_filter_icon">
                                            {isActiveField('serviceName') ? (
                                                <FaFilter onClick={() => handleFilterClick("serviceName")} />
                                            ) : (
                                                <BsFilter onClick={() => handleFilterClick("serviceName")} />
                                            )}
                                        </div>
                                        {/* {/* ---------------------filter component--------------------------- */}
                                        {showFilterMenu && activeFilterField === 'serviceName' && (
                                            <div
                                                ref={filterMenuRef}
                                                className="filter-menu"
                                                style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                            >
                                                <FilterableTableAdminExecutive
                                                    noofItems={setnoOfAvailableData}
                                                    allFilterFields={setActiveFilterFields}
                                                    filteredData={filteredData}
                                                    activeTab={"Application Submitted"}
                                                    data={rmServicesData}
                                                    filterField={activeFilterField}
                                                    onFilter={handleFilter}
                                                    completeData={completeRmData}
                                                    showingMenu={setShowFilterMenu}
                                                    dataForFilter={dataToFilter}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </th>
                                <th>
                                    <div className="d-flex align-items-center justify-content-center position-relative">
                                        <div ref={el => fieldRefs.current['letterStatus'] = el}>Letter Status</div>
                                        <div className="RM_filter_icon">
                                            {isActiveField('letterStatus') ? (
                                                <FaFilter onClick={() => handleFilterClick("letterStatus")} />
                                            ) : (
                                                <BsFilter onClick={() => handleFilterClick("letterStatus")} />
                                            )}
                                        </div>
                                        {/* {/* ---------------------filter component--------------------------- */}
                                        {showFilterMenu && activeFilterField === 'letterStatus' && (
                                            <div
                                                ref={filterMenuRef}
                                                className="filter-menu"
                                                style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                            >
                                                <FilterableTableAdminExecutive
                                                    noofItems={setnoOfAvailableData}
                                                    allFilterFields={setActiveFilterFields}
                                                    filteredData={filteredData}
                                                    activeTab={"Application Submitted"}
                                                    data={rmServicesData}
                                                    filterField={activeFilterField}
                                                    onFilter={handleFilter}
                                                    completeData={completeRmData}
                                                    showingMenu={setShowFilterMenu}
                                                    dataForFilter={dataToFilter}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </th>
                                <th>
                                    <div className="d-flex align-items-center justify-content-center position-relative">
                                        <div ref={el => fieldRefs.current['subCategoryStatus'] = el}>KYC Status</div>
                                        <div className="RM_filter_icon">
                                            {isActiveField('subCategoryStatus') ? (
                                                <FaFilter onClick={() => handleFilterClick("subCategoryStatus")} />
                                            ) : (
                                                <BsFilter onClick={() => handleFilterClick("subCategoryStatus")} />
                                            )}
                                        </div>
                                        {/* {/* ---------------------filter component--------------------------- */}
                                        {showFilterMenu && activeFilterField === 'subCategoryStatus' && (
                                            <div
                                                ref={filterMenuRef}
                                                className="filter-menu"
                                                style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                            >
                                                <FilterableTableAdminExecutive
                                                    noofItems={setnoOfAvailableData}
                                                    allFilterFields={setActiveFilterFields}
                                                    filteredData={filteredData}
                                                    activeTab={"Application Submitted"}
                                                    data={rmServicesData}
                                                    filterField={activeFilterField}
                                                    onFilter={handleFilter}
                                                    completeData={completeRmData}
                                                    showingMenu={setShowFilterMenu}
                                                    dataForFilter={dataToFilter}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </th>
                                <th>
                                    <div className="d-flex align-items-center justify-content-center position-relative">
                                        <div ref={el => fieldRefs.current['remarks'] = el}>Remarks</div>
                                    </div>
                                </th>
                                <th>
                                    <div className="d-flex align-items-center justify-content-center position-relative">
                                        <div ref={el => fieldRefs.current['dscPortal'] = el}>DSC Portal</div>
                                        <div className="RM_filter_icon">
                                            {isActiveField('dscPortal') ? (
                                                <FaFilter onClick={() => handleFilterClick("dscPortal")} />
                                            ) : (
                                                <BsFilter onClick={() => handleFilterClick("dscPortal")} />
                                            )}
                                        </div>
                                        {/* {/* ---------------------filter component--------------------------- */}
                                        {showFilterMenu && activeFilterField === 'dscPortal' && (
                                            <div
                                                ref={filterMenuRef}
                                                className="filter-menu"
                                                style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                            >
                                                <FilterableTableAdminExecutive
                                                    noofItems={setnoOfAvailableData}
                                                    allFilterFields={setActiveFilterFields}
                                                    filteredData={filteredData}
                                                    activeTab={"Application Submitted"}
                                                    data={rmServicesData}
                                                    filterField={activeFilterField}
                                                    onFilter={handleFilter}
                                                    completeData={completeRmData}
                                                    showingMenu={setShowFilterMenu}
                                                    dataForFilter={dataToFilter}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </th>
                                <th>
                                    <div className="d-flex align-items-center justify-content-center position-relative">
                                        <div ref={el => fieldRefs.current['dscType'] = el}>DSC Type</div>
                                        <div className="RM_filter_icon">
                                            {isActiveField('dscType') ? (
                                                <FaFilter onClick={() => handleFilterClick("dscType")} />
                                            ) : (
                                                <BsFilter onClick={() => handleFilterClick("dscType")} />
                                            )}
                                        </div>
                                        {/* {/* ---------------------filter component--------------------------- */}
                                        {showFilterMenu && activeFilterField === 'dscType' && (
                                            <div
                                                ref={filterMenuRef}
                                                className="filter-menu"
                                                style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                            >
                                                <FilterableTableAdminExecutive
                                                    noofItems={setnoOfAvailableData}
                                                    allFilterFields={setActiveFilterFields}
                                                    filteredData={filteredData}
                                                    activeTab={"Application Submitted"}
                                                    data={rmServicesData}
                                                    filterField={activeFilterField}
                                                    onFilter={handleFilter}
                                                    completeData={completeRmData}
                                                    showingMenu={setShowFilterMenu}
                                                    dataForFilter={dataToFilter}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </th>
                                <th>
                                    <div className="d-flex align-items-center justify-content-center position-relative">
                                        <div ref={el => fieldRefs.current['dscValidity'] = el}>DSC Validity</div>
                                        <div className="RM_filter_icon">
                                            {isActiveField('dscValidity') ? (
                                                <FaFilter onClick={() => handleFilterClick("dscValidity")} />
                                            ) : (
                                                <BsFilter onClick={() => handleFilterClick("dscValidity")} />
                                            )}
                                        </div>
                                        {/* {/* ---------------------filter component--------------------------- */}
                                        {showFilterMenu && activeFilterField === 'dscValidity' && (
                                            <div
                                                ref={filterMenuRef}
                                                className="filter-menu"
                                                style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                            >
                                                <FilterableTableAdminExecutive
                                                    noofItems={setnoOfAvailableData}
                                                    allFilterFields={setActiveFilterFields}
                                                    filteredData={filteredData}
                                                    activeTab={"Application Submitted"}
                                                    data={rmServicesData}
                                                    filterField={activeFilterField}
                                                    onFilter={handleFilter}
                                                    completeData={completeRmData}
                                                    showingMenu={setShowFilterMenu}
                                                    dataForFilter={dataToFilter}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </th>
                                <th>
                                    <div className="d-flex align-items-center justify-content-center position-relative">
                                        <div ref={el => fieldRefs.current['dscPhoneNo'] = el}>DSC Phone No</div>
                                        <div className="RM_filter_icon">
                                            {isActiveField('dscPhoneNo') ? (
                                                <FaFilter onClick={() => handleFilterClick("dscPhoneNo")} />
                                            ) : (
                                                <BsFilter onClick={() => handleFilterClick("dscPhoneNo")} />
                                            )}
                                        </div>
                                        {/* {/* ---------------------filter component--------------------------- */}
                                        {showFilterMenu && activeFilterField === 'dscPhoneNo' && (
                                            <div
                                                ref={filterMenuRef}
                                                className="filter-menu"
                                                style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                            >
                                                <FilterableTableAdminExecutive
                                                    noofItems={setnoOfAvailableData}
                                                    allFilterFields={setActiveFilterFields}
                                                    filteredData={filteredData}
                                                    activeTab={"Application Submitted"}
                                                    data={rmServicesData}
                                                    filterField={activeFilterField}
                                                    onFilter={handleFilter}
                                                    completeData={completeRmData}
                                                    showingMenu={setShowFilterMenu}
                                                    dataForFilter={dataToFilter}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </th>
                                <th>
                                    <div className="d-flex align-items-center justify-content-center position-relative">
                                        <div ref={el => fieldRefs.current['dscEmailId'] = el}>DSC Email Id</div>
                                        <div className="RM_filter_icon">
                                            {isActiveField('dscEmailId') ? (
                                                <FaFilter onClick={() => handleFilterClick("dscEmailId")} />
                                            ) : (
                                                <BsFilter onClick={() => handleFilterClick("dscEmailId")} />
                                            )}
                                        </div>
                                        {/* {/* ---------------------filter component--------------------------- */}
                                        {showFilterMenu && activeFilterField === 'dscEmailId' && (
                                            <div
                                                ref={filterMenuRef}
                                                className="filter-menu"
                                                style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                            >
                                                <FilterableTableAdminExecutive
                                                    noofItems={setnoOfAvailableData}
                                                    allFilterFields={setActiveFilterFields}
                                                    filteredData={filteredData}
                                                    activeTab={"Application Submitted"}
                                                    data={rmServicesData}
                                                    filterField={activeFilterField}
                                                    onFilter={handleFilter}
                                                    completeData={completeRmData}
                                                    showingMenu={setShowFilterMenu}
                                                    dataForFilter={dataToFilter}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </th>
                                <th>
                                    <div className="d-flex align-items-center justify-content-center position-relative">
                                        <div ref={el => fieldRefs.current['portalCharges'] = el}>Portal Charges</div>
                                        <div className="RM_filter_icon">
                                            {isActiveField('portalCharges') ? (
                                                <FaFilter onClick={() => handleFilterClick("portalCharges")} />
                                            ) : (
                                                <BsFilter onClick={() => handleFilterClick("portalCharges")} />
                                            )}
                                        </div>
                                        {/* {/* ---------------------filter component--------------------------- */}
                                        {showFilterMenu && activeFilterField === 'portalCharges' && (
                                            <div
                                                ref={filterMenuRef}
                                                className="filter-menu"
                                                style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                            >
                                                <FilterableTableAdminExecutive
                                                    noofItems={setnoOfAvailableData}
                                                    allFilterFields={setActiveFilterFields}
                                                    filteredData={filteredData}
                                                    activeTab={"Application Submitted"}
                                                    data={rmServicesData}
                                                    filterField={activeFilterField}
                                                    onFilter={handleFilter}
                                                    completeData={completeRmData}
                                                    showingMenu={setShowFilterMenu}
                                                    dataForFilter={dataToFilter}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </th>
                                <th>
                                    <div className="d-flex align-items-center justify-content-center position-relative">
                                        <div ref={el => fieldRefs.current['chargesPaidVia'] = el}>Charges Paid Via</div>
                                        <div className="RM_filter_icon">
                                            {isActiveField('chargesPaidVia') ? (
                                                <FaFilter onClick={() => handleFilterClick("chargesPaidVia")} />
                                            ) : (
                                                <BsFilter onClick={() => handleFilterClick("chargesPaidVia")} />
                                            )}
                                        </div>
                                        {/* {/* ---------------------filter component--------------------------- */}
                                        {showFilterMenu && activeFilterField === 'chargesPaidVia' && (
                                            <div
                                                ref={filterMenuRef}
                                                className="filter-menu"
                                                style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                            >
                                                <FilterableTableAdminExecutive
                                                    noofItems={setnoOfAvailableData}
                                                    allFilterFields={setActiveFilterFields}
                                                    filteredData={filteredData}
                                                    activeTab={"Application Submitted"}
                                                    data={rmServicesData}
                                                    filterField={activeFilterField}
                                                    onFilter={handleFilter}
                                                    completeData={completeRmData}
                                                    showingMenu={setShowFilterMenu}
                                                    dataForFilter={dataToFilter}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </th>
                                <th>
                                    <div className="d-flex align-items-center justify-content-center position-relative">
                                        <div ref={el => fieldRefs.current['expenseReimbursementStatus'] = el}>Reimbursement Status</div>
                                        <div className="RM_filter_icon">
                                            {isActiveField('expenseReimbursementStatus') ? (
                                                <FaFilter onClick={() => handleFilterClick("expenseReimbursementStatus")} />
                                            ) : (
                                                <BsFilter onClick={() => handleFilterClick("expenseReimbursementStatus")} />
                                            )}
                                        </div>
                                        {/* {/* ---------------------filter component--------------------------- */}
                                        {showFilterMenu && activeFilterField === 'expenseReimbursementStatus' && (
                                            <div
                                                ref={filterMenuRef}
                                                className="filter-menu"
                                                style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                            >
                                                <FilterableTableAdminExecutive
                                                    noofItems={setnoOfAvailableData}
                                                    allFilterFields={setActiveFilterFields}
                                                    filteredData={filteredData}
                                                    activeTab={"Application Submitted"}
                                                    data={rmServicesData}
                                                    filterField={activeFilterField}
                                                    onFilter={handleFilter}
                                                    completeData={completeRmData}
                                                    showingMenu={setShowFilterMenu}
                                                    dataForFilter={dataToFilter}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </th>
                                <th>
                                    <div className="d-flex align-items-center justify-content-center position-relative">
                                        <div ref={el => fieldRefs.current['bookingDate'] = el}>Booking Date</div>
                                        <div className="RM_filter_icon">
                                            {isActiveField('bookingDate') ? (
                                                <FaFilter onClick={() => handleFilterClick("bookingDate")} />
                                            ) : (
                                                <BsFilter onClick={() => handleFilterClick("bookingDate")} />
                                            )}
                                        </div>
                                        {/* {/* ---------------------filter component--------------------------- */}
                                        {showFilterMenu && activeFilterField === 'bookingDate' && (
                                            <div
                                                ref={filterMenuRef}
                                                className="filter-menu"
                                                style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                            >
                                                <FilterableTableAdminExecutive
                                                    noofItems={setnoOfAvailableData}
                                                    allFilterFields={setActiveFilterFields}
                                                    filteredData={filteredData}
                                                    activeTab={"Application Submitted"}
                                                    data={rmServicesData}
                                                    filterField={activeFilterField}
                                                    onFilter={handleFilter}
                                                    completeData={completeRmData}
                                                    showingMenu={setShowFilterMenu}
                                                    dataForFilter={dataToFilter}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </th>
                                <th>
                                    <div className="d-flex align-items-center justify-content-center position-relative">
                                        <div ref={el => fieldRefs.current['bdeName'] = el}>BDE</div>
                                        <div className="RM_filter_icon">
                                            {isActiveField('bdeName') ? (
                                                <FaFilter onClick={() => handleFilterClick("bdeName")} />
                                            ) : (
                                                <BsFilter onClick={() => handleFilterClick("bdeName")} />
                                            )}
                                        </div>
                                        {/* {/* ---------------------filter component--------------------------- */}
                                        {showFilterMenu && activeFilterField === 'bdeName' && (
                                            <div
                                                ref={filterMenuRef}
                                                className="filter-menu"
                                                style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                            >
                                                <FilterableTableAdminExecutive
                                                    noofItems={setnoOfAvailableData}
                                                    allFilterFields={setActiveFilterFields}
                                                    filteredData={filteredData}
                                                    activeTab={"Application Submitted"}
                                                    data={rmServicesData}
                                                    filterField={activeFilterField}
                                                    onFilter={handleFilter}
                                                    completeData={completeRmData}
                                                    showingMenu={setShowFilterMenu}
                                                    dataForFilter={dataToFilter}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </th>
                                <th>
                                    <div className="d-flex align-items-center justify-content-center position-relative">
                                        <div ref={el => fieldRefs.current['bdmName'] = el}>BDM</div>
                                        <div className="RM_filter_icon">
                                            {isActiveField('bdmName') ? (
                                                <FaFilter onClick={() => handleFilterClick("bdmName")} />
                                            ) : (
                                                <BsFilter onClick={() => handleFilterClick("bdmName")} />
                                            )}
                                        </div>
                                        {/* {/* ---------------------filter component--------------------------- */}
                                        {showFilterMenu && activeFilterField === 'bdmName' && (
                                            <div
                                                ref={filterMenuRef}
                                                className="filter-menu"
                                                style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                            >
                                                <FilterableTableAdminExecutive
                                                    noofItems={setnoOfAvailableData}
                                                    allFilterFields={setActiveFilterFields}
                                                    filteredData={filteredData}
                                                    activeTab={"Application Submitted"}
                                                    data={rmServicesData}
                                                    filterField={activeFilterField}
                                                    onFilter={handleFilter}
                                                    completeData={completeRmData}
                                                    showingMenu={setShowFilterMenu}
                                                    dataForFilter={dataToFilter}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </th>
                                <th className="rm-sticky-action">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rmServicesData &&
                                rmServicesData.length !== 0 &&
                                rmServicesData.map((obj, index) => {
                                    let previousMainCategoryStatus = obj.mainCategoryStatus;
                                    let previousSubCategoryStatus = obj.subCategoryStatus;
                                    // console.log("Previous sub category status in submitted tab :", previousSubCategoryStatus);
                                    return (
                                        <tr key={index}>
                                            <td className="rm-sticky-left-1">
                                                <div className="rm_sr_no">{index + 1}</div>
                                            </td>
                                            <td className="rm-sticky-left-2">
                                                <b>{obj["Company Name"]}</b>
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center justify-content-center wApp">
                                                    <div>{obj["Company Number"]}</div>
                                                    <a
                                                        href={`https://wa.me/${obj["Company Number"]}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{
                                                            marginLeft: "10px",
                                                            lineHeight: "14px",
                                                            fontSize: "14px",
                                                        }}
                                                    >
                                                        <FaWhatsapp />
                                                    </a>
                                                </div>
                                            </td>
                                            <td>{obj["Company Email"]}</td>
                                            <td>
                                                <div className="d-flex align-items-center justify-content-center wApp">
                                                    <div>{obj.caCase === "Yes" ? obj.caNumber : "N/A"}</div>
                                                    <a
                                                        href={`https://wa.me/${obj.caNumber}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{
                                                            marginLeft: "10px",
                                                            lineHeight: "14px",
                                                            fontSize: "14px",
                                                        }}
                                                    >
                                                        <FaWhatsapp />
                                                    </a>
                                                </div>
                                            </td>
                                            <td>{obj.serviceName}</td>
                                            <td>
                                                <div>
                                                    {obj.mainCategoryStatus && obj.subCategoryStatus && (
                                                        <DscLetterStatusDropdown
                                                            key={`${obj["Company Name"]}-${obj.serviceName}`} // Unique key
                                                            mainStatus={obj.mainCategoryStatus}
                                                            subStatus={obj.subCategoryStatus}
                                                            companyName={obj["Company Name"]}
                                                            serviceName={obj.serviceName}
                                                            refreshData={refreshData}
                                                            letterStatus={
                                                                obj.letterStatus ? obj.letterStatus : ""
                                                            }
                                                        />
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    {obj.mainCategoryStatus && obj.subCategoryStatus && (
                                                        <DscStatusDropdown
                                                            key={`${obj["Company Name"]}-${obj.serviceName}`} // Unique key
                                                            mainStatus={obj.mainCategoryStatus}
                                                            subStatus={obj.subCategoryStatus}
                                                            setNewSubStatus={setNewStatusProcess}
                                                            previousMainStatus={previousMainCategoryStatus}
                                                            previousSubStatus={previousSubCategoryStatus}
                                                            companyName={obj["Company Name"]}
                                                            serviceName={obj.serviceName}
                                                            refreshData={refreshData}
                                                            letterStatus={obj.letterStatus}
                                                            dscType={obj.dscType}
                                                            dscValidity={obj.dscValidity ? obj.dscValidity : ""}
                                                            dscPortal={obj.dscPortal ? obj.dscPortal : ""}
                                                        />
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <DscRemarks
                                                    key={`${obj["Company Name"]}-${obj.serviceName}`} // Unique key
                                                    companyName={obj["Company Name"]}
                                                    serviceName={obj.serviceName}
                                                    refreshData={refreshData}
                                                    historyRemarks={obj.Remarks}
                                                    ename={employeeData.ename}
                                                    designation={employeeData.designation}
                                                    bdeName={obj.bdeName}
                                                    bdmName={obj.bdmName}
                                                />
                                            </td>
                                            <td>
                                                <div>
                                                    {obj.mainCategoryStatus && obj.subCategoryStatus && (
                                                        <DscPortalDropdown
                                                            key={`${obj["Company Name"]}-${obj.serviceName}`} // Unique key
                                                            mainStatus={obj.mainCategoryStatus}
                                                            subStatus={obj.subCategoryStatus}
                                                            companyName={obj["Company Name"]}
                                                            serviceName={obj.serviceName}
                                                            refreshData={refreshData}
                                                            dscPortal={obj.dscPortal}
                                                        />
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    {obj.mainCategoryStatus && obj.subCategoryStatus && (
                                                        <DscTypeDropdown
                                                            key={`${obj["Company Name"]}-${obj.serviceName}`} // Unique key
                                                            mainStatus={obj.mainCategoryStatus}
                                                            subStatus={obj.subCategoryStatus}
                                                            companyName={obj["Company Name"]}
                                                            serviceName={obj.serviceName}
                                                            refreshData={refreshData}
                                                            dscType={obj.dscType}
                                                        />
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    {obj.mainCategoryStatus && obj.subCategoryStatus && (
                                                        <DscValidityDropdown
                                                            key={`${obj["Company Name"]}-${obj.serviceName}`} // Unique key
                                                            mainStatus={obj.mainCategoryStatus}
                                                            subStatus={obj.subCategoryStatus}
                                                            companyName={obj["Company Name"]}
                                                            serviceName={obj.serviceName}
                                                            refreshData={refreshData}
                                                            dscValidity={obj.dscValidity}
                                                        />
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <DscPhoneNo
                                                    key={`${obj["Company Name"]}-${obj.serviceName}`} // Unique key
                                                    companyName={obj["Company Name"]}
                                                    serviceName={obj.serviceName}
                                                    refreshData={refreshData}
                                                    dscPhoneNo={
                                                        obj.dscPhoneNo
                                                            ? obj.dscPhoneNo
                                                            : obj["Company Number"]
                                                    }
                                                />
                                            </td>
                                            <td>
                                                <DscEmailId
                                                    key={`${obj["Company Name"]}-${obj.serviceName}`} // Unique key
                                                    companyName={obj["Company Name"]}
                                                    serviceName={obj.serviceName}
                                                    refreshData={refreshData}
                                                    dscEmailId={
                                                        obj.dscEmailId ? obj.dscEmailId : obj["Company Email"]
                                                    }
                                                />
                                            </td>
                                            <td>
                                                <DscPortalCharges
                                                    key={`${obj["Company Name"]}-${obj.serviceName}`} // Unique key
                                                    companyName={obj["Company Name"]}
                                                    serviceName={obj.serviceName}
                                                    refreshData={refreshData}
                                                    dscPortalCharges={obj.portalCharges}
                                                />
                                            </td>
                                            <td>
                                                <DscChargesPaidVia
                                                    key={`${obj["Company Name"]}-${obj.serviceName}`} // Unique key
                                                    companyName={obj["Company Name"]}
                                                    serviceName={obj.serviceName}
                                                    refreshData={refreshData}
                                                    chargesPaidVia={obj.chargesPaidVia}
                                                    mainStatus={obj.mainCategoryStatus}
                                                />
                                            </td>
                                            <td>
                                                <DscExpanceReimbursement
                                                    key={`${obj["Company Name"]}-${obj.serviceName}`} // Unique key
                                                    mainStatus={obj.mainCategoryStatus}
                                                    subStatus={obj.subCategoryStatus}
                                                    companyName={obj["Company Name"]}
                                                    serviceName={obj.serviceName}
                                                    refreshData={refreshData}
                                                    dscExpenseStatus={obj.expenseReimbursementStatus}
                                                    expenseDate={obj.expenseReimbursementDate}
                                                />
                                            </td>
                                            <td>
                                                {formatDatePro(obj.bookingDate)}
                                            </td>
                                            <td>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <div>
                                                    {obj.bdeName}
                                                    {
                                                        completeEmployeeInfo
                                                            .filter((employee) => employee.ename === obj.bdeName)
                                                            .map((employee) => (
                                                                <a
                                                                    key={employee.number} // Add a unique key for rendering a list
                                                                    href={`https://wa.me/${employee.number}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    style={{ marginLeft: '10px', lineHeight: '14px', fontSize: '14px' }}
                                                                >
                                                                    <FaWhatsapp />
                                                                </a>
                                                            ))
                                                    }
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center justify-content-center">

                                                <div>
                                                    {obj.bdmName}
                                                {
                                                        completeEmployeeInfo
                                                            .filter((employee) => employee.ename === obj.bdmName)
                                                            .map((employee) => (
                                                                <a
                                                                    key={employee.number} // Add a unique key for rendering a list
                                                                    href={`https://wa.me/${employee.number}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    style={{ marginLeft: '10px', lineHeight: '14px', fontSize: '14px' }}
                                                                >
                                                                    <FaWhatsapp />
                                                                </a>
                                                            ))
                                                    }
                                                </div>
                                            </div>
                                        </td>
                                            <td className="rm-sticky-action">
                                                <button
                                                    className="action-btn action-btn-primary"
                                                    onClick={() => {
                                                        handleRevokeCompanyToRecievedBox(
                                                            obj["Company Name"],
                                                            obj.serviceName
                                                        );
                                                    }}
                                                >
                                                    <FaRegEye />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                ) : (
                    !openBacdrop && (
                        <table className="no_data_table">
                            <div className="no_data_table_inner">
                                <Nodata />
                            </div>
                        </table>
                    )
                )}
            </div>
        </div>
    );
}

export default AdminExecutiveSubmittedPanel;