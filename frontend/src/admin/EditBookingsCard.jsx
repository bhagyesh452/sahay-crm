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
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { FaRegCopy } from "react-icons/fa";
import CloseIcon from "@mui/icons-material/Close";

function EditBookingsCard({ name, date, time, request, companyName }) {
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const [company, setCompany] = useState(null);
  const [openCompare, setOpenCompare] = useState(false);
  const fetchApproveRequests = async () => {
    try {
      const response = await axios.get(`${secretKey}/editRequestByBde`);
      setCompany(response.data.find((obj) => obj.companyName === companyName));
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    fetchApproveRequests();
  }, []);
  const functionopenpopupCompare = () => {
    setOpenCompare(true);
  };
  const closepopupCompare = () => {
    setOpenCompare(false);
  };
  const formatDatelatest = (inputDate) => {
    const date = new Date(inputDate);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

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
            <CardContent>
              <Typography
                style={{ fontSize: "18px" }}
                variant="h5"
                component="div"
              >
                {name} wants to Edit Bookings
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
                  backgroundColor: "#ceedce",
                  color: "#2e830b",
                  "&:hover": {
                    backgroundColor: "#aabbcc !important",
                    color: "#ffffff !important",
                  },
                }}
                className="btn btn-primary d-none d-sm-inline-block"
                onClick={functionopenpopupCompare}
              >
                View
              </button>
            </div>
          </React.Fragment>
        </Card>
      </Box>

      {/* Dialog Box for Comparing both the forms */}

      <Dialog
        open={openCompare}
        onClose={closepopupCompare}
        fullWidth
        maxWidth="lg"
      >
        <div className="row form-main ">
          <div className="col current-form">
            <DialogTitle>Lead Form Current</DialogTitle>
            {company !== null && (
              <DialogContent>
                <div className="row" style={{ fontSize: "5px" }}>
                  <div className="col">
                    <div className="booking-fields-view">
                      <div className="fields-view-title">BDM Name :</div>
                      <div className="fields-view-value" id="bdmNameValue">
                        {`${company.bdmName}(${company.bdmType})`}
                        <span className="copy-icon">
                          {/* Replace with your clipboard icon */}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="booking-fields-view">
                      <div className="fields-view-title">BDM Email :</div>
                      <div className="fields-view-value">
                        {company.bdmEmail}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col">
                    <div className="booking-fields-view">
                      <div className="fields-view-title">Booking Time :</div>
                      <div className="fields-view-value">
                        {company.bookingTime}
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="booking-fields-view">
                      <div className="fields-view-title">Booking Date :</div>
                      <div className="fields-view-value">
                        {formatDatelatest(company.bookingDate)}
                      </div>
                    </div>
                  </div>
                </div>
                <hr className="m-0 mt-2 mb-2"></hr>
                <div className="row">
                  <div className="col-sm-3">
                    <div className="booking-fields-view">
                      <div className="fields-view-title">Ca Case :</div>
                      <div className="fields-view-value">{company.caCase}</div>
                    </div>
                  </div>
                  {(company.caCommission || company.caCommission !== "") && (
                    <>
                      <div className="col-sm-3">
                        <div className="booking-fields-view">
                          <div className="fields-view-title">Ca Case :</div>
                          <div className="fields-view-value">
                            {company.caCommission}
                          </div>
                        </div>
                      </div>

                      <div className="col-sm-3">
                        <div className="booking-fields-view">
                          <div className="fields-view-title">CA Email :</div>
                          <div className="fields-view-value">
                            {company.caEmail}
                          </div>
                        </div>
                      </div>

                      <div className="col-sm-3">
                        <div className="booking-fields-view">
                          <div className="fields-view-title">CA Number :</div>
                          <div className="fields-view-value">
                            {company.caNumber}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <hr className="m-0 mt-2 mb-2"></hr>
                <div className="row">
                  <div className="col">
                    <div className="booking-fields-view">
                      <div className="fields-view-title">Company Name :</div>
                      <div className="fields-view-value">
                        {company.companyName}
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="booking-fields-view">
                      <div className="fields-view-title">Company Email :</div>
                      <div className="fields-view-value">
                        {company.companyEmail}
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="booking-fields-view">
                      <div className="fields-view-title">Contact Number :</div>
                      <div className="fields-view-value">
                        {company.contactNumber}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <div className="booking-fields-view" id="fieldValue">
                      <div className="fields-view-title">Services :</div>
                      <div className="fields-view-value" id="servicesValue">
                        {company.services}
                      </div>
                    </div>
                  </div>
                </div>
                <hr className="m-0 mt-2 mb-2"></hr>
                <div className="row">
                  <div className="col">
                    <div className="booking-fields-view">
                      <div className="fields-view-title">Payment Terms :</div>
                      <div className="fields-view-value">
                        {company.paymentTerms}
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="booking-fields-view">
                      <div className="fields-view-title">Payment Method :</div>
                      <div className="fields-view-value">
                        {company.paymentMethod}
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="booking-fields-view">
                      <div className="fields-view-title">
                        Original Total Payment :
                      </div>
                      <div className="fields-view-value">
                        {company.originalTotalPayment}
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            )}
          </div>
          <div className="col request-form">
            <DialogTitle>Requested Form</DialogTitle>
            <DialogContent></DialogContent>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default EditBookingsCard;
