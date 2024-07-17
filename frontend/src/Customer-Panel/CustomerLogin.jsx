import React, { useState } from 'react'
import logo from "../static/mainLogo.png"
import { useNavigate } from 'react-router-dom';

function CustomerLogin() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [showOtpTextBox, setShowOtpTextBox] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        navigate(`/customer/dashboard/${email}`);
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
                                        {/* <form action="./" method="get" autocomplete="off" novalidate> */}
                                        <div className="mb-3">
                                            {!showOtpTextBox ? <>
                                                <label className="form-label">Email</label>
                                                <input
                                                    onChange={(e) => {
                                                        setEmail(e.target.value);
                                                    }}
                                                    type="email"
                                                    className="form-control"
                                                    placeholder="Enter your email here"
                                                    autocomplete="off"
                                                />
                                            </> : <>
                                                {/* <label className="form-label"></label> */}
                                                <input
                                                    onChange={(e) => {
                                                        setOtp(e.target.value);
                                                    }}
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter your otp here"
                                                    autocomplete="off"
                                                />
                                            </>
                                            }
                                        </div>

                                        {/* <div style={{ textAlign: "center", color: "red" }}>
                                                <span>{errorMessage}</span>
                                            </div> */}

                                        <div className="form-footer">
                                            {!showOtpTextBox ? <button
                                                type="submit"
                                                onClick={() => {
                                                    setShowOtpTextBox(true);
                                                    // handleSendOtp();
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
                                        {/* </form> */}
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
