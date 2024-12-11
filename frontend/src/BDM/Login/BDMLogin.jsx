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




// export default function BDMLogin({ setBdmToken }) {

//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [data, setData] = useState([]);
//     const [errorMessage, setErrorMessage] = useState("");
//     const [userId, setUserId] = useState(null);
//     const [address1, setAddress] = useState("");
//     const [otp, setOtp] = useState("");
//     const [designation, setDesignation] = useState("");
//     const [showPassword, setShowPassword] = useState(false);
//     const [isOtpSent, setIsOtpSent] = useState(false);
//     const [isOtpVerified, setIsOtpVerified] = useState(false);

//     const [isLoading, setIsLoading] = useState(false);
//     const [captchaText, setCaptchaText] = useState("");
//     const [userInput, setUserInput] = useState("");
//     const canvasRef = useRef(null);
//     const secretKey = process.env.REACT_APP_SECRET_KEY;
//     const frontendkey = process.env.REACT_APP_FRONTEND_KEY;
//     const [timeLeft, setTimeLeft] = useState(60); // Timer starts at 180 seconds (3 minutes)
//     const [ename, setEname] = useState("")





//     useEffect(() => {
//         document.title = `Floor-Manager-Sahay-CRM`;
//     }, []);


//     const fetchData = async () => {
//         try {
//             const response = await axios.get(`${secretKey}/employee/einfo`);
//             //console.log(response.data)
//             setData(response.data)

//         } catch (error) {
//             console.log(error);
//         }
//     }


//     useEffect(() => {
//         fetchData()
//         console.log("data", data)
//     }, [])


//     const findUserId = () => {
//         const user = data.find(
//             (user) => user.email === email && user.password === password
//         );
//         console.log("user", user)
//         if (user) {
//             setDesignation(user.designation)
//             setEname(user.ename)
//             setUserId(user._id);
//         } else {
//             setUserId(null);
//         }
//     };


//     useEffect(() => {
//         findUserId();
//     }, [email, password])

//     const generateCaptcha = () => {
//         const captcha = new Captcha({
//             width: 200, // Width of the CAPTCHA canvas
//             height: 60, // Height of the CAPTCHA canvas
//             fontSize: 30, // Font size of the CAPTCHA text
//             background: "#f2f2f2", // Background color
//             noise: 2, // Amount of noise dots (reduce this for clarity)
//             lines: 3, // Number of interference lines (reduce for readability)
//         });

//         captcha.draw(canvasRef.current, (text) => {
//             setCaptchaText(text); // Save the generated CAPTCHA text
//         });
//     };

//     const startTimer = (otpExpiry) => {
//         const expiryTime = new Date(otpExpiry).getTime();
//         console.log("expiryTime", expiryTime)
//         const interval = setInterval(() => {
//             const currentTime = new Date().getTime();
//             const timeLeft = Math.max(0, expiryTime - currentTime);

//             setTimeLeft(Math.floor(timeLeft / 1000)); // Update time left in seconds

//             if (timeLeft <= 0) {
//                 clearInterval(interval);
//                 setIsOtpSent(false);
//                 setErrorMessage("OTP has expired. Please request a new OTP.");
//             }
//         }, 1000);
//     };

//     const handleSendOtp = async (e) => {
//         e.preventDefault();
//         setErrorMessage("");
//         if (!email || !password) {
//             setErrorMessage("Please enter email and password.");
//             return;
//         }

//         setIsLoading(true);
//         try {
//             // Verify email and password first
//             const response = await axios.post(`${secretKey}/verifyCredentials`, {
//                 email,
//                 password,
//             });

//             // If credentials are valid, send OTP
//             const otpResponse = await axios.post(`${secretKey}/sendOtp`, { email });
//             const { otpExpiry } = response.data;
//             setIsOtpSent(true);
//             const expiryTime = otpExpiry || Date.now() + 1 * 60 * 1000; // Use current time + 3 mins if backend doesn't send `otpExpiry`
//             startTimer(expiryTime);
//             Swal.fire("Success", "OTP sent to your email.", "success");
//         } catch (error) {
//             setErrorMessage(error.response.data.message || "Error sending OTP.");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // Handle OTP verification
//     const handleVerifyOtp = async (e) => {
//         e.preventDefault();
//         setErrorMessage("");
//         if (!otp) {
//             setErrorMessage("Please enter the OTP.");
//             return;
//         }

//         setIsLoading(true);
//         try {
//             const response = await axios.post(`${secretKey}/verifyOtp`, {
//                 email,
//                 otp,
//             });
//             setIsOtpVerified(true);

//         } catch (error) {
//             setErrorMessage(error.response.data.message || "Invalid OTP.");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // console.log(email , password , designation)

//     const handleSubmit = async (e) => {
//         e.preventDefault()
//         setErrorMessage("");
//         setIsLoading(true);
//         // try{
//         //     const response = await axios.post(`${secretKey}/bdmlogin` , {
//         //         email,
//         //         password,
//         //         designation,
//         //     })
//         //     //console.log(response.data)
//         //     const { bdmToken } = response.data
//         //     //console.log(bdmToken)
//         //     setBdmToken(bdmToken)
//         //     localStorage.setItem("bdmName" , ename)
//         //     localStorage.setItem("bdmToken" , bdmToken)
//         //     localStorage.setItem("bdmUserId" , userId)
//         //     window.location.replace(`/floormanager/dashboard/${userId}`)  
//         // }catch(error){
//         //     console.error("Login Failed" , error);
//         //     if(error.response.status === 401){
//         //        if(error.response.data.message === "Invalid email or password"){
//         //         setErrorMessage("Invalid Credentials");
//         //        }else if(error.response.data.message === "Designation id incorrect"){
//         //         setErrorMessage("Only Authorized for Sales Manager or BDM !")
//         //        }else{
//         //         setErrorMessage("Unknown Error Occured")
//         //        }
//         //     }else{
//         //         setErrorMessage("Unknown Error Occured")
//         //     }
//         // }
//         try {
//             // Verify CAPTCHA
//             if (userInput !== captchaText) {
//                 setErrorMessage("Incorrect CAPTCHA, please try again.");
//             } else {

//                 // Log login details (you can keep your existing logic)
//                 const ename = email;

//                 const response = await axios.post(`${secretKey}/bdmlogin`, {
//                     email,
//                     password,
//                     designation,
//                 });


//                 console.log("respojse", response)

//                 const { bdmToken, userId } = response.data;
//                 console.log(bdmToken, userId);
//                 setBdmToken(bdmToken)
//                 localStorage.setItem("bdmName", ename)
//                 localStorage.setItem("bdmToken", bdmToken)
//                 localStorage.setItem("bdmUserId", userId)
//                 window.location.replace(`/floormanager/dashboard/${userId}`)

//             }
//         } catch (error) {
//             setErrorMessage(error.response.data.message || "Login failed.");
//         } finally {
//             setIsLoading(false);
//         }

//     }



//     return (
//         <div>
//       <div className="page page-center">
//         <div className="container container-tight py-4">
//           <div className="login-card">
//             <div className="row align-items-stretch">
//               <div className="col-sm-6 p-0">
//                 <div className="card card-md h-100">
//                   <div className="card-body d-flex align-items-center justify-content-center">
//                     <div className="logo">
//                       <img src={logo} alt="Logo" />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="col-sm-6 p-0">
//                 <div className="card card-md login-box">
//                   <div className="card-body">
//                     <h2 className="h2 text-center mb-4">FLOOR MANAGER LOGIN</h2>
//                     {/* Step 1: Enter Email and Password */}
//                     {!isOtpSent && (
//                       <form action="#" method="get" autoComplete="off" noValidate>
//                         <div className="mb-3">
//                           <label className="form-label">Username</label>
//                           <input
//                             onChange={(e) => {
//                               setEmail(e.target.value);
//                             }}
//                             type="email"
//                             className="form-control"
//                             placeholder="Email"
//                             autoComplete="off"
//                           />
//                         </div>
//                         <div className="mb-2">
//                           <label className="form-label">Password</label>
//                           <div className="input-group input-group-flat">
//                             <input
//                               onChange={(e) => {
//                                 setPassword(e.target.value);
//                               }}
//                               type={showPassword ? "text" : "password"}
//                               className="form-control"
//                               placeholder="Your password"
//                               autoComplete="off"
//                             />
//                             <span className="input-group-text">
//                               <a
//                                 href="#"
//                                 className="link-secondary"
//                                 title="Show password"
//                                 data-bs-toggle="tooltip"
//                                 onClick={() => setShowPassword(!showPassword)}
//                               >
//                                 <svg
//                                   xmlns="http://www.w3.org/2000/svg"
//                                   className="icon"
//                                   width="24"
//                                   height="24"
//                                   viewBox="0 0 24 24"
//                                   strokeWidth="2"
//                                   stroke="currentColor"
//                                   fill="none"
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                 >
//                                   <path stroke="none" d="M0 0h24v24H0z" fill="none" />
//                                   <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
//                                   <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
//                                 </svg>
//                               </a>
//                             </span>
//                           </div>
//                         </div>
//                         <div style={{ textAlign: "center", color: "red" }}>
//                           <span>{errorMessage}</span>
//                         </div>

//                         <div className="form-footer">
//                           <button
//                             type="submit"
//                             onClick={handleSendOtp}
//                             className="btn btn-primary w-100"
//                             disabled={isLoading}
//                           >
//                             {isLoading ? "Sending OTP..." : "Send OTP"}
//                           </button>
//                         </div>
//                       </form>
//                     )}

//                     {/* Step 2: Enter OTP */}
//                     {isOtpSent && !isOtpVerified && (
//                       <form action="#" method="get" autoComplete="off" noValidate>
//                         <div className="mb-3">
//                           <label className="form-label">Enter OTP</label>
//                           <input
//                             onChange={(e) => {
//                               setOtp(e.target.value);
//                             }}
//                             type="text"
//                             className="form-control"
//                             placeholder="OTP"
//                             autoComplete="off"
//                           />
//                         </div>
//                         <div className="mb-3">
//                           <span style={{ color: timeLeft <= 10 ? "red" : "lightgrey" }}>
//                           OTP valid till: {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? `0${timeLeft % 60}` : `${timeLeft % 60}seconds`}
//                           </span>
//                         </div>
//                         <div style={{ textAlign: "center", color: "red" }}>
//                           <span>{errorMessage}</span>
//                         </div>
//                         <div className="form-footer">
//                           <button
//                             type="submit"
//                             onClick={handleVerifyOtp}
//                             className="btn btn-primary w-100"
//                             disabled={isLoading}
//                           >
//                             {isLoading ? "Verifying OTP..." : "Verify OTP"}
//                           </button>
//                         </div>
//                       </form>
//                     )}

//                     {/* Step 3: CAPTCHA and Final Submit */}
//                     {isOtpVerified && (
//                       <form onSubmit={handleSubmit}>
//                         <div className="mb-3">
//                           <canvas ref={canvasRef}></canvas>
//                           <button type="button" className="btn btn-secondary mt-2" onClick={generateCaptcha}>
//                             Generate CAPTCHA
//                           </button>
//                         </div>
//                         <input
//                           type="text"
//                           className="form-control mt-2"
//                           placeholder="Enter CAPTCHA"
//                           onChange={(e) => setUserInput(e.target.value)}
//                         />
//                         {errorMessage && <div style={{ color: "red", marginTop: "10px" }}>{errorMessage}</div>}
//                         <button type="submit" className="btn btn-primary mt-3">
//                           Submit
//                         </button>
//                       </form>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           {/* Optionally, you can add a back button to return to previous steps */}
//         </div>
//       </div>
//     </div>
//     )
// } 

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



export default function BDMLogin({ setBdmToken }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [data, setData] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [userId, setUserId] = useState(null);
    const [address1, setAddress] = useState("");
    const [otp, setOtp] = useState("");
    const [designation, setDesignation] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [captchaText, setCaptchaText] = useState("");
    const [userInput, setUserInput] = useState("");
    const canvasRef = useRef(null);
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const frontendkey = process.env.REACT_APP_FRONTEND_KEY;
    const [timeLeft, setTimeLeft] = useState(60); // Timer starts at 180 seconds (3 minutes)
    const [ename, setEname] = useState("")
    const intervalRef = useRef(null); // Ref to store the timer interval
    const navigate = useNavigate();
    const [captchaToken, setCaptchaToken] = useState(null); // To store Google ReCAPTCHA token
    const captchaKey = process.env.REACT_APP_CAPTCHA_KEY;




    useEffect(() => {
        document.title = `Floor-Manager-Sahay-CRM`;
    }, []);


    // Start the OTP expiry timer
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
                designations: ["Sales Manager"]
            });

            // If credentials are valid, send OTP
            const otpResponse = await axios.post(`${secretKey}/sendOtp`, { email });
            const { otpExpiry } = response.data;
            setIsOtpSent(true);
            const expiryTime = otpExpiry || Date.now() + 1 * 60 * 1000; // Use current time + 3 mins if backend doesn't send `otpExpiry`
            startTimer(expiryTime);
            Swal.fire({
                icon: "success",
                title: "Success",
                html: `A 6-digit OTP has been sent to <b>${email}</b>`,
            });
        } catch (error) {
            setErrorMessage(error.response.data.message || "Error sending OTP.");
        } finally {
            setIsLoading(false);
        }
    };

    // // Handle OTP verification
    // const handleVerifyOtp = async (e) => {
    //     e.preventDefault();
    //     setErrorMessage("");
    //     if (!otp) {
    //         setErrorMessage("Please enter the OTP.");
    //         return;
    //     }

    //     setIsLoading(true);
    //     try {
    //         const response = await axios.post(`${secretKey}/verifyOtp`, {
    //             email,
    //             otp,
    //         });
    //         setIsOtpVerified(true);
    //         //console.log("Calling stopTimer after OTP verification.");
    //         stopTimer(); // Stop the timer upon successful OTP verification
    //     } catch (error) {
    //         setErrorMessage(error.response.data.message || "Invalid OTP.");
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };


    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrorMessage("");
        if (!otp) {
            setErrorMessage("Please enter the OTP.");
            return;
        }

        if (!captchaToken) {
            setErrorMessage("Please complete the CAPTCHA.");
            return;
        }
        setIsLoading(true);
        try {
            // Step 1: Verify OTP
            const otpResponse = await axios.post(`${secretKey}/verifyOtp`, {
                email,
                otp,
            });

            if (otpResponse.status !== 200) {
                setErrorMessage("Invalid or expired OTP.");
                return;
            } else {
                stopTimer();
            }

            // Step 2: Verify CAPTCHA
            const captchaResponse = await axios.post(`${secretKey}/verifyCaptcha`, {
                token: captchaToken,
            });

            if (captchaResponse.status !== 200) {
                setErrorMessage("CAPTCHA verification failed. Please try again.");
                return;
            }
            // Log login details (you can keep your existing logic)
            const ename = email;

            const response = await axios.post(`${secretKey}/bdmlogin`, {
                email,
                password,
                designation,
            });


            console.log("respojse", response)

            const { bdmToken, userId } = response.data;
            console.log(bdmToken, userId);
            setBdmToken(bdmToken)
            localStorage.setItem("bdmName", ename)
            localStorage.setItem("bdmToken", bdmToken)
            localStorage.setItem("bdmUserId", userId)
            navigate(`/floormanager/dashboard/${userId}`)


        } catch (error) {
            setErrorMessage(error.response.data.message || "Login failed.");
        } finally {
            setIsLoading(false);
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
                                        <h2 className="h2 text-center mb-4">FLOOR MANAGER LOGIN</h2>
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
                                                        {isLoading ? (
                                                            <div className="spinner-border text-grey" role="status">
                                                                <span className="visually-hidden">Loading...</span>
                                                            </div>
                                                        ) : (
                                                            "Login"
                                                        )}
                                                    </button>
                                                </div>
                                            </form>
                                        )}

                                        {isOtpSent && (
                                            <form onSubmit={handleSubmit}>
                                                <div className="mb-3">
                                                    <label className="form-label">Enter OTP</label>
                                                    <input
                                                        onChange={(e) => setOtp(e.target.value)}
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
                                                    {isLoading ? (
                                                        <div className="spinner-border text-grey" role="status">
                                                            <span className="visually-hidden">Loading...</span>
                                                        </div>
                                                    ) : (
                                                        "Submit"
                                                    )}
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
    )
} 