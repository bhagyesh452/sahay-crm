import React from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import axios from "axios";

function ProjectionInformationDialog({
    handleYesClick,
    handleNoClick,
    showDialog
}) {
    return (
        <Dialog
            open={showDialog}   // Ensure this is correctly passed
            onClose={() => { }}  // Disable default onClose behavior
            disableBackdropClick  // Prevent closing on backdrop click
            disableEscapeKeyDown  // Prevent closing on escape key press
            className='My_Mat_Dialog'
        >
            <DialogContent sx={{ width: "lg" }}>
                <div>
                    <div className="request-title m-2 d-flex justify-content-between">
                        <div className="request-content mr-2 text-center">
                            <h3 className="m-0">
                                <b>Do you want to add projection for the day?</b></h3>
                        </div>
                    </div>
                </div>
            </DialogContent>
            <div className="request-reply d-flex justify-content-center align-items-center">
                <button
                    onClick={handleYesClick}
                    className="btn btn-success bdr-radius-none w-100"
                >
                    Yes
                </button>
                <button
                    onClick={handleNoClick}
                    className="btn btn-danger bdr-radius-none w-100"
                >
                    No
                </button>
            </div>
        </Dialog>
    );
}

export default ProjectionInformationDialog;
