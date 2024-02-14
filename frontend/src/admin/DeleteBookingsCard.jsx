import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Swal from "sweetalert2";
import axios from "axios";

function DeleteBookingsCard({
  name,
  companyName,
  date,
  time,
  companyId,
  request,
}) {
  const secretKey = process.env.REACT_APP_SECRET_KEY;

  const handleDelete = () => {
    // Assuming you have an API endpoint for deleting a company

    fetch(`${secretKey}/company/${companyId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        // Add any additional headers if needed
      },
    })
      .then((response) => {
        if (response.ok) {
          // Successfully deleted
          handleDeleteRequest();
          Swal.fire({ title: "company deleted successfully", icon: "success" });
          // You can also update the UI by refetching the company list or any other action
          // For example, you can call fetchCompanies() here
        } else {
          // Handle error if the delete request fails
          Swal.fire({ title: "Failer to delete company", icon: "error" });
        }
      })
      .catch((error) => {
        console.error("Error during delete request:", error);
      });
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
  return (
    <div>
      <Box sx={{ minWidth: 275, width: "28vw" }}>
        <Card
          style={{
            padding: "10px",
            margin: "10px 0px",
            backgroundColor: request && "#cacaca",
          }}
          variant="outlined"
        >
          <React.Fragment>
            <CardContent>
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
