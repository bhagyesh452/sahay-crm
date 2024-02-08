import "./App.css";

import { BrowserRouter, Routes, Navigate, Route } from "react-router-dom";
import { useState } from "react";

import EmployeeLogin from "./components/EmployeeLogin";
import ConveertedLeads from "./components/ConveertedLeads";
import EmployeePanel from "./employeeComp/EmployeePanel";
import Dashboard from "./admin/Dashboard";
import LoginAdmin from "./admin/LoginAdmin";
import EmployeeParticular from "./admin/EmployeeParticular";
import Employees from "./admin/Employees";
import Leads from "./admin/Leads";
import ShowNotification from "./admin/ShowNotification";
import LoginDetails from "./components/LoginDetails";
import ProcessingLogin from "./components/ProcessingLogin";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [processingTokenn, setProcessingToken] = useState(localStorage.getItem("processingToken") || null);
  const [newtoken, setnewToken] = useState(
    localStorage.getItem("newtoken") || null
  );

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<EmployeeLogin setnewToken={setnewToken} />}
          />
          <Route
            path="/employee-data/:userId/"
            element={newtoken ? <EmployeePanel /> : <Navigate to="/" />}
          ></Route>
          <Route
            path="/converted-leads/:userId/"
            element={
              newtoken ? <ConveertedLeads /> : <Navigate to="/employeelogin" />
            }
          ></Route>

          <Route
            path="/admin/login-admin"
            element={<LoginAdmin setToken={setToken} />}
          />
          {token ? (
            <>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/employees" element={<Employees />} />
              <Route
                path="/admin/employees/:id"
                element={<EmployeeParticular />}
              />
              <Route
                path="/admin/employees/:id/login-details"
                element={<LoginDetails />}
              />
              <Route path="/admin/leads" element={<Leads />} />
              <Route
                path="/admin/notification"
                element={<ShowNotification />}
              />
            </>
          ) : (
            <Route
              path="/admin"
              element={<Navigate to="/admin/login-admin" />}
            />
          )}

          {/* <Route path="/*" element={<Navigate to="/employeelogin" />} /> */}
          <Route
            path="/processing/processing-login"
            element={<ProcessingLogin setProcessingToken={setProcessingToken} />}
          />
         
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
