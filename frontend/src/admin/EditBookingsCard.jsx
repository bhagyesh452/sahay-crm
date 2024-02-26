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
  const [companyReal, setCompanyReal] = useState(null);
  const [openCompare, setOpenCompare] = useState(false);
  const fetchApproveRequests = async () => {
    try {
      const response = await axios.get(`${secretKey}/editRequestByBde`);
      setCompany(response.data.find((obj) => obj.companyName === companyName));
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };
  const fetchApproveRequestsReal = async () => {
    try {
      const response = await axios.get(`${secretKey}/companies`);
      setCompanyReal(
        response.data.find((obj) => obj.companyName === companyName)
      );
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    fetchApproveRequests();
    fetchApproveRequestsReal();
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

  const handleRejectRequest = async()=>{
    const id = company._id ;
    try {
      const response = await axios.delete(`${secretKey}/delete-edit-request/${id}`);
      Swal.fire({
        title:"Request Rejected!",
        icon:'success'
      })
      setOpenCompare(false);
     
    } catch (error) {
      Swal.fire({
        title:"Request Rejected!",
        icon:'success',
        text:error.message
      })
    }

  }
  const handleAcceptRequest = async () => {
    try {
      // Make API call to move data from BookingsRequestModel to leadModel
      const response = await axios.post(`${secretKey}/accept-booking-request/${company.companyName}` , company);
  
      // Show success message
      Swal.fire({
        title: 'Booking Updated Successfully!',
        icon: 'success'
      });
  
    } catch (error) {
      // Show error message if request fails
      Swal.fire({
        title: 'Error!',
        text: 'Failed to Update Booking. Please try again later.',
        icon: 'error'
      });
      console.error('Error accepting request:', error);
    }
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
                  {date ? formatDatelatest(date) : "dd/mm/yyyy"}
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
        sx={{
          overflowX:"hidden"
        }}
      >
        <div  className="row form-main ">
          <div className="col current-form">
            <DialogTitle>Current Form</DialogTitle>
            {companyReal !== null && (
              <DialogContent>
                <div className="row" style={{ fontSize: "5px" }}>
                  {companyReal !== null && (
                    <div className="col">
                      <div className="booking-fields-view">
                        <div className="fields-view-title">BDM Name :</div>
                        <div className="fields-view-value" id="bdmNameReal">
                          {`${companyReal.bdmName}(${companyReal.bdmType})`}
                          <span className="copy-icon"></span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="col">
                    <div className="booking-fields-view">
                      <div className="fields-view-title">BDM Email :</div>
                      <div className="fields-view-value">
                        {companyReal.bdmEmail}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col">
                    <div className="booking-fields-view">
                      <div className="fields-view-title">Booking Time :</div>
                      <div className="fields-view-value">
                        {companyReal.bookingTime}
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="booking-fields-view">
                      <div className="fields-view-title">Booking Date :</div>
                      <div className="fields-view-value">
                        {formatDatelatest(companyReal.bookingDate)}
                      </div>
                    </div>
                  </div>
                </div>
                <hr className="m-0 mt-2 mb-2"></hr>
                <div className="row">
                  <div className="col-sm-3">
                    <div className="booking-fields-view">
                      <div className="fields-view-title">Ca Case :</div>
                      <div className="fields-view-value">
                        {companyReal.caCase}
                      </div>
                    </div>
                  </div>
                  {(companyReal.caCommission ||
                    companyReal.caCommission !== "") && (
                    <>
                      <div className="col-sm-3">
                        <div className="booking-fields-view">
                          <div className="fields-view-title">
                            Ca commission :
                          </div>
                          <div className="fields-view-value">
                            {companyReal.caCommission}
                          </div>
                        </div>
                      </div>

                      <div className="col-sm-3">
                        <div className="booking-fields-view">
                          <div className="fields-view-title">CA Email :</div>
                          <div className="fields-view-value">
                            {companyReal.caEmail}
                          </div>
                        </div>
                      </div>

                      <div className="col-sm-3">
                        <div className="booking-fields-view">
                          <div className="fields-view-title">CA Number :</div>
                          <div className="fields-view-value">
                            {companyReal.caNumber}
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
                        {companyReal.companyName}
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="booking-fields-view">
                      <div className="fields-view-title">Company Email :</div>
                      <div className="fields-view-value">
                        {companyReal.companyEmail}
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="booking-fields-view">
                      <div className="fields-view-title">Contact Number :</div>
                      <div className="fields-view-value">
                        {companyReal.contactNumber}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <div className="booking-fields-view" id="fieldValue">
                      <div className="fields-view-title">Services :</div>
                      <div className="fields-view-value" id="servicesValue">
                        {companyReal.services}
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
                        {companyReal.paymentTerms}
                      </div>
                    </div>
                  </div>

                  <div className="col">
                    <div className="booking-fields-view">
                      <div className="fields-view-title">
                        Original Total Payment :
                      </div>
                      <div className="fields-view-value">
                        {companyReal.originalTotalPayment}
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="booking-fields-view">
                      <div className="fields-view-title">Total Payment :</div>
                      <div className="fields-view-value">
                        {companyReal.totalPayment}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <div className="booking-fields-view">
                      <div className="fields-view-title">Payment Method :</div>
                      <div className="fields-view-value">
                        {companyReal.paymentMethod}
                      </div>
                    </div>
                  </div>
                </div>
                <hr className="m-0 mt-2 mb-2"></hr>
                <div className="row">
                  {(companyReal.firstPayment ||
                    companyReal.firstPayment === " ") && (
                    <div className="col-sm-3">
                      <div className="booking-fields-view">
                        <div className="fields-view-title">First Payment :</div>
                        <div className="fields-view-value">
                          {companyReal.firstPayment}
                        </div>
                      </div>
                    </div>
                  )}
                  {(companyReal.secondPayment ||
                    companyReal.secondPayment === " ") && (
                    <div className="col-sm-3">
                      <div className="booking-fields-view">
                        <div className="fields-view-title">
                          Second Payment :
                        </div>
                        <div className="fields-view-value">
                          {companyReal.secondPayment}
                        </div>
                      </div>
                    </div>
                  )}
                  {(companyReal.thirdPayment ||
                    companyReal.thirdPayment === " ") && (
                    <div className="col-sm-3">
                      <div className="booking-fields-view">
                        <div className="fields-view-title">Third Payment :</div>
                        <div className="fields-view-value">
                          {companyReal.thirdPayment}
                        </div>
                      </div>
                    </div>
                  )}
                  {(companyReal.fourthPayment ||
                    companyReal.fourthPayment === " ") && (
                    <div className="col-sm-3">
                      <div className="booking-fields-view">
                        <div className="fields-view-title">
                          Fourth Payment :
                        </div>
                        <div className="fields-view-value">
                          {companyReal.fourthPayment}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="row">
                  <div className="col">
                    <div className="booking-fields-view">
                      <div className="fields-view-title">Booking Source :</div>
                      <div className="fields-view-value">
                        {companyReal.bookingSource}
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="booking-fields-view">
                      <div className="fields-view-title">Pan or Gst :</div>
                      <div className="fields-view-value">
                        {companyReal.cPANorGSTnum}
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="booking-fields-view">
                      <div className="fields-view-title">
                        Incorporation Date :
                      </div>
                      <div className="fields-view-value">
                        {formatDatelatest(companyReal.incoDate)}
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="booking-fields-view">
                      <div className="fields-view-title">Extra Notes :</div>
                      <div className="fields-view-value">
                        {companyReal.extraNotes}
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            )}
          </div>
          <div className="col request-form">
            <DialogTitle>Requested Form</DialogTitle>
            {company !== null && companyReal !== null && (
              <DialogContent>
                <div className="row" style={{ fontSize: "5px" }}>
                  {company !== null && (
                    <div className="col">
                      <div className="booking-fields-view">
                        <div className="fields-view-title">BDM Name :</div>
                        <div style={{backgroundColor :company.bdmName !== companyReal.bdmName || company.bdmType !== companyReal.bdmType && "Yellow" }} className="fields-view-value" id="bdmNameAnother">
                          {`${company.bdmName}(${company.bdmType})`}
                          
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="col">
                    <div className="booking-fields-view">
                      <div className="fields-view-title">BDM Email :</div>
                      <div style={{backgroundColor :company.bdmEmail !== companyReal.bdmEmail && "Yellow" }} className="fields-view-value">
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
                      <div style={{backgroundColor :formatDatelatest(company.bookingDate) !== formatDatelatest(companyReal.bookingDate) && "Yellow" }}  className="fields-view-value">
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
                      <div style={{backgroundColor :company.caCase !== companyReal.caCase && "Yellow" }}  className="fields-view-value">{company.caCase}</div>
                    </div>
                  </div>
                  {(company.caCommission || company.caCommission !== "") && (
                    <>
                      <div className="col-sm-3">
                        <div className="booking-fields-view">
                          <div className="fields-view-title">
                            Ca Commission :
                          </div>
                          <div style={{backgroundColor :company.caCommission !== companyReal.caCommission && "Yellow" }}  className="fields-view-value">
                            {company.caCommission}
                          </div>
                        </div>
                      </div>

                      <div className="col-sm-3">
                        <div className="booking-fields-view">
                          <div className="fields-view-title">CA Email :</div>
                          <div style={{backgroundColor :company.caEmail !== companyReal.caEmail && "Yellow" }}  className="fields-view-value">
                            {company.caEmail}
                          </div>
                        </div>
                      </div>

                      <div className="col-sm-3">
                        <div className="booking-fields-view">
                          <div className="fields-view-title">CA Number :</div>
                          <div style={{backgroundColor :company.caNumber !== companyReal.caNumber && "Yellow" }}  className="fields-view-value">
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
                      <div style={{backgroundColor :company.companyName !== companyReal.companyName && "Yellow" }}  className="fields-view-value">
                        {company.companyName}
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="booking-fields-view">
                      <div className="fields-view-title">Company Email :</div>
                      <div style={{backgroundColor :company.companyEmail !== companyReal.companyEmail && "Yellow" }}  className="fields-view-value">
                        {company.companyEmail}
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="booking-fields-view">
                      <div className="fields-view-title">Contact Number :</div>
                      <div style={{backgroundColor :company.contactNumber !== companyReal.contactNumber && "Yellow" }}  className="fields-view-value">
                        {company.contactNumber}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <div className="booking-fields-view" id="fieldValue">
                      <div   className="fields-view-title">Services :</div>
                      <div style={{backgroundColor :company.services[0] !== companyReal.services[0] && "Yellow" }} className="fields-view-value" id="servicesValue">
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
                      <div  style={{backgroundColor :company.paymentTerms !== companyReal.paymentTerms && "Yellow" }} className="fields-view-value">
                        {company.paymentTerms}
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
                  <div className="col">
                    <div className="booking-fields-view">
                      <div className="fields-view-title">Total Payment :</div>
                      <div className="fields-view-value">
                        {company.totalPayment}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <div className="booking-fields-view">
                      <div className="fields-view-title">Payment Method :</div>
                      <div className="fields-view-value">
                        {company.paymentMethod}
                      </div>
                    </div>
                  </div>
                </div>
                <hr className="m-0 mt-2 mb-2"></hr>
                <div className="row">
                  {(company.firstPayment || company.firstPayment === " ") && (
                    <div className="col-sm-3">
                      <div className="booking-fields-view">
                        <div className="fields-view-title">First Payment :</div>
                        <div className="fields-view-value">
                          {company.firstPayment}
                        </div>
                      </div>
                    </div>
                  )}
                  {(company.secondPayment || company.secondPayment === " ") && (
                    <div className="col-sm-3">
                      <div className="booking-fields-view">
                        <div className="fields-view-title">
                          Second Payment :
                        </div>
                        <div className="fields-view-value">
                          {company.secondPayment}
                        </div>
                      </div>
                    </div>
                  )}
                  {(company.thirdPayment || company.thirdPayment === " ") && (
                    <div className="col-sm-3">
                      <div className="booking-fields-view">
                        <div className="fields-view-title">Third Payment :</div>
                        <div className="fields-view-value">
                          {company.thirdPayment}
                        </div>
                      </div>
                    </div>
                  )}
                  {(company.fourthPayment || company.fourthPayment === " ") && (
                    <div className="col-sm-3">
                      <div className="booking-fields-view">
                        <div className="fields-view-title">
                          Fourth Payment :
                        </div>
                        <div className="fields-view-value">
                          {company.fourthPayment}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="row">
                  <div className="col">
                    <div className="booking-fields-view">
                      <div className="fields-view-title">Booking Source :</div>
                      <div className="fields-view-value">
                        {company.bookingSource}
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="booking-fields-view">
                      <div className="fields-view-title">Pan or Gst :</div>
                      <div className="fields-view-value">
                        {company.cPANorGSTnum}
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="booking-fields-view">
                      <div className="fields-view-title">
                        Incorporation Date :
                      </div>
                      <div className="fields-view-value">
                        {formatDatelatest(company.incoDate)}
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="booking-fields-view">
                      <div className="fields-view-title">Extra Notes :</div>
                      <div style={{backgroundColor :company.extraNotes !== companyReal.extraNotes && "Yellow" }} className="fields-view-value">
                        {company.extraNotes}
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            )}

            
          </div>
        </div>
        <div className="row">
              <div className="btn-list col">
                <button
                  className="btn btn-primary ms-auto"
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
                  onClick={handleAcceptRequest}
                >
                  Accept
                </button>
              </div>
              <div className="btn-list col">
                <button
                  style={{
                    width: "100vw",
                    borderRadius: "0px",
                    backgroundColor: "#f4d0d0",
                    color: "#bc2929",
                  }}
                  className="btn btn-primary ms-auto"
                  onClick={handleRejectRequest}
                >
                  Reject
                </button>
              </div>
            </div>
      </Dialog>
    </div>
  );
}

export default EditBookingsCard;

{
  /* <div className="row" style={{ fontSize: "5px" }}>
                  {company.length!==0 && <div className="col">
                    <div className="booking-fields-view">
                      <div className="fields-view-title">BDM Name :</div>
                      <div className="fields-view-value" id="bdmNameAnother">
                        {`${company.bdmName}(${company.bdmType})`}
                        <span className="copy-icon">
                       
                        </span>
                      </div>
                    </div>
                  </div>}
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
                      <div className="fields-view-title">
                        Original Total Payment :
                      </div>
                      <div className="fields-view-value">
                        {company.originalTotalPayment}
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="booking-fields-view">
                      <div className="fields-view-title">Total Payment :</div>
                      <div className="fields-view-value">
                        {company.totalPayment}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <div className="booking-fields-view">
                      <div className="fields-view-title">Payment Method :</div>
                      <div className="fields-view-value">
                        {company.paymentMethod}
                      </div>
                    </div>
                  </div>
                </div>
                <hr className="m-0 mt-2 mb-2"></hr>
                <div className="row">
                  {(company.firstPayment || company.firstPayment === " ") && (
                    <div className="col-sm-3">
                      <div className="booking-fields-view">
                        <div className="fields-view-title">First Payment :</div>
                        <div className="fields-view-value">
                          {company.firstPayment}
                        </div>
                      </div>
                    </div>
                  )}
                  {(company.secondPayment || company.secondPayment === " ") && (
                    <div className="col-sm-3">
                      <div className="booking-fields-view">
                        <div className="fields-view-title">
                          Second Payment :
                        </div>
                        <div className="fields-view-value">
                          {company.secondPayment}
                        </div>
                      </div>
                    </div>
                  )}
                  {(company.thirdPayment || company.thirdPayment === " ") && (
                    <div className="col-sm-3">
                      <div className="booking-fields-view">
                        <div className="fields-view-title">Third Payment :</div>
                        <div className="fields-view-value">
                          {company.thirdPayment}
                        </div>
                      </div>
                    </div>
                  )}
                  {(company.fourthPayment || company.fourthPayment === " ") && (
                    <div className="col-sm-3">
                      <div className="booking-fields-view">
                        <div className="fields-view-title">
                          Fourth Payment :
                        </div>
                        <div className="fields-view-value">
                          {company.fourthPayment}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="row">
                  <div className="col">
                    <div className="booking-fields-view">
                      <div className="fields-view-title">Booking Source :</div>
                      <div className="fields-view-value">
                        {company.bookingSource}
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="booking-fields-view">
                      <div className="fields-view-title">Pan or Gst :</div>
                      <div className="fields-view-value">
                        {company.cPANorGSTnum}
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="booking-fields-view">
                      <div className="fields-view-title">
                        Incorporation Date :
                      </div>
                      <div className="fields-view-value">
                        {formatDatelatest(company.incoDate)}
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="booking-fields-view">
                      <div className="fields-view-title">Extra Notes :</div>
                      <div className="fields-view-value">
                        {company.extraNotes}
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            )}
          </div>
          <div className="col request-form">
            <DialogTitle>Requested Form</DialogTitle>
            <DialogContent>
                <div className="row" style={{ fontSize: "5px" }}>
                  <div className="col">
                    <div className="booking-fields-view">
                      <div className="fields-view-title">BDM Name :</div>
                      <div className="fields-view-value" id="bdmNameValue">
                        {`${company.bdmName}(${company.bdmType})`}
                        <span className="copy-icon">
                          
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
                      <div className="fields-view-title">
                        Original Total Payment :
                      </div>
                      <div className="fields-view-value">
                        {company.originalTotalPayment}
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="booking-fields-view">
                      <div className="fields-view-title">Total Payment :</div>
                      <div className="fields-view-value">
                        {company.totalPayment}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <div className="booking-fields-view">
                      <div className="fields-view-title">Payment Method :</div>
                      <div className="fields-view-value">
                        {company.paymentMethod}
                      </div>
                    </div>
                  </div>
                </div>
                <hr className="m-0 mt-2 mb-2"></hr>
                <div className="row">
                  {(company.firstPayment || company.firstPayment === " ") && (
                    <div className="col-sm-3">
                      <div className="booking-fields-view">
                        <div className="fields-view-title">First Payment :</div>
                        <div className="fields-view-value">
                          {company.firstPayment}
                        </div>
                      </div>
                    </div>
                  )}
                  {(company.secondPayment || company.secondPayment === " ") && (
                    <div className="col-sm-3">
                      <div className="booking-fields-view">
                        <div className="fields-view-title">
                          Second Payment :
                        </div>
                        <div className="fields-view-value">
                          {company.secondPayment}
                        </div>
                      </div>
                    </div>
                  )}
                  {(company.thirdPayment || company.thirdPayment === " ") && (
                    <div className="col-sm-3">
                      <div className="booking-fields-view">
                        <div className="fields-view-title">Third Payment :</div>
                        <div className="fields-view-value">
                          {company.thirdPayment}
                        </div>
                      </div>
                    </div>
                  )}
                  {(company.fourthPayment || company.fourthPayment === " ") && (
                    <div className="col-sm-3">
                      <div className="booking-fields-view">
                        <div className="fields-view-title">
                          Fourth Payment :
                        </div>
                        <div className="fields-view-value">
                          {company.fourthPayment}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="row">
                  <div className="col">
                    <div className="booking-fields-view">
                      <div className="fields-view-title">Booking Source :</div>
                      <div className="fields-view-value">
                        {company.bookingSource}
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="booking-fields-view">
                      <div className="fields-view-title">Pan or Gst :</div>
                      <div className="fields-view-value">
                        {company.cPANorGSTnum}
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="booking-fields-view">
                      <div className="fields-view-title">
                        Incorporation Date :
                      </div>
                      <div className="fields-view-value">
                        {formatDatelatest(company.incoDate)}
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="booking-fields-view">
                      <div className="fields-view-title">Extra Notes :</div>
                      <div className="fields-view-value">
                        {company.extraNotes}
                      </div>
                    </div>
                  </div>
                </div> */
}
