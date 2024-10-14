import React, { useEffect, useState } from "react";
import EmpNav from "./EmpNav.js";
import Header from "../components/Header";
import { useParams } from "react-router-dom";
import notificationSound from "../assets/media/iphone_sound.mp3";
import axios from "axios";
import { IconChevronLeft, IconEye } from "@tabler/icons-react";
import { IconChevronRight } from "@tabler/icons-react";
import { Drawer } from "@mui/material";
import { IoIosClose } from "react-icons/io";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import Swal from "sweetalert2";
import "../assets/table.css";
import "../assets/styles.css";
import Nodata from "../components/Nodata.jsx";
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
import RedesignedForm from "../admin/RedesignedForm.jsx";
import LeadFormPreview from "../admin/LeadFormPreview.jsx";
import AddLeadForm from "../admin/AddLeadForm.jsx";
import { FaWhatsapp } from "react-icons/fa";
import { TiArrowBack } from "react-icons/ti";
import { TiArrowForward } from "react-icons/ti";
import PropTypes from "prop-types";
import Tooltip from "@mui/material/Tooltip";
import { IoFilterOutline } from "react-icons/io5";
import { Country, State, City } from 'country-state-city';
import { jwtDecode } from "jwt-decode";
// import DrawerComponent from "../components/Drawer.js";
import CallHistory from "./CallHistory.jsx";
import { LuHistory } from "react-icons/lu";
import BdmMaturedCasesDialogBox from "./BdmMaturedCasesDialogBox.jsx";
import ProjectionDialog from "./ExtraComponents/ProjectionDialog.jsx";
import FeedbackDialog from "./ExtraComponents/FeedbackDialog.jsx";
import CsvImportDialog from "./ExtraComponents/ImportCSVDialog.jsx";
import EmployeeAddLeadDialog from "./ExtraComponents/EmployeeAddLeadDialog.jsx";
import EmployeeRequestDataDialog from "./ExtraComponents/EmployeeRequestDataDialog.jsx";
import RemarksDialog from "./ExtraComponents/RemarksDialog.jsx";
import { MdOutlinePostAdd } from "react-icons/md";
import { useQuery } from '@tanstack/react-query';

function EmployeePanelCopy({ status = "All" }) {

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

    //console.log(companyName, companyInco);

    const currentData = employeeData.slice(startIndex, endIndex);
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
            queryKey: ['newData', cleanString(data.ename), status],
            queryFn: async () => {
                const response = await axios.get(`${secretKey}/company-data/employees/${cleanString(data.ename)}`);
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
        }
    }, [queryData]);

    console.log("fetchedData", fetchedData);
    console.log("revertedData", revertedData); // Log the reverted data for verification


    return (
        <div>


        </div>
    );
}

export default EmployeePanelCopy;