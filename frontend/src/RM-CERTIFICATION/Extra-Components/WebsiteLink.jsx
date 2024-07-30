import React, { useState } from 'react';
import axios from 'axios';
import { Button, Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";
import { VscSaveAs } from "react-icons/vsc";

const WebsiteLink = ({ companyName, serviceName, websiteLink , refreshData }) => {
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
                    refreshData();
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
            <div className='d-flex align-item-center justify-content-center'>
                <div
                    className="My_Text_Wrap"
                    title={websiteLink}
                >
                    {websiteLink}
                </div>
                <button className='bdr-none' style={{ lineHeight: '10px', fontSize: '10px', backgroundColor: "transparent" }}
                    onClick={() => {

                        setOpenWebsitePopup(true)
                    }}
                >
                    <VscSaveAs style={{ width: "12px", height: "12px" }} />
                </button>
            </div>

            <Dialog
                open={openWebsiteLinkPopup}
                onClose={handleCloseWebsiteLinkPopup}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle style={{ fontSize: "12px" }} className='d-flex align-items-center justify-content-between'>
                    {companyName}'s Link
                    <IconButton onClick={handleCloseWebsiteLinkPopup} style={{ float: "right" }}>
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
                                onChange={(e) => setLink(e.target.value)}
                            />
                        </div>
                    </div>
                </DialogContent>
                <Button
                    onClick={handleSubmitWesbiteLink}
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

export default WebsiteLink;

