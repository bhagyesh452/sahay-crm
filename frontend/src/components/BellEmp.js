import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import Bell from "./Bell";
import axios from "axios";
import { useState, useEffect } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import "../assets/styles.css";

export default function BellEmp({ name }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [RequestData, setRequestData] = useState([]);
  const [RequestGData, setRequestGData] = useState([]);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    fetchRequestDetails();
    fetchRequestGDetails();
  }, []);

  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const fetchRequestDetails = async () => {
    try {
      const response = await axios.get(`${secretKey}/requestData`);
      setRequestData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };
  const fetchRequestGDetails = async () => {
    try {
      const response = await axios.get(`${secretKey}/requestgData`);

      setRequestGData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };
  const combinedData = RequestData.concat(RequestGData).filter(
    (item) => item.ename === name
  );
  const formatdate = (date) => {
    const dateObject = new Date(date);
    const options = { month: "short", day: "2-digit" };
    const formattedDate = dateObject.toLocaleDateString("en-US", options);
    return formattedDate;
  };
  const todaydate = new Date();

  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
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
              {combinedData.some((data) => data.assigned) && (
                <span
                  style={{
                    fontSize: "8px",
                    borderRadius: "10px",
                    marginBottom: "9px",
                    padding: "2px",
                  }}
                  className="badge bg-red"
                >
                  {combinedData.filter((data) => data.assigned).length}
                </span>
              )}
            </>
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
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 34,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 12,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {combinedData.length !== 0 &&
          combinedData.map((item) => (
            <MenuItem className="request-list">
              <ListItemIcon>
                <div>
                  <div className="d-flex justify-content-between">
                    <p>You have Requested for {item.dAmount} Data</p>
                    <p style={{ marginLeft: "9px", color: "green" }}>
                      {formatdate(item.cDate) !== formatdate(todaydate)
                        ? formatdate(item.cDate)
                        : item.cTime}
                    </p>
                  </div>

                  <div style={{ fontWeight: "bold" }} className="d-flex">
                    <span>Status :</span>
                    {item.assigned ? (
                      <div style={{ color: "green" }}>Data Received</div>
                    ) : (
                      <div style={{ color: "red" }}>Request Pending</div>
                    )}
                  </div>
                </div>
              </ListItemIcon>
            </MenuItem>
          ))}
      </Menu>
    </React.Fragment>
  );
}
