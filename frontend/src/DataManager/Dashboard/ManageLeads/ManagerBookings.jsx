import React, { useState, useEffect } from "react";
import Header from "../../Components/Header/Header.jsx";
import Navbar from "../../Components/Navbar/Navbar.jsx";
import AdminBookingForm from "../../../admin/AdminBookingForm.jsx";
import axios from "axios";
import Swal from "sweetalert2";
import AddCircle from "@mui/icons-material/AddCircle.js";
import PdfImageViewerAdmin from "../../../admin/PdfViewerAdmin.jsx";
import pdfimg from "../../../static/my-images/pdf.png";
import { FcList } from "react-icons/fc";
import wordimg from "../../../static/my-images/word.png";
import Nodata from "../../../components/Nodata.jsx";
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import EditableMoreBooking from "../../../admin/EditableMoreBooking.jsx";
import AddLeadForm from "../../../admin/AddLeadForm.jsx";
import { FaPlus } from "react-icons/fa6";
import { IoAdd } from "react-icons/io5";
import CloseIcon from "@mui/icons-material/Close";
import RemainingAmnt from "../../../static/my-images/money.png";
import { IconX } from "@tabler/icons-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import io from 'socket.io-client';

function ManagerBookings() {
  const userId = localStorage.getItem("dataManagerUserId");
  const [myInfo, setMyInfo] = useState([]);
  const [bookingFormOpen, setBookingFormOpen] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [tempUpdateMode, setTempUpdateMode] = useState(false);
  const [sendingIndex, setSendingIndex] = useState(0);
  const [EditBookingOpen, setEditBookingOpen] = useState(false);
  const [addFormOpen, setAddFormOpen] = useState(false);
  const [openRemainingPayment, setOpenRemainingPayment] = useState(false);
  const [infiniteBooking, setInfiniteBooking] = useState([]);
  const [bookingIndex, setbookingIndex] = useState(-1);
  const [currentCompanyName, setCurrentCompanyName] = useState("");
  const [searchText, setSearchText] = useState("");
  const [nowToFetch, setNowToFetch] = useState(false);
  const [leadFormData, setLeadFormData] = useState([]);
  const [currentLeadform, setCurrentLeadform] = useState(null);
  const [currentDataLoading, setCurrentDataLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [openPaymentReceipt, setOpenPaymentReceipt] = useState(false);
  const [openAddExpanse, setOpenAddExpanse] = useState(false);
  const [openOtherDocs, setOpenOtherDocs] = useState(false);
  const [data, setData] = useState([]);
  const [companyName, setCompanyName] = "";
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const isAdmin = true;







  const fetchDatadebounce = async () => {
    try {
      // Set isLoading to true while fetching data
      //setIsLoading(true);
      //setCurrentDataLoading(true)

      const response = await axios.get(`${secretKey}/company-data/leads`);
      // Set the retrieved data in the state
      setData(response.data);
      //setmainData(response.data.filter((item) => item.ename === "Not Alloted"));

      // Set isLoading back to false after data is fetched
      //setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error.message);
      // Set isLoading back to false if an error occurs
      //setIsLoading(false);
    } finally {
      setCurrentDataLoading(false);
    }
  };
  useEffect(() => {
    if (currentCompanyName === "") {
      setCurrentLeadform(leadFormData[0]);
    } else {
      setCurrentLeadform(
        leadFormData.find((obj) => obj["Company Name"] === currentCompanyName)
      );
    }
  }, [leadFormData]);

  useEffect(() => {
    document.title = `Dataanalyst-Sahay-CRM`;
  }, []);

  useEffect(() => {
    const socket = secretKey === "http://localhost:3001/api" ? io("http://localhost:3001") : io("wss://startupsahay.in", {
      secure: true, // Use HTTPS
      path: '/socket.io',
      reconnection: true,
      transports: ['websocket'],
    });

    socket.on("Remaining_Payment_Added", (res) => {
      fetchRedesignedFormData();
      fetchData();
    })

    socket.on("rm-recievedamount-deleted", (res) => {
      fetchRedesignedFormData();
      fetchData();
    });

    socket.on("rm-services-added", (res) => {
      fetchRedesignedFormData();
      fetchData();
    });

    socket.on("adminexecutive-services-added", (res) => {
      fetchRedesignedFormData();
      fetchData();
    })


    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    setLeadFormData(
      infiniteBooking.filter((obj) =>
        obj["Company Name"].toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [searchText]);

  const fetchRedesignedFormData = async () => {
    try {
      const response = await axios.get(
        `${secretKey}/bookings/redesigned-final-leadData`
      );
      const sortedData = response.data.sort((a, b) => {
        const dateA = new Date(a.lastActionDate);
        const dateB = new Date(b.lastActionDate);
        return dateB - dateA; // Sort in descending order
      }); // Reverse the order of data

      setInfiniteBooking(sortedData);
      setLeadFormData(sortedData); // Set both states with the sorted data
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    fetchRedesignedFormData();
  }, [nowToFetch]);

  const [rmServicesData, setRmServicesData] = useState([])
  const [adminExecutiveData, setAdminExecutiveData] = useState([])

  const fetchData = async () => {

    try {

      const servicesResponse = await axios.get(`${secretKey}/rm-services/rm-sevicesgetrequest`);
      const ExecutiveDataResponse = await axios.get(`${secretKey}/rm-services/adminexecutivedata`);
      const servicesData = servicesResponse.data;
      const newservicesdata = ExecutiveDataResponse.data
      setRmServicesData(servicesData)
      setAdminExecutiveData(newservicesdata)

    } catch (error) {
      console.error("Error fetching data", error.message);
    }
  };

  useEffect(() => {
    // if (data.companyName) {
    //   console.log("Company Found");
    fetchDatadebounce();
    fetchRedesignedFormData();
    fetchData();
    // } else {
    //   console.log("No Company Found");
    // }
  }, []);

  const functionOpenBookingForm = () => {
    setBookingFormOpen(true);
    //setCompanyName(data.companyName)
  };
  const calculateTotalAmount = (obj) => {
    let total = Number(obj.totalAmount);
    if (obj.moreBookings && obj.moreBookings.length > 0) {
      total += obj.moreBookings.reduce(
        (acc, booking) => acc + Number(booking.totalAmount),
        0
      );
    }
    return total.toFixed(2);
  };

  const calculateReceivedAmount = (obj) => {
    let received = Number(obj.receivedAmount);
    if (obj.moreBookings && obj.moreBookings.length > 0) {
      received += obj.moreBookings.reduce(
        (acc, booking) => acc + Number(booking.receivedAmount),
        0
      );
    }
    return received.toFixed(2);
  };

  const calculatePendingAmount = (obj) => {
    let pending = Number(obj.pendingAmount);
    if (obj.moreBookings && obj.moreBookings.length > 0) {
      pending += obj.moreBookings.reduce(
        (acc, booking) => acc + Number(booking.pendingAmount),
        0
      );
    }
    return pending.toFixed(2);
  };
  function formatDatePro(inputDate) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(inputDate).toLocaleDateString(
      "en-US",
      options
    );
    return formattedDate;
  }
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
  const dataManagerName = localStorage.getItem("dataManagerName");
  // ------------------------------------------------- Delete booking ----------------------------------------------

  const handleDeleteBooking = async (company, id) => {
    const confirmation = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete the booking?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });

    if (confirmation.isConfirmed) {
      if (id) {
        console.log("id", id)
        fetch(
          `${secretKey}/bookings/redesigned-delete-particular-booking/${company}/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
          .then((response) => {
            if (response.ok) {
              Swal.fire("Success!", "Booking Deleted", "success");
            } else {
              Swal.fire("Error!", "Failed to Delete Booking", "error");
            }
          })
          .catch((error) => {
            console.error("Error during delete request:", error);
          });
      } else {
        console.log("company", company)
        fetch(`${secretKey}/bookings/redesigned-delete-booking/${company}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            if (response.ok) {
              Swal.fire("Success!", "Booking Deleted", "success");
              fetchRedesignedFormData();
            } else {
              Swal.fire("Error!", "Failed to Delete Company", "error");
            }
          })
          .catch((error) => {
            console.error("Error during delete request:", error);
          });
      }
    } else if (confirmation.dismiss === Swal.DismissReason.cancel) {
      console.log("Cancellation or closed without confirming");
    }
  };




  // ----------------------------------------- Upload documents Section -----------------------------------------------------

  const handleOtherDocsUpload = (updatedFiles) => {
    setSelectedDocuments((prevSelectedDocuments) => {
      return [...prevSelectedDocuments, ...updatedFiles];
    });
  };

  const handleRemoveFile = (index) => {
    setSelectedDocuments((prevSelectedDocuments) => {
      // Create a copy of the array of selected documents
      const updatedDocuments = [...prevSelectedDocuments];
      // Remove the document at the specified index
      updatedDocuments.splice(index, 1);
      // Return the updated array of selected documents
      return updatedDocuments;
    });
  };

  const closeOtherDocsPopup = () => {
    setOpenOtherDocs(false);
  };
  const handleotherdocsAttachment = async () => {
    try {
      const files = selectedDocuments;
      console.log(files);

      if (files.length === 0) {
        // No files selected
        return;
      }

      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("otherDocs", files[i]);
      }

      setCurrentCompanyName(currentLeadform["Company Name"]);
      const response = await fetch(
        `${secretKey}/bookings/uploadotherdocsAttachment/${currentLeadform["Company Name"]}/${sendingIndex}`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (response.ok) {
        Swal.fire({
          title: "Success!",
          html: `<small> File Uploaded successfully </small>
        `,
          icon: "success",
        });
        setSelectedDocuments([]);
        setOpenOtherDocs(false);
        fetchRedesignedFormData();
      } else {
        Swal.fire({
          title: "Error uploading file",

          icon: "error",
        });
        console.error("Error uploading file");
      }
    } catch (error) {
      Swal.fire({
        title: "Error uploading file",
        icon: "error",
      });
      console.error("Error uploading file:", error);
    }
  };

  // --------------------------------------------------  ADD REMAINING PAYMENT SECTION ----------------------------------------------------------


  const [remainingObject, setRemainingObject] = useState({
    "Company Name": "",
    paymentCount: "",
    bookingIndex: 0,
    serviceName: "",
    withGST: false,
    paymentMethod: "",
    extraRemarks: "",
    paymentDate: null,
    paymentRemarks: "",
    pendingAmount: 0,
    receivedAmount: 0,
    remainingAmount: 0,
    remainingPaymentReceipt: null,
  });
  const functionOpenRemainingPayment = (
    object,
    paymentNumber,
    companyName,
    bookingIndex,
    existingObject
  ) => {

    const serviceName = object.serviceName;
    let pendingPayment;
    let paymentRemarks;
    if (paymentNumber === "secondPayment") {
      pendingPayment = object.secondPayment;
      paymentRemarks = object.secondPaymentRemarks;
    } else if (paymentNumber === "thirdPayment") {
      pendingPayment = object.thirdPayment;
      paymentRemarks = object.thirdPaymentRemarks;
    } else if (paymentNumber === "fourthPayment") {
      pendingPayment = object.fourthPayment;
      paymentRemarks = object.fourthPaymentRemarks;
    } else {
      pendingPayment = parseInt(currentLeadform.pendingAmount);
      paymentRemarks = "Last Payment"
    }

    if (existingObject) {
      console.log("Existing Object", existingObject)
      setRemainingObject({
        "Company Name": companyName,
        paymentCount: paymentNumber,
        bookingIndex: bookingIndex,
        withGST: existingObject.withGST,
        serviceName: serviceName,
        pendingAmount: existingObject.pendingPayment,
        receivedAmount: existingObject.receivedPayment,
        remainingAmount: existingObject.remainingAmount,
        paymentMethod: existingObject.paymentMethod,
        paymentDate: new Date(existingObject.paymentDate).toISOString().slice(0, 10),
        extraRemarks: existingObject.extraRemarks,
        paymentRemarks,
      });
      setOpenRemainingPayment(true);
    } else {
      setRemainingObject({
        "Company Name": companyName,
        paymentCount: paymentNumber,
        bookingIndex: bookingIndex,
        serviceName: serviceName,
        pendingAmount: pendingPayment,
        receivedAmount: pendingPayment,
        remainingAmount: 0,
        paymentRemarks,
      });
      setOpenRemainingPayment(true);
    }
  };

  const formData = new FormData();
  const moreRemainingPayment =
    remainingObject.pendingAmount - remainingObject.receivedAmount;

  formData.append("Company Name", remainingObject["Company Name"]);
  formData.append("paymentCount", remainingObject["paymentCount"]);
  formData.append("bookingIndex", remainingObject["bookingIndex"]);
  formData.append("serviceName", remainingObject["serviceName"]);
  formData.append("pendingAmount", remainingObject["pendingAmount"]);
  formData.append("receivedAmount", remainingObject["receivedAmount"]);
  formData.append("remainingAmount", moreRemainingPayment);
  formData.append("paymentMethod", remainingObject["paymentMethod"]);
  formData.append("extraRemarks", remainingObject["extraRemarks"]);
  formData.append("paymentRemarks", remainingObject["paymentRemarks"]);
  formData.append("withGST", remainingObject.withGST);
  formData.append("paymentReceipt", remainingObject["remainingPaymentReceipt"]);
  formData.append("paymentDate", remainingObject["paymentDate"])




  const handleSubmitMorePayments = async () => {
    if (!remainingObject.paymentDate || !remainingObject.paymentMethod) {
      Swal.fire("Incorrect Details!", "Please Enter Details Properly", "warning");
      return true;
    }

    Swal.fire({
      title: 'Processing Payment...',
      text: 'Please wait while your payment is being updated.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    // Debug logs to check data
    console.log("rmServicesData:", rmServicesData);
    console.log("adminExecutiveData:", adminExecutiveData);
    const findCompany = rmServicesData.find(company => company["Company Name"] === remainingObject["Company Name"] && company.serviceName === remainingObject.serviceName)
    const findCompanyAdmin = adminExecutiveData.find(company => company["Company Name"] === remainingObject["Company Name"] && company.serviceName === remainingObject.serviceName)
    console.log("findCompany", findCompanyAdmin)

    console.log("findCompany", findCompany)
    if (!tempUpdateMode) {
      try {
        const response = await axios.post(
          `${secretKey}/bookings/redesigned-submit-morePayments/${remainingObject["Company Name"]}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (findCompany) {
          const response2 = await axios.post(`${secretKey}/rm-services/rmcertification-update-remainingpayments/`, {
            companyName: remainingObject["Company Name"],
            serviceName: remainingObject.serviceName,
            pendingRecievedPayment: parseInt(remainingObject.receivedAmount),
            pendingRecievedPaymentDate: remainingObject.paymentDate
          });
          console.log("remaing payment", response2.data)
        }
        if (findCompanyAdmin) {
          const response2 = await axios.post(`${secretKey}/rm-services/adminexecutive-update-remainingpayments/`, {
            companyName: remainingObject["Company Name"],
            serviceName: remainingObject.serviceName,
            pendingRecievedPayment: parseInt(remainingObject.receivedAmount),
            pendingRecievedPaymentDate: remainingObject.paymentDate
          });
          console.log("remaing payment", response2.data)
        }
        Swal.fire(
          "Payment Updated",
          "Thank you, your payment has been updated successfully!",
          "success"
        );
        setOpenRemainingPayment(false);
      } catch (error) {
        Swal.fire(
          "Error Updating Payment!",
          "Sorry, Unable to update the payment",
          "error"
        );
      }
    } else {
      try {
        const response = await axios.post(
          `${secretKey}/bookings/redesigned-update-morePayments/${remainingObject["Company Name"]}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (findCompany) {
          const response2 = await axios.post(`${secretKey}/rm-services/rmcertification-update-remainingpayments/`, {
            companyName: remainingObject["Company Name"],
            serviceName: remainingObject.serviceName,
            pendingRecievedPayment: parseInt(remainingObject.receivedAmount),
            pendingRecievedPaymentDate: remainingObject.paymentDate
          });
          console.log("remaing payment", response2.data)
        }
        if (findCompanyAdmin) {
          const response2 = await axios.post(`${secretKey}/rm-services/adminexecutive-update-remainingpayments/`, {
            companyName: remainingObject["Company Name"],
            serviceName: remainingObject.serviceName,
            pendingRecievedPayment: parseInt(remainingObject.receivedAmount),
            pendingRecievedPaymentDate: remainingObject.paymentDate
          });
          console.log("remaing payment", response2.data)
        }
        Swal.fire(
          "Payment Updated",
          "Thank you, your payment has been updated successfully!",
          "success"
        );
        setOpenRemainingPayment(false);
        setTempUpdateMode(false);
      } catch (error) {
        Swal.fire(
          "Error Updating Payment!",
          "Sorry, Unable to update the payment",
          "error"
        );
      }
    }
  };


  function formatDateInput(inputDate) {
    const date = new Date(inputDate);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Adding 1 to month because it's zero-based
    const day = String(date.getUTCDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  console.log("Remaining Object", remainingObject)
  const [expanseObject, setExpanseObject] = useState({
    serviceName: "",
    bookingIndex: 0,
    expanseAmount: 0,
    serviceID: "",
    expanseDate: null
  })


  const functionOpenAddExpanse = (bookingIndex, serviceName, serviceID) => {
    const expanseToday = new Date();
    const booking = bookingIndex === 0 ? currentLeadform : currentLeadform.moreBookings[bookingIndex - 1];
    const findService = booking.services.find(obj => obj._id === serviceID);


    setExpanseObject({
      ...expanseObject,
      bookingIndex: bookingIndex,
      serviceName: serviceName,
      serviceID: serviceID,
      expanseDate: findService.expanseDate ? formatDateInput(findService.expanseDate) : formatDateInput(expanseToday),
      expanseAmount: findService.expanse ? findService.expanse : 0
    })
    setOpenAddExpanse(true)
  }




  const functionDeleteRemainingPayment = async (BookingIndex, serviceName) => {
    console.log("ye ghus raha", BookingIndex, serviceName)
    const encodedServiceName = encodeURIComponent(serviceName);
    try {
      const response = await axios.delete(
        `${secretKey}/bookings/redesigned-delete-morePayments/${currentLeadform["Company Name"]}/${BookingIndex}/${encodedServiceName}`
      );

      // const findCompany = rmServicesData.find(company => company["Company Name"] === remainingObject["Company Name"] && company.serviceName === remainingObject.serviceName)
      // if (findCompany) {
      //   const response2 = await axios.post(`${secretKey}/bookings/delete-remaining-payment/`, {
      //     companyName: currentLeadform["Company Name"],
      //     serviceName: serviceName
      //   })

      // }

      Swal.fire(
        "Payment Updated",
        "Thank you, your payment has been updated successfully!",
        "success"
      );

    } catch (error) {
      Swal.fire(
        "Error Updating Payment!",
        "Sorry, Unable to update the payment",
        "error"
      );
    }
  }


  const submitExpanse = async () => {
    try {
      const response = await axios.post(
        `${secretKey}/bookings/redesigned-submit-expanse/${currentLeadform["Company Name"]}`, expanseObject
      );
      Swal.fire(
        "Expanse Added ",
        "Thank you, expanse has been added successfully!",
        "success"
      );
      setNowToFetch(true);
      setOpenAddExpanse(false);

    } catch (error) {
      Swal.fire(
        "Error Adding Expanse!",
        "Sorry, Unable to add the expanse",
        "error"
      );
    }
  }

  //console.log("currentleadform" , currentLeadform.moreBookings[0].services[0].expanseDate)

  // console.log("User id is :", userId);

  const fetchPersonalInfo = async () => {
    try {
      const res = await axios.get(`${secretKey}/employee/fetchEmployeeFromId/${userId}`);
      // console.log("Personal Info :", res.data.data);
      setMyInfo(res.data.data);
    } catch (error) {
      console.log("Error fetching employee data :", error);
    }
  };

  useEffect(() => {
    fetchPersonalInfo();
  }, []);

  return (
    <div>
      <Header id={myInfo._id} name={myInfo.ename} empProfile={myInfo.profilePhoto && myInfo.profilePhoto.length !== 0 && myInfo.profilePhoto[0].filename} gender={myInfo.gender} designation={myInfo.newDesignation} />
      <Navbar name={dataManagerName} />
      {!bookingFormOpen && !EditBookingOpen && !addFormOpen && (
        <div className="booking-list-main">
          <div className="booking_list_Filter">
            <div className="container-xl">
              <div className="row justify-content-between">
                <div className="col-2">
                  <div class="my-2 my-md-0 flex-grow-1 flex-md-grow-0 order-first order-md-last">
                    <div class="input-icon">
                      <span class="input-icon-addon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="icon"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          stroke-width="2"
                          stroke="currentColor"
                          fill="none"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path
                            stroke="none"
                            d="M0 0h24v24H0z"
                            fill="none"
                          ></path>
                          <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
                          <path d="M21 21l-6 -6"></path>
                        </svg>
                      </span>
                      <input
                        type="text"
                        value={searchText}
                        class="form-control"
                        placeholder="Search Company"
                        aria-label="Search in website"
                        onChange={(e) => setSearchText(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex justify-content-end">
                    <button className="btn btn-primary mr-1" disabled>
                      Import CSV
                    </button>
                    <button className="btn btn-primary mr-1" disabled>
                      Export CSV
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => functionOpenBookingForm()}
                    >
                      Add Booking
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container-xl">
            <div className="booking_list_Dtl_box">
              <div className="row m-0">
                {/* --------booking list left Part---------*/}
                <div className="col-4 p-0">
                  <div className="booking-list-card">
                    <div className="booking-list-heading">
                      <div className="d-flex justify-content-between">
                        <div className="b_dtl_C_name">Booking List</div>
                      </div>
                    </div>
                    <div className="booking-list-body">
                      {leadFormData.length !== 0 &&
                        leadFormData.map((obj, index) => (
                          <div
                            className={
                              currentLeadform &&
                                currentLeadform["Company Name"] ===
                                obj["Company Name"]
                                ? "bookings_Company_Name activeBox"
                                : "bookings_Company_Name"
                            }
                            onClick={() =>
                              setCurrentLeadform(
                                leadFormData.find(
                                  (data) =>
                                    data["Company Name"] === obj["Company Name"]
                                )
                              )
                            }
                          >
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="b_cmpny_name cName-text-wrap">
                                {obj["Company Name"]}
                              </div>
                              <div className="b_cmpny_time">
                                {
                                  formatDatePro(
                                    obj.moreBookings &&
                                      obj.moreBookings.length !== 0
                                      ? obj.moreBookings[
                                        obj.moreBookings.length - 1
                                      ].bookingDate // Get the latest bookingDate from moreBookings
                                      : obj.bookingDate
                                  ) // Use obj.bookingDate if moreBookings is empty or not present
                                }
                              </div>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mt-2">
                              <div className="b_Services_name d-flex flex-wrap">
                                {(obj.services.length !== 0 ||
                                  (obj.moreBookings &&
                                    obj.moreBookings.length !== 0)) &&
                                  [
                                    ...obj.services,
                                    ...(obj.moreBookings || []).map(
                                      (booking) => booking.services
                                    ),
                                  ]
                                    .flat()
                                    .slice(0, 3) // Limit to first 3 services
                                    .map((service, index, array) => (
                                      <>
                                        <div
                                          className="sname mb-1"
                                          key={service.serviceId}
                                        >
                                          {service.serviceName}
                                        </div>

                                        {index === 2 &&
                                          Math.max(
                                            obj.services.length +
                                            obj.moreBookings.length -
                                            3,
                                            0
                                          ) !== 0 && (
                                            <div className="sname mb-1">
                                              {`+${Math.max(
                                                obj.services.length +
                                                obj.moreBookings.length -
                                                3,
                                                0
                                              )}`}
                                            </div>
                                          )}
                                      </>
                                    ))}
                              </div>

                              <div className="d-flex align-items-center justify-content-between">
                                {(obj.remainingPayments.length !== 0 || obj.moreBookings.some((moreObj) => moreObj.remainingPayments.length !== 0)) &&
                                  <div className="b_Service_remaining_receive" title="remaining Payment Received">
                                    <img src={RemainingAmnt}></img>
                                  </div>}
                                {obj.moreBookings.length !== 0 && (
                                  <div
                                    className="b_Services_multipal_services"
                                    title="Multipal Bookings"
                                  >
                                    <FcList />
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mt-2">
                              <div className="b_Services_amount d-flex">
                                <div className="amount total_amount_bg">
                                  Total: ₹ {calculateTotalAmount(obj)}
                                </div>
                                <div className="amount receive_amount_bg">
                                  Receive: ₹ {calculateReceivedAmount(obj)}
                                </div>
                                <div className="amount pending_amount_bg">
                                  Pending: ₹ {calculatePendingAmount(obj)}
                                </div>
                              </div>
                              <div className="b_BDE_name">{obj.bdeName}</div>
                            </div>
                          </div>
                        ))}
                      {leadFormData.length === 0 && (
                        <div
                          className="d-flex align-items-center justify-content-center"
                          style={{ height: "inherit" }}
                        >
                          <Nodata />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* --------booking Details Right Part---------*/}
                <div className="col-8 p-0">
                  <div className="booking-deatils-card">
                    <div className="booking-deatils-heading">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="b_dtl_C_name">
                          {currentLeadform &&
                            Object.keys(currentLeadform).length !== 0
                            ? currentLeadform["Company Name"]
                            : leadFormData && leadFormData.length !== 0
                              ? leadFormData[0]["Company Name"]
                              : "-"}
                        </div>
                        <div
                          className="bookings_add_more"
                          title="Add More Booking"
                          onClick={() => setAddFormOpen(true)}
                        >
                          <FaPlus />
                        </div>
                      </div>
                    </div>
                    <div className="booking-deatils-body">
                      {/* --------Basic Information Which is Common For all bookingdd  ---------*/}
                      <div className="my-card mt-2">
                        <div className="my-card-head">
                          <div className="d-flex align-items-center justify-content-between">
                            <div>Basic Informations</div>
                            <div>Total Services: {currentLeadform && currentLeadform.services.length}</div>
                          </div>
                        </div>
                        <div className="my-card-body">
                          <div className="row m-0 bdr-btm-eee">
                            <div className="col-lg-6 col-sm-6 p-0 align-self-stretch">
                              <div class="row m-0 h-100">
                                <div class="col-sm-4 align-self-stretch p-0">
                                  <div class="booking_inner_dtl_h h-100">
                                    Company Name
                                  </div>
                                </div>
                                <div class="col-sm-8 align-self-stretch p-0">
                                  <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                    {currentLeadform &&
                                      Object.keys(currentLeadform).length !== 0
                                      ? currentLeadform["Company Name"]
                                      : leadFormData &&
                                        leadFormData.length !== 0
                                        ? leadFormData[0]["Company Name"]
                                        : "-"}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6 col-sm-6 p-0 align-self-stretch">
                              <div class="row m-0 h-100">
                                <div class="col-sm-4 align-self-stretch p-0">
                                  <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                    Email Address
                                  </div>
                                </div>
                                <div class="col-sm-6 align-self-stretch p-0">
                                  <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                    {currentLeadform &&
                                      Object.keys(currentLeadform).length !== 0
                                      ? currentLeadform["Company Email"]
                                      : leadFormData &&
                                        leadFormData.length !== 0
                                        ? leadFormData[0]["Company Email"]
                                        : "-"}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row m-0 bdr-btm-eee">
                            <div className="col-lg-4 col-sm-6 p-0 align-self-stretch">
                              <div class="row m-0 h-100">
                                <div class="col-sm-6 align-self-stretch p-0">
                                  <div class="booking_inner_dtl_h h-100">
                                    Phone No
                                  </div>
                                </div>
                                <div class="col-sm-6 align-self-stretch p-0">
                                  <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                    {currentLeadform &&
                                      Object.keys(currentLeadform).length !== 0
                                      ? currentLeadform["Company Number"]
                                      : leadFormData &&
                                        leadFormData.length !== 0
                                        ? leadFormData[0]["Company Number"]
                                        : "-"}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-4 col-sm-6 p-0 align-self-stretch">
                              <div class="row m-0 h-100">
                                <div class="col-sm-7 align-self-stretch p-0">
                                  <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                    Incorporation date
                                  </div>
                                </div>
                                <div class="col-sm-5 align-self-stretch p-0">
                                  <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                    {currentLeadform &&
                                      formatDatePro(
                                        Object.keys(currentLeadform).length !==
                                          0
                                          ? currentLeadform.incoDate
                                          : leadFormData &&
                                            leadFormData.length !== 0
                                            ? leadFormData[0].incoDate
                                            : "-"
                                      )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-4 col-sm-6 p-0 align-self-stretch">
                              <div class="row m-0 h-100">
                                <div class="col-sm-5 align-self-stretch p-0">
                                  <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                    PAN/GST
                                  </div>
                                </div>
                                <div class="col-sm-7 align-self-stretch p-0">
                                  <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                    {currentLeadform &&
                                      Object.keys(currentLeadform).length !== 0
                                      ? currentLeadform.panNumber
                                      : leadFormData &&
                                        leadFormData.length !== 0
                                        ? leadFormData[0].panNumber
                                        : "-"}
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* <div className="col-lg-3 col-sm-6 p-0 align-self-stretch">
                              <div class="row m-0 h-100">
                                <div class="col-sm-4 align-self-stretch p-0">
                                  <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                    GST
                                  </div>
                                </div>
                                <div class="col-sm-8 align-self-stretch p-0">
                                  <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                    {currentLeadform &&
                                      Object.keys(currentLeadform).length !== 0
                                      ? currentLeadform.gstNumber
                                      : leadFormData &&
                                        leadFormData.length !== 0
                                        ? leadFormData[0].gstNumber
                                        : "-"}
                                  </div>
                                </div>
                              </div>
                            </div> */}
                          </div>
                          <div className="row m-0 bdr-btm-eee">
                            <div className="col-lg-4 col-sm-6 p-0">
                              <div class="row m-0">
                                <div class="col-sm-4 align-self-stretc p-0">
                                  <div class="booking_inner_dtl_h h-100">
                                    Total
                                  </div>
                                </div>
                                <div class="col-sm-8 align-self-stretc p-0">
                                  {currentLeadform && <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                    ₹ {calculateTotalAmount(currentLeadform)}
                                  </div>}
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-4 col-sm-6 p-0">
                              <div class="row m-0">
                                <div class="col-sm-4 align-self-stretc p-0">
                                  <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                    Received
                                  </div>
                                </div>
                                <div class="col-sm-8 align-self-stretc p-0">
                                  {currentLeadform && <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                    ₹ {calculateReceivedAmount(currentLeadform)}
                                  </div>}
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-4 col-sm-6 p-0">
                              <div class="row m-0">
                                <div class="col-sm-4 align-self-stretc p-0">
                                  <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                    Pending
                                  </div>
                                </div>
                                <div class="col-sm-8 align-self-stretc p-0">
                                  {currentLeadform && <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                    ₹ {calculatePendingAmount(currentLeadform)}
                                  </div>}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* --------If Multipal Booking (Bookign heading) ---------*/}
                      {currentLeadform &&
                        currentLeadform.moreBookings.length !== 0 && (
                          <div className="row align-items-center m-0 justify-content-between mb-1 mt-3">
                            <div className="mul_booking_heading col-6">
                              <b>Booking 1</b>
                            </div>
                            <div className="mul_booking_date col-6">
                              <b>
                                {formatDatePro(currentLeadform.bookingDate)}
                              </b>
                            </div>
                          </div>
                        )}
                      {/* -------- Booking Details ---------*/}
                      <div className="mul-booking-card mt-2">
                        {/* -------- Step 2 ---------*/}
                        <div className="mb-2 mul-booking-card-inner-head d-flex justify-content-between">
                          <b>Booking Details:</b>
                          <div className="Services_Preview_action d-flex">
                            <div
                              className="Services_Preview_action_edit mr-1"
                              onClick={() => {
                                setbookingIndex(0);
                                setEditBookingOpen(true);
                              }}
                            >
                              <MdModeEdit />
                            </div>
                            <div
                              onClick={() =>
                                handleDeleteBooking(currentLeadform.company)}
                              className="Services_Preview_action_delete"
                            >
                              <MdDelete />
                            </div>
                          </div>
                        </div>
                        <div className="my-card">
                          <div className="my-card-body">
                            <div className="row m-0 bdr-btm-eee">
                              <div className="col-lg-4 col-sm-6 p-0">
                                <div class="row m-0">
                                  <div class="col-sm-4 align-self-stretch p-0">
                                    <div class="booking_inner_dtl_h h-100">
                                      BDE Name
                                    </div>
                                  </div>
                                  <div class="col-sm-8 align-self-stretch p-0">
                                    <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                      {currentLeadform &&
                                        currentLeadform.bdeName}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-4 col-sm-6 p-0">
                                <div class="row m-0">
                                  <div class="col-sm-4 align-self-stretch p-0">
                                    <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                      BDE Email
                                    </div>
                                  </div>
                                  <div class="col-sm-8 align-self-stretch p-0">
                                    <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                      {currentLeadform &&
                                        currentLeadform.bdeEmail}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-4 col-sm-6 p-0">
                                <div class="row m-0">
                                  <div class="col-sm-4 align-self-stretch p-0">
                                    <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                      BDM Name
                                    </div>
                                  </div>
                                  <div class="col-sm-8 align-self-stretch p-0">
                                    <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                      <span>
                                        <i>
                                          {currentLeadform &&
                                            currentLeadform.bdmType}
                                        </i>
                                      </span>{" "}
                                      {currentLeadform &&
                                        currentLeadform.bdmName}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="row m-0 bdr-btm-eee">
                              <div className="col-lg-4 col-sm-6 p-0">
                                <div class="row m-0">
                                  <div class="col-sm-4 align-self-stretch p-0">
                                    <div class="booking_inner_dtl_h h-100">
                                      BDM Email
                                    </div>
                                  </div>
                                  <div class="col-sm-8 align-self-stretch p-0">
                                    <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                      {currentLeadform &&
                                        currentLeadform.bdmEmail}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-4 col-sm-6 p-0">
                                <div class="row m-0">
                                  <div class="col-sm-4 align-self-stretch p-0">
                                    <div class="booking_inner_dtl_h h-100 bdr-left-eee">
                                      Booking Date{" "}
                                    </div>
                                  </div>
                                  <div class="col-sm-8 align-self-stretch p-0">
                                    <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                      {currentLeadform &&
                                        currentLeadform.bookingDate}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-4 col-sm-6 p-0">
                                <div class="row m-0">
                                  <div class="col-sm-4 align-self-stretch p-0">
                                    <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                      Lead Source
                                    </div>
                                  </div>
                                  <div class="col-sm-8 align-self-stretch p-0">
                                    <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                      {currentLeadform &&
                                        (currentLeadform.bookingSource ===
                                          "Other"
                                          ? currentLeadform.otherBookingSource
                                          : currentLeadform.bookingSource)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* -------- Step 3 ---------*/}
                        <div className="mb-2 mt-3 mul-booking-card-inner-head">
                          <b>Services And Payment Details:</b>
                        </div>
                        <div className="my-card">
                          <div className="my-card-body">
                            <div className="row m-0 bdr-btm-eee">
                              <div className="col-lg-6 col-sm-6 p-0">
                                <div class="row m-0">
                                  <div class="col-sm-4 align-self-stretch p-0">
                                    <div class="booking_inner_dtl_h h-100">
                                      No. Of Services
                                    </div>
                                  </div>
                                  <div class="col-sm-8 align-self-stretch p-0">
                                    <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                      {currentLeadform &&
                                        currentLeadform.services.length}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {currentLeadform &&
                          currentLeadform.services.map((obj, index) => (
                            <div className="my-card mt-1">
                              <div className="my-card-body">
                                <div className="row m-0 bdr-btm-eee">
                                  <div className="col-lg-6 col-sm-6 p-0">
                                    <div class="row m-0">
                                      <div class="col-sm-4 align-self-stretch p-0">
                                        <div class="booking_inner_dtl_h h-100">
                                          {getOrdinal(index + 1)} Services Name
                                        </div>
                                      </div>
                                      <div class="col-sm-8 align-self-stretch p-0">
                                        <div class="booking_inner_dtl_b bdr-left-eee h-100 services-name">
                                          {obj.serviceName}{" "}
                                          {obj.withDSC &&
                                            obj.serviceName ===
                                            "Start-Up India Certificate" &&
                                            "With DSC"}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-sm-6 p-0">
                                    <div class="row m-0">
                                      <div class="col-sm-4 align-self-stretch p-0">
                                        <div class="booking_inner_dtl_h h-100 bdr-left-eee">
                                          Total Amount
                                        </div>
                                      </div>
                                      <div class="col-sm-8 align-self-stretch p-0">
                                        <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                          <div className="d-flex align-items-center justify-content-between">
                                            <div>
                                              ₹{" "}
                                              {Math.round(
                                                obj.totalPaymentWGST
                                              ).toLocaleString()}{" "}
                                              {"("}
                                              {obj.totalPaymentWGST !==
                                                obj.totalPaymentWOGST
                                                ? "With GST"
                                                : "Without GST"}
                                              {")"}
                                            </div>

                                            {/* --------------------------------------------------------------   ADD Expanses Section  --------------------------------------------------- */}
                                            <div className="d-flex">
                                              <button onClick={() => functionOpenAddExpanse(0, obj.serviceName, obj._id)} className="btn btn-link btn-small">
                                                + Expanse
                                              </button>

                                            </div>

                                            <Dialog open={openAddExpanse} onClose={() => setOpenAddExpanse(false)}
                                              fullWidth
                                              maxWidth="xs">
                                              <DialogTitle>
                                                <div className="d-flex align-items-center justify-content-between">
                                                  <div className="expanse-heading">
                                                    <h2>{expanseObject.serviceName}</h2>
                                                  </div>
                                                  <div className="expanse-close">
                                                    <button className="btn btn-link" onClick={() => setExpanseObject({
                                                      ...expanseObject,
                                                      expanseDate: "",
                                                      expanseAmount: 0
                                                    })} >
                                                      Clear
                                                    </button>
                                                    <IconButton onClick={() => setOpenAddExpanse(false)}>
                                                      <CloseIcon />
                                                    </IconButton>
                                                  </div>
                                                </div>


                                              </DialogTitle>
                                              <DialogContent>
                                                <div className="expanse-content">
                                                  <div className="expanse-input">
                                                    <label className="mb-2" htmlFor="expansee-input"> <b>ADD Expanse</b></label>
                                                    <input value={expanseObject.expanseAmount} onChange={(e) => {
                                                      setExpanseObject({
                                                        ...expanseObject,
                                                        expanseAmount: e.target.value
                                                      })
                                                    }} type="number" className="form-control" id="expanse-input" placeholder="Add expanse here" />
                                                  </div>
                                                  <div className="expanse-date">
                                                    <label className="mb-2" htmlFor="expansee-input"> <b>Expanse Date</b></label>
                                                    <input placeholder="Select Date" value={expanseObject.expanseDate} onChange={(e) => {
                                                      setExpanseObject({
                                                        ...expanseObject,
                                                        expanseDate: e.target.value
                                                      })
                                                    }} type="date" className="form-control" id="expanse-input" />
                                                  </div>
                                                </div>



                                              </DialogContent>
                                              <div className="expanse-footer">
                                                <button onClick={submitExpanse} className="btn btn-primary w-100">
                                                  Submit
                                                </button>
                                              </div>
                                            </Dialog>

                                            {/* -------------------------------------   Expanse Section Ends Here  -------------------------------------------------- */}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="row m-0 bdr-btm-eee">
                                  <div className="col-lg-6 col-sm-5 p-0">
                                    <div class="row m-0">
                                      <div class="col-sm-4 align-self-stretch p-0">
                                        <div class="booking_inner_dtl_h h-100">
                                          Payment Terms
                                        </div>
                                      </div>
                                      <div class="col-sm-8 align-self-stretch p-0">
                                        <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                          {obj.paymentTerms === "two-part"
                                            ? "Part-Payment"
                                            : "Full Advanced"}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-sm-5 p-0">
                                    <div class="row m-0">
                                      <div class="col-sm-3 align-self-stretch p-0">
                                        <div class="booking_inner_dtl_h h-100 bdr-left-eee">
                                          Notes
                                        </div>
                                      </div>
                                      <div class="col-sm-9 align-self-stretch p-0">
                                        <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap" title={obj.paymentRemarks
                                          ? obj.paymentRemarks
                                          : "N/A"}>
                                          {obj.paymentRemarks
                                            ? obj.paymentRemarks
                                            : "N/A"}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {(obj.expanse !== 0 && obj.expanse) && <div className="row m-0 bdr-btm-eee">
                                  <div className="col-lg-6 col-sm-2 p-0">
                                    <div class="row m-0">
                                      <div class="col-sm-4 align-self-stretch p-0">
                                        <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                          Expense
                                        </div>
                                      </div>
                                      <div class="col-sm-8 align-self-stretch p-0">
                                        <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                          - ₹ {obj.expanse ? (obj.expanse).toLocaleString() : "N/A"}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-sm-2 p-0">
                                    <div class="row m-0">
                                      <div class="col-sm-6 align-self-stretch p-0">
                                        <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                          Expanses Date
                                        </div>
                                      </div>
                                      <div class="col-sm-6 align-self-stretch p-0">
                                        <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                          {(() => {
                                            const dateToFormat = obj.expanseDate ? obj.expanseDate : currentLeadform.bookingDate;
                                            console.log('Formatting date:', dateToFormat);
                                            return formatDatePro(dateToFormat);
                                          })()}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>}
                                <div className="row m-0 bdr-btm-eee">
                                  {obj.paymentTerms === "two-part" && (
                                    <div className="col-lg-6 col-sm-6 p-0">
                                      <div class="row m-0">
                                        <div class="col-sm-4 align-self-stretch p-0">
                                          <div class="booking_inner_dtl_h h-100">
                                            First payment
                                          </div>
                                        </div>
                                        <div class="col-sm-8 align-self-stretch p-0">
                                          <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                            ₹{" "}
                                            {Math.round(
                                              obj.firstPayment
                                            ).toLocaleString()}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  {obj.secondPayment !== 0 && (
                                    <div className="col-lg-6 col-sm-6 p-0">
                                      <div class="row m-0">
                                        <div class="col-sm-4 align-self-stretch p-0">
                                          <div class="booking_inner_dtl_h h-100 bdr-left-eee">
                                            Second Payment
                                          </div>
                                        </div>
                                        <div class="col-sm-8 align-self-stretch p-0">
                                          <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                            <div className="d-flex align-items-center justify-content-between">
                                              <div>
                                                ₹
                                                {Math.round(
                                                  obj.secondPayment
                                                ).toLocaleString()}
                                                {"("}
                                                {isNaN(
                                                  new Date(
                                                    obj.secondPaymentRemarks
                                                  )
                                                )
                                                  ? obj.secondPaymentRemarks
                                                  : "On " +
                                                  obj.secondPaymentRemarks +
                                                  ")"}
                                                {")"}
                                              </div>
                                              <div className="d-flex align-items-center justify-content-end">
                                                {/* add remaining main */}
                                                <div className="add-remaining-amnt"
                                                  style={{
                                                    display:
                                                      currentLeadform.remainingPayments.length !== 0 &&
                                                        currentLeadform.remainingPayments.filter(
                                                          (item) => item.serviceName === obj.serviceName
                                                        ).length > 0
                                                        ? "none"
                                                        : "block",
                                                  }}

                                                  title="Add Remaining Payment"
                                                  onClick={() =>
                                                    functionOpenRemainingPayment(
                                                      obj,
                                                      "secondPayment",
                                                      currentLeadform["Company Name"],
                                                      0
                                                    )
                                                  }
                                                >
                                                  +
                                                </div>
                                                {/* add remaining Extraa */}
                                                {/* { 
                                                <IconButton  onClick={() =>
                                                  functionOpenRemainingPayment(
                                                    obj,
                                                    "otherPayment",
                                                    currentLeadform[
                                                    "Company Name"
                                                    ],
                                                    0
                                                  )
                                                }>
                                                  <FaPlus/>
                                                  </IconButton>} */}
                                                {/* add remaining Edit */}
                                                {currentLeadform.remainingPayments.length !== 0 && currentLeadform.remainingPayments.filter((pay) => pay.serviceName === obj.serviceName).length > 0 &&
                                                  <div className="edit-remaining">
                                                    <IconButton onClick={() => {
                                                      setIsUpdateMode(true)
                                                      setTempUpdateMode(true)
                                                      functionOpenRemainingPayment(
                                                        obj,
                                                        "secondPayment",
                                                        currentLeadform[
                                                        "Company Name"
                                                        ], 0,
                                                        currentLeadform.remainingPayments.filter(boom => boom.serviceName === obj.serviceName)[0],
                                                      )
                                                    }
                                                    }>
                                                      <MdModeEdit style={{ height: '14px', width: '14px' }} />
                                                    </IconButton>
                                                  </div>}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div className="row m-0 bdr-btm-eee">
                                  {obj.thirdPayment !== 0 && (
                                    <div className="col-lg-6 col-sm-6 p-0">
                                      <div class="row m-0">
                                        <div class="col-sm-4 align-self-stretch p-0">
                                          <div class="booking_inner_dtl_h h-100">
                                            Third Payment
                                          </div>
                                        </div>
                                        <div class="col-sm-8 align-self-stretch p-0">
                                          <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                            <div className="d-flex align-items-center justify-content-between">
                                              <div>
                                                ₹{" "}
                                                {Math.round(
                                                  obj.thirdPayment
                                                ).toLocaleString()}
                                                {"("}
                                                {isNaN(
                                                  new Date(
                                                    obj.thirdPaymentRemarks
                                                  )
                                                )
                                                  ? obj.thirdPaymentRemarks
                                                  : "On " +
                                                  obj.thirdPaymentRemarks +
                                                  ")"}
                                              </div>
                                              <div>
                                                <div
                                                  className="add-remaining-amnt"
                                                  style={{
                                                    display:
                                                      currentLeadform.remainingPayments.length !== 0 &&
                                                        currentLeadform.remainingPayments.filter(
                                                          (item) => item.serviceName === obj.serviceName
                                                        ).length > 1
                                                        ? "none"
                                                        : "block",
                                                  }}

                                                  title="Add Remaining Payment"
                                                  onClick={() =>
                                                    functionOpenRemainingPayment(
                                                      obj,
                                                      "thirdPayment",
                                                      currentLeadform[
                                                      "Company Name"
                                                      ],
                                                      0
                                                    )
                                                  }
                                                >
                                                  +
                                                </div>
                                              </div>
                                              {currentLeadform.remainingPayments.length !== 0 && currentLeadform.remainingPayments.filter((pay) => pay.serviceName === obj.serviceName).length > 1 && <div className="edit-remaining">
                                                <IconButton onClick={() => {
                                                  setIsUpdateMode(true)
                                                  setTempUpdateMode(true)
                                                  functionOpenRemainingPayment(
                                                    obj,
                                                    "thirdPayment",
                                                    currentLeadform[
                                                    "Company Name"
                                                    ], 0,
                                                    currentLeadform.remainingPayments.filter(boom => boom.serviceName === obj.serviceName)[1],
                                                  )
                                                }
                                                }>
                                                  <MdModeEdit style={{ height: '14px', width: '14px' }} />
                                                </IconButton>
                                              </div>}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  {obj.fourthPayment !== 0 && (
                                    <div className="col-lg-6 col-sm-6 p-0">
                                      <div class="row m-0">
                                        <div class="col-sm-4 align-self-stretch p-0">
                                          <div class="booking_inner_dtl_h h-100 bdr-left-eee">
                                            Fourth Payment
                                          </div>
                                        </div>
                                        <div class="col-sm-8 align-self-stretch p-0">
                                          <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                            <div className="d-flex align-items-center justify-content-between">
                                              <div>
                                                ₹{" "}
                                                {Math.round(
                                                  obj.fourthPayment
                                                ).toLocaleString()}{" "}
                                                {"("}
                                                {isNaN(
                                                  new Date(
                                                    obj.fourthPaymentRemarks
                                                  )
                                                )
                                                  ? obj.fourthPaymentRemarks
                                                  : "On " +
                                                  obj.fourthPaymentRemarks +
                                                  ")"}
                                              </div>
                                              <div>
                                                <div
                                                  className="add-remaining-amnt"
                                                  title="Add Remaining Payment"
                                                  style={{
                                                    display:
                                                      currentLeadform.remainingPayments.length !== 0 &&
                                                        currentLeadform.remainingPayments.filter(
                                                          (item) => item.serviceName === obj.serviceName
                                                        ).length === 3
                                                        ? "none"
                                                        : "block",
                                                  }}
                                                  onClick={() =>
                                                    functionOpenRemainingPayment(
                                                      obj,
                                                      "fourthPayment",
                                                      currentLeadform[
                                                      "Company Name"
                                                      ],
                                                      0
                                                    )
                                                  }
                                                >
                                                  +
                                                </div>
                                              </div>
                                              {currentLeadform.remainingPayments.length !== 0 && currentLeadform.remainingPayments.filter((pay) => pay.serviceName === obj.serviceName).length === 3 && <div className="edit-remaining">
                                                <IconButton onClick={() => {
                                                  setIsUpdateMode(true)
                                                  setTempUpdateMode(true)
                                                  functionOpenRemainingPayment(
                                                    obj,
                                                    "fourthPayment",
                                                    currentLeadform[
                                                    "Company Name"
                                                    ], 0,
                                                    currentLeadform.remainingPayments.filter(boom => boom.serviceName === obj.serviceName)[2],
                                                  )
                                                }
                                                }>
                                                  <MdModeEdit style={{ height: '14px', width: '14px' }} />
                                                </IconButton>
                                              </div>}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              {/* Remaining Payment Viwe Sections */}
                              {currentLeadform.remainingPayments.length !== 0 && currentLeadform.remainingPayments.some((boom) => boom.serviceName === obj.serviceName) &&
                                <div
                                  className="my-card-body accordion"
                                  id={`accordionExample${index}`}
                                >
                                  <div class="accordion-item bdr-none">
                                    <div
                                      id={`headingOne${index}`}
                                      className="pr-10 accordion-header"
                                    >
                                      <div
                                        className="row m-0 bdr-btm-eee accordion-button p-0"
                                        data-bs-toggle="collapse"
                                        data-bs-target={`#collapseOne${index}`}
                                        aria-expanded="true"
                                        aria-controls={`collapseOne${index}`}
                                      >
                                        <div className="w-95 p-0">
                                          <div className="booking_inner_dtl_h h-100 d-flex align-items-center justify-content-between">
                                            <div>Remaining Payment </div>

                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div
                                      id={`collapseOne${index}`}
                                      class="accordion-collapse collapse show"
                                      aria-labelledby={`headingOne${index}`}
                                      data-bs-parent="#accordionExample"
                                    // Add a unique key prop for each rendered element
                                    >
                                      {currentLeadform.remainingPayments
                                        .length !== 0 && currentLeadform.remainingPayments.filter(boom => boom.serviceName === obj.serviceName).map(
                                          (paymentObj, index) =>
                                            paymentObj.serviceName ===
                                              obj.serviceName ? (
                                              <div class="accordion-body bdr-none p-0">
                                                <div>
                                                  <div className="row m-0 bdr-btm-eee bdr-top-eee">
                                                    <div className="col-lg-12 col-sm-6 p-0 align-self-stretc bg-fffafa">
                                                      <div class="booking_inner_dtl_h h-100 d-flex align-items-center justify-content-between">
                                                        <div>
                                                          {currentLeadform.remainingPayments.length !== 0 &&
                                                            (() => {

                                                              if (index === 0) return "Second ";
                                                              else if (index === 1) return "Third ";
                                                              else if (index === 2) return "Fourth ";
                                                              else if (index > 2) return "Other ";
                                                              // Add more conditions as needed
                                                              return ""; // Return default value if none of the conditions match
                                                            })()}
                                                          Remaining Payment
                                                        </div>
                                                        <div className="d-flex align-items-center">
                                                          <div>
                                                            {"(" + formatDatePro(paymentObj.publishDate ? paymentObj.publishDate : paymentObj.paymentDated) + ")"}

                                                          </div>
                                                          {parseInt(currentLeadform.pendingAmount) !== 0 && <div
                                                            className="Services_Preview_action_edit mr-2"
                                                            onClick={() =>
                                                              functionOpenRemainingPayment(
                                                                obj,
                                                                "otherPayment",
                                                                currentLeadform[
                                                                "Company Name"
                                                                ],
                                                                0
                                                              )
                                                            }
                                                          >
                                                            <AddCircle />
                                                          </div>}

                                                          <IconButton onClick={() => functionDeleteRemainingPayment(0, obj.serviceName)}>
                                                            <MdDelete style={{ height: '14px', width: '14px', color: '#be1e1e' }} />
                                                          </IconButton>


                                                        </div>

                                                      </div>
                                                    </div>
                                                  </div>
                                                  <div className="row m-0 bdr-btm-eee">
                                                    <div className="col-lg-3 col-sm-6 p-0 align-self-stretc">
                                                      <div class="row m-0 h-100">
                                                        <div class="col-sm-5 align-self-stretc p-0">
                                                          <div class="booking_inner_dtl_h h-100">
                                                            Amount
                                                          </div>
                                                        </div>
                                                        <div class="col-sm-7 align-self-stretc p-0">
                                                          <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                                            ₹{" "}
                                                            {paymentObj.receivedPayment.toLocaleString()}
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                    <div className="col-lg-3 col-sm-6 p-0 align-self-stretc">
                                                      <div class="row m-0 h-100">
                                                        <div class="col-sm-5 align-self-stretc p-0">
                                                          <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                                            Pending
                                                          </div>
                                                        </div>
                                                        <div class="col-sm-7 align-self-stretc p-0">
                                                          <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                                            ₹{" "}
                                                            {currentLeadform.remainingPayments.length !== 0 &&
                                                              (() => {
                                                                const filteredPayments = currentLeadform.remainingPayments.filter(
                                                                  (pay) => pay.serviceName === obj.serviceName
                                                                );

                                                                const filteredLength = filteredPayments.length;
                                                                if (index === 0) return Math.round(obj.totalPaymentWGST) - Math.round(obj.firstPayment) - Math.round(paymentObj.receivedPayment);
                                                                else if (index === 1) return Math.round(obj.totalPaymentWGST) - Math.round(obj.firstPayment) - Math.round(paymentObj.receivedPayment) - Math.round(filteredPayments[0].receivedPayment);
                                                                else if (index === 2) return Math.round(currentLeadform.pendingAmount);
                                                                // Add more conditions as needed
                                                                return ""; // Return default value if none of the conditions match
                                                              })()}
                                                            {/* {index === 0
                                                              ? Math.round(obj.totalPaymentWGST) - Math.round(obj.firstPayment) - Math.round(paymentObj.receivedPayment)
                                                              : index === 1
                                                              ? Math.round(obj.totalPaymentWGST) - Math.round(obj.firstPayment) - Math.round(paymentObj.receivedPayment) - Math.round(currentLeadform.remainingPayments[0].receivedPayment)
                                                              : Math.round(currentLeadform.pendingAmount)} */}
                                                          </div>

                                                        </div>
                                                      </div>
                                                    </div>
                                                    <div className="col-lg-6 col-sm-6 p-0 align-self-stretc">
                                                      <div class="row m-0 h-100">
                                                        <div class="col-sm-5 align-self-stretc p-0">
                                                          <div class="booking_inner_dtl_h h-100 bdr-left-eee">
                                                            Payment Date
                                                          </div>
                                                        </div>
                                                        <div class="col-sm-7 align-self-stretc p-0">
                                                          <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap">
                                                            {formatDatePro(
                                                              paymentObj.paymentDate
                                                            )}
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                  <div className="row m-0 bdr-btm-eee">
                                                    <div className="col-lg-5 col-sm-6 p-0 align-self-stretc">
                                                      <div class="row m-0 h-100">
                                                        <div class="col-sm-5 align-self-stretc p-0">
                                                          <div class="booking_inner_dtl_h h-100">
                                                            Payment Method
                                                          </div>
                                                        </div>
                                                        <div class="col-sm-7 align-self-stretc p-0">
                                                          <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap" title={
                                                            paymentObj.paymentMethod
                                                          }>
                                                            {
                                                              paymentObj.paymentMethod
                                                            }
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                    <div className="col-lg-3 col-sm-4 p-0 align-self-stretc">
                                                      <div class="row m-0 h-100">
                                                        <div class="col-sm-4 align-self-stretc p-0">
                                                          <div class="booking_inner_dtl_h h-100 bdr-left-eee">
                                                            Extra Remarks
                                                          </div>
                                                        </div>
                                                        <div class="col-sm-8 align-self-stretc p-0">
                                                          <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap" title={
                                                            paymentObj.extraRemarks
                                                          }>
                                                            {
                                                              paymentObj.extraRemarks
                                                            }
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            ) : null // Render null for elements that don't match the condition
                                        )}
                                    </div>
                                  </div>
                                </div>}
                            </div>
                          ))}
                        {/* -------- CA Case -------- */}
                        <div className="my-card mt-1">
                          <div className="my-card-body">
                            <div className="row m-0 bdr-btm-eee">
                              <div className="col-lg-12 col-sm-6 p-0">
                                <div class="row m-0">
                                  <div class="col-sm-2 align-self-stretc p-0">
                                    <div class="booking_inner_dtl_h h-100">
                                      CA Case
                                    </div>
                                  </div>
                                  <div class="col-sm-10 align-self-stretc p-0">
                                    <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                      {currentLeadform &&
                                        currentLeadform.caCase}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {currentLeadform &&
                              currentLeadform.caCase !== "No" && (
                                <div className="row m-0 bdr-btm-eee">
                                  <div className="col-lg-4 col-sm-6 p-0">
                                    <div class="row m-0">
                                      <div class="col-sm-6 align-self-stretc p-0">
                                        <div class="booking_inner_dtl_h h-100">
                                          CA's Number
                                        </div>
                                      </div>
                                      <div class="col-sm-6 align-self-stretc p-0">
                                        <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                          {currentLeadform &&
                                            currentLeadform.caNumber}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-4 col-sm-6 p-0">
                                    <div class="row m-0">
                                      <div class="col-sm-4 align-self-stretc p-0">
                                        <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                          CA's Email
                                        </div>
                                      </div>
                                      <div class="col-sm-8 align-self-stretc p-0">
                                        <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                          {currentLeadform &&
                                            currentLeadform.caEmail}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-4 col-sm-6 p-0">
                                    <div class="row m-0">
                                      <div class="col-sm-5 align-self-stretc p-0">
                                        <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                          CA's Commission
                                        </div>
                                      </div>
                                      <div class="col-sm-7 align-self-stretc p-0">
                                        <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                          ₹{" "}
                                          {currentLeadform &&
                                            currentLeadform.caCommission}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>

                        {/* -------- Step 4 ---------*/}
                        <div className="mb-2 mt-3 mul-booking-card-inner-head">
                          <b>Payment Summary:</b>
                        </div>

                        <div className="my-card">
                          <div className="my-card-body">
                            {/* {currentLeadform && currentLeadform.remainingPayments.length !== 0 && currentLeadform.remainingPayments.map((payObj, index) => (
                              <div className="row m-0 bdr-btm-eee">
                                <div className="col-lg-1 col-sm-1 p-0 align-self-stretch">
                                  <div class="row m-0 h-100">
                                    <div class="col align-self-stretch p-0">
                                      <div class="booking_inner_dtl_h h-100 text-center">
                                        {index + 1}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-sm-6 p-0 align-self-stretch">
                                  <div class="row m-0 h-100">
                                    <div class="col-sm-5 align-self-stretch p-0">
                                      <div class="booking_inner_dtl_h h-100 bdr-left-eee">
                                        Total Amount
                                      </div>
                                    </div>
                                    <div class="col-sm-7 align-self-stretch p-0">
                                      <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                        ₹{" "}
                                        {currentLeadform &&
                                          Math.round(
                                            currentLeadform.totalAmount
                                          ).toLocaleString()}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-sm-6 p-0 align-self-stretch">
                                  <div class="row m-0 h-100">
                                    <div class="col-sm-5 align-self-stretch p-0">
                                      <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                        Received Amount
                                      </div>
                                    </div>
                                    {<div class="col-sm-7 align-self-stretch p-0">
                                      <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                        ₹{" "}
                                        {(Math.round(currentLeadform.receivedAmount) -
                                          currentLeadform.remainingPayments
                                            .slice(index, currentLeadform.remainingPayments.length) // Consider objects up to the current index
                                            .reduce((total, pay) => total + Math.round(pay.receivedPayment), 0)).toLocaleString()}
                                      </div>
                                    </div>}


                                  </div>
                                </div>
                                <div className="col-lg-3 col-sm-5 p-0 align-self-stretch">
                                  <div class="row m-0 h-100">
                                    <div class="col-sm-6 align-self-stretch p-0">
                                      <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                        Pending Amount
                                      </div>
                                    </div>
                                    <div class="col-sm-6 align-self-stretch p-0">
                                      <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                        ₹{" "}
                                        {(Math.round(currentLeadform.pendingAmount) +
                                          currentLeadform.remainingPayments
                                            .slice(index, currentLeadform.remainingPayments.length) // Consider objects up to the current index
                                            .reduce((total, pay) => total + Math.round(pay.receivedPayment), 0)).toLocaleString()}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))} */}
                            <div className="row m-0 bdr-btm-eee">
                              {/* <div className="col-lg-1 col-sm-1 p-0 align-self-stretch">
                                <div class="row m-0 h-100">
                                  <div class="col align-self-stretch p-0">
                                    <div class="booking_inner_dtl_h h-100 text-center">
                                      {currentLeadform && (currentLeadform.remainingPayments.length + 1)}
                                    </div>
                                  </div>
                                </div>
                              </div> */}
                              <div className="col-lg-4 col-sm-6 p-0 align-self-stretch">
                                <div class="row m-0 h-100">
                                  <div class="col-sm-5 align-self-stretch p-0">
                                    <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                      Total Amount
                                    </div>
                                  </div>
                                  <div class="col-sm-7 align-self-stretch p-0">
                                    <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                      ₹{" "}
                                      {currentLeadform &&
                                        Math.round(
                                          currentLeadform.totalAmount
                                        ).toLocaleString()}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-4 col-sm-6 p-0 align-self-stretch">
                                <div class="row m-0 h-100">
                                  <div class="col-sm-5 align-self-stretch p-0">
                                    <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                      Received Amount
                                    </div>
                                  </div>
                                  <div class="col-sm-7 align-self-stretch p-0">
                                    <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                      ₹{" "}
                                      {currentLeadform &&
                                        Math.round(
                                          currentLeadform.receivedAmount
                                        ).toLocaleString()}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-4 col-sm-5 p-0 align-self-stretch">
                                <div class="row m-0 h-100">
                                  <div class="col-sm-6 align-self-stretch p-0">
                                    <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                      Pending Amount
                                    </div>
                                  </div>
                                  <div class="col-sm-6 align-self-stretch p-0">
                                    <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                      ₹{" "}
                                      {currentLeadform &&
                                        Math.round(
                                          currentLeadform.pendingAmount
                                        ).toLocaleString()}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="row m-0 bdr-btm-eee">
                              <div className="col-lg-6 col-sm-6 p-0 align-self-stretch">
                                <div class="row m-0 h-100">
                                  <div class="col-sm-4 align-self-stretch p-0">
                                    <div class="booking_inner_dtl_h h-100">
                                      Payment Method
                                    </div>
                                  </div>
                                  <div class="col-sm-8 align-self-stretch p-0">
                                    <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap" title={currentLeadform &&
                                      currentLeadform.paymentMethod}>
                                      {currentLeadform &&
                                        currentLeadform.paymentMethod}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-6 col-sm-6 p-0 align-self-stretch">
                                <div class="row m-0 h-100">
                                  <div class="col-sm-4 align-self-stretch p-0">
                                    <div class="booking_inner_dtl_h h-100 bdr-left-eee">
                                      Extra Remarks
                                    </div>
                                  </div>
                                  <div class="col-sm-8 align-self-stretch p-0">
                                    <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap" title={currentLeadform &&
                                      currentLeadform.extraNotes !== "undefined" ? currentLeadform.extraNotes : "N/A"}>
                                      {currentLeadform &&
                                        currentLeadform.extraNotes !== "undefined" ? currentLeadform.extraNotes : "N/A"}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {currentLeadform &&
                          (currentLeadform.paymentReceipt.length !== 0 ||
                            currentLeadform.otherDocs !== 0) && (
                            <>
                              <div className="mb-2 mt-3 mul-booking-card-inner-head">
                                <b>Payment Receipt and Additional Documents:</b>
                              </div>
                              <div className="row">
                                {currentLeadform.paymentReceipt.length !==
                                  0 && (
                                    <div className="col-sm-2 mb-1">
                                      <div className="booking-docs-preview">
                                        <div
                                          className="booking-docs-preview-img"
                                          onClick={() =>
                                            handleViewPdfReciepts(
                                              currentLeadform.paymentReceipt[0]
                                                .filename,
                                              currentLeadform["Company Name"]
                                            )
                                          }
                                        >
                                          {currentLeadform &&
                                            currentLeadform.paymentReceipt[0] &&
                                            (((currentLeadform.paymentReceipt[0].filename).toLowerCase()).endsWith(
                                              ".pdf"
                                            ) ? (
                                              <PdfImageViewerAdmin
                                                type="paymentrecieptpdf"
                                                path={
                                                  currentLeadform
                                                    .paymentReceipt[0].filename
                                                }
                                                companyName={
                                                  currentLeadform["Company Name"]
                                                }
                                              />
                                            ) : currentLeadform.paymentReceipt[0].filename.endsWith(
                                              ".png"
                                            ) ||
                                              currentLeadform.paymentReceipt[0].filename.endsWith(
                                                ".jpg"
                                              ) ||
                                              currentLeadform.paymentReceipt[0].filename.endsWith(
                                                ".jpeg"
                                              ) ? (
                                              <img
                                                src={`${secretKey}/bookings/recieptpdf/${currentLeadform["Company Name"]}/${currentLeadform.paymentReceipt[0].filename}`}
                                                alt="Receipt Image"
                                              />
                                            ) : (
                                              <img
                                                src={wordimg}
                                                alt="Default Image"
                                              />
                                            ))}
                                        </div>
                                        <div className="booking-docs-preview-text">
                                          <p className="booking-img-name-txtwrap text-wrap m-auto m-0">
                                            Receipt
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                {currentLeadform.remainingPayments.length !==
                                  0 &&
                                  currentLeadform.remainingPayments.some(
                                    (obj) => obj.paymentReceipt.length !== 0
                                  ) &&
                                  currentLeadform.remainingPayments.map((remainingObject, index) => (
                                    remainingObject.paymentReceipt.length !== 0 && (
                                      <div className="col-sm-2 mb-1" key={index}>
                                        <div className="booking-docs-preview">
                                          <div
                                            className="booking-docs-preview-img"
                                            onClick={() =>
                                              handleViewPdfReciepts(
                                                remainingObject.paymentReceipt[0].filename,
                                                currentLeadform["Company Name"]
                                              )
                                            }
                                          >
                                            {((remainingObject.paymentReceipt[0].filename).toLowerCase()).endsWith(".pdf") ? (
                                              <PdfImageViewerAdmin
                                                type="paymentrecieptpdf"
                                                path={remainingObject.paymentReceipt[0].filename}
                                                companyName={currentLeadform["Company Name"]}
                                              />
                                            ) : remainingObject.paymentReceipt[0].filename.endsWith(".png") ||
                                              remainingObject.paymentReceipt[0].filename.endsWith(".jpg") ||
                                              remainingObject.paymentReceipt[0].filename.endsWith(".jpeg") ? (
                                              <img
                                                src={`${secretKey}/bookings/recieptpdf/${currentLeadform["Company Name"]}/${remainingObject.paymentReceipt[0].filename}`}
                                                alt="Receipt Image"
                                              />
                                            ) : (
                                              <img src={wordimg} alt="Default Image" />
                                            )}
                                          </div>
                                          <div className="booking-docs-preview-text">
                                            <p className="booking-img-name-txtwrap text-wrap m-auto m-0">
                                              Remaining Payment
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  ))}

                                {currentLeadform &&
                                  currentLeadform.otherDocs.map((obj) => (
                                    <div className="col-sm-2 mb-1">
                                      <div className="booking-docs-preview">
                                        <div
                                          className="booking-docs-preview-img"
                                          onClick={() =>
                                            handleViewPdOtherDocs(
                                              obj.filename,
                                              currentLeadform["Company Name"]
                                            )
                                          }
                                        >
                                          {((obj.filename).toLowerCase()).endsWith(".pdf") ? (
                                            <PdfImageViewerAdmin
                                              type="pdf"
                                              path={obj.filename}
                                              companyName={
                                                currentLeadform["Company Name"]
                                              }
                                            />
                                          ) : (
                                            <img
                                              src={`${secretKey}/bookings/otherpdf/${currentLeadform["Company Name"]}/${obj.filename}`}
                                              alt={pdfimg}
                                            ></img>
                                          )}
                                        </div>
                                        <div className="booking-docs-preview-text">
                                          <p
                                            className="booking-img-name-txtwrap text-wrap m-auto m-0 text-wrap m-auto m-0"
                                            title={obj.originalname}
                                          >
                                            {obj.originalname}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                {/* ---------- Upload Documents From Preview -----------*/}
                                <div className="col-sm-2 mb-1">
                                  <div
                                    className="booking-docs-preview"
                                    title="Upload More Documents"
                                  >
                                    <div
                                      className="upload-Docs-BTN"
                                      onClick={() => {
                                        setOpenOtherDocs(true);
                                        setSendingIndex(0);
                                      }}
                                    >
                                      <IoAdd />
                                    </div>
                                  </div>
                                </div>

                                <Dialog
                                  open={openOtherDocs}
                                  onClose={closeOtherDocsPopup}
                                  fullWidth
                                  maxWidth="sm"
                                >
                                  <DialogTitle>
                                    Upload Your Attachments
                                    <IconButton
                                      onClick={closeOtherDocsPopup}
                                      style={{ float: "right" }}
                                    >
                                      <CloseIcon color="primary"></CloseIcon>
                                    </IconButton>{" "}
                                  </DialogTitle>
                                  <DialogContent>
                                    <div className="maincon">
                                      {/* Single file input for multiple documents */}
                                      <div
                                        style={{
                                          justifyContent: "space-between",
                                        }}
                                        className="con1 d-flex"
                                      >
                                        <div
                                          style={{ paddingTop: "9px" }}
                                          className="uploadcsv"
                                        >
                                          <label
                                            style={{
                                              margin: "0px 0px 6px 0px",
                                            }}
                                            htmlFor="attachmentfile"
                                          >
                                            Upload Files
                                          </label>
                                        </div>
                                      </div>
                                      <div
                                        style={{ margin: "5px 0px 0px 0px" }}
                                        className="form-control"
                                      >
                                        <input
                                          type="file"
                                          name="attachmentfile"
                                          id="attachmentfile"
                                          onChange={(e) => {
                                            handleOtherDocsUpload(
                                              e.target.files
                                            );
                                          }}
                                          multiple // Allow multiple files selection
                                        />
                                        {selectedDocuments &&
                                          selectedDocuments.length > 0 && (
                                            <div className="uploaded-filename-main d-flex flex-wrap">
                                              {selectedDocuments.map(
                                                (file, index) => (
                                                  <div
                                                    className="uploaded-fileItem d-flex align-items-center"
                                                    key={index}
                                                  >
                                                    <p className="m-0">
                                                      {file.name}
                                                    </p>
                                                    <button
                                                      className="fileItem-dlt-btn"
                                                      onClick={() =>
                                                        handleRemoveFile(index)
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
                                  </DialogContent>
                                  <button
                                    className="btn btn-primary"
                                    onClick={handleotherdocsAttachment}
                                  >
                                    Submit
                                  </button>
                                </Dialog>
                              </div>
                            </>
                          )}
                      </div>

                      {/* ------------------------------------------ Multiple Booking Section Starts here ----------------------------- */}
                      {currentLeadform &&
                        currentLeadform.moreBookings.length !== 0 &&
                        currentLeadform.moreBookings.map((objMain, BookingIndex) => (
                          <>
                            <div className="row align-items-center m-0 justify-content-between mb-1 mt-3">
                              <div className="mul_booking_heading col-6">
                                <b>Booking {BookingIndex + 2}</b>
                              </div>
                              <div className="mul_booking_date col-6">
                                <b>{formatDatePro(objMain.bookingDate)}</b>
                              </div>
                            </div>
                            <div className="mul-booking-card mt-2">
                              {/* -------- Step 2 ---------*/}
                              <div className="mb-2 mul-booking-card-inner-head d-flex justify-content-between">
                                <b>Booking Details:</b>
                                <div className="Services_Preview_action d-flex">
                                  <div
                                    className="Services_Preview_action_edit mr-2"
                                    onClick={() => {
                                      setbookingIndex(BookingIndex + 1);
                                      setEditBookingOpen(true);
                                    }}
                                  >
                                    <MdModeEdit />
                                  </div>
                                  <div
                                    onClick={() =>
                                      handleDeleteBooking(
                                        currentLeadform.company,
                                        objMain._id,
                                      )
                                    }
                                    className="Services_Preview_action_delete"
                                  >
                                    <MdDelete />
                                  </div>
                                </div>
                              </div>
                              <div className="my-card">
                                <div className="my-card-body">
                                  <div className="row m-0 bdr-btm-eee">
                                    <div className="col-lg-4 col-sm-6 p-0">
                                      <div class="row m-0">
                                        <div class="col-sm-4 align-self-stretch p-0">
                                          <div class="booking_inner_dtl_h h-100">
                                            BDE Name
                                          </div>
                                        </div>
                                        <div class="col-sm-8 align-self-stretch p-0">
                                          <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                            {objMain.bdeName}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-lg-4 col-sm-6 p-0">
                                      <div class="row m-0">
                                        <div class="col-sm-4 align-self-stretch p-0">
                                          <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                            BDE Email
                                          </div>
                                        </div>
                                        <div class="col-sm-8 align-self-stretch p-0">
                                          <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                            {objMain.bdeEmail}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-lg-4 col-sm-6 p-0">
                                      <div class="row m-0">
                                        <div class="col-sm-4 align-self-stretch p-0">
                                          <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                            BDM Name
                                          </div>
                                        </div>
                                        <div class="col-sm-8 align-self-stretch p-0">
                                          <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                            <span>
                                              <i>{objMain.bdmType === "Close-by" ? "Closed-by" : "Supported-by"}</i>
                                            </span>{" "}
                                            {objMain.bdmName}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row m-0 bdr-btm-eee">
                                    <div className="col-lg-4 col-sm-6 p-0">
                                      <div class="row m-0">
                                        <div class="col-sm-4 align-self-stretch p-0">
                                          <div class="booking_inner_dtl_h h-100">
                                            BDM Email
                                          </div>
                                        </div>
                                        <div class="col-sm-8 align-self-stretch p-0">
                                          <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                            {objMain.bdmEmail}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-lg-4 col-sm-6 p-0">
                                      <div class="row m-0">
                                        <div class="col-sm-4 align-self-stretch p-0">
                                          <div class="booking_inner_dtl_h h-100 bdr-left-eee">
                                            Booking Date{" "}
                                          </div>
                                        </div>
                                        <div class="col-sm-8 align-self-stretch p-0">
                                          <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                            {objMain.bookingDate}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-lg-4 col-sm-6 p-0">
                                      <div class="row m-0">
                                        <div class="col-sm-4 align-self-stretch p-0">
                                          <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                            Lead Source
                                          </div>
                                        </div>
                                        <div class="col-sm-8 align-self-stretch p-0">
                                          <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                            {objMain.bookingSource === "Other"
                                              ? objMain.otherBookingSource
                                              : objMain.bookingSource}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* -------- Step 3 ---------*/}
                              <div className="mb-2 mt-3 mul-booking-card-inner-head">
                                <b>Services And Payment Details:</b>
                              </div>
                              <div className="my-card">
                                <div className="my-card-body">
                                  <div className="row m-0 bdr-btm-eee">
                                    <div className="col-lg-6 col-sm-6 p-0">
                                      <div class="row m-0">
                                        <div class="col-sm-4 align-self-stretch p-0">
                                          <div class="booking_inner_dtl_h h-100">
                                            No. Of Services
                                          </div>
                                        </div>
                                        <div class="col-sm-8 align-self-stretch p-0">
                                          <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                            {objMain.services.length}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {objMain.services.map((obj, index) => (
                                <div className="my-card mt-1">
                                  <div className="my-card-body">
                                    <div className="row m-0 bdr-btm-eee">
                                      <div className="col-lg-6 col-sm-6 p-0">
                                        <div class="row m-0">
                                          <div class="col-sm-4 align-self-stretch p-0">
                                            <div class="booking_inner_dtl_h h-100">
                                              {getOrdinal(index + 1)} Services
                                              Name
                                            </div>
                                          </div>
                                          <div class="col-sm-8 align-self-stretch p-0">
                                            <div class="booking_inner_dtl_b bdr-left-eee h-100 services-name">
                                              {obj.serviceName}{" "}
                                              {obj.withDSC &&
                                                obj.serviceName ===
                                                "Start-Up India Certificate" &&
                                                "With DSC"}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-lg-6 col-sm-6 p-0">
                                        <div class="row m-0">
                                          <div class="col-sm-4 align-self-stretch p-0">
                                            <div class="booking_inner_dtl_h h-100 bdr-left-eee">
                                              Total Amount
                                            </div>
                                          </div>
                                          <div class="col-sm-8 align-self-stretch p-0">
                                            <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                              <div className="d-flex align-item-center justify-content-between">
                                                <div>
                                                  ₹{" "}
                                                  {Math.round(
                                                    obj.totalPaymentWGST
                                                  ).toLocaleString()}
                                                  {"("}
                                                  {obj.totalPaymentWGST !==
                                                    obj.totalPaymentWOGST
                                                    ? "With GST"
                                                    : "Without GST"}
                                                  {")"}
                                                </div>
                                                {/* --------------------------------------------------------------   ADD Expanses Section  --------------------------------------------------- */}
                                                <div>
                                                  <button onClick={() => functionOpenAddExpanse(BookingIndex + 1, obj.serviceName, obj._id)} className="btn btn-link btn-small">
                                                    + Expanse
                                                  </button>

                                                </div>

                                                {/* -------------------------------------   Expanse Section Ends Here  -------------------------------------------------- */}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="row m-0 bdr-btm-eee">
                                      <div className="col-lg-6 col-sm-5 p-0">
                                        <div class="row m-0">
                                          <div class="col-sm-4 align-self-stretch p-0">
                                            <div class="booking_inner_dtl_h h-100">
                                              Payment Terms
                                            </div>
                                          </div>
                                          <div class="col-sm-8 align-self-stretch p-0">
                                            <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                              {obj.paymentTerms}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-lg-6 col-sm-5 p-0">
                                        <div class="row m-0">
                                          <div class="col-sm-3 align-self-stretch p-0">
                                            <div class="booking_inner_dtl_h h-100 bdr-left-eee">
                                              Notes
                                            </div>
                                          </div>
                                          <div class="col-sm-9 align-self-stretch p-0">
                                            <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap" title={obj.paymentRemarks
                                              ? obj.paymentRemarks
                                              : "N/A"}>
                                              {obj.paymentRemarks
                                                ? obj.paymentRemarks
                                                : "N/A"}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    {obj.expanse && obj.expanse !== 0 && <div className="row m-0 bdr-btm-eee">
                                      <div className="col-lg-6 col-sm-2 p-0">
                                        <div class="row m-0">
                                          <div class="col-sm-4 align-self-stretch p-0">
                                            <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                              Expanses
                                            </div>
                                          </div>
                                          <div class="col-sm-8 align-self-stretch p-0">
                                            <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                              - ₹ {obj.expanse ? (obj.expanse).toLocaleString() : "N/A"}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-lg-6 col-sm-2 p-0">
                                        <div class="row m-0">
                                          <div class="col-sm-6 align-self-stretch p-0">
                                            <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                              Expanses Date
                                            </div>
                                          </div>
                                          <div class="col-sm-6 align-self-stretch p-0">
                                            <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                              {(() => {
                                                const dateToFormat = obj.expanseDate ? obj.expanseDate : currentLeadform.bookingDate;
                                                console.log('Formatting date:', dateToFormat);
                                                return formatDatePro(dateToFormat);
                                              })()}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>}
                                    <div className="row m-0 bdr-btm-eee">
                                      {obj.paymentTerms === "two-part" && (
                                        <div className="col-lg-6 col-sm-6 p-0">
                                          <div class="row m-0">
                                            <div class="col-sm-4 align-self-stretch p-0">
                                              <div class="booking_inner_dtl_h h-100">
                                                First payment
                                              </div>
                                            </div>
                                            <div class="col-sm-8 align-self-stretch p-0">
                                              <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                                ₹{" "}
                                                {Math.round(
                                                  obj.firstPayment
                                                ).toLocaleString()}
                                                /-
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                      {obj.secondPayment !== 0 && (
                                        <div className="col-lg-6 col-sm-6 p-0">
                                          <div class="row m-0">
                                            <div class="col-sm-4 align-self-stretch p-0">
                                              <div class="booking_inner_dtl_h h-100 bdr-left-eee">
                                                Second Payment
                                              </div>
                                            </div>
                                            <div class="col-sm-8 align-self-stretch p-0">
                                              <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                                <div className="d-flex align-items-center justify-content-between">
                                                  <div>
                                                    ₹
                                                    {Math.round(
                                                      obj.secondPayment
                                                    ).toLocaleString()}
                                                    /- {"("}
                                                    {isNaN(
                                                      new Date(
                                                        obj.secondPaymentRemarks
                                                      )
                                                    )
                                                      ? obj.secondPaymentRemarks
                                                      : "On " +
                                                      obj.secondPaymentRemarks +
                                                      ")"}
                                                  </div>
                                                  <div>
                                                    <div
                                                      className="add-remaining-amnt"
                                                      title="Add Remaining Payment"
                                                      style={{
                                                        display:
                                                          objMain.remainingPayments.length !== 0 &&
                                                            objMain.remainingPayments.filter(
                                                              (item) => item.serviceName === obj.serviceName
                                                            ).length > 0
                                                            ? "none"
                                                            : "block",
                                                      }}
                                                      onClick={() =>
                                                        functionOpenRemainingPayment(
                                                          obj,
                                                          "secondPayment",
                                                          currentLeadform[
                                                          "Company Name"
                                                          ],
                                                          BookingIndex + 1
                                                        )
                                                      }
                                                    >
                                                      +
                                                    </div>
                                                  </div>
                                                  {objMain.remainingPayments.length !== 0 && objMain.remainingPayments.filter((pay) => pay.serviceName === obj.serviceName).length === 1 && <div className="edit-remaining">
                                                    <IconButton onClick={() => {
                                                      setIsUpdateMode(true)
                                                      setTempUpdateMode(true)
                                                      functionOpenRemainingPayment(
                                                        obj,
                                                        "secondPayment",
                                                        currentLeadform[
                                                        "Company Name"
                                                        ], BookingIndex + 1,
                                                        objMain.remainingPayments.filter(boom => boom.serviceName === obj.serviceName)[0],
                                                      )
                                                    }
                                                    }>
                                                      <MdModeEdit style={{ height: '14px', width: '14px' }} />
                                                    </IconButton>
                                                  </div>}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                    <div className="row m-0 bdr-btm-eee">
                                      {obj.thirdPayment !== 0 && (
                                        <div className="col-lg-6 col-sm-6 p-0">
                                          <div class="row m-0">
                                            <div class="col-sm-4 align-self-stretch p-0">
                                              <div class="booking_inner_dtl_h h-100">
                                                Third Payment
                                              </div>
                                            </div>
                                            <div class="col-sm-8 align-self-stretch p-0">
                                              <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                                <div className="d-flex align-items-center justify-content-between">
                                                  <div>
                                                    ₹{" "}
                                                    {Math.round(
                                                      obj.thirdPayment
                                                    ).toLocaleString()}
                                                    /- {"("}
                                                    {isNaN(
                                                      new Date(
                                                        obj.thirdPaymentRemarks
                                                      )
                                                    )
                                                      ? obj.thirdPaymentRemarks
                                                      : "On " +
                                                      obj.thirdPaymentRemarks +
                                                      ")"}
                                                  </div>
                                                  <div>
                                                    <div
                                                      className="add-remaining-amnt"
                                                      title="Add Remaining Payment"
                                                      style={{
                                                        display:
                                                          objMain.remainingPayments.length !== 0 &&
                                                            objMain.remainingPayments.filter(
                                                              (item) => item.serviceName === obj.serviceName
                                                            ).length > 1
                                                            ? "none"
                                                            : "block",
                                                      }}
                                                      onClick={() =>
                                                        functionOpenRemainingPayment(
                                                          obj,
                                                          "thirdPayment",
                                                          currentLeadform[
                                                          "Company Name"
                                                          ],
                                                          BookingIndex + 1
                                                        )
                                                      }
                                                    >
                                                      +
                                                    </div>
                                                  </div>
                                                  {objMain.remainingPayments.length !== 0 && objMain.remainingPayments.filter((pay) => pay.serviceName === obj.serviceName).length === 2 && <div className="edit-remaining">
                                                    <IconButton onClick={() => {
                                                      setIsUpdateMode(true)
                                                      setTempUpdateMode(true)
                                                      functionOpenRemainingPayment(
                                                        obj,
                                                        "thirdPayment",
                                                        currentLeadform[
                                                        "Company Name"
                                                        ], BookingIndex + 1,
                                                        objMain.remainingPayments.filter(boom => boom.serviceName === obj.serviceName)[1],
                                                      )
                                                    }
                                                    }>
                                                      <MdModeEdit style={{ height: '14px', width: '14px' }} />
                                                    </IconButton>
                                                  </div>}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                      {obj.fourthPayment !== 0 && (
                                        <div className="col-lg-6 col-sm-6 p-0">
                                          <div class="row m-0">
                                            <div class="col-sm-4 align-self-stretch p-0">
                                              <div class="booking_inner_dtl_h h-100 bdr-left-eee">
                                                Fourth Payment
                                              </div>
                                            </div>
                                            <div class="col-sm-8 align-self-stretch p-0">
                                              <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                                <div className="d-flex align-items-center justify-content-between">
                                                  <div>
                                                    ₹{" "}
                                                    {Math.round(
                                                      obj.fourthPayment
                                                    ).toLocaleString()}{" "}
                                                    /- {"("}
                                                    {isNaN(
                                                      new Date(
                                                        obj.fourthPaymentRemarks
                                                      )
                                                    )
                                                      ? obj.fourthPaymentRemarks
                                                      : "On " +
                                                      obj.fourthPaymentRemarks +
                                                      ")"}
                                                  </div>
                                                  <div>
                                                    <div
                                                      className="add-remaining-amnt"
                                                      title="Add Remaining Payment"
                                                      style={{
                                                        display:
                                                          currentLeadform.remainingPayments.length !== 0 &&
                                                            currentLeadform.remainingPayments.filter(
                                                              (item) => item.serviceName === obj.serviceName
                                                            ).length === 3
                                                            ? "none"
                                                            : "block",
                                                      }}
                                                      onClick={() =>
                                                        functionOpenRemainingPayment(
                                                          obj,
                                                          "fourthPayment",
                                                          currentLeadform[
                                                          "Company Name"
                                                          ],
                                                          BookingIndex + 1
                                                        )
                                                      }
                                                    >
                                                      +
                                                    </div>
                                                  </div>
                                                  {objMain.remainingPayments.length !== 0 && objMain.remainingPayments.filter((pay) => pay.serviceName === obj.serviceName).length === 3 && <div className="edit-remaining">
                                                    <IconButton onClick={() => {
                                                      setIsUpdateMode(true)
                                                      setTempUpdateMode(true)
                                                      functionOpenRemainingPayment(
                                                        obj,
                                                        "fourthPayment",
                                                        currentLeadform[
                                                        "Company Name"
                                                        ], BookingIndex + 1,
                                                        objMain.remainingPayments.filter(boom => boom.serviceName === obj.serviceName)[2],
                                                      )
                                                    }
                                                    }>
                                                      <MdModeEdit style={{ height: '14px', width: '14px' }} />
                                                    </IconButton>
                                                  </div>}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  {objMain.remainingPayments.length !== 0 && objMain.remainingPayments.some((boom) => boom.serviceName === obj.serviceName) &&
                                    <div
                                      className="my-card-body accordion"
                                      id={`accordionExample${index}`}
                                    >
                                      <div class="accordion-item bdr-none">
                                        <div
                                          id={`headingOne${index}`}
                                          className="pr-10 accordion-header"
                                        >
                                          <div
                                            className="row m-0 bdr-btm-eee accordion-button p-0"
                                            data-bs-toggle="collapse"
                                            data-bs-target={`#collapseOne${index}`}
                                            aria-expanded="true"
                                            aria-controls={`collapseOne${index}`}
                                          >
                                            <div className="w-95 p-0">
                                              <div className="booking_inner_dtl_h h-100 d-flex align-items-center justify-content-between">
                                                <div>Remaining Payment </div>
                                                {parseInt(objMain.pendingAmount) !== 0 && <div
                                                  className="add-remaining-amnt ml-1"
                                                  title="Add Remaining Payment"
                                                  onClick={() =>
                                                    functionOpenRemainingPayment(
                                                      obj,
                                                      "otherPayment",
                                                      currentLeadform[
                                                      "Company Name"
                                                      ],
                                                      BookingIndex + 1
                                                    )
                                                  }
                                                >
                                                  +
                                                </div>}

                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div
                                          id={`collapseOne${index}`}
                                          class="accordion-collapse collapse show"
                                          aria-labelledby={`headingOne${index}`}
                                          data-bs-parent="#accordionExample"
                                        // Add a unique key prop for each rendered element
                                        >
                                          {objMain.remainingPayments
                                            .length !== 0 && objMain.remainingPayments.filter(boom => boom.serviceName === obj.serviceName).map(
                                              (paymentObj, index) =>
                                                paymentObj.serviceName ===
                                                  obj.serviceName ? (
                                                  <div class="accordion-body bdr-none p-0">
                                                    <div>
                                                      <div className="row m-0 bdr-btm-eee bdr-top-eee">
                                                        <div className="col-lg-12 col-sm-6 p-0 align-self-stretc bg-fffafa">
                                                          <div class="booking_inner_dtl_h h-100 d-flex align-items-center justify-content-between">
                                                            <div>
                                                              {objMain.remainingPayments.length !== 0 &&
                                                                (() => {
                                                                  if (index === 0) return "Second ";
                                                                  else if (index === 1) return "Third ";
                                                                  else if (index === 2) return "Fourth ";
                                                                  else if (index > 2) return "Other ";
                                                                  // Add more conditions as needed
                                                                  return ""; // Return default value if none of the conditions match
                                                                })()}
                                                              Remaining Payment
                                                            </div>
                                                            <div className="d-flex align-items-center">
                                                              <div>
                                                                {"(" + formatDatePro(paymentObj.publishDate ? paymentObj.publishDate : paymentObj.paymentDate) + ")"}
                                                              </div>

                                                              {
                                                                <IconButton onClick={() => functionDeleteRemainingPayment(BookingIndex + 1, obj.serviceName)}>
                                                                  <MdDelete style={{ height: '14px', width: '14px', color: '#be1e1e' }} />
                                                                </IconButton>
                                                              }
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                      <div className="row m-0 bdr-btm-eee">
                                                        <div className="col-lg-3 col-sm-6 p-0 align-self-stretc">
                                                          <div class="row m-0 h-100">
                                                            <div class="col-sm-5 align-self-stretc p-0">
                                                              <div class="booking_inner_dtl_h h-100">
                                                                Amount
                                                              </div>
                                                            </div>
                                                            <div class="col-sm-7 align-self-stretc p-0">
                                                              <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                                                ₹{" "}
                                                                {paymentObj.receivedPayment.toLocaleString()}
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                        <div className="col-lg-3 col-sm-6 p-0 align-self-stretc">
                                                          <div class="row m-0 h-100">
                                                            <div class="col-sm-5 align-self-stretc p-0">
                                                              <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                                                Pending
                                                              </div>
                                                            </div>
                                                            <div class="col-sm-7 align-self-stretc p-0">
                                                              <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                                                ₹{" "}
                                                                {objMain.remainingPayments.length !== 0 &&
                                                                  (() => {
                                                                    const filteredPayments = objMain.remainingPayments.filter(
                                                                      (pay) => pay.serviceName === obj.serviceName
                                                                    );

                                                                    const filteredLength = filteredPayments.length;
                                                                    if (index === 0) return Math.round(obj.totalPaymentWGST) - Math.round(obj.firstPayment) - Math.round(paymentObj.receivedPayment);
                                                                    else if (index === 1) return Math.round(obj.totalPaymentWGST) - Math.round(obj.firstPayment) - Math.round(paymentObj.receivedPayment) - Math.round(filteredPayments[0].receivedPayment);
                                                                    else if (index === 2) return Math.round(objMain.pendingAmount);
                                                                    // Add more conditions as needed
                                                                    return ""; // Return default value if none of the conditions match
                                                                  })()}
                                                                {/* {index === 0
                                                              ? Math.round(obj.totalPaymentWGST) - Math.round(obj.firstPayment) - Math.round(paymentObj.receivedPayment)
                                                              : index === 1
                                                              ? Math.round(obj.totalPaymentWGST) - Math.round(obj.firstPayment) - Math.round(paymentObj.receivedPayment) - Math.round(currentLeadform.remainingPayments[0].receivedPayment)
                                                              : Math.round(currentLeadform.pendingAmount)} */}
                                                              </div>

                                                            </div>
                                                          </div>
                                                        </div>
                                                        <div className="col-lg-6 col-sm-6 p-0 align-self-stretc">
                                                          <div class="row m-0 h-100">
                                                            <div class="col-sm-5 align-self-stretc p-0">
                                                              <div class="booking_inner_dtl_h h-100 bdr-left-eee">
                                                                Payment Date
                                                              </div>
                                                            </div>
                                                            <div class="col-sm-7 align-self-stretc p-0">
                                                              <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap">
                                                                {formatDatePro(
                                                                  paymentObj.paymentDate
                                                                )}
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                      <div className="row m-0 bdr-btm-eee">
                                                        <div className="col-lg-6 col-sm-6 p-0 align-self-stretc">
                                                          <div class="row m-0 h-100">
                                                            <div class="col-sm-5 align-self-stretc p-0">
                                                              <div class="booking_inner_dtl_h h-100 bdr-left-eee">
                                                                Payment Method
                                                              </div>
                                                            </div>
                                                            <div class="col-sm-7 align-self-stretc p-0">
                                                              <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap" title={
                                                                paymentObj.paymentMethod
                                                              }>
                                                                {
                                                                  paymentObj.paymentMethod
                                                                }
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                        <div className="col-lg-6 col-sm-6 p-0 align-self-stretc">
                                                          <div class="row m-0 h-100">
                                                            <div class="col-sm-4 align-self-stretc p-0">
                                                              <div class="booking_inner_dtl_h h-100">
                                                                Extra Remarks
                                                              </div>
                                                            </div>
                                                            <div class="col-sm-8 align-self-stretc p-0">
                                                              <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap" title={
                                                                paymentObj.extraRemarks
                                                              }>
                                                                {
                                                                  paymentObj.extraRemarks
                                                                }
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                ) : null // Render null for elements that don't match the condition
                                            )}
                                        </div>
                                      </div>
                                    </div>}
                                </div>
                              ))}

                              {/* -------- CA Case -------- */}
                              <div className="my-card mt-1">
                                <div className="my-card-body">
                                  <div className="row m-0 bdr-btm-eee">
                                    <div className="col-lg-12 col-sm-6 p-0">
                                      <div class="row m-0">
                                        <div class="col-sm-2 align-self-stretc p-0">
                                          <div class="booking_inner_dtl_h h-100">
                                            CA Case
                                          </div>
                                        </div>
                                        <div class="col-sm-10 align-self-stretc p-0">
                                          <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                            {objMain.caCase}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {objMain.caCase !== "No" && (
                                    <div className="row m-0 bdr-btm-eee">
                                      <div className="col-lg-4 col-sm-6 p-0">
                                        <div class="row m-0">
                                          <div class="col-sm-5 align-self-stretc p-0">
                                            <div class="booking_inner_dtl_h h-100">
                                              CA's Number
                                            </div>
                                          </div>
                                          <div class="col-sm-7 align-self-stretc p-0">
                                            <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                              {objMain.caNumber}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-lg-4 col-sm-6 p-0">
                                        <div class="row m-0">
                                          <div class="col-sm-4 align-self-stretc p-0">
                                            <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                              CA's Email
                                            </div>
                                          </div>
                                          <div class="col-sm-8 align-self-stretc p-0">
                                            <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                              {objMain.caEmail}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-lg-4 col-sm-6 p-0">
                                        <div class="row m-0">
                                          <div class="col-sm-5 align-self-stretc p-0">
                                            <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                              CA's Commission
                                            </div>
                                          </div>
                                          <div class="col-sm-7 align-self-stretc p-0">
                                            <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                              ₹ {objMain.caCommission}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* -------- Step 4 ---------*/}
                              <div className="mb-2 mt-3 mul-booking-card-inner-head">
                                <b>Payment Summary:</b>
                              </div>
                              <div className="my-card">
                                <div className="my-card-body">
                                  <div className="row m-0 bdr-btm-eee">
                                    <div className="col-lg-4 col-sm-6 p-0">
                                      <div class="row m-0">
                                        <div class="col-sm-5 align-self-stretchh p-0">
                                          <div class="booking_inner_dtl_h h-100">
                                            Total Amount
                                          </div>
                                        </div>
                                        <div class="col-sm-7 align-self-stretchh p-0">
                                          <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                            ₹{" "}
                                            {Math.round(
                                              objMain.totalAmount
                                            ).toLocaleString()}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-lg-4 col-sm-6 p-0">
                                      <div class="row m-0">
                                        <div class="col-sm-5 align-self-stretch p-0">
                                          <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                            Received Amount
                                          </div>
                                        </div>
                                        <div class="col-sm-7 align-self-stretch p-0">
                                          <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                            ₹{" "}
                                            {Math.round(
                                              objMain.receivedAmount
                                            ).toLocaleString()}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-lg-4 col-sm-6 p-0">
                                      <div class="row m-0">
                                        <div class="col-sm-5 align-self-stretch p-0">
                                          <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                            Pending Amount
                                          </div>
                                        </div>
                                        <div class="col-sm-7 align-self-stretch p-0">
                                          <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                            ₹{" "}
                                            {Math.round(
                                              objMain.pendingAmount
                                            ).toLocaleString()}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row m-0 bdr-btm-eee">
                                    <div className="col-lg-6 col-sm-6 p-0">
                                      <div class="row m-0">
                                        <div class="col-sm-4 align-self-stretch p-0">
                                          <div class="booking_inner_dtl_h h-100">
                                            Payment Method
                                          </div>
                                        </div>
                                        <div class="col-sm-8 align-self-stretch p-0">
                                          <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap" title={objMain.paymentMethod}>
                                            {objMain.paymentMethod}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-sm-6 p-0">
                                      <div class="row m-0">
                                        <div class="col-sm-4 align-self-stretch p-0">
                                          <div class="booking_inner_dtl_h h-100 bdr-left-eee">
                                            Extra Remarks
                                          </div>
                                        </div>
                                        <div class="col-sm-8 align-self-stretch p-0">
                                          <div class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap" title="{objMain.extraNotes}">
                                            {objMain.extraNotes}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="mb-2 mt-3 mul-booking-card-inner-head">
                                <b>Payment Receipt and Additional Documents:</b>
                              </div>

                              <div className="row">
                                {objMain.paymentReceipt &&
                                  objMain.paymentReceipt.length !== 0 && (
                                    <div className="col-sm-2 mb-1">
                                      <div className="booking-docs-preview">
                                        <div
                                          className="booking-docs-preview-img"
                                          onClick={() =>
                                            handleViewPdfReciepts(
                                              objMain.paymentReceipt[0]
                                                .filename,
                                              currentLeadform["Company Name"]
                                            )
                                          }
                                        >
                                          {((objMain.paymentReceipt[0].filename).toLowerCase()).endsWith(
                                            ".pdf"
                                          ) ? (
                                            <PdfImageViewerAdmin
                                              type="paymentrecieptpdf"
                                              path={
                                                objMain.paymentReceipt[0]
                                                  .filename
                                              }
                                              companyName={
                                                currentLeadform["Company Name"]
                                              }
                                            />
                                          ) : (
                                            <img
                                              src={`${secretKey}/bookings/recieptpdf/${currentLeadform["Company Name"]}/${objMain.paymentReceipt[0].filename}`}
                                              alt={"MyImg"}
                                            ></img>
                                          )}
                                        </div>
                                        <div className="booking-docs-preview-text">
                                          <p className="booking-img-name-txtwrap text-wrap m-auto m-0">
                                            Receipt.pdf
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                {objMain.otherDocs.map((obj) => (
                                  <div className="col-sm-2 mb-1">
                                    <div className="booking-docs-preview">
                                      <div
                                        className="booking-docs-preview-img"
                                        onClick={() =>
                                          handleViewPdOtherDocs(
                                            obj.filename,
                                            currentLeadform["Company Name"]
                                          )
                                        }
                                      >
                                        {((obj.filename).toLowerCase()).endsWith(".pdf") ? (
                                          <PdfImageViewerAdmin
                                            type="pdf"
                                            path={obj.filename}
                                            companyName={
                                              currentLeadform["Company Name"]
                                            }
                                          />
                                        ) : (
                                          <img
                                            src={`${secretKey}/bookings/otherpdf/${currentLeadform["Company Name"]}/${obj.filename}`}
                                            alt={pdfimg}
                                          ></img>
                                        )}
                                      </div>
                                      <div className="booking-docs-preview-text">
                                        <p
                                          className="booking-img-name-txtwrap text-wrap m-auto m-0"
                                          title={obj.originalname}
                                        >
                                          {obj.originalname}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}

                                <div className="col-sm-2 mb-1">
                                  <div
                                    className="booking-docs-preview"
                                    title="Upload More Documents"
                                  >
                                    <div
                                      className="upload-Docs-BTN"
                                      onClick={() => {
                                        setOpenOtherDocs(true);
                                        setSendingIndex(BookingIndex + 1);
                                      }}
                                    >
                                      <IoAdd />
                                    </div>
                                  </div>
                                </div>

                                <Dialog
                                  open={openOtherDocs}
                                  onClose={closeOtherDocsPopup}
                                  fullWidth
                                  maxWidth="sm"
                                >
                                  <DialogTitle>
                                    Upload Your Attachments
                                    <IconButton
                                      onClick={closeOtherDocsPopup}
                                      style={{ float: "right" }}
                                    >
                                      <CloseIcon color="primary"></CloseIcon>
                                    </IconButton>{" "}
                                  </DialogTitle>
                                  <DialogContent>
                                    <div className="maincon">
                                      {/* Single file input for multiple documents */}
                                      <div
                                        style={{
                                          justifyContent: "space-between",
                                        }}
                                        className="con1 d-flex"
                                      >
                                        <div
                                          style={{ paddingTop: "9px" }}
                                          className="uploadcsv"
                                        >
                                          <label
                                            style={{
                                              margin: "0px 0px 6px 0px",
                                            }}
                                            htmlFor="attachmentfile"
                                          >
                                            Upload Files
                                          </label>
                                        </div>
                                      </div>
                                      <div
                                        style={{ margin: "5px 0px 0px 0px" }}
                                        className="form-control"
                                      >
                                        <input
                                          type="file"
                                          name="attachmentfile"
                                          id="attachmentfile"
                                          onChange={(e) => {
                                            handleOtherDocsUpload(
                                              e.target.files
                                            );
                                          }}
                                          multiple // Allow multiple files selection
                                        />
                                        {selectedDocuments &&
                                          selectedDocuments.length > 0 && (
                                            <div className="uploaded-filename-main d-flex flex-wrap">
                                              {selectedDocuments.map(
                                                (file, index) => (
                                                  <div
                                                    className="uploaded-fileItem d-flex align-items-center"
                                                    key={index}
                                                  >
                                                    <p className="m-0">
                                                      {file.name}
                                                    </p>
                                                    <button
                                                      className="fileItem-dlt-btn"
                                                      onClick={() =>
                                                        handleRemoveFile(index)
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
                                  </DialogContent>
                                  <button
                                    className="btn btn-primary"
                                    onClick={handleotherdocsAttachment}
                                  >
                                    Submit
                                  </button>
                                </Dialog>
                              </div>
                            </div>
                          </>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {bookingFormOpen && (
        <>
          <AdminBookingForm
            // matured={true}
            // companysId={companyId}
            //setDataStatus={setdataStatus}
            setFormOpen={setBookingFormOpen}
            //companysName={companyName}
            // companysEmail={companyEmail}
            // companyNumber={companyNumber}
            setNowToFetch={setNowToFetch}
          // companysInco={companyInco}
          // employeeName={data.ename}
          // employeeEmail={data.email}
          />
        </>
      )}
      {EditBookingOpen && bookingIndex !== -1 && (
        <>
          <EditableMoreBooking
            setFormOpen={setEditBookingOpen}
            bookingIndex={bookingIndex}
            isAdmin={isAdmin}
            setNowToFetch={setNowToFetch}
            companysName={currentLeadform["Company Name"]}
            companysEmail={currentLeadform["Company Email"]}
            companyNumber={currentLeadform["Company Number"]}
            companysInco={currentLeadform.incoDate}
            employeeName={currentLeadform.bdeName}
            employeeEmail={currentLeadform.bdeEmail}
          />
        </>
      )}
      {addFormOpen && (
        <>
          {" "}
          <AddLeadForm
            setFormOpen={setAddFormOpen}
            companysName={currentLeadform["Company Name"]}
            setNowToFetch={setNowToFetch}
            employeeName={currentLeadform.bdeName}
            employeeEmail={currentLeadform.bdeEmail}
          />
        </>
      )}
      <Dialog
        open={openRemainingPayment}
        onClose={() => {
          setOpenRemainingPayment(false)
          setIsUpdateMode(false)
          setTempUpdateMode(false)
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          <div className="d-flex align-items-center justify-content-between">
            <div className="remaining-payment-heading">
              <h2 className="m-0"> Remaining Payment</h2>
            </div>
            <div className="remaining-payment-close">
              {tempUpdateMode && <IconButton onClick={() => setIsUpdateMode(false)}>
                <MdModeEdit />
              </IconButton>}
              <IconButton onClick={() => {
                setOpenRemainingPayment(false)
                setIsUpdateMode(false)
                setTempUpdateMode(false)
              }}>
                <CloseIcon />
              </IconButton>
            </div>
          </div>
        </DialogTitle>
        <DialogContent>
          <div className="container">
            <div className="row mb-1">
              <div className="col-sm-6">
                <label htmlFor="remaining-service-name" className="form-label">
                  Service Name :
                </label>
                <div className="col">
                  <select
                    value={
                      remainingObject["Company Name"] !== "" &&
                      remainingObject.serviceName
                    }
                    name="remaining-service-name"
                    id="remaining-service-name"
                    className="form-select"
                    disabled
                  >
                    <option
                      value={
                        remainingObject["Company Name"] !== "" &&
                        remainingObject.serviceName
                      }
                      selected
                      disabled
                    >
                      {remainingObject["Company Name"] !== "" &&
                        remainingObject.serviceName}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-sm-6">
                <label
                  htmlFor="remaining-payment-proper"
                  className="form-label"
                >
                  Remaining Payment :
                </label>
                <div className="col">
                  <input
                    value={
                      remainingObject["Company Name"] !== "" &&
                      remainingObject.receivedAmount
                    }
                    onChange={(e) =>
                      setRemainingObject({
                        ...remainingObject,
                        receivedAmount: e.target.value,
                      })
                    }
                    type="number"
                    className="form-control"
                    disabled={isUpdateMode}
                    name="remaining-payment-proper"
                    id="remaining-payment-proper"
                    placeholder="Remaining Payment"
                  />
                </div>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-sm-6">
                <label htmlFor="remaining-paymentmethod" className="form-label">
                  Payment Method {<span style={{ color: "red" }}>*</span>} :
                </label>
                <div className="col">
                  <select
                    name="remaining-paymentmethod"
                    value={
                      remainingObject["Company Name"] !== "" &&
                      remainingObject.paymentMethod
                    }
                    id="remaining-paymentmethod"
                    className="form-select"
                    disabled={isUpdateMode}
                    onChange={(e) =>
                      setRemainingObject({
                        ...remainingObject,
                        paymentMethod: e.target.value,
                      })
                    }
                  >
                    <option value="" disabled selected>
                      Select Payment Option
                    </option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    {/* <option value="SRK Seedfund(Non GST)/IDFC first Bank">
                      SRK Seedfund(Non GST)/IDFC first Bank
                    </option> */}
                    <option value="STARTUP SAHAY SERVICES/ADVISORY(Non GST)/ IDFC First Bank">
                      STARTUP SAHAY SERVICES/ADVISORY(Non GST)/ IDFC First Bank
                    </option>
                    <option value="Razorpay">Razorpay</option>
                    <option value="PayU">PayU</option>
                    <option value="Cashfree">Cashfree</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="col-sm-6">
                <label
                  htmlFor="remaining-payment-remarks"
                  className="form-label"
                >
                  Payment Remarks :
                </label>
                <div className="form-control">
                  {remainingObject["Company Name"] !== "" &&
                    remainingObject.paymentRemarks}
                </div>
              </div>
            </div>

            <div className="row mt-2">
              <div className="mb-3 col-sm-6">
                <label htmlFor="remainingDate" className="form-label">
                  Payment Date {<span style={{ color: "red" }}>*</span>} :
                </label>
                <input
                  className="form-control"
                  value={remainingObject.paymentDate}
                  type="date"
                  name="remainingDate"
                  id="remainingDate"
                  disabled={isUpdateMode}
                  onChange={(e) =>
                    setRemainingObject({
                      ...remainingObject,
                      paymentDate: e.target.value,
                    })
                  }
                />
              </div>
              <div className="col-sm-6">
                <div className="mb-1 col">
                  <label htmlFor="remaining-paymentmethod">
                    <b>Upload Receipt :</b>
                  </label>
                </div>
                <div className="col form-control">
                  <input
                    type="file"
                    disabled={isUpdateMode}
                    name="upload-remaining-receipt"
                    id="upload-remaining-receipt"
                    onChange={(e) =>
                      setRemainingObject({
                        ...remainingObject,
                        remainingPaymentReceipt: e.target.files[0],
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="row mt-2">
              <div className="mb-3">
                <label
                  htmlFor="remainingControlTextarea1"
                  className="form-label"
                >
                  Any Remarks
                </label>
                <textarea
                  className="form-control"
                  id="remainingControlTextarea1"
                  rows="3"
                  placeholder="Write your remarks here..."
                  value={remainingObject.extraRemarks}
                  onChange={(e) =>
                    setRemainingObject({
                      ...remainingObject,
                      extraRemarks: e.target.value,
                    })
                  }
                  disabled={isUpdateMode}
                ></textarea>
              </div>
            </div>
          </div>
        </DialogContent>
        <div className="remaining-footer">
          <button
            className="btn btn-primary w-100"
            onClick={handleSubmitMorePayments}
            disabled={isUpdateMode}
          >
            {" "}
            Submit
          </button>
        </div>
      </Dialog>
    </div>
  );
}

export default ManagerBookings;
