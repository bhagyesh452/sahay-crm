import React, { useEffect, useState } from "react";
import axios from 'axios';
import RmofCertificationHeader from "../RM-CERT-COMPONENTS/RmofCertificationHeader";
import RmCertificationNavbar from "../RM-CERT-COMPONENTS/RmCertificationNavbar";
import BookingStatusReport from "../RM-CERT-COMPONENTS/BookingStatusReport";
import InProcessReport from "../RM-CERT-COMPONENTS/InProcessReport";
import AdminExecutiveBookingReport from "../../AdminExecutive/Components/AdminExecutiveBookingReport";
import AdminExecutiveInProcessReport from "../../AdminExecutive/Components/AdminExecutiveInProcessReport";
import AdminExecutiveApplicationSubmittedReport from "../../AdminExecutive/Components/AdminExecutiveApplicationSubmittedReport";

function RmCertificationDashboard() {

  //const { rmCertificationUserId } = useParams();

  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const [employeeData, setEmployeeData] = useState([]);

  // Main Category Statuses for Admin-Head
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [totalDocumentsGeneral, setTotalDocumentsGeneral] = useState(0);
  const [totalDocumentsProcess, setTotalDocumentsProcess] = useState(0);
  const [totalDocumentsReadyToSubmit, setTotalDocumentsReadyToSubmit] = useState(0);
  const [totalDocumentsSubmitted, setTotalDocumentsSubmitted] = useState(0);
  const [totalDocumentsApproved, setTotalDocumentsApproved] = useState(0);
  const [totalDocumentsHold, setTotalDocumentsHold] = useState(0);
  const [totalDocumentsDefaulter, setTotalDocumentsDefaulter] = useState(0);

  // Inporcess Sub Category Statuses for Admin-Head
  const [callBriefPending, setCallBriefPending] = useState(0);
  const [dscPending, setDscPending] = useState(0);
  const [clientNotResponding, setClientNotResponding] = useState(0);
  const [documentsPending, setDocumentsPending] = useState(0);
  const [working, setWorking] = useState(0);
  const [needToCall, setNeedToCall] = useState(0);

  // Main Category Statuses for Admin-Executive
  const [isAdminExecutive, setIsAdminExecutive] = useState(false);
  const [totalDocumentsForAdminExecutive, setTotalDocumentsForAdminExecutive] = useState(0);
  const [totalDocumentsGeneralForAdminExecutive, setTotalDocumentsGeneralForAdminExecutive] = useState(0);
  const [totalDocumentsProcessForAdminExecutive, setTotalDocumentsProcessForAdminExecutive] = useState(0);
  const [totalDocumentsApplicationSubmitted, setTotalDocumentsApplicationSubmitted] = useState(0);
  const [totalDocumentsApprovedForAdminExecutive, setTotalDocumentsApprovedForAdminExecutive] = useState(0);
  const [totalDocumentsHoldForAdminExecutive, setTotalDocumentsHoldForAdminExecutive] = useState(0);
  const [totalDocumentsDefaulterForAdminExecutive, setTotalDocumentsDefaulterForAdminExecutive] = useState(0);

  // Inporcess Sub Category Statuses for Admin-Executive
  const [clientNotRespondingForAdminExecutive, setClientNotRespondingForAdminExecutive] = useState(0);
  const [needToCallForAdminExecutive, setNeedToCallForAdminExecutive] = useState(0);
  const [documentsPendingForAdminExecutive, setDocumentsPendingForAdminExecutive] = useState(0);
  const [workingForAdminExecutive, setWorkingForAdminExecutive] = useState(0);
  const [applicationPendingForAdminExecutive, setApplicationPendingForAdminExecutive] = useState(0);

  // Application Submitted Sub Category Statuses for Admin-Executive
  const [kycPendingForAdminExecutive, setKycPendingForAdminExecutive] = useState(0);
  const [kycRejectedForAdminExecutive, setKycRejectedForAdminExecutive] = useState(0);
  const [kycIncompleteForAdminExecutive, setKycIncompleteForAdminExecutive] = useState(0);

  useEffect(() => {
    document.title = `AdminHead-Sahay-CRM`;
  }, []);

  const rmCertificationUserId = localStorage.getItem("rmCertificationUserId");
  // console.log(rmCertificationUserId);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${secretKey}/employee/einfo`);
      // Set the retrieved data in the state
      const tempData = response.data;
      // console.log(tempData);
      const userData = tempData.find((item) => item._id === rmCertificationUserId);
      // console.log(userData);
      setEmployeeData(userData);
      fetchRMServicesData();
      fetchInProcessData();
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

  const fetchRMServicesData = async (searchQuery = "", page = 1) => {
    try {
      const response = await axios.get(`${secretKey}/rm-services/rm-sevicesgetrequest`);

      const {
        totalDocuments,
        totalDocumentsGeneral,
        totalDocumentsProcess,
        totalDocumentsReadyToSubmit,
        totalDocumentsSubmitted,
        totalDocumentsApproved,
        totalDocumentsHold,
        totalDocumentsDefaulter,

      } = response.data;
      // console.log("Admin head booking data is :", response.data);

      setTotalDocuments(totalDocuments);
      setTotalDocumentsGeneral(totalDocumentsGeneral);
      setTotalDocumentsProcess(totalDocumentsProcess);
      setTotalDocumentsReadyToSubmit(totalDocumentsReadyToSubmit);
      setTotalDocumentsSubmitted(totalDocumentsSubmitted);
      setTotalDocumentsApproved(totalDocumentsApproved);
      setTotalDocumentsHold(totalDocumentsHold);
      setTotalDocumentsDefaulter(totalDocumentsDefaulter);
    } catch (error) {
      console.error("Error fetching booking data", error);
    }
  };

  const fetchInProcessData = async (searchQuery = "", page = 1) => {
    let params = { search: searchQuery, page, activeTab: "Process" };

    try {
      const servicesResponse = await axios.get(`${secretKey}/rm-services/rm-sevicesgetrequest`, {
        params: params
      });

      const { data, totalPages } = servicesResponse.data;
      // console.log("Admin head inprocess data is :", data);

      setCallBriefPending(data.filter((item) => item.subCategoryStatus === "Call Done Brief Pending").length);
      setDscPending(data.filter((item) => item.subCategoryStatus === "All Done DSC Pending").length);
      setClientNotResponding(data.filter((item) => item.subCategoryStatus === "Client Not Responding").length);
      setDocumentsPending(data.filter((item) => item.subCategoryStatus === "Documents Pending").length);
      setWorking(data.filter((item) => item.subCategoryStatus === "Working").length);
      setNeedToCall(data.filter((item) => item.subCategoryStatus === "Need To Call").length);

    } catch (error) {
      console.error("Error fetching in process data :", error);
    }
  };

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

      setIsAdminExecutive(true);
      setTotalDocumentsForAdminExecutive(totalDocuments);
      setTotalDocumentsGeneralForAdminExecutive(totalDocumentsGeneral);
      setTotalDocumentsApplicationSubmitted(totalDocumentsApplicationSubmitted);
      setTotalDocumentsApprovedForAdminExecutive(totalDocumentsApproved);
      setTotalDocumentsHoldForAdminExecutive(totalDocumentsHold);
      setTotalDocumentsDefaulterForAdminExecutive(totalDocumentsDefaulter);
      setTotalDocumentsProcessForAdminExecutive(totalDocumentsProcess);
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

      setIsAdminExecutive(true);
      setClientNotRespondingForAdminExecutive(data.filter((item) => item.subCategoryStatus === "Client Not Responding").length);
      setNeedToCallForAdminExecutive(data.filter((item) => item.subCategoryStatus === " Need To Call").length);
      setDocumentsPendingForAdminExecutive(data.filter((item) => item.subCategoryStatus === "Call Done Docs Pending").length);
      setWorkingForAdminExecutive(data.filter((item) => item.subCategoryStatus === "Working").length);
      setApplicationPendingForAdminExecutive(data.filter((item) => item.subCategoryStatus === "Application Pending").length);

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

      setKycPendingForAdminExecutive(data.filter((item) => item.subCategoryStatus === "KYC Pending").length);
      setKycRejectedForAdminExecutive(data.filter((item) => item.subCategoryStatus === "KYC Rejected").length);
      setKycIncompleteForAdminExecutive(data.filter((item) => item.subCategoryStatus === "KYC Incomplete").length);

    } catch (error) {
      console.error("Error fetching in process data :", error);
    }
  };

  useEffect(() => {
    fetchRMServicesData();
    fetchInProcessData();
    fetchAdminExecutiveData();
    fetchAdminExecutiveInProcessData();
    fetchAdminExecutiveApplicationSubmittedData();
  }, [employeeData]);

  // console.log('employeeData', employeeData);

  return (
    <div className="admin-dashboard">
      {/* <RmofCertificationHeader id={employeeData._id} name={employeeData.ename} empProfile={employeeData.profilePhoto && employeeData.profilePhoto.length !== 0 && employeeData.profilePhoto[0].filename} gender={employeeData.gender} designation={employeeData.newDesignation} />
      <RmCertificationNavbar rmCertificationUserId={rmCertificationUserId} /> */}
      
      <div className="page-wrapper employess-new-dashboard">
        <div className="Dash-Main mt-3">
          <div className="container-xl">
            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-12">

                <div className="row">
                  <div className="col-sm-6 col-md-6 col-lg-6">
                    {/* Booking status report */}
                    <BookingStatusReport general={totalDocumentsGeneral} inProcess={totalDocumentsProcess}
                      readyToSubmit={totalDocumentsReadyToSubmit} submitted={totalDocumentsSubmitted} approved={totalDocumentsApproved}
                      hold={totalDocumentsHold} defaulter={totalDocumentsDefaulter} total={totalDocuments} />
                  </div>
                  {/* In process status report */}
                  <div className="col-sm-6 col-md-6 col-lg-6">
                    <InProcessReport callBriefPending={callBriefPending} dscPending={dscPending}
                      clientNotResponding={clientNotResponding} documentsPending={documentsPending}
                      working={working} needToCall={needToCall} totalInProcess={totalDocumentsProcess} />
                  </div>
                </div>

                <div className="row my-3">

                  <div className="col-sm-4 col-md-4 col-lg-4">
                    <AdminExecutiveBookingReport general={totalDocumentsGeneralForAdminExecutive} submitted={totalDocumentsApplicationSubmitted} inProcess={totalDocumentsProcessForAdminExecutive}
                      approved={totalDocumentsApprovedForAdminExecutive} hold={totalDocumentsHoldForAdminExecutive}
                      defaulter={totalDocumentsDefaulterForAdminExecutive} total={totalDocumentsForAdminExecutive} isAdminExecutive={isAdminExecutive} />
                  </div>

                  <div className="col-sm-4 col-md-4 col-lg-4">
                    <AdminExecutiveInProcessReport clientNotResponding={clientNotRespondingForAdminExecutive} needToCall={needToCallForAdminExecutive}
                      documentsPending={documentsPendingForAdminExecutive} working={workingForAdminExecutive} applicationPending={applicationPendingForAdminExecutive}
                      kycPending={kycPendingForAdminExecutive} kycRejected={kycRejectedForAdminExecutive} kycIncomplete={kycIncompleteForAdminExecutive}
                      totalInProcess={totalDocumentsProcessForAdminExecutive} isAdminExecutive={isAdminExecutive} />
                  </div>

                  <div className="col-sm-4 col-md-4 col-lg-4">
                    <AdminExecutiveApplicationSubmittedReport kycPending={kycPendingForAdminExecutive} kycRejected={kycRejectedForAdminExecutive}
                      kycIncomplete={kycIncompleteForAdminExecutive} totalApplicationSubmitted={totalDocumentsApplicationSubmitted}
                      isAdminExecutive={isAdminExecutive} />
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

export default RmCertificationDashboard;