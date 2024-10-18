import React, { useState, useEffect } from 'react';
import axios from "axios";
import logo from "../../static/mainLogo.png";
import { useNavigate } from 'react-router-dom';

function GraphicDesignerLogin() {

    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(`${secretKey}/graphicDesigner/login`, { email, password });
            // console.log("Response is :", res.data.data);

            if (res.data.token) {
                setErrorMessage("");
                // Store the JWT token in local storage or state for authentication
                localStorage.setItem('graphicDesignerToken', res.data.token);
                navigate(`/graphic-designer/dashboard/${res.data.data._id}`);
            }
        } catch (error) {
            // Display the error message from the backend
            setErrorMessage(error.response.data.message || "An error occurred");
        }
    };

    useEffect(() => {
        document.title = "Graphic-Designer-Sahay-CRM";
    }, []);

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
                                        <h2 className="h2 text-center mb-4">Graphic Designer Login</h2>
                                        <form action="#" method="get" autocomplete="off" novalidate>

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

                                            <div className="form-footer">
                                                <button type="submit" className="btn btn-primary w-100" onClick={handleSubmit}>
                                                    Submit
                                                </button>
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

export default GraphicDesignerLogin;