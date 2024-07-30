import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import Swal from "sweetalert2";
import socketIO from "socket.io-client";
import logo from "../../static/mainLogo.png"
import { Dialog, DialogContent, DialogTitle } from "@mui/material";


function HrLogin({ setHrToken }){
    const secretKey = process.env.REACT_APP_SECRET_KEY;


    const [data, setData] = useState([])
    const [email , setEmail] = useState("")
    const [password , setPassword] = useState("")
    const [showPassword , setShowPassword] = useState(false)
    const [designation , setDesignation] = useState("")
    const [userId , setUserId] = useState(null)
    const[errorMessage , setErrorMessage] = useState("")
    const [ename , setEname] = useState("")

    useEffect(() => {
        document.title = `HR-Sahay-CRM`;
      }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${secretKey}/hrlogin`);
            setData(response.data);
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        fetchData()
        console.log("data",data);
    }, [])


    const findUserId = () => {
        const user = data.find(
            (user) => user.email === email && user.password === password
        );
        console.log(user);
        if(user){
            setDesignation(user.designation)
            setEname(user.ename)
            setUserId(user._id);
        } else {
            setUserId(null);
        }
    };

    useEffect(() => {
        findUserId();
    }, [email , password , data])


    console.log(email , password , designation);


    const handleSubmit = async(e) => {
        e.preventDefault()
        try {
            const response = await axios.post(`${secretKey}/hrlogin`, {
                email,
                password,
                designation
            });
            console.log(response.data);
            const { hrToken , userId , ename } = response.data
            setHrToken(hrToken);
            localStorage.setItem("hrName", ename)
            localStorage.setItem("hrToken", hrToken)
            localStorage.setItem("hrUserId", userId)
            console.log(userId);
            window.location.replace(`/hr/dashboard`);
        } catch (error) {
            console.error("Login Failed", error);
            if (error.response === 401) {
                if(error.response.data.message === "Invalid email or Password"){
                    setErrorMessage("Invalid Credentials");
                } else if (error.response.data.message === "Designation id incorrect") {
                    setErrorMessage("Only Authorizedd for hr")
                } else {
                    setErrorMessage("Unknown Error Occured")
                } 
            } else {
                setErrorMessage("Unknown Error Occured")
            }
        }
    }




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
                                        <h2 className="h2 text-center mb-4">HR Login</h2>
                                        <form  method="get" autocomplete="off" novalidate>
                                            <div className="mb-3">
                                                <label className="form-label">Username</label>
                                                <input
                                                    onChange={(e)=>{
                                                        setEmail(e.target.value)
                                                    }}
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
                                                        onChange={(e)=>{
                                                            setPassword(e.target.value)
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
                                                    onClick={handleSubmit}
                                                    className="btn btn-primary w-100"
                                                >
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
    )
}

export default HrLogin;