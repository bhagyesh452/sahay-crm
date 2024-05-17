import React, { useState, useEffect } from 'react';
import Header from "./Header";
import Navbar from "./Navbar";
import ClipLoader from "react-spinners/ClipLoader";
import axios from 'axios';
import { IconChevronLeft } from "@tabler/icons-react";
import debounce from 'lodash/debounce';
import { IconChevronRight } from "@tabler/icons-react";
import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
} from "@mui/material";

import Nodata from '../components/Nodata';
import { Page } from 'react-pdf';
import { IoFilterOutline } from "react-icons/io5";
import { TbFileImport } from "react-icons/tb";
import { TbFileExport } from "react-icons/tb";
import { TiUserAddOutline } from "react-icons/ti";

function TestLeads() {
    const [currentDataLoading, setCurrentDataLoading] = useState(false)
    const [data, setData] = useState([])
    const [mainData, setmainData] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [completeLeads, setCompleteLeads] = useState([]);
    const [totalCount, setTotalCount] = useState()
    const itemsPerPage = 500;
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const [searchText, setSearchText] = useState("")
    const [dataStatus, setDataStatus] = useState("Unassigned");
    const [totalCompaniesUnassigned, setTotalCompaniesUnaasigned] = useState()
    const [totalCompaniesAssigned, setTotalCompaniesAssigned] = useState()

    const secretKey = process.env.REACT_APP_SECRET_KEY;

    const fetchTotalLeads = async () => {
        const response = await axios.get(`${secretKey}/leads`)
        setCompleteLeads(response.data)
    }


    const fetchData = async (page) => {
        try {
            // Set isLoading to true while fetching data
            //setIsLoading(true);

            console.log("page", page)

            setCurrentDataLoading(true)
            console.log("dataStatus", dataStatus)
            const response = await axios.get(`${secretKey}/new-leads?page=${page}&limit=${itemsPerPage}&dataStatus=${dataStatus}`);
            //console.log("data", response.data.data)
            // Set the retrieved data in the state
            setData(response.data.data);
            setTotalCount(response.data.totalPages)
            setTotalCompaniesUnaasigned(response.data.unAssignedCount)
            setTotalCompaniesAssigned(response.data.assignedCount)
            setmainData(response.data.data.filter((item) => item.ename === "Not Alloted"));
            console.log("mainData", mainData)
            //setDataStatus("Unassigned")

            // Set isLoading back to false after data is fetched
            //setIsLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error.message);
            // Set isLoading back to false if an error occurs
            //setIsLoading(false);
        } finally {
            setCurrentDataLoading(false)
        }
    };


    useEffect(() => {
        fetchData(1)
        fetchTotalLeads()
    }, [dataStatus])

    const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
        fetchData(currentPage + 1);
    };

    const handlePreviousPage = () => {
        setCurrentPage(currentPage - 1);
        fetchData(currentPage - 1);
    };

    //const currentData = mainData.slice(startIndex, endIndex);

    function formatDateFinal(timestamp) {
        const date = new Date(timestamp);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    const handleFilterSearch = async (searchQuery) => {
        try {
            setCurrentDataLoading(true);

            const response = await axios.get(`${secretKey}/search-leads`, {
                params: { searchQuery }
            });

            if (!searchQuery.trim()) {
                // If search query is empty, reset data to mainData
                fetchData(1)
            } else {
                // Set data to the search results
                setData(response.data);
            }
        } catch (error) {
            console.error('Error searching leads:', error.message);
        } finally {
            setCurrentDataLoading(false);
        }
    };

    return (
        <div>
            <Header />
            <Navbar />
            {/* <div className='w-25 my-3'>
                <input
                    type="text"
                    value={searchText}
                    onChange={(e) => {
                        setSearchText(e.target.value);
                        handleFilterSearch(e.target.value)
                        //setCurrentPage(0);
                    }}
                    className="form-control"
                    placeholder="Search…"
                    aria-label="Search in website"
                />
            </div> */}
            {/* <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    border: "1px solid #ddd",
                }}
                className="table-vcenter table-nowrap "
            >
                <thead>
                    <tr className="tr-sticky">
                        <th>Sr.No</th>
                        <th>Company Name</th>
                        <th>Company Number</th>

                        <th>
                            Incorporation Date
                        </th>
                        <th>City</th>
                        <th>State</th>
                        <th>Company Email</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                {currentDataLoading ? (
                    <tbody>
                        <tr>
                            <td colSpan="13" className="LoaderTDSatyle">
                                <ClipLoader
                                    color="lightgrey"
                                    loading
                                    size={30}
                                    aria-label="Loading Spinner"
                                    data-testid="loader"
                                />
                            </td>
                        </tr>
                    </tbody>
                ) : (
                    <tbody>
                        {data.map((company, index) => (
                            <tr
                                key={index}
                                style={{ border: "1px solid #ddd" }}
                            >
                                <td>{index + 1}</td>
                                <td>{company["Company Name"]}</td>
                                <td>{company["Company Number"]}</td>
                                <td>{formatDateFinal(company["Company Incorporation Date  "])}</td>
                                <td>{company["City"]}</td>
                                <td>{company["State"]}</td>
                                <td>{company["Company Email"]}</td>
                                <td>{company["Status"]}</td>
                                <td>{formatDateFinal(company["AssignDate"])}</td>
                            </tr>
                        ))}
                    </tbody>
                )}
            </table>
            {data.length === 0 && !currentDataLoading &&
                (
                    <table>
                        <tbody>
                            <tr>
                                <td colSpan="13" className="p-2 particular">
                                    <Nodata />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                )}
            {data.length !== 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", margin: "10px" }} className="pagination">
                    <IconButton onClick={handlePreviousPage} disabled={currentPage === 0}>
                        <IconChevronLeft />
                    </IconButton>
                    <span>Page {currentPage} /{totalCount}</span>
                    <IconButton onClick={handleNextPage} disabled={data.length < itemsPerPage}>
                        <IconChevronRight />
                    </IconButton>
                </div>
            )} */}
            <div className='page-wrapper'>
                <div page-header d-print-none>
                    <div className="container-xl">
                        <div class="d-grid gap-4 d-md-block mt-3">
                            <button class="btn btn-primary mr-1" type="button"><span><TiUserAddOutline style={{marginRight:"7px",height:"20px", width:"20px"}} /></span>Add Leads</button>
                            <div class="btn-group" role="group" aria-label="Basic example">
                                <button type="button" class="btn"><span><IoFilterOutline style={{marginRight:"7px"}} /></span>Filter</button>
                                <button type="button" class="btn"><span><TbFileImport style={{marginRight:"7px"}} /></span>Import Leads</button>
                                <button type="button" class="btn"><span><TbFileExport style={{marginRight:"7px"}} /></span>Export Leads</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="page-body">
                    <div className="container-xl">
                        <div class="card-header  my-tab">
                            <ul
                                class="nav nav-tabs card-header-tabs nav-fill p-0"
                                data-bs-toggle="tabs"
                            >
                                <li class="nav-item data-heading">
                                    <a
                                        href="#tabs-home-5"
                                        className={
                                            dataStatus === "Unassigned"
                                                ? "nav-link active item-act"
                                                : "nav-link"
                                        }
                                        data-bs-toggle="tab"
                                        onClick={() => {
                                            setDataStatus("Unassigned")
                                        }}
                                    >
                                        UnAssigned
                                        <span className="no_badge">
                                            {totalCompaniesUnassigned}
                                        </span>
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a
                                        href="#tabs-home-5"
                                        className={
                                            dataStatus === "Assigned"
                                                ? "nav-link active item-act"
                                                : "nav-link"
                                        }
                                        data-bs-toggle="tab"
                                        onClick={() => {
                                            setDataStatus("Assigned")
                                        }}>
                                        Assigned
                                        <span className="no_badge">
                                            {totalCompaniesAssigned}
                                        </span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="card">
                            <div className="card-body p-0">
                                <div
                                    id="table-default"
                                    style={{
                                        overflowX: "auto",
                                        overflowY: "auto",
                                        maxHeight: "60vh",
                                    }}
                                >
                                    <table
                                        style={{
                                            width: "100%",
                                            borderCollapse: "collapse",
                                            border: "1px solid #ddd",
                                        }}
                                        className="table-vcenter table-nowrap "
                                    >
                                        <thead>
                                            <tr className="tr-sticky">
                                                <th>
                                                    <input
                                                        type="checkbox"
                                                    //checked={selectedRows.length === data.length}
                                                    //onChange={() => handleCheckboxChange("all")}
                                                    />
                                                </th>
                                                <th>Sr.No</th>
                                                <th>Company Name</th>
                                                <th>Company Number</th>

                                                <th>
                                                    Incorporation Date
                                                    {/* <FilterListIcon
                                                    style={{
                                                        height: "14px",
                                                        width: "14px",
                                                        cursor: "pointer",
                                                        marginLeft: "4px",
                                                    }}
                                                    onClick={handleFilterIncoDate}
                                                /> */}
                                                    {/* {openIncoDate && <div className="inco-filter">
                                                    <div

                                                        className="inco-subFilter"
                                                        onClick={(e) => handleSort("oldest")}
                                                    >
                                                        <SwapVertIcon style={{ height: "14px" }} />
                                                        Oldest
                                                    </div>

                                                    <div
                                                        className="inco-subFilter"
                                                        onClick={(e) => handleSort("newest")}
                                                    >
                                                        <SwapVertIcon style={{ height: "14px" }} />
                                                        Newest
                                                    </div>

                                                    <div
                                                        className="inco-subFilter"
                                                        onClick={(e) => handleSort("none")}
                                                    >
                                                        <SwapVertIcon style={{ height: "14px" }} />
                                                        None
                                                    </div>
                                                </div>} */}
                                                </th>
                                                <th>City</th>
                                                <th>State</th>
                                                <th>Company Email</th>
                                                <th>Status</th>
                                                {dataStatus !== "Unassigned" && <th>Remarks</th>}

                                                <th>Uploaded By</th>
                                                {dataStatus !== "Unassigned" && <th>Assigned to</th>}

                                                {/* <th>
                                                {dataStatus !== "Unassigned" ? "Assigned On" : "Uploaded On"}

                                                <FilterListIcon
                                                    style={{
                                                        height: "14px",
                                                        width: "14px",
                                                        cursor: "pointer",
                                                        marginLeft: "4px",
                                                    }}
                                                    onClick={handleFilterAssignDate}
                                                />
                                                {openAssign && <div className="inco-filter">
                                                    <div

                                                        className="inco-subFilter"
                                                        onClick={(e) => handleSortAssign("oldest")}
                                                    >
                                                        <SwapVertIcon style={{ height: "14px" }} />
                                                        Oldest
                                                    </div>

                                                    <div
                                                        className="inco-subFilter"
                                                        onClick={(e) => handleSortAssign("newest")}
                                                    >
                                                        <SwapVertIcon style={{ height: "14px" }} />
                                                        Newest
                                                    </div>


                                                </div>}
                                            </th> */}
                                                <th>Assigned On</th>
                                                {/* <th>Action</th> */}
                                            </tr>
                                        </thead>
                                        {currentDataLoading ? (
                                            <tbody>
                                                <tr>
                                                    <td colSpan="13" className="LoaderTDSatyle">
                                                        <ClipLoader
                                                            color="lightgrey"
                                                            loading
                                                            size={30}
                                                            aria-label="Loading Spinner"
                                                            data-testid="loader"
                                                        />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        ) : (
                                            <tbody>
                                                {data.map((company, index) => (
                                                    <tr
                                                        key={index}
                                                        //className={selectedRows.includes(company._id) ? "selected" : ""}
                                                        style={{ border: "1px solid #ddd" }}
                                                    >
                                                        <td>
                                                            <input
                                                                type="checkbox"
                                                            //checked={selectedRows.includes(company._id)}
                                                            //onChange={() => handleCheckboxChange(company._id)}
                                                            //onMouseDown={() => handleMouseDown(company._id)}
                                                            // onMouseEnter={() => handleMouseEnter(company._id)}
                                                            //onMouseUp={handleMouseUp}
                                                            />
                                                        </td>
                                                        <td>{index + 1}</td>
                                                        <td>{company["Company Name"]}</td>
                                                        <td>{company["Company Number"]}</td>
                                                        <td>{formatDateFinal(company["Company Incorporation Date  "])}</td>
                                                        <td>{company["City"]}</td>
                                                        <td>{company["State"]}</td>
                                                        <td>{company["Company Email"]}</td>
                                                        <td>{company["Status"]}</td>
                                                        {/* {dataStatus !== "Unassigned" && <td >
                                                        <div style={{ width: "100px" }} className="d-flex align-items-center justify-content-between">
                                                            <p className="rematkText text-wrap m-0">
                                                                {company["Remarks"]}{" "}
                                                            </p>
                                                            <div onClick={() => {
                                                                functionopenpopupremarks(company._id, company.Status);
                                                            }} style={{ cursor: "pointer" }}>
                                                                <IconEye

                                                                    style={{
                                                                        width: "14px",
                                                                        height: "14px",
                                                                        color: "#d6a10c",
                                                                        cursor: "pointer",
                                                                        marginLeft: "4px",
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </td>} */}
                                                        <td>{company["UploadedBy"] ? company["UploadedBy"] : "-"}</td>
                                                        {dataStatus !== "Unassigned" && <td>{company["ename"]}</td>}
                                                        <td>{formatDateFinal(company["AssignDate"])}</td>
                                                        {/* <td>
                                                        {(mainAdminName === "Nimesh" || mainAdminName === "Ronak" || mainAdminName === "Aakash" || mainAdminName === "shivangi") && <> <IconButton onClick={() => handleDeleteClick(company._id)}>
                                                            <DeleteIcon
                                                                style={{
                                                                    width: "14px",
                                                                    height: "14px",
                                                                    color: "#bf0b0b",
                                                                }}
                                                            >
                                                                Delete
                                                            </DeleteIcon>
                                                        </IconButton>
                                                            <IconButton onClick={
                                                                data.length === "0"
                                                                    ? Swal.fire("Please Import Some data first")
                                                                    : () => {
                                                                        functionopenModifyPopup();
                                                                        handleUpdateClick(company._id);
                                                                    }
                                                            }>
                                                                < ModeEditIcon
                                                                    style={{
                                                                        width: "14px",
                                                                        height: "14px",
                                                                        color: "grey",
                                                                    }}
                                                                />

                                                            </IconButton> </>}
                                                        <Link to={`/admin/leads/${company._id}`}>
                                                            <IconButton>
                                                                <IconEye
                                                                    style={{
                                                                        width: "14px",
                                                                        height: "14px",
                                                                        color: "#d6a10c",
                                                                        cursor: "pointer",
                                                                    }}
                                                                />
                                                            </IconButton>
                                                        </Link>
                                                    </td> */}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        )}
                                    </table>
                                </div>
                            </div>
                            {data.length === 0 && !currentDataLoading &&
                                (
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td colSpan="13" className="p-2 particular">
                                                    <Nodata />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                )}
                            {data.length !== 0 && (
                                <div style={{ display: "flex", justifyContent: "space-between", margin: "10px" }} className="pagination">
                                    <IconButton onClick={handlePreviousPage} disabled={currentPage === 0}>
                                        <IconChevronLeft />
                                    </IconButton>
                                    <span>Page {currentPage} /{totalCount}</span>
                                    <IconButton onClick={handleNextPage} disabled={data.length < itemsPerPage}>
                                        <IconChevronRight />
                                    </IconButton>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default TestLeads