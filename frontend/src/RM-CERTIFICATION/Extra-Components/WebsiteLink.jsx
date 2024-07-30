import React, { useState } from 'react';
import axios from 'axios';
import { Button, Dialog, DialogContent, DialogTitle, IconButton,DialogActions } from "@mui/material";
import Swal from "sweetalert2";
import { FaPencilAlt } from "react-icons/fa";

const WebsiteLink = ({ companyName, serviceName, websiteLink }) => {
    //const [email, setEmail] = useState('');
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const [link, setLink] = useState('');
    const [openWebsiteLinkPopup, setOpenWebsitePopup] = useState(false);

    const handleSubmitWesbiteLink = async () => {
        //console.log(currentCompanyName, currentServiceName)
        try {
            if (companyName && serviceName) {
                const response = await axios.post(`${secretKey}/rm-services/post-save-websitelink`, {
                    companyName,
                    serviceName,
                    link
                });
                if (response.status === 200) {
                    Swal.fire(
                        'Link Added!',
                        'The email has been successfully added.',
                        'success'
                    );
                    //fetchRMServicesData()
                    setOpenWebsitePopup(false); // Close the popup on success
                }
            }


        } catch (error) {
            console.error("Error saving email:", error.message); // Log only the error message
        }
    };

    const handleCloseWebsiteLinkPopup = () => {
        setOpenWebsitePopup(false)
    }

    return (
        <div>
            <div className='d-flex align-items-center justify-content-between'>
                <div
                    className="My_Text_Wrap"
                    title={websiteLink}
                >
                    {websiteLink}
                </div>
                <button className='td_add_remarks_btn'
                    onClick={() => {

                        setOpenWebsitePopup(true)
                    }}
                >
                    <FaPencilAlt/>
                </button>
            </div>

            <Dialog
                className='My_Mat_Dialog'
                open={openWebsiteLinkPopup}
                onClose={handleCloseWebsiteLinkPopup}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>
                    <h3 className='m-0'>{companyName}</h3>
                </DialogTitle>
                <DialogContent>
                    <div className="card-footer">
                        <div className="remarks-input">
                            <input
                                type='text'
                                placeholder="Enter Website link"
                                className="form-control"
                                //value={email}
                                onChange={(e) => setLink(e.target.value)}
                            />
                        </div>
                    </div>
                </DialogContent>
                <DialogActions className='p-0'>
                    <Button onClick={handleCloseWebsiteLinkPopup}
                        variant="contained"
                        color="error"
                        style={{ width: "100%",borderRadius:"0px" }} className='m-0'>Close</Button>
                    <Button
                        onClick={handleSubmitWesbiteLink}
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

export default WebsiteLink;

