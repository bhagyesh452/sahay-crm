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
                const response = await axios.get(`${secretKey}/company-data/employees/${cleanString(data.ename)}`, {
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