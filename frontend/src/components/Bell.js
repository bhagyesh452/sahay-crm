import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

const ITEM_HEIGHT = 48;

export default function Bell({ data, gdata }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [backgroundColor, setBackgroundColor] = useState("grey");
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const handleNotificationClick = async (id, read) => {
    try {
      // Update the notification in the backend (set 'read' to true)
      if (read === false) {
        await axios.put(`${secretKey}/api/requestData/${id}`, {
          read: true,
        });

        // Assuming that you have a 'read' property in your MongoDB model
        // Adjust the URL and data structure based on your actual backend implementation
      }

      // Close the menu
    } catch (error) {
      console.error("Error updating notification:", error.message);
    }
  };
  const handleNotificationGClick = async (id, read) => {
    try {
      // Update the notification in the backend (set 'read' to true)
      if (read === false) {
        await axios.put(`${secretKey}/api/requestgData/${id}`, {
          read: true,
        });

        // Assuming that you have a 'read' property in your MongoDB model
        // Adjust the URL and data structure based on your actual backend implementation
      }

      // Close the menu
    } catch (error) {
      console.error("Error updating notification:", error.message);
    }
  };
  const handlecolorChange = () => {
    setBackgroundColor("lightgrey");
  };

  return (
    <div>
      <IconButton
        style={{ alignItems: "normal" }}
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
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
            <span class="badge bg-red"></span>
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
            <span class="badge bg-red"></span>
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
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: "50ch",
          },
        }}
      >
        {data &&
          data.map(
            (option) =>
              // Only render if 'read' is false
              !option.read && (
                <MenuItem
                  key={option.ename}
                  onClick={() => {
                    handleNotificationClick(option._id, option.read);
                    // Change the background color to lightgrey when clicked
                    option.read = true;
                  }}
                >
                  <div
                    style={{ backgroundColor: backgroundColor }}
                    onClick={handlecolorChange}
                  >
                    {option.ename} is requesting for data
                  </div>
                </MenuItem>
              )
          )}
        {gdata &&
          gdata.map(
            (option) =>
              // Only render if 'read' is false
              !option.read && (
                <MenuItem
                  key={option.ename}
                  onClick={() => {
                    handleNotificationGClick(option._id, option.read);
                    // Change the background color to lightgrey when clicked
                    option.read = true;
                  }}
                >
                  <div
                    style={{ backgroundColor: backgroundColor }}
                    onClick={handlecolorChange}
                  >
                    {option.ename} is requesting for General data
                  </div>
                </MenuItem>
              )
          )}

        <div style={{ borderTop: "1px solid black" }} className="foot">
          <Link to={"/notification"}>
            <h4 style={{ textAlign: "center" }}>See All</h4>
          </Link>
        </div>
      </Menu>
    </div>
  );
}
