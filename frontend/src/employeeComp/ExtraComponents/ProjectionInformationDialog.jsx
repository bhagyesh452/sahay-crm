import React from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";

function ProjectionInformationDialog({ showDialog, setShowDialog , userId , setdataStatus }) {
    // Handle the "No" button click - disable dialog for the day
     // Retrieve dialogDismissedData from localStorage and parse it
     const dialogDismissedData = JSON.parse(localStorage.getItem('dialogDismissedData')) || {};

     // Get the current date in YYYY-MM-DD format
     const currentDate = new Date().toISOString().split('T')[0];
    const handleNoClick = () => {
        // Dismiss the dialog for today for this specific employee
        dialogDismissedData[userId] = {
          dismissedDate: currentDate, // Set the dismissed date to today
          dialogCount: 3 // Set dialogCount to 3 to prevent further dialogs
        };
      
        // Save the updated data back to localStorage
        localStorage.setItem('dialogDismissedData', JSON.stringify(dialogDismissedData));
      
        setShowDialog(false);  // Close the dialog
      };

      const handleYesClick = () => {
        setdataStatus("Interested");

        // Increment the dialog count by 1 for this specific employee
        dialogDismissedData[userId] = {
            dismissedDate: currentDate, // Update the dismissed date to today
            dialogCount: (dialogDismissedData[userId]?.dialogCount || 0) + 1 // Increment dialog count
        };

        // Save the updated data back to localStorage
        localStorage.setItem('dialogDismissedData', JSON.stringify(dialogDismissedData));
      
        setShowDialog(false); // Close the dialog
    };
    return (
        <Dialog
            open={showDialog}   // Ensure this is correctly passed
            onClose={() => setShowDialog(false)}  // Close the dialog
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
