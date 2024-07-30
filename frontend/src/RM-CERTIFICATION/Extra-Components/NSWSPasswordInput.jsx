import React, { useState } from 'react';
import axios from 'axios';
import { Button, Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";
import { VscSaveAs } from "react-icons/vsc";

const NSWSPasswordInput = ({ companyName, serviceName, nswsPassword}) => {
    const [email, setEmail] = useState('');
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const [password, setPassword] = useState('');
    const [openPasswordPopup, setOpenPasswordPopup] = useState(false);

    const handleSubmitNSWSPassword = async () => {
        //console.log(currentCompanyName, currentServiceName)
        try {
            if (companyName && serviceName) {
                const response = await axios.post(`${secretKey}/rm-services/post-save-nswspassword`, {
                    companyName,
                    serviceName,
                    password
                });
                if (response.status === 200) {
                    Swal.fire(
                        'Password Added!',
                        'The email has been successfully added.',
                        'success'
                    );
                    //fetchRMServicesData()
                    setOpenPasswordPopup(false); // Close the popup on success
                }
            }


        } catch (error) {
            console.error("Error saving email:", error.message); // Log only the error message
        }
    };

   const handleClosePasswordPopup = () => {
        setOpenPasswordPopup(false)
    }

    return (
        <div>
            <div className='d-flex align-item-center justify-content-center'>
            <div
                className="My_Text_Wrap"
                title={nswsPassword}
            >
                {nswsPassword}
            </div>
            <button className='bdr-none' style={{ lineHeight: '10px', fontSize: '10px', backgroundColor: "transparent" }}
                onClick={() => {
                   
                    setOpenPasswordPopup(true)
                }}
            >
                <VscSaveAs style={{ width: "12px", height: "12px" }} />
            </button>
            </div>
          
            <Dialog
                open={openPasswordPopup}
                onClose={handleClosePasswordPopup}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle style={{ fontSize: "12px" }} className='d-flex align-items-center justify-content-between'>
                    {companyName}'s Email
                    <IconButton onClick={handleClosePasswordPopup} style={{ float: "right" }}>
                        <CloseIcon color="primary" style={{ width: "16px" }} />
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
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                </DialogContent>
                <Button
                    onClick={handleSubmitNSWSPassword}
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

export default NSWSPasswordInput;

