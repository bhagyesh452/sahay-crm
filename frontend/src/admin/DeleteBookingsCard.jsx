import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Swal from "sweetalert2";
import axios from "axios";
import { IconButton } from "@mui/material";
import UndoIcon from "@mui/icons-material/Undo";
import { useState , useEffect } from "react";

function DeleteBookingsCard({
  name,
  companyName,
  date,
  time,
  companyId,
  request,
}) {
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const [undoOption, setUndoOption] = useState(false);
  useEffect(() => {
    verifyDelete();
  
    
  }, [])
  

  const handleDelete = async () => {
    // Assuming you have an API endpoint for deleting a company
    try {
      const response = await fetch(`${secretKey}/redesigned-delete-booking/${companyId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const response2 = await axios.delete(
        `${secretKey}/deleterequestbybde/${companyName}`
      );
      Swal.fire({
        title:"Booking Deleted Successfully",
        icon:'success'
      })
     
    } catch (error) {
      Swal.fire({
        title:"Error Deleting the booking!",
        icon:'error'
      })
      console.error('Error deleting booking:', error);
      // Optionally, you can show an error message to the user
    }
  };

  const handleDeleteRequest = async () => {
    try {
      const response = await axios.delete(
        `${secretKey}/deleterequestbybde/${companyName}`
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
      const response = await axios.get(
        `${secretKey}/company/${companyName}`
      );
      setUndoOption(false);
      // Handle success or update state as needed
    } catch (error) {
      console.error("Error deleting company:", error);
      setUndoOption(true);
      // Handle error
    }
  };

  const redoDelete = async ()=>{
    try{
      const response = await axios.delete(`${secretKey}/reverse-delete/${companyName}`);
      setUndoOption(false);
      Swal.fire("Company Restored Successfully!");
    }catch{
      Swal.fire("Failed to retrieve the data");
      setUndoOption(true);
    }
  }

  return (
    <div>
      <Box sx={{ minWidth: 275, width: "28vw" }} className="col">
        <Card
          style={{
            padding: "10px",
            margin: "10px 0px",
            backgroundColor: request && "#cacaca",
          }}
          variant="outlined"
        >
          <React.Fragment>
            <CardContent >
              <Typography
                style={{ fontSize: "18px" }}
                variant="h5"
                component="div"
              >
                {name ? name : "UserName"} wants to Delete Bookings
              </Typography>

              <Typography color="text.secondary">
                Company Name :{" "}
                {companyName ? companyName : "Company Name here.."}
              </Typography>
              <div className="d-flex justify-content-between">
                <Typography color="text.secondary">
                  {date ? date : "dd/mm/yyyy"}
                </Typography>
                <Typography color="text.secondary">
                  {time ? time : "hh:mm"}
                </Typography>
              </div>
            </CardContent>

            <div
              style={{ display: "flex", justifyContent: "space-around" }}
              className="footerbutton"
            >
              <button
                onClick={handleDelete}
                style={{
                  width: "100vw",
                  borderRadius: "0px",
                  backgroundColor: "#f4d0d0",
                  color: "#bc2929",
                }}
                className="btn btn-primary d-none d-sm-inline-block"
                disabled={request}
              >
                Delete
              </button>
              <button
                onClick={handleDeleteRequest}
                style={{
                  width: "100vw",
                  borderRadius: "0px",
                  backgroundColor: "#ceedce",
                  color: "#2e830b",
                  "&:hover": {
                    backgroundColor: "#aabbcc !important",
                    color: "#ffffff !important",
                  },
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
