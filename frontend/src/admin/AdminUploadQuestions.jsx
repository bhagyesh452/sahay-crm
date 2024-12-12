import React, { useState, useEffect, useRef, useMemo } from "react";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { BsFilter } from "react-icons/bs";
import { FaFilter } from "react-icons/fa";
import FilterableComponentEmployee from "../employeeComp/ExtraComponents/FilterableComponentEmployee";
import { GoArrowLeft } from "react-icons/go";
import { GoArrowRight } from "react-icons/go";
import FilterableTable from "../RM-CERTIFICATION/Extra-Components/FilterableTable.jsx";
import { FaRegEye } from "react-icons/fa";
import MaleEmployee from "../static/EmployeeImg/office-man.png";
import FemaleEmployee from "../static/EmployeeImg/woman.png";
import RemainingAmnt from "../static/my-images/money.png";
import QuestionUploadDialog from "./ExtraComponent/QuestionUploadDialog.jsx";


function AdminUploadQuestions() {
    const [isBookingDataLoading, setIsBookingDataLoading] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleDialogToggle = () => {
        setDialogOpen(!dialogOpen);
      };
    return (
        <div>
            <div className="page-header mt-3">
                <div className="container-xl">
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                            <div class="input-icon">
                                <span class="input-icon-addon">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon mybtn" width="18" height="18" viewBox="0 0 22 22" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                        <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
                                        <path d="M21 21l-6 -6"></path>
                                    </svg>
                                </span>
                                <input
                                    // value={searchText}
                                    // onChange={(e) => {
                                    //     setSearchText(e.target.value);
                                    //     setCurrentPage(1); // Reset to first page when search text changes
                                    // }}
                                    className="form-control search-cantrol mybtn"
                                    placeholder="Search..."
                                    type="text"
                                />
                            </div>
                        </div>
                        <div className="d-flex align-items-center mr-1">
                            <div className="d-flex align-items-center">
                                <div className="btn-group" role="group" aria-label="Basic example">
                                    <button type="button" className="btn action-btn-primary" onClick={handleDialogToggle}>
                                        Upload Question
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="page-body">
                <div className="sales-panels-main no-select">
                    <div className="container-xl mt-2">
                        <div className="table table-responsive e-Leadtable-style m-0" id="bknglisth" style={{ borderRadius: "6px", border: "1px solid #ccc" }}>
                            <table className="table table-vcenter table-nowrap">
                                <thead>
                                    <tr className="tr-sticky">
                                        <th className="rm-sticky-left-1">Sr.No</th>
                                        <th className="rm-sticky-left-2">
                                            Question
                                        </th>
                                        <th>
                                            Option 1
                                        </th>
                                        <th>
                                            Option 2
                                        </th>
                                        <th>
                                            Option 3
                                        </th>
                                        <th>
                                            Option 4
                                        </th>
                                        <th>
                                            Right Option Response
                                        </th>
                                        <th>
                                          Wrong Option Response
                                        </th>
                                        <th>
                                           Uploaded Date
                                        </th>
                                        <th>
                                            Slot Number
                                        </th>
                                        <th>
                                           Action
                                        </th>
                                        
                                    </tr>
                                </thead>
                                {isBookingDataLoading ? (
                                    <tbody>
                                        <tr>
                                            <td colSpan="14">
                                                <div className="LoaderTDSatyle">
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
                                     
                                    </tbody>
                                )}
                            </table>
                        </div>
                        
                    </div>
                </div>
            </div>
            {
                dialogOpen && (
                    <QuestionUploadDialog 
                    dialogOpen ={dialogOpen} 
                    handleDialogToggle={handleDialogToggle}
                    />
                )
            }
        </div>
    )
}

export default AdminUploadQuestions