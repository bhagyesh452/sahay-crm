import React, { useState, useEffect } from "react";
import Header from "../../Components/Header/Header.jsx";

import Navbar from "../../Components/Navbar/Navbar.jsx";
import axios from "axios";
import Nodata from "../../Components/Nodata/Nodata.jsx";
import "../../../dist/css/tabler.min.css?1684106062";
import "../../../dist/css/tabler-flags.min.css?1684106062";
import "../../../dist/css/tabler-payments.min.css?1684106062";
import "../../../dist/css/tabler-vendors.min.css?1684106062";
import "../../../dist/css/demo.min.css?1684106062";

import "../../../assets/styles.css";
import "../../../assets/table.css";
// import EmployeeTable from "./EmployeeTable";
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { GrDocumentStore } from "react-icons/gr";
import { AiOutlineTeam } from "react-icons/ai";
import { GoPerson } from "react-icons/go";
import { MdOutlinePersonPin } from "react-icons/md";
import EmployeesThisMonthBooking from "../../../admin/DashboardReportComponents/EmployeesThisMonthBooking.jsx";
import EmployeeDataReport from "../../../admin/DashboardReportComponents/EmployeeDataReport.jsx";
import EmployeesForwardedDataReport from "../../../admin/DashboardReportComponents/EmployeesForwardedDataReport.jsx";
import EmployeesProjectionSummary from "../../../admin/DashboardReportComponents/EmployeesProjectionSummary.jsx";
import { RiShareForward2Fill } from "react-icons/ri";
import { RiDatabaseLine } from "react-icons/ri";







function DatamanagerDashboard() {
    const secretKey = process.env.REACT_APP_SECRET_KEY;




    function CustomTabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{ p: 3 }}>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }

    CustomTabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
    };

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const dataManagerName = localStorage.getItem("dataManagerName")

    return (
        <div>
            <Header name={dataManagerName} />
            <Navbar name={dataManagerName} />
            <div className="page-wrapper">
                <div className="container-xl">
                    <div className="card mt-3">
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                <Tab label={
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <MdOutlinePersonPin style={{ height: "24px", width: "19px", marginRight: "5px" }} />
                                        <span style={{ fontSize: "12px" }}>This Months Booking</span>
                                    </div>
                                } {...a11yProps(0)} />
                                <Tab
                                    label={
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <AiOutlineTeam style={{ height: "24px", width: "19px", marginRight: "5px" }} />
                                            <span style={{ fontSize: "12px" }}>Employees Data Report</span>
                                        </div>
                                    }
                                    {...a11yProps(1)}
                                />
                                <Tab
                                    label={
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <RiShareForward2Fill style={{ height: "24px", width: "19px", marginRight: "5px" }} />
                                            <span style={{ fontSize: "12px" }}>Employees Forwarded Data Report</span>
                                        </div>
                                    }
                                    {...a11yProps(2)}
                                />
                                <Tab
                                    label={
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <RiDatabaseLine style={{ height: "24px", width: "19px", marginRight: "5px" }} />
                                            <span style={{ fontSize: "12px" }}>Projection Summary</span>
                                        </div>
                                    }
                                    {...a11yProps(3)}
                                />
                            </Tabs>
                        </Box>
                        <CustomTabPanel value={value} index={0}>
                            <EmployeesThisMonthBooking />
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={1}>
                            <EmployeeDataReport />
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={2}>
                            <EmployeesForwardedDataReport />
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={3}>
                            <EmployeesProjectionSummary />
                        </CustomTabPanel>
                    </div>
                </div>
            </div>


        </div>
    );
}

export default DatamanagerDashboard;
