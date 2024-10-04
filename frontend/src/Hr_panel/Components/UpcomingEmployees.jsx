import React, { useState, useEffect } from "react";
import Header from "../Components/Header/Header";
import Navbar from "../Components/Navbar/Navbar";
import Nodata from "../../components/Nodata";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { IoFilterOutline } from "react-icons/io5";
import { FaRegEye } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import { AiFillDelete } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FaWhatsapp } from "react-icons/fa";
import { TbRestore } from "react-icons/tb";
import EmpDfaullt from "../../static/EmployeeImg/office-man.png";
import FemaleEmployee from "../../static/EmployeeImg/woman.png";
import { useQuery } from "@tanstack/react-query";

function UpcomingEmployees({ upcomingEmployees, dataLoading }) {
    const [groupedData, setGroupedData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        const upcomingJoinees = upcomingEmployees.filter(applicant => {
            return applicant.mainCategoryStatus === "Selected" &&
                new Date(applicant.jdate) > new Date();
        });

        setGroupedData(upcomingJoinees);
        setFilteredData(upcomingJoinees);
    }, [upcomingEmployees]);

    function formatDatePro(inputDate) {
        const date = new Date(inputDate);
        const day = date.getDate();
        const month = date.toLocaleString('en-US', { month: 'long' });
        const year = date.getFullYear();
        return `${day} ${month}, ${year}`;
    }

    return (
      
            <div className="table table-responsive table-style-3 m-0">
                <table className="table table-vcenter table-nowrap">
                    <thead>
                        <tr className="tr-sticky">
                            <th>SR.NO</th>
                            <th>Applicant Name</th>
                            <th>Number</th>
                            <th>Email Id</th>
                            <th>Designation</th>
                            <th>Offered Salary</th>
                            <th>First Salary Condition</th>
                            <th>Date Of Joining</th>
                            <th>Branch Preference</th>
                            <th>Source</th>
                            <th>Application Date</th>
                        </tr>
                    </thead>
                    {dataLoading ? (
                        <tbody>
                            <tr>
                                <td colSpan="12">
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
                        filteredData.length !== 0 ? (
                            <tbody>
                                {filteredData.map((obj, index) => (
                                    <tr key={index}>
                                        <th>{index + 1}</th>
                                        <th>{obj.empFullName}</th>
                                        <th>{obj.personal_number}</th>
                                        <th>{obj.personal_email}</th>
                                        <th>{obj.appliedFor ? obj.appliedFor : "-"}</th>
                                        <th>
                                            {obj.offeredSalary
                                                ? `${parseInt(obj.offeredSalary).toLocaleString("en-US", {
                                                    style: "currency",
                                                    currency: "INR", // Change this to your desired currency code
                                                })}`
                                                : "-"}
                                        </th>
                                        <th>{obj.firstMonthSalaryCondition ? `${obj.firstMonthSalaryCondition}` : "-"}</th>
                                        <th>{obj.jdate ? formatDatePro(obj.jdate) : "-"}</th>
                                        <th>{obj.branchOffice ? obj.branchOffice : "-"}</th>
                                        <th>{obj.applicationSource}</th>
                                        <th>{formatDatePro(obj.fillingDate)}</th>
                                    </tr>
                                ))}
                            </tbody>
                        ) : (
                            <tbody>
                                <tr>
                                    <td className="particular" colSpan={11}>
                                        <Nodata />
                                    </td>
                                </tr>
                            </tbody>
                        )
                    )}
                </table>
         
        </div>
    )
}

export default UpcomingEmployees