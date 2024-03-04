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
import Dashboard_processing from "./Processing/Dashboard_processing";
import LoginDetails from "./components/LoginDetails";
import ProcessingLogin from "./components/ProcessingLogin";
import Bookings from "./Processing/Bookings.jsx";
import Form from "./Processing/Form.jsx";
import BookingsAdmin from "./admin/BookingsAdmin.jsx";
import BookingsForm from "./admin/BookingsForm.jsx";
import Nodata from "./Processing/Nodata.jsx";
import CompanyParticular from "./admin/CompanyParticular.jsx";
import Analysis_dashboard from "./Processing/Analysis_dashboard.jsx";
import EmployeeDashboard from "./employeeComp/EmployeeDashboard.jsx";

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
            path="/employee-dashboard/:userId/"
            element={newtoken ? <EmployeeDashboard /> : <Navigate to="/" />}
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
              <Route path = "/admin/leads/:companyId" element={<CompanyParticular/>}/>
              <Route path="/admin/bookings" element={<BookingsAdmin />} />
              <Route
                path="/admin/notification"
                element={<ShowNotification />}
              />
              <Route path="/admin/bookings/Addbookings" element = {<BookingsForm/>}/>
              
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
          <Route path="/Processing/Dashboard_processing"  element={processingTokenn ? <Dashboard_processing /> : <Navigate to="/processing/processing-login" />} />
          <Route path="/Processing/Dashboard_processing/addbookings" element={<Form/>} /> 
          <Route path="/Processing/Dashboard_processing/nodata" element={<Nodata/>} /> 
          <Route path="/Processing/analysis_dashboard" element={<Analysis_dashboard/>} /> 
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
