import React, { useState } from 'react';
import axios from 'axios';
import { Button, Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";

const NSWSEmailInput = ({ companyName, serviceName, emailPopupOpen, openedPopup }) => {
    const [email, setEmail] = useState('');
    const secretKey = process.env.REACT_APP_SECRET_KEY;

    const handleSubmitNSWSEmail = async () => {
        try {
            const response = await axios.post(`${secretKey}/rm-services/post-save-nswsemail`, {
                companyName,
                serviceName,
                email
            });
            if (response.status === 200) {
                Swal.fire(
                    'Email Added!',
                    'The email has been successfully added.',
                    'success'
                );
                emailPopupOpen(false); // Close the popup on success
            }
        } catch (error) {
            console.error("Error saving email:", error.message); // Log only the error message
        }
    };

    const handleCloseEmailPopUp = () => {
        emailPopupOpen(false);
    };

    return (
        <Dialog
            open={openedPopup}
            onClose={handleCloseEmailPopUp}
            fullWidth
            maxWidth="xs"
        >
            <DialogTitle>
                {companyName}'s Email
                <IconButton onClick={handleCloseEmailPopUp} style={{ float: "right" }}>
                    <CloseIcon color="primary" />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <div className="card-footer">
                    <div className="mb-3 remarks-input">
                        <input
                            type='text'
                            //placeholder="Add Email Here..."
                            className="form-control"
                            //value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>
            </DialogContent>
            <Button
                onClick={handleSubmitNSWSEmail}
                variant="contained"
                color="primary"
                style={{ width: "100%" }}
            >
                Submit
            </Button>
        </Dialog>
    );
};

export default NSWSEmailInput;

