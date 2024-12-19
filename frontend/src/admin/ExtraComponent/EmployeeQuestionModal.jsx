import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, Button } from "@mui/material";
import axios from "axios";
import success from "../../assets/media/success.mp3";
import failure from "../../assets/media/failure.mp3";
import { motion, AnimatePresence } from "framer-motion";

function EmployeeQuestionModal({ open, onClose, questionData, employeeId }) {
    const [feedback, setFeedback] = useState(""); // Response feedback
    const [isSubmitting, setIsSubmitting] = useState(false); // Prevent multiple clicks
    const [showFeedbackDialog, setShowFeedbackDialog] = useState(false); // Control feedback dialog
    const [feedbackType, setFeedbackType] = useState(""); // "correct" or "wrong"
    const secretKey = process.env.REACT_APP_SECRET_KEY;

    const handleAnswerSubmit = async (selectedAnswer) => {
        if (isSubmitting) return; // Prevent duplicate submissions
        setIsSubmitting(true);

        try {
            const response = await axios.post(`${secretKey}/question_related_api/submit-answer`, {
                empId: employeeId,
                questionId: questionData?.questionId,
                selectedAnswer,
            });
            console.log("response", response.data)


            const { isCorrect, response: feedbackResponse } = response.data;
            console.log("feedbackresponse" , feedbackResponse)
            setFeedback(feedbackResponse);

            if (isCorrect) {
                //triggerConfetti("success");
                playSound(success);
                setFeedbackType("correct");
                startFallingEmojis("😊"); // Happy emoji for correct
            } else {
                //triggerConfetti("failure");
                playSound(failure);
                setFeedbackType("wrong");
                // startFallingSadEmojis(); // Trigger sad emojis
                startFallingEmojis("😔"); // Sad emoji for wrong
            }

            setShowFeedbackDialog(true);

            // Close feedback after 2 seconds
            // setTimeout(() => {
            //     setShowFeedbackDialog(false);
            //     onClose();
            //     localStorage.removeItem("currentQuestion");
            // }, 3000);
        } catch (error) {
            console.error("Error submitting answer:", error);
            setFeedback("Error submitting your answer. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Play success/failure sound
    const playSound = (soundFile) => {
        const sound = new Audio(soundFile);
        sound.play();
    };

    // Function to create falling emojis
    const startFallingEmojis = (emoji) => {
        for (let i = 0; i < 30; i++) {
            createFallingEmoji(emoji);
        }
    };

    const createFallingEmoji = (emoji) => {
        const emojiElement = document.createElement("div");
        emojiElement.classList.add("falling-emoji");
        emojiElement.textContent = emoji;

        // Randomize emoji position and duration
        emojiElement.style.left = `${Math.random() * 100}vw`;
        emojiElement.style.animationDuration = `${Math.random() * 4 + 3}s`;

        document.body.appendChild(emojiElement);

        // Remove emoji after animation
        setTimeout(() => {
            emojiElement.remove();
        }, 5000);
    };

    useEffect(() => {
        // Inject CSS for falling emoji animation
        const style = document.createElement("style");
        style.innerHTML = `
        @keyframes fall {
            0% { transform: translateY(-100%); opacity: 1; }
            100% { transform: translateY(100vh); opacity: 0; }
        }

        .falling-emoji {
            position: fixed;
            top: -10%;
            font-size: 2.5rem;
            animation: fall linear;
            pointer-events: none;
            z-index: 9999;
        }
    `;
        document.head.appendChild(style);

        return () => style.remove();
    }, []);

    return (
        <AnimatePresence>
            {open && !showFeedbackDialog && (
                <Dialog open={open} maxWidth="sm" fullWidth className="question-model" onClose={(event, reason) => {
                    if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
                        onClose(); // Only allow manual calls to close the dialog
                    }
                }}>
                    <DialogContent style={{ padding: 0 }}>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.5 }}
                            className="q-modal"
                        >
                            <div className="modal-body">
                                <div className="que-main">
                                    <div className="question-number">Question</div>
                                    <div className="question-text">{questionData?.question}</div>
                                </div>
                                <div className="row opt-row" style={{ marginTop: "16px" }}>
                                    {questionData?.options?.map((option, index) => (
                                        <div className="col-6 mt-5" key={index}>
                                            <motion.div
                                                className="option-main"
                                                whileHover={{ scale: 1.1 }}
                                                onClick={() => handleAnswerSubmit(option)}
                                            >
                                                <div className="option-text">{option}</div>
                                            </motion.div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </DialogContent>
                </Dialog>
            )}

            {showFeedbackDialog && (
                <Dialog open={showFeedbackDialog} onClose={onClose} maxWidth="sm" fullWidth className="queResposepopup">
                    <DialogContent style={{ padding: 0 }}>
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="q-modal"
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "20px",
                                textAlign: "center",
                                backgroundColor: feedbackType === "correct" ? "#4caf50" : "#f44336",
                                color: "#fff",
                                borderRadius: "10px",
                                whiteSpace: "pre-wrap", // Preserve spaces and line breaks
                            }}
                        >
                            <div className="que-main">
                                <div className="question-number">
                                    {feedbackType === "correct" ? "🎉 Correct!" : "❌ Wrong!"}
                                </div>
                                <div className="question-text">{feedback}</div>
                                <button className="btn"
                                    style={{
                                        backgroundColor:"#7258d1",
                                        color:"white",
                                        border:"none",
                                        rotate:"-1deg"
                                    }}
                                    onClick={() => {
                                        setShowFeedbackDialog(false);
                                        onClose();
                                        localStorage.removeItem("currentQuestion");
                                    }}>Close</button>
                            </div>
                        </motion.div>
                    </DialogContent>
                </Dialog>
            )}
        </AnimatePresence>
    );
}

export default EmployeeQuestionModal;
