import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from "../static/mainLogo.png";

function CustomerLogin() {
    const secretKey = process.env.REACT_APP_SECRET_KEY;

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [showOtpTextBox, setShowOtpTextBox] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const validateEmail = (email) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    };

    // const handleSendOtp = async () => {
    //     if (email.length === 0) {
    //         setErrorMessage("Please enter your email");
    //         setShowOtpTextBox(false);
    //         return;
    //     }

    //     if (!validateEmail(email)) {
    //         setErrorMessage("Please enter a valid email");
    //         setShowOtpTextBox(false);
    //         return;
    //     }

    //     try {
    //         const response = await axios.post(`${secretKey}/customer/send-otp`, { email });

    //         const response2 = await axios.get(`${secretKey}/customer/fetch-lead-from-email/${email}`);
    //         console.log("Fetched data is :", response2.data.data);

    //         localStorage.setItem("companyEmail", response2.data.data["Company Email"]);
    //         localStorage.setItem("companyName", response2.data.data["Company Name"]);
    //         localStorage.setItem("companyPhoneNo", response2.data.data["Company Number"]);
    //         localStorage.setItem("companyPanNo", response2.data.data["panNumber"]);
    //         localStorage.setItem("companyServices", response2.data.data["services"]);

    //         if (response.status === 200 && response2.status === 200) {
    //             setShowOtpTextBox(true);
    //         } else if (response2.status === 404) {
    //             setShowOtpTextBox(false);
    //             setErrorMessage("Email not registered");
    //         } else {
    //             setErrorMessage('Error sending OTP. Please try again.');
    //         }
    //     } catch (error) {
    //         setErrorMessage('Error sending OTP. Please try again.');
    //     }
    // };

    const handleSendOtp = async () => {
        if (email.length === 0) {
            setErrorMessage("Please enter your email");
            setShowOtpTextBox(false);
            return;
        }
    
        if (!validateEmail(email)) {
            setErrorMessage("Please enter a valid email");
            setShowOtpTextBox(false);
            return;
        }
    
        try {
            const response2 = await axios.get(`${secretKey}/customer/fetch-lead-from-email/${email}`);
    
            if (response2.status === 200) {
                console.log("Fetched data is:", response2.data.data);
                setErrorMessage("");
                
                localStorage.setItem("companyEmail", response2.data.data["Company Email"]);
                localStorage.setItem("companyName", response2.data.data["Company Name"]);
                localStorage.setItem("companyPhoneNo", response2.data.data["Company Number"]);
                localStorage.setItem("companyPanNo", response2.data.data["panNumber"]);
                localStorage.setItem("companyServices", response2.data.data["services"]);
    
                const response = await axios.post(`${secretKey}/customer/send-otp`, { email });
    
                if (response.status === 200) {
                    setShowOtpTextBox(true);
                    setErrorMessage("");    
                } else {
                    setShowOtpTextBox(false);
                    setErrorMessage('Error sending OTP. Please try again.');
                }
            } else {
                setShowOtpTextBox(false);
                setErrorMessage("Email not registered");
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setShowOtpTextBox(false);
                setErrorMessage("Email not registered");
            } else {
                setShowOtpTextBox(false);
                setErrorMessage('Error sending OTP. Please try again.');
            }
        }
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (otp.length === 0) {
            setErrorMessage("Please enter otp");
            return;
        }

        try {
            const response = await axios.post(`${secretKey}/customer/verify-otp`, { email, otp });

            if (response.status === 200) {
                navigate(`/customer/dashboard/${email}`);
                setErrorMessage('');
            } else {
                setErrorMessage('Invalid OTP. Please try again.');
            }
        } catch (error) {
            setErrorMessage('Invalid OTP. Please try again.');
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