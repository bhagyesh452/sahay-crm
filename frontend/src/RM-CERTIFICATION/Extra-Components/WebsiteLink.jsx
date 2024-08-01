import React, { useState } from 'react';
import axios from 'axios';
import { Button, Dialog, DialogContent, DialogTitle, DialogActions, FormHelperText } from "@mui/material";
import Swal from "sweetalert2";
import { FaPencilAlt } from "react-icons/fa";

const WebsiteLink = ({ companyName, serviceName, websiteLink, refreshData }) => {
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const [link, setLink] = useState(websiteLink);
    const [error, setError] = useState('');
    const [openWebsiteLinkPopup, setOpenWebsitePopup] = useState(false);
    const [briefing, setBriefing] = useState('');

    const isValidUrl = (url) => {
        try {
            // Ensure the URL has a protocol, otherwise default to http
            const formattedUrl = url.startsWith('http') ? url : `http://${url}`;
            const urlObj = new URL(formattedUrl);

            // Basic validation for URL
            const validTLDs = ['com', 'org', 'net', 'edu', 'gov', 'mil', 'int', 'io', 'in']; // Add more TLDs as needed
            const domainParts = urlObj.hostname.split('.');
            const domainTLD = domainParts[domainParts.length - 1];

            // Check if the domain part of the URL ends with a valid TLD
            return urlObj.hostname.length > 0 && validTLDs.includes(domainTLD) && !urlObj.hostname.includes('@');
        } catch {
            // URL construction failed, so it's not a valid URL
            return false;
        }
    };

    const handleSubmitWesbiteLink = async () => {
        console.log("Company Name:", companyName);
        console.log("Service Name:", serviceName);
        console.log("Website Link:", link);

        try {
            // Check if link or briefing is provided
            if (link || briefing) {
                // Validate URL only if link is provided
                if (link && !isValidUrl(link)) {
                    setError('Please enter a valid website link.');
                    return;
                }

                if (companyName && serviceName) {
                    console.log("Valid URL:", link);
                    const response = await axios.post(`${secretKey}/rm-services/post-save-websitelink`, {
                        companyName,
                        serviceName,
                        link,
                        briefing
                    });
                    if (response.status === 200) {
                        Swal.fire('Link Added!', 'The link has been successfully added.', 'success');
                        setError('');
                        refreshData();
                        setOpenWebsitePopup(false);
                    } else {
                        console.error("Unexpected response status:", response.status);
                        setError('Failed to add the link. Please try again.');
                    }
                } else {
                    setError('Please provide company and service names.');
                }
            } else {
                setError("Enter at least one of website link or briefing!");
            }
        } catch (error) {
            console.error("Error saving link:", error.response ? error.response.data : error.message);
            setError('An error occurred while saving the link. Please try again.');
        }
    };

    const handleCloseWebsiteLinkPopup = () => {
        setOpenWebsitePopup(false);
    };

    return (
        <div>
            <div className='d-flex align-items-center justify-content-between'>
                <div className="My_Text_Wrap" title={websiteLink}>
                    {websiteLink}
                </div>
                <button className='td_add_remarks_btn' onClick={() => setOpenWebsitePopup(true)}>
                    <FaPencilAlt />
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
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                            />
                        </div>
                        <div className='mt-1' style={{ textAlign: "center" }}>OR</div>
                        <div className="remarks-input mt-1">
                            <textarea
                                type='text'
                                placeholder="Enter Company Briefing"
                                className="form-control"
                                value={briefing}
                                onChange={(e) => setBriefing(e.target.value)}
                            />
                        </div>
                        {error && <FormHelperText error>{error}</FormHelperText>}
                    </div>
                </DialogContent>
                <DialogActions className='p-0'>
                    <Button onClick={handleCloseWebsiteLinkPopup}
                        variant="contained"
                        color="error"
                        style={{ width: "100%", borderRadius: "0px" }} className='m-0'>Close</Button>
                    <Button
                        onClick={handleSubmitWesbiteLink}
                        variant="contained"
                        color="primary"
                        style={{ width: "100%", borderRadius: "0px" }}
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
