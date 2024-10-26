import React from "react";
import { Dialog, DialogContent } from "@mui/material";

function EmployeeNoPopup({
    noPopup,
    setNoPopup,
    message
}) {
    return (
        <Dialog
            open={noPopup}   // Ensure this is correctly passed
            onClose={() => setNoPopup(false)}  // Correctly handle the onClose behavior
            disableBackdropClick  // Prevent closing on backdrop click
            disableEscapeKeyDown  // Prevent closing on escape key press
            className='My_Mat_Dialog'
        >
            <DialogContent sx={{ width: "lg" }}>
                <div>
                    <div className="request-title m-2 d-flex justify-content-between">
                        <div className="request-content mr-2 text-center">
                            <h3 className="m-0">
                                <b>{message}</b>
                            </h3>
                        </div>
                    </div>
                </div>
            </DialogContent>
            <div className="request-reply d-flex justify-content-center align-items-center">
                <button
                    onClick={() => setNoPopup(false)}  // Correctly handle button click
                    className="btn btn-success bdr-radius-none w-100"
                >
                    Ok
                </button>
            </div>
        </Dialog>
    );
}

export default EmployeeNoPopup;
