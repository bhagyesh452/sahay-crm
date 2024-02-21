import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import Swal from "sweetalert2";

function EmployeeLogin({ setnewToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [data, setData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const [address1, setAddress] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${secretKey}/einfo`);
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const findUserId = () => {
    const user = data.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      setUserId(user._id);
    } else {
      setUserId(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  async function getLocationInfo(latitude, longitude) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      
  
      if (data.error) {
        throw new Error(`Nominatim API error: ${data.error}`);
      }
  
      const { address } = data;
      setAddress(`${address.suburb} ,${address.state_district}`);
  
      // Log the location information
    } catch (error) {
      console.error("Error fetching location:", error.message);
    }
  }
  
  const [locationAccess, setLocationAccess] = useState(false);
  useEffect(() => {
    let watchId;
    const successCallback = (position) => {
      const userLatitude = position.coords.latitude;
      const userLongitude = position.coords.longitude;
      setLocationAccess(true);
      getLocationInfo(userLatitude, userLongitude);
    };
  
    const errorCallback = (error) => {
      console.error("Geolocation error:", error.message);
      if (error.code === error.PERMISSION_DENIED) {
        setLocationAccess(false);
      }
      // Handle other error cases if needed
    };
  
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  
    // If you want to watch for continuous updates, you can use navigator.geolocation.watchPosition
  
    // Cleanup function to clear the watch if the component unmounts
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);
  

  // Trigger the findUserId function when email or password changes
  useEffect(() => {
    findUserId();
  }, [email, password]);

  
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const frontendkey = process.env.REACT_APP_FRONTEND_KEY;

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const date = getCurrentDate();
    const time = getCurrentTime();
 ;  const address = address1!=="" ? address1 : "No Location Found"
    const ename = email;
   
    try {
      const response = await axios.post(`${secretKey}/employeelogin`, {
        email,
        password,
      });

      const response2 = await axios.post(`${secretKey}/loginDetails`, {
        ename,
        date,
        time,
        address,
      });

      const { newtoken } = response.data;
      setnewToken(newtoken);
      localStorage.setItem("newtoken", newtoken);
      localStorage.setItem("userId", userId);
      // const currentPath = window.location.pathname;

      // // Construct the new path by appending "/employee-data/user-id"
      // const newPath = `${currentPath}/employee-data/${userId}`;

      // Update the browser's history to reflect the new path
      window.location.replace(`/employee-data/${userId}`);
      // window.location.href = `${window.location.origin}${window.location.pathname}employee-data/${userId}`;
    } catch (error) {
      console.error("Login failed:", error.message);
      setErrorMessage("Incorrect Credentials");
      // setErrorMessage("Incorrect Credentials!");
    }
    // }else{
    //   Swal.fire("Improper location, Access Denied!");
    //   localStorage.removeItem("newtoken");
    //   localStorage.removeItem("userId");
    // }
  };

  return (
    <div>
      <div className="page page-center">
        <div className="container container-tight py-4">
          <div className="text-center mb-4">
            <a href="." className="navbar-brand navbar-brand-autodark">
              <img src="./static/logo.svg" height="36" alt="" />
            </a>
          </div>
          <div className="login-card card card-md">
            <div className="card-body">
              <h2 className="h2 text-center mb-4">Employee Login</h2>
              <form action="#" method="get" autocomplete="off" novalidate>
                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <input
                    onChange={(e) => {
                      setEmail(e.target.value);
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
                    <span className="form-label-description">
                      <a href="./forgot-password.html">I forgot password</a>
                    </span>
                  </label>
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
  );
}

export default EmployeeLogin;
