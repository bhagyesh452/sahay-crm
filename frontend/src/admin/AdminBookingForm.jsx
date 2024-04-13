import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import Header from "./Header";
import Navbar from "./Navbar";
import StepButton from "@mui/material/StepButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import pdfimg from "../static/my-images/pdf.png";
import Swal from "sweetalert2";
import img from "../static/my-images/image.png";
import wordimg from "../static/my-images/word.png";
import excelimg from "../static/my-images/excel.png";
import PdfImageViewer from "../Processing/PdfViewer";
import { options } from "../components/Options";
import { IconX } from "@tabler/icons-react";

import axios from "axios";
import { useNavigate } from "react-router-dom";
const secretKey = process.env.REACT_APP_SECRET_KEY;
const steps = [
  "Basic Company Informations",
  "Booking Details",
  "Services And Payments",
  "Payment Summery",
  "Final",
];

const defaultService = {
  serviceName: "",
  withDSC: true,
  totalPaymentWOGST: "",
  totalPaymentWGST: "",
  withGST: true,
  paymentTerms: "Full Advanced",
  firstPayment: 0,
  secondPayment: 0,
  secondPaymentRemarks: "",
  thirdPayment: 0,
  thirdPaymentRemarks: "",
  fourthPayment: 0,
  fourthPaymentRemarks: "",
  paymentRemarks: "",
  paymentCount: 2,
};

export default function AdminBookingForm({
  setDataStatus,
  setFormOpen,
  companysName,
  companysEmail,
  companyNumber,
  companysInco,
  employeeName,
  employeeEmail,
  setNowToFetch,
}) {
  const [totalServices, setTotalServices] = useState(1);

  const [fetchedService, setfetchedService] = useState(false);

  const defaultLeadData = {
    "Company Name": companysName ? companysName : "",
    "Company Number": companyNumber ? companyNumber : 0,
    "Company Email": companysEmail ? companysEmail : "",
    panNumber: "",
    gstNumber: "",
    incoDate: companysInco ? companysInco : "",
    bdeName: employeeName ? employeeName : "",
    bdeEmail: employeeEmail ? employeeEmail : "",
    bdmName: "",
    otherBdmName: "",
    bdmEmail: "",
    bdmType: "Close-by",
    bookingDate: "",
    bookingSource: "",
    otherBookingSource: "",
    numberOfServices: totalServices,
    services: [],
    caCase: false,
    caNumber: 0,
    caEmail: "",
    caCommission: "",
    paymentMethod: "",
    paymentReceipt: [],
    extraNotes: "",
    otherDocs: [],
    totalAmount: 0,
    receivedAmount: 0,
    pendingAmount: 0,
  };

  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const [secondTempRemarks, setSecondTempRemarks] = useState("");
  const [thirdTempRemarks, setThirdTempRemarks] = useState("");
  const [fourthTempRemarks, setFourthTempRemarks] = useState("");
  const [selectedValues, setSelectedValues] = useState("");
  const [unames, setUnames] = useState([]);
  const [data, setData] = useState([]);
  const [currentDataLoading, setCurrentDataLoading] = useState(false);

  const fetchDataEmp = async () => {
    try {
      const response = await axios.get(`${secretKey}/einfo`);

      // Set the retrieved data in the state
      const tempData = response.data;
      console.log(response.data);
      setUnames(tempData);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };
  const [leadData, setLeadData] = useState(defaultLeadData);
  const handleTextAreaChange = (e) => {
    e.target.style.height = "1px";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${secretKey}/redesigned-leadData/${companyNewName.trim()}`
      );
      console.log(response.data , "This it it now")
      let data = response.data;

      if (Array.isArray(response.data)) {
        data = response.data.find((item) => item["Company Name"] === companyNewName.trim());
      }
      
      console.log("Fetched Data", data);
      if (!data) {
        setCompleted({});
        setActiveStep(0);
        setSelectedValues("");
        setLeadData(defaultLeadData);
        return true;
      }
      const {
        Step1Status,
        Step2Status,
        Step3Status,
        Step4Status,
        Step5Status,
        ...newLeadData
      } = data;
      setLeadData(newLeadData);
      if (Step1Status === true && Step2Status === false) {
        setCompleted({ 0: true });
        setActiveStep(1);
        setSelectedValues(newLeadData.bookingSource);
        setLeadData((prevState) => ({
          ...prevState,
          bookingDate: formatDate(new Date()),
        }));
      } else if (Step2Status === true && Step3Status === false) {
        setCompleted({ 0: true, 1: true });
        setActiveStep(2);
        setSelectedValues(newLeadData.bookingSource);
        setLeadData((prevState) => ({
          ...prevState,
          services:
            data.services.length !== 0 ? data.services : [defaultService],
          numberOfServices:
            data.services.length !== 0 ? data.services.length : 1,
        }));
        setTotalServices(data.services.length !== 0 ? data.services.length : 1);
      } else if (Step3Status === true && Step4Status === false) {
        console.log(data.services, "This is services");
        setSelectedValues(newLeadData.bookingSource);
        setfetchedService(true);
        setCompleted({ 0: true, 1: true, 2: true });
        setActiveStep(3);
        const servicestoSend = data.services.map((service) => ({
          ...service,
          secondPaymentRemarks: isNaN(new Date(service.secondPaymentRemarks))
            ? service.secondPaymentRemarks
            : "On Particular Date",
          thirdPaymentRemarks: isNaN(new Date(service.thirdPaymentRemarks))
            ? service.thirdPaymentRemarks
            : "On Particular Date",
          fourthPaymentRemarks: isNaN(new Date(service.fourthPaymentRemarks))
            ? service.fourthPaymentRemarks
            : "On Particular Date",
        }));
        setLeadData((prevState) => ({
          ...prevState,
          services:
            data.services.length !== 0 ? servicestoSend : [defaultService],
          caCase: data.caCase,
          caCommission: data.caCommission,
          caNumber: data.caNumber,
          caEmail: data.caEmail,
        }));
        setTotalServices(data.services.length !== 0 ? data.services.length : 1);
      } else if (Step4Status === true && Step5Status === false) {
        setCompleted({ 0: true, 1: true, 2: true, 3: true });
        setSelectedValues(newLeadData.bookingSource);
        setActiveStep(4);
        setLeadData((prevState) => ({
          ...prevState,
          totalAmount: data.totalAmount,
          pendingAmount: data.pendingAmount,
          receivedAmount: data.receivedAmount,
          otherDocs: data.otherDocs,
          paymentReceipt: data.paymentReceipt,
          paymentMethod: data.paymentMethod,
          extraNotes: data.extraNotes,
        }));
      } else if (Step5Status === true) {
        setCompleted({ 0: true, 1: true, 2: true, 3: true, 4: true });

        setActiveStep(5);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  console.log("Real time data: ", leadData);

  useEffect(() => {
    fetchData();
    fetchDataEmp();
    console.log("Fetch After Component Mount", leadData);
  }, []);
  useEffect(() => {
    // Create new services array based on totalServices
    {
      const newServices = Array.from({ length: totalServices }, () => ({
        ...defaultService,
      }));
      setLeadData((prevState) => ({
        ...prevState,
        services: !fetchedService ? newServices : leadData.services,
      }));
      console.log("Fetch After changing Services", leadData);
    }
  }, [totalServices, defaultService]);

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };
  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };
  const navigate = useNavigate();

  const handleBack = () => {
    if (activeStep !== 0) {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    } else {
      //setDataStatus("Matured");
      //setNowToFetch(true);
      setFormOpen(false);
    }
  };

  function formatDate(inputDate) {
    const date = new Date(inputDate);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Adding 1 to month because it's zero-based
    const day = String(date.getUTCDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  const getOrdinal = (number) => {
    const suffixes = ["th", "st", "nd", "rd"];
    const lastDigit = number % 10;
    const suffix = suffixes[lastDigit <= 3 ? lastDigit : 0];
    return `${number}${suffix}`;
  };
  const handleViewPdfReciepts = (paymentreciept) => {
    const pathname = paymentreciept;
    //console.log(pathname);
    window.open(`${secretKey}/recieptpdf/${pathname}`, "_blank");
  };

  const handleViewPdOtherDocs = (pdfurl) => {
    const pathname = pdfurl;
    console.log(pathname);
    window.open(`${secretKey}/otherpdf/${pathname}`, "_blank");
  };
  const handleStep = (step) => () => {
    setActiveStep(step);
  };
  console.log(completed, "this is completed");

  const handleComplete = async () => {
    try {
      const formData = new FormData();

      const isEmptyOrNull = (value) => {
        return value === "" || value === null || value === 0;
      };
      if (!foundCompany) {
        Swal.fire({
          title: "Company Not Found!",
          text: "Please Add Lead to Continue",
          icon: "warning",
        });
        return true;
      }
      // Prepare the data to send to the backend
      let dataToSend = {};
      if (activeStep === 0) {
        if (
          isEmptyOrNull(leadData["Company Email"]) ||
          isEmptyOrNull(leadData["Company Name"]) ||
          isEmptyOrNull(leadData["Company Number"]) ||
          isEmptyOrNull(leadData.incoDate) ||
          isEmptyOrNull(leadData.panNumber)
        ) {
          Swal.fire({
            title: "Please fill all the details",
            icon: "warning",
          });
        } else {
          dataToSend = {
            "Company Email": leadData["Company Email"],
            "Company Name": leadData["Company Name"],
            "Company Number": leadData["Company Number"],
            incoDate: leadData.incoDate,
            panNumber: leadData.panNumber,
            gstNumber: leadData.gstNumber,
            bdeName:
              foundCompany && foundCompany.ename !== "Not Alloted"
                ? foundCompany.ename
                : "",
            bdeEmail:
              foundCompany && foundCompany.ename !== "Not Alloted"
                ? unames.find((item) => item.ename === foundCompany.ename).email
                : "",
          };

          console.log("This is sending", dataToSend);
          try {
            const response = await axios.post(
              `${secretKey}/redesigned-leadData/${companyNewName}/step1`,
              dataToSend
            );
            // Handle response data as needed
          } catch (error) {
            console.error("Error uploading data:", error);
            // Handle error
          }
          fetchData();
          handleNext();
          return true;
        }
      }
      if (activeStep === 1) {
        console.log(leadData.bookingDate);
        if (
          !leadData.bdeName ||
          !leadData.bdmName ||
          !leadData.bdmEmail ||
          !leadData.bdmEmail ||
          !leadData.bookingDate ||
          !selectedValues
        ) {
          Swal.fire({
            title: "Please fill all the details",
            icon: "warning",
          });
          return true;
        } else {
          dataToSend = {
            bdeName: leadData.bdeName,
            bdeEmail: leadData.bdeEmail,
            bdmName: leadData.bdmName,
            otherBdmName: leadData.otherBdmName,
            bdmEmail: leadData.bdmEmail,
            bdmType: leadData.bdmType,
            bookingDate: leadData.bookingDate,
            bookingSource: selectedValues,
            otherBookingSource: leadData.otherBookingSource,
          };
          console.log("This is sending", dataToSend);
          try {
            const response = await axios.post(
              `${secretKey}/redesigned-leadData/${companyNewName}/step2`,
              dataToSend
            );
            // Handle response data as needed
          } catch (error) {
            console.error("Error uploading data:", error);
            // Handle error
          }
          fetchData();
          handleNext();
          return true;
        }
      }
      if (activeStep === 2) {

        let isValid = true;
              for (let service of leadData.services) {
        
                const firstPayment = Number(service.firstPayment);
                const secondPayment = Number(service.secondPayment);
                const thirdPayment = Number(service.thirdPayment);
                const fourthPayment = Number(service.fourthPayment);
                // console.log( firstPayment + secondPayment + thirdPayment + fourthPayment, Number(service.totalPaymentWGST) , "This is it" )
                if (
                  (service.paymentTerms !== "Full Advanced" &&
                    (firstPayment < 0 ||
                      secondPayment < 0 ||
                      thirdPayment < 0 ||
                      fourthPayment < 0 ||
                      firstPayment + secondPayment + thirdPayment + fourthPayment !==
                        Number(service.totalPaymentWGST))) ||
                  service.serviceName === "" 
                ) {
                  isValid = false;
                  break;
                }
              }
               if (
                !isValid
                ) {
                  Swal.fire("Incorrect Details" , 'Please Enter the Details Properly', 'warning');
                  return true;
                } else {
          const totalAmount = leadData.services.reduce(
            (acc, curr) => acc + curr.totalPaymentWGST,
            0
          );
          const receivedAmount = leadData.services.reduce((acc, curr) => {
            return curr.paymentTerms === "Full Advanced"
              ? acc + curr.totalPaymentWGST
              : acc + curr.firstPayment;
          }, 0);
          const pendingAmount = totalAmount - receivedAmount;
          const servicestoSend = leadData.services.map((service) => ({
            ...service,
            secondPaymentRemarks:
              service.secondPaymentRemarks === "On Particular Date"
                ? secondTempRemarks
                : service.secondPaymentRemarks,
            thirdPaymentRemarks:
              service.thirdPaymentRemarks === "On Particular Date"
                ? thirdTempRemarks
                : service.thirdPaymentRemarks,
            fourthPaymentRemarks:
              service.fourthPaymentRemarks === "On Particular Date"
                ? fourthTempRemarks
                : service.fourthPaymentRemarks,
          }));

          dataToSend = {
            services: servicestoSend,
            numberOfServices: totalServices,
            caCase: leadData.caCase,
            caCommission: leadData.caCommission,
            caNumber: leadData.caNumber,
            caEmail: leadData.caEmail,
            totalAmount: totalAmount,
            receivedAmount: receivedAmount,
            pendingAmount: pendingAmount,
          };
          console.log("This is sending", dataToSend);
          try {
            const response = await axios.post(
              `${secretKey}/redesigned-leadData/${companyNewName}/step3`,
              dataToSend
            );
            // Handle response data as needed
          } catch (error) {
            console.error("Error uploading data:", error);
            // Handle error
          }
          fetchData();
          handleNext();
          return true;
        }
      }
      if (activeStep === 3) {
        if(!leadData.paymentMethod){
          Swal.fire("Incorrect Details" , 'Please Enter Payment Method', 'warning');
          return true;
        }
        console.log(
          "I am in step 4",
          leadData.paymentReceipt,
          leadData.otherDocs
        );

        console.log("Re work");
        const totalAmount = leadData.services.reduce(
          (acc, curr) => acc + curr.totalPaymentWGST,
          0
        );
        const receivedAmount = leadData.services.reduce((acc, curr) => {
          return curr.paymentTerms === "Full Advanced"
            ? acc + curr.totalPaymentWGST
            : acc + curr.firstPayment;
        }, 0);
        const pendingAmount = totalAmount - receivedAmount;

        const formData = new FormData();
        formData.append("totalAmount", totalAmount);
        formData.append("receivedAmount", receivedAmount);
        formData.append("pendingAmount", pendingAmount);
        formData.append("paymentMethod", leadData.paymentMethod);
        formData.append("extraNotes", leadData.extraNotes);

        // Append payment receipt files to formData
        for (let i = 0; i < leadData.paymentReceipt.length; i++) {
          formData.append("paymentReceipt", leadData.paymentReceipt[i]);
        }

        // Append other documents files to formData
        for (let i = 0; i < leadData.otherDocs.length; i++) {
          formData.append("otherDocs", leadData.otherDocs[i]);
        }
        try {
          const response = await axios.post(
            `${secretKey}/redesigned-leadData/${companyNewName}/step4`,
            formData
          );
          // Handle successful upload
          fetchData();
          handleNext();
          return true;
        } catch (error) {
          console.error("Error uploading data:", error);
          // Handle error
        }
      }

      if (activeStep === 4) {
        try {
          const response = await axios.post(
            `${secretKey}/redesigned-final-leadData/${companyNewName}`,
            leadData
          );
          const response2 = await axios.post(
            `${secretKey}/redesigned-leadData/${companyNewName}/step5`
          );

          console.log(response.data);
          Swal.fire({
            icon: "success",
            title: "Form Submitted",
            text: "Your form has been submitted successfully!",
          });
          setNowToFetch(true);
          // Handle response data as needed
        } catch (error) {
          console.error("Error uploading data:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "There was an error submitting the form. Please try again later.",
          });
          // Handle error
        }

        fetchData();
        handleNext();
        setFormOpen(false);
        setDataStatus("Matured");
        return true;
      }
      // let dataToSend = {
      //   ...leadData,
      //   Step1Status: true,
      // };
    } catch (error) {
      console.error("Error sending data to backend:", error);
      // Handle error if needed
    }
  };
  const handleEdit = async () => {
    try {
      const formData = new FormData();

      let dataToSend = {
        ...dataToSend,
        Step1Status: true,
      };
      if (activeStep === 3) {
        dataToSend = {
          ...leadData,
        };
        for (let i = 0; i < leadData.otherDocs.length; i++) {
          formData.append("otherDocs", leadData.otherDocs[i]);
        }
        formData.append("paymentReceipt", leadData.paymentReceipt[0]);
        console.log(dataToSend, activeStep);
      } else if (activeStep === 1) {
        dataToSend = {
          ...dataToSend,
          bookingSource: selectedValues,
        };
        console.log("Step 1", dataToSend);
      } else if (activeStep === 2) {
        const totalAmount = leadData.services.reduce(
          (acc, curr) => acc + curr.totalPaymentWOGST,
          0
        );
        const receivedAmount = leadData.services.reduce((acc, curr) => {
          return curr.paymentTerms === "Full Advanced"
            ? acc + curr.totalPaymentWOGST
            : acc + curr.firstPayment;
        }, 0);
        const pendingAmount = totalAmount - receivedAmount;
        dataToSend = {
          ...leadData,
          totalAmount: totalAmount,
          receivedAmount: receivedAmount,
          pendingAmount: pendingAmount,
        };
      } else if (activeStep === 3) {
        dataToSend = {
          ...leadData,
          Step3Status: true,
          Step4Status: true,
        };
      } else if (activeStep === 4) {
        dataToSend = {
          ...leadData,
          Step3Status: true,
          Step4Status: true,
          Step5Status: true,
        };
      }
      // console.log(activeStep, dataToSend);
      Object.keys(dataToSend).forEach((key) => {
        if (key === "services") {
          // Handle services separately as it's an array
          dataToSend.services.forEach((service, index) => {
            Object.keys(service).forEach((prop) => {
              formData.append(`services[${index}][${prop}]`, service[prop]);
            });
          });
        } else if (key === "otherDocs" && activeStep === 3) {
          for (let i = 0; i < leadData.otherDocs.length; i++) {
            formData.append("otherDocs", leadData.otherDocs[i]);
          }
        } else if (key === "paymentReceipt" && activeStep === 3) {
          formData.append("paymentReceipt", leadData.paymentReceipt[0]);
        } else {
          formData.append(key, dataToSend[key]);
        }
      });
      if (activeStep === 4) {
        dataToSend = {
          ...leadData,
          paymentReceipt: leadData.paymentReceipt
            ? leadData.paymentReceipt
            : null,
        };
        try {
          const response = await axios.post(
            `${secretKey}/redesigned-final-leadData/${companysName}`,
            leadData
          );
          console.log(response.data);
          Swal.fire({
            icon: "success",
            title: "Form Submitted",
            text: "Your form has been submitted successfully!",
          });
          // Handle response data as needed
        } catch (error) {
          console.error("Error uploading data:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "There was an error submitting the form. Please try again later.",
          });
          // Handle error
        }
      } else {
        try {
          const response = await axios.post(
            `${secretKey}/redesigned-leadData/${companysName}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          // Handle response data as needed
        } catch (error) {
          console.error("Error uploading data:", error);
          // Handle error
        }
      }

      fetchData();

      // Log the response from the backend

      handleNext();
    } catch (error) {
      console.error("Error sending data to backend:", error);
      // Handle error if needed
    }
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };
  const handleResetDraft = async () => {
    try {
      console.log(companyNewName.trim())
      const response = await fetch(
        `${secretKey}/redesigned-delete-model/${companyNewName.trim()}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        console.log("Draft reset successfully");
        // Optionally, you can perform further actions upon successful deletion
        
        setActiveStep(0);
        setLeadData({...defaultLeadData , bdeName:leadData.bdeName , "Company Email": leadData["Company Email"] , "Company Number":leadData['Company Number'], incoDate:leadData.incoDate})
        setCompleted([]);

      } else {
        console.error("Error resetting draft:", response.statusText);
      }
    } catch (error) {
      console.error("Error resetting draft:", error.message);
    }
  };

  const renderServices = () => {
    const services = [];
    console.log(leadData.services.length, Number(totalServices));
    if (leadData.services.length === Number(totalServices)) {
      for (let i = 0; i < totalServices; i++) {
        services.push(
          <div key={i} className="servicesFormCard mt-3">
            {/* <div className="services_No">
              1
        </div> */}
            <div className="d-flex align-items-center">
              <div className="selectservices-label mr-2 d-flex align-items-center">
                <div className="services_No mr-1">{i + 1}</div>
                <label for="">
                  Select Service: {<span style={{ color: "red" }}>*</span>}
                </label>
              </div>
              <div className="selectservices-label-selct">
                <select
                  className="form-select mt-1"
                  id={`Service-${i}`}
                  value={leadData.services[i].serviceName}
                  onChange={(e) => {
                    setLeadData((prevState) => ({
                      ...prevState,
                      services: prevState.services.map((service, index) =>
                        index === i
                          ? { ...service, serviceName: e.target.value }
                          : service
                      ),
                    }));
                  }}
                  disabled={completed[activeStep] === true}
                >
                  <option value="" disabled selected>
                    Select Service Name
                  </option>
                  {options.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.value}
                    </option>
                  ))}
                </select>
              </div>
              {leadData.services[i].serviceName ===
                "Start-Up India Certificate" && (
                <div className="ml-2">
                  <div class="form-check m-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="dsc"
                      value="0"
                      checked={leadData.services[i].withDSC}
                      onChange={(e) => {
                        setLeadData((prevState) => ({
                          ...prevState,
                          services: prevState.services.map((service, index) =>
                            index === i
                              ? { ...service, withDSC: !service.withDSC }
                              : service
                          ),
                        }));
                      }}
                      readOnly={completed[activeStep] === true}
                    />
                    <label class="form-check-label" for="dsc">
                      WITH DSC
                    </label>
                  </div>
                </div>
              )}
            </div>
            <hr className="mt-3 mb-3"></hr>
            <div className="row align-items-center mt-2">
              <div className="col-sm-8">
                <label class="form-label">
                  Total Amount {<span style={{ color: "red" }}>*</span>}
                </label>
                <div className="d-flex align-items-center">
                  <div class="input-group total-payment-inputs mb-2">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter Amount"
                      id={`Amount-${i}`}
                      value={leadData.services[i].totalPaymentWOGST}
                      onInput={(e) => {
                        const newValue = e.target.value;
                        setLeadData((prevState) => ({
                          ...prevState,
                          services: prevState.services.map((service, index) =>
                            index === i
                              ? {
                                  ...service,
                                  totalPaymentWOGST: newValue,
                                  totalPaymentWGST:
                                    service.withGST === true
                                      ? Number(newValue) +
                                        Number(newValue * 0.18)
                                      : newValue,
                                }
                              : service
                          ),
                        }));
                      }}
                      readOnly={completed[activeStep] === true}
                    />

                    <button class="btn" type="button">
                      ₹
                    </button>
                  </div>
                  <div class="form-check ml-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="GST"
                      value="0"
                      checked={leadData.services[i].withGST}
                      onChange={(e) => {
                        setLeadData((prevState) => ({
                          ...prevState,
                          services: prevState.services.map((service, index) =>
                            index === i
                              ? {
                                  ...service,
                                  withGST: !service.withGST,
                                  totalPaymentWGST:
                                    service.withGST === false
                                      ? Number(
                                          service.totalPaymentWOGST * 0.18
                                        ) + Number(service.totalPaymentWOGST)
                                      : service.totalPaymentWOGST,
                                  secondPayment:
                                    service.paymentCount === 2 &&
                                    service.secondPayment !== 0
                                      ? service.withGST === true
                                        ? Number(
                                            service.secondPayment -
                                              service.totalPaymentWOGST * 0.18
                                          ).toFixed(2)
                                        : Number(
                                            service.secondPayment +
                                              service.totalPaymentWOGST * 0.18
                                          ).toFixed(2)
                                      : service.secondPayment,
                                  thirdPayment:
                                    service.paymentCount === 3
                                      ? service.withGST === true
                                        ? Number(
                                            service.thirdPayment -
                                              service.totalPaymentWOGST * 0.18
                                          ).toFixed(2)
                                        : Number(
                                            service.thirdPayment +
                                              service.totalPaymentWOGST * 0.18
                                          ).toFixed(2)
                                      : service.thirdPayment,
                                  fourthPayment:
                                    service.paymentCount === 4
                                      ? service.withGST === true
                                        ? Number(
                                            service.fourthPayment -
                                              service.totalPaymentWOGST * 0.18
                                          ).toFixed(2)
                                        : Number(
                                            service.fourthPayment +
                                              service.totalPaymentWOGST * 0.18
                                          ).toFixed(2)
                                      : service.fourthPayment,
                                }
                              : service
                          ),
                        }));
                      }}
                      readOnly={completed[activeStep] === true}
                    />
                    <label class="form-check-label" for="GST">
                      WITH GST (18%)
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="form-group">
                  <label class="form-label">Total Amount With GST</label>
                  <div class="input-group mb-2">
                    <input
                      type="text"
                      className={
                        parseInt(leadData.services[i].firstPayment) +
                          parseInt(leadData.services[i].secondPayment) +
                          parseInt(leadData.services[i].thirdPayment) +
                          parseInt(leadData.services[i].fourthPayment) !==
                          parseInt(leadData.services[i].totalPaymentWGST) &&
                        leadData.services[i].paymentTerms !== "Full Advanced"
                          ? "form-control error-border"
                          : "form-control"
                      }
                      placeholder="Search for…"
                      id={`Amount-${i}`}
                      value={Number(
                        leadData.services[i].totalPaymentWGST
                      ).toFixed(2)}
                      disabled
                    />
                    <button class="btn" type="button">
                      ₹
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-sm-12">
                <label className="form-label">
                  Payment Terms {<span style={{ color: "red" }}>*</span>}
                </label>
              </div>
              <div className="full-time col-sm-12">
                <label className="form-check form-check-inline col">
                  <input
                    className="form-check-input"
                    type="radio"
                    name={`radio-name-${i}`}
                    value="Full Advanced"
                    checked={
                      leadData.services[i].paymentTerms === "Full Advanced"
                    }
                    onChange={(e) => {
                      setLeadData((prevState) => ({
                        ...prevState,
                        services: prevState.services.map((service, index) =>
                          index === i
                            ? {
                                ...service,
                                paymentTerms: e.target.value,
                              }
                            : service
                        ),
                      }));
                    }}
                    disabled={completed[activeStep] === true}
                  />
                  <span className="form-check-label">Full Advanced</span>
                </label>
                <label className="form-check form-check-inline col">
                  <input
                    className="form-check-input"
                    type="radio"
                    name={`radio-name-${i}`}
                    value="two-part"
                    checked={leadData.services[i].paymentTerms === "two-part"}
                    onChange={(e) => {
                      setLeadData((prevState) => ({
                        ...prevState,
                        services: prevState.services.map((service, index) =>
                          index === i
                            ? {
                                ...service,
                                paymentTerms: e.target.value,
                                paymentCount: 2,
                              }
                            : service
                        ),
                      }));
                    }}
                    disabled={completed[activeStep] === true}
                  />

                  <span className="form-check-label">Part Payment</span>
                </label>
              </div>
            </div>
            {leadData.services[i].paymentTerms === "two-part" && (
              <div className="d-flex align-items-top mt-2">
                <div className="part-payment-col">
                  <div className="row">
                    <div className="col-sm-3">
                      <div className="form-group">
                        <label class="form-label">First Payment {<span style={{ color: "red" }}>*</span>}</label>
                        <div class="input-group mb-2">
                          <input
                            type="number"
                            class="form-control"
                            placeholder="Enter First Payment"
                            value={leadData.services[i].firstPayment}
                            onChange={(e) => {
                              setLeadData((prevState) => ({
                                ...prevState,
                                services: prevState.services.map(
                                  (service, index) =>
                                    index === i
                                      ? {
                                          ...service,
                                          firstPayment: e.target.value,
                                          secondPayment:
                                            service.paymentCount === 2
                                              ? service.totalPaymentWGST -
                                                e.target.value
                                              : service.secondPayment,
                                        }
                                      : service
                                ),
                              }));
                            }}
                            readOnly={completed[activeStep] === true}
                          />
                          <button class="btn" type="button">
                            ₹
                          </button>
                        </div>
                      </div>
                    </div>
                    {leadData.services[i].paymentCount > 1 && (
                      <div className="col-sm-3">
                        <div className="form-group">
                          <label class="form-label">Second Payment {<span style={{ color: "red" }}>*</span>}</label>
                          <div class="input-group mb-2">
                            <input
                              type="text"
                              class="form-control"
                              placeholder="Search for…"
                              value={leadData.services[i].secondPayment}
                              onChange={(e) => {
                                setLeadData((prevState) => ({
                                  ...prevState,
                                  services: prevState.services.map(
                                    (service, index) =>
                                      index === i
                                        ? {
                                            ...service,
                                            secondPayment: e.target.value,
                                            thirdPayment:
                                              service.paymentCount === 3
                                                ? service.totalPaymentWGST -
                                                  service.firstPayment -
                                                  e.target.value
                                                : service.thirdPayment,
                                          }
                                        : service
                                  ),
                                }));
                              }}
                              readOnly={leadData.services[i].paymentCount === 2}
                            />
                            <button class="btn" type="button">
                              ₹
                            </button>
                          </div>
                          <div>
                            <select
                              value={leadData.services[i].secondPaymentRemarks}
                              onChange={(e) => {
                                setLeadData((prevState) => ({
                                  ...prevState,
                                  services: prevState.services.map(
                                    (service, index) =>
                                      index === i
                                        ? {
                                            ...service,
                                            secondPaymentRemarks:
                                              e.target.value,
                                          }
                                        : service
                                  ),
                                }));
                              }}
                              className="form-select"
                              name="optional-remarks"
                              id="optional-remarks-2"
                            >
                              <option value="" selected disabled>
                                Select Payment Date
                              </option>
                              <option value="After Application">
                                AFTER APPLICATION
                              </option>
                              <option value="AFTER CERTIFICATE">
                                AFTER CERTIFICATE
                              </option>
                              <option value="AFTER APPROVAL">
                                AFTER APPROVAL
                              </option>
                              <option value="AFTER SERVICE COMPLETION">
                                AFTER SERVICE COMPLETION
                              </option>
                              <option value="At the time of Application">
                               AT THE TIME OF APPLICATION
                              </option>
                              <option value="After Document">
                                AFTER DOCUMENT
                              </option>
                              <option value="Before Application">
                                BEFORE APPLICATION
                              </option>
                              <option value="On Particular Date">
                                ON PARTICULAR DATE
                              </option>
                            </select>
                          </div>
                          {leadData.services[i].secondPaymentRemarks ===
                            "On Particular Date" && (
                            <div className="mt-2">
                              <input
                                value={secondTempRemarks}
                                style={{textTransform:"uppercase"}}
                                onChange={(e) =>
                                  setSecondTempRemarks(e.target.value)
                                }
                                className="form-control"
                                type="date"
                                placeholder="dd/mm/yyyy"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {leadData.services[i].paymentCount > 2 && (
                      <div className="col-sm-3">
                        <div className="form-group">
                          <label class="form-label">Third Payment {<span style={{ color: "red" }}>*</span>}</label>
                          <div class="input-group mb-2">
                            <input
                              type="text"
                              class="form-control"
                              placeholder="Search for…"
                              value={leadData.services[i].thirdPayment}
                              onChange={(e) => {
                                setLeadData((prevState) => ({
                                  ...prevState,
                                  services: prevState.services.map(
                                    (service, index) =>
                                      index === i
                                        ? {
                                            ...service,
                                            thirdPayment: e.target.value,
                                            fourthPayment:
                                              service.paymentCount === 4
                                                ? service.totalPaymentWGST -
                                                  service.firstPayment -
                                                  service.secondPayment -
                                                  e.target.value
                                                : service.fourthPayment,
                                          }
                                        : service
                                  ),
                                }));
                              }}
                              readOnly={leadData.services[i].paymentCount === 3}
                            />
                            <button class="btn" type="button">
                              ₹
                            </button>
                          </div>
                          <div>
                            <select
                              value={leadData.services[i].thirdPaymentRemarks}
                              onChange={(e) => {
                                setLeadData((prevState) => ({
                                  ...prevState,
                                  services: prevState.services.map(
                                    (service, index) =>
                                      index === i
                                        ? {
                                            ...service,
                                            thirdPaymentRemarks: e.target.value,
                                          }
                                        : service
                                  ),
                                }));
                              }}
                              className="form-select"
                              name="optional-remarks"
                              id="optional-remarks-3"
                            >
                              <option value="" selected disabled>
                                Select Payment Date
                              </option>
                              <option value="After Application">
                                After Application
                              </option>
                              <option value="At the time of Application">
                                At the time of Application
                              </option>
                              <option value="After Document">
                                After Document
                              </option>
                              <option value="Before Application">
                                Before Application
                              </option>
                              <option value="On Particular Date">
                                On Particular Date
                              </option>
                            </select>
                          </div>
                          {leadData.services[i].thirdPaymentRemarks ===
                            "On Particular Date" && (
                            <div className="mt-2">
                              <input
                                value={thirdTempRemarks}
                                onChange={(e) =>
                                  setThirdTempRemarks(e.target.value)
                                }
                                className="form-control"
                                type="date"
                                placeholder="dd/mm/yyyy"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {leadData.services[i].paymentCount > 3 && (
                      <div className="col-sm-3">
                        <div className="form-group">
                          <label class="form-label">Fourth Payment {<span style={{ color: "red" }}>*</span>}</label>
                          <div class="input-group mb-2">
                            <input
                              type="text"
                              class="form-control"
                              placeholder="Search for…"
                              value={leadData.services[i].fourthPayment}
                              onChange={(e) => {
                                setLeadData((prevState) => ({
                                  ...prevState,
                                  services: prevState.services.map(
                                    (service, index) =>
                                      index === i
                                        ? {
                                            ...service,
                                            fourthPayment: e.target.value,
                                          }
                                        : service
                                  ),
                                }));
                              }}
                              readOnly={leadData.services[i].paymentCount === 4}
                            />
                            <button class="btn" type="button">
                              ₹
                            </button>
                          </div>
                          <div>
                            <select
                              value={leadData.services[i].fourthPaymentRemarks}
                              onChange={(e) => {
                                setLeadData((prevState) => ({
                                  ...prevState,
                                  services: prevState.services.map(
                                    (service, index) =>
                                      index === i
                                        ? {
                                            ...service,
                                            fourthPaymentRemarks:
                                              e.target.value,
                                          }
                                        : service
                                  ),
                                }));
                              }}
                              className="form-select"
                              name="optional-remarks-4"
                              id="optional-remarks-4"
                            >
                              <option value="" selected disabled>
                                Select Payment Date
                              </option>
                              <option value="After Application">
                                After Application
                              </option>
                              <option value="At the time of Application">
                                At the time of Application
                              </option>
                              <option value="After Document">
                                After Document
                              </option>
                              <option value="Before Application">
                                Before Application
                              </option>
                              <option value="On Particular Date">
                                On Particular Date
                              </option>
                            </select>
                          </div>
                          {leadData.services[i].fourthPaymentRemarks ===
                            "On Particular Date" && (
                            <div className="mt-2">
                              <input
                                value={fourthTempRemarks}
                                onChange={(e) =>
                                  setFourthTempRemarks(e.target.value)
                                }
                                className="form-control"
                                type="date"
                                placeholder="dd/mm/yyyy"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="part-payment-plus-minus">
                  <div className="d-flex align-items-end justify-content-between">
                    <button
                      disabled={leadData.services[i].paymentCount === 4}
                      onClick={(e) => {
                        e.preventDefault(); // Prevent the default form submission behavior
                        setLeadData((prevState) => ({
                          ...prevState,
                          services: prevState.services.map((service, index) =>
                            index === i
                              ? {
                                  ...service,
                                  paymentCount: service.paymentCount + 1,
                                  firstPayment: 0,
                                  secondPayment: 0,
                                  thirdPayment: 0,
                                  fourthPayment: 0,
                                }
                              : service
                          ),
                        }));
                      }}
                      style={{ marginLeft: "5px" }}
                      className="btn btn-primary"
                    >
                      +
                    </button>
                    <button
                      disabled={leadData.services[i].paymentCount === 2}
                      onClick={(e) => {
                        e.preventDefault();
                        setLeadData((prevState) => ({
                          ...prevState,
                          services: prevState.services.map((service, index) =>
                            index === i
                              ? {
                                  ...service,
                                  paymentCount: service.paymentCount - 1,
                                  firstPayment: 0,
                                  secondPayment: 0,
                                  thirdPayment: 0,
                                  fourthPayment: 0,
                                }
                              : service
                          ),
                        }));
                      }}
                      style={{ marginLeft: "5px" }}
                      className="btn btn-primary"
                    >
                      <i className="fas fa-plus"></i> -{" "}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="col-sm-6 mt-1">
              <div className="form-group ">
                <label className="form-label" for="Company">
                  Payment Remarks
                </label>
                <textarea
                  rows={1}
                  className="form-control "
                  placeholder="Enter Payment Remarks"
                  id={`payment-remarks-${i}`}
                  value={leadData.services[i].paymentRemarks}
                  onChange={(e) => {
                    setLeadData((prevState) => ({
                      ...prevState,
                      services: prevState.services.map((service, index) =>
                        index === i
                          ? {
                              ...service,
                              paymentRemarks: e.target.value,
                            }
                          : service
                      ),
                    }));
                    handleTextAreaChange(e);
                  }}
                  readOnly={completed[activeStep] === true}
                ></textarea>
              </div>
            </div>
          </div>
        );
      }
    }
    return services;
  };

  // console.log("Default Lead Data :", leadData);

  //   const handleInputChange = (value, id) => {
  //     if (id === "bdmName") {
  //       const foundUser = unames.find((item) => item.ename === value);
  //       setLeadData({
  //         ...leadData,
  //         bdmName: value,
  //         bdmEmail: foundUser ? foundUser.email : "", // Check if foundUser exists before accessing email
  //       });
  //     } else {
  //       setLeadData({ ...leadData, [id]: value });
  //     }
  //   };

  const handleInputChange = (value, fieldName) => {
    if (fieldName === "bdmName") {
      const foundUser = unames.find((item) => item.ename === value);
      setLeadData({
        ...leadData,
        bdmName: value,
        bdmEmail: foundUser ? foundUser.email : "", // Check if foundUser exists before accessing email
      });
    } else if (fieldName === "bdeName") {
      const foundUser = unames.find((item) => item.ename === value);
      setLeadData({
        ...leadData,
        bdeName: value,
        bdeEmail: foundUser ? foundUser.email : "", // Check if foundUser exists before accessing email
      });
    } else {
      setLeadData((prevState) => ({
        ...prevState,
        [fieldName]: value,
      }));
    }
    //setCompanyNewName(value)
  };

  const [companyNewName, setCompanyNewName] = useState("");
  const [foundCompany, setFoundCompany] = useState(null);

  useEffect(() => {
    const fetchDataNew = async () => {
      const companyName = companyNewName;
      // console.log("gadbadyahin hain")
      try {
        const response = await axios.get(`${secretKey}/leads/${companyName}`);
        console.log(response.data);
        setFoundCompany(response.data);
        setLeadData((prevLeadData) => ({
          ...prevLeadData,
          "Company Name": response.data
            ? response.data["Company Name"]
            : companyName,
          "Company Email": response.data ? response.data["Company Email"] : " ",
          "Company Number": response.data ? response.data["Company Number"] : 0,
          incoDate: response.data
            ? formatDate(response.data["Company Incorporation Date  "])
            : " ",
        }));
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    };

    if (companyNewName) {
      fetchDataNew();
    } else {
      setLeadData((prevLeadData) => ({
        ...prevLeadData,
      }));
    }
  }, [companyNewName]);

  useEffect(() => {
    if (foundCompany) {
      setLeadData((prevLeadData) => ({
        ...prevLeadData,
        bdeName: foundCompany.ename !== "Not Alloted" ? foundCompany.ename : "",
        bdeEmail:
          foundCompany.ename !== "Not Alloted"
            ? unames.find((item) => item.ename === foundCompany.ename).email
            : "",
      }));
    }
  }, [foundCompany]);

  console.log("Found Company", foundCompany);
  const handleInputCompanyName = (value) => {
    setCompanyNewName(value);
  };
  const handleRemoveFile = () => {
    setLeadData({ ...leadData, paymentReceipt: null });
  };
  const handleRemoveOtherFile = (index) => {
    setLeadData((prevLeadData) => {
      const updatedDocs = [...prevLeadData.otherDocs];
      updatedDocs.splice(index, 1);
      return {
        ...prevLeadData,
        otherDocs: updatedDocs,
      };
    });
  };

  console.log("lead", leadData);

  return (
    <div>
      <div className="container mt-2">
        <div className="card">
          <div className="card-body p-3">
            <Box sx={{ width: "100%" }}>
              <Stepper nonLinear activeStep={activeStep}>
                {steps.map((label, index) => (
                  <Step key={label} completed={completed[index]}>
                    <StepButton
                      color="inherit"
                      onClick={handleStep(index)}
                      className={
                        activeStep === index ? "form-tab-active" : "No-active"
                      }
                      disabled={!completed[index]}
                    >
                      {label}
                    </StepButton>
                  </Step>
                ))}
              </Stepper>
              <div className="steprForm-bg">
                <div className="steprForm">
                  {allStepsCompleted() ? (
                    <React.Fragment>
                      <Typography sx={{ mt: 2, mb: 1 }}>
                       Already you have a booking for this Company , Thank You
                      </Typography>
                      <Box
                        sx={{ display: "flex", flexDirection: "row", pt: 2 }}
                      >
                        <Box sx={{ flex: "1 1 auto" }} />
                        <button className="btn btn-primary" onClick={()=>setFormOpen(false)}>Back</button>
                      </Box>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      {activeStep === 0 && (
                        <>
                          <div className="step-1">
                            <h2 className="text-center">
                              Step:1 - Company's Basic Informations
                            </h2>
                            <div className="steprForm-inner">
                              <form>
                                <div className="row">
                                  <div className="col-sm-4">
                                    <div className="form-group mt-2 mb-2">
                                      <label for="Company">
                                        Company Name:{" "}
                                        {
                                          <span style={{ color: "red" }}>
                                            *
                                          </span>
                                        }
                                      </label>
                                      <input
                                        type="text"
                                        className="form-control mt-1"
                                        placeholder="Enter Company Name"
                                        id="Company"
                                        value={companyNewName}
                                        onChange={(e) => {
                                          handleInputCompanyName(
                                            e.target.value,
                                            "Company Name"
                                          );
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-sm-4">
                                    <div className="form-group mt-2 mb-2">
                                      <label for="email">
                                        Email Address:{" "}
                                        {
                                          <span style={{ color: "red" }}>
                                            *
                                          </span>
                                        }
                                      </label>
                                      {/* <input
                                                                                type="email"
                                                                                className="form-control mt-1"
                                                                                placeholder="Enter email"
                                                                                id="email"
                                                                                value={leadData["Company Email"]}
                                                                                onChange={(e) => {
                                                                                    handleInputChange(
                                                                                        e.target.value,
                                                                                        "Company Email"
                                                                                    );
                                                                                }}
                                                                                readOnly={completed[activeStep] === true}
                                                                            /> */}
                                      <input
                                        type="email"
                                        className="form-control mt-1"
                                        placeholder="Enter email"
                                        id="email"
                                        value={leadData["Company Email"]}
                                        onChange={(e) => {
                                          handleInputChange(
                                            e.target.value,
                                            "Company Email"
                                          );
                                        }}
                                        readOnly={
                                          completed[activeStep] === true
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="col-sm-4">
                                    <div className="form-group mt-2 mb-2">
                                      <label for="number">
                                        Phone No:{" "}
                                        {
                                          <span style={{ color: "red" }}>
                                            *
                                          </span>
                                        }
                                      </label>
                                      {/* <input
                                                                                type="text" // Use type="text" instead of type="number"
                                                                                className="form-control mt-1"
                                                                                placeholder="Enter Number"
                                                                                id="number"
                                                                                value={leadData["Company Number"]}
                                                                                onChange={(e) => {
                                                                                    const inputValue = e.target.value;
                                                                                    if (/^\d{0,10}$/.test(inputValue)) { // Check if input matches the pattern
                                                                                        handleInputChange(inputValue, "Company Number");
                                                                                    }
                                                                                }}
                                                                                readOnly={completed[activeStep] === true}
                                                                            /> */}
                                      <input
                                        type="text" // Use type="text" instead of type="number"
                                        className="form-control mt-1"
                                        placeholder="Enter Number"
                                        id="number"
                                        value={leadData["Company Number"]}
                                        onChange={(e) => {
                                          const inputValue = e.target.value;
                                          if (/^\d{0,10}$/.test(inputValue)) {
                                            // Check if input matches the pattern
                                            handleInputChange(
                                              inputValue,
                                              "Company Number"
                                            );
                                          }
                                        }}
                                        readOnly={
                                          completed[activeStep] === true
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="col-sm-4">
                                    <div className="form-group mt-2 mb-2">
                                      <label for="number">
                                        Incorporation date:{" "}
                                        {
                                          <span style={{ color: "red" }}>
                                            *
                                          </span>
                                        }
                                      </label>
                                      {/* <input
                                                                                type="date"
                                                                                className="form-control mt-1"
                                                                                placeholder="Incorporation Date"
                                                                                id="inco-date"
                                                                                value={formatDate(leadData.incoDate)}
                                                                                onChange={(e) => {
                                                                                    handleInputChange(
                                                                                        e.target.value,
                                                                                        "incoDate"
                                                                                    );
                                                                                }}
                                                                                readOnly={
                                                                                    completed[activeStep] === true
                                                                                }
                                                                            /> */}
                                      <input
                                        type="date"
                                        className="form-control mt-1"
                                        placeholder="Incorporation Date"
                                        id="inco-date"
                                        value={leadData.incoDate}
                                        onChange={(e) => {
                                          handleInputChange(
                                            e.target.value,
                                            "incoDate"
                                          );
                                        }}
                                        readOnly={
                                          completed[activeStep] === true
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="col-sm-4">
                                    <div className="form-group mt-2 mb-2">
                                      <label for="pan">
                                        Company's PAN:{" "}
                                        {
                                          <span style={{ color: "red" }}>
                                            *
                                          </span>
                                        }
                                      </label>
                                      {/* <input
                                                                                type="text"
                                                                                className="form-control mt-1"
                                                                                placeholder="Enter Company's PAN"
                                                                                id="pan"
                                                                                value={leadData.panNumber}
                                                                                onChange={(e) => {
                                                                                    handleInputChange(
                                                                                        e.target.value,
                                                                                        "panNumber"
                                                                                    );
                                                                                }}
                                                                                readOnly={
                                                                                    completed[activeStep] === true
                                                                                }
                                                                                required
                                                                            /> */}
                                      <input
                                        type="text"
                                        className="form-control mt-1"
                                        placeholder="Enter Company's PAN"
                                        id="pan"
                                        value={leadData.panNumber}
                                        onChange={(e) => {
                                          handleInputChange(
                                            e.target.value,
                                            "panNumber"
                                          );
                                        }}
                                        readOnly={
                                          completed[activeStep] === true
                                        }
                                        required
                                      />
                                    </div>
                                  </div>
                                  <div className="col-sm-4">
                                    <div className="form-group mt-2 mb-2">
                                      <label for="gst">Company's GST:</label>
                                      <input
                                        type="text"
                                        className="form-control mt-1"
                                        placeholder="Enter Company's GST"
                                        id="gst"
                                        value={leadData.gstNumber}
                                        onChange={(e) => {
                                          handleInputChange(
                                            e.target.value,
                                            "gstNumber"
                                          );
                                        }}
                                        readOnly={
                                          completed[activeStep] === true
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                              </form>
                            </div>
                          </div>
                        </>
                      )}
                      {activeStep === 1 && (
                        <>
                          <div className="step-2">
                            <h2 className="text-center">
                              Step:2 - Booking Details
                            </h2>
                            <div className="steprForm-inner">
                              <form>
                                <div className="row">
                                  <div className="col-sm-3">
                                    <div className="form-group mt-2 mb-2">
                                      <label for="bdmName">
                                        BDE Name:{" "}
                                        {
                                          <span style={{ color: "red" }}>
                                            *
                                          </span>
                                        }
                                      </label>

                                      <select
                                        type="text"
                                        className="form-select mt-1"
                                        id="select-users"
                                        value={leadData.bdeName}
                                        onChange={(e) => {
                                          handleInputChange(
                                            e.target.value,
                                            "bdeName"
                                          );
                                        }}
                                        disabled={
                                          completed[activeStep] === true
                                        }
                                      >
                                        <option value="" disabled selected>
                                          Please select BDE Name
                                        </option>
                                        {unames &&
                                          unames.map((names) => (
                                            <option value={names.ename}>
                                              {names.ename}
                                            </option>
                                          ))}
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-sm-3">
                                    <div className="form-group mt-2 mb-2">
                                      <label for="BDEemail">
                                        BDE Email Address:
                                        {
                                          <span style={{ color: "red" }}>
                                            *
                                          </span>
                                        }
                                      </label>
                                      <input
                                        type="email"
                                        className="form-control mt-1"
                                        placeholder="Enter BDE email"
                                        id="BDEemail"
                                        value={leadData.bdeEmail}
                                        onChange={(e) => {
                                          handleInputChange(
                                            e.target.value,
                                            "bdeEmail"
                                          );
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-sm-3">
                                    <div className="form-group mt-2 mb-2">
                                      <label for="bdmName">
                                        BDM Name:{" "}
                                        {
                                          <span style={{ color: "red" }}>
                                            *
                                          </span>
                                        }
                                      </label>

                                      <select
                                        type="text"
                                        className="form-select mt-1"
                                        id="select-users"
                                        value={leadData.bdmName}
                                        onChange={(e) => {
                                          handleInputChange(
                                            e.target.value,
                                            "bdmName"
                                          );
                                        }}
                                        disabled={
                                          completed[activeStep] === true
                                        }
                                      >
                                        <option value="" disabled selected>
                                          Please select BDM Name
                                        </option>
                                        {unames &&
                                          unames.map((names) => (
                                            <option value={names.ename}>
                                              {names.ename}
                                            </option>
                                          ))}

                                        <option value="other">Other</option>
                                      </select>
                                    </div>
                                  </div>
                                  {leadData.bdmName === "other" && (
                                    <>
                                      <div className="row">
                                        <div className="col-sm-3">
                                          <div className="form-group mt-2 mb-2">
                                            <label for="otherBdmName">
                                              Other BDM Name:
                                              {
                                                <span style={{ color: "red" }}>
                                                  *
                                                </span>
                                              }
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control mt-1"
                                              placeholder="Enter Other BDM Name"
                                              id="otherBdmName"
                                              value={leadData.otherBdmName}
                                              onChange={(e) => {
                                                handleInputChange(
                                                  e.target.value,
                                                  "otherBdmName"
                                                );
                                              }}
                                            />
                                          </div>
                                        </div>
                                        <div className="col-sm-3">
                                          <div className="form-group mt-2 mb-2">
                                            <label for="otherEmail">
                                              BDM Email:
                                              {
                                                <span style={{ color: "red" }}>
                                                  *
                                                </span>
                                              }
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control mt-1"
                                              placeholder="Enter BDM Email"
                                              id="otherBdmEmail"
                                              value={leadData.bdmEmail}
                                              onChange={(e) => {
                                                handleInputChange(
                                                  e.target.value,
                                                  "bdmEmail"
                                                );
                                              }}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </>
                                  )}
                                  {leadData.bdmName !== "other" && (
                                    <div className="col-sm-3">
                                      <div className="form-group mt-2 mb-2">
                                        <label for="BDMemail">
                                          BDM Email Address:{" "}
                                          {
                                            <span style={{ color: "red" }}>
                                              *
                                            </span>
                                          }
                                        </label>
                                        <input
                                          type="email"
                                          className="form-control mt-1"
                                          placeholder="Enter BDM email"
                                          id="BDMemail"
                                          value={leadData.bdmEmail}
                                          onChange={(e) => {
                                            handleInputChange(
                                              e.target.value,
                                              "bdmEmail"
                                            );
                                          }}
                                          //disabled={leadData.bdmEmail}
                                        />
                                      </div>
                                    </div>
                                  )}

                                  <div className="row mt-1">
                                    <div className="col-sm-2 mr-2">
                                      <div className="form-group mt-2 mb-2">
                                        <label htmlFor="bdmType">
                                          BDM Type :
                                          {
                                            <span style={{ color: "red" }}>
                                              *
                                            </span>
                                          }
                                        </label>
                                        <div
                                          style={{ minWidth: "16vw" }}
                                          className="d-flex mt-2"
                                        >
                                          <label className="form-check form-check-inline">
                                            <input
                                              className="form-check-input"
                                              type="radio"
                                              name="bdm-type"
                                              onChange={(e) => {
                                                setLeadData((prevLeadData) => ({
                                                  ...prevLeadData,
                                                  bdmType: "Close-by", // Set the value based on the selected radio button
                                                }));
                                              }}
                                              // Set the value attribute for "Yes"
                                              checked={
                                                leadData.bdmType === "Close-by"
                                              } // Check condition based on state
                                            />
                                            <span className="form-check-label">
                                              Close By
                                            </span>
                                          </label>
                                          <label className="form-check form-check-inline">
                                            <input
                                              className="form-check-input"
                                              type="radio"
                                              name="bdmType"
                                              onChange={(e) => {
                                                setLeadData((prevLeadData) => ({
                                                  ...prevLeadData,
                                                  bdmType: "Supported-by", // Set the value based on the selected radio button
                                                }));
                                              }}
                                              // Set the value attribute for "Yes"
                                              checked={
                                                leadData.bdmType ===
                                                "Supported-by"
                                              } // Check condition based on state
                                            />
                                            <span className="form-check-label">
                                              Supported By
                                            </span>
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="col-sm-4">
                                    <div className="form-group mt-2 mb-2">
                                      <label for="booking-date">
                                        Booking Date{" "}
                                        {
                                          <span style={{ color: "red" }}>
                                            *
                                          </span>
                                        }
                                      </label>
                                      <input
                                        type="date"
                                        className="form-control mt-1"
                                        placeholder="Enter Booking date"
                                        id="booking-date"
                                        value={leadData.bookingDate}
                                        onChange={(e) => {
                                          handleInputChange(
                                            e.target.value,
                                            "bookingDate"
                                          );
                                        }}
                                        readOnly={
                                          completed[activeStep] === true
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="col-sm-4">
                                    <div className="form-group mt-2 mb-2">
                                      <label for="lead-source">
                                        Lead Source:{" "}
                                        {
                                          <span style={{ color: "red" }}>
                                            *
                                          </span>
                                        }
                                      </label>
                                      <select
                                        value={selectedValues}
                                        onChange={(e) =>
                                          setSelectedValues(e.target.value)
                                        }
                                        className="form-select mt-1"
                                        id="lead-source"
                                        disabled={
                                          completed[activeStep] === true
                                        }
                                      >
                                        <option value="" disabled selected>
                                          Select Lead Source
                                        </option>
                                        <option value="Excel Data">
                                          Excel Data
                                        </option>
                                        <option value="CRM Data">
                                          CRM Data
                                        </option>
                                        <option value="Insta Lead">
                                          Insta Lead
                                        </option>
                                        <option value="Reference">
                                          Reference
                                        </option>
                                        <option value="Existing Client">
                                          Existing Client
                                        </option>
                                        <option value="Lead By Saurav Sir">
                                          Lead By Saurav Sir
                                        </option>
                                        <option value="Other">Other</option>
                                      </select>
                                    </div>
                                  </div>
                                  {selectedValues === "Other" && (
                                    <div className="col-sm-4">
                                      <div className="form-group mt-2 mb-2">
                                        <label for="OtherLeadSource">
                                          Other Lead Source
                                        </label>
                                        <input
                                          type="text"
                                          className="form-control mt-1"
                                          placeholder="Enter Other Lead Source"
                                          id="OtherLeadSource"
                                          value={leadData.otherBookingSource}
                                          onChange={(e) => {
                                            handleInputChange(
                                              e.target.value,
                                              "otherBookingSource"
                                            );
                                          }}
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </form>
                            </div>
                          </div>
                        </>
                      )}
                      {activeStep === 2 && (
                        <>
                          <div className="step-3">
                            <h2 className="text-center">
                              Step:3 - Services & Payment
                            </h2>
                            <div className="steprForm-inner">
                              <form>
                                <div className="d-flex align-items-center">
                                  <div>
                                    {" "}
                                    <label for="lead-source">
                                      Select No of Services:
                                      {<span style={{ color: "red" }}>*</span>}
                                    </label>
                                  </div>
                                  <div className="ml-2">
                                    <select
                                      className="form-select mt-1"
                                      id="lead-source"
                                      value={totalServices}
                                      onChange={(e) => {
                                        setfetchedService(false);
                                        setTotalServices(e.target.value);
                                      }}
                                      disabled={completed[activeStep] === true}
                                    >
                                      {[...Array(6 - 1).keys()].map((year) => (
                                        <option key={year} value={1 + year}>
                                          {1 + year}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                                {renderServices()}

                                <div className="CA-case mb-1">
                                  <label class="form-label mt-2">
                                    CA Case{" "}
                                    {<span style={{ color: "red" }}>*</span>}
                                  </label>

                                  <div className="check-ca-case">
                                    <div class="mb-3">
                                      <div>
                                        <label className="form-check form-check-inline">
                                          <input
                                            className="form-check-input"
                                            type="radio"
                                            name="ca-case"
                                            onChange={(e) => {
                                              setLeadData((prevLeadData) => ({
                                                ...prevLeadData,
                                                caCase: e.target.value, // Set the value based on the selected radio button
                                              }));
                                            }}
                                            disabled={
                                              completed[activeStep] === true
                                            }
                                            value="Yes" // Set the value attribute for "Yes"
                                            checked={leadData.caCase === "Yes"} // Check condition based on state
                                          />
                                          <span className="form-check-label">
                                            Yes
                                          </span>
                                        </label>
                                        <label className="form-check form-check-inline">
                                          <input
                                            className="form-check-input"
                                            type="radio"
                                            name="ca-case"
                                            onChange={(e) => {
                                              setLeadData((prevLeadData) => ({
                                                ...prevLeadData,
                                                caCase: e.target.value, // Set the value based on the selected radio button
                                              }));
                                            }}
                                            disabled={
                                              completed[activeStep] === true
                                            }
                                            value="No" // Set the value attribute for "No"
                                            checked={leadData.caCase === "No"} // Check condition based on state
                                          />
                                          <span className="form-check-label">
                                            No
                                          </span>
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                  {leadData.caCase === "Yes" && (
                                    <div className="ca-details row">
                                      <div className="ca-number col">
                                        <label className="form-label">
                                          Enter CA's Number{" "}
                                          {
                                            <span style={{ color: "red" }}>
                                              *
                                            </span>
                                          }
                                        </label>
                                        <input
                                          type="number"
                                          name="ca-number"
                                          id="ca-number"
                                          placeholder="Enter CA's Number"
                                          className="form-control"
                                          onChange={(e) => {
                                            setLeadData((prevLeadData) => ({
                                              ...prevLeadData,
                                              caNumber: e.target.value, // Set the value based on the selected radio button
                                            }));
                                          }}
                                          readOnly={
                                            completed[activeStep] === true
                                          }
                                          value={leadData.caNumber}
                                        />
                                      </div>
                                      <div className="ca-email col">
                                        <label className="form-label">
                                          Enter CA's Email{" "}
                                          {
                                            <span style={{ color: "red" }}>
                                              *
                                            </span>
                                          }
                                        </label>
                                        <div className="ca-email2">
                                          <input
                                            type="text"
                                            name="ca-email"
                                            id="ca-email"
                                            placeholder="Enter CA's Email Address"
                                            className="form-control"
                                            value={leadData.caEmail}
                                            onChange={(e) => {
                                              setLeadData((prevLeadData) => ({
                                                ...prevLeadData,
                                                caEmail: e.target.value, // Set the value based on the selected radio button
                                              }));
                                            }}
                                            readOnly={
                                              completed[activeStep] === true
                                            }
                                          />
                                        </div>
                                      </div>

                                      <div className="ca-commision col">
                                        <label className="form-label">
                                          Enter CA's Commission{" "}
                                          {
                                            <span style={{ color: "red" }}>
                                              *
                                            </span>
                                          }
                                        </label>
                                        <input
                                          type="text"
                                          name="ca-commision"
                                          id="ca-commision"
                                          placeholder="Enter CA's Commision- If any"
                                          className="form-control"
                                          onChange={(e) => {
                                            setLeadData((prevLeadData) => ({
                                              ...prevLeadData,
                                              caCommission: e.target.value, // Set the value based on the selected radio button
                                            }));
                                          }}
                                          value={leadData.caCommission}
                                          readOnly={
                                            completed[activeStep] === true
                                          }
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </form>
                            </div>
                          </div>
                        </>
                      )}
                      {activeStep === 3 && (
                        <>
                          <div className="step-4">
                            <h2 className="text-center">
                              Step:4 - Payment Summery
                            </h2>
                            <div className="steprForm-inner">
                              <form>
                                <div className="row">
                                  <div className="col-sm-12">
                                    <span className="notes">
                                      Note: Total Selected Services is{" "}
                                      <b>{leadData.services.length}</b>.
                                    </span>
                                  </div>
                                  <div className="col-sm-4 mt-3">
                                    <div className="form-group">
                                      <label class="form-label">
                                        Total Payment
                                      </label>
                                      <div class="input-group mb-2">
                                        <input
                                          type="number"
                                          class="form-control"
                                          placeholder="Total Payment"
                                          value={leadData.services
                                            .reduce(
                                              (total, service) =>
                                                total +
                                                Number(
                                                  service.totalPaymentWGST
                                                ),
                                              0
                                            )
                                            .toFixed(2)}
                                          readOnly
                                        />
                                        <button class="btn" type="button">
                                          ₹
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-sm-4 mt-3">
                                    <div className="form-group">
                                      <label class="form-label">
                                        Received Payment
                                      </label>
                                      <div class="input-group">
                                        <input
                                          type="number"
                                          class="form-control"
                                          placeholder="Received Payment"
                                          value={leadData.services
                                            .reduce(
                                              (total, service) =>
                                                service.paymentTerms ===
                                                "Full Advanced"
                                                  ? total +
                                                    Number(
                                                      service.totalPaymentWGST
                                                    )
                                                  : total +
                                                    Number(
                                                      service.firstPayment
                                                    ),
                                              0
                                            )
                                            .toFixed(2)}
                                          readOnly
                                        />
                                        <button class="btn" type="button">
                                          ₹
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-sm-4 mt-3">
                                    <div className="form-group">
                                      <label class="form-label">
                                        Pending Payment
                                      </label>
                                      <div class="input-group mb-2">
                                        <input
                                          type="number"
                                          class="form-control"
                                          placeholder="Pending Payment"
                                          value={leadData.services
                                            .reduce(
                                              (total, service) =>
                                                service.paymentTerms ===
                                                "Full Advanced"
                                                  ? total + 0
                                                  : total +
                                                    Number(
                                                      service.totalPaymentWGST
                                                    ) -
                                                    Number(
                                                      service.firstPayment
                                                    ),
                                              0
                                            )
                                            .toFixed(2)}
                                          readOnly
                                        />
                                        <button class="btn" type="button">
                                          ₹
                                        </button>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="col-sm-6 mt-2">
                                    <div className="form-group mt-2 mb-2">
                                      <label
                                        className="form-label"
                                        for="Payment Receipt"
                                      >
                                        Upload Payment Reciept{" "}
                                      </label>
                                      <input
                                        type="file"
                                        className="form-control mt-1"
                                        id="Company"
                                        onChange={(e) => {
                                          // Update the state with the selected files
                                          setLeadData((prevLeadData) => ({
                                            ...prevLeadData,
                                            paymentReceipt: [
                                              ...(prevLeadData.paymentReceipt ||
                                                []),
                                              ...e.target.files,
                                            ],
                                          }));
                                        }}
                                        disabled={
                                          completed[activeStep] === true
                                        }
                                        multi
                                      ></input>
                                    </div>
                                  </div>

                                  <div className="col-sm-6 mt-2">
                                    <div class="form-group mt-2 mb-2">
                                      <label class="form-label">
                                        Payment Method{" "}
                                        {
                                          <span style={{ color: "red" }}>
                                            *
                                          </span>
                                        }
                                      </label>
                                      <select
                                        class="form-select mb-3"
                                        id="select-emails"
                                        fdprocessedid="iey9wm"
                                        value={leadData.paymentMethod}
                                        onChange={(e) => {
                                          handleInputChange(
                                            e.target.value,
                                            "paymentMethod"
                                          );
                                        }}
                                        disabled={
                                          completed[activeStep] === true
                                        }
                                      >
                                        <option value="" disabled="">
                                          Select Payment Option
                                        </option>
                                        <option value="ICICI Bank">
                                          ICICI Bank
                                        </option>
                                        <option value="SRK Seedfund(Non GST)/IDFC first Bank">
                                          SRK Seedfund(Non GST)/IDFC first Bank
                                        </option>
                                        <option value="STARTUP SAHAY SERVICES/ADVISORY(Non GST)/ IDFC First Bank">
                                          STARTUP SAHAY SERVICES/ADVISORY(Non
                                          GST)/ IDFC First Bank
                                        </option>
                                        <option value="Razorpay">
                                          Razorpay
                                        </option>
                                        <option value="PayU">PayU</option>
                                        <option value="Cashfree">Cashfree</option>
                                        <option value="Other">Other</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-sm-6 mt-2">
                                    <div className="form-group">
                                      <label
                                        className="form-label"
                                        for="remarks"
                                      >
                                        Any Extra Remarks{" "}
                                       
                                      </label>
                                      <textarea
                                        rows={1}
                                        className="form-control mt-1"
                                        placeholder="Enter Extra Remarks"
                                        id="Extra Remarks"
                                        value={leadData.extraNotes}
                                        onChange={(e) => {
                                          handleInputChange(
                                            e.target.value,
                                            "extraNotes"
                                          );
                                          handleTextAreaChange(e);
                                        }}
                                        readOnly={
                                          completed[activeStep] === true
                                        }
                                      ></textarea>
                                    </div>
                                  </div>
                                  <div className="col-sm-6 mt-2">
                                    <div className="form-group">
                                      <label className="form-label" for="docs">
                                        Upload Additional Docs{" "}
                                      </label>
                                      <input
                                        type="file"
                                        onChange={(e) => {
                                          // Update the state with the selected files
                                          setLeadData((prevLeadData) => ({
                                            ...prevLeadData,
                                            otherDocs: [
                                              ...(prevLeadData.otherDocs || []),
                                              ...e.target.files,
                                            ],
                                          }));
                                        }}
                                        disabled={
                                          completed[activeStep] === true
                                        }
                                        className="form-control mt-1"
                                        id="docs"
                                        multiple
                                      />
                                      {leadData.otherDocs &&
                                        leadData.otherDocs.length > 0 && (
                                          <div className="uploaded-filename-main d-flex flex-wrap">
                                            {leadData.otherDocs.map(
                                              (file, index) => (
                                                <div
                                                  className="uploaded-fileItem d-flex align-items-center"
                                                  key={index}
                                                >
                                                  <p className="m-0">
                                                    {file.name !== undefined
                                                      ? file.name
                                                      : file.filename}
                                                  </p>
                                                  <button
                                                    className="fileItem-dlt-btn"
                                                    onClick={() =>
                                                      handleRemoveOtherFile(
                                                        index
                                                      )
                                                    }
                                                    disabled={
                                                      completed[activeStep] ===
                                                      true
                                                    }
                                                  >
                                                    <IconX className="close-icon" />
                                                  </button>
                                                </div>
                                              )
                                            )}
                                          </div>
                                        )}
                                    </div>
                                  </div>
                                </div>
                              </form>
                            </div>
                          </div>
                        </>
                      )}
                      {activeStep === 4 && (
                        <>
                          <div className="step-3">
                            <h2 className="text-center">
                              Step:5 - Booking Preview
                            </h2>
                            <div className="steprForm-inner">
                              <div className="stepOnePreview">
                                <div className="d-flex align-items-center">
                                  <div className="services_No">1</div>
                                  <div className="ml-1">
                                    <h3 className="m-0">
                                      Company's Basic Informations
                                    </h3>
                                  </div>
                                </div>
                                <div className="servicesFormCard mt-3">
                                  <div className="row m-0">
                                    <div className="col-sm-3 p-0">
                                      <div className="form-label-name">
                                        <b>Compnay name</b>
                                      </div>
                                    </div>
                                    <div className="col-sm-9 p-0">
                                      <div className="form-label-data">
                                        {leadData["Company Name"]}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row m-0">
                                    <div className="col-sm-3 p-0">
                                      <div className="form-label-name">
                                        <b>Email Address:</b>
                                      </div>
                                    </div>
                                    <div className="col-sm-9 p-0">
                                      <div className="form-label-data">
                                        {leadData["Company Email"]}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row m-0">
                                    <div className="col-sm-3 p-0">
                                      <div className="form-label-name">
                                        <b>Phone No:</b>
                                      </div>
                                    </div>
                                    <div className="col-sm-9 p-0">
                                      <div className="form-label-data">
                                        {leadData["Company Number"]}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row m-0">
                                    <div className="col-sm-3 p-0">
                                      <div className="form-label-name">
                                        <b>Incorporation date:</b>
                                      </div>
                                    </div>
                                    <div className="col-sm-9 p-0">
                                      <div className="form-label-data">
                                        {formatDate(leadData.incoDate)}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row m-0">
                                    <div className="col-sm-3 p-0">
                                      <div className="form-label-name">
                                        <b>Company's PAN:</b>
                                      </div>
                                    </div>
                                    <div className="col-sm-9 p-0">
                                      <div className="form-label-data">
                                        {leadData.panNumber
                                          ? leadData.panNumber
                                          : "-"}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row m-0">
                                    <div className="col-sm-3 p-0">
                                      <div className="form-label-name">
                                        <b>Company's GST:</b>
                                      </div>
                                    </div>
                                    <div className="col-sm-9 p-0">
                                      <div className="form-label-data">
                                        {leadData.gstNumber
                                          ? leadData.gstNumber
                                          : "-"}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="stepTWOPreview">
                                <div className="d-flex align-items-center mt-3">
                                  <div className="services_No">2</div>
                                  <div className="ml-1">
                                    <h3 className="m-0">Booking Details</h3>
                                  </div>
                                </div>
                                <div className="servicesFormCard mt-3">
                                  <div className="row m-0">
                                    <div className="col-sm-3 p-0">
                                      <div className="form-label-name">
                                        <b>BDE Name:</b>
                                      </div>
                                    </div>
                                    <div className="col-sm-9 p-0">
                                      <div className="form-label-data">
                                        {leadData.bdeName}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row m-0">
                                    <div className="col-sm-3 p-0">
                                      <div className="form-label-name">
                                        <b>BDE Email</b>
                                      </div>
                                    </div>
                                    <div className="col-sm-9 p-0">
                                      <div className="form-label-data">
                                        {leadData.bdeEmail}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row m-0">
                                    <div className="col-sm-3 p-0">
                                      <div className="form-label-name">
                                        <b>BDM Name</b>
                                      </div>
                                    </div>
                                    <div className="col-sm-9 p-0">
                                      <div className="form-label-data">
                                        {leadData.bdmName}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row m-0">
                                    <div className="col-sm-3 p-0">
                                      <div className="form-label-name">
                                        <b>BDM Email</b>
                                      </div>
                                    </div>
                                    <div className="col-sm-9 p-0">
                                      <div className="form-label-data">
                                        {leadData.bdmEmail}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row m-0">
                                    <div className="col-sm-3 p-0">
                                      <div className="form-label-name">
                                        <b>Booking Date</b>
                                      </div>
                                    </div>
                                    <div className="col-sm-9 p-0">
                                      <div className="form-label-data">
                                        {leadData.bookingDate}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row m-0">
                                    <div className="col-sm-3 p-0">
                                      <div className="form-label-name">
                                        <b>Lead Source</b>
                                      </div>
                                    </div>
                                    <div className="col-sm-9 p-0">
                                      <div className="form-label-data">
                                        {leadData.bookingSource !== ""
                                          ? leadData.bookingSource
                                          : "-"}
                                      </div>
                                    </div>
                                  </div>
                                  {leadData.otherBookingSource && (
                                    <div className="row m-0">
                                      <div className="col-sm-3 p-0">
                                        <div className="form-label-name">
                                          <b>Other Lead Source</b>
                                        </div>
                                      </div>
                                      <div className="col-sm-9 p-0">
                                        <div className="form-label-data">
                                          {leadData.otherBookingSource}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="stepThreePreview">
                                <div className="d-flex align-items-center mt-3">
                                  <div className="services_No">3</div>
                                  <div className="ml-1">
                                    <h3 className="m-0">
                                      Services And Payment Details
                                    </h3>
                                  </div>
                                </div>
                                <div className="servicesFormCard mt-3">
                                  <div className="row m-0">
                                    <div className="col-sm-3 p-0">
                                      <div className="form-label-name">
                                        <b>Total Selected Services</b>
                                      </div>
                                    </div>
                                    <div className="col-sm-9 p-0">
                                      <div className="form-label-data">
                                        {totalServices}
                                      </div>
                                    </div>
                                  </div>
                                  {leadData.services.map((obj, index) => (
                                    <div className="parServicesPreview mt-3">
                                      <div className="row m-0">
                                        <div className="col-sm-3 p-0">
                                          <div className="form-label-name">
                                            <b>
                                              {getOrdinal(index + 1)} Services
                                              Name
                                            </b>
                                          </div>
                                        </div>
                                        <div className="col-sm-9 p-0">
                                          <div className="form-label-data">
                                            {obj.serviceName}
                                          </div>
                                        </div>
                                      </div>
                                      {/* <!-- Optional --> */}
                                      {obj.serviceName ===
                                        "Start-Up India Certificate" && (
                                        <div className="row m-0">
                                          <div className="col-sm-3 p-0">
                                            <div className="form-label-name">
                                              <b>With DSC</b>
                                            </div>
                                          </div>
                                          <div className="col-sm-9 p-0">
                                            <div className="form-label-data">
                                              {obj.withDSC === true
                                                ? "Yes"
                                                : "No"}
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                      {/* total amount */}
                                      <div className="row m-0">
                                        <div className="col-sm-3 p-0">
                                          <div className="form-label-name">
                                            <b>Total Amount</b>
                                          </div>
                                        </div>
                                        <div className="col-sm-9 p-0">
                                          <div className="form-label-data">
                                          ₹{" "}{obj.totalPaymentWGST !== undefined
                                              ? (parseInt(
                                                  obj.totalPaymentWGST
                                                )).toLocaleString()
                                              : "0"}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="row m-0">
                                        <div className="col-sm-3 p-0">
                                          <div className="form-label-name">
                                            <b>With GST</b>
                                          </div>
                                        </div>
                                        <div className="col-sm-9 p-0">
                                          <div className="form-label-data">
                                            {obj.withGST === true
                                              ? "Yes"
                                              : "No"}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="row m-0">
                                        <div className="col-sm-3 p-0">
                                          <div className="form-label-name">
                                            <b>Payment Terms</b>
                                          </div>
                                        </div>
                                        <div className="col-sm-9 p-0">
                                          <div className="form-label-data">
                                            {obj.paymentTerms}
                                          </div>
                                        </div>
                                      </div>
                                      {obj.paymentTerms !== "Full Advanced" && (
                                        <>
                                          <div className="row m-0">
                                            <div className="col-sm-3 p-0">
                                              <div className="form-label-name">
                                                <b>First Payment</b>
                                              </div>
                                            </div>
                                            <div className="col-sm-9 p-0">
                                              <div className="form-label-data">
                                              ₹{" "}{parseInt(
                                                  obj.firstPayment
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                          <div className="row m-0">
                                            <div className="col-sm-3 p-0">
                                              <div className="form-label-name">
                                                <b>Second Payment</b>
                                              </div>
                                            </div>
                                            <div className="col-sm-9 p-0">
                                              <div className="form-label-data" style={{textTransform:"uppercase"}}>
                                              ₹{" "}{parseInt(
                                                  obj.secondPayment
                                                ).toLocaleString()}{" "}
                                                -{" "}
                                                {isNaN(
                                                  new Date(
                                                    obj.secondPaymentRemarks
                                                  )
                                                )
                                                  ? obj.secondPaymentRemarks
                                                  : `Payment On ${obj.secondPaymentRemarks}`}
                                              </div>
                                            </div>
                                          </div>
                                          {obj.thirdPayment !== 0 && (
                                            <div className="row m-0">
                                              <div className="col-sm-3 p-0">
                                                <div className="form-label-name">
                                                  <b>Third Payment</b>
                                                </div>
                                              </div>
                                              <div className="col-sm-9 p-0">
                                                <div className="form-label-data" style={{textTransform:"uppercase"}}>
                                                ₹{" "}{parseInt(
                                                    obj.thirdPayment
                                                  ).toLocaleString()}{" "}
                                                  -{" "}
                                                  {isNaN(
                                                    new Date(
                                                      obj.thirdPaymentRemarks
                                                    )
                                                  )
                                                    ? obj.thirdPaymentRemarks
                                                    : `Payment On ${obj.thirdPaymentRemarks}`}
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                          {obj.fourthPayment !== 0 && (
                                            <div className="row m-0">
                                              <div className="col-sm-3 p-0">
                                                <div className="form-label-name">
                                                  <b>Fourth Payment</b>
                                                </div>
                                              </div>
                                              <div className="col-sm-9 p-0">
                                                <div className="form-label-data" style={{textTransform:"uppercase"}}>
                                                ₹{" "}{parseInt(
                                                    obj.fourthPayment
                                                  ).toLocaleString()}{" "}
                                                  -{" "}
                                                  {isNaN(
                                                    new Date(
                                                      obj.fourthPaymentRemarks
                                                    )
                                                  )
                                                    ? obj.fourthPaymentRemarks
                                                    : `Payment On ${obj.fourthPaymentRemarks}`}
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                        </>
                                      )}
                                      <div className="row m-0">
                                        <div className="col-sm-3 p-0">
                                          <div className="form-label-name">
                                            <b>Notes</b>
                                          </div>
                                        </div>
                                        <div className="col-sm-9 p-0">
                                          <div className="form-label-data">
                                            {obj.paymentRemarks !== ""
                                              ? obj.paymentRemarks
                                              : "-"}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}

                                  {/* total amount */}
                                </div>
                              </div>
                              <div className="stepThreePreview">
                                <div className="d-flex align-items-center mt-3">
                                  <div className="services_No">4</div>
                                  <div className="ml-1">
                                    <h3 className="m-0">Payment Summary</h3>
                                  </div>
                                </div>
                                <div className="servicesFormCard mt-3">
                                  <div className="row m-0">
                                    <div className="col-sm-4">
                                      <div className="row">
                                        <div className="col-sm-4 p-0">
                                          <div className="form-label-name">
                                            <b>Total Payment</b>
                                          </div>
                                        </div>
                                        <div className="col-sm-8 p-0">
                                          <div className="form-label-data">
                                            ₹{" "}
                                            {parseInt(
                                              leadData.services.reduce(
                                                (acc, curr) =>
                                                  acc +
                                                  Number(curr.totalPaymentWGST),
                                                0
                                              )
                                            ).toLocaleString()}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-sm-4">
                                      <div className="row">
                                        <div className="col-sm-5 p-0">
                                          <div className="form-label-name">
                                            <b>Received Paymnet</b>
                                          </div>
                                        </div>
                                        <div className="col-sm-7 p-0">
                                          <div className="form-label-data">
                                            ₹{" "}
                                            {(leadData.services
                                              .reduce((acc, curr) => {
                                                return curr.paymentTerms ===
                                                  "Full Advanced"
                                                  ? acc +
                                                      Number(
                                                        curr.totalPaymentWGST
                                                      )
                                                  : acc +
                                                      Number(curr.firstPayment);
                                              }, 0)).toLocaleString()
                                              }
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-sm-4">
                                      <div className="row">
                                        <div className="col-sm-4 p-0">
                                          <div className="form-label-name">
                                            <b>Pending Payment</b>
                                          </div>
                                        </div>
                                        <div className="col-sm-8 p-0">
                                          <div className="form-label-data">
                                            ₹{" "}
                                            {parseInt(leadData.services
                                            .reduce(
                                              (total, service) =>
                                                service.paymentTerms ===
                                                "Full Advanced"
                                                  ? total + 0
                                                  : total +
                                                    Number(
                                                      service.totalPaymentWGST
                                                    ) -
                                                    Number(
                                                      service.firstPayment
                                                    ),
                                              0
                                            )
                                            ).toLocaleString()}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {leadData.paymentReceipt.length !== 0 && (
                                    <div className="row m-0">
                                      <div className="col-sm-3 align-self-stretc p-0">
                                        <div className="form-label-name h-100">
                                          <b>Upload Payment Receipt</b>
                                        </div>
                                      </div>
                                      <div className="col-sm-9 p-0">
                                        <div className="form-label-data">
                                          <div
                                            className="UploadDocPreview"
                                            onClick={() => {
                                              handleViewPdfReciepts(
                                                leadData.paymentReceipt[0]
                                                  .filename
                                                  ? leadData.paymentReceipt[0]
                                                      .filename
                                                  : leadData.paymentReceipt[0]
                                                      .name
                                              );
                                            }}
                                          >
                                            {leadData.paymentReceipt[0]
                                              .filename ? (
                                              <>
                                                <div className="docItemImg">
                                                  <img
                                                    src={
                                                      leadData.paymentReceipt[0].filename.endsWith(
                                                        ".pdf"
                                                      )
                                                        ? pdfimg
                                                        : img
                                                    }
                                                  ></img>
                                                </div>
                                                <div
                                                  className="docItemName wrap-MyText"
                                                  title={
                                                    leadData.paymentReceipt[0].filename.split(
                                                      "-"
                                                    )[1]
                                                  }
                                                >
                                                  {
                                                    leadData.paymentReceipt[0].filename.split(
                                                      "-"
                                                    )[1]
                                                  }
                                                </div>
                                              </>
                                            ) : (
                                              <>
                                                <div className="docItemImg">
                                                  <img
                                                    src={
                                                      leadData.paymentReceipt[0].name.endsWith(
                                                        ".pdf"
                                                      )
                                                        ? pdfimg
                                                        : img
                                                    }
                                                  ></img>
                                                </div>
                                                <div
                                                  className="docItemName wrap-MyText"
                                                  title={
                                                    leadData.paymentReceipt[0].name.split(
                                                      "-"
                                                    )[1]
                                                  }
                                                >
                                                  {
                                                    leadData.paymentReceipt[0].name.split(
                                                      "-"
                                                    )[1]
                                                  }
                                                </div>
                                              </>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  <div className="row m-0">
                                    <div className="col-sm-3 p-0">
                                      <div className="form-label-name">
                                        <b>Payment Method</b>
                                      </div>
                                    </div>
                                    <div className="col-sm-9 p-0">
                                      <div className="form-label-data">
                                        {leadData.paymentMethod}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row m-0">
                                    <div className="col-sm-3 p-0">
                                      <div className="form-label-name">
                                        <b>Extra Remarks</b>
                                      </div>
                                    </div>
                                    <div className="col-sm-9 p-0">
                                      <div className="form-label-data">
                                        {leadData.extraNotes}
                                      </div>
                                    </div>
                                  </div>
                                  {leadData.otherDocs.length !== 0 && (
                                    <div className="row m-0">
                                      <div className="col-sm-3 align-self-stretc p-0">
                                        <div className="form-label-name h-100">
                                          <b>Additional Docs</b>
                                        </div>
                                      </div>
                                      <div className="col-sm-9 p-0">
                                        <div className="form-label-data d-flex flex-wrap">
                                          {leadData.otherDocs.map((val) =>
                                            val.filename ? (
                                              <>
                                                <div
                                                  className="UploadDocPreview"
                                                  onClick={() => {
                                                    handleViewPdOtherDocs(
                                                      val.filename
                                                    );
                                                  }}
                                                >
                                                  <div className="docItemImg">
                                                    <img
                                                      src={
                                                        val.filename.endsWith(
                                                          ".pdf"
                                                        )
                                                          ? pdfimg
                                                          : img
                                                      }
                                                    ></img>
                                                  </div>

                                                  <div
                                                    className="docItemName wrap-MyText"
                                                    title="logo.png"
                                                  >
                                                    {val.filename.split("-")[1]}
                                                  </div>
                                                </div>
                                              </>
                                            ) : (
                                              <>
                                                <div
                                                  className="UploadDocPreview"
                                                  onClick={() => {
                                                    handleViewPdOtherDocs(
                                                      val.name
                                                    );
                                                  }}
                                                >
                                                  <div className="docItemImg">
                                                    <img
                                                      src={
                                                        val.name.endsWith(
                                                          ".pdf"
                                                        )
                                                          ? pdfimg
                                                          : img
                                                      }
                                                    ></img>
                                                  </div>
                                                  <div
                                                    className="docItemName wrap-MyText"
                                                    title="logo.png"
                                                  >
                                                    {val.name.split("-")[1]}
                                                  </div>
                                                </div>
                                              </>
                                            )
                                          )}

                                          {/* <div className="UploadDocPreview">
                                          <div className="docItemImg">
                                            <img src={img}></img>
                                          </div>
                                          <div
                                            className="docItemName wrap-MyText"
                                            title="logo.png"
                                          >
                                            logo.png
                                          </div>
                                        </div>
                                        <div className="UploadDocPreview">
                                          <div className="docItemImg">
                                            <img src={wordimg}></img>
                                          </div>
                                          <div
                                            className="docItemName wrap-MyText"
                                            title=" information.word"
                                          >
                                            information.word
                                          </div>
                                        </div>
                                        <div className="UploadDocPreview">
                                          <div className="docItemImg">
                                            <img src={excelimg}></img>
                                          </div>
                                          <div
                                            className="docItemName wrap-MyText"
                                            title="financials.csv"
                                          >
                                            financials.csv
                                          </div>
                                        </div> */}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                      <Box
                        sx={{ display: "flex", flexDirection: "row", pt: 2 }}
                      >
                        <Button
                          variant="contained"
                          onClick={handleBack}
                          sx={{ mr: 1, background: "#ffba00 " }}
                        >
                          {activeStep !== 0 ? "Back" : "Back to Main"}
                        </Button>
                        <Button
                          color="primary"
                          variant="contained"
                          disabled={activeStep === 0}
                          sx={{ mr: 1, background: "#ffba00 " }}
                          onClick={handleResetDraft}
                        >
                          Reset
                        </Button>
                        <Box sx={{ flex: "1 1 auto" }} />
                        <Button
                          onClick={handleNext}
                          variant="contained"
                          sx={{ mr: 1 }}
                          disabled={!completed[activeStep]}
                        >
                          Next
                        </Button>
                        {activeStep !== steps.length &&
                          (completed[activeStep] ? (
                            <>
                              <Button
                                onClick={() => {
                                    setCompleted((prevCompleted) => ({
                                      ...prevCompleted,
                                      [activeStep]: false,
                                    }));
                                  }}
                                variant="contained"
                                sx={{ mr: 1, background: "#ffba00 " }}
                              >
                                Edit
                              </Button>
                            </>
                          ) : (
                            <Button
                              onClick={handleComplete}
                              variant="contained"
                              sx={{ mr: 1, background: "#ffba00 " }}
                            >
                              {completedSteps() === totalSteps() - 1
                                ? "Submit"
                                : "Save Draft"}
                            </Button>
                          ))}
                      </Box>
                    </React.Fragment>
                  )}
                </div>
              </div>
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
}
