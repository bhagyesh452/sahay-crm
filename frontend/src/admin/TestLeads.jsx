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


function TestLeads() {
    const [currentDataLoading, setCurrentDataLoading] = useState(false)
    const [data, setData] = useState([])
    const [mainData, setmainData] = useState([])
    const [dataStatus, setDataStatus] = useState("")
    const [currentPage, setCurrentPage] = useState(1);
    const [completeLeads, setCompleteLeads] = useState([]);
    const [totalCount, setTotalCount] = useState()
    const itemsPerPage = 500;
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const [searchText, setSearchText] = useState("")

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

            const response = await axios.get(`${secretKey}/new-leads?page=${page}&limit=${itemsPerPage}`);
            console.log("data", response.data.data)
            // Set the retrieved data in the state
            setData(response.data.data);
            setTotalCount(response.data.totalPages)
            setmainData(response.data.data);
            setDataStatus("Unassigned")

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
    }, [])

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
            console.log(searchQuery , "serach")
            setData(response.data);
            // if(response.data.length > 0){

            //    
            // }else{
            //     setData(mainData)
            // }
            
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
            <div className='w-25 my-3'>
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
            </div>
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
            )}
        </div>
    )
}

export default TestLeads