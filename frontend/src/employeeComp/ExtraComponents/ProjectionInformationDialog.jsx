import React from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import axios from "axios";

function ProjectionInformationDialog({ 
    showDialog, 
    setShowDialog , 
    userId , 
    setdataStatus,
    secretKey , 
    data , 
    refetch , 
    dataStatus,
    setActiveTabId,
    handleCloseProjectionPopup
}) {
    // Handle the "No" button click - disable dialog for the day
    const currentDate = new Date().toISOString().split('T')[0];

    // Function to update dialog count in the backend
    const updateDialogCount = async (count) => {
        try {
            const currentTime = new Date(); // Get the current time
            console.log("count", count);

            if(data.dialog === 0){
                await axios.post(`${secretKey}/update-dialog-count`, {
                    userId,
                    dialogCount: count,
                    showDialog: count < 3,
                    lastShowDialogTime: currentTime.toISOString(), // Send current time as string
                    firstFetch: true
                });
            }else{
                await axios.post(`${secretKey}/update-dialog-count`, {
                    userId,
                    dialogCount: count,
                    showDialog: count < 3,
                    lastShowDialogTime: currentTime.toISOString(), // Send current time as string
                    firstFetch: false
                });
            }

        } catch (error) {
            console.error("Error updating dialog count:", error);
        }
    };
    const handleNoClick = () => {
        // Set dialog count to 3 and disable the dialog for today
        updateDialogCount(3); // Update in the database
        handleCloseProjectionPopup()
        setActiveTabId(dataStatus)
        refetch()
    };

    const handleYesClick = async () => {
        // Fetch the current dialog count and add 1
        console.log("data" , data.dialogCount)
        const newCount = data.dialogCount + 1;
    
        // If newCount is 3, set showDialog to false, else continue showing it
        await updateDialogCount(newCount);
    
        // Update the data status to "Interested"
        setdataStatus("Interested");
    
        handleCloseProjectionPopup()
        setActiveTabId("Interested")
        refetch()
    };
    return (
        <Dialog
            open={showDialog}   // Ensure this is correctly passed
            onClose={() => {}}  // Disable default onClose behavior
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
                    onClick={() => handleYesClick()}
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
