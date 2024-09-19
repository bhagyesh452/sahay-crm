import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from "sweetalert2";
import logo from "../static/mainLogo.png";

function CustomerLogin() {
    const secretKey = process.env.REACT_APP_SECRET_KEY;

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [showOtpTextBox, setShowOtpTextBox] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [otpValidTill, setOtpValidTill] = useState(0); // Timer state in seconds

    const navigate = useNavigate();

    const startOtpTimer = () => {
        const expiryTime = 10 * 60; // 10 minutes in seconds
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

    const handleSendOtp = async () => {
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


        try {
            const response2 = await axios.get(`${secretKey}/customer/fetch-lead-from-email/${email}`);
            startOtpTimer(); // Start the timer

            if (response2.status === 200) {
                console.log("Fetched data is:", response2.data.data);
                setErrorMessage("");

                localStorage.setItem("companyName", response2.data.data["Company Name"]);
                localStorage.setItem("companyEmail", response2.data.data["Company Email"]);
                localStorage.setItem("companyPhoneNo", response2.data.data["Company Number"]);
                localStorage.setItem("companyPanNo", response2.data.data["panNumber"]);
                localStorage.setItem("companyServices", response2.data.data["services"]);

                const response = await axios.post(`${secretKey}/customer/send-otp`, { email });

                if (response.status === 200) {
                    setShowOtpTextBox(true);
                } else {
                    setShowOtpTextBox(false);
                    Swal.fire("Error!", "Error sending OTP... Please try again!", "error");
                }
            } else {
                setShowOtpTextBox(false);
                Swal.fire("Error!", "This Email is not registered...Please login through registered Email", "error");
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setShowOtpTextBox(false);
                Swal.fire("Error!", "This Email is not registered...Please login through registered Email!", "error");
            } else {
                setShowOtpTextBox(false);
                Swal.fire("Error!", "Error sending OTP... Please try again!", "error");
            }
        }
    };

    const handleSubmit = async (e) => {
        const companyName = localStorage.getItem("companyName");
        e.preventDefault();

        if (otp.length === 0) {
            Swal.fire("Error!", "Please enter OTP!", "error");
            return;
        }

        try {
            const response = await axios.post(`${secretKey}/customer/verify-otp`, { email, otp });

            if (response.status === 200) {
                const token = response.data.token;
                localStorage.setItem('companyToken', token);
                navigate(`/customer/dashboard/${companyName}`);
                setErrorMessage('');
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                Swal.fire("Error!", "Invalid OTP. Please try again!", "error");
            } else {
                Swal.fire("Error!", "Error verifying OTP. Please try again!", "error");
            }
        }
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
                                            <img src={logo}></img>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6 p-0">
                                <div className="card card-md login-box">
                                    <div className="card-body">
                                        <h2 className="h2 text-center mb-4">Customer Login</h2>

                                        <div className="mb-3">
                                            {!showOtpTextBox ? <>
                                                <label className="form-label">Email</label>
                                                <input
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    type="email"
                                                    className="form-control"
                                                    placeholder="Enter your email here"
                                                    autoComplete="off"
                                                />
                                            </> : <>
                                                <input
                                                    onChange={(e) => setOtp(e.target.value)}
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter your OTP here"
                                                    autoComplete="off"
                                                />
                                                <p className="text-black-50 mt-1">
                                                    OTP valid till : {otpValidTill > 0 ? formatTime(otpValidTill) : 'Expired'}
                                                </p>
                                            </>
                                            }
                                        </div>

                                        <div style={{ textAlign: "center", color: "red" }}>
                                            <span>{errorMessage}</span>
                                        </div>

                                        <div className="form-footer">
                                            {!showOtpTextBox ? <button
                                                type="submit"
                                                onClick={() => {
                                                    setShowOtpTextBox(true);
                                                    handleSendOtp();
                                                }}
                                                className="btn btn-primary w-100"
                                            >
                                                Send OTP
                                            </button> : <button
                                                type="submit"
                                                onClick={(e) => {
                                                    // setShowOtpTextBox(true);
                                                    handleSubmit(e);
                                                }}
                                                className="btn btn-primary w-100"
                                            >
                                                Submit
                                            </button>}
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CustomerLogin