import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { IoClose } from "react-icons/io5";
import { RiInformationLine } from "react-icons/ri";
import { styled } from "@mui/material/styles";
import Slider, { SliderThumb } from "@mui/material/Slider";


function FeedbackDialog({ companyId, companyName, feedbackRemarks, feedbackPoints }) {
    const [feedbackPopupOpen, setFeedbackPopupOpen] = useState(false);

    const handleViewFeedback = () => {
        // You can add any additional logic here if needed
        setFeedbackPopupOpen(true);
    };

    const closeFeedbackPopup = () => {
        setFeedbackPopupOpen(false);
    };

    const iOSBoxShadow =
    '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';


    const IOSSlider = styled(Slider)(({ theme }) => ({
        color: theme.palette.mode === 'dark' ? '#0a84ff' : '#007bff',
        height: 5,
        padding: '15px 0',
        '& .MuiSlider-thumb': {
            height: 20,
            width: 20,
            backgroundColor: '#fff',
            boxShadow: '0 0 2px 0px rgba(0, 0, 0, 0.1)',
            '&:focus, &:hover, &.Mui-active': {
                boxShadow: '0px 0px 3px 1px rgba(0, 0, 0, 0.1)',
                // Reset on touch devices, it doesn't add specificity
                '@media (hover: none)': {
                    boxShadow: iOSBoxShadow,
                },
            },
            '&:before': {
                boxShadow:
                    '0px 0px 1px 0px rgba(0,0,0,0.2), 0px 0px 0px 0px rgba(0,0,0,0.14), 0px 0px 1px 0px rgba(0,0,0,0.12)',
            },
        },
        '& .MuiSlider-valueLabel': {
            fontSize: 12,
            fontWeight: 'normal',
            top: -6,
            backgroundColor: 'unset',
            color: theme.palette.text.primary,
            '&::before': {
                display: 'none',
            },
            '& *': {
                background: 'transparent',
                color: theme.palette.mode === 'dark' ? '#fff' : '#000',
            },
        },
        '& .MuiSlider-track': {
            border: 'none',
            height: 5,
        },
        '& .MuiSlider-rail': {
            opacity: 0.5,
            boxShadow: 'inset 0px 0px 4px -2px #000',
            backgroundColor: '#d0d0d0',
        },
    }));

    return (
        <>
            <button
                style={{ border: "transparent", background: "none" }}
                onClick={handleViewFeedback}
            >
                <RiInformationLine
                    style={{ cursor: "pointer", width: "17px", height: "17px" }}
                    color={feedbackPoints.length ? "#fbb900" : "lightgrey"}
                />
            </button>

            {/* Feedback Dialog */}
            <Dialog className="My_Mat_Dialog" open={feedbackPopupOpen} onClose={closeFeedbackPopup} fullWidth maxWidth="xs">
                <DialogTitle>
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="m-0" style={{ fontSize: "16px" }}>
                            Feedback Of <span className="text-wrap"> {companyName}</span>
                        </div>
                        <div>
                            <button onClick={closeFeedbackPopup} 
                            style={{ border: "transparent", background: "none" , float:"right" }}>
                                <IoClose color="primary"></IoClose>
                            </button>{" "}
                        </div>
                    </div>
                </DialogTitle>
                <DialogContent>
                    <div className="remarks-content">
                        {(feedbackRemarks || feedbackPoints) && (
                            <div className="col-sm-12">
                                <div className="card RemarkCard position-relative">
                                    <div>A. How was the quality of Information?</div>
                                    <IOSSlider
                                        className="mt-4"
                                        aria-label="ios slider"
                                        disabled
                                        defaultValue={feedbackPoints[0]}
                                        min={0}
                                        max={10}
                                        valueLabelDisplay="on"
                                    />
                                </div>
                                <div className="card RemarkCard position-relative">
                                    <div>B. How was the clarity of communication with lead?</div>
                                    <IOSSlider
                                        className="mt-4"
                                        aria-label="ios slider"
                                        disabled
                                        defaultValue={feedbackPoints[1]}
                                        min={0}
                                        max={10}
                                        valueLabelDisplay="on"
                                    />
                                </div>
                                <div className="card RemarkCard position-relative">
                                    <div>C. How was the accuracy of lead qualification?</div>
                                    <IOSSlider
                                        className="mt-4"
                                        aria-label="ios slider"
                                        disabled
                                        defaultValue={feedbackPoints[2]}
                                        min={0}
                                        max={10}
                                        valueLabelDisplay="on"
                                    />
                                </div>
                                <div className="card RemarkCard position-relative">
                                    <div>D. How was engagement level of lead?</div>
                                    <IOSSlider
                                        className="mt-4"
                                        aria-label="ios slider"
                                        disabled
                                        defaultValue={feedbackPoints[3]}
                                        min={0}
                                        max={10}
                                        valueLabelDisplay="on"
                                    />
                                </div>
                                <div className="card RemarkCard position-relative">
                                    <div>E. Payment Chances?</div>
                                    <IOSSlider
                                        className="mt-4"
                                        aria-label="ios slider"
                                        disabled
                                        defaultValue={feedbackPoints[4]}
                                        min={0}
                                        max={100}
                                        valueLabelDisplay="on"
                                    />
                                </div>
                                <div className="card RemarkCard position-relative">
                                    <div className="d-flex justify-content-between">
                                        <div className="reamrk-card-innerText">
                                            <pre className="remark-text">{feedbackRemarks}</pre>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default FeedbackDialog;
