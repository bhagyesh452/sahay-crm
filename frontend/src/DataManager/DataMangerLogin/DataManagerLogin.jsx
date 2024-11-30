import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import "leaflet/dist/leaflet.css";
import axios from "axios";
import Swal from "sweetalert2";
import socketIO from "socket.io-client";
import logo from "../../static/mainLogo.png"
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import ReCAPTCHA from "react-google-recaptcha";


function DataManagerLogin({ setManagerToken }) {

  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const captchaKey = process.env.REACT_APP_CAPTCHA_KEY;
  const frontendkey = process.env.REACT_APP_FRONTEND_KEY;
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [data, setData] = useState([]);
  const [otp, setOtp] = useState("");
  const [showOtpTextBox, setShowOtpTextBox] = useState(false);
  const [otpValidTill, setOtpValidTill] = useState(0); // Timer state in seconds
  const [captchaToken, setCaptchaToken] = useState("");
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const [address1, setAddress] = useState("");
  const [designation, setDesignation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [ename, setEname] = useState("");

  useEffect(() => {
    document.title = `Dataanalyst-Sahay-CRM`;
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${secretKey}/employee/einfo`);
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const findUserId = () => {
    const user = data.find(
      (user) => user.email === email && user.password === password
    );
    console.log("user", user)

    if (user) {
      setDesignation(user.designation)
      setUserId(user._id);
      setEname(user.ename)
    } else {
      setUserId(null);
    }
  };
  //console.log(userId)
  console.log(designation, userId, data)

  useEffect(() => {
    fetchData();
  }, []);


  // Trigger the findUserId function when email or password changes
  useEffect(() => {
    findUserId();
  }, [email, password]);

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  // Get current date in string format
  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
    const day = now.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  //console.log(email , password , designation , ename)

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   // const date = getCurrentDate();
  //   // const time = getCurrentTime();
  //   // const address = address1 !== "" ? address1 : "No Location Found";
  //   //const ename = email;


  //   try {
  //     const response = await axios.post(`${secretKey}/datamanagerlogin`, {
  //       email,
  //       password,
  //       designation,
  //     });

  //     const { newtoken } = response.data;
  //     setManagerToken(newtoken);
  //     localStorage.setItem("dataManagerName", ename)
  //     localStorage.setItem("managerToken", newtoken);
  //     localStorage.setItem("dataManagerUserId", userId);
  //     window.location.replace(`/dataanalyst/dashboard/${userId}`);
  //   } catch (error) {
  //     console.error("Login failed:", error);
  //     if (error.response.status === 401) {
  //       if (error.response.data.message === "Invalid email or password") {
  //         setErrorMessage("Invalid credentials");
  //       } else if (error.response.data.message === "Designation is incorrect") {
  //         setErrorMessage("Only Authorized for Data Manager!");
  //       } else {
  //         setErrorMessage("Unknown error occurred");
  //       }
  //     } else {
  //       setErrorMessage("Unknown error occurred");
  //     }
  //   }
  // };

  const onChange = (value) => {
    setCaptchaToken(value); // Save the reCAPTCHA token
  };

  const startOtpTimer = () => {
    const expiryTime = 90; // 1:30 minute in seconds
    setOtpValidTill(expiryTime);

    const timerInterval = setInterval(() => {
      setOtpValidTill((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (email.length === 0) {
      Swal.fire("Error!", "Please enter your email!", "error");
      setShowOtpTextBox(false);
      return;
    }

    if (!validateEmail(email)) {
      Swal.fire("Error!", "Please enter a valid email!", "error");
      setShowOtpTextBox(false);
      return;
    }

    if (!password) {
      Swal.fire("Error!", "Please enter your password!", "error");
      setShowOtpTextBox(false);
      return;
    }

    try {
      // Show loading feedback immediately
      Swal.fire({
        title: "Sending OTP...",
        text: "Please wait while we send the OTP to your email.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await axios.post(`${secretKey}/datamanagerlogin`, { email, password });
      if (response.status === 200) {
        setErrorMessage("");
        Swal.fire("Success!", "OTP has been sent to your email!", "success");
        setShowOtpTextBox(true);
        startOtpTimer();
        localStorage.setItem("dataManagerName", ename)
        localStorage.setItem("dataManagerUserId", userId);
      }
    } catch (error) {
      Swal.close();
      if (error.response && error.response.status === 401) {
        setErrorMessage("Invalid email or password.");
      } else {
        setErrorMessage("Something went wrong. Please try again later.");
      }
      setShowOtpTextBox(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length === 0) {
      Swal.fire("Error!", "Please enter OTP!", "error");
      return;
    }

    if (!captchaToken) {
      Swal.fire("Error!", "Please complete the CAPTCHA verification!", "error");
      return;
    }

    try {
      const response = await axios.post(`${secretKey}/verify-otp`, { email, otp, captchaToken });

      if (response.status === 200) {
        const { token, captchaRequired } = response.data;

        if (captchaRequired) {
          setShowCaptcha(true); // Show CAPTCHA
        } else {
          // Successfully verified
          setManagerToken(token);
          localStorage.setItem("dataManagerToken", token);
          navigate(`/dataanalyst/dashboard/${userId}`);
          setShowOtpTextBox(false);
          setShowCaptcha(false);
          setErrorMessage('');
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        Swal.fire("Error!", "Invalid OTP. Please try again!", "error");
      } else if (error.response && error.response.status === 406) {
        Swal.fire("Error!", "OTP Has Expired!", "error");
        setShowOtpTextBox(false);
        setShowCaptcha(false);
      } else if (error.response && error.response.status === 403) {
        Swal.fire("Error!", "CAPTCHA validation failed!", "error");
      } else {
        Swal.fire("Error!", "Error verifying OTP. Please try again!", "error");
      }
    }
  };

  //console.log(email);
  //console.log(password);


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
                      <img src={logo}></img>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-sm-6 p-0">
                <div className="card card-md login-box">
                  <div className="card-body">
                    <h2 className="h2 text-center mb-4">Data Analyst Login</h2>
                    <form action="#" method="get" autocomplete="off" novalidate>

                      {!showOtpTextBox ? (
                        <>
                          <div className="mb-3">
                            <label className="form-label">Username</label>
                            <input
                              onChange={(e) => setEmail(e.target.value)}
                              type="email"
                              className="form-control"
                              placeholder="Email or Phone Number"
                              autocomplete="off"
                            />
                          </div>

                          <div className="mb-2">
                            <label className="form-label">
                              Password
                              {/* <span className="form-label-description">
                            <a href="./forgot-password.html">I forgot password</a>
                          </span> */}
                            </label>
                            <div className="input-group input-group-flat">
                              <input
                                onChange={(e) => setPassword(e.target.value)}
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
                        </>
                      ) : (
                        <>
                          <input
                            onChange={(e) => setOtp(e.target.value)}
                            type="text"
                            className="form-control"
                            placeholder="Enter your OTP here"
                            autoComplete="off"
                          />

                          <p className="text-black-50 mt-1">
                            {otpValidTill > 0
                              ? `OTP Expires in: ${formatTime(otpValidTill)} Seconds`
                              : "OTP has expired"}
                          </p>

                          {showCaptcha && <ReCAPTCHA
                            sitekey={captchaKey}
                            onChange={onChange}
                          />}
                        </>
                      )}

                      <div className="form-footer">
                        {!showOtpTextBox ? <button
                          type="submit"
                          onClick={(e) => handleSendOtp(e)}
                          className="btn btn-primary w-100"
                        >
                          Send OTP
                        </button> : <button
                          type="submit"
                          onClick={(e) => handleSubmit(e)}
                          className="btn btn-primary w-100"
                        >
                          Submit
                        </button>}
                      </div>

                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataManagerLogin;
