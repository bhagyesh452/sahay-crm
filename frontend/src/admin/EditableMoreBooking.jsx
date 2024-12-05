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

export default function EditableMoreBooking({
  setDataStatus,
  bookingIndex,
  setFormOpen,
  isAdmin,
  companysName,
  companysEmail,
  companyNumber,
  companysInco,
  employeeName,
  employeeEmail,
  setNowToFetch,
}) {
  const [totalServices, setTotalServices] = useState(1);
  const [step4changed, setStep4Changed] = useState(false)
  const [showOtherField, setShowOtherField] = useState(false); // state to track "Others" option

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
    bdmType: "Close-by",
    otherBdmName: '',
    bdmEmail: "",
    bookingDate: "",
    bookingSource: "",
    otherBookingSource: "",
    numberOfServices: totalServices,
    services: [],
    caCase: false,
    caNumber: 0,
    caEmail: "",
    caCommission: 0,
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
  const [secondTempRemarks, setSecondTempRemarks] = useState([]);
  const [thirdTempRemarks, setThirdTempRemarks] = useState([]);
  const [fourthTempRemarks, setFourthTempRemarks] = useState([]);
  const [selectedValues, setSelectedValues] = useState("");
  const [unames, setUnames] = useState([]);
  const defaultISOtypes = {
    serviceID: -1,
    type: "",
    IAFtype1: "",
    IAFtype2: "",
    Nontype: "",
    forOther: "",
  }
  const defaultCompanyIncoIsoType = {
    serviceID: "",
    type: "",
  }

  const defaultOrganizationDscType = {
    serviceID: "",
    type: "",
    validity: ""
  }
  const defaultDirectorDscType = {
    serviceID: "",
    type: "",
    validity: ""
  }
  const [isoType, setIsoType] = useState([]);
  const [companyIncoType, setCompanyIncoType] = useState([])
  const [organizationDscType, setOrganizationDscType] = useState([]);
  const [directorDscType, setDirectorDscType] = useState([]);


  const fetchDataEmp = async () => {
    try {
      const response = await axios.get(`${secretKey}/employee/einfo`);

      // Set the retrieved data in the state
      const tempData = response.data;
      const filteredData = tempData.filter(employee =>
        employee.designation === "Sales Executive" ||
        employee.designation === "Sales Manager")
      console.log("filteredData", filteredData);
      setUnames(filteredData);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const [leadData, setLeadData] = useState(defaultLeadData);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${secretKey}/bookings/redesigned-final-leadData/${companysName}`
      );
      const data = bookingIndex !== 0 ? response.data.moreBookings[bookingIndex - 1] : response.data;
      console.log("Here is the data", data);

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

      let allIsoTypes = [...isoType]; // Initialize with existing isoType state
      let allCompanyIncoTypes = [...companyIncoType];
      let allOrganizationTypes = [...organizationDscType];
      let allDirectorTypes = [...directorDscType];

      const servicestoSend = newLeadData.services.map((service, index) => {
        const tempDefaultType = {
          ...defaultISOtypes,
          serviceID: index
        };
        const tempDefaultCompanyIncoType = {
          ...defaultCompanyIncoIsoType,
          serviceID: index
        };
        const tempDefaultOrganizationDscType = {
          ...defaultOrganizationDscType,
          serviceID: index
        };
        const tempDefaultdirectorDscType = {
          ...defaultDirectorDscType,
          serviceID: index
        };

        if (service.serviceName.includes("ISO Certificate")) {
          const uniqueServiceIDs = new Set(allIsoTypes.map(obj => obj.serviceID)); // Initialize a Set with existing serviceIDs


          service.isoTypeObject.forEach(isoObj => {
            if (isoObj.serviceID !== undefined && !uniqueServiceIDs.has(isoObj.serviceID)) {
              allIsoTypes.push(isoObj);
              uniqueServiceIDs.add(isoObj.serviceID); // Add new serviceID to the Set
            }
          });

          // Ensure tempDefaultType is added only if there is no valid isoTypeObject
          if (!service.isoTypeObject.length || service.isoTypeObject[0].serviceID === undefined) {
            allIsoTypes.push(tempDefaultType);
          }
        } else if (service.serviceName.includes("Company Incorporation")) {
          const uniqueIdFosCompanyInco = new Set(allCompanyIncoTypes.map(obj => obj.serviceID)); // Initialize a Set with existing serviceIDs

          service.companyIncoTypeObject.forEach(isoObj => {
            if (isoObj.serviceID !== undefined && !uniqueIdFosCompanyInco.has(isoObj.serviceID)) {
              allCompanyIncoTypes.push(isoObj);
              uniqueIdFosCompanyInco.add(isoObj.serviceID); // Add new serviceID to the Set
            }
          });

          // Ensure tempDefaultType is added only if there is no valid isoTypeObject
          if (!service.companyIncoTypeObject.length || service.companyIncoTypeObject[0].serviceID === undefined) {
            allCompanyIncoTypes.push(tempDefaultCompanyIncoType);
          }
        } else if (service.serviceName.includes("Organization DSC")) {
          const uniqueIdOrganizationDsc = new Set(allOrganizationTypes.map(obj => obj.serviceID)); // Initialize a Set with existing serviceIDs

          service.organizationTypeObject.forEach(isoObj => {
            if (isoObj.serviceID !== undefined && !uniqueIdOrganizationDsc.has(isoObj.serviceID)) {
              allOrganizationTypes.push(isoObj);
              uniqueIdOrganizationDsc.add(isoObj.serviceID); // Add new serviceID to the Set
            }
          });

          // Ensure tempDefaultType is added only if there is no valid isoTypeObject
          if (!service.organizationTypeObject.length || service.organizationTypeObject[0].serviceID === undefined) {
            allOrganizationTypes.push(tempDefaultOrganizationDscType);
          }
        } else if (service.serviceName.includes("Director DSC")) {
          const uniqueIdDirectorDsc = new Set(allDirectorTypes.map(obj => obj.serviceID)); // Initialize a Set with existing serviceIDs

          service.directorDscTypeObject.forEach(isoObj => {
            if (isoObj.serviceID !== undefined && !uniqueIdDirectorDsc.has(isoObj.serviceID)) {
              allDirectorTypes.push(isoObj);
              uniqueIdDirectorDsc.add(isoObj.serviceID); // Add new serviceID to the Set
            }
          });

          // Ensure tempDefaultType is added only if there is no valid isoTypeObject
          if (!service.directorDscTypeObject.length || service.directorDscTypeObject[0].serviceID === undefined) {
            allDirectorTypes.push(tempDefaultdirectorDscType);
          }
        }
        if (!isNaN(new Date(service.secondPaymentRemarks))) {
          const tempState = {
            serviceID: index,
            value: service.secondPaymentRemarks
          };
          const prevState = secondTempRemarks.find(obj => obj.serviceID === index);
          if (prevState) {
            setSecondTempRemarks(prev =>
              prev.map(obj => (obj.serviceID === index ? tempState : obj))
            );
          } else {
            setSecondTempRemarks(prev => [...prev, tempState]);
          }
        }
        if (!isNaN(new Date(service.thirdPaymentRemarks))) {
          const tempState = {
            serviceID: index,
            value: service.thirdPaymentRemarks
          };
          const prevState = thirdTempRemarks.find(obj => obj.serviceID === index);
          if (prevState) {
            setThirdTempRemarks(prev =>
              prev.map(obj => (obj.serviceID === index ? tempState : obj))
            );
          } else {
            setThirdTempRemarks(prev => [...prev, tempState]);
          }
        }
        if (!isNaN(new Date(service.fourthPaymentRemarks))) {
          const tempState = {
            serviceID: index,
            value: service.fourthPaymentRemarks
          };
          const prevState = fourthTempRemarks.find(obj => obj.serviceID === index);
          if (prevState) {
            setFourthTempRemarks(prev =>
              prev.map(obj => (obj.serviceID === index ? tempState : obj))
            );
          } else {
            setFourthTempRemarks(prev => [...prev, tempState]);
          }
        }
        return {
          ...service,
          serviceName: service.serviceName.includes("ISO Certificate")
            ? "ISO Certificate"
            : service.serviceName.includes("Company Incorporation")
              ? "Company Incorporation"
              : service.serviceName.includes("Organization DSC")
                ? "Organization DSC"
                : service.serviceName.includes("Director DSC")
                  ? "Director DSC"
                  : service.serviceName,
          paymentCount: service.paymentTerms === "Full Advanced" ? 1 : service.thirdPayment === 0 ? 2 : service.fourthPayment === 0 && service.thirdPayment !== 0 ? 3 : 4,
          secondPaymentRemarks: isNaN(new Date(service.secondPaymentRemarks)) ? service.secondPaymentRemarks : "On Particular Date",
          thirdPaymentRemarks: isNaN(new Date(service.thirdPaymentRemarks)) ? service.thirdPaymentRemarks : "On Particular Date",
          fourthPaymentRemarks: isNaN(new Date(service.fourthPaymentRemarks)) ? service.fourthPaymentRemarks : "On Particular Date",
        };
      });

      // Set all isoTypes once after processing all services
      setIsoType(allIsoTypes);
      setCompanyIncoType(allCompanyIncoTypes)
      setOrganizationDscType(allOrganizationTypes);
      setDirectorDscType(allDirectorTypes)
      const latestLeadData = {
        ...newLeadData,
        services: servicestoSend
      };

      setLeadData(latestLeadData);
      setActiveStep(bookingIndex === 0 ? 0 : 1);
      setCompleted({ 0: true, 1: true, 2: true, 3: true });
      setSelectedValues(newLeadData.bookingSource);
      setfetchedService(true);
      setTotalServices(data.services.length !== 0 ? data.services.length : 1);

      if (Step2Status === true && Step3Status === false) {
        setCompleted({ 0: true, 1: true });
        setActiveStep(2);
        setLeadData((prevState) => ({
          ...prevState,
          services: data.services.length !== 0 ? data.services : [defaultService],
          numberOfServices: data.services.length !== 0 ? data.services.length : 1,
        }));
        setTotalServices(data.services.length !== 0 ? data.services.length : 1);
      } else if (Step3Status === true && Step4Status === false) {
        console.log(data.services, "This is services");
        setfetchedService(true);
        setCompleted({ 0: true, 1: true, 2: true });
        setActiveStep(3);
        const servicestoSend = newLeadData.services.map((service, index) => {
          const tempDefaultType = {
            ...defaultISOtypes,
            serviceID: index
          };
          const tempDefaultCompanyIncoType = {
            ...defaultCompanyIncoIsoType,
            serviceID: index
          };
          const tempDefaultOrganizationDscType = {
            ...defaultOrganizationDscType,
            serviceID: index
          };
          const tempDefaultdirectorDscType = {
            ...defaultOrganizationDscType,
            serviceID: index
          };
          if (!isNaN(new Date(service.secondPaymentRemarks))) {
            const tempState = {
              serviceID: index,
              value: service.secondPaymentRemarks
            };
            const prevState = secondTempRemarks.find(obj => obj.serviceID === index);
            if (prevState) {
              setSecondTempRemarks(prev =>
                prev.map(obj => (obj.serviceID === index ? tempState : obj))
              );
            } else {
              setSecondTempRemarks(prev => [...prev, tempState]);
            }
          }
          if (!isNaN(new Date(service.thirdPaymentRemarks))) {
            const tempState = {
              serviceID: index,
              value: service.thirdPaymentRemarks
            };
            const prevState = thirdTempRemarks.find(obj => obj.serviceID === index);
            if (prevState) {
              setThirdTempRemarks(prev =>
                prev.map(obj => (obj.serviceID === index ? tempState : obj))
              );
            } else {
              setThirdTempRemarks(prev => [...prev, tempState]);
            }
          }
          if (!isNaN(new Date(service.fourthPaymentRemarks))) {
            const tempState = {
              serviceID: index,
              value: service.fourthPaymentRemarks
            };
            const prevState = fourthTempRemarks.find(obj => obj.serviceID === index);
            if (prevState) {
              setFourthTempRemarks(prev =>
                prev.map(obj => (obj.serviceID === index ? tempState : obj))
              );
            } else {
              setFourthTempRemarks(prev => [...prev, tempState]);
            }
          }
          return {
            ...service,
            secondPaymentRemarks: isNaN(new Date(service.secondPaymentRemarks)) ? service.secondPaymentRemarks : "On Particular Date",
            thirdPaymentRemarks: isNaN(new Date(service.thirdPaymentRemarks)) ? service.thirdPaymentRemarks : "On Particular Date",
            fourthPaymentRemarks: isNaN(new Date(service.fourthPaymentRemarks)) ? service.fourthPaymentRemarks : "On Particular Date",
          };
        });
        setLeadData((prevState) => ({
          ...prevState,
          services: data.services.length !== 0 ? servicestoSend : [defaultService],
          caCase: data.caCase,
          caCommission: data.caCommission,
          caNumber: data.caNumber,
          caEmail: data.caEmail,
        }));
        setTotalServices(data.services.length !== 0 ? data.services.length : 1);
      } else if (Step4Status === true && Step5Status === false) {
        setCompleted({ 0: true, 1: true, 2: true, 3: true });
        const servicestoSend = newLeadData.services.map((service, index) => {
          const tempDefaultType = {
            ...defaultISOtypes,
            serviceID: index
          };
          const tempDefaultCompanyIncoType = {
            ...defaultCompanyIncoIsoType,
            serviceID: index
          };
          const tempDefaultOrganizationDscType = {
            ...defaultOrganizationDscType,
            serviceID: index
          };
          const tempDefaultdirectorDscType = {
            ...defaultOrganizationDscType,
            serviceID: index
          };
          if (!isNaN(new Date(service.secondPaymentRemarks))) {
            const tempState = {
              serviceID: index,
              value: service.secondPaymentRemarks
            };
            const prevState = secondTempRemarks.find(obj => obj.serviceID === index);
            if (prevState) {
              setSecondTempRemarks(prev =>
                prev.map(obj => (obj.serviceID === index ? tempState : obj))
              );
            } else {
              setSecondTempRemarks(prev => [...prev, tempState]);
            }
          }
          if (!isNaN(new Date(service.thirdPaymentRemarks))) {
            const tempState = {
              serviceID: index,
              value: service.thirdPaymentRemarks
            };
            const prevState = thirdTempRemarks.find(obj => obj.serviceID === index);
            if (prevState) {
              setThirdTempRemarks(prev =>
                prev.map(obj => (obj.serviceID === index ? tempState : obj))
              );
            } else {
              setThirdTempRemarks(prev => [...prev, tempState]);
            }
          }
          if (!isNaN(new Date(service.fourthPaymentRemarks))) {
            const tempState = {
              serviceID: index,
              value: service.fourthPaymentRemarks
            };
            const prevState = fourthTempRemarks.find(obj => obj.serviceID === index);
            if (prevState) {
              setFourthTempRemarks(prev =>
                prev.map(obj => (obj.serviceID === index ? tempState : obj))
              );
            } else {
              setFourthTempRemarks(prev => [...prev, tempState]);
            }
          }
          return {
            ...service,
            paymentCount: service.paymentTerms === "Full Advanced" ? 1 : service.thirdPayment === 0 ? 2 : service.fourthPayment === 0 && service.thirdPayment !== 0 ? 3 : 4,
            secondPaymentRemarks: isNaN(new Date(service.secondPaymentRemarks)) ? service.secondPaymentRemarks : "On Particular Date",
            thirdPaymentRemarks: isNaN(new Date(service.thirdPaymentRemarks)) ? service.thirdPaymentRemarks : "On Particular Date",
            fourthPaymentRemarks: isNaN(new Date(service.fourthPaymentRemarks)) ? service.fourthPaymentRemarks : "On Particular Date",
          };
        });
        setActiveStep(4);
        setLeadData((prevState) => ({
          ...prevState,
          services: servicestoSend,
          totalAmount: data.totalAmount,
          pendingAmount: data.pendingAmount,
          receivedAmount: data.receivedAmount,
          otherDocs: data.otherDocs,
          paymentReceipt: data.paymentReceipt,
          paymentMethod: data.paymentMethod,
          extraNotes: data.extraNotes,
        }));
      } else if (Step5Status === true) {
        setCompleted({ 0: true, 1: true, 2: true, 3: true });
        setSelectedValues(data.bookingSource);

        setActiveStep(4);
        setfetchedService(true);
        setTotalServices(data.services.length !== 0 ? data.services.length : 1);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleTextAreaChange = (e) => {
    e.target.style.height = '1px';
    e.target.style.height = `${e.target.scrollHeight}px`;
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
  console.log(isoType, "Boom");
  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };
  const navigate = useNavigate();

  const handleBack = () => {
    if (activeStep !== 0 && bookingIndex === 0) {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    } else if ((activeStep !== 1 && bookingIndex !== 0)) {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    } else {
      // setDataStatus("Matured");
      // setNowToFetch(true);
      setFormOpen(false);
    }
  };

  const servicesForFunding = [
    "Pitch Deck Development ",
    "Financial Modeling",
    "DPR Development",
    "CMA Report Development",
    "Company Profile Write-Up",
    "Business Profile",
    "Seed Funding Support",
    "Seed Fund Application",
    "Angel Funding Support",
    "VC Funding Support",
    "Crowd Funding Support",
    "I-Create",
    "I-Create Application",
    "Chunauti",
    "Nidhi Seed Support Scheme",
    "Nidhi Prayash Yojna",
    "NAIF",
    "Raftaar",
    "CSR Funding",
    "Stand-Up India",
    "PMEGP",
    "USAID",
    "UP Grant",
    "DBS Grant",
    "DBS Grant Application",
    "MSME Innovation",
    "MSME Hackathon",
    "Gujarat Grant",
    "CGTMSC",
    "Mudra Loan",
    "SIDBI Loan",
    "Incubation Support"
  ];

  function formatDate(inputDate) {
    const date = new Date(inputDate);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Adding 1 to month because it's zero-based
    const day = String(date.getUTCDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  console.log(activeStep);

  const getOrdinal = (number) => {
    const suffixes = ["th", "st", "nd", "rd"];
    const lastDigit = number % 10;
    const suffix = suffixes[lastDigit <= 3 ? lastDigit : 0];
    return `${number}${suffix}`;
  };
  const handleViewPdfReciepts = (paymentreciept, companyName) => {
    const pathname = paymentreciept;
    //console.log(pathname);
    window.open(`${secretKey}/bookings/recieptpdf/${companyName}/${pathname}`, "_blank");
  };

  const handleViewPdOtherDocs = (pdfurl, companyName) => {
    const pathname = pdfurl;
    console.log(pathname);
    window.open(`${secretKey}/bookings/otherpdf/${companyName}/${pathname}`, "_blank");
  };
  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleComplete = async () => {
    if (activeStep === 2) {
      if (!leadData.caCase) {
        Swal.fire("Empty Field!", "Please Enter CA Case", "warning")
        return true;
      }
      if (leadData.caCase === "Yes" && (
        leadData.caCommission === 0 ||
        leadData.caCommission === "" ||
        leadData.caCommission === null ||
        leadData.caCommission === undefined
      )) {
        Swal.fire("Please Enter CA Commission");
        return true;
      }

      setLeadData((prevState) => ({
        ...prevState,
        receivedAmount: parseInt(leadData.services
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
          ))
          .toFixed(2),
        pendingAmount: parseInt(leadData.services
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
          ))
          .toFixed(2),
        totalAmount: parseInt(leadData.services.reduce((total, service) =>
          total + Number(service.totalPaymentWGST)
        ))

      }));

    }
    if (activeStep === 4 && !isAdmin) {
      const generatedTotalAmount = leadData.services.reduce(
        (acc, curr) => acc + parseInt(curr.totalPaymentWOGST),
        0
      );
      const generatedReceivedAmount = leadData.services.reduce((acc, curr) => {
        return curr.paymentTerms === "Full Advanced"
          ? acc + parseInt(curr.totalPaymentWOGST)
          : curr.withGST ? acc + parseInt(curr.firstPayment) / 1.18 : acc + parseInt(curr.firstPayment)
      }, 0);

      const servicestoSend = leadData.services.map((service, index) => {
        // Find ISO details and Company Incorporation details only once per service
        const isoDetails = isoType.find(obj => obj.serviceID === index);
        const companyIncoDetails = companyIncoType.find(obj => obj.serviceID === index);
        const organsizationDetails = organizationDscType.find(obj => obj.serviceID === index);
        const directorDetails = directorDscType.find(obj => obj.serviceID === index);

        return {
          ...service,
          serviceName: service.serviceName === "ISO Certificate"
            ? `ISO Certificate ${isoDetails.type === "IAF" ?
              `IAF ${isoDetails.IAFtype1} ${isoDetails.IAFtype2}` :
              isoDetails.type === "Non IAF" && isoDetails.Nontype === "Others"
                ? `Non IAF ${isoDetails.forOther}`
                : `Non IAF ${isoDetails.Nontype}`
            }`
            : service.serviceName === "Company Incorporation"
              ? `${companyIncoDetails.type} Company Incorporation`
              : service.serviceName === "Organization DSC"
                ? `Organization DSC ${organsizationDetails.type} With ${organsizationDetails.validity} Validity`
                : service.serviceName === "Director DSC"
                  ? `Director DSC ${directorDetails.type} With ${directorDetails.validity} Validity`
                  : service.serviceName,
          secondPaymentRemarks: service.secondPaymentRemarks === "On Particular Date"
            ? secondTempRemarks.find(obj => obj.serviceID === index)?.value || service.secondPaymentRemarks
            : service.secondPaymentRemarks,

          thirdPaymentRemarks: service.thirdPaymentRemarks === "On Particular Date"
            ? thirdTempRemarks.find(obj => obj.serviceID === index)?.value || service.thirdPaymentRemarks
            : service.thirdPaymentRemarks,

          fourthPaymentRemarks: service.fourthPaymentRemarks === "On Particular Date"
            ? fourthTempRemarks.find(obj => obj.serviceID === index)?.value || service.fourthPaymentRemarks
            : service.fourthPaymentRemarks,
          isoTypeObject: isoType,
          companyIncoTypeObject: companyIncoType,
          organizationTypeObject: organizationDscType,
          directorDscTypeObject: directorDscType
        };
      });

      const dataToSend = {
        ...leadData,
        services: servicestoSend,
        requestBy: employeeName,
        bookingSource: selectedValues,
        generatedTotalAmount: generatedTotalAmount,
        generatedReceivedAmount: generatedReceivedAmount,
        receivedAmount: parseInt(leadData.services
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
          ))
          .toFixed(2),
        pendingAmount: parseInt(leadData.services
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
          ))
          .toFixed(2),
        totalAmount: leadData.services.reduce((total, service) =>
          total + parseFloat(service.totalPaymentWGST || 0), 0)

      }
      console.log("dataToSends", dataToSend)
      try {
        const response = await axios.post(`${secretKey}/requests/edit-moreRequest/${companysName}/${bookingIndex}`, dataToSend);
        console.log('Data created:', response.data);
        Swal.fire("Request Sent!", "Request has been successfully sent to the Admin", "success");
        setFormOpen(false)

      } catch (error) {
        console.error('Error creating data:', error);
        Swal.fire("Request Failed!", "Failed to Request Admin", "error");
      }
    } else if (activeStep === 4 && isAdmin) {
      const defaultDate = new Date(1970, 0, 1);

      const servicestoSend = leadData.services.map((service, index) => {
        // Find ISO details and Company Incorporation details only once per service
        const isoDetails = isoType.find(obj => obj.serviceID === index);
        const companyIncoDetails = companyIncoType.find(obj => obj.serviceID === index);
        const organsizationDetails = organizationDscType.find(obj => obj.serviceID === index);
        const directorDetails = directorDscType.find(obj => obj.serviceID === index);

        return {
          ...service,
          serviceName: service.serviceName === "ISO Certificate"
            ? `ISO Certificate ${isoDetails.type === "IAF" ?
              `IAF ${isoDetails.IAFtype1} ${isoDetails.IAFtype2}` :
              isoDetails.type === "Non IAF" && isoDetails.Nontype === "Others"
                ? `Non IAF ${isoDetails.forOther}`
                : `Non IAF ${isoDetails.Nontype}`
            }`
            : service.serviceName === "Company Incorporation"
              ? `${companyIncoDetails.type} Company Incorporation`
              : service.serviceName === "Organization DSC"
                ? `Organization DSC ${organsizationDetails.type} With ${organsizationDetails.validity} Validity`
                : service.serviceName === "Director DSC"
                  ? `Director DSC ${directorDetails.type} With ${directorDetails.validity} Validity`
                  : service.serviceName,
          secondPaymentRemarks: service.secondPaymentRemarks === "On Particular Date"
            ? secondTempRemarks.find(obj => obj.serviceID === index)?.value || service.secondPaymentRemarks
            : service.secondPaymentRemarks,

          thirdPaymentRemarks: service.thirdPaymentRemarks === "On Particular Date"
            ? thirdTempRemarks.find(obj => obj.serviceID === index)?.value || service.thirdPaymentRemarks
            : service.thirdPaymentRemarks,

          fourthPaymentRemarks: service.fourthPaymentRemarks === "On Particular Date"
            ? fourthTempRemarks.find(obj => obj.serviceID === index)?.value || service.fourthPaymentRemarks
            : service.fourthPaymentRemarks,

          isoTypeObject: isoType,
          companyIncoTypeObject: companyIncoType,
          organizationTypeObject: organizationDscType,
          directorDscTypeObject: directorDscType
        };
      });
      const generatedTotalAmount = leadData.services.reduce(
        (acc, curr) => acc + parseInt(curr.totalPaymentWOGST),
        0
      );
      const generatedReceivedAmount = leadData.services.reduce((acc, curr) => {
        return curr.paymentTerms === "Full Advanced"
          ? acc + parseInt(curr.totalPaymentWOGST)
          : curr.withGST ? acc + parseInt(curr.firstPayment) / 1.18 : acc + parseInt(curr.firstPayment)
      }, 0);
      const dataToSend = {
        ...leadData,
        generatedTotalAmount: generatedTotalAmount,
        services: servicestoSend,
        generatedReceivedAmount: generatedReceivedAmount,
        bookingSource: selectedValues,
        step4changed: step4changed,
        receivedAmount: parseInt(leadData.services
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
          ))
          .toFixed(2),
        pendingAmount: parseInt(leadData.services
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
          ))
          .toFixed(2),
        totalAmount: leadData.services.reduce((total, service) =>
          total + parseFloat(service.totalPaymentWGST || 0), 0)
      }

      if (bookingIndex === 0) {
        try {
          const formData = new FormData();
          // Helper function to append only non-empty fields
          const appendNonEmptyFields = (formKey, objectToCheck, defaultObject) => {
            Object.keys(defaultObject).forEach((key) => {
              // Check if the property exists in the object and is non-empty
              if (objectToCheck[key] !== undefined && objectToCheck[key] !== "" && objectToCheck[key] !== null) {
                formData.append(`${formKey}[${key}]`, objectToCheck[key]);
              }
            });
          };
          Object.keys(dataToSend).forEach((key) => {
            if (key === "services") {
              // Handle services array
              dataToSend.services.forEach((service, index) => {
                Object.keys(service).forEach((prop) => {
                  if (
                    prop !== "isoTypeObject" &&
                    prop !== "companyIncoTypeObject" &&
                    prop !== "organizationTypeObject" &&
                    prop !== "directorDscTypeObject"
                  ) {
                    formData.append(`services[${index}][${prop}]`, service[prop]);
                  }
                });
              });

              // Handle isoTypeObject, companyIncoTypeObject, organizationDscType, directorDscType based on defaults
              if (isoType.length !== 0) {
                isoType.forEach((isoObj, isoIndex) => {
                  appendNonEmptyFields(`services[${isoIndex}][isoTypeObject]`, isoObj, defaultISOtypes);
                });
              } else if (companyIncoType.length !== 0) {
                companyIncoType.forEach((incoObj, incoIndex) => {
                  appendNonEmptyFields(`services[${incoIndex}][companyIncoTypeObject]`, incoObj, defaultCompanyIncoIsoType);
                });
              } else if (organizationDscType.length !== 0) {
                organizationDscType.forEach((orgDscObj, orgDscIndex) => {
                  appendNonEmptyFields(`services[${orgDscIndex}][organizationTypeObject]`, orgDscObj, defaultOrganizationDscType);
                });
              } else if (directorDscType.length !== 0) {
                directorDscType.forEach((directorDscObj, directorDscIndex) => {
                  appendNonEmptyFields(`services[${directorDscIndex}][directorDscTypeObject]`, directorDscObj, defaultDirectorDscType);
                });
              }
            } else if (key === "otherDocs") {
              for (let i = 0; i < leadData.otherDocs.length; i++) {
                formData.append("otherDocs", leadData.otherDocs[i]);
              }
            } else if (key === "paymentReceipt") {
              for (let i = 0; i < leadData.paymentReceipt.length; i++) {
                formData.append("paymentReceipt", leadData.paymentReceipt[i]);
              }
            } else {
              formData.append(key, dataToSend[key]);
            }
          });


          // console.log(activeStep, dataToSend);

          console.log("dataToSend", dataToSend)
          console.log("formData", formData)
          const response = await axios.post(`${secretKey}/bookings/update-redesigned-final-form/${companysName}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          Swal.fire({ title: "Data Updated", icon: "success" }) // Display success message
          setFormOpen(false)
          setNowToFetch(true)
        } catch (error) {
          console.log("Error updating data", error);
          Swal.fire({ title: "Error Updating Data", icon: "error" })// Display error message
        }
      } else {
        const formData = new FormData();
        // Helper function to append only non-empty fields
        const appendNonEmptyFields = (formKey, objectToCheck, defaultObject) => {
          Object.keys(defaultObject).forEach((key) => {
            // Check if the property exists in the object and is non-empty
            if (objectToCheck[key] !== undefined && objectToCheck[key] !== "" && objectToCheck[key] !== null) {
              formData.append(`${formKey}[${key}]`, objectToCheck[key]);
            }
          });
        };

        Object.keys(dataToSend).forEach((key) => {
          if (key === "services") {
            // Handle services array
            dataToSend.services.forEach((service, index) => {
              Object.keys(service).forEach((prop) => {
                if (
                  prop !== "isoTypeObject" &&
                  prop !== "companyIncoTypeObject" &&
                  prop !== "organizationTypeObject" &&
                  prop !== "directorDscTypeObject"
                ) {
                  formData.append(`services[${index}][${prop}]`, service[prop]);
                }
              });
            });

            // Handle isoTypeObject, companyIncoTypeObject, organizationDscType, directorDscType based on defaults
            if (isoType.length !== 0) {
              isoType.forEach((isoObj, isoIndex) => {
                appendNonEmptyFields(`services[${isoIndex}][isoTypeObject]`, isoObj, defaultISOtypes);
              });
            } else if (companyIncoType.length !== 0) {
              companyIncoType.forEach((incoObj, incoIndex) => {
                appendNonEmptyFields(`services[${incoIndex}][companyIncoTypeObject]`, incoObj, defaultCompanyIncoIsoType);
              });
            } else if (organizationDscType.length !== 0) {
              organizationDscType.forEach((orgDscObj, orgDscIndex) => {
                appendNonEmptyFields(`services[${orgDscIndex}][organizationTypeObject]`, orgDscObj, defaultOrganizationDscType);
              });
            } else if (directorDscType.length !== 0) {
              directorDscType.forEach((directorDscObj, directorDscIndex) => {
                appendNonEmptyFields(`services[${directorDscIndex}][directorDscTypeObject]`, directorDscObj, defaultDirectorDscType);
              });
            }
          } else if (key === "otherDocs") {
            for (let i = 0; i < leadData.otherDocs.length; i++) {
              formData.append("otherDocs", leadData.otherDocs[i]);
            }
          } else if (key === "paymentReceipt") {
            for (let i = 0; i < leadData.paymentReceipt.length; i++) {
              formData.append("paymentReceipt", leadData.paymentReceipt[i]);
            }
          } else {
            formData.append(key, dataToSend[key]);
          }
        });


        try {
          const response = await axios.put(`${secretKey}/bookings/update-more-booking/${companysName}/${bookingIndex}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          setFormOpen(false)
          setNowToFetch(true)
          Swal.fire({ title: "Data Updated", icon: "success" }) // Display success message
        } catch (error) {
          console.log("Error updating data", error);
          Swal.fire({ title: "Error Updating Data", icon: "error" })// Display error message
        }
      }
    }
    else {
      setCompleted((prevCompleted) => ({
        ...prevCompleted,
        [activeStep]: true,
      }));
      handleNext();
    }


  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };


  const handleResetDraft = async () => {
    try {
      const response = await fetch(
        `${secretKey}/bookings/redesigned-delete-model/${companysName}`,
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
        fetchData();
      } else {
        console.error("Error resetting draft:", response.statusText);
      }
    } catch (error) {
      console.error("Error resetting draft:", error.message);
    }
  };

  console.log("isoType", isoType)

  const renderServices = () => {
    const services = [];

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
              <div className="selectservices-label-selct d-flex">
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
                    if (isoType.length !== 0 && e.target.value !== "ISO Certificate") {
                      setIsoType([]);
                    } else if (companyIncoType.length !== 0 && e.target.value !== "Company Incorporation") {
                      setCompanyIncoType([]);
                    } else if (organizationDscType.length !== 0 && e.target.value !== "Organization DSC") {
                      setOrganizationDscType([]);
                    } else if (directorDscType.length !== 0 && e.target.value !== "Director DSC") {
                      setDirectorDscType([]);
                    }
                    if (e.target.value === "ISO Certificate") {
                      if (!isoType.some(obj => obj.serviceID === i)) {
                        const defaultArray = isoType;
                        defaultArray.push({
                          ...defaultISOtypes,
                          serviceID: i
                        });
                        setIsoType(defaultArray)
                      }
                    } else if (e.target.value === "Company Incorporation") {
                      if (!companyIncoType.some(obj => obj.serviceID === i)) {
                        const defaultArray = companyIncoType;
                        defaultArray.push({
                          ...defaultCompanyIncoIsoType,
                          serviceID: i
                        });
                        setCompanyIncoType(defaultArray)
                      }
                    } else if (e.target.value === "Organization DSC") {
                      if (!organizationDscType.some(obj => obj.serviceID === i)) {
                        const defaultArray = organizationDscType;
                        defaultArray.push({
                          ...defaultOrganizationDscType,
                          serviceID: i
                        });
                        setOrganizationDscType(defaultArray)
                      }
                    } else if (e.target.value === "Director DSC") {
                      if (!organizationDscType.some(obj => obj.serviceID === i)) {
                        const defaultArray = directorDscType;
                        defaultArray.push({
                          ...defaultDirectorDscType,
                          serviceID: i
                        });
                        setDirectorDscType(defaultArray)
                      }
                    }

                  }}
                  disabled={completed[activeStep] === true}
                >
                  <option value="" disabled selected>
                    Select Service Name
                  </option>
                  {options.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {/* IAF and Non IAF */}
                {leadData.services[i].serviceName.includes("ISO Certificate") && <> <select
                  className="form-select mt-1 ml-1" disabled={completed[activeStep] === true}
                  value={isoType && isoType.find(obj => obj.serviceID === i).type}
                  onChange={(e) => {
                    const currentObject = isoType.find(obj => obj.serviceID === i);

                    if (currentObject) {
                      const remainingObject = isoType.filter(obj => obj.serviceID !== i);
                      const newCurrentObject = {
                        ...currentObject,
                        type: e.target.value
                      }
                      remainingObject.push(newCurrentObject);
                      setIsoType(remainingObject);
                    }
                  }}>
                  <option value="" selected>Select IAF Body</option>
                  <option value="IAF">IAF</option>
                  <option value="Non IAF">Non IAF</option>
                </select>
                  {/* IAF ISO LIST */}
                  {isoType.find(obj => obj.serviceID === i).type === "IAF" ? <><select disabled={completed[activeStep] === true} value={isoType.find(obj => obj.serviceID === i).IAFtype1} className="form-select mt-1 ml-1" onChange={(e) => {
                    const currentObject = isoType.find(obj => obj.serviceID === i);

                    if (currentObject) {
                      const remainingObject = isoType.filter(obj => obj.serviceID !== i);
                      const newCurrentObject = {
                        ...currentObject,
                        IAFtype1: e.target.value
                      }
                      remainingObject.push(newCurrentObject);
                      setIsoType(remainingObject);
                    }
                  }}>
                    <option value="" selected disabled>Select ISO Type</option>
                    <option value="9001">9001</option>
                    <option value="14001">14001</option>
                    <option value="45001">45001</option>
                    <option value="22000">22000</option>
                    <option value="27001">27001</option>
                    <option value="13485">13485</option>
                    <option value="20000-1">20000-1</option>
                    <option value="50001">50001</option>
                    <option value="17025-2017">17025-2017</option>

                  </select>
                    {/* IAF ISO TYPES */}
                    <select disabled={completed[activeStep] === true} className="form-select mt-1 ml-1" value={isoType.find(obj => obj.serviceID === i).IAFtype2} onChange={(e) => {
                      const currentObject = isoType.find(obj => obj.serviceID === i);

                      if (currentObject) {
                        const remainingObject = isoType.filter(obj => obj.serviceID !== i);
                        const newCurrentObject = {
                          ...currentObject,
                          IAFtype2: e.target.value
                        }
                        remainingObject.push(newCurrentObject);
                        setIsoType(remainingObject);
                      }
                    }}>
                      <option value="" selected disabled>Select ISO VALIDITY</option>
                      <option value="1 YEAR VALIDITY">1 YEAR VALIDITY</option>
                      <option value="3 YEAR VALIDITY">3 YEAR VALIDITY</option>
                      <option value="3 YEAR VALIDITY (1 YEAR PAID SURVEILLANCE)">3 YEAR VALIDITY (1 YEAR PAID SURVEILLANCE)</option>
                    </select></> : <>
                    <select
                      className="form-select mt-1 ml-1"
                      disabled={completed[activeStep] === true}
                      value={isoType.find(obj => obj.serviceID === i).Nontype}
                      onChange={(e) => {
                        // Check if "Others" is selected and update state
                        if (e.target.value === 'Others') {
                          setShowOtherField(true);
                        } else {
                          setShowOtherField(false);
                        }
                        const currentObject = isoType.find(obj => obj.serviceID === i);
                        if (currentObject) {
                          const remainingObject = isoType.filter(obj => obj.serviceID !== i);
                          const newCurrentObject = {
                            ...currentObject,
                            Nontype: e.target.value
                          }
                          remainingObject.push(newCurrentObject);
                          setIsoType(remainingObject);
                        }
                      }}>
                      <option value="" selected disabled>Select ISO Type</option>
                      <option value="9001">9001</option>
                      <option value="14001">14001</option>
                      <option value="45001">45001</option>
                      <option value="22000">22000</option>
                      <option value="27001">27001</option>
                      <option value="13485">13485</option>
                      <option value="20000-1">20000-1</option>
                      <option value="50001">50001</option>
                      <option value="21001">21001</option>
                      <option value="GMP">GMP</option>
                      <option value="GAP">GAP</option>
                      <option value="FDA">FDA</option>
                      <option value="HALAL">HALAL</option>
                      <option value="ORGANIC">ORGANIC</option>
                      <option value="FSSC">FSSC</option>
                      <option value="FSC">FSC</option>
                      <option value="BIFMA">BIFMA</option>
                      <option value="CE">CE</option>
                      <option value="HACCP">HACCP</option>
                      <option value="GHP">GHP</option>
                      <option value="AIOTA">AIOTA</option>
                      <option value="GREEN GUARD">GREEN GUARD</option>
                      <option value="SEDEX">SEDEX</option>
                      <option value="KOSHER">KOSHER</option>
                      <option value="WHO-GMP">WHO-GMP</option>
                      <option value="BRC">BRC</option>
                      <option value="VEGAN">VEGAN</option>
                      <option value="SA 8000">SA 8000</option>
                      <option value="CCC">CCC</option>
                      <option value="CMMI LEVEL 3">CMMI LEVEL 3</option>
                      <option value="CMMI LEVEL 5">CMMI LEVEL 5</option>
                      <option value="GO GREEN">GO GREEN</option>
                      <option value="PCMM 5">PCMM 5</option>
                      <option value="RIOS">RIOS</option>
                      <option value="ROHS">ROHS</option>
                      <option value="IEC 17020">IEC 17020</option>
                      <option value="GFSI">GFSI</option>
                      <option value="GMO">GMO</option>
                      <option value="17025-2017">17025-2017</option>
                      <option value="Others">Others</option>
                    </select>
                    {/* Conditionally render the textarea */}
                    {showOtherField && (
                      <input
                        type="text"
                        className="form-control mt-1 ml-1"
                        value={isoType.find(obj => obj.serviceID === i).forOther}
                        onChange={(e) => {
                          const currentObject = isoType.find(obj => obj.serviceID === i);
                          if (currentObject) {
                            const remainingObject = isoType.filter(obj => obj.serviceID !== i);
                            const newCurrentObject = {
                              ...currentObject,
                              forOther: e.target.value.toUpperCase() // Convert to uppercase
                            }
                            remainingObject.push(newCurrentObject);
                            setIsoType(remainingObject);
                          }
                        }}
                        placeholder="Please specify the ISO Type"
                      />
                    )}
                  </>
                  }
                  {/* NON-IAF ISO TYPES */}
                </>}
                {/* Company Incorporation  */}
                {leadData.services[i].serviceName.includes("Company Incorporation") && <>
                  <select className="form-select mt-1 ml-1"
                    value={companyIncoType.find(obj => obj.serviceID === i).type}
                    onChange={(e) => {
                      const currentObject = companyIncoType.find(obj => obj.serviceID === i);

                      if (currentObject) {
                        const remainingObject = companyIncoType.filter(obj => obj.serviceID !== i);
                        const newCurrentObject = {
                          ...currentObject,
                          type: e.target.value
                        }
                        remainingObject.push(newCurrentObject);
                        setCompanyIncoType(remainingObject);
                      }
                    }}>
                    <option value="" selected disabled>Select Company Type</option>
                    <option value="Private Limited">Private Limited</option>
                    <option value="OPC Private Limited">OPC Private Limited</option>
                    <option value="LLP">LLP</option>
                  </select>
                </>}
                {/* Organisation Dsc  */}
                {leadData.services[i].serviceName.includes("Organization DSC") && <>
                  <select className="form-select mt-1 ml-1"
                    value={organizationDscType.find(obj => obj.serviceID === i).type}
                    onChange={(e) => {
                      const currentObject = organizationDscType.find(obj => obj.serviceID === i);
                      if (currentObject) {
                        const remainingObject = organizationDscType.filter(obj => obj.serviceID !== i);
                        const newCurrentObject = {
                          ...currentObject,
                          type: e.target.value
                        }
                        remainingObject.push(newCurrentObject);
                        setOrganizationDscType(remainingObject);
                      }
                    }}>
                    <option value="" selected disabled>Select DSC Type</option>
                    <option value="Only Signature">Only Signature</option>
                    <option value="Only Encryption">Only Encryption</option>
                    <option value="Combo">Combo</option>
                  </select>
                  <select className="form-select mt-1 ml-1"
                    value={organizationDscType.find(obj => obj.serviceID === i).validity}
                    onChange={(e) => {
                      const currentObject = organizationDscType.find(obj => obj.serviceID === i);
                      if (currentObject) {
                        const remainingObject = organizationDscType.filter(obj => obj.serviceID !== i);
                        const newCurrentObject = {
                          ...currentObject,
                          validity: e.target.value
                        }
                        remainingObject.push(newCurrentObject);
                        setOrganizationDscType(remainingObject);
                      }
                    }}>
                    <option value="" selected disabled>Select DSC Validity</option>
                    <option value="1 Year">1 Year</option>
                    <option value="2 Year">2 Year</option>
                    <option value="3 Year">3 Year</option>
                  </select>
                </>}
                {/* Director Dsc  */}
                {leadData.services[i].serviceName.includes("Director DSC") && <>
                  <select className="form-select mt-1 ml-1"
                    value={directorDscType.find(obj => obj.serviceID === i).type}
                    onChange={(e) => {
                      const currentObject = directorDscType.find(obj => obj.serviceID === i);
                      if (currentObject) {
                        const remainingObject = directorDscType.filter(obj => obj.serviceID !== i);
                        const newCurrentObject = {
                          ...currentObject,
                          type: e.target.value
                        }
                        remainingObject.push(newCurrentObject);
                        setDirectorDscType(remainingObject);
                      }
                    }}>
                    <option value="" selected disabled>Select DSC Type</option>
                    <option value="Only Signature">Only Signature</option>
                    <option value="Only Encryption">Only Encryption</option>
                    <option value="Combo">Combo</option>
                  </select>
                  <select className="form-select mt-1 ml-1"
                    value={directorDscType.find(obj => obj.serviceID === i).validity}
                    onChange={(e) => {
                      const currentObject = directorDscType.find(obj => obj.serviceID === i);
                      if (currentObject) {
                        const remainingObject = directorDscType.filter(obj => obj.serviceID !== i);
                        const newCurrentObject = {
                          ...currentObject,
                          validity: e.target.value
                        }
                        remainingObject.push(newCurrentObject);
                        setDirectorDscType(remainingObject);
                      }
                    }}>
                    <option value="" selected disabled>Select DSC Validity</option>
                    <option value="1 Year">1 Year</option>
                    <option value="2 Year">2 Year</option>
                    <option value="3 Year">3 Year</option>
                  </select>
                </>}
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
                      onWheel={(e) => {
                        document.activeElement.blur();
                      }}
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
                              firstPayment: 0,
                              secondPayment: 0,
                              thirdPayment: 0,
                              fourthPayment: 0,
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
                        <label class="form-label">First Payment</label>
                        <div class="input-group mb-2">
                          <input
                            type="number"
                            onWheel={(e) => {

                              document.activeElement.blur();

                            }}
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
                          <label class="form-label">Second Payment</label>
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
                              <option value="AFTER APPLICATION">
                                AFTER APPLICATION
                              </option>
                              <option value="AFTER CERTIFICATE">
                                AFTER CERTIFICATE
                              </option>
                              {["Income Tax Exemption", "Income Tax Exemption Application"].includes(
                                leadData.services[i].serviceName
                              ) ? (
                                <option value="SUCCESSFULLY SUBMIT">
                                  SUCCESSFULLY SUBMIT
                                </option>
                              ) : (
                                <option
                                  value="AFTER APPROVAL"
                                  disabled={servicesForFunding.some(
                                    (s) => s === leadData.services[i].serviceName
                                  )}
                                >
                                  AFTER APPROVAL
                                </option>
                              )}
                              <option value="AFTER SERVICE COMPLETION">
                                AFTER SERVICE COMPLETION
                              </option>
                              <option value=" AT THE TIME OF APPLICATION">
                                AT THE TIME OF APPLICATION
                              </option>
                              <option value="AFTER DOCUMENT">
                                AFTER DOCUMENT
                              </option>
                              <option value="BEFORE APPLICATION">
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
                                  style={{ textTransform: "uppercase" }}
                                  value={secondTempRemarks.find(obj => obj.serviceID === i)?.value || ''}
                                  onChange={(e) => {
                                    const tempState = {
                                      serviceID: i,
                                      value: e.target.value
                                    };
                                    const prevState = secondTempRemarks.find(obj => obj.serviceID === i);
                                    if (prevState) {
                                      setSecondTempRemarks(prev =>
                                        prev.map(obj => (obj.serviceID === i ? tempState : obj))
                                      );
                                    } else {
                                      setSecondTempRemarks(prev => [...prev, tempState]);
                                    }
                                  }}
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
                          <label class="form-label">Third Payment</label>
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
                              <option value="AFTER APPLICATION">
                                AFTER APPLICATION
                              </option>
                              <option value="AFTER CERTIFICATE">
                                AFTER CERTIFICATE
                              </option>
                              {["Income Tax Exemption", "Income Tax Exemption Application"].includes(
                                leadData.services[i].serviceName
                              ) ? (
                                <option value="SUCCESSFULLY SUBMIT">
                                  SUCCESSFULLY SUBMIT
                                </option>
                              ) : (
                                <option
                                  value="AFTER APPROVAL"
                                  disabled={servicesForFunding.some(
                                    (s) => s === leadData.services[i].serviceName
                                  )}
                                >
                                  AFTER APPROVAL
                                </option>
                              )}
                              <option value="AFTER SERVICE COMPLETION">
                                AFTER SERVICE COMPLETION
                              </option>
                              <option value=" AT THE TIME OF APPLICATION">
                                AT THE TIME OF APPLICATION
                              </option>
                              <option value="AFTER DOCUMENT">
                                AFTER DOCUMENT
                              </option>
                              <option value="BEFORE APPLICATION">
                                BEFORE APPLICATION
                              </option>
                              <option value="On Particular Date">
                                ON PARTICULAR DATE
                              </option>
                            </select>
                          </div>
                          {leadData.services[i].thirdPaymentRemarks ===
                            "On Particular Date" && (
                              <div className="mt-2">
                                <input
                                  value={thirdTempRemarks.find(obj => obj.serviceID === i)?.value || ''}
                                  onChange={(e) => {
                                    const tempState = {
                                      serviceID: i,
                                      value: e.target.value
                                    };
                                    const prevState = thirdTempRemarks.find(obj => obj.serviceID === i);
                                    if (prevState) {
                                      setThirdTempRemarks(prev =>
                                        prev.map(obj => (obj.serviceID === i ? tempState : obj))
                                      );
                                    } else {
                                      setThirdTempRemarks(prev => [...prev, tempState]);
                                    }
                                  }}
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
                          <label class="form-label">Fourth Payment</label>
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
                              <option value="AFTER APPLICATION">
                                AFTER APPLICATION
                              </option>
                              <option value="AFTER CERTIFICATE">
                                AFTER CERTIFICATE
                              </option>
                              {["Income Tax Exemption", "Income Tax Exemption Application"].includes(
                                leadData.services[i].serviceName
                              ) ? (
                                <option value="SUCCESSFULLY SUBMIT">
                                  SUCCESSFULLY SUBMIT
                                </option>
                              ) : (
                                <option
                                  value="AFTER APPROVAL"
                                  disabled={servicesForFunding.some(
                                    (s) => s === leadData.services[i].serviceName
                                  )}
                                >
                                  AFTER APPROVAL
                                </option>
                              )}
                              <option value="AFTER SERVICE COMPLETION">
                                AFTER SERVICE COMPLETION
                              </option>
                              <option value=" AT THE TIME OF APPLICATION">
                                AT THE TIME OF APPLICATION
                              </option>
                              <option value="AFTER DOCUMENT">
                                AFTER DOCUMENT
                              </option>
                              <option value="BEFORE APPLICATION">
                                BEFORE APPLICATION
                              </option>
                              <option value="On Particular Date">
                                ON PARTICULAR DATE
                              </option>
                            </select>
                          </div>
                          {leadData.services[i].fourthPaymentRemarks ===
                            "On Particular Date" && (
                              <div className="mt-2">
                                <input
                                  value={fourthTempRemarks.find(obj => obj.serviceID === i)?.value || ''}
                                  onChange={(e) => {
                                    const tempState = {
                                      serviceID: i,
                                      value: e.target.value
                                    };
                                    const prevState = fourthTempRemarks.find(obj => obj.serviceID === i);
                                    if (prevState) {
                                      setFourthTempRemarks(prev =>
                                        prev.map(obj => (obj.serviceID === i ? tempState : obj))
                                      );
                                    } else {
                                      setFourthTempRemarks(prev => [...prev, tempState]);
                                    }
                                  }}
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
                    handleTextAreaChange(e)

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

  const handleInputChange = (value, id) => {
    if (id === "bdmName") {
      const foundUser = unames.find((item) => item.ename === value);
      setLeadData({
        ...leadData,
        bdmName: value,
        bdmEmail: foundUser ? foundUser.email : "", // Check if foundUser exists before accessing email
      });
    } else {
      setLeadData({ ...leadData, [id]: value });
    }
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
  const formatInputDate = (dateString) => {
    const parsedDate = new Date(dateString);
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0"); // Adding 1 to month index since it starts from 0
    const day = String(parsedDate.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  };

  const functionShowSizeLimit = (e) => {
    const file = e.target.files[0];
    const maxSizeMB = 24;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (Math.round(file.size / (1024 * 1024)) > maxSizeMB) {
      Swal.fire('Size limit exceeded!', 'Please Upload file less than 24MB', 'warning');
      return false;
    } else {
      return true;
    }
  }
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
                      disabled={index === 0 && bookingIndex !== 0}

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
                        All steps completed - you&apos;re finished
                      </Typography>
                      <Box
                        sx={{ display: "flex", flexDirection: "row", pt: 2 }}
                      >
                        <Box sx={{ flex: "1 1 auto" }} />
                        <Button onClick={handleReset}>Reset</Button>
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
                                        value={leadData["Company Name"]}
                                        onChange={(e) => {
                                          handleInputChange(
                                            e.target.value,
                                            "Company Name"
                                          );
                                        }}
                                        disabled
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
                                        disabled={
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
                                      <input
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
                                        disabled={completed[activeStep] === true}
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
                                      <input
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
                                        disabled={
                                          completed[activeStep] === true
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="col-sm-4">
                                    <div className="form-group mt-2 mb-2">
                                      <label for="pan">
                                        Company's PAN/GST Number:{" "}
                                        {
                                          <span style={{ color: "red" }}>
                                            *
                                          </span>
                                        }
                                      </label>
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
                                        disabled={
                                          completed[activeStep] === true
                                        }
                                        required
                                      />
                                    </div>
                                  </div>
                                  {/* <div className="col-sm-4">
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
                                        disabled={
                                          completed[activeStep] === true
                                        }
                                      />
                                    </div>
                                  </div> */}
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
                                      <label for="bdeName">
                                        BDE Name:
                                        {
                                          <span style={{ color: "red" }}>
                                            *
                                          </span>
                                        }
                                      </label>
                                      <input
                                        type="text"
                                        className="form-control mt-1"
                                        placeholder="Enter BDE Name"
                                        id="bdeName"
                                        value={leadData.bdeName}
                                        onChange={(e) => {
                                          handleInputChange(
                                            e.target.value,
                                            "bdeName"
                                          );
                                        }}
                                        disabled
                                      />
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
                                        disabled
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
                                  {leadData.bdmName === "other" &&
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


                                    </>}


                                  {leadData.bdmName !== "other" && <div className="col-sm-3">
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
                                        disabled={leadData.bdmEmail}
                                      />
                                    </div>
                                  </div>}
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
                                        value={formatInputDate(leadData.bookingDate)}
                                        onChange={(e) => {
                                          handleInputChange(
                                            e.target.value,
                                            "bookingDate"
                                          );
                                        }}
                                        disabled={
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
                                      {[...Array(11 - 1).keys()].map((year) => (
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
                                          onWheel={(e) => {

                                            document.activeElement.blur();

                                          }}
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
                                          type="number"
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
                                          onWheel={(e) => {

                                            document.activeElement.blur();

                                          }}
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
                                          onWheel={(e) => {

                                            document.activeElement.blur();

                                          }}
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
                                          onWheel={(e) => {

                                            document.activeElement.blur();

                                          }}
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

                                          setStep4Changed(true)
                                          if (functionShowSizeLimit(e)) {
                                            setLeadData((prevLeadData) => ({
                                              ...prevLeadData,
                                              paymentReceipt: [
                                                ...(prevLeadData.paymentReceipt ||
                                                  []),
                                                ...e.target.files,
                                              ],
                                            }));
                                          }
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
                                        {/* <option value="SRK Seedfund(Non GST)/IDFC first Bank">
                                          SRK Seedfund(Non GST)/IDFC first Bank
                                        </option> */}
                                        <option value="STARTUP SAHAY COMPANY / SOLUTION">
                                          STARTUP SAHAY COMPANY / SOLUTION
                                        </option>
                                        <option value="Razorpay">
                                          Razorpay
                                        </option>
                                        <option value="PayU">PayU</option>   <option value="Cashfree">Cashfree</option>
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
                                          handleTextAreaChange(e)
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
                                          setStep4Changed(true)
                                          if (functionShowSizeLimit(e)) {
                                            setLeadData((prevLeadData) => ({
                                              ...prevLeadData,
                                              otherDocs: [
                                                ...(prevLeadData.otherDocs || []),
                                                ...e.target.files,
                                              ],
                                            }));
                                          }
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
                                                    onClick={(e) => {
                                                      e.preventDefault()
                                                      handleRemoveOtherFile(
                                                        index
                                                      )
                                                    }
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
                                        <b>Company name</b>
                                      </div>
                                    </div>
                                    <div className="col-sm-9 p-0">
                                      <div className="form-label-data">
                                        {companysName}
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
                                        {companysEmail}
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
                                        {companyNumber}
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
                                        {formatDate(companysInco)}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row m-0">
                                    <div className="col-sm-3 p-0">
                                      <div className="form-label-name">
                                        <b>Company's PAN/GST Number:</b>
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
                                  {/* <div className="row m-0">
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
                                  </div> */}
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
                                        {selectedValues}
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
                                        {<div className="col-sm-9 p-0">
                                          <div className="form-label-data">
                                            {obj.serviceName === "ISO Certificate" ? (
                                              (() => {
                                                const isoDetails = isoType.find(obj => obj.serviceID === index);
                                                return `ISO Certificate ${isoDetails.type} ${isoDetails.type === "IAF" ?
                                                  `${isoDetails.IAFtype1} ${isoDetails.IAFtype2}`
                                                  :
                                                  isoDetails.type === "Non IAF" && isoDetails.Nontype === "Others"
                                                    ? `${isoDetails.forOther}`
                                                    : `${isoDetails.Nontype}`}`;
                                              })()
                                            ) : obj.serviceName === "Company Incorporation" ? (
                                              (() => {
                                                const companyIncoDetails = companyIncoType.find(obj => obj.serviceID === index);
                                                return `${companyIncoDetails.type} Company Incorporation`;
                                              })()
                                            ) : obj.serviceName === "Organization DSC" ? (
                                              (() => {
                                                const organizationDetails = organizationDscType.find(obj => obj.serviceID === index);
                                                return `Organization DSC ${organizationDetails.type} With ${organizationDetails.validity} Validity`;
                                              })()
                                            ) : obj.serviceName === "Director DSC" ? (
                                              (() => {
                                                const directorDetails = directorDscType.find(obj => obj.serviceID === index);
                                                return `Director DSC ${directorDetails.type} With ${directorDetails.validity} Validity`;
                                              })()
                                            ) : (
                                              obj.serviceName
                                            )}
                                          </div>
                                        </div>}
                                      </div>
                                      {/* <!-- Optional --> */}
                                      {obj.serviceName === "Start-Up India Certificate" && (
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
                                            ₹ {obj.totalPaymentWGST !== undefined
                                              ? parseInt(
                                                obj.totalPaymentWGST
                                              ).toLocaleString()
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
                                                ₹ {parseInt(
                                                  obj.firstPayment
                                                ).toLocaleString()}
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
                                              <div className="form-label-data" style={{ textTransform: "uppercase" }}>
                                                ₹{" "}{parseInt(
                                                  obj.secondPayment
                                                ).toLocaleString()}{" "}
                                                -{" "}
                                                {obj.secondPaymentRemarks !== "On Particular Date"
                                                  ? obj.secondPaymentRemarks
                                                  : `Payment On ${secondTempRemarks.find(obj => obj.serviceID === index).value}`}
                                              </div>
                                            </div>
                                          </div>
                                          {obj.thirdPayment !== 0 && (
                                            <div className="row m-0">
                                              <div className="col-sm-3 p-0">
                                                <div className="form-label-name" style={{ textTransform: "uppercase" }}>
                                                  <b>Third Payment</b>
                                                </div>
                                              </div>
                                              <div className="col-sm-9 p-0">
                                                <div className="form-label-data" style={{ textTransform: "uppercase" }}>
                                                  {parseInt(
                                                    obj.thirdPayment
                                                  ).toLocaleString()}{" "}
                                                  -{" "}
                                                  {obj.thirdPaymentRemarks !== "On Particular Date"
                                                    ? obj.thirdPaymentRemarks
                                                    : `Payment On ${thirdTempRemarks.find(obj => obj.serviceID === index).value}`}
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
                                                <div className="form-label-data" style={{ textTransform: "uppercase" }}>
                                                  ₹{" "}{parseInt(
                                                    obj.fourthPayment
                                                  ).toLocaleString()}{" "}
                                                  -{" "}
                                                  {obj.fourthPaymentRemarks !== "On Particular Date"
                                                    ? obj.fourthPaymentRemarks
                                                    : `Payment On ${fourthTempRemarks.find(obj => obj.serviceID === index).value}`}
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                        </>
                                      )}
                                      {/* <div className="row m-0">
                                        <div className="col-sm-3 p-0">
                                          <div className="form-label-name">
                                            <b>CA Case</b>
                                          </div>
                                        </div>
                                        <div className="col-sm-9 p-0">
                                          <div className="form-label-data">
                                            {obj.caCase
                                            }
                                          </div>
                                        </div>
                                      </div>
                                      {obj.caCase && <>
                                        <div className="row m-0">
                                          <div className="col-sm-3 p-0">
                                            <div className="form-label-name">
                                              <b>CA Number</b>
                                            </div>
                                          </div>
                                          <div className="col-sm-9 p-0">
                                            <div className="form-label-data">
                                              {obj.caNumber
                                              }
                                            </div>
                                          </div>
                                        </div>
                                        <div className="row m-0">
                                          <div className="col-sm-3 p-0">
                                            <div className="form-label-name">
                                              <b>CA Email</b>
                                            </div>
                                          </div>
                                          <div className="col-sm-9 p-0">
                                            <div className="form-label-data">
                                              {obj.caEmail
                                              }
                                            </div>
                                          </div>
                                        </div>
                                        <div className="row m-0">
                                          <div className="col-sm-3 p-0">
                                            <div className="form-label-name">
                                              <b>CA Commission</b>
                                            </div>
                                          </div>
                                          <div className="col-sm-9 p-0">
                                            <div className="form-label-data">
                                              {obj.caCommission
                                              }
                                            </div>
                                          </div>
                                        </div>
                                      </>} */}
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
                                  <div className="row m-0">
                                    <div className="col-sm-3 p-0">
                                      <div className="form-label-name">
                                        <b>CA Case</b>
                                      </div>
                                    </div>
                                    <div className="col-sm-9 p-0">
                                      <div className="form-label-data">
                                        {leadData.caCase
                                        }
                                      </div>
                                    </div>
                                  </div>
                                  {leadData.caCase && <>
                                    <div className="row m-0">
                                      <div className="col-sm-3 p-0">
                                        <div className="form-label-name">
                                          <b>CA Number</b>
                                        </div>
                                      </div>
                                      <div className="col-sm-9 p-0">
                                        <div className="form-label-data">
                                          {leadData.caNumber
                                          }
                                        </div>
                                      </div>
                                    </div>
                                    <div className="row m-0">
                                      <div className="col-sm-3 p-0">
                                        <div className="form-label-name">
                                          <b>CA Email</b>
                                        </div>
                                      </div>
                                      <div className="col-sm-9 p-0">
                                        <div className="form-label-data">
                                          {leadData.caEmail
                                          }
                                        </div>
                                      </div>
                                    </div>
                                    <div className="row m-0">
                                      <div className="col-sm-3 p-0">
                                        <div className="form-label-name">
                                          <b>CA Commission</b>
                                        </div>
                                      </div>
                                      <div className="col-sm-9 p-0">
                                        <div className="form-label-data">
                                          {leadData.caCommission
                                          }
                                        </div>
                                      </div>
                                    </div>
                                  </>}

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
                                            {leadData.services
                                              .reduce((acc, curr) => {
                                                return curr.paymentTerms ===
                                                  "Full Advanced"
                                                  ? acc +
                                                  Number(
                                                    curr.totalPaymentWGST
                                                  )
                                                  : acc +
                                                  Number(curr.firstPayment);
                                              }, 0)
                                              .toFixed(2)}
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
                                              ))
                                              .toLocaleString()}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {leadData.paymentReceipt.length !== 0 && <div className="row m-0">
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
                                              (leadData.paymentReceipt[0]
                                                .filename
                                                ? leadData.paymentReceipt[0]
                                                  .filename
                                                : leadData.paymentReceipt[0]
                                                  .name), leadData["Company Name"]
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
                                                    Array.isArray(leadData.paymentReceipt) &&
                                                      leadData.paymentReceipt.length > 0 &&
                                                      leadData.paymentReceipt[0]?.name?.endsWith(".pdf")
                                                      ? pdfimg
                                                      : img
                                                  }
                                                  alt="Payment Receipt"
                                                />
                                              </div>
                                              <div
                                                className="docItemName wrap-MyText"
                                                title={
                                                  Array.isArray(leadData.paymentReceipt) &&
                                                    leadData.paymentReceipt[0]?.name?.includes("-")
                                                    ? leadData.paymentReceipt[0].name.split("-")[1]
                                                    : "No Name Available"
                                                }
                                              >
                                                {
                                                  Array.isArray(leadData.paymentReceipt) &&
                                                    leadData.paymentReceipt[0]?.name?.includes("-")
                                                    ? leadData.paymentReceipt[0].name.split("-")[1]
                                                    : "No Name Available"
                                                }
                                              </div>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>}
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
                                        {leadData.extraNotes ? leadData.extraNotes : "-"}
                                      </div>
                                    </div>
                                  </div>
                                  {leadData.otherDocs.length !== 0 && <div className="row m-0">
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
                                                    val.filename, leadData["Company Name"]
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
                                                    val.name, leadData["Company Name"]
                                                  );
                                                }}
                                              >
                                                <div className="docItemImg">
                                                  <img
                                                    src={
                                                      val?.name?.endsWith(".pdf")
                                                        ? pdfimg
                                                        : img || "path/to/default/image.jpg" // Fallback to a default image
                                                    }
                                                  />
                                                </div>
                                                <div
                                                  className="docItemName wrap-MyText"
                                                  title={val?.name || "No title available"} // Safely access `val.name` or provide a fallback
                                                >
                                                  {val?.name?.includes("-") // Check if `val.name` exists and contains a `-`
                                                    ? val.name.split("-")[1] // Safely split and access the part after `-`
                                                    : "No valid name available"} // Provide a fallback text
                                                </div>
                                              </div>
                                            </>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  </div>}
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
                          {bookingIndex === 0 ? activeStep !== 0 ? "Back" : "Back to Main" : activeStep !== 1 ? "Back" : "Back to Main"}
                        </Button>
                        {/* <Button
                          color="primary"
                          variant="contained"
                          disabled={activeStep === 0}
                          sx={{ mr: 1, background: "#ffba00 " }}
                          onClick={handleResetDraft}
                        >
                          Reset
                        </Button> */}
                        <Box sx={{ flex: "1 1 auto" }} />
                        <Button
                          onClick={handleNext}
                          variant="contained"
                          sx={{ mr: 1 }}
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
                                sx={{ mr: 1, background: "#ffba00" }}
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
                              {activeStep === 4
                                ? !isAdmin ? "Request Changes" : "Confirm Edit"
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
