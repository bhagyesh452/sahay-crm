import React, { useEffect, useState } from "react";
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
    //console.log(companyName, companyInco);

    // const currentData = employeeData.slice(startIndex, endIndex);
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
            queryKey: ['newData', cleanString(data.ename), dataStatus],
            queryFn: async () => {
                const response = await axios.get(`${secretKey}/company-data/employees/${cleanString(data.ename)}`, {
                    params: { dataStatus: dataStatus } // Send dataStatus as a query parameter
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
        }
    }, [queryData, dataStatus]);

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
                                    href="#tabs-home-5"
                                    onClick={() => {
                                        setdataStatus("All");
                                        setCurrentPage(0);
                                        refetch();
                                    }}
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
                                    href="#tabs-home-5"
                                    onClick={() => {
                                        setdataStatus("Interested");
                                        setCurrentPage(0);
                                        refetch();
                                    }}
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
                                    href="#tabs-home-5"
                                    onClick={() => {
                                        setdataStatus("Matured");
                                        setCurrentPage(0);
                                        refetch();
                                    }}
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
                    <div className="card">
                        <div className="card-body p-0">
                            <div
                                style={{
                                    overflowX: "auto",
                                    overflowY: "auto",
                                    maxHeight: "66vh",
                                }}>
                                <table
                                    style={{
                                        width: "100%",
                                        borderCollapse: "collapse",
                                        border: "1px solid #ddd",
                                    }}
                                    className="table-vcenter table-nowrap">
                                    <thead>
                                        <tr className="tr-sticky">
                                            <th className="th-sticky">Sr.No</th>
                                            <th className="th-sticky1">Company Name</th>
                                            <th>Company Number</th>
                                            <th>Call History</th>
                                            {dataStatus === "Forwarded" ? (<th>BDE Status</th>) : (<th>Status</th>)}
                                            {dataStatus === "Forwarded" ? (<th>BDE Remarks</th>) : (<th>Remarks</th>)}
                                            {dataStatus === "Forwarded" && <th>BDM Status</th>}
                                            {dataStatus === "Forwarded" && <th>BDM Remarks</th>}
                                            {dataStatus === "FollowUp" && (<th>Next FollowUp Date</th>)}

                                            <th>
                                                Incorporation Date
                                            </th>

                                            <th>City</th>
                                            <th>State</th>
                                            <th>Company Email</th>

                                            <th>
                                                Assigned Date
                                                {/* <SwapVertIcon
                                                    style={{
                                                        height: "15px",
                                                        width: "15px",
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={() => {
                                                        const sortedData = [...employeeData].sort(
                                                            (a, b) => {
                                                                if (sortOrder === "asc") {
                                                                    return b.AssignDate.localeCompare(
                                                                        a.AssignDate
                                                                    );
                                                                } else {
                                                                    return a.AssignDate.localeCompare(
                                                                        b.AssignDate
                                                                    );
                                                                }
                                                            }
                                                        );
                                                        setEmployeeData(sortedData);
                                                        setSortOrder(
                                                            sortOrder === "asc" ? "desc" : "asc"
                                                        );
                                                    }}
                                                /> */}
                                            </th>

                                            {dataStatus === "Matured" && <><th>
                                                Booking Date
                                            </th>
                                                <th>
                                                    Publish Date
                                                </th></>}
                                            {(dataStatus === "FollowUp" && (
                                                <th>Add Projection</th>
                                            )) || (dataStatus === "Interested" && (
                                                <th>Add Projection</th>
                                            )) || (dataStatus === "Matured" && (
                                                <th>Add Projection</th>
                                            ))}

                                            {dataStatus === "Forwarded" && (<>
                                                <th>BDM Name</th>
                                                <th>Forwarded Date</th>
                                            </>)}

                                            {(dataStatus === "Forwarded" ||
                                                dataStatus === "Interested" ||
                                                dataStatus === "FollowUp") && (
                                                    <th>Forward to BDM</th>
                                                )}
                                            {dataStatus === "Forwarded" &&
                                                (dataStatus !== "Interested" ||
                                                    dataStatus !== "FollowUp" ||
                                                    dataStatus !== "Untouched" ||
                                                    dataStatus !== "Matured" ||
                                                    dataStatus !== "Not Interested") && (
                                                    <th>Feedback</th>
                                                )}
                                        </tr>
                                    </thead>
                                    {isLoading ? (
                                        <tbody>
                                            <tr>
                                                <td colSpan="11" >
                                                    <div className="LoaderTDSatyle w-100" >
                                                        <ClipLoader
                                                            color="lightgrey"
                                                            loading
                                                            size={30}
                                                            aria-label="Loading Spinner"
                                                            data-testid="loader"
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    ) : (
                                        <tbody>
                                            {fetchedData.map((company, index) => (
                                                <tr
                                                    key={index}
                                                    style={{ border: "1px solid #ddd" }}
                                                >
                                                    <td className="td-sticky">{startIndex + index + 1}</td>
                                                    <td className="td-sticky1">{company["Company Name"]}</td>
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
                                                        <LuHistory onClick={() => {
                                                            // setShowCallHistory(true);
                                                            // setClientNumber(company["Company Number"]);
                                                        }}
                                                            style={{
                                                                cursor: "pointer",
                                                                width: "15px",
                                                                height: "15px",
                                                            }}
                                                            color="grey"
                                                        />
                                                    </td>
                                                    <td>
                                                        {company["Status"] === "Matured" ? (
                                                            <span>{company["Status"]}</span>
                                                        ) : (
                                                            <>
                                                                {company.bdmAcceptStatus ===
                                                                    "NotForwarded" && (
                                                                        <select
                                                                            style={{
                                                                                background: "none",
                                                                                padding: ".4375rem .75rem",
                                                                                border:
                                                                                    "1px solid var(--tblr-border-color)",
                                                                                borderRadius:
                                                                                    "var(--tblr-border-radius)",
                                                                            }}
                                                                        // value={company["Status"]}
                                                                        // onChange={(e) =>
                                                                        //     handleStatusChange(
                                                                        //         company,
                                                                        //         company._id,
                                                                        //         e.target.value,
                                                                        //         company["Company Name"],
                                                                        //         company["Company Email"],
                                                                        //         company[
                                                                        //         "Company Incorporation Date  "
                                                                        //         ],
                                                                        //         company["Company Number"],
                                                                        //         company["Status"],
                                                                        //         company.bdmAcceptStatus,
                                                                        //         company.isDeletedEmployeeCompany,
                                                                        //         company.ename
                                                                        //     )
                                                                        // }
                                                                        >
                                                                            {(dataStatus !== "Interested" && dataStatus !== "FollowUp") &&
                                                                                (<>
                                                                                    <option value="Not Picked Up">
                                                                                        Not Picked Up
                                                                                    </option>
                                                                                    <option value="Junk">Junk</option>
                                                                                </>
                                                                                )}
                                                                            <option value="Busy">Busy</option>

                                                                            <option value="Not Interested">
                                                                                Not Interested
                                                                            </option>
                                                                            {dataStatus === "All" && (
                                                                                <>
                                                                                    <option value="Untouched">
                                                                                        Untouched
                                                                                    </option>
                                                                                    <option value="Interested">
                                                                                        Interested
                                                                                    </option>
                                                                                </>
                                                                            )}
                                                                            {dataStatus === "Interested" && (
                                                                                <>
                                                                                    <option value="Interested">
                                                                                        Interested
                                                                                    </option>
                                                                                    {/* <option value="FollowUp">
                                                  Follow Up
                                                </option> */}
                                                                                    <option value="Matured">
                                                                                        Matured
                                                                                    </option>
                                                                                </>
                                                                            )}

                                                                        </select>
                                                                    )}
                                                                {(company.bdmAcceptStatus !==
                                                                    "NotForwarded") &&
                                                                    (company.Status === "Interested" ||
                                                                        company.Status === "FollowUp") && (
                                                                        <span>{company.bdeOldStatus}</span>
                                                                    )}

                                                                {(company.bdmAcceptStatus !==
                                                                    "NotForwarded") &&
                                                                    (company.Status === "Not Interested" || company.Status === "Junk" || company.Status === "Not Picked Up" || company.Status === "Busy") && (
                                                                        <select
                                                                            style={{
                                                                                color: "rgb(139, 139, 139)",
                                                                                background: "none",
                                                                                padding: ".4375rem .75rem",
                                                                                border:
                                                                                    "1px solid var(--tblr-border-color)",
                                                                                borderRadius:
                                                                                    "var(--tblr-border-radius)",
                                                                            }}
                                                                        // value={company["Status"]}
                                                                        // onChange={(e) =>
                                                                        //     handleStatusChange(
                                                                        //         company,
                                                                        //         company._id,
                                                                        //         e.target.value,
                                                                        //         company["Company Name"],
                                                                        //         company["Company Email"],
                                                                        //         company[
                                                                        //         "Company Incorporation Date  "
                                                                        //         ],
                                                                        //         company["Company Number"],
                                                                        //         company["Status"],
                                                                        //         company.bdmAcceptStatus,
                                                                        //         company.isDeletedEmployeeCompany,
                                                                        //         company.ename
                                                                        //     )
                                                                        // }
                                                                        >
                                                                            <option value="Not Picked Up">
                                                                                Not Picked Up
                                                                            </option>
                                                                            <option value="Busy">Busy</option>
                                                                            <option value="Junk">Junk</option>
                                                                            <option value="Not Interested">
                                                                                Not Interested
                                                                            </option>
                                                                            <option value="Interested">Interested</option>
                                                                            {/* <option value="FollowUp">Follow Up</option> */}
                                                                        </select>
                                                                    )}
                                                            </>
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
                                                                title={company.Remarks}
                                                            >
                                                                {!company["Remarks"]
                                                                    ? "No Remarks"
                                                                    : company.Remarks}
                                                            </p>
                                                            {/* <RemarksDialog
                                                                key={`${company["Company Name"]}-${index}`} // Using index or another field to create a unique key
                                                            // currentCompanyName={company["Company Name"]}
                                                            // remarksHistory={remarksHistory} // pass your remarks history data
                                                            // companyId={company._id}
                                                            // remarksKey="remarks" // Adjust this based on the type of remarks (general or bdm)
                                                            // isEditable={company.bdmAcceptStatus !== "Accept"} // Allow editing if status is not "Accept"
                                                            // bdmAcceptStatus={company.bdmAcceptStatus}
                                                            // companyStatus={company.Status}
                                                            // secretKey={secretKey}
                                                            // fetchRemarksHistory={fetchRemarksHistory}
                                                            // bdeName={company.ename}
                                                            // fetchNewData={fetchNewData}
                                                            // mainRemarks={company.Remarks}
                                                            /> */}
                                                        </div>
                                                    </td>
                                                    {dataStatus === "Forwarded" && (
                                                        <td>
                                                            {company.Status === "Interested" && (
                                                                <span>Interested</span>
                                                            )}
                                                            {company.Status === "FollowUp" && (
                                                                <span>FollowUp</span>
                                                            )}

                                                        </td>
                                                    )}
                                                    {dataStatus === "FollowUp" && <td>
                                                        <input style={{ border: "none" }}
                                                            type="date"
                                                            // value={formatDateNow(company.bdeNextFollowUpDate)}
                                                            // onChange={(e) => {
                                                            //     //setNextFollowUpDate(e.target.value);
                                                            //     functionSubmitNextFollowUpDate(e.target.value,
                                                            //         company._id,
                                                            //         company["Status"]
                                                            //     );
                                                            // }}
                                                        //className="hide-placeholder"
                                                        /></td>}
                                                    {dataStatus === "Forwarded" &&
                                                        <td>
                                                            <div key={company._id}
                                                                style={{
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "space-between",
                                                                    width: "100px",
                                                                }}>
                                                                <p
                                                                    className="rematkText text-wrap m-0"
                                                                    title={company.remarks}
                                                                >
                                                                    {!company.bdmRemarks
                                                                        ? "No Remarks"
                                                                        : company.bdmRemarks}
                                                                </p>
                                                                {/* <RemarksDialog
                                                                    key={`${company["Company Name"]}-${index}`} // Using index or another field to create a unique key
                                                                // currentCompanyName={company["Company Name"]}
                                                                // filteredRemarks={filteredRemarks}
                                                                // companyId={company._id}
                                                                // remarksKey="bdmRemarks" // For BDM remarks
                                                                // isEditable={false} // Disable editing
                                                                // secretKey={secretKey}
                                                                // fetchRemarksHistory={fetchRemarksHistory}
                                                                // bdeName={company.ename}
                                                                // fetchNewData={fetchNewData}
                                                                // bdmName={company.bdmName}
                                                                // bdmAcceptStatus={company.bdmAcceptStatus}
                                                                // companyStatus={company.Status}
                                                                // remarksHistory={remarksHistory} // pass your remarks history data
                                                                /> */}
                                                            </div>
                                                        </td>
                                                    }
                                                    <td>
                                                        {formatDateNew(
                                                            company["Company Incorporation Date  "]
                                                        )}
                                                    </td>
                                                    <td>{company["City"]}</td>
                                                    <td>{company["State"]}</td>
                                                    <td>{company["Company Email"]}</td>
                                                    <td>{formatDateNew(company["AssignDate"])}</td>
                                                    {dataStatus === "Matured" && <>
                                                        <td>{company.bookingDate}</td>
                                                        <td>{company.bookingPublishDate}</td>
                                                        {/* <td>
                                                            <ProjectionDialog
                                                                key={`${company["Company Name"]}-${index}`} // Using index or another field to create a unique key
                                                            // projectionCompanyName={company["Company Name"]}
                                                            // projectionData={projectionData}
                                                            // secretKey={secretKey}
                                                            // fetchProjections={fetchProjections}
                                                            // ename={data.ename}
                                                            // bdmAcceptStatus={company.bdmAcceptStatus}
                                                            // hasMaturedStatus={true}
                                                            // hasExistingProjection={projectionData?.some(
                                                            //     (item) => item.companyName === company["Company Name"]
                                                            // )}
                                                            />
                                                        </td> */}

                                                    </>}
                                                    {(dataStatus === "FollowUp" ||
                                                        dataStatus === "Interested") && (
                                                            <>
                                                                {/* <td>
                                                                    <ProjectionDialog
                                                                        key={`${company["Company Name"]}-${index}`} // Using index or another field to create a unique key
                                                                    // projectionCompanyName={company["Company Name"]}
                                                                    // projectionData={projectionData}
                                                                    // secretKey={secretKey}
                                                                    // fetchProjections={fetchProjections}
                                                                    // ename={data.ename}
                                                                    // bdmAcceptStatus={company.bdmAcceptStatus}
                                                                    // hasMaturedStatus={false}
                                                                    // hasExistingProjection={projectionData?.some(
                                                                    //     (item) => item.companyName === company["Company Name"]
                                                                    // )}
                                                                    />
                                                                </td> */}
                                                                {/* <td>
                                                                    <BdmMaturedCasesDialogBox
                                                                    // currentData={currentData}
                                                                    // forwardedCompany={company["Company Name"]}
                                                                    // forwardCompanyId={company._id}
                                                                    // forwardedStatus={company.Status}
                                                                    // forwardedEName={company.ename}
                                                                    // bdeOldStatus={company.Status}
                                                                    // bdmNewAcceptStatus={"Pending"}
                                                                    // fetchNewData={fetchNewData}
                                                                    />
                                                                </td> */}
                                                            </>
                                                        )}

                                                    {dataStatus === "Forwarded" && (<>
                                                        {company.bdmName !== "NoOne" ? (<td>{company.bdmName}</td>) : (<td></td>)}
                                                        <td>{formatDateNew(company.bdeForwardDate)}</td>
                                                    </>)}

                                                    {dataStatus === "Forwarded" && (
                                                        <td>
                                                            {company.bdmAcceptStatus === "NotForwarded" ? (<>

                                                                <TiArrowForward
                                                                    // onClick={() => {
                                                                    //     handleConfirmAssign(
                                                                    //         company._id,
                                                                    //         company["Company Name"],
                                                                    //         company.Status, // Corrected parameter name
                                                                    //         company.ename,
                                                                    //         company.bdmAcceptStatus
                                                                    //     );
                                                                    // }}
                                                                    style={{
                                                                        cursor: "pointer",
                                                                        width: "17px",
                                                                        height: "17px",
                                                                    }}
                                                                    color="grey"
                                                                />
                                                            </>) : company.bdmAcceptStatus === "Pending" || company.bdmAcceptStatus === "Forwarded" ? (<>

                                                                <TiArrowBack
                                                                    // onClick={() => {
                                                                    //     handleReverseAssign(
                                                                    //         company._id,
                                                                    //         company["Company Name"],
                                                                    //         company.bdmAcceptStatus,
                                                                    //         company.Status,
                                                                    //         company.bdmName
                                                                    //     )
                                                                    // }}
                                                                    style={{
                                                                        cursor: "pointer",
                                                                        width: "17px",
                                                                        height: "17px",
                                                                    }}
                                                                    color="#fbb900"
                                                                />
                                                            </>) :
                                                                (company.bdmAcceptStatus === "Accept" && !company.RevertBackAcceptedCompanyRequest) ? (
                                                                    <>
                                                                        <TiArrowBack
                                                                            // onClick={() => handleRevertAcceptedCompany(
                                                                            //     company._id,
                                                                            //     company["Company Name"],
                                                                            //     company.Status
                                                                            // )}
                                                                            style={{
                                                                                cursor: "pointer",
                                                                                width: "17px",
                                                                                height: "17px",
                                                                            }}
                                                                            color="black" />
                                                                    </>) :
                                                                    (company.bdmAcceptStatus === 'Accept' && company.RevertBackAcceptedCompanyRequest === 'Send') ? (
                                                                        <>
                                                                            <TiArrowBack
                                                                                style={{
                                                                                    cursor: "pointer",
                                                                                    width: "17px",
                                                                                    height: "17px",
                                                                                }}
                                                                                color="lightgrey" />
                                                                        </>) : (<>
                                                                            <TiArrowForward
                                                                                onClick={() => {
                                                                                    // handleConfirmAssign(
                                                                                    //   company._id,
                                                                                    //   company["Company Name"],
                                                                                    //   company.Status, // Corrected parameter name
                                                                                    //   company.ename,
                                                                                    //   company.bdmAcceptStatus
                                                                                    // );
                                                                                }}
                                                                                style={{
                                                                                    cursor: "pointer",
                                                                                    width: "17px",
                                                                                    height: "17px",
                                                                                }}
                                                                                color="grey"
                                                                            />
                                                                        </>)}
                                                        </td>
                                                    )}

                                                    {(dataStatus === "Forwarded" && company.bdmAcceptStatus !== "NotForwarded") ? (
                                                        <td></td>
                                                        // <td>
                                                        //     <FeedbackDialog
                                                        //         key={`${company["Company Name"]}-${index}`} // Using index or another field to create a unique key
                                                        //     // companyId={company._id}
                                                        //     // companyName={company["Company Name"]}
                                                        //     // feedbackRemarks={company.feedbackRemarks}
                                                        //     // feedbackPoints={company.feedbackPoints}
                                                        //     />
                                                        // </td>
                                                    ) : null}
                                                </tr>
                                            ))}
                                        </tbody>
                                    )}
                                    {fetchedData.length === 0 && !isLoading && (
                                        <tbody>
                                            <tr>
                                                <td colSpan="11" className="p-2 particular">
                                                    <Nodata />
                                                </td>
                                            </tr>
                                        </tbody>
                                    )}
                                </table>
                            </div>

                        </div>

                    </div>
                </div>


            </div>

        </div>
    );
}

export default FetchingEmployeeData;