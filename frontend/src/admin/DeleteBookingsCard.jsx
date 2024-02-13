import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

function DeleteBookingsCard({ name, companyName, date, time }) {
  return (
    <div>
      <Box sx={{ minWidth: 275, width: "28vw" }}>
        <Card
          style={{ padding: "10px", margin: "10px 0px" }}
          variant="outlined"
        >
          <React.Fragment>
            <CardContent>
              <Typography
                style={{ fontSize: "18px" }}
                variant="h5"
                component="div"
              >
                {name ? name : "UserName"} Name wants to Delete Bookings
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
                style={{
                  width: "100vw",
                  borderRadius: "0px",
                  backgroundColor: "#f4d0d0",
                  color: "#bc2929",
                }}
                className="btn btn-primary d-none d-sm-inline-block"
              >
                Delete
              </button>
              <button
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
