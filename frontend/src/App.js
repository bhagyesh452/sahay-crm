import "./App.css";
import { BrowserRouter, Routes, Navigate, Route } from "react-router-dom";
import { useState } from "react";
import EmployeeLogin from "./components/EmployeeLogin";
import ConveertedLeads from "./components/ConveertedLeads";
import EmployeePanel from "./employeeComp/EmployeePanel";
import Dashboard from "./admin/DashboardReportComponents/Dashboard.js";
//import Dashboard from "./admin/Dashboard";
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
//import BookingsAdmin from "./admin/BookingsAdmin.jsx";
//import BookingsForm from "./admin/BookingsForm.jsx";
import Nodata from "./Processing/Nodata.jsx";
import CompanyParticular from "./admin/CompanyParticular.jsx";
import Analysis_dashboard from "./Processing/Analysis_dashboard.jsx";
import EmployeeDashboard from "./employeeComp/EmployeeDashboard.jsx";
import Bellicon_processing from "./Processing/style_processing/Bellicon_processing.js";
//import NewLeads from "./admin/NewLeads.jsx";
import RedesignedForm from "./admin/RedesignedForm.jsx";
import DrawerComponent from "./components/Drawer.js";
import NotFound from "./NotFound.js";
import StausInfo from "./admin/StausInfo.js";
import MaterialUIPickers from "./components/MaterialUIPickers.js";
import BookingList from "./admin/BookingList.jsx";
import BDMLogin from "./BDM/Login/BDMLogin.jsx";
import HrLogin from "./Hr_panel/Login/HrLogin.jsx";
import DataManagerLogin from "./DataManager/DataMangerLogin/DataManagerLogin.jsx";
import DataManagerDashboard from "./DataManager/Dashboard/DataManagerDashboard.jsx";
import ManageLeads from "./DataManager/Dashboard/ManageLeads/ManageLeads.jsx";
import DataManager_Employees from './DataManager/Dashboard/Employees/DataManager_Employees.jsx'
import EmployeeLeads from "./DataManager/Dashboard/EmployeeLeads/EmployeeLeads.jsx";
import BdmDashboard from "./BDM/Dashboard/BdmDashboard.jsx";
import CompanyParticular_Datamanager from "./DataManager/Dashboard/ManageLeads/CompanyParticular_Datamanager.jsx";
//import CompanyDetails from "./Processing/CompanyDetails.jsx";
import Team from './admin/Team.js'
import NewEmployee from "./admin/NewEmployee.js";
import BdmLeads from "./BDM/Dashboard/BdmLeads/BdmLeads.js";
import BdmTeamLeads from "./BDM/Dashboard/BdmTeamLeads/BdmTeamLeads";
import ManagerBookings from "./DataManager/Dashboard/ManageLeads/ManagerBookings.jsx";

import EmployeeTeamLeads from "./employeeComp/EmployeeTeamLeads.jsx";
import AdminEmployeeLeads from "./admin/AdminEmployeeLeads.jsx";
import AdminEmployeeTeamLeads from "./admin/AdminEmployeeTeamLeads.jsx";
import NotificationDM from "./DataManager/Dashboard/ManageLeads/NotificationDM.jsx";
import EmployeeMaturedBookings from "./employeeComp/EmployeeMaturedBookings.jsx";
import BdmBookings from "./BDM/Dashboard/BdmBookings.jsx";
import EmployeeStatusInfo from "./DataManager/Components/EmployeeStatusInfo/EmployeeStatusInfo.jsx";
import DatamanagerDashboard from "./DataManager/Dashboard/Dashboard/DatamanagerDashboard.jsx";
import TestLeads from "./admin/TestLeads.jsx";
import "../src/assets/v2_style.css"
import EmployeeReports from "./employeeComp/EmployeeReports.jsx";
import BasicForm from "./Client-Basic-Info/BasicForm.jsx";
import DatamanagerEmployeeTeamLeads from "./DataManager/Dashboard/DatamanagerEmployeeTeamLeads/DatamanagerEmployeeTeamLeads.jsx";
import EmployeeProfile from "./employeeComp/EmployeeProfile.jsx";
import DatamanagerNewEmployee from "./DataManager/Dashboard/Employees/DatamanagerNewEmployee.jsx";
import RMofCertification from "./RM-CERTIFICATION/RM-CERT-LOGIN/RMofCertification.jsx";
import RmCertificationDashboard from "./RM-CERTIFICATION/RM-CERT-DASHBOARD/RmCertificationDashboard.jsx";
import RMofFundingLogin from "./RM-FUNDING/RM-FUNDING-LOGIN/RMofFundingLogin.jsx";
import RMofFundingDashboard from "./RM-FUNDING/RM-FUNDING-DASHBOARD/RMofFundingDashboard.jsx";
import RmofCertificationBookings from "./RM-CERTIFICATION/RM-CERT-BOOKINGS/RmofCertificationBookings.jsx";
import HrDashboard from "./Hr_panel/Dashboard/HrDashboard.jsx";
import RmofCertificationMyBookings from "./RM-CERTIFICATION/RM-CERT-BOOKINGS/RmofCertificationMyBookings.jsx";
import NewEmployees from "./Hr_panel/Components/NewEmployees.jsx";
import HrEmployees from "./Hr_panel/Components/HrEmployees.jsx";
import HorizontalNonLinearStepper from "./Hr_panel/Components/AddEmployees/AddEmployee.jsx";
import HREditEmployee from "./Hr_panel/Components/EditEmployee/HREditEmployee.jsx";
//import Employee from "./Hr_panel/Components/EmployeeView.jsx";
import Received_booking_box from "./RM-CERTIFICATION/RM-CERT-Process/Received_booking_box.jsx";
import EmployeeShowNotification from "./employeeComp/EmployeeShowNotification.jsx";
import CustomerLogin from "./Customer-Panel/CustomerLogin.jsx";
import CustomerDashboard from "./Customer-Panel/CustomerDashboard.jsx";
import EmployeeView from "./Hr_panel/Components/EmployeeView.jsx";


function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [processingTokenn, setProcessingToken] = useState(localStorage.getItem("processingToken") || null);
  const [newtoken, setnewToken] = useState(
    localStorage.getItem("newtoken") || null
  );
  const [managerToken, setManagerToken] = useState(localStorage.getItem("managerToken") || null)
  const [bdmToken, setBdmToken] = useState(localStorage.getItem("bdmToken") || null)
  const [rmofcertificationToken, setrmofcertificationToken] = useState(localStorage.getItem("rmofcertificationToken" || null))
  const [rmoffundingToken, setrmoffundingToken] = useState(localStorage.getItem("rmoffundingToken" || null))
  const [hrToken, setHrToken] = useState(localStorage.getItem("HrToken") || null)

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
            element={newtoken ? <EmployeeDashboard /> : <Navigate to="/" />}></Route>

          <Route path="/employee-team-leads/:userId" element={newtoken ? <EmployeeTeamLeads /> : <Navigate to="/" />}>
          </Route>

          <Route path="/employee-bookings/:userId" element={newtoken ? <EmployeeMaturedBookings /> : <Navigate to="/" />}>
          </Route>
          <Route path='/employee-reports/:userId' element={newtoken ? <EmployeeReports /> : <Navigate to='/' />}></Route>
          <Route path='/employee-profile-details/:userId' element={newtoken ? <EmployeeProfile /> : <Navigate to='/' />}></Route>
          <Route path='/employee/show-notification/:userId' element={newtoken ? <EmployeeShowNotification /> : <Navigate to='/' />}></Route>


          {/* --------------------------------------------------Path for Customer-Panel---------------------------------------------------------- */}
          <Route path='/customer/login' element={<CustomerLogin />}></Route>
          <Route path='/customer/dashboard/:email' element={<CustomerDashboard />}></Route> 
        
          {/* --------------------------------------------------bdm components---------------------------------------------------------- */}


          <Route path="/bdmlogin" element={<BDMLogin setBdmToken={setBdmToken} />} />
          <Route path="/bdmdashboard/:userId/" element={<BdmDashboard />}></Route>
          <Route path="/bdm/bdmleads/:userId/" element={<BdmLeads />}></Route>
          <Route path="/bdm/bdmteamleads/:userId/" element={<BdmTeamLeads />}></Route>
          <Route path="/bdm/bdmBookings/:userId/" element={<BdmBookings />}></Route>


          {/* --------------------------------------------------rm-certification components---------------------------------------------------------- */}
          <Route path='/rmofcertification/login' element={<RMofCertification setrmofcertificationToken={setrmofcertificationToken} />} />
          <Route path='/rmofcertification/dashboard-rmofcertification/:userId/' element={<RmCertificationDashboard />} />
          <Route path='/rmofcertification/rmofcertification-bookings/:userId/' element={<RmofCertificationBookings />} />
          <Route path='/rmofcertification/rmofcertification-mybookings/:userId' element={<RmofCertificationMyBookings />} />
          <Route path='/rmofcertification/received-booking-box/:userId' element={<Received_booking_box />} />

          {/* --------------------------------------------------rm-certification components---------------------------------------------------------- */}
          <Route path='/rmoffunding/login-rmoffunding' element={<RMofFundingLogin setrmoffundingToken={setrmoffundingToken} />} />
          <Route path='/rmoffunding/dashboard-rmoffunding/:userId' element={<RMofFundingDashboard />} />


          {/* -----------------------------------------datamanager components--------------------------------------- */}

          <Route path="/datamanagerlogin" element={<DataManagerLogin setManagerToken={setManagerToken} />} />
          <Route path='/datamanager-dashboard/:userId/' element={<DatamanagerDashboard />} />
          <Route
            path="/datamanager/manageleads/"
            element={<ManageLeads />}
          ></Route>
          <Route path="/datamanager/leads/:companyId" element={<CompanyParticular_Datamanager />} />
          <Route path="/datamanager/employees" element={<DataManager_Employees />}></Route>
          <Route path="/datamanager/newEmployees" element={<DatamanagerNewEmployee />}></Route>
          <Route path="/datamanager/employeeLeads/:id" element={<EmployeeLeads />}></Route>
          <Route path="/datamanager/bookings" element={<ManagerBookings />}></Route>
          <Route
            path="/datamanager/notification"
            element={<NotificationDM />}
          ></Route>
          <Route path="/employeereportdatamanager/:ename/:status" element={<EmployeeStatusInfo />} />
          <Route path="/datamanager/datamanagerside-employeeteamleads/:id" element={<DatamanagerEmployeeTeamLeads />} />


          {/* ---------------------------------------admin  components--------------------------------------- */}

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
              <Route path="/admin/admin-user" element={<NewEmployee />} />
              {/* <Route path="/admin/new-leads" element={<NewLeads />} /> */}
              <Route
                path="/admin/employees/:id"
                element={<EmployeeParticular />}
              />
              <Route
                path="/admin/employeeleads/:id"
                element={<AdminEmployeeTeamLeads />}
              />
              <Route
                path="/admin/employees/:id/login-details"
                element={<LoginDetails />}
              />
              {/* <Route path="/admin/leads" element={<Leads />} /> */}
              <Route path="/admin/leads" element={<TestLeads />} />
              <Route path="/admin/team" element={<Team />} />
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
          <Route path="/client/basic-form" element={<BasicForm />} />




          {/**********************************************  HR-Login-Portal   *******************************************************/}
          <Route path="/hr/login" element={<HrLogin setHrToken={setHrToken} />} />
          <Route path="/hr/dashboard/" element={<HrDashboard />}></Route>
          {/* <Route path="/hr/employees/" element={<NewEmployees />} /> */}
          <Route path="/hr/employees/" element={<HrEmployees />} />
          <Route path="/hr/add/employee/" element={<HorizontalNonLinearStepper />} />
          <Route path="/hr/edit/employee/:empId" element={<HREditEmployee />} />
          <Route path='/hr/employee/hr-employee-profile-details/:userId' element={<EmployeeView />}></Route>
        </Routes>

      </BrowserRouter>
    </div>
  );
}

export default App;
