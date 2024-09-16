import React, { useEffect, useState } from "react";
import axios from 'axios';
import AdminExecutiveHeader from "../Components/AdminExecutiveHeader";
import AdminExecutiveNavbar from "../Components/AdminExecutiveNavbar";
import AdminExecutiveBookingReport from "../Components/AdminExecutiveBookingReport";
import AdminExecutiveInProcessReport from "../Components/AdminExecutiveInProcessReport";
import AdminExecutiveApplicationSubmittedReport from "../Components/AdminExecutiveApplicationSubmittedReport";


function AdminExecutiveDashboard() {

  //const { rmCertificationUserId } = useParams();

  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const [employeeData, setEmployeeData] = useState([]);

  // Main Category Statuses
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [totalDocumentsGeneral, setTotalDocumentsGeneral] = useState(0);
  const [totalDocumentsProcess, setTotalDocumentsProcess] = useState(0);
  const [totalDocumentsApplicationSubmitted, setTotalDocumentsApplicationSubmitted] = useState(0);
  const [totalDocumentsApproved, setTotalDocumentsApproved] = useState(0);
  const [totalDocumentsHold, setTotalDocumentsHold] = useState(0);
  const [totalDocumentsDefaulter, setTotalDocumentsDefaulter] = useState(0);

  // Inporcess Sub Category Statuses
  const [clientNotResponding, setClientNotResponding] = useState(0);
  const [needToCall, setNeedToCall] = useState(0);
  const [documentsPending, setDocumentsPending] = useState(0);
  const [working, setWorking] = useState(0);
  const [applicationPending, setApplicationPending] = useState(0);

  // Application Submitted Sub Category Statuses
  const [kycPending, setKycPending] = useState(0);
  const [kycRejected, setKycRejected] = useState(0);
  const [kycIncomplete, setKycIncomplete] = useState(0);

  useEffect(() => {
    document.title = `AdminExecutive-Sahay-CRM`;
  }, []);

  const adminExecutiveUserId = localStorage.getItem("adminExecutiveUserId")
  // console.log(adminExecutiveUserId);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${secretKey}/employee/einfo`);
      // Set the retrieved data in the state
      const tempData = response.data;
      // console.log(tempData);
      const userData = tempData.find((item) => item._id === adminExecutiveUserId);
      // console.log(userData);
      setEmployeeData(userData);
      fetchAdminExecutiveData();
      fetchAdminExecutiveInProcessData();
      fetchAdminExecutiveApplicationSubmittedData();
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchAdminExecutiveData = async () => {
    try {
      const response = await axios.get(`${secretKey}/rm-services/adminexecutivedata`);

      const {
        data,
        totalPages,
        totalDocuments,
        totalDocumentsGeneral,
        totalDocumentsApplicationSubmitted,
        totalDocumentsApproved,
        totalDocumentsHold,
        totalDocumentsDefaulter,
        totalDocumentsProcess,

      } = response.data;
      // console.log("Admin executive booking data is :", response.data);

      setTotalDocuments(totalDocuments);
      setTotalDocumentsGeneral(totalDocumentsGeneral);
      setTotalDocumentsApplicationSubmitted(totalDocumentsApplicationSubmitted);
      setTotalDocumentsApproved(totalDocumentsApproved);
      setTotalDocumentsHold(totalDocumentsHold);
      setTotalDocumentsDefaulter(totalDocumentsDefaulter);
      setTotalDocumentsProcess(totalDocumentsProcess);
    } catch (error) {
      console.error("Error fetching booking data", error.message);
    }
  };

  const fetchAdminExecutiveInProcessData = async (searchQuery = "", page = 1) => {
    let params = { search: searchQuery, page, activeTab: "Process" };

    try {
      const servicesResponse = await axios.get(`${secretKey}/rm-services/adminexecutivedata`, {
        params: params
      });

      const { data, totalPages } = servicesResponse.data;
      // console.log("Admin executive inprocess data is :", data);


      setClientNotResponding(data.filter((item) => item.subCategoryStatus === "Client Not Responding").length);
      setNeedToCall(data.filter((item) => item.subCategoryStatus === " Need To Call").length);
      setDocumentsPending(data.filter((item) => item.subCategoryStatus === "Call Done Docs Pending").length);
      setWorking(data.filter((item) => item.subCategoryStatus === "Working").length);
      setApplicationPending(data.filter((item) => item.subCategoryStatus === "Application Pending").length);

    } catch (error) {
      console.error("Error fetching in process data :", error);
    }
  };

  const fetchAdminExecutiveApplicationSubmittedData = async (searchQuery = "", page = 1) => {
    let params = { search: searchQuery, page, activeTab: "Application Submitted" };

    try {
      const servicesResponse = await axios.get(`${secretKey}/rm-services/adminexecutivedata`, {
        params: params
      });

      const { data, totalPages } = servicesResponse.data;
      // console.log("Admin executive inprocess data is :", data);

      setKycPending(data.filter((item) => item.subCategoryStatus === "KYC Pending").length);
      setKycRejected(data.filter((item) => item.subCategoryStatus === "KYC Rejected").length);
      setKycIncomplete(data.filter((item) => item.subCategoryStatus === "KYC Incomplete").length);

    } catch (error) {
      console.error("Error fetching in process data :", error);
    }
  };

  useEffect(() => {
    fetchAdminExecutiveData();
    fetchAdminExecutiveInProcessData();
    fetchAdminExecutiveApplicationSubmittedData();
  }, [employeeData]);

  // console.log('employeeData', employeeData);

  return (
    <div className="admin-dashboard">
      <AdminExecutiveHeader id={employeeData._id}
        name={employeeData.ename}
        empProfile={employeeData.profilePhoto &&
          employeeData.profilePhoto.length !== 0 &&
          employeeData.profilePhoto[0].filename}
        gender={employeeData.gender}
        designation={employeeData.newDesignation}
      />
      <AdminExecutiveNavbar adminExecutiveUserId={adminExecutiveUserId} />
      <div className="page-wrapper employess-new-dashboard">
        <div className="Dash-Main mt-3">
          <div className="container-xl">
            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-12">

                {/* Booking status report */}
                <div className="row">
                  <div className="col-sm-4 col-md-4 col-lg-4">
                    <AdminExecutiveBookingReport general={totalDocumentsGeneral} submitted={totalDocumentsApplicationSubmitted}
                      inProcess={totalDocumentsProcess} approved={totalDocumentsApproved} hold={totalDocumentsHold}
                      defaulter={totalDocumentsDefaulter} total={totalDocuments} />
                  </div>

                  {/* In process status report */}
                  <div className="col-sm-4 col-md-4 col-lg-4">
                    <AdminExecutiveInProcessReport clientNotResponding={clientNotResponding} needToCall={needToCall}
                      documentsPending={documentsPending} working={working} applicationPending={applicationPending}
                      kycPending={kycPending} kycRejected={kycRejected} kycIncomplete={kycIncomplete}
                      totalInProcess={totalDocumentsProcess} />
                  </div>

                  <div className="col-sm-4 col-md-4 col-lg-4">
                    <AdminExecutiveApplicationSubmittedReport kycPending={kycPending} kycRejected={kycRejected} 
                    kycIncomplete={kycIncomplete} totalApplicationSubmitted={totalDocumentsApplicationSubmitted} />
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

export default AdminExecutiveDashboard;