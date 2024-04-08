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
import Bellicon_processing from "./Processing/style_processing/Bellicon_processing.js";
import NewLeads from "./admin/NewLeads.jsx";
import RedesignedForm from "./admin/RedesignedForm.jsx";
import DrawerComponent from "./components/Drawer.js";
import NotFound from "./NotFound.js";
import StausInfo from "./admin/StausInfo.js";
import MaterialUIPickers from "./components/MaterialUIPickers.js";
import BookingList from "./admin/BookingList.jsx";
import BDMLogin from "./BDM/Login/BDMLogin.jsx";
import DataManagerLogin from "./DataManager/DataMangerLogin/DataManagerLogin.jsx";
import DataManagerDashboard from "./DataManager/Dashboard/DataManagerDashboard.jsx";
import ManageLeads from "./DataManager/Dashboard/ManageLeads/ManageLeads.jsx";
import DataManager_Employees from './DataManager/Dashboard/Employees/DataManager_Employees.jsx'
import EmployeeLeads from "./DataManager/Dashboard/EmployeeLeads/EmployeeLeads.jsx";
import BdmDashboard from "./BDM/Dashboard/BdmDashboard.jsx";
import CompanyParticular_Datamanager from "./DataManager/Dashboard/ManageLeads/CompanyParticular_Datamanager.jsx";
//import CompanyDetails from "./Processing/CompanyDetails.jsx";



function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [processingTokenn, setProcessingToken] = useState(localStorage.getItem("processingToken") || null);
  const [newtoken, setnewToken] = useState(
    localStorage.getItem("newtoken") || null
  );
  const [managerToken , setManagerToken] = useState(localStorage.getItem("managerToken") || null)
  const [bdmToken , setBdmToken] = useState(localStorage.getItem("bdmToken") || null)

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<EmployeeLogin setnewToken={setnewToken} />}
          />

          <Route path="/bdmlogin" element={<BDMLogin setBdmToken={setBdmToken}/>} />
          <Route path="/datamanagerlogin" element={<DataManagerLogin setManagerToken={setManagerToken}/>} />
          
          <Route
            path="/employee-data/:userId/"
            element={newtoken ? <EmployeePanel /> : <Navigate to="/" />}
          ></Route>

          <Route
            path="/employee-dashboard/:userId/"
            element={newtoken ? <EmployeeDashboard /> : <Navigate to="/" />}
          ></Route>
          <Route path="/bdmdashboard/:userId/" element={<BdmDashboard/>}></Route>

          <Route path='/datamanager-dashboard/:userId/' element= {<DataManagerDashboard />} />

          <Route
            path="/datamanager/manageleads/"
            element={<ManageLeads/>}
          ></Route>
           <Route path="/datamanager/leads/:companyId" element={<CompanyParticular_Datamanager/>}/>
          <Route path="/datamanager/employees" element={<DataManager_Employees/>}></Route>
          <Route path="/datamanager/employeeLeads/:id" element={<EmployeeLeads/>}></Route>

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
              <Route path="/admin/new-leads" element={<NewLeads />} />
              <Route
                path="/admin/employees/:id"
                element={<EmployeeParticular />}
              />
              <Route
                path="/admin/employees/:id/login-details"
                element={<LoginDetails />}
              />
              <Route path="/admin/leads" element={<Leads />} />
              <Route path="/admin/leads/:companyId" element={<CompanyParticular />} />
              <Route path="/admin/bookings" element={<BookingList />} />
              <Route
                path="/admin/notification"
                element={<ShowNotification />}
              />
              <Route path="/admin/bookings/Addbookings" element={<RedesignedForm />} />

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
          <Route path="/Processing/Dashboard_processing" element={processingTokenn ? <Dashboard_processing /> : <Navigate to="/processing/processing-login" />} />
          <Route path="/Processing/Dashboard_processing/addbookings" element={<Form />} />
          <Route path="/Processing/Dashboard_processing/nodata" element={<Nodata />} />
          <Route path="/Processing/analysis_dashboard" element={<Analysis_dashboard />} />
          <Route path="/Processing/bellicon" element={<Bellicon_processing />} />
          <Route path="/Components/Drawer" element={<DrawerComponent />} />
          <Route path="/employeereport/:ename/:status" element={<StausInfo />} />
          <Route path='/daterange' element={<MaterialUIPickers />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

      </BrowserRouter>
    </div>
  );
}

export default App;
