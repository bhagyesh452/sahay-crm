import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@mui/material";
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

            const { isCorrect, response: feedbackResponse } = response.data;
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
            setTimeout(() => {
                setShowFeedbackDialog(false);
                onClose();
                localStorage.removeItem("currentQuestion");
            }, 3000);
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
                <Dialog
                    open={open}
                    maxWidth="sm"
                    fullWidth
                    onClose={(event, reason) => {
                        if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
                            onClose(); // Only allow manual calls to close the dialog
                        }
                    }}
                >
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
                                    <div className="question-number">Q</div>
                                    <div className="question-text">{questionData?.question}</div>
                                </div>
                                <div className="row opt-row" style={{ marginTop: "60px" }}>
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
                <Dialog open={showFeedbackDialog} onClose={onClose} maxWidth="sm" fullWidth>
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
                            }}
                        >
                            <div className="que-main">
                                <div className="question-number-correct">
                                    {feedbackType === "correct" ? "🎉 Correct!" : "❌ Wrong!"}
                                </div>
                                <div className="question-text-correct">{feedback}</div>
                            </div>
                        </motion.div>
                    </DialogContent>
                </Dialog>
            )}
        </AnimatePresence>
    );
}

export default EmployeeQuestionModal;


// import React, { useState, useEffect } from "react";
// import { Dialog, DialogContent, Typography } from "@mui/material";
// import axios from "axios";
// import success from "../../assets/media/success.mp3";
// import failure from "../../assets/media/failure.mp3";
// import { motion, AnimatePresence } from "framer-motion";

// function EmployeeQuestionModal({ open, onClose, questionData, employeeId }) {
//     const [feedback, setFeedback] = useState(""); // Response feedback
//     const [isSubmitting, setIsSubmitting] = useState(false); // Prevent multiple clicks
//     const [showFeedbackDialog, setShowFeedbackDialog] = useState(false); // Control feedback dialog
//     const [feedbackType, setFeedbackType] = useState(""); // "correct" or "wrong"
//     const secretKey = process.env.REACT_APP_SECRET_KEY;

//     const handleAnswerSubmit = async (selectedAnswer) => {
//         if (isSubmitting) return; // Prevent duplicate submissions
//         setIsSubmitting(true);

//         try {
//             const response = await axios.post(`${secretKey}/question_related_api/submit-answer`, {
//                 empId: employeeId,
//                 questionId: questionData?.questionId,
//                 selectedAnswer,
//             });

//             const { isCorrect, response: feedbackResponse } = response.data;
//             setFeedback(feedbackResponse);

//             if (isCorrect) {
//                 //triggerConfetti("success");
//                 playSound(success);
//                 setFeedbackType("correct");
//                 startFallingEmojis("😊"); // Happy emoji for correct
//             } else {
//                 //triggerConfetti("failure");
//                 playSound(failure);
//                 setFeedbackType("wrong");
//                 // startFallingSadEmojis(); // Trigger sad emojis
//                 startFallingEmojis("😔"); // Sad emoji for wrong
//             }

//             setShowFeedbackDialog(true);

//             // Close feedback after 2 seconds
//             setTimeout(() => {
//                 setShowFeedbackDialog(false);
//                 onClose();
//                 localStorage.removeItem("currentQuestion");
//             }, 3000);
//         } catch (error) {
//             console.error("Error submitting answer:", error);
//             setFeedback("Error submitting your answer. Please try again.");
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     // Play success/failure sound
//     const playSound = (soundFile) => {
//         const sound = new Audio(soundFile);
//         sound.play();
//     };

//     // Function to create falling emojis
//     const startFallingEmojis = (emoji) => {
//         for (let i = 0; i < 30; i++) {
//             createFallingEmoji(emoji);
//         }
//     };

//     const createFallingEmoji = (emoji) => {
//         const emojiElement = document.createElement("div");
//         emojiElement.classList.add("falling-emoji");
//         emojiElement.textContent = emoji;

//         // Randomize emoji position and duration
//         emojiElement.style.left = `${Math.random() * 100}vw`;
//         emojiElement.style.animationDuration = `${Math.random() * 4 + 3}s`;

//         document.body.appendChild(emojiElement);

//         // Remove emoji after animation
//         setTimeout(() => {
//             emojiElement.remove();
//         }, 5000);
//     };

//     useEffect(() => {
//         // Inject CSS for falling emoji animation
//         const style = document.createElement("style");
//         style.innerHTML = `
//         @keyframes fall {
//             0% { transform: translateY(-100%); opacity: 1; }
//             100% { transform: translateY(100vh); opacity: 0; }
//         }

//         .falling-emoji {
//             position: fixed;
//             top: -10%;
//             font-size: 2.5rem;
//             animation: fall linear;
//             pointer-events: none;
//             z-index: 9999;
//         }
//     `;
//         document.head.appendChild(style);

//         return () => style.remove();
//     }, []);

//     const handleOptionClick = (option) => {
//         if (isSubmitting) return;
//         setIsSubmitting(true);
//         handleAnswerSubmit(option);
//         setTimeout(() => setIsSubmitting(false), 2000);
//     };


//     return (
//         <AnimatePresence>
//             {open && !showFeedbackDialog && (
//                 <Dialog open={open} maxWidth="sm" fullWidth
//                     onClose={(event, reason) => {
//                         if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
//                             onClose(); // Only allow manual calls to close the dialog
//                         }
//                     }}
//                 >
//                     <DialogContent style={{ padding: 0, backgroundColor: "#f5f5f5" }}>
//                         <motion.div
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             exit={{ opacity: 0, y: -20 }}
//                             transition={{ duration: 0.5 }}
//                             style={{
//                                 padding: "10px",
//                                 borderRadius: "10px",
//                                 boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
//                                 backgroundColor: "#fff",
//                             }}
//                         >
//                             {/* Header Section */}
//                             <div
//                                 style={{
//                                     backgroundColor: "#007BFF",
//                                     padding: "15px",
//                                     textAlign: "center",
//                                     color: "#fff",
//                                     fontSize: "20px",
//                                     fontWeight: "bold",
//                                     borderTopLeftRadius: "10px",
//                                     borderTopRightRadius: "10px",
//                                 }}
//                             >
//                                 {questionData?.question || "Enter Your Question Here"}
//                             </div>

//                             {/* Options Section */}
//                             <div style={{ padding: "20px" }}>
//                                 <div className="row" style={{ display: "flex", flexWrap: "wrap" }}>
//                                     {questionData?.options?.map((option, index) => {
//                                         const letters = ["A", "B", "C", "D"];
//                                         return (
//                                             <div
//                                                 key={index}
//                                                 style={{
//                                                     flex: "0 0 50%",
//                                                     display: "flex",
//                                                     justifyContent: "center",
//                                                     marginTop: "20px",
//                                                 }}
//                                             >
//                                                 <motion.div
//                                                     whileHover={{ scale: 1.05 }}
//                                                     whileTap={{ scale: 0.95 }}
//                                                     onClick={() => handleOptionClick(option)}
//                                                     style={{
//                                                         width: "80%",
//                                                         padding: "15px",
//                                                         borderRadius: "50px",
//                                                         backgroundColor: "#4caf50",
//                                                         color: "#fff",
//                                                         textAlign: "center",
//                                                         fontWeight: "bold",
//                                                         cursor: "pointer",
//                                                         display: "flex",
//                                                         alignItems: "center",
//                                                         boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
//                                                     }}
//                                                 >
//                                                     {/* Option Circle */}
//                                                     <div
//                                                         style={{
//                                                             width: "40px",
//                                                             height: "40px",
//                                                             borderRadius: "50%",
//                                                             backgroundColor: "#fff",
//                                                             color: "#4caf50",
//                                                             display: "flex",
//                                                             alignItems: "center",
//                                                             justifyContent: "center",
//                                                             marginRight: "10px",
//                                                             fontSize: "18px",
//                                                             fontWeight: "bold",
//                                                         }}
//                                                     >
//                                                         {letters[index]}
//                                                     </div>
//                                                     <Typography style={{ fontSize: "16px", flex: 1 }}>
//                                                         {option}
//                                                     </Typography>
//                                                 </motion.div>
//                                             </div>
//                                         );
//                                     })}
//                                 </div>
//                             </div>
//                         </motion.div>
//                     </DialogContent>
//                 </Dialog>
//             )}

//             {showFeedbackDialog && (
//                 <Dialog open={showFeedbackDialog} onClose={onClose} maxWidth="sm" fullWidth>
//                     <DialogContent style={{ padding: 0 }}>
//                         <motion.div
//                             initial={{ scale: 0.5, opacity: 0 }}
//                             animate={{ scale: 1, opacity: 1 }}
//                             exit={{ scale: 0.5, opacity: 0 }}
//                             transition={{ duration: 0.5 }}
//                             className="q-modal"
//                             style={{
//                                 display: "flex",
//                                 flexDirection: "column",
//                                 alignItems: "center",
//                                 justifyContent: "center",
//                                 padding: "20px",
//                                 textAlign: "center",
//                                 backgroundColor: feedbackType === "correct" ? "#4caf50" : "#f44336",
//                                 color: "#fff",
//                                 borderRadius: "10px",
//                             }}
//                         >
//                             <div className="que-main">
//                                 <div className="question-number-correct">
//                                     {feedbackType === "correct" ? "🎉 Correct!" : "❌ Wrong!"}
//                                 </div>
//                                 <div className="question-text-correct">{feedback}</div>
//                             </div>
//                         </motion.div>
//                     </DialogContent>
//                 </Dialog>
//             )}
//         </AnimatePresence>
//     );
// }

// export default EmployeeQuestionModal;
