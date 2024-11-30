// import React, { useEffect, useState, useRef } from "react";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import axios from "axios";
// import Swal from "sweetalert2";
// import socketIO from "socket.io-client";
// import logo from "../../static/mainLogo.png";
// import { Dialog, DialogContent, DialogTitle } from "@mui/material";
// import ReCAPTCHA from "react-google-recaptcha";
// import SimpleReactCaptcha from "react-simple-captcha";
// import Captcha from "captcha-mini";
// //import { TbNumber0Small } from "react-icons/tb";
// import { useNavigate } from "react-router-dom";

// function RMofCertification({ setrmofcertificationToken }) {

//     const secretKey = process.env.REACT_APP_SECRET_KEY;
//     const captchaKey = process.env.REACT_APP_CAPTCHA_KEY;
//     const navigate = useNavigate();

//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [showPassword, setShowPassword] = useState(false);
//     const [errorMessage, setErrorMessage] = useState("");
//     const [otp, setOtp] = useState("");
//     const [showOtpTextBox, setShowOtpTextBox] = useState(false);
//     const [otpValidTill, setOtpValidTill] = useState(0); // Timer state in seconds
//     const [captchaToken, setCaptchaToken] = useState("");
//     const [showCaptcha, setShowCaptcha] = useState(false);
//     const [data, setData] = useState([]);
//     const [rmCertificationUserId, setRmCertificationUserId] = useState(null);
//     const [designation, setDesignation] = useState("");

//     useEffect(() => {
//         document.title = `AdminHead-Sahay-CRM`;
//     }, []);

//     const fetchData = async () => {
//         try {
//             const response = await axios.get(`${secretKey}/employee/einfo/${email}/${password}`);

//             setData(response.data);
//             setRmCertificationUserId(response.data._id)
//             setDesignation(response.data.designation)
//         } catch (error) {
//             console.log("Error finding employee", error);
//         }
//     };

//     useEffect(() => {
//         if (email && password) {
//             fetchData();
//         }
//     }, [email, password]);


//     // const handleSubmit = async (e) => {
//     //     e.preventDefault()
//     //     try {
//     //         const response = await axios.post(`${secretKey}/rmofcertificationlogin`, {
//     //             email,
//     //             password,
//     //             designation
//     //         })

//     //         const { rmofcertificationToken } = response.data
//     //         console.log(rmofcertificationToken)
//     //         setrmofcertificationToken(rmofcertificationToken)
//     //         localStorage.setItem("RMOfCertificationName", data.ename)
//     //         localStorage.setItem("rmofcertificationToken", rmofcertificationToken)
//     //         localStorage.setItem("rmCertificationUserId", rmCertificationUserId)
//     //         window.location.replace(`/adminhead/dashboard/${rmCertificationUserId}`)

//     //     } catch (error) {
//     //         console.error("Login Failed", error);
//     //         if (error.response.status === 401) {
//     //             if (error.response.data.message === "Invalid email or password") {
//     //                 setErrorMessage("Invalid Credentials");
//     //             } else if (error.response.data.message === "Designation id incorrect") {
//     //                 setErrorMessage("Only Authorized for RM-CERTIFICATION!")
//     //             } else {
//     //                 setErrorMessage("Unknown Error Occured")
//     //             }
//     //         } else {
//     //             setErrorMessage("Unknown Error Occured")
//     //         }
//     //     }
//     // }

//     const onChange = (value) => {
//         setCaptchaToken(value); // Save the reCAPTCHA token
//     };

//     const startOtpTimer = () => {
//         const expiryTime = 90; // 1:30 minute in seconds
//         setOtpValidTill(expiryTime);

//         const timerInterval = setInterval(() => {
//             setOtpValidTill((prev) => {
//                 if (prev <= 1) {
//                     clearInterval(timerInterval);
//                     return 0;
//                 }
//                 return prev - 1;
//             });
//         }, 1000);
//     };

//     const formatTime = (seconds) => {
//         const minutes = Math.floor(seconds / 60);
//         const remainingSeconds = seconds % 60;
//         return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
//     };

//     const validateEmail = (email) => {
//         const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//         return re.test(String(email).toLowerCase());
//     };

//     const handleSendOtp = async (e) => {
//         e.preventDefault();

//         if (email.length === 0) {
//             Swal.fire("Error!", "Please enter your email!", "error");
//             setShowOtpTextBox(false);
//             return;
//         }

//         if (!validateEmail(email)) {
//             Swal.fire("Error!", "Please enter a valid email!", "error");
//             setShowOtpTextBox(false);
//             return;
//         }

//         if (!password) {
//             Swal.fire("Error!", "Please enter your password!", "error");
//             setShowOtpTextBox(false);
//             return;
//         }

//         try {
//             // Show loading feedback immediately
//             Swal.fire({
//                 title: "Sending OTP...",
//                 text: "Please wait while we send the OTP to your email.",
//                 allowOutsideClick: false,
//                 didOpen: () => {
//                     Swal.showLoading();
//                 },
//             });

//             const response = await axios.post(`${secretKey}/rmofcertificationlogin`, { email, password });
//             if (response.status === 200) {
//                 setErrorMessage("");
//                 Swal.fire("Success!", "OTP has been sent to your email!", "success");
//                 setShowOtpTextBox(true);
//                 startOtpTimer();
//                 localStorage.setItem("RMOfCertificationName", data.ename)
//                 localStorage.setItem("rmCertificationUserId", rmCertificationUserId);
//             }
//         } catch (error) {
//             Swal.close();
//             if (error.response && error.response.status === 401) {
//                 setErrorMessage("Invalid email or password.");
//             } else {
//                 setErrorMessage("Something went wrong. Please try again later.");
//             }
//             setShowOtpTextBox(false);
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (otp.length === 0) {
//             Swal.fire("Error!", "Please enter OTP!", "error");
//             return;
//         }

//         if (!captchaToken) {
//             Swal.fire("Error!", "Please complete the CAPTCHA verification!", "error");
//             return;
//         }

//         try {
//             const response = await axios.post(`${secretKey}/verify-otp`, { email, otp, captchaToken });

//             if (response.status === 200) {
//                 const { token, captchaRequired } = response.data;

//                 if (captchaRequired) {
//                     setShowCaptcha(true); // Show CAPTCHA
//                 } else {
//                     // Successfully verified
//                     setrmofcertificationToken(token);
//                     localStorage.setItem("rmofcertificationToken", token);
//                     navigate(`/adminhead/dashboard/${rmCertificationUserId}`);
//                     setShowOtpTextBox(false);
//                     setShowCaptcha(false);
//                     setErrorMessage('');
//                 }
//             }
//         } catch (error) {
//             if (error.response && error.response.status === 400) {
//                 Swal.fire("Error!", "Invalid OTP. Please try again!", "error");
//             } else if (error.response && error.response.status === 406) {
//                 Swal.fire("Error!", "OTP Has Expired!", "error");
//                 setShowOtpTextBox(false);
//                 setShowCaptcha(false);
//             } else if (error.response && error.response.status === 403) {
//                 Swal.fire("Error!", "CAPTCHA validation failed!", "error");
//             } else {
//                 Swal.fire("Error!", "Error verifying OTP. Please try again!", "error");
//             }
//         }
//     };

//     return (
//         <div>
//             <div className="page page-center">
//                 <div className="container container-tight py-4">
//                     <div className="login-card">
//                         <div className="row align-items-stretch">
//                             <div className="col-sm-6 p-0">
//                                 <div className="card card-md h-100">
//                                     <div className="card-body d-flex align-items-center justify-content-center">
//                                         <div className="logo">
//                                             <img src={logo}></img>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="col-sm-6 p-0">
//                                 <div className="card card-md login-box">
//                                     <div className="card-body">
//                                         <h2 className="h2 text-center mb-4">ADMIN-HEAD LOGIN</h2>
//                                         <form action="#" method="get" autocomplete="off" novalidate>

//                                             {/* <div className="mb-3">
//                                                 <label className="form-label">Username</label>
//                                                 <input
//                                                     onChange={(e) => {
//                                                         setEmail(e.target.value)

//                                                     }}
//                                                     type="email"
//                                                     className="form-control"
//                                                     placeholder="Email or Phone Number"
//                                                     autocomplete="off"
//                                                 />
//                                             </div>
//                                             <div className="mb-2">
//                                                 <label className="form-label">
//                                                     Password
//                                                 </label>
//                                                 <div className="input-group input-group-flat">
//                                                     <input
//                                                         onChange={(e) => {
//                                                             setPassword(e.target.value)
//                                                         }}
//                                                         type={showPassword ? "text" : "password"}
//                                                         className="form-control"
//                                                         placeholder="Your password"
//                                                         autoComplete="off"
//                                                     />
//                                                     <span className="input-group-text">
//                                                         <a
//                                                             href="#"
//                                                             className="link-secondary"
//                                                             title="Show password"
//                                                             data-bs-toggle="tooltip"
//                                                             onClick={() => setShowPassword(!showPassword)}
//                                                         >
//                                                             <svg
//                                                                 xmlns="http://www.w3.org/2000/svg"
//                                                                 className="icon"
//                                                                 width="24"
//                                                                 height="24"
//                                                                 viewBox="0 0 24 24"
//                                                                 strokeWidth="2"
//                                                                 stroke="currentColor"
//                                                                 fill="none"
//                                                                 strokeLinecap="round"
//                                                                 strokeLinejoin="round"
//                                                             >
//                                                                 <path stroke="none" d="M0 0h24v24H0z" fill="none" />
//                                                                 <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
//                                                                 <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
//                                                             </svg>
//                                                         </a>
//                                                     </span>
//                                                 </div>
//                                             </div>
//                                             <div style={{ textAlign: "center", color: "red" }}>
//                                                 <span>{errorMessage}</span>
//                                             </div>
//                                             <div className="form-footer">
//                                                 <button
//                                                     type="submit"
//                                                     onClick={handleSubmit}
//                                                     className="btn btn-primary w-100"
//                                                 >
//                                                     Submit
//                                                 </button>
//                                             </div> */}

//                                             {!showOtpTextBox ? (
//                                                 <>
//                                                     <div className="mb-3">
//                                                         <label className="form-label">Username</label>
//                                                         <input
//                                                             onChange={(e) => setEmail(e.target.value)}
//                                                             type="email"
//                                                             className="form-control"
//                                                             placeholder="Email or Phone Number"
//                                                             autocomplete="off"
//                                                         />
//                                                     </div>

//                                                     <div className="mb-2">
//                                                         <label className="form-label">
//                                                             Password
//                                                         </label>
//                                                         <div className="input-group input-group-flat">
//                                                             <input
//                                                                 onChange={(e) => setPassword(e.target.value)}
//                                                                 type={showPassword ? "text" : "password"}
//                                                                 className="form-control"
//                                                                 placeholder="Your password"
//                                                                 autoComplete="off"
//                                                             />
//                                                             <span className="input-group-text">
//                                                                 <a
//                                                                     href="#"
//                                                                     className="link-secondary"
//                                                                     title="Show password"
//                                                                     data-bs-toggle="tooltip"
//                                                                     onClick={() => setShowPassword(!showPassword)}
//                                                                 >
//                                                                     <svg
//                                                                         xmlns="http://www.w3.org/2000/svg"
//                                                                         className="icon"
//                                                                         width="24"
//                                                                         height="24"
//                                                                         viewBox="0 0 24 24"
//                                                                         strokeWidth="2"
//                                                                         stroke="currentColor"
//                                                                         fill="none"
//                                                                         strokeLinecap="round"
//                                                                         strokeLinejoin="round"
//                                                                     >
//                                                                         <path stroke="none" d="M0 0h24v24H0z" fill="none" />
//                                                                         <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
//                                                                         <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
//                                                                     </svg>
//                                                                 </a>
//                                                             </span>
//                                                         </div>
//                                                     </div>

//                                                     <div style={{ textAlign: "center", color: "red" }}>
//                                                         <span>{errorMessage}</span>
//                                                     </div>
//                                                 </>
//                                             ) : (
//                                                 <>
//                                                     <input
//                                                         onChange={(e) => setOtp(e.target.value)}
//                                                         type="text"
//                                                         className="form-control"
//                                                         placeholder="Enter your OTP here"
//                                                         autoComplete="off"
//                                                     />

//                                                     <p className="text-black-50 mt-1">
//                                                         {otpValidTill > 0
//                                                             ? `OTP Expires in: ${formatTime(otpValidTill)} Seconds`
//                                                             : "OTP has expired"}
//                                                     </p>

//                                                     {showCaptcha && <ReCAPTCHA
//                                                         sitekey={captchaKey}
//                                                         onChange={onChange}
//                                                     />}
//                                                 </>
//                                             )}

//                                             <div className="form-footer">
//                                                 {!showOtpTextBox ? <button
//                                                     type="submit"
//                                                     onClick={(e) => handleSendOtp(e)}
//                                                     className="btn btn-primary w-100"
//                                                 >
//                                                     Send OTP
//                                                 </button> : <button
//                                                     type="submit"
//                                                     onClick={(e) => handleSubmit(e)}
//                                                     className="btn btn-primary w-100"
//                                                 >
//                                                     Submit
//                                                 </button>}
//                                             </div>

//                                         </form>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default RMofCertification

import React, { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import Swal from "sweetalert2";
import socketIO from "socket.io-client";
import logo from "../../static/mainLogo.png";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import ReCAPTCHA from "react-google-recaptcha";
import SimpleReactCaptcha from "react-simple-captcha";
import Captcha from "captcha-mini";
//import { TbNumber0Small } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
function RMofCertification({ setrmofcertificationToken }) {

    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const captchaKey = process.env.REACT_APP_CAPTCHA_KEY;
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [otp, setOtp] = useState("");
    const [showOtpTextBox, setShowOtpTextBox] = useState(false);
    const [otpValidTill, setOtpValidTill] = useState(0); // Timer state in seconds
    const [captchaToken, setCaptchaToken] = useState("");
    const [showCaptcha, setShowCaptcha] = useState(false);
    const [data, setData] = useState([]);
    const [rmCertificationUserId, setRmCertificationUserId] = useState(null);
    const [designation, setDesignation] = useState("");






    const [userId, setUserId] = useState(null);
    const [address1, setAddress] = useState("");


    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [captchaText, setCaptchaText] = useState("");
    const [userInput, setUserInput] = useState("");
    const canvasRef = useRef(null);

    const frontendkey = process.env.REACT_APP_FRONTEND_KEY;
    const [timeLeft, setTimeLeft] = useState(60); // Timer starts at 180 seconds (3 minutes)
    const [ename, setEname] = useState("")
    const intervalRef = useRef(null); // Ref to store the timer interval


    useEffect(() => {
        document.title = `AdminHead-Sahay-CRM`;
    }, []);



    // const handleSubmit = async (e) => {
    //     e.preventDefault()
    //     try {
    //         const response = await axios.post(`${secretKey}/rmofcertificationlogin`, {
    //             email,
    //             password,
    //             designation
    //         })

    //         const { rmofcertificationToken } = response.data
    //         console.log(rmofcertificationToken)
    //         setrmofcertificationToken(rmofcertificationToken)
    //         localStorage.setItem("RMOfCertificationName", data.ename)
    //         localStorage.setItem("rmofcertificationToken", rmofcertificationToken)
    //         localStorage.setItem("rmCertificationUserId", rmCertificationUserId)
    //         window.location.replace(`/adminhead/dashboard/${rmCertificationUserId}`)

    //     } catch (error) {
    //         console.error("Login Failed", error);
    //         if (error.response.status === 401) {
    //             if (error.response.data.message === "Invalid email or password") {
    //                 setErrorMessage("Invalid Credentials");
    //             } else if (error.response.data.message === "Designation id incorrect") {
    //                 setErrorMessage("Only Authorized for RM-CERTIFICATION!")
    //             } else {
    //                 setErrorMessage("Unknown Error Occured")
    //             }
    //         } else {
    //             setErrorMessage("Unknown Error Occured")
    //         }
    //     }
    // }

    const startTimer = (otpExpiry) => {
        const expiryTime = new Date(otpExpiry).getTime();
        // console.log("Starting timer. Expiry Time:", expiryTime);

        intervalRef.current = setInterval(() => {
            const currentTime = new Date().getTime();
            const timeLeft = Math.max(0, expiryTime - currentTime);

            // console.log("Timer running. Time left (seconds):", Math.floor(timeLeft / 1000));
            setTimeLeft(Math.floor(timeLeft / 1000)); // Update time left in seconds

            if (timeLeft <= 0) {
                // console.log("Time is up. Clearing timer.");
                clearInterval(intervalRef.current);
                intervalRef.current = null; // Reset interval reference
                if (!isOtpVerified) {
                    setIsOtpSent(false); // Reset OTP sent state
                    setErrorMessage("OTP has expired. Please request a new OTP.");
                    // console.log("OTP expired. Resetting states.");
                }
            }
        }, 1000);
    };

    const stopTimer = () => {
        // console.log("Stopping timer manually.");
        clearInterval(intervalRef.current);
        intervalRef.current = null; // Reset interval reference
    };

    // Handle OTP sending
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        if (!email || !password) {
            setErrorMessage("Please enter email and password.");
            return;
        }

        setIsLoading(true);
        try {
            // Verify email and password first
            const response = await axios.post(`${secretKey}/verifyCredentials`, {
                email,
                password,
            });

            // If credentials are valid, send OTP
            const otpResponse = await axios.post(`${secretKey}/sendOtp`, { email });
            const { otpExpiry } = response.data;
            setIsOtpSent(true);
            const expiryTime = otpExpiry || Date.now() + 1 * 60 * 1000; // Use current time + 3 mins if backend doesn't send `otpExpiry`
            startTimer(expiryTime);
            Swal.fire("Success", "OTP sent to your email.", "success");
        } catch (error) {
            setErrorMessage(error.response.data.message || "Error sending OTP.");
        } finally {
            setIsLoading(false);
        }
    };

    // Handle OTP verification
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        if (!otp) {
            setErrorMessage("Please enter the OTP.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(`${secretKey}/verifyOtp`, {
                email,
                otp,
            });
            setIsOtpVerified(true);
            //console.log("Calling stopTimer after OTP verification.");
            stopTimer(); // Stop the timer upon successful OTP verification
        } catch (error) {
            setErrorMessage(error.response.data.message || "Invalid OTP.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrorMessage("");
        if (!captchaToken) {
            setErrorMessage("Please complete the CAPTCHA.");
            return;
        }
        setIsLoading(true);
        try {
            // Step 1: Verify CAPTCHA
            const captchaResponse = await axios.post(`${secretKey}/verifyCaptcha`, {
                token: captchaToken,
            });

            if (captchaResponse.status !== 200) {
                setErrorMessage("CAPTCHA verification failed. Please try again.");
                return;
            }
            const response = await axios.post(`${secretKey}/rmofcertificationlogin`, {
                email,
                password,
                designation
            })

            const { rmofcertificationToken ,rmCertificationUserId , ename } = response.data
            console.log(rmofcertificationToken ,rmCertificationUserId , ename)
            setrmofcertificationToken(rmofcertificationToken)
            localStorage.setItem("RMOfCertificationName", ename)
            localStorage.setItem("rmofcertificationToken", rmofcertificationToken)
            localStorage.setItem("rmCertificationUserId", rmCertificationUserId)
            navigate(`/adminhead/dashboard/${rmCertificationUserId}`)

        } catch (error) {
            console.error("Login Failed", error);
            if (error.response.status === 401) {
                if (error.response.data.message === "Invalid email or password") {
                    setErrorMessage("Invalid Credentials");
                } else if (error.response.data.message === "Designation id incorrect") {
                    setErrorMessage("Only Authorized for Recruiter!")
                } else {
                    setErrorMessage("Unknown Error Occured")
                }
            } else {
                setErrorMessage("Unknown Error Occured")
            }
        }
    }
    const onCaptchaChange = (token) => {
        setCaptchaToken(token); // Store the CAPTCHA token
    };



    return (
        <div>
            <div className="page page-center">
                <div className="container container-tight py-4">
                    <div className="login-card">
                        <div className="row align-items-stretch">
                            <div className="col-sm-6 p-0">
                                <div className="card card-md h-100">
                                    <div className="card-body d-flex align-items-center justify-content-center">
                                        <div className="logo">
                                            <img src={logo} alt="Logo" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6 p-0">
                                <div className="card card-md login-box">
                                    <div className="card-body">
                                        <h2 className="h2 text-center mb-4">Admin Head Login</h2>
                                        {!isOtpSent && !isOtpVerified && (
                                            // Step 1: Enter Email and Password
                                            <form action="#" method="get" autoComplete="off" noValidate>
                                                <div className="mb-3">
                                                    <label className="form-label">Username</label>
                                                    <input
                                                        onChange={(e) => {
                                                            setEmail(e.target.value);
                                                        }}
                                                        type="email"
                                                        className="form-control"
                                                        placeholder="Email"
                                                        autoComplete="off"
                                                    />
                                                </div>
                                                <div className="mb-2">
                                                    <label className="form-label">Password</label>
                                                    <div className="input-group input-group-flat">
                                                        <input
                                                            onChange={(e) => {
                                                                setPassword(e.target.value);
                                                            }}
                                                            type={showPassword ? "text" : "password"}
                                                            className="form-control"
                                                            placeholder="Your password"
                                                            autoComplete="off"
                                                        />
                                                        <span className="input-group-text">
                                                            <a
                                                                href="#"
                                                                className="link-secondary"
                                                                title="Show password"
                                                                data-bs-toggle="tooltip"
                                                                onClick={() => setShowPassword(!showPassword)}
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="icon"
                                                                    width="24"
                                                                    height="24"
                                                                    viewBox="0 0 24 24"
                                                                    strokeWidth="2"
                                                                    stroke="currentColor"
                                                                    fill="none"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                >
                                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                                    <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                                                                    <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
                                                                </svg>
                                                            </a>
                                                        </span>
                                                    </div>
                                                </div>
                                                <div style={{ textAlign: "center", color: "red" }}>
                                                    <span>{errorMessage}</span>
                                                </div>

                                                <div className="form-footer">
                                                    <button
                                                        type="submit"
                                                        onClick={handleSendOtp}
                                                        className="btn btn-primary w-100"
                                                        disabled={isLoading}
                                                    >
                                                        {isLoading ? "Sending OTP..." : "Send OTP"}
                                                    </button>
                                                </div>
                                            </form>
                                        )}

                                        {isOtpSent && !isOtpVerified && (
                                            // Step 2: Enter OTP
                                            <form action="#" method="get" autoComplete="off" noValidate>
                                                <div className="mb-3">
                                                    <label className="form-label">Enter OTP</label>
                                                    <input
                                                        onChange={(e) => {
                                                            setOtp(e.target.value);
                                                        }}
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="OTP"
                                                        autoComplete="off"
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <span style={{ color: timeLeft <= 10 ? "red" : "lightgrey" }}>
                                                        OTP valid till: {Math.floor(timeLeft / 60)}:
                                                        {timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}
                                                    </span>
                                                </div>
                                                <div style={{ textAlign: "center", color: "red" }}>
                                                    <span>{errorMessage}</span>
                                                </div>
                                                <div className="form-footer">
                                                    <button
                                                        type="submit"
                                                        onClick={handleVerifyOtp}
                                                        className="btn btn-primary w-100"
                                                        disabled={isLoading}
                                                    >
                                                        {isLoading ? "Verifying OTP..." : "Verify OTP"}
                                                    </button>
                                                </div>
                                            </form>
                                        )}

                                        {isOtpVerified && (
                                            // Step 3: CAPTCHA and Final Submit
                                            <form onSubmit={handleSubmit}>
                                                <div className="mb-3">
                                                    <ReCAPTCHA
                                                        sitekey={captchaKey} // Replace with your Google ReCAPTCHA site key
                                                        onChange={onCaptchaChange}
                                                    />
                                                </div>
                                                <div style={{ textAlign: "center", color: "red" }}>
                                                    <span>{errorMessage}</span>
                                                </div>
                                                <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
                                                    {isLoading ? "Submitting..." : "Submit"}
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Optionally, you can add a back button to return to previous steps */}
                </div>
            </div>
        </div>
    );
}

export default RMofCertification