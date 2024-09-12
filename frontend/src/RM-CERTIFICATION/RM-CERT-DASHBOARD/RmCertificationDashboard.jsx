import React, { useEffect, useState } from "react";
import axios from 'axios';
import RmofCertificationHeader from "../RM-CERT-COMPONENTS/RmofCertificationHeader";
import RmCertificationNavbar from "../RM-CERT-COMPONENTS/RmCertificationNavbar";
import BookingStatusReport from "../RM-CERT-COMPONENTS/BookingStatusReport";
import InProcessReport from "../RM-CERT-COMPONENTS/InProcessReport";


function RmCertificationDashboard() {

  //const { rmCertificationUserId } = useParams();

  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const [employeeData, setEmployeeData] = useState([]);

  // Main Category Statuses
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [totalDocumentsGeneral, setTotalDocumentsGeneral] = useState(0);
  const [totalDocumentsProcess, setTotalDocumentsProcess] = useState(0);
  const [totalDocumentsReadyToSubmit, setTotalDocumentsReadyToSubmit] = useState(0);
  const [totalDocumentsSubmitted, setTotalDocumentsSubmitted] = useState(0);
  const [totalDocumentsApproved, setTotalDocumentsApproved] = useState(0);
  const [totalDocumentsHold, setTotalDocumentsHold] = useState(0);
  const [totalDocumentsDefaulter, setTotalDocumentsDefaulter] = useState(0);

  // Inporcess Sub Category Statuses
  const [callBriefPending, setCallBriefPending] = useState(0);
  const [dscPending, setDscPending] = useState(0);
  const [clientNotResponding, setClientNotResponding] = useState(0);
  const [documentsPending, setDocumentsPending] = useState(0);
  const [readyToSubmit, setReadyToSubmit] = useState(0);
  const [working, setWorking] = useState(0);
  const [defaulter, setDefaulter] = useState(0);
  const [needToCall, setNeedToCall] = useState(0);
  const [hold, setHold] = useState(0);
  const [undo, setUndo] = useState(0);

  useEffect(() => {
    document.title = `AdminHead-Sahay-CRM`;
  }, []);

  const rmCertificationUserId = localStorage.getItem("rmCertificationUserId");
  console.log(rmCertificationUserId);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${secretKey}/employee/einfo`);
      // Set the retrieved data in the state
      const tempData = response.data;
      console.log(tempData);
      const userData = tempData.find((item) => item._id === rmCertificationUserId);
      console.log(userData);
      setEmployeeData(userData);
      fetchRMServicesData();
      fetchInProcessData();
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
      console.log("Booking data is :", response.data)

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
      console.log("Inprocess data is :", data)

    } catch (error) {
      console.error("Error fetching in process data :", error);
    }
  };

  useEffect(() => {
    fetchRMServicesData(); // Fetch data initially
    fetchInProcessData();
  }, [employeeData]);

  // console.log('employeeData', employeeData);

  return (
    <div className="admin-dashboard">
      <RmofCertificationHeader id={employeeData._id} name={employeeData.ename} empProfile={employeeData.profilePhoto && employeeData.profilePhoto.length !== 0 && employeeData.profilePhoto[0].filename} gender={employeeData.gender} designation={employeeData.newDesignation} />
      <RmCertificationNavbar rmCertificationUserId={rmCertificationUserId} />
      <div className="page-wrapper employess-new-dashboard">
        <div className="Dash-Main mt-3">
          <div className="container-xl">
            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-12">

                {/* Booking status report */}
                <div className="row">
                  <div className="col-sm-6 col-md-6 col-lg-6">
                    <BookingStatusReport general={totalDocumentsGeneral} inProcess={totalDocumentsProcess}
                      readyToSubmit={totalDocumentsReadyToSubmit} submitted={totalDocumentsSubmitted} approved={totalDocumentsApproved}
                      hold={totalDocumentsHold} defaulter={totalDocumentsDefaulter} total={totalDocuments} />
                  </div>

                  {/* In process status report */}
                  <div className="col-sm-6 col-md-6 col-lg-6">
                    <InProcessReport />
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