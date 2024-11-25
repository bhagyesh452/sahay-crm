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
export default function Bellicon({ data, gdata, adata, isAdmin }) {
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
      window.location.replace("/md/notification");
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
      window.location.replace("/md/notification");
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
    <div></div>
    
  );
}