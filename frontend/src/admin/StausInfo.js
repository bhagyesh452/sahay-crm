import React, { useEffect, useState } from 'react'
import Navbar from "./Navbar";
import Header from "./Header";
import { useParams } from "react-router-dom";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import Nodata from "../components/Nodata";
import "../assets/styles.css";
import '../Processing/style_processing/main_processing.css'
import debounce from 'lodash/debounce';
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

  import { IconChevronLeft } from "@tabler/icons-react";
  import { IconChevronRight } from "@tabler/icons-react";

function StausInfo(props) {

    const [companies, setCompanies] = useState([])
    const [currenDataLoading, setCurrenDataLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 500;
    const { ename } = useParams();
    const { status } = useParams();

    const secretKey = process.env.REACT_APP_SECRET_KEY;

    const fetchCompany = debounce(async () => {
        try {
            setCurrenDataLoading(true)
            // Make a GET request to fetch data of the specific company by its name
            const response = await axios.get(
                `${secretKey}/company-data/specific-ename-status/${ename}/${status}`
            );
            // Extract the data from the response
            const data = response.data;
            //console.log("data", data);
            setCompanies(data)
        } catch (error) {
            console.error("Error fetching company:", error);
        } finally {
            setCurrenDataLoading(false)
        }
    }, 300);

    //console.log(companies)

    useEffect(() => {
        fetchCompany()
    }, [])

    function formatDate(inputDate) {
        const options = { year: "numeric", month: "long", day: "numeric" };
        const formattedDate = new Date(inputDate).toLocaleDateString(
            "en-US",
            options
        );
        return formattedDate;
    }
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const currentData = companies.slice(startIndex, endIndex);



  


    return (

        <div>
            <Header />
            <Navbar />
            <div className='container-xl mt-2'>
                <div className='card'>
                    <div className='card-header employeedashboard'>
                        <div className="d-flex justify-content-between">
                            <div style={{ minWidth: '14vw' }} className="dashboard-title">
                                <h2 style={{ marginBottom: '5px' }}>{ename} {status} Status Report</h2>
                            </div>
                        </div>
                    </div>
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
                                        {/* <th>
                        <input
                          type="checkbox"
                          checked={selectedRows.length === data.length}
                          onChange={() => handleCheckboxChange("all")}
                        />
                      </th> */}
                                        <th>Sr.No</th>
                                        <th>Company Name</th>
                                        <th>Company Number</th>

                                        <th>Incorporation Date</th>
                                        <th>City</th>
                                        <th>State</th>
                                        <th>Company Email</th>
                                        <th>Status</th>
                                        <th>Remarks</th>
                                        <th>
                                            Assigned on
                                        </th>
                                    </tr>
                                </thead>

                                {currenDataLoading ? (
                                    <tbody>
                                        <tr>
                                            <td colSpan="10" className="LoaderTDSatyle">
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
                                        {currentData.map((company, index) => (
                                            <tr
                                                key={index}
                                                //className="selected"
                                                style={{ border: "1px solid #ddd" }}
                                            >

                                                <td>{startIndex + index + 1}</td>
                                                <td>{company["Company Name"]}</td>
                                                <td>{company["Company Number"]}</td>
                                                <td>{formatDate(company["Company Incorporation Date  "])}</td>
                                                <td>{company["City"]}</td>
                                                <td>{company["State"]}</td>
                                                <td>{company["Company Email"]}</td>
                                                <td>{company["Status"]}</td>
                                                <td>
                                                    {company["Remarks"]}
                                                </td>
                                                <td>{formatDate(company["AssignDate"])}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                )}
                            </table>
                        </div>
                    </div>
                    {companies.length === 0 && !currenDataLoading &&
                        (
                            <table>
                                <tbody>
                                    <tr>
                                        <td colSpan="10" className="p-2 particular">
                                            <Nodata />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        )}

                    {companies.length !== 0 && (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                margin: "10px",
                            }}
                            className="pagination"
                        >
                            <IconButton
                                onClick={() =>
                                    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0))
                                }
                                disabled={currentPage === 0}
                            >
                                <IconChevronLeft />
                            </IconButton>
                            <span>
                                Page {currentPage + 1} of{" "}
                                {Math.ceil(companies.length / itemsPerPage)}
                            </span>

                            <IconButton
                                onClick={() =>
                                    setCurrentPage((prevPage) =>
                                        Math.min(
                                            prevPage + 1,
                                            Math.ceil(companies.length / itemsPerPage) - 1
                                        )
                                    )
                                }
                                disabled={
                                    currentPage ===
                                    Math.ceil(companies.length / itemsPerPage) - 1
                                }
                            >
                                <IconChevronRight />
                            </IconButton>
                        </div>
                    )}
                </div>
            </div>
        </div >
    )
}

export default StausInfo