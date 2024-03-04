import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import axios from 'axios';
import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import socketIO from 'socket.io-client';
import CloseIcon from '@mui/icons-material/Close'







export default function Bellicon_processing({ data }) {

    const [unreadCount, setUnreadCount] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const [companyName, setCompanyName] = useState([])




    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));

    const countUnreadCompanies = () => {
        let unreadCompanyCount = 0;
        const unreadCompanyNames = [];

        if (data && data.length > 0) {
            data.map(company => {
                if (!company.read) {
                    unreadCompanyCount++;
                    unreadCompanyNames.push(company.companyName);
                }
                return null; // Since we're not transforming the array, we return null here
            });
        }
        setCompanyName(unreadCompanyNames)
        setUnreadCount(unreadCompanyCount);
        return unreadCompanyNames;
    }
    //console.log(companyName)

    useEffect(() => {
        // Calculate the count of unread companies when the component mounts

        if (data) { countUnreadCompanies() }

    }, [data]);


    return (
        <React.Fragment>
            <IconButton onClick={handleClick}>
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6"></path>
                    <path d="M9 17v1a3 3 0 0 0 6 0v-1"></path>
                </svg>
                <span style={{
                    fontSize: "8px",
                    borderRadius: "15px",
                    marginBottom: "9px",
                    padding: "2px"
                }} className="badge bg-red">{unreadCount}</span>
            </IconButton>
            {/* {isPopupOpen && (
                <Box className="popup" style={{ position: "absolute", zIndex: "999", backgroundColor: "lightgrey", padding: "10px", border: "1px solid black", borderRadius: "5px", top: "calc(100% + 2px)", left: "50%", transform: "translateX(46%)" }}>
            
                    hvjegbikerfbjkerfbkebfkjfbkjfbjhfb
                    <p>Popup content</p>
                    <CloseIcon onClick={handleClosePopup}>Close</CloseIcon>
                </Box>
            )} */}

            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                <Tooltip title="Account settings">
                </Tooltip>
            </Box>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        
                        height: "276px",
                        overflowY: "auto",
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
                width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
                        },
            '&::before': {
                content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: 'background.paper',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
                        },
                    },
                }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
            {companyName.map((obj) => (<MenuItem onClick={handleClose}>
                <Stack spacing={2}>
                    <Item>{obj}</Item>
                </Stack>
            </MenuItem>)
            )}
        </Menu>

        </React.Fragment >
    );
}