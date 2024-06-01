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
export default function Bellicon({data , gdata,adata , isAdmin}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [count, setCount] = useState(0);
  const totalCount = data.filter((item) => !item.read).length + gdata.filter((item) => !item.read).length + adata.length;
  
  
 


  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  const handleNotificationClick = async (id, read) => {
    try {
      // Update the notification in the backend (set 'read' to true)
      // if (read === false) {
      //   await axios.put(`http://localhost:3001/api/requestData/${id}`, {
      //     read: true,
      //   });
        window.location.replace("/admin/notification");
        // Assuming that you have a 'read' property in your MongoDB model
        // Adjust the URL and data structure based on your actual backend implementation
      // }

      // Close the menu
    } catch (error) {
      console.error("Error updating notification:", error.message);
    }
  };
  const handleNotificationGClick = async (id, read) => {
    try {
      // Update the notification in the backend (set 'read' to true)
      // if (read === false) {
      //   await axios.put(`http://localhost:3001/api/requestgData/${id}`, {
      //     read: true,
      //   });
        window.location.replace("/admin/notification");
        // Assuming that you have a 'read' property in your MongoDB model
        // Adjust the URL and data structure based on your actual backend implementation
      

      // Close the menu
    } catch (error) {
      console.error("Error updating notificatioN:", error.message);
    }
  };

  const indianOptions = {
    timeZone: 'Asia/Kolkata',
  };


  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
       
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
           
           {data && gdata && data.some((option) => !option.read) ? (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6"></path>
              <path d="M9 17v1a3 3 0 0 0 6 0v-1"></path>
            </svg>
            <span style={{fontSize: "8px",
    borderRadius: "10px",
    marginBottom: "9px",
    padding:"2px"}} className="badge bg-red">{totalCount> 5 ? "5+" : totalCount}</span>
          </>
        ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6"></path>
                <path d="M9 17v1a3 3 0 0 0 6 0v-1"></path>
              </svg>
            </>
          ) &&
          gdata &&
          gdata.some((option) => !option.read) ? (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6"></path>
              <path d="M9 17v1a3 3 0 0 0 6 0v-1"></path>
            </svg>
            <span style={{fontSize: "8px",
    borderRadius: "10px",
    marginBottom: "9px",
    padding:"2px"}} className="badge bg-red">{totalCount> 5 ? "5+" : totalCount}</span>
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6"></path>
              <path d="M9 17v1a3 3 0 0 0 6 0v-1"></path>
            </svg>
          </>
        )}
          </IconButton>
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
            overflow: 'visible',
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
         <Stack spacing={2}>
        
        {(data || gdata) &&
            [...(data || []), ...(gdata || [])] 
              .filter((option) => !option.read) 
              .reverse()
              .slice(0, 5) 
              .map((option) => (
                <MenuItem
                  style={{ marginTop: "0px" }}
                  key={option.ename}
                  onClick={() => {
                    if (option.hasOwnProperty("gdata")) {
                      handleNotificationGClick(option._id, option.read);
                    } else {
                      handleNotificationClick(option._id, option.read);
                    }
                    // Change the background color to lightgrey when clicked
                    option.read = true;
                  }}
                >
                    <Item style={{alignItems:"center"}} className='d-flex' ><Avatar />
                    <div className="cont-info">
                    <h3 style={{margin:"0px"}}> {option.ename} </h3>
                    <span>is requesting for data </span> </div> 
                    <div className="timing">
                    <span>{option.cDate}</span>
                    <span style={{marginLeft: "10px", color: "#409d40"}}>{(option.cTime)}</span>
                    </div>
                     </Item>
                </MenuItem>
              ))}
              {adata.map((option)=>(
                <MenuItem
                style={{ marginTop: "0px" }}
                key={option.ename}>
                  <Item style={{alignItems:"center"}} className='d-flex' ><Avatar />
                  <div className="cont-info">
                  <h3 style={{margin:"0px"}}> {option.ename} </h3>
                  <span>wants to add some data </span> </div> 
                  <div className="timing">
                  <span>{option.date}</span>
                  <span style={{marginLeft: "10px", color: "#409d40"}}>{(option.time)}</span>
                  </div>
                   </Item>
              </MenuItem>
              ))}
              </Stack>
              <div style={{ margin: "3px 0px" }} className="foot">
          <Link to={isAdmin ? "/admin/notification" : "/dataManager/notification"}>
            <div style={{ minWidth: "20vw", textAlign: "center" }}>See All</div>
          </Link>
        </div>
      </Menu>
    </React.Fragment>
  );
}