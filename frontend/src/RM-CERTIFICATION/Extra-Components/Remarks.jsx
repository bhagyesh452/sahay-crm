import React, { useState } from 'react';
import axios from 'axios';
import { Button, Dialog, DialogContent, DialogTitle, DialogActions, FormHelperText } from "@mui/material";
import Swal from "sweetalert2";
import { FaPencilAlt } from "react-icons/fa";

const Remarks = ({ companyName, serviceName, websiteLink, refreshData }) => {
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const [link, setLink] = useState(websiteLink);
    const [error, setError] = useState('');
    const [openWebsiteLinkPopup, setOpenWebsitePopup] = useState(false);
    const [briefing, setBriefing] = useState('');
    const [openRemarksPopUp, setOpenRemarksPopUp] = useState(false);
    const [remarksHistory, setRemarksHistory] = useState([])








    const handleOpenRemarksPopup = async (companyName, serviceName) => {
        console.log("RemarksPopup")
    }
    const functionCloseRemarksPopup = () => {
        setOpenRemarksPopUp(false)
    }
    const debouncedSetChangeRemarks = useCallback(
        debounce((value) => {
            setChangeRemarks(value);
        }, 300), // Adjust the debounce delay as needed (e.g., 300 milliseconds)
        [] // Empty dependency array to ensure the function is memoized
    );


    const handleSubmitRemarks = async () => {
        //console.log("changeremarks", changeRemarks)
        try {
            const response = await axios.post(`${secretKey}/rm-services/post-remarks-for-rmofcertification`, {
                currentCompanyName,
                currentServiceName,
                changeRemarks,
                updatedOn: new Date()
            });

            //console.log("response", response.data);

            if (response.status === 200) {
                fetchRMServicesData();
                functionCloseRemarksPopup();
                Swal.fire(
                    'Remarks Added!',
                    'The remarks have been successfully added.',
                    'success'
                );
            }
        } catch (error) {
            console.log("Error Submitting Remarks", error.message);
        }
    };

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

    return (
        <div>
            <div className='d-flex align-items-center justify-content-between'>
                <div className="My_Text_Wrap" title={remarks}>
                    {websiteLink}
                </div>
                <button className='td_add_remarks_btn' onClick={() => handleOpenRemarksPopup(true)}>
                    <FaPencilAlt />
                </button>
            </div>

            <Dialog className='My_Mat_Dialog'
                open={openRemarksPopUp}
                onClose={functionCloseRemarksPopup}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    <span style={{ fontSize: "14px" }}>
                        {companyName}'s Remarks
                    </span>
                    <IconButton onClick={functionCloseRemarksPopup} style={{ float: "right" }}>
                        <CloseIcon color="primary"></CloseIcon>
                    </IconButton>{" "}
                </DialogTitle>
                <DialogContent>
                    <div className="remarks-content">
                        {historyRemarks.length !== 0 && (
                            historyRemarks.slice().map((historyItem) => (
                                <div className="col-sm-12" key={historyItem._id}>
                                    <div className="card RemarkCard position-relative">
                                        <div className="d-flex justify-content-between">
                                            <div className="reamrk-card-innerText">
                                                <pre className="remark-text">{historyItem.remarks}</pre>
                                            </div>
                                        </div>

                                        <div className="d-flex card-dateTime justify-content-between">
                                            <div className="date">{new Date(historyItem.updatedOn).toLocaleDateString('en-GB')}</div>
                                            <div className="time">{new Date(historyItem.updatedOn).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                        {remarksHistory && remarksHistory.length === 0 && (
                            <div class="card-footer">
                                <div class="mb-3 remarks-input">
                                    <textarea
                                        placeholder="Add Remarks Here...  "
                                        className="form-control"
                                        id="remarks-input"
                                        rows="3"
                                        onChange={(e) => {
                                            debouncedSetChangeRemarks(e.target.value);
                                        }}
                                    ></textarea>
                                </div>

                            </div>
                        )}
                    </div>

                </DialogContent>
                <button
                    onClick={handleSubmitRemarks}
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

export default Remarks;
