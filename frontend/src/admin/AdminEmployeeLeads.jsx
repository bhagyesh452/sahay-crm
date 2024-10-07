import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import Navbar from "./Navbar";
import "../dist/css/tabler.min.css?1684106062";
import "../dist/css/tabler-flags.min.css?1684106062";
import "../dist/css/tabler-payments.min.css?1684106062";
import "../dist/css/tabler-vendors.min.css?1684106062";
import "../dist/css/demo.min.css?1684106062";

import "../assets/styles.css";
import "../assets/table.css";
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
import Employee from './Employees.js'
import Team from './Team.js'
import EmployeeParticular from "./EmployeeParticular.js";
import AdminEmployeeTeamLeads from "./AdminEmployeeTeamLeads.jsx";








function AdminEmployeeLeads() {
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

    console.log(value)


    return (
        <div>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label={
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <MdOutlinePersonPin style={{ height: "24px", width: "19px", marginRight: "5px" }} />
                            <span style={{ fontSize: "12px" }}>Leads</span>
                        </div>
                    } {...a11yProps(0)} />
                    <Tab
                        label={
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <AiOutlineTeam style={{ height: "24px", width: "19px", marginRight: "5px" }} />
                                <span style={{ fontSize: "12px" }}>Team Leads</span>
                            </div>
                        }
                        {...a11yProps(1)}
                    />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <EmployeeParticular />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <AdminEmployeeTeamLeads />
            </CustomTabPanel>

        </div>

    );
}

export default AdminEmployeeLeads;
