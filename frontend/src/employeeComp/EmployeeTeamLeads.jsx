// import React, { useState, useEffect } from "react";
// import EmpNav from "./EmpNav.js";
// import Header from "../components/Header";
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { FaWhatsapp } from "react-icons/fa";
// import NoData from '../../Components/NoData/NoData.jsx';
// import { Drawer, Icon, IconButton } from "@mui/material";
// import { IconChevronLeft, IconEye } from "@tabler/icons-react";
// import { IconChevronRight } from "@tabler/icons-react";
// import { GrStatusGood } from "react-icons/gr";
// import EditIcon from "@mui/icons-material/Edit";
// import { Dialog, DialogContent, DialogTitle } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import Swal from "sweetalert2";
// import { useCallback } from "react";
// import debounce from "lodash/debounce";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { RiEditCircleFill } from "react-icons/ri";
// import { IoClose } from "react-icons/io5";
// import Select from "react-select";
// import { options } from "../../../components/Options.js";
// import { IoAddCircle } from "react-icons/io5";
// import Slider from '@mui/material/Slider';
// import RedesignedForm from "../../../admin/RedesignedForm.jsx";
import React, { useEffect, useState } from "react";
import EmpNav from "./EmpNav.js";

import Header from "../components/Header";
import { useParams } from "react-router-dom";
import notificationSound from "../assets/media/iphone_sound.mp3";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import axios from "axios";
import { IconChevronLeft, IconEye } from "@tabler/icons-react";
import { IconChevronRight } from "@tabler/icons-react";
import { Drawer, Icon, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FontDownloadIcon from "@mui/icons-material/FontDownload";
import AttachmentIcon from "@mui/icons-material/Attachment";
import ImageIcon from "@mui/icons-material/Image";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import Select from "react-select";
import Swal from "sweetalert2";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import Form from "../components/Form.jsx";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import "../assets/table.css";
import "../assets/styles.css";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import Nodata from "../components/Nodata.jsx";
import EditForm from "../components/EditForm.jsx";
import { useCallback } from "react";
import debounce from "lodash/debounce";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { options } from "../components/Options.js";
import FilterListIcon from "@mui/icons-material/FilterList";
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
import Edit from "@mui/icons-material/Edit";
import EditableLeadform from "../admin/EditableLeadform.jsx";
import AddLeadForm from "../admin/AddLeadForm.jsx";
import { FaWhatsapp } from "react-icons/fa";
import EditableMoreBooking from "../admin/EditableMoreBooking.jsx";
import { RiShareForwardBoxFill } from "react-icons/ri";
import { RiShareForward2Fill } from "react-icons/ri";
import { TiArrowBack } from "react-icons/ti";
import { TiArrowForward } from "react-icons/ti";
import { MdNotInterested } from "react-icons/md";
import { RiInformationLine } from "react-icons/ri";
import PropTypes from "prop-types";
import Slider, { SliderThumb } from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import { GrStatusGood } from "react-icons/gr";
import { IoAddCircle } from "react-icons/io5";








function EmployeeTeamLeads() {
    const { userId } = useParams();
    const [data, setData] = useState([])
    const [dataStatus, setdataStatus] = useState("All");
    const [currentPage, setCurrentPage] = useState(0);
    const [sortStatus, setSortStatus] = useState("");
    const [selectedField, setSelectedField] = useState("Company Name");
    const [formOpen, setFormOpen] = useState(false);
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const frontendKey = process.env.REACT_APP_FRONTEND_KEY;
    const itemsPerPage = 500;
    const [currentData, setCurrentData] = useState([])
    const [BDMrequests, setBDMrequests] = useState(null);
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const [teamleadsData, setTeamLeadsData] = useState([]);
    const [teamData, setTeamData] = useState([])
    const [openbdmRequest, setOpenbdmRequest] = useState(false);
    const [openRemarks, setOpenRemarks] = useState(false)
    const [remarksHistory, setRemarksHistory] = useState([]);
    const [filteredRemarks, setFilteredRemarks] = useState([]);
    const [maturedID, setMaturedID] = useState("");
    const [currentForm, setCurrentForm] = useState(null);
    const [cid, setcid] = useState("");
    const [cstat, setCstat] = useState("");
    const [currentCompanyName, setCurrentCompanyName] = useState("");
    const [currentRemarks, setCurrentRemarks] = useState("");
    const [currentRemarksBdm, setCurrentRemarksBdm] = useState("");
    const [companyId, setCompanyId] = useState("");
    const [bdmNewStatus, setBdmNewStatus] = useState("Untouched");
    const [changeRemarks, setChangeRemarks] = useState("");
    const [updateData, setUpdateData] = useState({});
    const [projectionData, setProjectionData] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [citySearch, setcitySearch] = useState("");
    const [visibility, setVisibility] = useState("none");
    const [visibilityOther, setVisibilityOther] = useState("block");
    const [visibilityOthernew, setVisibilityOthernew] = useState("none");
    const [subFilterValue, setSubFilterValue] = useState("");
    const [month, setMonth] = useState(0);
    const [year, setYear] = useState(0);
    const [projectionDataNew, setProjectionDataNew] = useState([])




    const fetchData = async () => {
        try {
            const response = await axios.get(`${secretKey}/einfo`);

            // Set the retrieved data in the state
            const tempData = response.data;
            const userData = tempData.find((item) => item._id === userId);
            //console.log(tempData);
            setData(userData);
            //setmoreFilteredData(userData);
        } catch (error) {
            console.error("Error fetching data:", error.message);
        }
    };
    const [maturedBooking, setMaturedBooking] = useState(null);

    const fetchBDMbookingRequests = async () => {
        const bdmName = data.ename;
        // console.log("This is bdm", bdmName);
        try {
            const response = await axios.get(
                `${secretKey}/matured-get-requests-byBDM/${bdmName}`
            );
            const mainData = response.data[0]
            setBDMrequests(mainData);

            if (response.data.length !== 0) {
                setOpenbdmRequest(true);
                const companyName = mainData["Company Name"];
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const fetchProjections = async () => {
        try {
            const response = await axios.get(
                `${secretKey}/projection-data/${data.ename}`
            );
            const response2 = await axios.get(`${secretKey}/projection-data`)
            setProjectionData(response.data);
            setProjectionDataNew(response2.data)
        } catch (error) {
            console.error("Error fetching Projection Data:", error.message);
        }
    };

    useEffect(() => {
        fetchProjections();
    }, [data]);

    const fetchTeamLeadsData = async (status) => {
        const bdmName = data.ename
        try {
            const response = await axios.get(`${secretKey}/forwardedbybdedata/${bdmName}`)
            //console.log(response.data)



            setTeamData(response.data)
            if (bdmNewStatus === "Untouched") {
                setTeamLeadsData(response.data.filter((obj) => obj.bdmStatus === "Untouched").sort((a, b) => new Date(b.bdeForwardDate) - new Date(a.bdeForwardDate)))
                setBdmNewStatus("Untouched")
            }
            if (status === "Interested") {
                setTeamLeadsData(response.data.filter((obj) => obj.bdmStatus === "Interested").sort((a, b) => new Date(b.bdeForwardDate) - new Date(a.bdeForwardDate)))
                setBdmNewStatus("Interested")
            }
            if (status === "FollowUp") {
                setTeamLeadsData(response.data.filter((obj) => obj.bdmStatus === "FollowUp").sort((a, b) => new Date(b.bdeForwardDate) - new Date(a.bdeForwardDate)))
                setBdmNewStatus("FollowUp")
            }
            if (status === "Matured") {
                setTeamLeadsData(response.data.filter((obj) => obj.bdmStatus === "Matured").sort((a, b) => new Date(b.bdeForwardDate) - new Date(a.bdeForwardDate)))
                setBdmNewStatus("Matured")
            }
            if (status === "Not Interested") {
                setTeamLeadsData(response.data.filter((obj) => obj.bdmStatus === "Not Interested").sort((a, b) => new Date(b.bdeForwardDate) - new Date(a.bdeForwardDate)))
                setBdmNewStatus("NotInterested")
            }


            //console.log("response", response.data)
        } catch (error) {
            console.log(error)
        }
    }

    //console.log("teamdata", teamleadsData)

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        fetchTeamLeadsData()
        fetchBDMbookingRequests()
    }, [data.ename])

    //console.log("ename" , data.ename)


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


    const closePopUpRemarks = () => {
        setOpenRemarks(false)

    }
    const closePopUpRemarksEdit = () => {
        setOpenRemarksEdit(false)

    }

    const [filteredRemarksBde, setfilteredRemarksBde] = useState([])

    const functionopenpopupremarks = (companyID, companyStatus, companyName, bdmName, ename) => {
        setOpenRemarks(true);
        setfilteredRemarksBde(
            remarksHistory.filter((obj) => obj.companyID === companyID && obj.bdeName === ename)
        );

        //console.log("companyId", companyID)
        // console.log(remarksHistory.filter((obj) => obj.companyID === companyID))
        setcid(companyID);
        setCstat(companyStatus);
        setCurrentCompanyName(companyName);

    };

    //console.log(filteredRemarksBde, "bderemarks")




    const [openRemarksEdit, setOpenRemarksEdit] = useState(false)
    const [remarksBdmName, setRemarksBdmName] = useState("")
    const [bdeNameReject, setBdeNameReject] = useState("")


    const functionopenpopupremarksEdit = (companyID, companyStatus, companyName, bdmName, bdeName) => {
        setOpenRemarksEdit(true);
        setFilteredRemarks(
            remarksHistory.filter((obj) => obj.companyID === companyID && obj.bdmName === bdmName)
        );

        //console.log("this is new", bdeName)

        //console.log("companyId" , companyID)
        // console.log(remarksHistory.filter((obj) => obj.companyID === companyID))
        setBdeNameReject(bdeName)
        setcid(companyID);
        setCstat(companyStatus);
        setCurrentCompanyName(companyName);
        setRemarksBdmName(bdmName)
    };

    //console.log("tum rejected data", bdeNameReject)

    //console.log("filteredRemarks", filteredRemarks)

    //console.log("currentcompanyname", currentCompanyName);

    const fetchRemarksHistory = async () => {
        try {
            const response = await axios.get(`${secretKey}/remarks-history`);
            setRemarksHistory(response.data.reverse());
            setFilteredRemarks(response.data.filter((obj) => obj.companyID === cid));

            //console.log(response.data);
        } catch (error) {
            console.error("Error fetching remarks history:", error);
        }
    };


    useEffect(() => {
        fetchRemarksHistory();
    }, []);

    const debouncedSetChangeRemarks = useCallback(
        debounce((value) => {
            setChangeRemarks(value);
        }, 10), // Adjust the debounce delay as needed (e.g., 300 milliseconds)
        [] // Empty dependency array to ensure the function is memoized
    );

    const [isDeleted, setIsDeleted] = useState(false)
    const [maturedCompany, setMaturedCompany] = useState("")
    const [maturedEmail, setMaturedEmail] = useState("")
    const [maturedInco, setMaturedInco] = useState("")
    const [maturedId, setMaturedId] = useState("")
    const [maturedNumber, setMaturedNumber] = useState("")
    const [maturedOpen, setMaturedOpen] = useState(false)

    const handleRejectData = async (companyId) => {
        setIsDeleted(true)
    }

    const handleUpdate = async () => {
        // Now you have the updated Status and Remarks, perform the update logic
        //console.log(cid, cstat, changeRemarks, remarksBdmName);
        const Remarks = changeRemarks;
        if (Remarks === "") {
            Swal.fire({ title: "Empty Remarks!", icon: "warning" });
            return true;
        }
        try {
            if (isDeleted) {
                const response = await axios.post(`${secretKey}/teamleads-rejectdata/${cid}`, {
                    bdmAcceptStatus: "NotForwarded",
                    bdmName: "NoOne",
                })
                const response2 = await axios.post(`${secretKey}/update-remarks-bdm/${cid}`, {
                    Remarks,
                });
                const response3 = await axios.post(
                    `${secretKey}/remarks-history-bdm/${cid}`,
                    {
                        Remarks,
                        remarksBdmName,
                        currentCompanyName,

                    }
                );

                const response4 = await axios.post(
                    `${secretKey}/remarks-history/${cid}`, {
                    Remarks,
                    bdeName: bdeNameReject,
                    currentCompanyName

                })
                const response5 = await axios.post(`${secretKey}/post-updaterejectedfollowup/${currentCompanyName}` , {
                    caseType : "NotForwwarded"
                })
                
                //console.log("remarks", Remarks)
                if (response.status === 200) {
                    Swal.fire("Remarks updated!");
                    setChangeRemarks("");
                    // If successful, update the employeeData state or fetch data again to reflect changes
                    //fetchNewData(cstat);
                    setCurrentRemarks(changeRemarks)
                    fetchTeamLeadsData(cstat)
                    fetchRemarksHistory();
                    // setCstat("");
                    closePopUpRemarksEdit(); // Assuming fetchData is a function to fetch updated employee data
                } else {
                    // Handle the case where the API call was not successful
                    console.error("Failed to update status:", response.data.message);
                }

                //console.log("response", response.data);
                fetchTeamLeadsData();
                Swal.fire("Data Rejected");
                setIsDeleted(false)

            } else {
                const response = await axios.post(`${secretKey}/update-remarks-bdm/${cid}`, {
                    Remarks,
                });
                const response2 = await axios.post(
                    `${secretKey}/remarks-history-bdm/${cid}`,
                    {
                        Remarks,
                        remarksBdmName,

                    }
                );
                //console.log("remarks", Remarks)
                if (response.status === 200) {
                    Swal.fire("Remarks updated!");
                    setChangeRemarks("");
                    // If successful, update the employeeData state or fetch data again to reflect changes
                    //fetchNewData(cstat);
                    fetchTeamLeadsData(cstat)
                    fetchRemarksHistory();
                    // setCstat("");
                    closePopUpRemarksEdit(); // Assuming fetchData is a function to fetch updated employee data
                } else {
                    // Handle the case where the API call was not successful
                    console.error("Failed to update status:", response.data.message);
                }

            }
        } catch (error) {
            // Handle any errors that occur during the API call
            console.error("Error updating status:", error.message);
        }

        setUpdateData((prevData) => ({
            ...prevData,
            [companyId]: {
                ...prevData[companyId],
                isButtonEnabled: false,
            },
        }));

        //   // After updating, you can disable the button
    };

    console.log(projectionDataNew)

    const handleAcceptClick = async (
        companyId,
        cName,
        cemail,
        cdate,
        cnumber,
        oldStatus,
        newBdmStatus
    ) => {

        const DT = new Date();
        try {
            const response = await axios.post(`${secretKey}/update-bdm-status/${companyId}`, {
                newBdmStatus,
                companyId,
                oldStatus,
                bdmAcceptStatus: "Accept",
                bdmStatusChangeDate: new Date(),
                bdmStatusChangeTime: DT.toLocaleTimeString()
            })
            
            const filteredProjectionData = projectionDataNew.filter((company)=> company.companyName === cName)
            console.log(filteredProjectionData)

            if(filteredProjectionData.length !== 0){
                const response2 = await axios.post(`${secretKey}/post-followupupdate-bdmaccepted/${cName}` , {
                    caseType :"Recieved"
                })  
            }
            if (response.status === 200) {
                Swal.fire("Accepted");
                fetchTeamLeadsData(oldStatus);
                //setBdmNewStatus(oldStatus)
            } else {
                console.error("Failed to update status:", response.data.message);
            }
        } catch (error) {
            console.log("Error updating status", error.message)
        }
    }

    // const handlebdmStatusChange = async (
    //     companyId,
    //     bdmnewstatus,
    //     cname,
    //     cemail,
    //     cindate,
    //     cnum,
    //     bdeStatus,
    //     bdmOldStatus,
    //     bdeName
    // ) => {
    //     const title = `${data.ename} changed ${cname} status from ${bdmOldStatus} to ${bdmnewstatus}`;
    //     const DT = new Date();
    //     const date = DT.toLocaleDateString();
    //     const time = DT.toLocaleTimeString();
    //     const bdmStatusChangeDate = new Date();
    //     //console.log("bdmnewstatus", bdmnewstatus , date,time , bdmStatusChangeDate)
    //     try {

    //         if (bdmnewstatus !== "Matured" && bdmnewstatus !== "Busy" && bdmnewstatus !== "Not Picked Up") {
    //             const response = await axios.post(
    //                 `${secretKey}/bdm-status-change/${companyId}`,
    //                 {
    //                     bdeStatus,
    //                     bdmnewstatus,
    //                     title,
    //                     date,
    //                     time,
    //                     bdmStatusChangeDate,
    //                 }
    //             )
    //             //console.log("yahan dikha ", bdmnewstatus)
    //             // Check if the API call was successful
    //             if (response.status === 200) {
    //                 // Assuming fetchData is a function to fetch updated employee data

    //                 fetchTeamLeadsData(bdmnewstatus);
    //                 setBdmNewStatus(bdmnewstatus)
    //                 setTeamLeadsData(teamData.filter((obj) => obj.bdmStatus === bdmnewstatus).sort((a, b) => new Date(b.bdeForwardDate) - new Date(a.bdeForwardDate)))


    //             } else {
    //                 // Handle the case where the API call was not successful
    //                 console.error("Failed to update status:", response.data.message);
    //             }

    //         } else if (bdmnewstatus === "Busy" || bdmnewstatus === "Not Picked Up") {

    //             const response = await axios.delete(
    //                 `${secretKey}/delete-bdm-busy/${companyId}`)
    //             //console.log("yahan dikha", bdmnewstatus)
    //             // Check if the API call was successful
    //             if (response.status === 200) {
    //                 // Assuming fetchData is a function to fetch updated employee data

    //                 fetchTeamLeadsData(bdmnewstatus);
    //                 setBdmNewStatus(bdmnewstatus)
    //                 setTeamLeadsData(teamData.filter((obj) => obj.bdmStatus === bdmnewstatus).sort((a, b) => new Date(b.bdeForwardDate) - new Date(a.bdeForwardDate)))


    //             } else {
    //                 // Handle the case where the API call was not successful
    //                 console.error("Failed to update status:", response.data.message);
    //             }



    //         } else {
    //             const currentObject = teamData.find(obj => obj["Company Name"] === cname);
    //             setMaturedBooking(currentObject);
    //             setFormOpen(true)

    //         }

    //     } catch (error) {
    //         // Handle any errors that occur during the API call
    //         console.error("Error updating status:", error.message);
    //     }

    // }


    const handlebdmStatusChange = async (
        companyId,
        bdmnewstatus,
        cname,
        cemail,
        cindate,
        cnum,
        bdeStatus,
        bdmOldStatus,
        bdeName
    ) => {
        const title = `${data.ename} changed ${cname} status from ${bdmOldStatus} to ${bdmnewstatus}`;
        const DT = new Date();
        const date = DT.toLocaleDateString();
        const time = DT.toLocaleTimeString();
        const bdmStatusChangeDate = new Date();
        console.log("bdmnewstatus", bdmnewstatus, date, time, bdmStatusChangeDate)
        try {

            if (bdmnewstatus !== "Matured") {
                const response = await axios.post(
                    `${secretKey}/bdm-status-change/${companyId}`,
                    {
                        bdeStatus,
                        bdmnewstatus,
                        title,
                        date,
                        time,
                        bdmStatusChangeDate,
                    }
                )

                // Check if the API call was successful
                if (response.status === 200) {
                    // Assuming fetchData is a function to fetch updated employee data

                    fetchTeamLeadsData(bdmnewstatus);
                    setBdmNewStatus(bdmnewstatus)
                    setTeamLeadsData(teamData.filter((obj) => obj.bdmStatus === bdmnewstatus).sort((a, b) => new Date(b.bdeForwardDate) - new Date(a.bdeForwardDate)))


                } else {
                    // Handle the case where the API call was not successful
                    console.error("Failed to update status:", response.data.message);
                }

            } else {
                const currentObject = teamData.find(obj => obj["Company Name"] === cname);
                setMaturedBooking(currentObject);
                setFormOpen(true)

            }

        } catch (error) {
            // Handle any errors that occur during the API call
            console.error("Error updating status:", error.message);
        }

    }

    //console.log("bdmNewStatus" , bdmNewStatus)


    const handleDeleteRemarks = async (remarks_id, remarks_value) => {
        const mainRemarks = remarks_value === currentRemarks ? true : false;
        //console.log(mainRemarks);
        const companyId = cid;
        //console.log("Deleting Remarks with", remarks_id);
        try {
            // Send a delete request to the backend to delete the item with the specified ID
            await axios.delete(`${secretKey}/remarks-history/${remarks_id}`);
            if (mainRemarks) {
                await axios.delete(`${secretKey}/remarks-delete-bdm/${companyId}`);
            }
            // Set the deletedItemId state to trigger re-fetching of remarks history
            Swal.fire("Remarks Deleted");
            fetchRemarksHistory();
            fetchTeamLeadsData(cstat)
            //fetchNewData(cstat);
        } catch (error) {
            console.error("Error deleting remarks:", error);
        }
    };


    // -----------------------------projection------------------------------
    const [projectingCompany, setProjectingCompany] = useState("");
    const [openProjection, setOpenProjection] = useState(false);
    const [currentProjection, setCurrentProjection] = useState({
        companyName: "",
        ename: "",
        bdeName: "",
        offeredPrize: 0,
        offeredServices: [],
        lastFollowUpdate: "",
        totalPayment: 0,
        estPaymentDate: "",
        remarks: "",
        date: "",
        time: "",
        editCount: -1,
        totalPaymentError: "",
    });
    const [selectedValues, setSelectedValues] = useState([]);
    const [isEditProjection, setIsEditProjection] = useState(false);
    const [openAnchor, setOpenAnchor] = useState(false);
    const [bdeNameProjection, setBdeNameProjection] = useState("")
    const [bdeProjection, setBdeProjection] = useState([])


    const functionopenprojection = async (comName) => {
        let companyBdeProjection;
        try {
            const response = await axios.get(`${secretKey}/projection-data-company/${comName}`)
            companyBdeProjection = response.data
            setBdeProjection(response.data)
            //console.log("responseprojection", response.data)

        } catch (error) {
            console.log("error fetching details", error.message)
        }

        const getBdeName = teamleadsData.filter((company) => company["Company Name"] === comName);
        //console.log(getBdeName)

        if (getBdeName.length > 0) {
            const bdeName = getBdeName[0].ename;
            setBdeNameProjection(bdeName) // Accessing the 'ename' field from the first (and only) object
            //console.log("bdeename:", bdeName);
        } else {
            //console.log("No matching company found.");
        }
        setProjectingCompany(comName);
        setOpenProjection(true);

        //console.log("bdeprojection", bdeProjection)

        if (companyBdeProjection && companyBdeProjection.length !== 0) {
            const findOneprojection = companyBdeProjection[0]
            setIsEditProjection(false)
            setCurrentProjection({
                companyName: findOneprojection.companyName,
                ename: findOneprojection.ename,
                bdeName: bdeNameProjection ? bdeNameProjection : findOneprojection.ename,
                offeredPrize: findOneprojection.offeredPrize,
                offeredServices: findOneprojection.offeredServices,
                lastFollowUpdate: findOneprojection.lastFollowUpdate,
                estPaymentDate: findOneprojection.estPaymentDate,
                remarks: findOneprojection.remarks,
                totalPayment: findOneprojection.totalPayment,
                date: "",
                time: "",
                editCount: findOneprojection.editCount,
            });
            setSelectedValues(findOneprojection.offeredServices);
        } else {
            const findOneprojection =
                projectionData.length !== 0 &&
                projectionData.find((item) => item.companyName === comName);
            if (findOneprojection) {
                setCurrentProjection({
                    companyName: findOneprojection.companyName,
                    ename: findOneprojection.ename,
                    bdeName: bdeNameProjection ? bdeNameProjection : findOneprojection.ename,
                    offeredPrize: findOneprojection.offeredPrize,
                    offeredServices: findOneprojection.offeredServices,
                    lastFollowUpdate: findOneprojection.lastFollowUpdate,
                    estPaymentDate: findOneprojection.estPaymentDate,
                    remarks: findOneprojection.remarks,
                    totalPayment: findOneprojection.totalPayment,
                    date: "",
                    time: "",
                    editCount: findOneprojection.editCount,
                });
                setSelectedValues(findOneprojection.offeredServices);
            } else {
                // Handle the case when no projection data is found
                setCurrentProjection({
                    companyName: "",
                    ename: "",
                    bdeName: bdeNameProjection ? bdeNameProjection : "",
                    offeredPrize: "",
                    offeredServices: "",
                    lastFollowUpdate: "",
                    estPaymentDate: "",
                    remarks: "",
                    totalPayment: "",
                    date: "",
                    time: "",
                    editCount: "",
                });
                setSelectedValues([]);
            }
        }
    };



    const closeProjection = () => {
        setOpenProjection(false);
        setProjectingCompany("");
        setCurrentProjection({
            companyName: "",
            ename: "",
            bdeName: "",
            offeredPrize: "",
            offeredServices: "",
            totalPayment: 0,
            lastFollowUpdate: "",
            remarks: "",
            date: "",
            time: "",
        });
        setIsEditProjection(false);
        setSelectedValues([]);
    };


    const functionopenAnchor = () => {
        setTimeout(() => {
            setOpenAnchor(true);
        }, 1000);
    };


    const closeAnchor = () => {
        setOpenAnchor(false);
    };
    const fetchRedesignedFormData = async () => {
        try {
            //console.log(maturedID);
            const response = await axios.get(
                `${secretKey}/bookings/redesigned-final-leadData`
            );
            const data = response.data.find((obj) => obj.company === maturedID);
            //console.log(data);
            setCurrentForm(data);
        } catch (error) {
            console.error("Error fetching data:", error.message);
        }
    };
    useEffect(() => {
        //console.log("Matured ID Changed", maturedID);
        if (maturedID) {
            fetchRedesignedFormData();
        }
    }, [maturedID]);

    const handleDelete = async (company) => {
        const companyName = company;
        //console.log(companyName);

        try {
            // Send a DELETE request to the backend API endpoint
            const response = await axios.delete(
                `${secretKey}/delete-followup/${companyName}`
            );
            //console.log(response.data.message); // Log the response message
            // Show a success message after successful deletion
            //console.log("Deleted!", "Your data has been deleted.", "success");
            setCurrentProjection({
                companyName: "",
                ename: "",
                offeredPrize: 0,
                offeredServices: [],
                lastFollowUpdate: "",
                totalPayment: 0,
                estPaymentDate: "",
                remarks: "",
                date: "",
                time: "",
            });
            setSelectedValues([]);
            fetchProjections();
        } catch (error) {
            console.error("Error deleting data:", error);
            // Show an error message if deletion fails
            console.log("Error!", "Follow Up Not Found.", "error");
        }
    };

    const handleProjectionSubmit = async () => {
        try {
            const newEditCount =
                currentProjection.editCount === -1
                    ? 0
                    : currentProjection.editCount + 1;

            const finalData = {
                ...currentProjection,
                companyName: projectingCompany,
                ename: data.ename,
                bdeName: bdeNameProjection ? bdeNameProjection : data.ename,
                offeredServices: selectedValues,
                editCount: currentProjection.editCount + 1,
                caseType : "Recieved",
                bdmName : data.ename // Increment editCount
            };

            //console.log(finalData)

            if (finalData.offeredServices.length === 0) {
                Swal.fire({ title: "Services is required!", icon: "warning" });
            } else if (finalData.remarks === "") {
                Swal.fire({ title: "Remarks is required!", icon: "warning" });
            } else if (Number(finalData.totalPayment) === 0) {
                Swal.fire({ title: "Total Payment Can't be 0!", icon: "warning" });
            } else if (finalData.totalPayment === "") {
                Swal.fire({ title: "Total Payment Can't be 0", icon: "warning" });
            } else if (Number(finalData.offeredPrize) === 0) {
                Swal.fire({ title: "Offered Prize is required!", icon: "warning" });
            } else if (
                Number(finalData.totalPayment) > Number(finalData.offeredPrize)
            ) {
                Swal.fire({
                    title: "Total Payment cannot be greater than Offered Prize!",
                    icon: "warning",
                });
            } else if (finalData.lastFollowUpdate === null) {
                Swal.fire({
                    title: "Last FollowUp Date is required!",
                    icon: "warning",
                });
            } else if (finalData.estPaymentDate === 0) {
                Swal.fire({
                    title: "Estimated Payment Date is required!",
                    icon: "warning",
                });
            } else {
                // Send data to backend API
                const response = await axios.post(
                    `${secretKey}/update-followup`,
                    finalData
                );

                console.log(response.data)

                //console.log(response.data)
                Swal.fire({ title: "Projection Submitted!", icon: "success" });
                setOpenProjection(false);
                setCurrentProjection({
                    companyName: "",
                    ename: "",
                    bdeName: "",
                    offeredPrize: 0,
                    offeredServices: [],
                    lastFollowUpdate: "",
                    remarks: "",
                    date: "",
                    time: "",
                    editCount: newEditCount,
                    totalPaymentError: "", // Increment editCount
                });
                fetchProjections();
                setSelectedValues([]);
            }
        } catch (error) {
            console.error("Error updating or adding data:", error.message);
        }
    };

    const [openFeedback, setOpenFeedback] = useState(false)
    const [feedbackCompanyName, setFeedbackCompanyName] = useState("")
    const [valueSlider, setValueSlider] = useState(0)
    const [valueSlider2, setValueSlider2] = useState(0)
    const [valueSlider3, setValueSlider3] = useState(0)
    const [valueSlider4, setValueSlider4] = useState(0)
    const [valueSlider5, setValueSlider5] = useState(0)
    const [feedbackRemarks, setFeedbackRemarks] = useState("")
    const [companyFeedbackId, setCompanyFeedbackId] = useState("")
    const [isEditFeedback, setIsEditFeedback] = useState(false)
    const [feedbackPoints, setFeedbackPoints] = useState([])


    const handleOpenFeedback = (companyName, companyId, companyFeedbackPoints, companyFeedbackRemarks, bdmStatus) => {
        setOpenFeedback(true)
        setFeedbackCompanyName(companyName)
        setCompanyFeedbackId(companyId)
        setFeedbackPoints(companyFeedbackPoints)
        //setFeedbackRemarks(companyFeedbackRemarks)
        debouncedFeedbackRemarks(companyFeedbackRemarks)
        setValueSlider(companyFeedbackPoints[0])
        setValueSlider2(companyFeedbackPoints[1])
        setValueSlider3(companyFeedbackPoints[2])
        setValueSlider4(companyFeedbackPoints[3])
        setValueSlider5(companyFeedbackPoints[4])
        setBdmNewStatus(bdmStatus)
        //setIsEditFeedback(true)
    }
    //console.log("yahan locha h", feedbackPoints.length)



    const handleCloseFeedback = () => {
        setOpenFeedback(false)
        setValueSlider(0)
        setCompanyFeedbackId("")
        setFeedbackCompanyName("")
        setFeedbackRemarks("")
        setIsEditFeedback(false)
    }

    const handleSliderChange = (value, sliderNumber) => {
        switch (sliderNumber) {
            case 1:
                setValueSlider(value);
                break;
            case 2:
                setValueSlider2(value);
                break;
            case 3:
                setValueSlider3(value);
                break;
            case 4:
                setValueSlider4(value);
                break;
            case 5:
                setValueSlider5(value);
                break;
            default:
                break;
        }
    };


    //console.log("valueSlider", valueSlider, valueSlider2, valueSlider3, valueSlider4, valueSlider5)




    const debouncedFeedbackRemarks = useCallback(
        debounce((value) => {
            setFeedbackRemarks(value);
        }, 10), // Adjust the debounce delay as needed (e.g., 300 milliseconds)
        [] // Empty dependency array to ensure the function is memoized
    );

    const handleFeedbackSubmit = async () => {
        const data = {
            feedbackPoints: [valueSlider, valueSlider2, valueSlider3, valueSlider4, valueSlider5],
            feedbackRemarks: feedbackRemarks,
        };

        try {
            const response = await axios.post(`${secretKey}/post-feedback-remarks/${companyFeedbackId}`, data
            );

            if (response.status === 200) {
                Swal.fire("Feedback Updated");
                fetchTeamLeadsData(bdmNewStatus);
                setTeamLeadsData(teamData.filter((obj) => obj.bdmStatus === bdmNewStatus)
                    .sort((a, b) => new Date(b.bdeForwardDate) - new Date(a.bdeForwardDate)));
                handleCloseFeedback();
                //setdataStatus(bdmNewStatus)
            }
        } catch (error) {
            Swal.fire("Error sending feedback");
            console.log("error", error.message);
        }
    };


    const [nextFollowUpdate, setNextFollowUpDate] = useState(null)

    const functionSubmitNextFollowUpDate = async (nextFollowUpdate, companyId, companyStatus) => {

        const data = {
            bdmNextFollowUpDate: nextFollowUpdate
        }
        try {
            const resposne = await axios.post(`${secretKey}/post-bdmnextfollowupdate/${companyId}`, data)

            //console.log(resposne.data)
            fetchTeamLeadsData(companyStatus)

        } catch (error) {
            console.log("Error submitting Date", error)
        }

    }

    function formatDateNow(timestamp) {
        const date = new Date(timestamp);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    }

    //  ----------------------------------------  Filterization Process ---------------------------------------------

    const handleFieldChange = (event) => {
        if (
            event.target.value === "Company Incorporation Date  " ||
            event.target.value === "AssignDate"
        ) {
            setSelectedField(event.target.value);
            setVisibility("block");
            setVisibilityOther("none");
            setSubFilterValue("");
            setVisibilityOthernew("none");
        } else if (event.target.value === "Status") {
            setSelectedField(event.target.value);
            setVisibility("none");
            setVisibilityOther("none");
            setSubFilterValue("");
            setVisibilityOthernew("block");
        } else {
            setSelectedField(event.target.value);
            setVisibility("none");
            setVisibilityOther("block");
            setSubFilterValue("");
            setVisibilityOthernew("none");
        }

        //console.log(selectedField);
    };

    const handleDateChange = (e) => {
        const dateValue = e.target.value;
        setCurrentPage(0);

        // Check if the dateValue is not an empty string
        if (dateValue) {
            const dateObj = new Date(dateValue);
            const formattedDate = dateObj.toISOString().split("T")[0];
            setSearchText(formattedDate);
        } else {
            // Handle the case when the date is cleared
            setSearchText("");
        }
    };

    const filteredData = teamleadsData.filter((company) => {
        const fieldValue = company[selectedField];

        if (selectedField === "State" && citySearch) {
            // Handle filtering by both State and City
            const stateMatches = fieldValue
                .toLowerCase()
                .includes(searchText.toLowerCase());
            const cityMatches = company.City.toLowerCase().includes(
                citySearch.toLowerCase()
            );
            return stateMatches && cityMatches;
        } else if (selectedField === "Company Incorporation Date  ") {
            // Assuming you have the month value in a variable named `month`
            if (month == 0) {
                return fieldValue.includes(searchText);
            } else if (year == 0) {
                return fieldValue.includes(searchText);
            }
            const selectedDate = new Date(fieldValue);
            const selectedMonth = selectedDate.getMonth() + 1; // Months are 0-indexed
            const selectedYear = selectedDate.getFullYear();

            // Use the provided month variable in the comparison
            return (
                selectedMonth.toString().includes(month) &&
                selectedYear.toString().includes(year)
            );
        } else if (selectedField === "AssignDate") {
            // Assuming you have the month value in a variable named `month`
            return fieldValue.includes(searchText);
        } else if (selectedField === "Status" && searchText === "All") {
            // Display all data when Status is "All"
            return true;
        } else {
            // Your existing filtering logic for other fields
            if (typeof fieldValue === "string") {
                return fieldValue.toLowerCase().includes(searchText.toLowerCase());
            } else if (typeof fieldValue === "number") {
                return fieldValue.toString().includes(searchText);
            } else if (fieldValue instanceof Date) {
                // Handle date fields
                return fieldValue.includes(searchText);
            }

            return false;
        }
    });









    return (
        <div>

            <Header name={data.ename} designation={data.designation} />
            <EmpNav userId={userId} bdmWork={data.bdmWork} />
            {!formOpen && <div className="page-wrapper">
                {BDMrequests && (
                    <Dialog open={openbdmRequest}>
                        <DialogContent>
                            <div className="request-bdm-card">
                                <div className="request-title m-2 d-flex justify-content-between">
                                    <div className="request-content mr-2">
                                        Your Request to book form of{" "}
                                        <b>{BDMrequests["Company Name"]}</b> has been accepted by <b>{BDMrequests.bdeName}</b>
                                    </div>
                                    <div className="request-time">
                                        <IconButton onClick={() => setOpenbdmRequest(false)}>
                                            <CloseIcon style={{ height: "15px", width: "15px" }} />
                                        </IconButton>
                                    </div>

                                </div>
                                <div className="request-reply">

                                    <button
                                        onClick={() => {
                                            setFormOpen(true)
                                            setOpenbdmRequest(false)
                                        }}
                                        className="request-display"
                                    >
                                        Open Form
                                    </button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}

                <div className="page-body" onCopy={(e) => {
                    e.preventDefault();
                }}>
                    <div className="container-xl">
                        {/*  ----------------------------------------- Filter Starts from here...  ----------------------------------------------- */}
                        <div className="row g-2 align-items-center mb-2">
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                                className="features"
                            >
                                <div style={{ display: "flex" }} className="feature1">
                                    <div
                                        className="form-control"
                                        style={{ height: "fit-content", width: "auto" }}
                                    >
                                        <select
                                            style={{
                                                border: "none",
                                                outline: "none",
                                                width: "fit-content",
                                            }}
                                            value={selectedField}
                                            onChange={handleFieldChange}
                                        >
                                            <option value="Company Name">Company Name</option>
                                            <option value="Company Number">Company Number</option>
                                            <option value="Company Email">Company Email</option>
                                            <option value="Company Incorporation Date  ">
                                                Company Incorporation Date
                                            </option>
                                            <option value="City">City</option>
                                            <option value="State">State</option>
                                            <option value="Status">Status</option>
                                            <option value="AssignDate">Assigned Date</option>
                                        </select>
                                    </div>
                                    {visibility === "block" && (
                                        <div>
                                            <input
                                                onChange={handleDateChange}
                                                style={{
                                                    display: visibility,
                                                    width: "83%",
                                                    marginLeft: "10px",
                                                }}
                                                type="date"
                                                className="form-control"
                                            />
                                        </div>
                                    )}

                                    {visibilityOther === "block" ? (
                                        <div
                                            style={{
                                                //width: "20vw",
                                                margin: "0px 0px 0px 9px",
                                                display: visibilityOther,
                                            }}
                                            className="input-icon"
                                        >
                                            <span className="input-icon-addon">
                                                {/* <!-- Download SVG icon from http://tabler-icons.io/i/search --> */}
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
                                                type="text"
                                                value={searchText}
                                                onChange={(e) => {
                                                    setSearchText(e.target.value);
                                                    setCurrentPage(0);
                                                }}
                                                className="form-control"
                                                placeholder="Search…"
                                                aria-label="Search in website"
                                                style={{ width: "60%" }}
                                            />
                                        </div>
                                    ) : (
                                        <div></div>
                                    )}
                                    {visibilityOthernew === "block" ? (
                                        <div
                                            style={{
                                                //width: "20vw",
                                                margin: "0px 0px 0px 9px",
                                                display: visibilityOthernew,
                                            }}
                                            className="input-icon"
                                        >
                                            <select
                                                value={searchText}
                                                onChange={(e) => {
                                                    setSearchText(e.target.value);
                                                    // Set dataStatus based on selected option
                                                    if (
                                                        e.target.value === "All" ||
                                                        e.target.value === "Busy" ||
                                                        e.target.value === "Not Picked Up"
                                                    ) {
                                                        setdataStatus("All");
                                                        setTeamLeadsData(
                                                            teamData.filter(
                                                                (obj) =>
                                                                    obj.Status === "Busy" ||
                                                                    obj.Status === "Not Picked Up" ||
                                                                    obj.Status === "Untouched"
                                                            )
                                                        );
                                                    } else if (
                                                        e.target.value === "Junk" ||
                                                        e.target.value === "Not Interested"
                                                    ) {
                                                        setdataStatus("NotInterested");
                                                        setTeamLeadsData(
                                                            teamData.filter(
                                                                (obj) =>
                                                                    obj.Status === "Not Interested" ||
                                                                    obj.Status === "Junk"
                                                            )
                                                        );
                                                    } else if (e.target.value === "Interested") {
                                                        setdataStatus("Interested");
                                                        setTeamLeadsData(
                                                            teamData.filter(
                                                                (obj) => obj.Status === "Interested"
                                                            )
                                                        );
                                                    } else if (e.target.value === "Untouched") {
                                                        setdataStatus("All");
                                                        setTeamLeadsData(
                                                            teamData.filter(
                                                                (obj) => obj.Status === "Untouched"
                                                            )
                                                        );
                                                    }
                                                }}
                                                className="form-select"
                                            >
                                                <option value="All">All </option>
                                                <option value="Busy">Busy </option>
                                                <option value="Not Picked Up">
                                                    Not Picked Up{" "}
                                                </option>
                                                <option value="Junk">Junk</option>
                                                <option value="Interested">Interested</option>
                                                <option value="Not Interested">
                                                    Not Interested
                                                </option>
                                                <option value="Untouched">Untouched</option>
                                            </select>
                                        </div>
                                    ) : (
                                        <div></div>
                                    )}
                                    {searchText !== "" && (
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "end",
                                                fontsize: "10px",
                                                fontfamily: "Poppins",
                                                //marginLeft: "-70px"
                                            }}
                                            className="results"
                                        >
                                            {filteredData.length} results found
                                        </div>
                                    )}
                                </div>
                                <div
                                    style={{ display: "flex", alignItems: "center" }}
                                    className="feature2"
                                >
                                    <div
                                        className="form-control mr-1 sort-by"
                                        style={{ width: "190px" }}
                                    >
                                        <label htmlFor="sort-by">Sort By:</label>
                                        <select
                                            style={{
                                                border: "none",
                                                outline: "none",
                                                color: "#666a66",
                                            }}
                                            name="sort-by"
                                            id="sort-by"
                                            onChange={(e) => {
                                                setSortStatus(e.target.value);
                                                const selectedOption = e.target.value;

                                                switch (selectedOption) {
                                                    case "Busy":
                                                    case "Untouched":
                                                    case "Not Picked Up":
                                                        setdataStatus("All");
                                                        setTeamLeadsData(
                                                            teamData
                                                                .filter((data) =>
                                                                    [
                                                                        "Busy",
                                                                        "Untouched",
                                                                        "Not Picked Up",
                                                                    ].includes(data.Status)
                                                                )
                                                                .sort((a, b) => {
                                                                    if (a.Status === selectedOption)
                                                                        return -1;
                                                                    if (b.Status === selectedOption) return 1;
                                                                    return 0;
                                                                })
                                                        );
                                                        break;
                                                    case "Interested":
                                                        setdataStatus("Interested");
                                                        setTeamLeadsData(
                                                            teamData
                                                                .filter(
                                                                    (data) => data.Status === "Interested"
                                                                )
                                                                .sort((a, b) =>
                                                                    a.AssignDate.localeCompare(b.AssignDate)
                                                                )
                                                        );
                                                        break;
                                                    case "Not Interested":
                                                        setdataStatus("NotInterested");
                                                        setTeamLeadsData(
                                                            teamData
                                                                .filter((data) =>
                                                                    ["Not Interested", "Junk"].includes(
                                                                        data.Status
                                                                    )
                                                                )
                                                                .sort((a, b) =>
                                                                    a.AssignDate.localeCompare(b.AssignDate)
                                                                )
                                                        );
                                                        break;
                                                    case "FollowUp":
                                                        setdataStatus("FollowUp");
                                                        setTeamLeadsData(
                                                            teamData
                                                                .filter(
                                                                    (data) => data.Status === "FollowUp"
                                                                )
                                                                .sort((a, b) =>
                                                                    a.AssignDate.localeCompare(b.AssignDate)
                                                                )
                                                        );
                                                        break;

                                                    default:
                                                        // No filtering if default option selected
                                                        setdataStatus("All");
                                                        setTeamLeadsData(
                                                            teamData.sort((a, b) => {
                                                                if (a.Status === selectedOption) return -1;
                                                                if (b.Status === selectedOption) return 1;
                                                                return 0;
                                                            })
                                                        );
                                                        break;
                                                }
                                            }}
                                        >
                                            <option value="" disabled selected>
                                                Select Status
                                            </option>
                                            <option value="Untouched">Untouched</option>
                                            <option value="Busy">Busy</option>
                                            <option value="Not Picked Up">Not Picked Up</option>
                                            <option value="FollowUp">Follow Up</option>
                                            <option value="Interested">Interested</option>
                                            <option value="Not Interested">Not Interested</option>
                                        </select>
                                    </div>

                                    {selectedField === "State" && (
                                        <div style={{ width: "15vw" }} className="input-icon">
                                            <span className="input-icon-addon">
                                                {/* <!-- Download SVG icon from http://tabler-icons.io/i/search --> */}
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
                                                type="text"
                                                className="form-control"
                                                value={citySearch}
                                                onChange={(e) => {
                                                    setcitySearch(e.target.value);
                                                    setCurrentPage(0);
                                                }}
                                                placeholder="Search City"
                                                aria-label="Search in website"
                                            />
                                        </div>
                                    )}
                                    {selectedField === "Company Incorporation Date  " && (
                                        <>
                                            <div
                                                style={{ width: "fit-content" }}
                                                className="form-control"
                                            >
                                                <select
                                                    style={{
                                                        border: "none",
                                                        outline: "none",
                                                        marginRight: "10px",
                                                        width: "115px",
                                                        paddingLeft: "10px",
                                                    }}
                                                    onChange={(e) => {
                                                        setMonth(e.target.value);
                                                        setCurrentPage(0);
                                                    }}
                                                >
                                                    <option value="" disabled selected>
                                                        Select Month
                                                    </option>
                                                    <option value="12">December</option>
                                                    <option value="11">November</option>
                                                    <option value="10">October</option>
                                                    <option value="9">September</option>
                                                    <option value="8">August</option>
                                                    <option value="7">July</option>
                                                    <option value="6">June</option>
                                                    <option value="5">May</option>
                                                    <option value="4">April</option>
                                                    <option value="3">March</option>
                                                    <option value="2">February</option>
                                                    <option value="1">January</option>
                                                </select>
                                            </div>
                                            <div
                                                className="input-icon  form-control"
                                                style={{ margin: "0px 10px", width: "110px" }}
                                            >
                                                {/* <input
                            type="number"
                            value={year}
                            defaultValue="Select Year"
                            className="form-control"
                            placeholder="Select Year.."
                            onChange={(e) => {
                              setYear(e.target.value);
                            }}
                            aria-label="Search in website"
                          /> */}
                                                <select
                                                    select
                                                    style={{ border: "none", outline: "none" }}
                                                    value={year}
                                                    onChange={(e) => {
                                                        setYear(e.target.value);
                                                        setCurrentPage(0); // Reset page when year changes
                                                    }}
                                                >
                                                    <option value="">Select Year</option>
                                                    {[...Array(15)].map((_, index) => {
                                                        const yearValue = 2024 - index;
                                                        return (
                                                            <option key={yearValue} value={yearValue}>
                                                                {yearValue}
                                                            </option>
                                                        );
                                                    })}
                                                </select>
                                            </div>
                                        </>
                                    )}


                                </div>
                            </div>

                            {/* <!-- Page title actions --> */}
                        </div>

                        {/* -----------------------------------------    Table Starts from here   ------------------------------------------------ */}
                        <div class="card-header my-tab">
                            <ul class="nav nav-tabs card-header-tabs nav-fill p-0"
                                data-bs-toggle="tabs">
                                <li class="nav-item data-heading">
                                    <a
                                        href="#tabs-home-5"
                                        onClick={() => {
                                            setBdmNewStatus("Untouched");
                                            //setCurrentPage(0);
                                            setTeamLeadsData(
                                                teamData.filter(
                                                    (obj) =>
                                                        //obj.bdmStatus === "Busy" ||
                                                        //obj.bdmStatus === "Not Picked Up" ||
                                                        obj.bdmStatus === "Untouched"
                                                ).sort((a, b) => new Date(b.bdeForwardDate) - new Date(a.bdeForwardDate))
                                            );
                                        }}
                                        className={
                                            bdmNewStatus === "Untouched"
                                                ? "nav-link active item-act"
                                                : "nav-link"
                                        }
                                        data-bs-toggle="tab"
                                    >
                                        General{" "}
                                        <span className="no_badge">
                                            {
                                                teamData.filter(
                                                    (obj) =>
                                                        //obj.bdmStatus === "Busy" ||
                                                        //obj.bdmStatus === "Not Picked Up" ||
                                                        obj.bdmStatus === "Untouched"
                                                ).length
                                            }
                                        </span>
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a
                                        href="#tabs-activity-5"
                                        onClick={() => {
                                            setBdmNewStatus("Interested");
                                            //setCurrentPage(0);
                                            setTeamLeadsData(
                                                teamData.filter(
                                                    (obj) => obj.bdmStatus === "Interested"
                                                ).sort((a, b) => new Date(b.bdeForwardDate) - new Date(a.bdeForwardDate))
                                            );
                                        }}
                                        className={
                                            bdmNewStatus === "Interested"
                                                ? "nav-link active item-act"
                                                : "nav-link"
                                        }
                                        data-bs-toggle="tab"
                                    >
                                        Interested
                                        <span className="no_badge">
                                            {
                                                teamData.filter(
                                                    (obj) => obj.bdmStatus === "Interested"
                                                ).length
                                            }
                                        </span>
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a
                                        href="#tabs-activity-5"
                                        onClick={() => {
                                            setBdmNewStatus("FollowUp");
                                            //setCurrentPage(0);
                                            setTeamLeadsData(
                                                teamData.filter(
                                                    (obj) => obj.bdmStatus === "FollowUp"
                                                ).sort((a, b) => new Date(b.bdeForwardDate) - new Date(a.bdeForwardDate))
                                            );
                                        }}
                                        className={
                                            bdmNewStatus === "FollowUp"
                                                ? "nav-link active item-act"
                                                : "nav-link"
                                        }
                                        data-bs-toggle="tab"
                                    >
                                        Follow Up{" "}
                                        <span className="no_badge">
                                            {
                                                teamData.filter(
                                                    (obj) => obj.bdmStatus === "FollowUp"
                                                ).length
                                            }
                                        </span>
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a
                                        href="#tabs-activity-5"
                                        onClick={() => {
                                            setBdmNewStatus("Matured");
                                            //setCurrentPage(0);
                                            setTeamLeadsData(
                                                teamData
                                                    .filter((obj) => obj.bdmStatus === "Matured")
                                                    .sort((a, b) => new Date(b.bdeForwardDate) - new Date(a.bdeForwardDate))
                                            );
                                        }}
                                        className={
                                            bdmNewStatus === "Matured"
                                                ? "nav-link active item-act"
                                                : "nav-link"
                                        }
                                        data-bs-toggle="tab"
                                    >
                                        Matured{" "}
                                        <span className="no_badge">
                                            {" "}
                                            {
                                                teamData.filter(
                                                    (obj) => obj.bdmStatus === "Matured"
                                                ).length
                                            }
                                        </span>
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a
                                        href="#tabs-activity-5"
                                        onClick={() => {
                                            setBdmNewStatus("NotInterested");
                                            //setCurrentPage(0);
                                            setTeamLeadsData(
                                                teamData.filter(
                                                    (obj) =>
                                                        obj.bdmStatus === "Not Interested" ||
                                                        obj.bdmStatus === "Busy" ||
                                                        obj.bdmStatus === "Not Picked Up" ||
                                                        obj.bdmStatus === "Junk"
                                                )
                                            );
                                        }}
                                        className={
                                            bdmNewStatus === "NotInterested"
                                                ? "nav-link active item-act"
                                                : "nav-link"
                                        }
                                        data-bs-toggle="tab"
                                    >
                                        Not-Interested{" "}
                                        <span className="no_badge">
                                            {
                                                teamData.filter(
                                                    (obj) =>
                                                        obj.bdmStatus === "Not Interested" ||
                                                        obj.bdmStatus === "Busy" ||
                                                        obj.bdmStatus === "Not Picked Up" ||
                                                        obj.bdmStatus === "Junk"
                                                ).length
                                            }
                                        </span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="card">
                            <div className="card-body p-0" >
                                <div style={{
                                    overflowX: "auto",
                                    overflowY: "auto",
                                    maxHeight: "66vh",
                                }}>
                                    <table style={{
                                        width: "100%",
                                        borderCollapse: "collapse",
                                        border: "1px solid #ddd",
                                    }}
                                        className="table-vcenter table-nowrap">
                                        <thead>
                                            <tr className="tr-sticky">
                                                <th className="th-sticky">Sr.No</th>
                                                <th className="th-sticky1">Company Name</th>
                                                <th>BDE Name</th>
                                                <th>Company Number</th>
                                                <th>BDE Status</th>
                                                <th>BDE Remarks</th>
                                                {(bdmNewStatus === "Interested" || bdmNewStatus === "FollowUp" || bdmNewStatus === "Matured" || bdmNewStatus === "NotInterested") && (
                                                    <>
                                                        <th>BDM Status</th>
                                                        <th>BDM Remarks</th>
                                                    </>
                                                )}

                                                {bdmNewStatus === "FollowUp" && (
                                                    <th>Next FollowUp Date</th>
                                                )}

                                                <th>
                                                    Incorporation Date
                                                </th>
                                                <th>City</th>
                                                <th>State</th>
                                                <th>Company Email</th>
                                                <th>
                                                    BDE Forward Date
                                                </th>

                                                {(bdmNewStatus === "Untouched" || bdmNewStatus === "Matured") && <th>Action</th>}
                                                {(bdmNewStatus === "FollowUp" || bdmNewStatus === "Interested") && (<>
                                                    <th>Add Projection</th>
                                                    <th>Add Feedback</th>
                                                </>)
                                                }
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredData.map((company, index) => (
                                                <tr
                                                    key={index}
                                                    style={{ border: "1px solid #ddd" }}
                                                >
                                                    <td className="td-sticky">
                                                        {startIndex + index + 1}
                                                    </td>
                                                    <td className="td-sticky1">
                                                        {company["Company Name"]}
                                                    </td>
                                                    <td>{company.ename}</td>
                                                    <td>
                                                        <div className="d-flex align-items-center justify-content-between wApp">
                                                            <div>{company["Company Number"]}</div>
                                                            <a
                                                                target="_blank"
                                                                href={`https://wa.me/91${company["Company Number"]}`}
                                                            >
                                                                <FaWhatsapp />
                                                            </a>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {company.Status}
                                                    </td>
                                                    <td>
                                                        <div
                                                            key={company._id}
                                                            style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "space-between",
                                                                width: "100px",
                                                            }}>
                                                            <p
                                                                className="rematkText text-wrap m-0"
                                                                title={company.Remarks}
                                                            >
                                                                {!company["Remarks"]
                                                                    ? "No Remarks"
                                                                    : company.Remarks}
                                                            </p>
                                                            <IconButton
                                                                onClick={() => {
                                                                    functionopenpopupremarks(
                                                                        company._id,
                                                                        company.Status,
                                                                        company["Company Name"],
                                                                        company.bdmName,
                                                                        company.ename
                                                                    );
                                                                    //

                                                                    //setCurrentRemarks(company.Remarks);
                                                                    //setCurrentRemarksBdm(company.bdmRemarks)
                                                                    setCompanyId(company._id);
                                                                }}
                                                            >
                                                                <IconEye
                                                                    style={{
                                                                        width: "12px",
                                                                        height: "12px",
                                                                        color: "#fbb900"
                                                                    }}
                                                                />
                                                            </IconButton>
                                                        </div>
                                                    </td>
                                                    {(bdmNewStatus === "Interested" ||
                                                        bdmNewStatus === "FollowUp" ||
                                                        bdmNewStatus === "Matured" ||
                                                        bdmNewStatus === "NotInterested") && (
                                                            <>
                                                                <td>
                                                                    {company.bdmStatus === "Matured" ? (
                                                                        <span>{company.bdmStatus}</span>
                                                                    ) : (
                                                                        <select
                                                                            style={{
                                                                                background: "none",
                                                                                padding: ".4375rem .75rem",
                                                                                border:
                                                                                    "1px solid var(--tblr-border-color)",
                                                                                borderRadius:
                                                                                    "var(--tblr-border-radius)",
                                                                            }}
                                                                            value={company.bdmStatus}
                                                                            onChange={(e) =>
                                                                                handlebdmStatusChange(
                                                                                    company._id,
                                                                                    e.target.value,
                                                                                    company["Company Name"],
                                                                                    company["Company Email"],
                                                                                    company[
                                                                                    "Company Incorporation Date  "
                                                                                    ],
                                                                                    company["Company Number"],
                                                                                    company["Status"],
                                                                                    company.bdmStatus,
                                                                                    company.ename
                                                                                )
                                                                            }
                                                                        >
                                                                            <option value="Not Picked Up">
                                                                                Not Picked Up
                                                                            </option>
                                                                            <option value="Busy">Busy </option>
                                                                            <option value="Junk">Junk</option>
                                                                            <option value="Not Interested">
                                                                                Not Interested
                                                                            </option>
                                                                            {bdmNewStatus === "Interested" && (
                                                                                <>
                                                                                    <option value="Interested">
                                                                                        Interested
                                                                                    </option>
                                                                                    <option value="FollowUp">
                                                                                        Follow Up{" "}
                                                                                    </option>
                                                                                    <option value="Matured">
                                                                                        Matured
                                                                                    </option>
                                                                                </>
                                                                            )}

                                                                            {bdmNewStatus === "FollowUp" && (
                                                                                <>
                                                                                    <option value="FollowUp">
                                                                                        Follow Up{" "}
                                                                                    </option>
                                                                                    <option value="Matured">
                                                                                        Matured
                                                                                    </option>
                                                                                </>
                                                                            )}
                                                                            {bdmNewStatus === "NotInterested" && (
                                                                                <>
                                                                                    <option value="Interested">Interested</option>
                                                                                    <option value="FollowUp">Follow Up</option>
                                                                                </>
                                                                            )}
                                                                        </select>
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    <div
                                                                        key={company._id}
                                                                        style={{
                                                                            display: "flex",
                                                                            alignItems: "center",
                                                                            justifyContent: "space-between",
                                                                            width: "100px",
                                                                        }}
                                                                    >
                                                                        <p
                                                                            className="rematkText text-wrap m-0"
                                                                            title={company.bdmRemarks}
                                                                        >
                                                                            {!company.bdmRemarks
                                                                                ? "No Remarks"
                                                                                : company.bdmRemarks}

                                                                        </p>

                                                                        <IconButton
                                                                            onClick={() => {
                                                                                functionopenpopupremarksEdit(
                                                                                    company._id,
                                                                                    company.Status,
                                                                                    company["Company Name"],
                                                                                    company.bdmName,
                                                                                    company.ename
                                                                                );
                                                                                setCurrentRemarks(company.bdmRemarks);
                                                                                //setCurrentRemarksBdm(company.Remarks)
                                                                                setCompanyId(company._id);
                                                                            }}>
                                                                            <EditIcon
                                                                                style={{
                                                                                    width: "12px",
                                                                                    height: "12px",
                                                                                }}
                                                                            />
                                                                        </IconButton>
                                                                    </div>
                                                                </td>

                                                            </>
                                                        )}
                                                    {bdmNewStatus === "FollowUp" && (
                                                        <td> <input style={{ border: "none" }}
                                                            type="date"
                                                            value={formatDateNow(company.bdmNextFollowUpDate)}
                                                            onChange={(e) => {
                                                                //setNextFollowUpDate(e.target.value);
                                                                functionSubmitNextFollowUpDate(e.target.value,
                                                                    company._id,
                                                                    company.bdmStatus
                                                                );
                                                            }}
                                                        //className="hide-placeholder"
                                                        /></td>
                                                    )}
                                                    <td>
                                                        {formatDateNew(
                                                            company["Company Incorporation Date  "]
                                                        )}
                                                    </td>
                                                    <td>{company["City"]}</td>
                                                    <td>{company["State"]}</td>
                                                    <td>{company["Company Email"]}</td>
                                                    <td>{formatDateNew(company.bdeForwardDate)}</td>
                                                    {
                                                        company.bdmStatus === "Untouched" && (
                                                            <td>
                                                                <IconButton style={{ color: "green", marginRight: "5px", height: "25px", width: "25px" }}
                                                                    onClick={(e) => handleAcceptClick(
                                                                        company._id,
                                                                        //e.target.value,
                                                                        company["Company Name"],
                                                                        company["Company Email"],
                                                                        company[
                                                                        "Company Incorporation Date  "
                                                                        ],
                                                                        company["Company Number"],
                                                                        company["Status"],
                                                                        company.bdmStatus
                                                                    )}>
                                                                    <GrStatusGood />
                                                                </IconButton>
                                                                <IconButton onClick={() => {
                                                                    functionopenpopupremarksEdit(
                                                                        company._id,
                                                                        company.Status,
                                                                        company["Company Name"],
                                                                        company.bdmName,
                                                                        company.ename
                                                                    )
                                                                    handleRejectData(company._id)
                                                                }}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="red" style={{ width: "12px", height: "12px", color: "red" }}><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z" /></svg></IconButton>
                                                            </td>
                                                        )
                                                    }
                                                    {
                                                        bdmNewStatus === "Matured" && <>
                                                            <td>
                                                                <IconButton
                                                                    style={{ marginRight: "5px" }}
                                                                    onClick={() => {
                                                                        setMaturedID(company._id);
                                                                        functionopenAnchor();
                                                                    }}
                                                                >
                                                                    <IconEye
                                                                        style={{
                                                                            width: "14px",
                                                                            height: "14px",
                                                                            color: "#d6a10c",
                                                                            cursor: "pointer",
                                                                        }}
                                                                    />
                                                                </IconButton>

                                                            </td>
                                                        </>
                                                    }
                                                    {(bdmNewStatus === "FollowUp" || bdmNewStatus === "Interested") && (<>
                                                        <td>
                                                            {company &&
                                                                projectionData &&
                                                                projectionData.some(
                                                                    (item) => item.companyName === company["Company Name"]
                                                                ) ? (
                                                                <IconButton>
                                                                    <RiEditCircleFill
                                                                        onClick={() => {
                                                                            functionopenprojection(
                                                                                company["Company Name"]
                                                                            );
                                                                        }}
                                                                        style={{
                                                                            cursor: "pointer",
                                                                            width: "17px",
                                                                            height: "17px",
                                                                            color: "#fbb900", // Set color to yellow
                                                                        }}
                                                                    />
                                                                </IconButton>
                                                            ) : (
                                                                <IconButton>
                                                                    <RiEditCircleFill
                                                                        onClick={() => {
                                                                            functionopenprojection(
                                                                                company["Company Name"]
                                                                            );
                                                                            setIsEditProjection(true);
                                                                        }}

                                                                        style={{
                                                                            cursor: "pointer",
                                                                            width: "17px",
                                                                            height: "17px",
                                                                        }}
                                                                    />
                                                                </IconButton>
                                                            )}
                                                        </td>
                                                        <td>
                                                            {(company.feedbackRemarks || company.feedbackPoints.length !== 0) ? (<IconButton>
                                                                <IoAddCircle
                                                                    onClick={() => {
                                                                        handleOpenFeedback(
                                                                            company["Company Name"],
                                                                            company._id,
                                                                            company.feedbackPoints,
                                                                            company.feedbackRemarks,
                                                                            company.bdmStatus
                                                                        )
                                                                    }}
                                                                    style={{
                                                                        cursor: "pointer",
                                                                        width: "17px",
                                                                        height: "17px",
                                                                        color: "#fbb900"
                                                                    }} />
                                                            </IconButton>) : (
                                                                <IconButton>
                                                                    <IoAddCircle
                                                                        onClick={() => {
                                                                            handleOpenFeedback(
                                                                                company["Company Name"],
                                                                                company._id,
                                                                                company.feedbackPoints,
                                                                                company.feedbackRemarks,
                                                                                company.bdmStatus
                                                                            )
                                                                            setIsEditFeedback(true)
                                                                        }}
                                                                        style={{
                                                                            cursor: "pointer",
                                                                            width: "17px",
                                                                            height: "17px",
                                                                        }} />
                                                                </IconButton>

                                                            )}
                                                        </td>
                                                    </>)}


                                                </tr>
                                            ))}
                                        </tbody>
                                        {teamleadsData.length === 0 && (
                                            <tbody>
                                                <tr>
                                                    <td colSpan={bdmNewStatus === "Interested" || bdmNewStatus === "FollowUp" ? "15" : "11"} className="p-2 particular">
                                                        <Nodata />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        )}
                                        {teamleadsData.length !== 0 && (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                }}
                                                className="pagination"
                                            >
                                                <IconButton
                                                    onClick={() =>
                                                        setCurrentPage((prevPage) =>
                                                            Math.max(prevPage - 1, 0)
                                                        )
                                                    }
                                                    disabled={currentPage === 0}
                                                >
                                                    <IconChevronLeft />
                                                </IconButton>
                                                {/* <span>
                          Page {currentPage + 1} of{" "}
                          {Math.ceil(filteredData.length / itemsPerPage)}
                        </span> */}

                                                {/* <IconButton
                          onClick={() =>
                            setCurrentPage((prevPage) =>
                              Math.min(
                                prevPage + 1,
                                Math.ceil(filteredData.length / itemsPerPage) -
                                1
                              )
                            )
                          }
                          disabled={
                            currentPage ===
                            Math.ceil(filteredData.length / itemsPerPage) - 1
                          }
                        >
                          <IconChevronRight />
                        </IconButton> */}
                                            </div>
                                        )}
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>}
            {formOpen && maturedBooking && (
                <>
                    <RedesignedForm
                        // matured={true}
                        // companysId={companyId}
                        // setDataStatus={setdataStatus}

                        setFormOpen={setFormOpen}
                        companysName={maturedBooking["Company Name"]}
                        companysEmail={maturedBooking["Company Email"]}
                        companyNumber={maturedBooking["Company Number"]}
                        // setNowToFetch={setNowToFetch}
                        companysInco={maturedBooking["Company Incorporation Date  "]}
                        employeeName={maturedBooking.ename}

                        bdmName={maturedBooking.bdmName}
                    />
                </>
            )}
            {/* // -------------------------------------------------------------------Dialog for bde Remarks--------------------------------------------------------- */}

            <Dialog
                open={openRemarks}
                onClose={closePopUpRemarks}
                fullWidth
                maxWidth="sm">
                <DialogTitle>
                    <span style={{ fontSize: "14px" }}>
                        {currentCompanyName}'s Remarks
                    </span>
                    <IconButton onClick={closePopUpRemarks} style={{ float: "right" }}>
                        <CloseIcon color="primary"></CloseIcon>
                    </IconButton>{" "}
                </DialogTitle>
                <DialogContent>
                    <div className="remarks-content">
                        {filteredRemarksBde.length !== 0 ? (
                            filteredRemarksBde.slice().map((historyItem) => (
                                <div className="col-sm-12" key={historyItem._id}>
                                    <div className="card RemarkCard position-relative">
                                        <div className="d-flex justify-content-between">
                                            <div className="reamrk-card-innerText">
                                                <pre className="remark-text">{historyItem.remarks}</pre>
                                            </div>
                                        </div>

                                        <div className="d-flex card-dateTime justify-content-between">
                                            <div className="date">{historyItem.date}</div>
                                            <div className="time">{historyItem.time}</div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center overflow-hidden">
                                No Remarks History
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
            {/* ----------------------------------------------------dialog for editing popup by bdm--------------------------------------------- */}

            <Dialog
                open={openRemarksEdit}
                onClose={closePopUpRemarksEdit}
                fullWidth
                maxWidth="sm">
                <DialogTitle>
                    <span style={{ fontSize: "14px" }}>
                        {currentCompanyName}'s Remarks
                    </span>
                    <IconButton onClick={closePopUpRemarksEdit} style={{ float: "right" }}>
                        <CloseIcon color="primary"></CloseIcon>
                    </IconButton>{" "}
                </DialogTitle>
                <DialogContent>
                    <div className="remarks-content">
                        {filteredRemarks.length !== 0 ? (
                            filteredRemarks.slice().map((historyItem) => (
                                <div className="col-sm-12" key={historyItem._id}>
                                    <div className="card RemarkCard position-relative">
                                        <div className="d-flex justify-content-between">
                                            <div className="reamrk-card-innerText">
                                                <pre className="remark-text">{historyItem.bdmRemarks}</pre>
                                            </div>
                                            <div className="dlticon">
                                                <DeleteIcon
                                                    style={{
                                                        cursor: "pointer",
                                                        color: "#f70000",
                                                        width: "14px",
                                                    }}
                                                    onClick={() => {
                                                        handleDeleteRemarks(
                                                            historyItem._id,
                                                            historyItem.bdmRemarks
                                                        );
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="d-flex card-dateTime justify-content-between">
                                            <div className="date">{historyItem.date}</div>
                                            <div className="time">{historyItem.time}</div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center overflow-hidden">
                                No Remarks History
                            </div>
                        )}
                    </div>

                    <div class="card-footer">
                        <div class="mb-3 remarks-input">
                            <textarea
                                placeholder="Add Remarks Here...  "
                                className="form-control"
                                id="remarks-input"
                                rows="3"
                                value={changeRemarks}
                                onChange={(e) => {
                                    debouncedSetChangeRemarks(e.target.value);
                                }}
                            ></textarea>
                        </div>
                        <button
                            onClick={handleUpdate}
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: "100%" }}
                        >
                            Submit
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
            {/* --------------------------------------------------------- dialog for feedback----------------------------------------- */}

            {/* <Dialog
                open={openFeedback}
                onClose={handleCloseFeedback}
                fullWidth
                maxWidth="xs">
                <DialogTitle>
                    <span style={{ fontSize: "11px" }}>
                        BDM Feedback for {feedbackCompanyName}
                    </span>
                    <IconButton onClick={handleCloseFeedback} style={{ float: "right" }}>
                        <CloseIcon color="primary" style={{ width: "16px", height: "16px" }}></CloseIcon>
                    </IconButton>{" "}
                    {(valueSlider && feedbackRemarks) ? (<IconButton
                        onClick={() => {
                            setIsEditFeedback(true);
                        }}
                        style={{ float: "right" }}>
                        <EditIcon color="grey" style={{ width: "16px", height: "16px" }}></EditIcon>
                    </IconButton>) : (null)}
                </DialogTitle>
                <DialogContent>

                    <div className="card-body mt-5">
                        <div className="feedback-slider">
                            <Slider
                                defaultValue={0}
                                //getAriaValueText={valuetext} 
                                value={valueSlider}
                                onChange={(e) => { handleSliderChange(e.target.value) }}
                                sx={{ zIndex: "99999999", color: "#ffb900" }}
                                min={0}
                                max={10}
                                aria-label="Default"
                                valueLabelDisplay="auto"
                                disabled={!isEditFeedback} />
                        </div>

                    </div>

                    <div class="card-footer mt-4">
                        <div class="mb-3 remarks-input">
                            <textarea
                                placeholder="Add Remarks Here...  "
                                className="form-control"
                                id="remarks-input"
                                rows="3"
                                value={feedbackRemarks}
                                onChange={(e) => {
                                    debouncedFeedbackRemarks(e.target.value);
                                }}
                                disabled={!isEditFeedback}
                            ></textarea>
                        </div>
                        <button
                            onClick={handleFeedbackSubmit}
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: "100%" }}
                        >
                            Submit
                        </button>
                    </div>

                </DialogContent>
            </Dialog> */}

            <Dialog
                open={openFeedback}
                onClose={handleCloseFeedback}
                fullWidth
                maxWidth="xs">
                <DialogTitle>
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="m-0" style={{ fontSize: "16px" }}>Feedback Of <span className="text-wrap" >{feedbackCompanyName}</span></div>
                        {(feedbackPoints.length !== 0 || feedbackRemarks) ? (<IconButton
                            onClick={() => {
                                setIsEditFeedback(true);
                            }}
                            style={{ float: "right" }}>
                            <EditIcon color="grey" ></EditIcon>
                        </IconButton>) : (null)}
                        <IconButton onClick={handleCloseFeedback} style={{ float: "right" }}>
                            <CloseIcon color="primary"></CloseIcon>
                        </IconButton>{" "}
                    </div>
                </DialogTitle>
                <DialogContent>

                    <div className="card-body mt-5">
                        <div className="mt-1">
                            <div>a. How was the quality of Information?</div>
                            <div className="feedback-slider">
                                <Slider
                                    defaultValue={0}
                                    value={valueSlider}
                                    onChange={(e) => { handleSliderChange(e.target.value, 1) }} // Pass slider number as 1
                                    sx={{ zIndex: "99999999", color: "#ffb900" }}
                                    min={0}
                                    max={10}
                                    aria-label="Default"
                                    valueLabelDisplay="auto"
                                    disabled={!isEditFeedback} />
                            </div>
                        </div>
                        <div className="mt-1">
                            <div>b. How was the clarity of communication with lead?</div>
                            <div className="feedback-slider">
                                <Slider
                                    defaultValue={0}
                                    value={valueSlider2}
                                    onChange={(e) => { handleSliderChange(e.target.value, 2) }} // Pass slider number as 2
                                    sx={{ zIndex: "99999999", color: "#ffb900" }}
                                    min={0}
                                    max={10}
                                    aria-label="Default"
                                    valueLabelDisplay="auto"
                                    disabled={!isEditFeedback} />
                            </div>
                        </div>
                        <div className="mt-1">
                            <div>c. How was the accuracy of lead qualification?</div>
                            <div className="feedback-slider">
                                <Slider
                                    defaultValue={0}
                                    value={valueSlider3}
                                    onChange={(e) => { handleSliderChange(e.target.value, 3) }} // Pass slider number as 3
                                    sx={{ zIndex: "99999999", color: "#ffb900" }}
                                    min={0}
                                    max={10}
                                    aria-label="Default"
                                    valueLabelDisplay="auto"
                                    disabled={!isEditFeedback} />
                            </div>
                        </div>
                        <div className="mt-1">
                            <div>d. How was engagement level of lead?</div>
                            <div className="feedback-slider">
                                <Slider
                                    defaultValue={0}
                                    value={valueSlider4}
                                    onChange={(e) => { handleSliderChange(e.target.value, 4) }} // Pass slider number as 4
                                    sx={{ zIndex: "99999999", color: "#ffb900" }}
                                    min={0}
                                    max={10}
                                    aria-label="Default"
                                    valueLabelDisplay="auto"
                                    disabled={!isEditFeedback} />
                            </div>
                        </div>
                        <div className="mt-1">
                            <div>e. Payment Chances</div>
                            <div className="feedback-slider">
                                <Slider
                                    defaultValue={0}
                                    value={valueSlider5}
                                    onChange={(e) => { handleSliderChange(e.target.value, 5) }} // Pass slider number as 5
                                    sx={{ zIndex: "99999999", color: "#ffb900" }}
                                    min={0}
                                    max={100}
                                    aria-label="Default"
                                    valueLabelDisplay="auto"
                                    disabled={!isEditFeedback} />
                            </div>
                        </div>

                    </div>
                    <div class="card-footer mt-4">
                        <div class="mb-3 remarks-input">
                            <textarea
                                placeholder="Add Remarks Here...  "
                                className="form-control"
                                id="remarks-input"
                                rows="3"
                                value={feedbackRemarks}
                                onChange={(e) => {
                                    debouncedFeedbackRemarks(e.target.value);
                                }}
                                disabled={!isEditFeedback}
                            ></textarea>
                        </div>
                        <button
                            onClick={handleFeedbackSubmit}
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: "100%" }}
                        >
                            Submit
                        </button>
                    </div>

                </DialogContent>
            </Dialog>





            {/* ---------------------------------projection drawer--------------------------------------------------------- */}

            <div>
                <Drawer
                    style={{ top: "50px" }}
                    anchor="right"
                    open={openProjection}
                    onClose={closeProjection}>
                    <div style={{ width: "31em" }} className="container-xl">
                        <div
                            className="header d-flex justify-content-between align-items-center"
                            style={{ margin: "10px 0px" }}
                        >
                            <h1
                                style={{ marginBottom: "0px", fontSize: "23px" }}
                                className="title"
                            >
                                Projection Form
                            </h1>
                            <div>
                                {(bdeProjection && bdeProjection.some((item) => item.companyName === projectingCompany)) || (projectingCompany &&
                                    projectionData &&
                                    projectionData.some(
                                        (item) => item.companyName === projectingCompany
                                    )) ? (
                                    <>
                                        <IconButton
                                            onClick={() => {
                                                setIsEditProjection(true);
                                            }}
                                        >
                                            <EditIcon color="grey"></EditIcon>
                                        </IconButton>
                                    </>
                                ) : null}
                                {/* <IconButton
                  onClick={() => {
                    setIsEditProjection(true);
                  }}>
                  <EditIcon color="grey"></EditIcon>
                </IconButton> */}
                                {/* <IconButton onClick={() => handleDelete(projectingCompany)}>
                  <DeleteIcon
                    style={{
                      width: "16px",
                      height: "16px",
                      color: "#bf0b0b",
                    }}
                  >
                    Delete
                  </DeleteIcon>
                </IconButton> */}
                                <IconButton>
                                    <IoClose onClick={closeProjection} />
                                </IconButton>
                            </div>
                        </div>
                        <hr style={{ margin: "0px" }} />
                        <div className="body-projection">
                            <div className="header d-flex align-items-center justify-content-between">
                                <div>
                                    <h1
                                        title={projectingCompany}
                                        style={{
                                            fontSize: "14px",
                                            textShadow: "none",
                                            fontFamily: "sans-serif",
                                            fontWeight: "400",
                                            fontFamily: "Poppins, sans-serif",
                                            margin: "10px 0px",
                                            width: "200px",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        }}
                                    >
                                        {projectingCompany}
                                    </h1>
                                </div>
                                <div>
                                    <button
                                        onClick={() => handleDelete(projectingCompany)}
                                        className="btn btn-link"
                                        style={{ color: "grey" }}
                                    >
                                        Clear Form
                                    </button>
                                </div>
                            </div>
                            <div className="label">
                                <strong>
                                    Offered Services{" "}
                                    {selectedValues.length === 0 && (
                                        <span style={{ color: "red" }}>*</span>
                                    )}{" "}
                                    :
                                </strong>
                                <div className="services mb-3">
                                    <Select
                                        isMulti
                                        options={options}
                                        onChange={(selectedOptions) => {
                                            setSelectedValues(
                                                selectedOptions.map((option) => option.value)
                                            );
                                        }}
                                        value={selectedValues.map((value) => ({
                                            value,
                                            label: value,
                                        }))}
                                        placeholder="Select Services..."
                                        isDisabled={!isEditProjection}
                                    />
                                </div>
                            </div>
                            <div className="label">
                                <strong>
                                    Offered Prices(With GST){" "}
                                    {!currentProjection.offeredPrize && (
                                        <span style={{ color: "red" }}>*</span>
                                    )}{" "}
                                    :
                                </strong>
                                <div className="services mb-3">
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Please enter offered Prize"
                                        value={currentProjection.offeredPrize}
                                        onChange={(e) => {
                                            setCurrentProjection((prevLeadData) => ({
                                                ...prevLeadData,
                                                offeredPrize: e.target.value,
                                            }));
                                        }}
                                        disabled={!isEditProjection}
                                    />
                                </div>
                            </div>
                            <div className="label">
                                <strong>
                                    Expected Price (With GST)
                                    {currentProjection.totalPayment === 0 && (
                                        <span style={{ color: "red" }}>*</span>
                                    )}{" "}
                                    :
                                </strong>
                                <div className="services mb-3">
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Please enter total Payment"
                                        value={currentProjection.totalPayment}
                                        onChange={(e) => {
                                            const newTotalPayment = e.target.value;
                                            if (
                                                Number(newTotalPayment) <=
                                                Number(currentProjection.offeredPrize)
                                            ) {
                                                setCurrentProjection((prevLeadData) => ({
                                                    ...prevLeadData,
                                                    totalPayment: newTotalPayment,
                                                    totalPaymentError: "",
                                                }));
                                            } else {
                                                setCurrentProjection((prevLeadData) => ({
                                                    ...prevLeadData,
                                                    totalPayment: newTotalPayment,
                                                    totalPaymentError:
                                                        "Expected Price should be less than or equal to Offered Price.",
                                                }));
                                            }
                                        }}
                                        disabled={!isEditProjection}
                                    />

                                    <div style={{ color: "lightred" }}>
                                        {currentProjection.totalPaymentError}
                                    </div>
                                </div>
                            </div>

                            <div className="label">
                                <strong>
                                    Last Follow Up Date{" "}
                                    {!currentProjection.lastFollowUpdate && (
                                        <span style={{ color: "red" }}>*</span>
                                    )}
                                    :{" "}
                                </strong>
                                <div className="services mb-3">
                                    <input
                                        type="date"
                                        className="form-control"
                                        placeholder="Please enter offered Prize"
                                        value={currentProjection.lastFollowUpdate}
                                        onChange={(e) => {
                                            setCurrentProjection((prevLeadData) => ({
                                                ...prevLeadData,
                                                lastFollowUpdate: e.target.value,
                                            }));
                                        }}
                                        disabled={!isEditProjection}
                                    />
                                </div>
                            </div>
                            <div className="label">
                                <strong>
                                    Payment Expected on{" "}
                                    {!currentProjection.estPaymentDate && (
                                        <span style={{ color: "red" }}>*</span>
                                    )}
                                    :
                                </strong>
                                <div className="services mb-3">
                                    <input
                                        type="date"
                                        className="form-control"
                                        placeholder="Please enter Estimated Payment Date"
                                        value={currentProjection.estPaymentDate}
                                        onChange={(e) => {
                                            setCurrentProjection((prevLeadData) => ({
                                                ...prevLeadData,
                                                estPaymentDate: e.target.value,
                                            }));
                                        }}
                                        disabled={!isEditProjection}
                                    />
                                </div>
                            </div>
                            <div className="label">
                                <strong>
                                    Remarks{" "}
                                    {currentProjection.remarks === "" && (
                                        <span style={{ color: "red" }}>*</span>
                                    )}
                                    :
                                </strong>
                                <div className="remarks mb-3">
                                    <textarea
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter any Remarks"
                                        value={currentProjection.remarks}
                                        onChange={(e) => {
                                            setCurrentProjection((prevLeadData) => ({
                                                ...prevLeadData,
                                                remarks: e.target.value,
                                            }));
                                        }}
                                        disabled={!isEditProjection}
                                    />
                                </div>
                            </div>
                            <div className="submitBtn">
                                <button
                                    disabled={!isEditProjection}
                                    onClick={handleProjectionSubmit}
                                    style={{ width: "100%" }}
                                    type="submit"
                                    class="btn btn-primary mb-3"
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </Drawer>
            </div>

            {/*  --------------------------------     Bookings View Sidebar   --------------------------------------------- */}
            <Drawer anchor="right" open={openAnchor} onClose={closeAnchor}>
                <div style={{ minWidth: "60vw" }} className="LeadFormPreviewDrawar">
                    <div className="LeadFormPreviewDrawar-header">
                        <div className="Container">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h2 className="title m-0 ml-1">
                                        {currentForm ? currentForm["Company Name"] : "Company Name"}
                                    </h2>
                                </div>
                                <div>
                                    <IconButton onClick={closeAnchor}>
                                        <CloseIcon />
                                    </IconButton>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <LeadFormPreview
                            setOpenAnchor={setOpenAnchor}
                            currentLeadForm={currentForm}
                        />
                    </div>
                </div>
            </Drawer>


        </div>

    );
}

export default EmployeeTeamLeads;
