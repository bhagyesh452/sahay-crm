import React, { useState } from 'react';
import axios from 'axios';
import Swal from "sweetalert2";
import { Button, Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function TodaysCollection({ empId, secretKey }) {

    const [noOfCompany, setNoOfCompany] = useState("");
    const [noOfServiceOffered, setNoOfServiceOffered] = useState("");
    const [offeredPrice, setOffferedPrice] = useState("");
    const [expectedCollection, setExpectedCollection] = useState("");
    const [open, setOpen] = useState(true);
    const [errors, setErrors] = useState({
        noOfCompany: "",
        noOfServiceOffered: "",
        offeredPrice: "",
        expectedCollection: ""
    });

    const closepopup = () => {
        setOpen(false);
    };

    const handleClose = (event, reason) => {
        if (reason === 'backdropClick') {
            return;
        }
        closepopup();
    };

    const date = new Date();
    const currentDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    const currentTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

    const handleSubmit = async () => {
        let formErrors = {
            noOfCompany: noOfCompany === "" ? "No. of Company is required" : "",
            noOfServiceOffered: noOfServiceOffered === "" ? "No. of Service Offered is required" : "",
            offeredPrice: offeredPrice === "" ? "Total Offered Price is required" : "",
            expectedCollection: expectedCollection === "" ? "Total Collection Expected is required" : ""
        };
        setErrors(formErrors);
        if (Object.values(formErrors).some(error => error !== "")) {
            return;
        }

        const payload = {
            empId: empId,
            noOfCompany: noOfCompany,
            noOfServiceOffered: noOfServiceOffered,
            totalOfferedPrice: offeredPrice,
            totalCollectionExpected: expectedCollection,
            date: currentDate,
            time: currentTime
        };
        console.log("Payload data is :", payload);

        try {
            const response = await axios.post(`${secretKey}/employee/addTodaysProjection`, payload);
            console.log("Data sent successfully:", response);
            Swal.fire("Success!", "Data Request Sent!", "success");
            closepopup();
        } catch (error) {
            console.log("Error to send today's collection", error);
            Swal.fire("Error!", "Error to send today's collection!", "error");
        }
    };

    return (
        <>
            <Dialog
                className='My_Mat_Dialog'
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    Today's Project Collection{" "}
                    <IconButton onClick={closepopup} style={{ float: "right" }}>
                        <CloseIcon color="primary" />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-body">
                                <div className='d-flex'>

                                    <div className="mb-3 col-6">
                                        <label className="form-label">No. Of Company</label>
                                        <input
                                            type="number"
                                            value={noOfCompany}
                                            className="form-control"
                                            placeholder="No. Of Company"
                                            required
                                            onChange={(e) => {
                                                setNoOfCompany(e.target.value);
                                                setErrors({ ...errors, noOfCompany: "" });
                                            }}
                                        />
                                        {errors.noOfCompany && <p className="text-danger">{errors.noOfCompany}</p>}
                                    </div>
                                    <div className="mb-3 col-6 mx-1">
                                        <label className="form-label">No. Of Service Offered</label>
                                        <input
                                            type="number"
                                            value={noOfServiceOffered}
                                            className="form-control"
                                            placeholder="No. Of Services"
                                            required
                                            onChange={(e) => {
                                                setNoOfServiceOffered(e.target.value);
                                                setErrors({ ...errors, noOfServiceOffered: "" });
                                            }}
                                        />
                                        {errors.noOfServiceOffered && <p className="text-danger">{errors.noOfServiceOffered}</p>}
                                    </div>
                                </div>
                                <div className='d-flex'>
                                    <div className="mb-3 col-6">
                                        <label className="form-label">Total Offered Price</label>
                                        <input
                                            type="number"
                                            value={offeredPrice}
                                            className="form-control"
                                            placeholder="Offered Price"
                                            required
                                            onChange={(e) => {
                                                setOffferedPrice(e.target.value);
                                                setErrors({ ...errors, offeredPrice: "" });
                                            }}
                                        />
                                        {errors.offeredPrice && <p className="text-danger">{errors.offeredPrice}</p>}
                                    </div>
                                    <div className="mb-3 col-6 mx-1">
                                        <label className="form-label">Total Collection Expected</label>
                                        <input
                                            type="number"
                                            value={expectedCollection}
                                            className="form-control"
                                            placeholder="Expected Collection"
                                            required
                                            onChange={(e) => {
                                                setExpectedCollection(e.target.value);
                                                setErrors({ ...errors, expectedCollection: "" });
                                            }}
                                        />
                                        {errors.expectedCollection && <p className="text-danger">{errors.expectedCollection}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
                <Button
                    className="btn btn-primary bdr-radius-none"
                    onClick={handleSubmit}
                    variant="contained"
                >
                    Submit
                </Button>
            </Dialog>
        </>
    );
}

export default TodaysCollection;