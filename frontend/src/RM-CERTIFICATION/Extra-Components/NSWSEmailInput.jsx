import React, { useState } from 'react';
import axios from 'axios';
import { VscSaveAs } from "react-icons/vsc";
import EditIcon from "@mui/icons-material/Edit";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";
import { Drawer, Icon, IconButton } from "@mui/material";

const NSWSEmailInput = ({ companyName, serviceName , mainStatus , nswsemail , emailPopupOpen ,openedPopup}) => {
    const [email, setEmail] = useState('');
    const secretKey = process.env.REACT_APP_SECRET_KEY;

    const handleSubmitNSWSEmail = async (companyName, serviceName) => {
        console.log("email", email)
        try {
            const response = await axios.post(`${secretKey}/rm-services/post-save-nswsemail`, {
                companyName,
                serviceName,
                email
            });
            if (response.status === 200) {
                Swal.fire(
                    'Email Added!',
                    'The remarks have been successfully added.',
                    'success'
                );
            }
        } catch (error) {
            console.error("Error saving email:", error.message);

        }
    };

    const handleCloseEmailPopUp=()=>{
        emailPopupOpen(false)
    }

    return (
        <div>
            {/* --------------------------------------------------------------dialog to view remarks only on forwarded status---------------------------------- */}

            <Dialog className='My_Mat_Dialog'
                open={openedPopup}
                onClose={handleCloseEmailPopUp}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    <span style={{ fontSize: "14px" }}>
                        {companyName}'s Email
                    </span>
                    <IconButton onClick={handleCloseEmailPopUp} style={{ float: "right" }}>
                        <CloseIcon color="primary"></CloseIcon>
                    </IconButton>{" "}
                </DialogTitle>
                <DialogContent>
                    <div className="remarks-content">


                        <div class="card-footer">
                            <div class="mb-3 remarks-input">
                                <textarea
                                    placeholder="Add Email Here...  "
                                    className="form-control"
                                    id="remarks-input"
                                    rows="3"
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                    }}
                                ></textarea>
                            </div>

                        </div>

                    </div>

                </DialogContent>
                <button
                    onClick={handleSubmitNSWSEmail}
                    type="submit"
                    className="btn btn-primary bdr-radius-none"
                    style={{ width: "100%" }}
                >
                    Submit
                </button>
            </Dialog>
        </div>
    );
};

export default NSWSEmailInput;
