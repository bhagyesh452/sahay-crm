import React, { useState } from 'react';
import axios from 'axios';
import { Button, Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";
import { VscSaveAs } from "react-icons/vsc";

const NSWSEmailInput = ({ companyName, serviceName, nswsMailId ,refreshData}) => {
    const [email, setEmail] = useState('');
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const [openEmailPopup, setOpenEmailPopup] = useState(false);

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
                refreshData();
                setOpenEmailPopup(false); // Close the popup on success
            }
        } catch (error) {
            console.error("Error saving email:", error.message); // Log only the error message
        }
    };

    const handleCloseEmailPopUp = () => {
              setOpenEmailPopup(false)
    };

    return (
        <div>
            <div className='d-flex align-item-center justify-content-center'>
            <div
                className="My_Text_Wrap"
                title={nswsMailId}
            >
                {nswsMailId}
            </div>
            <button className='bdr-none' style={{ lineHeight: '10px', fontSize: '10px', backgroundColor: "transparent" }}
                onClick={() => {
                   
                    setOpenEmailPopup(true)
                }}
            >
                <VscSaveAs style={{ width: "12px", height: "12px" }} />
            </button>
            </div>
          
            <Dialog
                open={openEmailPopup}
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
                                type='email'
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
        </div>

    );
};

export default NSWSEmailInput;

