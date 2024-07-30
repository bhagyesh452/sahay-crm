import React, { useState } from 'react';
import axios from 'axios';
import { Button, Dialog, DialogContent, DialogTitle, IconButton,DialogActions } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";
import { FaPencilAlt } from "react-icons/fa";

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
            <div className='d-flex align-items-center justify-content-between'>
                <div
                    className="My_Text_Wrap"
                    title={nswsPassword}
                >
                    {nswsPassword}
                </div>
                <button className='td_add_remarks_btn'
                    onClick={() => {
                    
                        setOpenPasswordPopup(true)
                    }}
                >
                    <FaPencilAlt />
                </button>
            </div>
          
            <Dialog
                className='My_Mat_Dialog'
                open={openPasswordPopup}
                onClose={handleClosePasswordPopup}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>
                    <h3 className='m-0'>{companyName}</h3>
                </DialogTitle>
                <DialogContent>
                    <div className="card-footer">
                        <div className="mb-3 remarks-input">
                            <input
                                type='text'
                                placeholder="Enter NSWS Password"
                                className="form-control"
                                //value={email}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                </DialogContent>
                <DialogActions className='p-0'>
                    <Button onClick={handleClosePasswordPopup}
                        variant="contained"
                        color="error"
                        style={{ width: "100%",borderRadius:"0px" }} className='m-0'>Close</Button>
                    <Button
                        onClick={handleSubmitNSWSPassword}
                        variant="contained"
                        color="primary"
                        style={{ width: "100%",borderRadius:"0px" }}
                        className='m-0'
                    >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>

    );
};

export default NSWSPasswordInput;

