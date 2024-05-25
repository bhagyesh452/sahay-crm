import React, { useEffect, useState, CSSProperties, useRef } from "react";
import Header from "../../components/Header.js";
import EmpNav from "../EmpNav.js";
import axios from "axios";
import { useParams } from "react-router-dom";
import { options } from "../../components/Options.js";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import Swal from "sweetalert2";
import Select from "react-select";
import Nodata from "../../components/Nodata";
import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';
import { IoFileTrayFullOutline } from "react-icons/io5";
import { CiViewList } from "react-icons/ci";
import { MdImportantDevices } from "react-icons/md";
import { LiaAlgolia } from "react-icons/lia";
import { LiaClipboardCheckSolid } from "react-icons/lia";
import { RiFileCloseLine } from "react-icons/ri";



function EmployeeCallingReport() {
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const { userId } = useParams();


    //-----------------fetching employee info--------------------------------
    const [data, setData] = useState([])
    const fetchData = async () => {
        try {
            const response = await axios.get(`${secretKey}/employee/einfo`)
            const userData = response.data.find((item) => item._id === userId)
            setData(userData)

        } catch (error) {
            console.error("Error fetching user data:", error.message)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    //-------------------fetching employee data------------------------------
    const [empData, setEmpData] = useState([])
    const [empDataFilter, setEmpDataFilter] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchEmployeeData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${secretKey}/company-data/edata-particular/${data.ename}`)
            setEmpData(response.data)
        } catch (error) {
            console.error("Error fetching data:", error);

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchEmployeeData()
    }, [data])

    //---------------- function for piew charts----------------------------
    const data_my = [
        { value: (empData.filter((partObj) => partObj.Status === "Untouched" || partObj.Status === "Busy" || partObj.Status === "Not Picked Up").length), color: '#1ac9bd', label: 'General' },
        { value: (empData.filter((obj) => obj.Status === "Interested" && obj.bdmAcceptStatus !== "Pending" && obj.bdmAcceptStatus !== "Accept").length), color: '#ffb900', label: 'Interested' },
        { value: (empData.filter((obj) => obj.Status === 'FollowUp'&& obj.bdmAcceptStatus !== "Pending" && obj.bdmAcceptStatus !== "Accept").length), color: '#4299e1', label: 'Follow Up' },
        { value: (empData.filter((obj) => obj.Status === 'Matured').length), color: '#1cba19', label: 'Matured' },
        { value: (empData.filter((obj) => obj.Status === 'Not Interested').length), color: '#e65b5b', label: 'Not Interested' },
        { value: (empData.filter((obj) => obj.bdmAcceptStatus === 'Pending' || obj.bdmAcceptStatus === 'Accept').length), color: '#00d19d', label: 'BDM Forwarded' },
    ];

    const size = {
        width: 350,
        height: 220,
        viewBox: "0 0 250 200",
    };

    const StyledText = styled('text')(({ theme }) => ({
        fill: theme.palette.text.primary,
        textAnchor: 'middle',
        dominantBaseline: 'central',
        fontSize: 20,
    }));

    function PieCenterLabel({ children }) {
        const { width, height, left, top } = useDrawingArea();
        return (
            <StyledText x={left + width / 2} y={top + height / 2}>
                {children}
            </StyledText>
        );
    }












    return (
        <div>
            <div className="dash-card">
                <div className="dash-card-head">
                    <h2 className="m-0">
                        Calling Data Report
                    </h2>
                </div>
                <div className="dash-card-body">
                    <div className="row align-items-center">
                        <div className="col-sm-5 align-self-stretch">
                            <div className="call-dr-names mb-2">
                                <div className="call-dr-card d-flex align-items-center justify-content-between mt-1 mb-1">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="color-dots clr-bg-1ac9bd">
                                        </div>
                                        <div className="call-dr-name">
                                            General
                                        </div>
                                    </div>
                                    <div className="call-dr-num">
                                        {empData.filter((obj) => obj.Status === 'Untouched' || obj.Status === 'Busy' || obj.Status === 'Not Picked Up').length}
                                    </div>
                                </div>
                                <div className="call-dr-card d-flex align-items-center justify-content-between mt-1 mb-1">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="color-dots clr-bg-ffb900">
                                        </div>
                                        <div className="call-dr-name">
                                            Interested
                                        </div>
                                    </div>
                                    <div className="call-dr-num">
                                    {empData.filter((obj) => obj.Status === "Interested" && obj.bdmAcceptStatus !== "Pending" && obj.bdmAcceptStatus !== "Accept").length}
                                    </div>
                                </div>
                                <div className="call-dr-card d-flex align-items-center justify-content-between mt-1 mb-1">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="color-dots clr-bg-4299e1">
                                        </div>
                                        <div className="call-dr-name">
                                            Follow Up
                                        </div>
                                    </div>
                                    <div className="call-dr-num">
                                        {empData.filter((obj) => obj.Status === "FollowUp"&& obj.bdmAcceptStatus !== "Pending" && obj.bdmAcceptStatus !== "Accept").length}
                                    </div>
                                </div>
                                <div className="call-dr-card d-flex align-items-center justify-content-between mt-1 mb-1">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="color-dots clr-bg-1cba19">
                                        </div>
                                        <div className="call-dr-name">
                                            Matured
                                        </div>
                                    </div>
                                    <div className="call-dr-num">
                                        {empData.filter((obj) => obj.Status === 'Matured').length}
                                    </div>
                                </div>
                                <div className="call-dr-card d-flex align-items-center justify-content-between mt-1 mb-1">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="color-dots clr-bg-e65b5b">
                                        </div>
                                        <div className="call-dr-name">
                                            Not Interested
                                        </div>
                                    </div>
                                    <div className="call-dr-num">
                                        {empData.filter((obj) => obj.Status === 'Not Interested').length}
                                    </div>
                                </div>
                                <div className="call-dr-card d-flex align-items-center justify-content-between mt-1 mb-1">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="color-dots clr-bg-00d19d">
                                        </div>
                                        <div className="call-dr-name">
                                            BDM Forwarded
                                        </div>
                                    </div>
                                    <div className="call-dr-num">
                                        {empData.filter((obj) => obj.bdmAcceptStatus === 'Pending' || obj.bdmAcceptStatus === 'Accept').length}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-7 align-self-stretch">
                            <div className="call-dr-chart mt-1">
                                <PieChart series={[{ data: data_my, innerRadius: 80, labelComponent: null }]} {...size} slotProps={{
                                    legend: { hidden: true },
                                }}>
                                    <PieCenterLabel>Total: {empData.length}</PieCenterLabel>
                                </PieChart>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EmployeeCallingReport