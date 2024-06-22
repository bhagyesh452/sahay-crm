import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Swal from "sweetalert2";
import axios from "axios";
import { IconButton } from "@mui/material";
import UndoIcon from "@mui/icons-material/Undo";
import { useState, useEffect } from "react";

function DeleteBookingsCard({
  name,
  companyName,
  date,
  time,
  Id,
  request,
  bookingIndex
}) {
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const [undoOption, setUndoOption] = useState(false);
  useEffect(() => {
    verifyDelete();
  }, []);
  const isToday = (dateString) => {
    // Get today's date in dd/mm/yyyy format
    const today = new Date().toLocaleDateString();
    return dateString === today;
  };
  
  const handleDelete = async () => {
    // Assuming you have an API endpoint for deleting a company
    try {
      const response = await fetch(
        `${secretKey}/bookings/redesigned-delete-all-booking/${Id}/${bookingIndex}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
     
      Swal.fire({
        title: "Booking Deleted Successfully",
        icon: "success",
      });
    } catch (error) {
      Swal.fire({
        title: "Error Deleting the booking!",
        icon: "error",
      });
      console.error("Error deleting booking:", error);
      // Optionally, you can show an error message to the user
    }
  };

  const handleDeleteRequest = async () => {
    try {
      const response = await axios.delete(
        `${secretKey}/requests/deleterequestbybde/${companyName}`
      );
      console.log("Deleted company:", response.data);
      Swal.fire({ title: "Success", icon: "success" });

      // Handle success or update state as needed
    } catch (error) {
      console.error("Error deleting company:", error);
      // Handle error
    }
  };
  const verifyDelete = async () => {
    try {
      const response = await axios.get(`${secretKey}/company/${companyName}`);
      setUndoOption(false);
      // Handle success or update state as needed
    } catch (error) {
      console.error("Error deleting company:", error);
      setUndoOption(true);
      // Handle error
    }
  };

  const redoDelete = async () => {
    try {
      const response = await axios.delete(
        `${secretKey}/reverse-delete/${companyName}`
      );
      setUndoOption(false);
      Swal.fire("Company Restored Successfully!");
    } catch {
      Swal.fire("Failed to retrieve the data");
      setUndoOption(true);
    }
  };

  return (
    <div>
      <Box sx={{ minWidth: 275, width: "28vw" }} className="col">
        <Card
          className="g-card"
          style={{
            padding: "8px",
            backgroundColor: "#d3d2d2de",
            margin: "10px 0px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            transition: "transform 0.3s",
            "&:hover": {
              transform: "scale(1.02)",
            },
          }}
          variant="outlined"
        >
          <React.Fragment>
            <CardContent>
              <div className="main-content-card d-flex justify-content-between">
                <div
                  style={{
                    fontSize: "16px",
                    marginBottom: "8px",
                    color: "#333",
                  }}
                  variant="h5"
                  component="div"
                >
                  <strong>{name}</strong> wants to Delete Bookings
                  <div
                    className="data-type d-flex justify-content-between"
                    style={{ fontSize: "12px" }}
                  >
                    <div style={{ color: "#797878" }} className="c-type">
                      COMPANY NAME: <strong>{companyName}</strong>
                    </div>
                  </div>
                </div>

                <div className="show-time-card">
                  {isToday(date) ? time : date}
                </div>
              </div>
            </CardContent>

            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                marginTop: "auto",
              }}
              className="footerbutton"
            >
              <button
                onClick={handleDelete}
                style={{
                  width: "45%",
                  borderRadius: "4px",
                  backgroundColor: "#f4d0d0",
                  color: "#bc2929",
                  border: "none",
                  padding: "6px",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                  fontSize: "14px",
                }}
                className="btn btn-primary d-none d-sm-inline-block"
                disabled={request}
              >
                Delete
              </button>
              <button
                onClick={handleDeleteRequest}
                style={{
                  width: "45%",
                  borderRadius: "4px",
                  backgroundColor: "#ceedce",
                  color: "#2e830b",
                  border: "none",
                  padding: "6px",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                  fontSize: "14px",
                }}
                className="btn btn-primary d-none d-sm-inline-block"
                disabled={request}
              >
                Cancel Delete
              </button>
            </div>
          </React.Fragment>
        </Card>
      </Box>
    </div>
  );
}

export default DeleteBookingsCard;
