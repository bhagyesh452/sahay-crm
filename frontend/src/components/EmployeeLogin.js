// import React, { useEffect, useState, useRef } from "react";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import axios from "axios";
// import Swal from "sweetalert2";
// import socketIO from "socket.io-client";
// import logo from "../static/mainLogo.png";
// import { Dialog, DialogContent, DialogTitle } from "@mui/material";
// import ReCAPTCHA from "react-google-recaptcha";
// import SimpleReactCaptcha from "react-simple-captcha";
// import Captcha from "captcha-mini";


// function EmployeeLogin({ setnewToken }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [data, setData] = useState([]);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [userId, setUserId] = useState(null);
//   const [address1, setAddress] = useState("");
//   const [otp, setOtp] = useState("");
//   const [designation, setDesignation] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [isOtpSent, setIsOtpSent] = useState(false);
//   const [isOtpVerified, setIsOtpVerified] = useState(false);

//   const [isLoading, setIsLoading] = useState(false);
//   const [captchaText, setCaptchaText] = useState("");
//   const [userInput, setUserInput] = useState("");
//   const canvasRef = useRef(null);
//   const secretKey = process.env.REACT_APP_SECRET_KEY;
//   const frontendkey = process.env.REACT_APP_FRONTEND_KEY;
//   const [timeLeft, setTimeLeft] = useState(60); // Timer starts at 180 seconds (3 minutes)


//   const generateCaptcha = () => {
//     const captcha = new Captcha({
//       width: 200, // Width of the CAPTCHA canvas
//       height: 60, // Height of the CAPTCHA canvas
//       fontSize: 30, // Font size of the CAPTCHA text
//       background: "#f2f2f2", // Background color
//       noise: 2, // Amount of noise dots (reduce this for clarity)
//       lines: 3, // Number of interference lines (reduce for readability)
//     });

//     captcha.draw(canvasRef.current, (text) => {
//       setCaptchaText(text); // Save the generated CAPTCHA text
//     });
//   };

//   // Fetch data (unchanged)
//   // const fetchData = async () => {
//   //   try {
//   //     const response = await axios.get(`${secretKey}/employee/einfo`);
//   //     const user = response.data.find(
//   //       (user) => user.email === email && user.password === password
//   //     );
//   //     console.log("user" , user)
//   //     setData(response.data);
//   //     if (user) {
//   //       setUserId(user._id);
//   //       setDesignation(user.designation);
//   //     } else {
//   //       setUserId(null);
//   //     }
//   //   } catch (error) {
//   //     console.log(error);
//   //   }
//   // };

//   useEffect(() => {
//     document.title = `Employee-Sahay-CRM`;
//     //fetchData()
//   }, []);

//   const startTimer = (otpExpiry) => {
//     const expiryTime = new Date(otpExpiry).getTime();
//     console.log("expiryTime" , expiryTime)
//     const interval = setInterval(() => {
//       const currentTime = new Date().getTime();
//       const timeLeft = Math.max(0, expiryTime - currentTime);

//       setTimeLeft(Math.floor(timeLeft / 1000)); // Update time left in seconds

//       if (timeLeft <= 0) {
//         clearInterval(interval);
//         setIsOtpSent(false);
//         setErrorMessage("OTP has expired. Please request a new OTP.");
//       }
//     }, 1000);
//   };

//   // Handle OTP sending
//   const handleSendOtp = async (e) => {
//     e.preventDefault();
//     setErrorMessage("");
//     if (!email || !password) {
//       setErrorMessage("Please enter email and password.");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       // Verify email and password first
//       const response = await axios.post(`${secretKey}/verifyCredentials`, {
//         email,
//         password,
//       });

//       // If credentials are valid, send OTP
//       const otpResponse = await axios.post(`${secretKey}/sendOtp`, { email });
//       const { otpExpiry } = response.data;
//       setIsOtpSent(true);
//       const expiryTime = otpExpiry || Date.now() + 1 * 60 * 1000; // Use current time + 3 mins if backend doesn't send `otpExpiry`
//       startTimer(expiryTime);
//       Swal.fire("Success", "OTP sent to your email.", "success");
//     } catch (error) {
//       setErrorMessage(error.response.data.message || "Error sending OTP.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle OTP verification
//   const handleVerifyOtp = async (e) => {
//     e.preventDefault();
//     setErrorMessage("");
//     if (!otp) {
//       setErrorMessage("Please enter the OTP.");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const response = await axios.post(`${secretKey}/verifyOtp`, {
//         email,
//         otp,
//       });
//       setIsOtpVerified(true);

//     } catch (error) {
//       setErrorMessage(error.response.data.message || "Invalid OTP.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle final login with CAPTCHA
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrorMessage("");

//     setIsLoading(true);
//     try {
//       // Verify CAPTCHA
//       if (userInput !== captchaText) {
//         setErrorMessage("Incorrect CAPTCHA, please try again.");
//       } else {

//         // Log login details (you can keep your existing logic)
//         const date = getCurrentDate();
//         const time = getCurrentTime();
//         const address = address1 !== "" ? address1 : "No Location Found";
//         const ename = email;

//         const response = await axios.post(`${secretKey}/employeelogin`, {
//           email,
//           password,
//           designation,
//         });
//         const response2 = await axios.post(`${secretKey}/loginDetails`, {
//           ename,
//           date,
//           time,
//           address,
//         });

//         console.log("respojse", response)

//         const { newtoken, userId } = response.data;
//         console.log(newtoken, userId);
//         setnewToken(newtoken);
//         setUserId(userId)
//         localStorage.setItem("newtoken", newtoken);
//         localStorage.setItem("userId", userId);

//         // Store designation, login time, and date in localStorage
//         localStorage.setItem("designation", designation);
//         localStorage.setItem("loginTime", new Date().toISOString());
//         localStorage.setItem(
//           "loginDate",
//           new Date().toISOString().substr(0, 10)
//         ); // Store YYYY-MM-DD format

//         window.location.replace(`/employee-dashboard/${userId}`);

//       }
//     } catch (error) {
//       setErrorMessage(error.response.data.message || "Login failed.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Get current date and time functions (unchanged)
//   const getCurrentTime = () => {
//     const now = new Date();
//     const hours = now.getHours().toString().padStart(2, "0");
//     const minutes = now.getMinutes().toString().padStart(2, "0");
//     const seconds = now.getSeconds().toString().padStart(2, "0");
//     return `${hours}:${minutes}:${seconds}`;
//   };

//   const getCurrentDate = () => {
//     const now = new Date();
//     const year = now.getFullYear();
//     const month = (now.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
//     const day = now.getDate().toString().padStart(2, "0");
//     return `${year}-${month}-${day}`;
//   };

//   return (
//     <div>
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
//                     <h2 className="h2 text-center mb-4">Employee Login</h2>
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
//   );
// }

// export default EmployeeLogin;

import React, { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import Swal from "sweetalert2";
import socketIO from "socket.io-client";
import logo from "../static/mainLogo.png";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import ReCAPTCHA from "react-google-recaptcha";
import SimpleReactCaptcha from "react-simple-captcha";
import Captcha from "captcha-mini";
import { useNavigate } from "react-router-dom";


function EmployeeLogin({ setnewToken }) {
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
  const [captchaToken, setCaptchaToken] = useState(null); // To store Google ReCAPTCHA token
  const [isLoading, setIsLoading] = useState(false);
  const [captchaText, setCaptchaText] = useState("");
  const [userInput, setUserInput] = useState("");
  const canvasRef = useRef(null);
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const frontendkey = process.env.REACT_APP_FRONTEND_KEY;
  const captchaKey = process.env.REACT_APP_CAPTCHA_KEY;
  const [timeLeft, setTimeLeft] = useState(60); // Timer starts at 180 seconds (3 minutes)
  const intervalRef = useRef(null); // Ref to store the timer interval
const navigate = useNavigate();

  useEffect(() => {
    document.title = `Employee-Sahay-CRM`;

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
      // console.log("Calling stopTimer after OTP verification.");
      stopTimer(); // Stop the timer upon successful OTP verification
    } catch (error) {
      setErrorMessage(error.response.data.message || "Invalid OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle final login with CAPTCHA
  const handleSubmit = async (e) => {
    e.preventDefault();
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
      // Log login details
      const date = getCurrentDate();
      const time = getCurrentTime();
      const address = address1 !== "" ? address1 : "No Location Found";
      const ename = email;

      const response = await axios.post(`${secretKey}/employeelogin`, {
        email,
        password,
        designation,
      });
      console.log("respojse", response)
      const response2 = await axios.post(`${secretKey}/loginDetails`, {
        ename,
        date,
        time,
        address,
      });

      const { newtoken, userId } = response.data;
      setnewToken(newtoken);
      setUserId(userId);
      localStorage.setItem("newtoken", newtoken);
      localStorage.setItem("userId", userId);

      // Store designation, login time, and date in localStorage
      localStorage.setItem("designation", designation);
      localStorage.setItem("loginTime", new Date().toISOString());
      localStorage.setItem(
        "loginDate",
        new Date().toISOString().substr(0, 10)
      );

      navigate(`/employee-dashboard/${userId}`);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  // Get current date and time functions (unchanged)
  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
    const day = now.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

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
                    <h2 className="h2 text-center mb-4">Employee Login</h2>
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

export default EmployeeLogin;

