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

function AdminExecutiveDefaulterPanel({ searchText }) {
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
  const [newStatusDefaulter, setNewStatusDefaulter] = useState("Defaulter");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const [completeRmData, setcompleteRmData] = useState([]);
  const [dataToFilter, setdataToFilter] = useState([]);
  // Fetch Data Function
  const fetchData = async (searchQuery = "") => {
    setOpenBacdrop(true);
    try {
      const employeeResponse = await axios.get(`${secretKey}/employee/einfo`);
      const userData = employeeResponse.data.find(
        (item) => item._id === adminExecutiveUserId
      );
      setEmployeeData(userData);

      const servicesResponse = await axios.get(
        `${secretKey}/rm-services/adminexecutivedata`,
        {
          params: { search: searchQuery },
        }
      );
      const servicesData = servicesResponse.data;

      if (Array.isArray(servicesData)) {
        const filteredData = servicesData
          .filter((item) => item.mainCategoryStatus === "Defaulter")
          .sort((a, b) => {
            const dateA = new Date(a.dateOfChangingMainStatus);
            const dateB = new Date(b.dateOfChangingMainStatus);
            return dateB - dateA; // Sort in descending order
          });
        setRmServicesData(filteredData);
        setcompleteRmData(filteredData);
        setdataToFilter(filteredData);
      } else {
        console.error(
          "Expected an array for services data, but got:",
          servicesData
        );
      }

      //setRmServicesData(filteredData);
    } catch (error) {
      console.error("Error fetching data", error.message);
    } finally {
      setOpenBacdrop(false);
    }
  };

  useEffect(() => {
    fetchData(searchText);
  }, [searchText]);

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

    return () => {
      socket.disconnect();
    };
  }, [newStatusDefaulter]);

  const refreshData = () => {
    fetchData(searchText);
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
          `${secretKey}/rm-services/delete_company_from_taskmanager_and_send_to_recievedbox`,
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
  const [filteredData, setFilteredData] = useState(rmServicesData);
  const [filterField, setFilterField] = useState("");
  const [activeFilterField, setActiveFilterField] = useState(null);
  const [filterPosition, setFilterPosition] = useState({ top: 10, left: 5 });
  const fieldRefs = useRef({});
  const filterMenuRef = useRef(null); // Ref for the filter menu container

  const handleFilter = (newData) => {
    setRmServicesData(newData);
  };

  const handleFilterClick = (field) => {
    if (activeFilterField === field) {
      // Toggle off if the same field is clicked again
      setShowFilterMenu(!showFilterMenu);
    } else {
      // Set the active field and show filter menu
      setActiveFilterField(field);
      setShowFilterMenu(true);

      // Get the position of the clicked filter icon
      const rect = fieldRefs.current[field].getBoundingClientRect();
      setFilterPosition({ top: rect.bottom, left: rect.left });
    }
  };

  console.log("rmservicesdata", rmServicesData);

  // Effect to handle clicks outside the filter menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterMenuRef.current &&
        !filterMenuRef.current.contains(event.target)
      ) {
        setShowFilterMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div className="table table-responsive table-style-3 m-0">
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
                <th className="G_rm-sticky-left-1">Sr.No</th>
                <th className="G_rm-sticky-left-2">
                  <div className="d-flex align-items-center justify-content-center position-relative">
                    <div>Booking Date</div>
                    <div className="RM_filter_icon">
                      <BsFilter />
                    </div>
                  </div>
                </th>
                <th className="G_rm-sticky-left-3">
                  <div className="d-flex align-items-center justify-content-center position-relative">
                    <div>Company Name</div>
                    <div className="RM_filter_icon">
                      <BsFilter />
                    </div>
                  </div>
                </th>
                <th>
                  <div className="d-flex align-items-center justify-content-center position-relative">
                    <div>Company Number</div>
                    <div className="RM_filter_icon">
                      <BsFilter />
                    </div>
                  </div>
                </th>
                <th>
                  <div className="d-flex align-items-center justify-content-center position-relative">
                    <div>Company Email</div>
                    <div className="RM_filter_icon">
                      <BsFilter />
                    </div>
                  </div>
                </th>
                <th>
                  <div className="d-flex align-items-center justify-content-center position-relative">
                    <div>CA Number</div>
                    <div className="RM_filter_icon">
                      <BsFilter />
                    </div>
                  </div>
                </th>
                <th>
                  <div className="d-flex align-items-center justify-content-center position-relative">
                    <div>Services Name</div>
                    <div className="RM_filter_icon">
                      <BsFilter />
                    </div>
                  </div>
                </th>
                <th>
                  <div className="d-flex align-items-center justify-content-center position-relative">
                    <div>Remarks</div>
                    <div className="RM_filter_icon">
                      <BsFilter />
                    </div>
                  </div>
                </th>
                <th>
                  <div className="d-flex align-items-center justify-content-center position-relative">
                    <div>Letter Status</div>
                    <div className="RM_filter_icon">
                      <BsFilter />
                    </div>
                  </div>
                </th>
                <th>
                  <div className="d-flex align-items-center justify-content-center position-relative">
                    <div>DSC Status</div>
                    <div className="RM_filter_icon">
                      <BsFilter />
                    </div>
                  </div>
                </th>
                <th>
                  <div className="d-flex align-items-center justify-content-center position-relative">
                    <div>DSC Portal</div>
                    <div className="RM_filter_icon">
                      <BsFilter />
                    </div>
                  </div>
                </th>
                <th>
                  <div className="d-flex align-items-center justify-content-center position-relative">
                    <div>DSC Type</div>
                    <div className="RM_filter_icon">
                      <BsFilter />
                    </div>
                  </div>
                </th>
                <th>
                  <div className="d-flex align-items-center justify-content-center position-relative">
                    <div>DSC Validity</div>
                    <div className="RM_filter_icon">
                      <BsFilter />
                    </div>
                  </div>
                </th>
                <th>
                  <div className="d-flex align-items-center justify-content-center position-relative">
                    <div>DSC Phone No</div>
                    <div className="RM_filter_icon">
                      <BsFilter />
                    </div>
                  </div>
                </th>
                <th>
                  <div className="d-flex align-items-center justify-content-center position-relative">
                    <div>DSC Email Id</div>
                    <div className="RM_filter_icon">
                      <BsFilter />
                    </div>
                  </div>
                </th>
                <th>
                  <div className="d-flex align-items-center justify-content-center position-relative">
                    <div>Portal Charges</div>
                    <div className="RM_filter_icon">
                      <BsFilter />
                    </div>
                  </div>
                </th>
                <th>
                  <div className="d-flex align-items-center justify-content-center position-relative">
                    <div>Charges Paid Via</div>
                    <div className="RM_filter_icon">
                      <BsFilter />
                    </div>
                  </div>
                </th>
                <th>
                  <div className="d-flex align-items-center justify-content-center position-relative">
                    <div>Reimbursement Status</div>
                    <div className="RM_filter_icon">
                      <BsFilter />
                    </div>
                  </div>
                </th>
                <th>
                  <div className="d-flex align-items-center justify-content-center position-relative">
                    <div>BDE</div>
                    <div className="RM_filter_icon">
                      <BsFilter />
                    </div>
                  </div>
                </th>
                <th>
                  <div className="d-flex align-items-center justify-content-center position-relative">
                    <div>BDM</div>
                    <div className="RM_filter_icon">
                      <BsFilter />
                    </div>
                  </div>
                </th>
                {/* <th>
                    <div className='d-flex align-items-center justify-content-center position-relative'>
                        <div>Total Payment </div>
                        <div className='RM_filter_icon'>
                            <BsFilter  />
                        </div>
                    </div>
                </th>
                <th>
                    <div className='d-flex align-items-center justify-content-center position-relative'>
                        <div>
                            Pending Payment
                        </div> 
                        <div className='RM_filter_icon'>
                            <BsFilter  />
                        </div>
                    </div>
                </th>
                <th>
                    <div className='d-flex align-items-center justify-content-center position-relative'>
                        <div> 
                            Received Payment
                        </div> 
                        <div className='RM_filter_icon'>
                            <BsFilter  />
                        </div>
                    </div>
                </th> */}
                <th className="rm-sticky-action">Action</th>
              </tr>
            </thead>
            <tbody>
              {rmServicesData &&
                rmServicesData.length !== 0 &&
                rmServicesData.map((obj, index) => (
                  <tr key={index}>
                    <td className="G_rm-sticky-left-1">
                      <div className="rm_sr_no">{index + 1}</div>
                    </td>
                    <td className="G_rm-sticky-left-2">
                      {formatDatePro(obj.bookingDate)}
                    </td>
                    <td className="G_rm-sticky-left-3">
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
                      <DscRemarks
                        key={`${obj["Company Name"]}-${obj.serviceName}`} // Unique key
                        companyName={obj["Company Name"]}
                        serviceName={obj.serviceName}
                        refreshData={refreshData}
                        historyRemarks={obj.Remarks}
                      />
                    </td>
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
                            setNewSubStatus={setNewStatusDefaulter}
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
                    <td>{obj.bdeName}</td>
                    <td>{obj.bdmName}</td>
                    <td className="rm-sticky-action">
                      <button className="action-btn action-btn-primary">
                        <FaRegEye />
                      </button>
                    </td>
                  </tr>
                ))}
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

export default AdminExecutiveDefaulterPanel;
