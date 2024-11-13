import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { IoClose } from "react-icons/io5";
import { RiInformationLine } from "react-icons/ri";
import { styled } from "@mui/material/styles";
import Slider, { SliderThumb } from "@mui/material/Slider";
import { is } from "date-fns/locale";
import axios from "axios";
import Swal from "sweetalert2";

function FeedbackDialog({ companyId, companyName, feedbackRemarks, feedbackPoints, refetchTeamLeads, isEmployeeFeedback, newDesignation, isEditable }) {

    const secretKey = process.env.REACT_APP_SECRET_KEY;
    // console.log("remarks");

    const [feedbackPopupOpen, setFeedbackPopupOpen] = useState(false);
    const [valueSlider1, setValueSlider1] = useState(feedbackPoints[0]);
    const [valueSlider2, setValueSlider2] = useState(feedbackPoints[1]);
    const [valueSlider3, setValueSlider3] = useState(feedbackPoints[2]);
    const [valueSlider4, setValueSlider4] = useState(feedbackPoints[3]);
    const [valueSlider5, setValueSlider5] = useState(feedbackPoints[4]);
    const [remarks, setRemarks] = useState(feedbackRemarks);

    const handleViewFeedback = () => {
        setFeedbackPopupOpen(true);
    };

    const closeFeedbackPopup = () => {
        setFeedbackPopupOpen(false);
        setValueSlider1(feedbackPoints[0]);
        setValueSlider2(feedbackPoints[1]);
        setValueSlider3(feedbackPoints[2]);
        setValueSlider4(feedbackPoints[3]);
        setValueSlider5(feedbackPoints[4]);
        setRemarks(feedbackRemarks);
    };

    const iOSBoxShadow = '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';

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
                boxShadow: '0px 0px 1px 0px rgba(0,0,0,0.2), 0px 0px 0px 0px rgba(0,0,0,0.14), 0px 0px 1px 0px rgba(0,0,0,0.12)',
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

    const handleFeedbackSubmit = async () => {
        const data = {
            feedbackPoints: [valueSlider1, valueSlider2, valueSlider3, valueSlider4, valueSlider5],
            feedbackRemarks: remarks,
        };

        try {
            const response = await axios.post(`${secretKey}/remarks/post-feedback-remarks/${companyId}`, data);

            if (response.status === 200) {
                Swal.fire("Feedback Updated");
                refetchTeamLeads();
                closeFeedbackPopup();
            }
        } catch (error) {
            Swal.fire("Error sending feedback");
            console.log("error", error.message);
        }
    };

    return (
        <>
            <button
                style={{ border: "transparent", background: "none" }}
                onClick={handleViewFeedback}
                disabled={feedbackPoints.length === 0}
            >
                {isEmployeeFeedback ? <RiInformationLine
                    style={{ cursor: "pointer", width: "17px", height: "17px" }}
                    color={feedbackPoints.length === 0 ? "lightgray" : "#fbb900"}
                    title="View Feedback"
                    /> : <RiInformationLine
                    style={{ cursor: "pointer", width: "17px", height: "17px" }}
                    color={(newDesignation && feedbackPoints.length === 0) ? "lightgray" : feedbackPoints.length === 0 ? "black" : "#fbb900"}
                    title={newDesignation ? "View Feedback" : feedbackPoints.length === 0 ? "Add Feedback" : "Update Feedback"}
                />}
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
                                style={{ border: "transparent", background: "none", float: "right" }}>
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
                                        disabled={!isEditable || newDesignation}
                                        defaultValue={feedbackPoints[0]}
                                        value={valueSlider1}
                                        onChange={(e) => setValueSlider1(e.target.value)}
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
                                        disabled={!isEditable || newDesignation}
                                        defaultValue={feedbackPoints[1]}
                                        value={valueSlider2}
                                        onChange={(e) => setValueSlider2(e.target.value)}
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
                                        disabled={!isEditable || newDesignation}
                                        defaultValue={feedbackPoints[2]}
                                        value={valueSlider3}
                                        onChange={(e) => setValueSlider3(e.target.value)}
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
                                        disabled={!isEditable || newDesignation}
                                        defaultValue={feedbackPoints[3]}
                                        value={valueSlider4}
                                        onChange={(e) => setValueSlider4(e.target.value)}
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
                                        disabled={!isEditable || newDesignation}
                                        defaultValue={feedbackPoints[4]}
                                        value={valueSlider5}
                                        onChange={(e) => setValueSlider5(e.target.value)}
                                        min={0}
                                        max={100}
                                        valueLabelDisplay="on"
                                    />
                                </div>

                                <div className="card RemarkCard position-relative">
                                    {isEditable && !newDesignation ?
                                        <>
                                            <div className="py-1 ms-1">Feedback Remarks :</div>
                                            <textarea className="form-control" id="remarks-input" rows="3" placeholder="Enter Remarks Here..."
                                                value={remarks} onChange={(e) => setRemarks(e.target.value)} />
                                        </> :
                                        <div className="d-flex justify-content-between">
                                            <div className="reamrk-card-innerText">
                                                <pre className="remark-text">{feedbackRemarks}</pre>
                                            </div>
                                        </div>
                                    }
                                </div>

                                {isEditable && !newDesignation && <button className="btn btn-primary" onClick={handleFeedbackSubmit}>Submit</button>}
                            </div>
                        )}
                    </div>
                </DialogContent>

            </Dialog>
        </>
    );
}

export default FeedbackDialog;