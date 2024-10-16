import React, { useEffect, useState ,useCallback} from "react";
import EmpNav from "../EmpNav.js";
import Header from "../../components/Header";
import { useParams } from "react-router-dom";
import notificationSound from "../../assets/media/iphone_sound.mp3";
import axios from "axios";
import { IconChevronLeft, IconEye } from "@tabler/icons-react";
import { IconChevronRight } from "@tabler/icons-react";
import { Drawer } from "@mui/material";
import { IoIosClose } from "react-icons/io";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import Swal from "sweetalert2";
import "../../assets/table.css";
import "../../assets/styles.css";
import Nodata from "../../components/Nodata.jsx";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import io from "socket.io-client";
import AddCircle from "@mui/icons-material/AddCircle.js";
import { HiOutlineEye } from "react-icons/hi";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { RiEditCircleFill } from "react-icons/ri";
import { IoCloseCircleOutline } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import ScaleLoader from "react-spinners/ScaleLoader";
import ClipLoader from "react-spinners/ClipLoader";
import { FaWhatsapp } from "react-icons/fa";
import { TiArrowBack } from "react-icons/ti";
import { TiArrowForward } from "react-icons/ti";
import PropTypes from "prop-types";
import Tooltip from "@mui/material/Tooltip";
import { IoFilterOutline } from "react-icons/io5";
import { Country, State, City } from 'country-state-city';
import { jwtDecode } from "jwt-decode";
// import DrawerComponent from "../components/Drawer.js";
import { LuHistory } from "react-icons/lu";
import { MdOutlinePostAdd } from "react-icons/md";
import { useQuery } from '@tanstack/react-query';
import RemarksDialog from "../ExtraComponents/RemarksDialog.jsx";
import ProjectionDialog from "../ExtraComponents/ProjectionDialog.jsx";
import BdmMaturedCasesDialogBox from "../BdmMaturedCasesDialogBox.jsx";
import FeedbackDialog from "../ExtraComponents/FeedbackDialog.jsx";
import EmployeeGeneralLeads from "../EmployeeTabPanels/EmployeeGeneralLeads.jsx";
import EmployeeInterestedLeads from "../EmployeeTabPanels/EmployeeInterestedLeads.jsx";
import EmployeeMaturedLeads from "../EmployeeTabPanels/EmployeeMaturedLeads.jsx";
import debounce from 'lodash/debounce';

function FetchingEmployeeData({ status = "All" }) {

    const [dataStatus, setdataStatus] = useState("All");
    const [employeeName, setEmployeeName] = useState("")
    const [filteredData, setFilteredData] = useState([]);
    const [revertedData, setRevertedData] = useState([])
    const [data, setData] = useState([]);
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const [employeeData, setEmployeeData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 500;
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const { userId } = useParams();
    const [moreEmpData, setmoreEmpData] = useState([]);
    const [extraData, setExtraData] = useState([]);
    const [tempData, setTempData] = useState([]);
    const [totalCounts, setTotalCounts] = useState({
        untouched: 0,
        interested: 0,
        matured: 0,
        forwarded: 0,
        notInterested: 0
    });
    const [totalPages, setTotalPages] = useState(0)
    function formatDate(inputDate) {
        const options = { year: "numeric", month: "long", day: "numeric" };
        const formattedDate = new Date(inputDate).toLocaleDateString(
            "en-US",
            options
        );
        return formattedDate;
    }

    function formatDateNew(timestamp) {
        const date = new Date(timestamp);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    function formatDateNow(timestamp) {
        const date = new Date(timestamp);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    }
    const [deletedEmployeeStatus, setDeletedEmployeeStatus] = useState(false)
    const [newBdeName, setNewBdeName] = useState("");
    const [fetchedData, setFetchedData] = useState([])
    const [moreFilteredData, setmoreFilteredData] = useState([])
    const fetchData = async () => {
        try {
            const response = await axios.get(`${secretKey}/employee/fetchEmployeeFromId/${userId}`);
            // Set the retrieved data in the state
            const userData = response.data.data;
            setEmployeeName(userData.ename)
            //console.log(userData);
            setData(userData);
            setmoreFilteredData(userData);
        } catch (error) {
            console.error("Error fetching data:", error.message);
        }
    };
    useEffect(() => {
        fetchData();

    }, [userId]);

    const cleanString = (str) => {
        return typeof str === 'string' ? str.replace(/\u00A0/g, ' ').trim() : '';
    };

    // Fetch employee data using React Query
    const { data: queryData, isLoading, isError, refetch } = useQuery(
        {
            queryKey: ['newData', cleanString(data.ename), dataStatus, currentPage],
            queryFn: async () => {
                const skip = currentPage * itemsPerPage; // Calculate skip based on current page
                const response = await axios.get(`${secretKey}/company-data/employees-new/${cleanString(data.ename)}`, {
                    params: {
                        dataStatus: dataStatus,
                        limit: itemsPerPage,
                        skip: skip
                    } // Send dataStatus as a query parameter
                });
                return response.data; // Directly return the data
            },
            enabled: !!data.ename, // Only fetch if data.ename is available
            staleTime: 300000, // Cache for 5 minutes
            cacheTime: 300000, // Cache for 5 minutes
        }
    );

    useEffect(() => {
        if (queryData) {
            // Assuming queryData now contains both data and revertedData
            setFetchedData(queryData.data); // Update the fetched data
            setRevertedData(queryData.revertedData); // Set revertedData based on response
            setmoreEmpData(queryData.data);
            setEmployeeData(queryData.data);
            setTotalCounts(queryData.totalCounts);
            setTotalPages(Math.ceil(queryData.totalPages)); // Calculate total pages
        }
    }, [queryData, dataStatus, currentPage]);


    // Create a debounced version of refetch
    const debouncedRefetch = useCallback(debounce(() => {
        refetch();
    }, 300), [refetch]);

    const handleDataStatusChange = useCallback((status) => {
        setdataStatus(status);
        setCurrentPage(0); // Reset to the first page
        debouncedRefetch(); // Call the debounced refetch function
    }, [debouncedRefetch]);
    console.log("fetchedData", fetchedData);
    console.log("revertedData", revertedData); // Log the reverted data for verification


    return (
        <div>
            <div onCopy={(e) => {
                e.preventDefault();
            }}
                className="page-body">
                <div className="container-xl">
                    <div class="card-header my-tab">
                        <ul class="nav nav-tabs card-header-tabs nav-fill p-0"
                            data-bs-toggle="tabs">
                            <li class="nav-item data-heading">
                                <a
                                    href="#k"
                                    onClick={() => handleDataStatusChange("All")}
                                    className={
                                        dataStatus === "All"
                                            ? "nav-link active item-act"
                                            : "nav-link"
                                    }
                                    data-bs-toggle="tab"
                                >
                                    General{" "}
                                    <span className="no_badge">
                                        {totalCounts.untouched}
                                    </span>
                                </a>
                            </li>
                            <li class="nav-item data-heading">
                                <a
                                    href="#Interested"
                                    onClick={() => handleDataStatusChange("Interested")}
                                    className={
                                        dataStatus === "Interested"
                                            ? "nav-link active item-act"
                                            : "nav-link"
                                    }
                                    data-bs-toggle="tab"
                                >
                                    Interested{" "}
                                    <span className="no_badge">
                                        {totalCounts.interested}
                                    </span>
                                </a>
                            </li>
                            <li class="nav-item data-heading">
                                <a
                                    href="#Matured"
                                    onClick={() => handleDataStatusChange("Matured")}
                                    className={
                                        dataStatus === "Matured"
                                            ? "nav-link active item-act"
                                            : "nav-link"
                                    }
                                    data-bs-toggle="tab"
                                >
                                    Matured{" "}
                                    <span className="no_badge">
                                        {totalCounts.matured}
                                    </span>
                                </a>
                            </li>
                            <li class="nav-item data-heading">
                                <a
                                    href="#tabs-home-5"
                                    onClick={() => {
                                        setdataStatus("Forwarded");
                                        setCurrentPage(0);
                                        refetch();
                                    }}
                                    className={
                                        dataStatus === "Forwarded"
                                            ? "nav-link active item-act"
                                            : "nav-link"
                                    }
                                    data-bs-toggle="tab"
                                >
                                    Forwarded{" "}
                                    <span className="no_badge">
                                        {totalCounts.forwarded}
                                    </span>
                                </a>
                            </li>
                            <li class="nav-item data-heading">
                                <a
                                    href="#tabs-home-5"
                                    onClick={() => {
                                        setdataStatus("Not Interested");
                                        setCurrentPage(0);
                                        refetch();
                                    }}
                                    className={
                                        dataStatus === "Not Interested"
                                            ? "nav-link active item-act"
                                            : "nav-link"
                                    }
                                    data-bs-toggle="tab"
                                >
                                    Not Interested{" "}
                                    <span className="no_badge">
                                        {totalCounts.notInterested}
                                    </span>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="tab-content card-body">
                        <div class="tab-pane active" id="k">
                            <EmployeeGeneralLeads
                                generalData={fetchedData}
                                isLoading={isLoading}
                                refetch={refetch}
                                formatDateNew={formatDateNew}
                                startIndex={startIndex}
                                endIndex={endIndex}
                                totalPages={totalPages}
                                setCurrentPage={setCurrentPage}
                                currentPage={currentPage}
                                dataStatus={dataStatus}
                                setdataStatus={setdataStatus}
                                ename={data.ename}
                                email={data.email}
                                secretKey={secretKey}
                            />
                        </div>
                        <div class="tab-pane" id="Interested">
                            <EmployeeInterestedLeads
                                interestedData={fetchedData}
                                isLoading={isLoading}
                                refetch={refetch}
                                formatDateNew={formatDateNew}
                                startIndex={startIndex}
                                endIndex={endIndex}
                                totalPages={totalPages}
                                setCurrentPage={setCurrentPage}
                                currentPage={currentPage}
                                secretKey={secretKey}
                                dataStatus={dataStatus}
                                ename={data.ename}
                                email={data.email}
                                setdataStatus={setdataStatus}
                            />
                        </div>
                        <div class="tab-pane" id="Matured">
                            <EmployeeMaturedLeads
                                maturedLeads={fetchedData}
                                isLoading={isLoading}
                                refetch={refetch}
                                formatDateNew={formatDateNew}
                                startIndex={startIndex}
                                endIndex={endIndex}
                                totalPages={totalPages}
                                setCurrentPage={setCurrentPage}
                                currentPage={currentPage}
                                secretKey={secretKey}
                                dataStatus={dataStatus}
                                ename={data.ename}
                                email={data.email}
                                setdataStatus={setdataStatus}
                            />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default FetchingEmployeeData;

// import React, { useEffect, useState, useCallback, useRef } from "react";
// import EmpNav from "./EmpNav.js";
// import Header from "../components/Header";
// import { useParams } from "react-router-dom";
// import notificationSound from "../assets/media/iphone_sound.mp3";
// import axios from "axios";
// // import { IconChevronLeft, IconEye } from "@tabler/icons-react";
// // import { IconChevronRight } from "@tabler/icons-react";
// // import { Drawer } from "@mui/material";
// // import { IoIosClose } from "react-icons/io";
// // import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
// import Swal from "sweetalert2";
// import "../assets/table.css";
// import "../assets/styles.css";
// import Nodata from "../components/Nodata.jsx";
// import SwapVertIcon from "@mui/icons-material/SwapVert";
// import io from "socket.io-client";
// import AddCircle from "@mui/icons-material/AddCircle.js";
// import { HiOutlineEye } from "react-icons/hi";
// import AddCircleIcon from "@mui/icons-material/AddCircle";
// import { RiEditCircleFill } from "react-icons/ri";
// import { IoCloseCircleOutline } from "react-icons/io5";
// import { IoClose } from "react-icons/io5";
// import ScaleLoader from "react-spinners/ScaleLoader";
// import ClipLoader from "react-spinners/ClipLoader";
// import RedesignedForm from "../admin/RedesignedForm.jsx";
// import LeadFormPreview from "../admin/LeadFormPreview.jsx";
// import AddLeadForm from "../admin/AddLeadForm.jsx";
// import { FaWhatsapp } from "react-icons/fa";
// import { TiArrowBack } from "react-icons/ti";
// import { TiArrowForward } from "react-icons/ti";
// import PropTypes from "prop-types";
// import Tooltip from "@mui/material/Tooltip";
// import { IoFilterOutline } from "react-icons/io5";
// import { Country, State, City } from 'country-state-city';
// import { jwtDecode } from "jwt-decode";
// // import DrawerComponent from "../components/Drawer.js";
// import CallHistory from "./CallHistory.jsx";
// import { LuHistory } from "react-icons/lu";
// import BdmMaturedCasesDialogBox from "./BdmMaturedCasesDialogBox.jsx";
// import ProjectionDialog from "./ExtraComponents/ProjectionDialog.jsx";
// import FeedbackDialog from "./ExtraComponents/FeedbackDialog.jsx";
// import CsvImportDialog from "./ExtraComponents/ImportCSVDialog.jsx";
// import EmployeeAddLeadDialog from "./ExtraComponents/EmployeeAddLeadDialog.jsx";
// import EmployeeRequestDataDialog from "./ExtraComponents/EmployeeRequestDataDialog.jsx";
// import RemarksDialog from "./ExtraComponents/RemarksDialog.jsx";
// import { MdOutlinePostAdd } from "react-icons/md";
// import EmployeeGeneralLeads from "./EmployeeTabPanels/EmployeeGeneralLeads.jsx";
// import { useQuery } from '@tanstack/react-query';
// import EmployeeInterestedLeads from "./EmployeeTabPanels/EmployeeInterestedLeads.jsx";
// import EmployeeMaturedLeads from "./EmployeeTabPanels/EmployeeMaturedLeads.jsx";
// import debounce from 'lodash/debounce';
// import Backdrop from '@mui/material/Backdrop';
// import CircularProgress from '@mui/material/CircularProgress';
// import EmployeeForwardedLeads from "./EmployeeTabPanels/EmployeeForwardedLeads.jsx";
// import EmployeeNotInterestedLeads from "./EmployeeTabPanels/EmployeeNotInterestedLeads.jsx";
// import EmployeeInfo from "./EmployeeTabPanels/EmployeeInfos.jsx";
// function EmployeePanelCopy() {

//     const [dataStatus, setdataStatus] = useState("All");
//     const [moreFilteredData, setmoreFilteredData] = useState([])
//     const [revertedData, setRevertedData] = useState([])
//     const [moreEmpData, setmoreEmpData] = useState([])
//     const [employeeData, setEmployeeData] = useState([])
//     const [showCallHistory, setShowCallHistory] = useState(false)
//     const [clientNumber, setClientNumber] = useState(null)
//     const [employeeName, setEmployeeName] = useState("")
//     const [data, setData] = useState([]);

//     const secretKey = process.env.REACT_APP_SECRET_KEY;

//     const [currentPage, setCurrentPage] = useState(0);

//     const itemsPerPage = 500;

//     const startIndex = currentPage * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;
//     const { userId } = useParams();

//     const [searchQuery, setSearchQuery] = useState("")


//     const [openBacdrop, setOpenBacdrop] = useState(false)


//     //console.log(companyName, companyInco);



//     useEffect(() => {
//         document.title = `Employee-Sahay-CRM`;
//     }, [data.ename]);




//     const fetchData = async () => {
//         try {
//             const response = await axios.get(`${secretKey}/employee/fetchEmployeeFromId/${userId}`);
//             // Set the retrieved data in the state
//             const userData = response.data.data;
//             setEmployeeName(userData.ename)
//             //console.log(userData);
//             setData(userData);
//             setmoreFilteredData(userData);
//         } catch (error) {
//             console.error("Error fetching data:", error.message);
//         }
//     };

//     useEffect(() => {
//         fetchData();

//     }, [userId]);





//     function formatDate(inputDate) {
//         const options = { year: "numeric", month: "long", day: "numeric" };
//         const formattedDate = new Date(inputDate).toLocaleDateString(
//             "en-US",
//             options
//         );
//         return formattedDate;
//     }

//     function formatDateNew(timestamp) {
//         const date = new Date(timestamp);
//         const day = date.getDate().toString().padStart(2, "0");
//         const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0
//         const year = date.getFullYear();
//         return `${day}/${month}/${year}`;
//     }

//     function formatDateNow(timestamp) {
//         const date = new Date(timestamp);
//         const day = date.getDate().toString().padStart(2, "0");
//         const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0
//         const year = date.getFullYear();
//         return `${year}-${month}-${day}`;
//     }



//     // --------------------------------------forward to bdm function---------------------------------------------\


//     function ValueLabelComponent(props) {
//         const { children, value } = props;

//         return (
//             <Tooltip enterTouchDelay={0} placement="top" title={value}>
//                 {children}
//             </Tooltip>
//         );
//     }

//     ValueLabelComponent.propTypes = {
//         children: PropTypes.element.isRequired,
//         value: PropTypes.number.isRequired,
//     };





//     // -------------------request dialog functions-------------------
//     const [open, openchange] = useState(false);
//     const functionopenpopup = () => {
//         openchange(true);
//     };

//     // Fetch employee data using React Query
//     const [fetchedData, setFetchedData] = useState([]);
//     const [totalCounts, setTotalCounts] = useState({
//         untouched: 0,
//         interested: 0,
//         matured: 0,
//         forwarded: 0,
//         notInterested: 0
//     });
//     const [totalPages, setTotalPages] = useState(0)
//     const cleanString = (str) => {
//         return typeof str === 'string' ? str.replace(/\u00A0/g, ' ').trim() : '';
//     };

//     const { data: queryData, isLoading, isError, refetch } = useQuery(
//         {
//             queryKey: ['newData', cleanString(data.ename), dataStatus, currentPage, searchQuery], // Add searchQuery to the queryKey
//             queryFn: async () => {
//                 const skip = currentPage * itemsPerPage; // Calculate skip based on current page
//                 const response = await axios.get(`${secretKey}/company-data/employees-new/${cleanString(data.ename)}`, {
//                     params: {
//                         dataStatus: dataStatus,
//                         limit: itemsPerPage,
//                         skip: skip,
//                         search: searchQuery // Send the search query as a parameter
//                     }
//                 });
//                 return response.data; // Directly return the data
//             },
//             enabled: !!data.ename, // Only fetch if data.ename is available
//             staleTime: 60000, // Cache for 1 minute
//             cacheTime: 60000, // Cache for 1 minute
//         }
//     );

//     // Handle search
//     const handleSearch = (query) => {
//         setSearchQuery(query);
//         setCurrentPage(0); // Reset to the first page on search
//         refetch(); // Refetch the data
//     };

//     useEffect(() => {
//         if (isLoading) {
//             setOpenBacdrop(true); // Set openBackDrop to true when loading
//         } else {
//             setOpenBacdrop(false); // Set openBackDrop to false when not loading
//         }

//         if (queryData) {
//             // Assuming queryData now contains both data and revertedData
//             setFetchedData(queryData.data); // Update the fetched data
//             setRevertedData(queryData.revertedData); // Set revertedData based on response
//             setmoreEmpData(queryData.data);
//             setEmployeeData(queryData.data);
//             setTotalCounts(queryData.totalCounts);
//             setTotalPages(Math.ceil(queryData.totalPages)); // Calculate total pages
//         }
//     }, [isLoading, queryData, dataStatus, currentPage]);
//     const [activeTabId, setActiveTabId] = useState("Interested"); // Track active tab ID

//     // Create a debounced version of refetch
//     const debouncedRefetch = useCallback(debounce(() => {
//         refetch();
//     }, 300), [refetch]);

//     const handleDataStatusChange = useCallback((status, tabRef) => {
//         setdataStatus(status);
//         setActiveTabId(status); // Set the active tab ID based on the clicked tab
//         setCurrentPage(0); // Reset to the first page
//         debouncedRefetch(); // Call the debounced refetch function
//         // Use the ref to trigger the click event on the corresponding anchor tag
//         if (tabRef && tabRef.current) {
//             tabRef.current.click(); // Programmatically click the anchor tag to trigger Bootstrap tab switch
//         }
//     }, [debouncedRefetch]);

//     const handleCloseBackdrop = () => {
//         setOpenBacdrop(false)
//     }

//     const handleShowCallHistory = (companyName, clientNumber) => {
//         console.log("idhrchala", companyName, clientNumber)
//         setShowCallHistory(true)
//         setClientNumber(clientNumber)
//     }

//     const hanleCloseCallHistory = () => {
//         setShowCallHistory(false);
//         setClientNumber(null)

//     };

//     // console.log("fetcgeheddata", fetchedData)
//     // console.log("dataStatus", dataStatus)
//     // console.log("showCallHistory", showCallHistory, clientNumber)

//     // In your EmployeePanelCopy component
//     const [selectedEmployee, setSelectedEmployee] = useState(null); // To hold selected employee info
//     const [showEmployeeInfo, setShowEmployeeInfo] = useState(false); // To control visibility
//     // Refs for tabs
//     const interestedTabRef = useRef(null); // Ref for the Interested tab
//     const maturedTabRef = useRef(null); // Ref for the Matured tab
//     const allTabRef = useRef(null); // Ref for the Matured tab
//     const handleShowEmployeeInfo = (employee) => {
//         setSelectedEmployee(employee);
//         setShowEmployeeInfo(true);
//     };

//     const handleCloseEmployeeInfo = () => {
//         setShowEmployeeInfo(false);
//         setSelectedEmployee(null);
//         // Ensure the last active tab is clicked by checking if the tab element exists
//         // setTimeout(() => {
//         //     const activeTabElement = document.querySelector(`[href="#${activeTabId}"]`);
//         //     console.log("activetab", activeTabElement, activeTabId)
//         //     if (activeTabElement) {
//         //         const tab = new Tab(activeTabElement); // Initialize Bootstrap's Tab
//         //         tab.show(); // Programmatically show the tab
//         //     } else {
//         //         console.error(`No element found for activeTabId: ${activeTabId}`);
//         //     }
//         // }, 0); // Timeout ensures this runs after re-render
//         // Use the last dataStatus to switch back to the corresponding tab
//         // Trigger the last active tab when closing employee info
//         if (activeTabId === "Interested" && interestedTabRef.current) {
//             interestedTabRef.current.click(); // Trigger the Interested tab click
//         } else if (activeTabId === "Matured" && maturedTabRef.current) {
//             maturedTabRef.current.click(); // Trigger the Matured tab click
//         }
//     };

//     console.log("showEmploeeInfo", showEmployeeInfo, selectedEmployee, dataStatus)

//     return (
//         <div>

//             <div className="page-wrapper">
//                 <div className="page-wrapper">
//                     <div className="page-header rm_Filter m-0">
//                         <div className="container-xl">
//                             <div className="d-flex align-items-center justify-content-between">
//                                 <div className="d-flex align-items-center">
//                                     <div className="btn-group mr-2">
//                                         <EmployeeAddLeadDialog
//                                             secretKey={secretKey}
//                                             fetchData={fetchData}
//                                             ename={data.ename}
//                                             refetch={refetch}
//                                         //fetchNewData={//fetchNewData}
//                                         />
//                                     </div>
//                                     <div className="btn-group" role="group" aria-label="Basic example">
//                                         {/* <button type="button"
//                                             className={isFilter ? 'btn mybtn active' : 'btn mybtn'}
//                                             onClick={() => setOpenFilterDrawer(true)}
//                                         >
//                                             <IoFilterOutline className='mr-1' /> Filter
//                                         </button> */}
//                                         <button type="button" className="btn mybtn"
//                                             onClick={functionopenpopup}
//                                         >
//                                             <MdOutlinePostAdd className='mr-1' /> Request Data
//                                         </button>
//                                         {open &&
//                                             <EmployeeRequestDataDialog
//                                                 secretKey={secretKey}
//                                                 ename={data.ename}
//                                                 setOpenChange={openchange}
//                                                 open={open}
//                                             />}

//                                     </div>
//                                 </div>
//                                 <div className="d-flex align-items-center">
//                                     <div class="input-icon ml-1">
//                                         <span class="input-icon-addon">
//                                             <svg xmlns="http://www.w3.org/2000/svg" class="icon mybtn" width="18" height="18" viewBox="0 0 22 22" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
//                                                 <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
//                                                 <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
//                                                 <path d="M21 21l-6 -6"></path>
//                                             </svg>
//                                         </span>
//                                         <input
//                                             value={searchQuery}
//                                             onChange={(e) => {
//                                                 setSearchQuery(e.target.value);
//                                                 handleSearch(e.target.value)
//                                                 //handleFilterSearch(e.target.value)
//                                                 //setCurrentPage(0);
//                                             }}
//                                             className="form-control search-cantrol mybtn"
//                                             placeholder="Search…"
//                                             type="text"
//                                             name="bdeName-search"
//                                             id="bdeName-search" />
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     {(!showEmployeeInfo) ? (
//                         <div onCopy={(e) => {
//                             e.preventDefault();
//                         }}
//                             className="page-body">
//                             <div className="container-xl">
//                                 <div class="card-header my-tab">
//                                     <ul class="nav nav-tabs card-header-tabs nav-fill p-0"
//                                         data-bs-toggle="tabs">
//                                         <li class="nav-item data-heading" >
//                                             <a
//                                                 href="#k"
//                                                 ref={allTabRef} // Attach the ref to the anchor tag
//                                                 onClick={() => handleDataStatusChange("Interested", allTabRef)}
//                                                 className={
//                                                     dataStatus === "All"
//                                                         ? "nav-link active item-act"
//                                                         : "nav-link"
//                                                 }
//                                                 data-bs-toggle="tab"
//                                             >
//                                                 General{" "}
//                                                 <span className="no_badge">
//                                                     {totalCounts.untouched}
//                                                 </span>
//                                             </a>
//                                         </li>
//                                         <li class="nav-item data-heading" ref={interestedTabRef}>
//                                             <a
//                                                 href="#Interested"
//                                                 ref={interestedTabRef} // Attach the ref to the anchor tag
//                                                 onClick={() => handleDataStatusChange("Interested", interestedTabRef)}
//                                                 className={`nav-link ${dataStatus === "Interested" ? "active" : ""}`}
//                                                 data-bs-toggle="tab"
//                                             >
//                                                 Interested
//                                             </a>
//                                         </li>
//                                         <li class="nav-item data-heading">
//                                             <a
//                                                 href="#Matured"
//                                                 onClick={() => handleDataStatusChange("Matured")}
//                                                 className={
//                                                     dataStatus === "Matured"
//                                                         ? "nav-link active item-act"
//                                                         : "nav-link"
//                                                 }
//                                                 data-bs-toggle="tab"
//                                             >
//                                                 Matured{" "}
//                                                 <span className="no_badge">
//                                                     {totalCounts.matured}
//                                                 </span>
//                                             </a>
//                                         </li>
//                                         <li class="nav-item data-heading">
//                                             <a
//                                                 href="#Forwarded"
//                                                 onClick={() => handleDataStatusChange("Forwarded")}
//                                                 className={
//                                                     dataStatus === "Forwarded"
//                                                         ? "nav-link active item-act"
//                                                         : "nav-link"
//                                                 }
//                                                 data-bs-toggle="tab"
//                                             >
//                                                 Forwarded{" "}
//                                                 <span className="no_badge">
//                                                     {totalCounts.forwarded}
//                                                 </span>
//                                             </a>
//                                         </li>
//                                         <li class="nav-item data-heading">
//                                             <a
//                                                 href="#NotInterested"
//                                                 onClick={() => {
//                                                     setdataStatus("Not Interested");
//                                                     setCurrentPage(0);
//                                                     refetch();
//                                                 }}
//                                                 className={
//                                                     dataStatus === "Not Interested"
//                                                         ? "nav-link active item-act"
//                                                         : "nav-link"
//                                                 }
//                                                 data-bs-toggle="tab"
//                                             >
//                                                 Not Interested{" "}
//                                                 <span className="no_badge">
//                                                     {totalCounts.notInterested}
//                                                 </span>
//                                             </a>
//                                         </li>
//                                     </ul>
//                                 </div>
//                                 <div className="tab-content card-body" >
//                                     {<div className={`tab-pane ${dataStatus === "Interested" ? "active" : ""}`} id="Interested">
//                                         {activeTabId === "Interested" &&
//                                             (<>
//                                                 {console.log("rendirring hre")}
//                                                 <EmployeeInterestedLeads
//                                                     interestedData={fetchedData}
//                                                     isLoading={isLoading}
//                                                     refetch={refetch}
//                                                     formatDateNew={formatDateNew}
//                                                     startIndex={startIndex}
//                                                     endIndex={endIndex}
//                                                     totalPages={totalPages}
//                                                     setCurrentPage={setCurrentPage}
//                                                     currentPage={currentPage}
//                                                     secretKey={secretKey}
//                                                     dataStatus={dataStatus}
//                                                     ename={data.ename}
//                                                     email={data.email}
//                                                     setdataStatus={setdataStatus}
//                                                     handleShowCallHistory={dataStatus === "Interested" ? handleShowCallHistory : () => { }}
//                                                     handleCloseCallHistory={dataStatus === "Interested" ? hanleCloseCallHistory : () => { }}
//                                                     handleShowEmployeeInfo={handleShowEmployeeInfo} // Pass the 
//                                                     showEmployeeInfo={showEmployeeInfo}
//                                                 /> </>)
//                                         }
//                                     </div>}

//                                 </div>
//                             </div>
//                         </div>
//                     ) : (
//                         <EmployeeInfo
//                             employee={selectedEmployee}
//                             onClose={handleCloseEmployeeInfo} // Pass the close handler
//                         />
//                     )
//                     }
//                 </div>
//             </div>


//             {/* --------------------------------backedrop------------------------- */}
//             {openBacdrop && (<Backdrop
//                 sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
//                 open={openBacdrop}
//                 onClick={handleCloseBackdrop}>
//                 <CircularProgress color="inherit" />
//             </Backdrop>)}
//             <div>
//                 {/* //----------------leads filter drawer-------------------------------
//                 <Drawer
//                     style={{ top: "50px" }}
//                     anchor="left"
//                     open={openFilterDrawer}
//                     onClose={functionCloseFilterDrawer}>
//                     <div style={{ width: "31em" }}>
//                         <div className="d-flex justify-content-between align-items-center container-xl pt-2 pb-2">
//                             <h2 className="title m-0">
//                                 Filters
//                             </h2>
//                             <div>
//                                 <button style={{ background: "none", border: "0px transparent" }} onClick={() => functionCloseFilterDrawer()}>
//                                     <IoIosClose style={{
//                                         height: "36px",
//                                         width: "32px",
//                                         color: "grey"
//                                     }} />
//                                 </button>
//                             </div>
//                         </div>
//                         <hr style={{ margin: "0px" }} />
//                         <div className="body-Drawer">
//                             <div className='container-xl mt-2 mb-2'>
//                                 <div className='row'>
//                                     <div className='col-sm-12 mt-3'>
//                                         <div className='form-group'>
//                                             <label for="exampleFormControlInput1" class="form-label">Status</label>
//                                             <select class="form-select form-select-md" aria-label="Default select example"
//                                                 value={selectedStatus}
//                                                 onChange={(e) => {
//                                                     setSelectedStatus(e.target.value)
//                                                 }}
//                                             >
//                                                 <option selected value='Select Status'>Select Status</option>
//                                                 <option value='Not Picked Up'>Not Picked Up</option>
//                                                 <option value="Busy">Busy</option>
//                                                 <option value="Junk">Junk</option>
//                                                 <option value="Not Interested">Not Interested</option>
//                                                 <option value="Untouched">Untouched</option>
//                                                 <option value="Interested">Interested</option>
//                                                 <option value="Matured">Matured</option>
//                                                 <option value="FollowUp">Followup</option>
//                                             </select>
//                                         </div>
//                                     </div>
//                                     <div className='col-sm-12 mt-2'>
//                                         <div className='d-flex align-items-center justify-content-between'>
//                                             <div className='form-group w-50 mr-1'>
//                                                 <label for="exampleFormControlInput1" class="form-label">State</label>
//                                                 <select class="form-select form-select-md" aria-label="Default select example"
//                                                     value={selectedState}
//                                                     onChange={(e) => {
//                                                         setSelectedState(e.target.value)
//                                                         setSelectedStateCode(stateList.filter(obj => obj.name === e.target.value)[0]?.isoCode);
//                                                         setSelectedCity(City.getCitiesOfState("IN", stateList.filter(obj => obj.name === e.target.value)[0]?.isoCode))
//                                                         //handleSelectState(e.target.value)
//                                                     }}
//                                                 >
//                                                     <option value=''>State</option>
//                                                     {stateList.length !== 0 && stateList.map((item) => (
//                                                         <option value={item.name}>{item.name}</option>
//                                                     ))}
//                                                 </select>
//                                             </div>
//                                             <div className='form-group w-50'>
//                                                 <label for="exampleFormControlInput1" class="form-label">City</label>
//                                                 <select class="form-select form-select-md" aria-label="Default select example"
//                                                     value={selectedNewCity}
//                                                     onChange={(e) => {
//                                                         setSelectedNewCity(e.target.value)
//                                                     }}
//                                                 >
//                                                     <option value="">City</option>
//                                                     {selectedCity.lenth !== 0 && selectedCity.map((item) => (
//                                                         <option value={item.name}>{item.name}</option>
//                                                     ))}
//                                                 </select>
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className='col-sm-12 mt-2'>
//                                         <div className='form-group'>
//                                             <label for="assignon" class="form-label">Assign On</label>
//                                             <input type="date" class="form-control" id="assignon"
//                                                 value={selectedAssignDate}
//                                                 placeholder="dd-mm-yyyy"
//                                                 defaultValue={null}
//                                                 onChange={(e) => setSelectedAssignDate(e.target.value)}
//                                             />
//                                         </div>
//                                     </div>
//                                     <div className='col-sm-12 mt-2'>
//                                         <label class="form-label">Incorporation Date</label>
//                                         <div className='row align-items-center justify-content-between'>
//                                             <div className='col form-group mr-1'>
//                                                 <select class="form-select form-select-md" aria-label="Default select example"
//                                                     value={selectedYear}
//                                                     onChange={(e) => {
//                                                         setSelectedYear(e.target.value)
//                                                     }}
//                                                 >
//                                                     <option value=''>Year</option>
//                                                     {years.length !== 0 && years.map((item) => (
//                                                         <option>{item}</option>
//                                                     ))}
//                                                 </select>
//                                             </div>
//                                             <div className='col form-group mr-1'>
//                                                 <select class="form-select form-select-md" aria-label="Default select example"
//                                                     value={selectedMonth}
//                                                     disabled={selectedYear === ""}
//                                                     onChange={(e) => {
//                                                         setSelectedMonth(e.target.value)
//                                                     }}
//                                                 >
//                                                     <option value=''>Month</option>
//                                                     {months && months.map((item) => (
//                                                         <option value={item}>{item}</option>
//                                                     ))}
//                                                 </select>
//                                             </div>
//                                             <div className='col form-group mr-1'>
//                                                 <select class="form-select form-select-md" aria-label="Default select example"
//                                                     disabled={selectedMonth === ''}
//                                                     value={selectedDate}
//                                                     onChange={(e) => setSelectedDate(e.target.value)}
//                                                 >
//                                                     <option value=''>Date</option>
//                                                     {daysInMonth.map((day) => (
//                                                         <option key={day} value={day}>{day}</option>
//                                                     ))}
//                                                 </select>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="footer-Drawer d-flex justify-content-between align-items-center">
//                             <button className='filter-footer-btn btn-clear'
//                                 onClick={handleClearFilter}
//                             >Clear Filter</button>
//                             <button className='filter-footer-btn btn-yellow'
//                                 onClick={handleFilterData}
//                             >Apply Filter</button>
//                         </div>
//                     </div>
//                 </Drawer> */}
//             </div>
//         </div>
//     );
// }

// export default EmployeePanelCopy;




