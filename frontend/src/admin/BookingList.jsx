import React, { useState, useEffect } from "react";
import Header from "./Header";
import Navbar from "./Navbar";
import AdminBookingForm from "./AdminBookingForm";
import axios from "axios";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import PdfImageViewerAdmin from "./PdfViewerAdmin";
import pdfimg from "../static/my-images/pdf.png";
import { FcList } from "react-icons/fc";
import wordimg from "../static/my-images/word.png";
import RemainingAmnt from "../static/my-images/money.png";
import Nodata from "../components/Nodata";
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import EditableMoreBooking from "./EditableMoreBooking";
import AddLeadForm from "../admin/AddLeadForm.jsx";
import { FaPlus } from "react-icons/fa6";
import { IoAdd } from "react-icons/io5";
import CloseIcon from "@mui/icons-material/Close";
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
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

function BookingList() {
  const [bookingFormOpen, setBookingFormOpen] = useState(false);
  const [sendingIndex, setSendingIndex] = useState(0);
  const [open, openchange] = useState(false);
  const [EditBookingOpen, setEditBookingOpen] = useState(false);
  const [addFormOpen, setAddFormOpen] = useState(false);
  const [excelData, setExcelData] = useState([]);
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
  const [openOtherDocs, setOpenOtherDocs] = useState(false);
  const [data, setData] = useState([]);
  const [companyName, setCompanyName] = "";
  const [openBacdrop, setOpenBacdrop] = useState(false);
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
    document.title = `Admin-Sahay-CRM`;
  }, []);

  useEffect(() => {
    if (currentCompanyName === "") {
      setCurrentLeadform(leadFormData[0]);
    } else {
      setCurrentLeadform(
        leadFormData.find((obj) => obj["Company Name"] === currentCompanyName)
      );
    }
  }, [leadFormData]);

  // const [isDeletedStatus, setisDeletedStatus] = useState(false);
  // const [currentBdeName, setCurrentBdeName] = useState("")

  // const functionToGetBdeName = async (companyName) => {
  //   try {
  //     const response = await axios.get(`${secretKey}/company-data/get-bde-name-for-mybookings/${companyName}`);
  //     setCurrentBdeName(response.data.bdeName); // Assuming the response contains the BDE name in this format
  //   } catch (error) {
  //     console.log("Error fetching employee", error.message);
  //   }
  // };

  // useEffect(() => {
  //   console.log("Current Company Name:", currentCompanyName);

  //   if (currentCompanyName === "") {
  //     setCurrentLeadform(leadFormData[0]);
  //     if (leadFormData.length !== 0) {
  //       setisDeletedStatus(leadFormData[0].isDeletedEmployeeCompany);
  //       setCurrentBdeName(leadFormData[0].bdeName);
  //       functionToGetBdeName(leadFormData[0]["Company Name"]);
  //     }
  //   } else {
  //     const foundLeadForm = leadFormData.find(obj => obj["Company Name"] === currentCompanyName);
  //     if (foundLeadForm) {
  //       setCurrentLeadform(foundLeadForm);
  //       setisDeletedStatus(foundLeadForm.isDeletedEmployeeCompany);
  //       setCurrentBdeName(foundLeadForm.bdeName);
  //       functionToGetBdeName(foundLeadForm["Company Name"]);
  //     } else {
  //       console.log(`Company "${currentCompanyName}" not found in formData.`);
  //     }
  //   }
  // }, [leadFormData, currentCompanyName]);

  useEffect(() => {
    setLeadFormData(
      infiniteBooking.filter((obj) =>
        obj["Company Name"].toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [searchText]);

  const fetchRedesignedFormData = async () => {
    setOpenBacdrop(true);
    try {
      const response = await axios.get(
        `${secretKey}/bookings/redesigned-final-leadData`
      );
      const sortedData = response.data.sort((a, b) => {
        const dateA = new Date(a.lastActionDate);
        const dateB = new Date(b.lastActionDate);
        return dateB - dateA; // Sort in descending order
      });
      setInfiniteBooking(sortedData);
      setLeadFormData(sortedData); // Set both states with the sorted data
    } catch (error) {
      console.error("Error fetching data:", error.message);
    } finally {
      setOpenBacdrop(false);
    }
  };

  const handleCloseBackdrop = () => {
    setOpenBacdrop(false);
  };

  useEffect(() => {
    fetchRedesignedFormData();
  }, [nowToFetch]);

  useEffect(() => {
    // if (data.companyName) {
    //   console.log("Company Found");
    fetchDatadebounce();
    fetchRedesignedFormData();
    // } else {
    //   console.log("No Company Found");
    // }
  }, []);

  const functionOpenBookingForm = () => {
    setBookingFormOpen(true);
    //setCompanyName(data.companyName)
  };
  const frontendKey = process.env.REACT_APP_FRONTEND_KEY;
  const functionopenpopup = () => {
    openchange(true);
  };

  const closepopup = () => {
    openchange(false);
  };
  // const calculateTotalAmount = (obj) => {
  //   let total = parseInt(obj.totalAmount);
  //   if (obj.moreBookings && obj.moreBookings.length > 0) {
  //     total += obj.moreBookings.reduce(
  //       (acc, booking) => acc + parseInt(booking.totalAmount),
  //       0
  //     );
  //   }
  //   return total.toFixed(2);
  // };

  const calculateTotalAmount = (obj) => {
    // Combine services from both main and more bookings
    const allBookings = [
      ...obj.moreBookings,
      {
        services: obj.services,
        totalAmount: obj.totalAmount,
        bookingDate: "1970-01-01", // Default date for main services
      }
    ];

    // Convert bookingDate strings to Date objects
    const bookingsWithDates = allBookings.map((booking) => ({
      ...booking,
      bookingDate: new Date(booking.bookingDate),
    }));

    // Find the latest booking date
    const latestDate = new Date(
      Math.max(...bookingsWithDates.map((booking) => booking.bookingDate.getTime()))
    );

    // Filter to find the latest booking based on the latest date
    const latestBooking = bookingsWithDates.find(
      (booking) => booking.bookingDate.getTime() === latestDate.getTime()
    );
    console.log("latestBooking", latestBooking.totalAmount)
    // Return the total amount for the latest booking (parse it to ensure it is a number)
    return latestBooking
      ? parseInt(latestBooking.totalAmount)
      : '0';
  };


  // const calculateReceivedAmount = (obj) => {
  //   let received = parseInt(obj.receivedAmount);
  //   if (obj.moreBookings && obj.moreBookings.length > 0) {
  //     received += obj.moreBookings.reduce(
  //       (acc, booking) => acc + parseInt(booking.receivedAmount),
  //       0
  //     );
  //   }
  //   return received.toFixed(2);
  // };

  const calculateReceivedAmount = (obj) => {
    // Combine services from both main and more bookings
    const allBookings = [
      ...obj.moreBookings,
      {
        services: obj.services,
        receivedAmount: obj.receivedAmount,
        bookingDate: "1970-01-01", // Default date for main services
      }
    ];
  
    // Convert bookingDate strings to Date objects
    const bookingsWithDates = allBookings.map((booking) => ({
      ...booking,
      bookingDate: new Date(booking.bookingDate),
    }));
  
    // Find the latest booking date
    const latestDate = new Date(
      Math.max(...bookingsWithDates.map((booking) => booking.bookingDate.getTime()))
    );
  
    // Filter to find the latest booking based on the latest date
    const latestBooking = bookingsWithDates.find(
      (booking) => booking.bookingDate.getTime() === latestDate.getTime()
    );
  
    // Return the received amount for the latest booking (parse it to ensure it is a number)
    return latestBooking
      ? parseInt(latestBooking.receivedAmount)
      : '0.00';
  };
  

  // const calculatePendingAmount = (obj) => {
  //   let pending = parseInt(obj.pendingAmount);
  //   if (obj.moreBookings && obj.moreBookings.length > 0) {
  //     pending += obj.moreBookings.reduce(
  //       (acc, booking) => acc + parseInt(booking.pendingAmount),
  //       0
  //     );
  //   }
  //   return pending.toFixed(2);
  // };

  const calculatePendingAmount = (obj) => {
    // Combine services from both main and more bookings
    const allBookings = [
      ...obj.moreBookings,
      {
        services: obj.services,
        pendingAmount: obj.pendingAmount,
        bookingDate: "1970-01-01", // Default date for main services
      }
    ];
  
    // Convert bookingDate strings to Date objects
    const bookingsWithDates = allBookings.map((booking) => ({
      ...booking,
      bookingDate: new Date(booking.bookingDate),
    }));
  
    // Find the latest booking date
    const latestDate = new Date(
      Math.max(...bookingsWithDates.map((booking) => booking.bookingDate.getTime()))
    );
  
    // Filter to find the latest booking based on the latest date
    const latestBooking = bookingsWithDates.find(
      (booking) => booking.bookingDate.getTime() === latestDate.getTime()
    );
  
    // Return the pending amount for the latest booking (parse it to ensure it is a number)
    return latestBooking
      ? parseInt(latestBooking.pendingAmount)
      : '0.00';
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
    window.open(
      `${secretKey}/bookings/recieptpdf/${companyName}/${pathname}`,
      "_blank"
    );
  };

  const handleViewPdOtherDocs = (pdfurl, companyName) => {
    const pathname = pdfurl;
    //console.log(pathname);
    window.open(
      `${secretKey}/bookings/otherpdf/${companyName}/${pathname}`,
      "_blank"
    );
  };

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
        console.log("id", id);
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
        console.log("company", company);
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

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];

    if (
      file &&
      file.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Assuming there's only one sheet in the XLSX file
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const formattedJsonData = jsonData
          .slice(1) // Exclude the first row (header)
          .map((row) => ({
            "Sr. No": row[0],
            "Company Name": row[1],
            "Company Email": row[2],
            "Company Number": row[3],
            incoDate: formatDateFromExcel(row[4]),
            panNumber: row[5],
            gstNumber: row[6],
            bdeName: row[7],
            bdeEmail: row[8],
            bdmName: row[9],
            bdmEmail: row[10], // Assuming the date is in column 'E' (0-based)
            bdmType: row[11],
            bookingDate: formatDateFromExcel(row[12]),
            leadSource: row[13],
            otherLeadSource: row[14],
            "1serviceName": row[15],
            "1TotalAmount": row[16],
            "1GST": row[17],
            "1PaymentTerms": row[18],
            "1FirstPayment": row[19],
            "1SecondPayment": row[20],
            "1ThirdPayment": row[21],
            "1FourthPayment": row[22],
            "1PaymentRemarks": row[23],
            // -------------- 2nd Service --------------------------------
            "2serviceName": row[24],
            "2TotalAmount": row[25],
            "2GST": row[26],
            "2PaymentTerms": row[27],
            "2FirstPayment": row[28],
            "2SecondPayment": row[29],
            "2ThirdPayment": row[30],
            "2FourthPayment": row[31],
            "2PaymentRemarks": row[32],
            // ----------------------- 3rd Service ---------------------------------
            "3serviceName": row[33],
            "3TotalAmount": row[34],
            "3GST": row[35],
            "3PaymentTerms": row[36],
            "3FirstPayment": row[37],
            "3SecondPayment": row[38],
            "3ThirdPayment": row[39],
            "3FourthPayment": row[40],
            "3PaymentRemarks": row[41],
            // ----------------------- 4th Service --------------------------------------
            "4serviceName": row[42],
            "4TotalAmount": row[43],
            "4GST": row[44],
            "4PaymentTerms": row[45],
            "4FirstPayment": row[46],
            "4SecondPayment": row[47],
            "4ThirdPayment": row[48],
            "4FourthPayment": row[49],
            "4PaymentRemarks": row[50],
            // ----------------------   5th Service  --------------------------------------
            "5serviceName": row[51],
            "5TotalAmount": row[52],
            "5GST": row[53],
            "5PaymentTerms": row[54],
            "5FirstPayment": row[55],
            "5SecondPayment": row[56],
            "5ThirdPayment": row[57],
            "5FourthPayment": row[58],
            "5PaymentRemarks": row[59],
            caCase: row[60],
            caNumber: row[61],
            caEmail: row[62],
            caCommission: row[63],
            totalPayment: row[64],
            receivedPayment: row[65],
            pendingPayment: row[66],
            paymentMethod: row[67],
            extraRemarks: row[68],
          }));
        const newFormattedData = formattedJsonData.filter((obj) => {
          return (
            obj["Company Name"] !== "" &&
            obj["Company Name"] !== null &&
            obj["Company Name"] !== undefined
          );
        });
        setExcelData(newFormattedData);
      };

      reader.readAsArrayBuffer(file);
    } else if (file.type === "text/csv") {
      // CSV file
      const parsedCsvData = parseCsv(file);
      console.log("everything is good");
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
        footer: '<a href="#">Why do I have this issue?</a>',
      });

      console.error("Please upload a valid XLSX file.");
    }
  };
  const handleSubmitImport = async () => {
    if (excelData.length !== 0) {
      try {
        const response = await axios.post(
          `${secretKey}/bookings/redesigned-importData`,
          excelData
        );
        Swal.fire("Success", "Bookings Uploaded Successfully", "success");
        fetchRedesignedFormData();
        closepopup();
      } catch (error) {
        console.error("Error importing data:", error);
        Swal.fire("Error", "Failed to Upload Data", "error");
      }
    } else {
      Swal.fire("Upload Data First", "", "warning");
    }
  };

  const parseCsv = (data) => {
    // Use a CSV parsing library (e.g., Papaparse) to parse CSV data
    // Example using Papaparse:
    const parsedData = Papa.parse(data, { header: true });
    return parsedData.data;
  };

  function formatDateFromExcel(serialNumber) {
    // Excel uses a different date origin (January 1, 1900)
    const excelDateOrigin = new Date(Date.UTC(1900, 0, 0));
    const millisecondsPerDay = 24 * 60 * 60 * 1000;

    // Adjust for Excel leap year bug (1900 is not a leap year)
    const daysAdjustment = serialNumber > 59 ? 1 : 0;

    // Calculate the date in milliseconds
    const dateMilliseconds =
      excelDateOrigin.getTime() +
      (serialNumber - daysAdjustment) * millisecondsPerDay;

    // Create a Date object using the calculated milliseconds
    const formattedDate = new Date(dateMilliseconds);

    return formattedDate;
  }
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
      console.log(formData);
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

  //console.log(leadFormData)

  return (
    <div>
      <Header />
      <Navbar />
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
                    <button
                      className="btn btn-primary mr-1"
                      onClick={functionopenpopup}
                    >
                      Import CSV
                    </button>
                    <Dialog
                      open={open}
                      onClose={closepopup}
                      fullWidth
                      maxWidth="sm"
                    >
                      <DialogTitle>
                        Import CSV DATA{" "}
                        <IconButton
                          onClick={closepopup}
                          style={{ float: "right" }}
                        >
                          <CloseIcon color="primary"></CloseIcon>
                        </IconButton>{" "}
                      </DialogTitle>
                      <DialogContent>
                        <div className="maincon">
                          <div
                            style={{ justifyContent: "space-between" }}
                            className="con1 d-flex"
                          >
                            <div
                              style={{ paddingTop: "9px" }}
                              className="uploadcsv"
                            >
                              <label
                                style={{ margin: "0px 0px 6px 0px" }}
                                htmlFor="upload"
                              >
                                Upload CSV File
                              </label>
                            </div>
                            <a
                              href={frontendKey + "/BookingExample.xlsx"}
                              download
                            >
                              Download Sample
                            </a>
                          </div>
                          <div
                            style={{ margin: "5px 0px 0px 0px" }}
                            className="form-control"
                          >
                            <input
                              type="file"
                              name="csvfile
                          "
                              id="csvfile"
                              onChange={handleFileInputChange}
                            />
                          </div>
                        </div>
                      </DialogContent>
                      <button
                        onClick={handleSubmitImport}
                        className="btn btn-primary"
                      >
                        Submit
                      </button>
                    </Dialog>
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
                            onClick={() => {
                              setCurrentLeadform(
                                leadFormData.find(
                                  (data) =>
                                    data["Company Name"] === obj["Company Name"]
                                )
                              );
                            }}
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
                              {/* <div className="b_Services_name d-flex flex-wrap">
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
                              </div> */}
                              <div className="b_Services_name d-flex flex-wrap">
                                {(obj.services.length !== 0 ||
                                  (obj.moreBookings &&
                                    obj.moreBookings.length !== 0)) &&
                                  (() => {
                                    // Combine services from both main and more bookings
                                    const allBookings = [
                                      ...obj.moreBookings,
                                      // Creating a dummy booking object for obj.services with a default date
                                      {
                                        services: obj.services,
                                        bookingDate: "1970-01-01",
                                      }, // Default date for main services
                                    ];

                                    // Convert bookingDate strings to Date objects
                                    const servicesWithDates =
                                      allBookings.flatMap((booking) =>
                                        booking.services.map((service) => ({
                                          ...service,
                                          bookingDate: new Date(
                                            booking.bookingDate
                                          ),
                                        }))
                                      );

                                    // Find the latest booking date
                                    const latestDate = new Date(
                                      Math.max(
                                        ...servicesWithDates.map((service) =>
                                          service.bookingDate.getTime()
                                        )
                                      )
                                    );

                                    // Filter services based on the latest booking date
                                    const latestServices =
                                      servicesWithDates.filter(
                                        (service) =>
                                          service.bookingDate.getTime() ===
                                          latestDate.getTime()
                                      );

                                    // Slice the filtered services to show only the first 3
                                    const displayedServices =
                                      latestServices.slice(0, 3);

                                    // Calculate the count of additional services
                                    const additionalCount = Math.max(
                                      servicesWithDates.length - 3,
                                      0
                                    );

                                    return (
                                      <>
                                        {displayedServices.map(
                                          (service, index) => (
                                            <div
                                              key={service.serviceId}
                                              className="sname mb-1"
                                            >
                                              {service.serviceName}
                                            </div>
                                          )
                                        )}

                                        {/* Show additional count if there are more than 3 services */}
                                        {additionalCount > 0 && (
                                          <div className="sname mb-1">
                                            {`+${additionalCount}`}
                                          </div>
                                        )}
                                      </>
                                    );
                                  })()}
                              </div>
                              <div className="d-flex align-items-center justify-content-between">
                                {(obj.remainingPayments.length !== 0 ||
                                  obj.moreBookings.some(
                                    (moreObj) =>
                                      moreObj.remainingPayments.length !== 0
                                  )) && (
                                    <div
                                      className="b_Service_remaining_receive"
                                      title="remaining Payment Received"
                                    >
                                      <img src={RemainingAmnt}></img>
                                    </div>
                                  )}
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
                                  Total: ₹{" "}
                                  {
                                    calculateTotalAmount(obj).toLocaleString()
                                  }
                                </div>
                                <div className="amount receive_amount_bg">
                                  Received: ₹{" "}
                                  {
                                    calculateReceivedAmount(obj).toLocaleString()
                                  }
                                </div>
                                <div className="amount pending_amount_bg">
                                  Pending: ₹{" "}
                                  {
                                    calculatePendingAmount(obj).toLocaleString()
                                  }
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
                            <div>
                              Total Services:{" "}
                              {currentLeadform &&
                                currentLeadform.services.length}
                            </div>
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
                                  {currentLeadform && (
                                    <div class="booking_inner_dtl_b h-100 bdr-left-eee">
                                      ₹{" "}
                                      {parseInt(
                                        calculateTotalAmount(currentLeadform)
                                      ).toLocaleString()}
                                    </div>
                                  )}
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
                                  {currentLeadform && (
                                    <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                      ₹{" "}
                                      {parseInt(
                                        calculateReceivedAmount(currentLeadform)
                                      ).toLocaleString()}
                                    </div>
                                  )}
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
                                  {currentLeadform && (
                                    <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                      ₹{" "}
                                      {parseInt(
                                        calculatePendingAmount(currentLeadform)
                                      ).toLocaleString()}
                                    </div>
                                  )}
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
                                handleDeleteBooking(currentLeadform.company)
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
                                              {parseInt(
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
                                        <div
                                          class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap"
                                          title={
                                            obj.paymentRemarks
                                              ? obj.paymentRemarks
                                              : "N/A"
                                          }
                                        >
                                          {obj.paymentRemarks
                                            ? obj.paymentRemarks
                                            : "N/A"}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {obj.expanse !== 0 && obj.expanse && (
                                  <div className="row m-0 bdr-btm-eee">
                                    <div className="col-lg-6 col-sm-2 p-0">
                                      <div class="row m-0">
                                        <div class="col-sm-4 align-self-stretch p-0">
                                          <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                            Expense
                                          </div>
                                        </div>
                                        <div class="col-sm-8 align-self-stretch p-0">
                                          <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                            - ₹{" "}
                                            {obj.expanse
                                              ? obj.expanse.toLocaleString()
                                              : "N/A"}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-sm-2 p-0">
                                      <div class="row m-0">
                                        <div class="col-sm-4 align-self-stretch p-0">
                                          <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                            Expanses Date
                                          </div>
                                        </div>
                                        <div class="col-sm-8 align-self-stretch p-0">
                                          <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                            {formatDatePro(
                                              obj.expanseDate
                                                ? obj.expanseDate
                                                : currentLeadform.bookingDate
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
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
                                            {parseInt(
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
                                                {parseInt(
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
                                                {parseInt(
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
                                                {parseInt(
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
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              {/* Remaining Payment View Sections */}
                              {currentLeadform.remainingPayments.length !== 0 &&
                                currentLeadform.remainingPayments.some(
                                  (boom) => boom.serviceName === obj.serviceName
                                ) && (
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
                                            <div className="booking_inner_dtl_h h-100">
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
                                          .length !== 0 &&
                                          currentLeadform.remainingPayments
                                            .filter(
                                              (boom) =>
                                                boom.serviceName ===
                                                obj.serviceName
                                            )
                                            .map(
                                              (paymentObj, index) =>
                                                paymentObj.serviceName ===
                                                  obj.serviceName ? (
                                                  <div class="accordion-body bdr-none p-0">
                                                    <div>
                                                      <div className="row m-0 bdr-btm-eee bdr-top-eee">
                                                        <div className="col-lg-12 col-sm-6 p-0 align-self-stretc bg-fffafa">
                                                          <div class="booking_inner_dtl_h h-100 d-flex align-items-center justify-content-between">
                                                            <div>
                                                              {currentLeadform
                                                                .remainingPayments
                                                                .length !== 0 &&
                                                                (() => {
                                                                  if (
                                                                    index === 0
                                                                  )
                                                                    return "Second ";
                                                                  else if (
                                                                    index === 1
                                                                  )
                                                                    return "Third ";
                                                                  else if (
                                                                    index === 2
                                                                  )
                                                                    return "Fourth ";
                                                                  // Add more conditions as needed
                                                                  return ""; // Return default value if none of the conditions match
                                                                })()}
                                                              Remaining Payment
                                                            </div>
                                                            <div>
                                                              {"(" +
                                                                formatDatePro(
                                                                  paymentObj.publishDate
                                                                    ? paymentObj.publishDate
                                                                    : paymentObj.paymentDate
                                                                ) +
                                                                ")"}
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
                                                                {currentLeadform
                                                                  .remainingPayments
                                                                  .length !==
                                                                  0 &&
                                                                  (() => {
                                                                    const filteredPayments =
                                                                      currentLeadform.remainingPayments.filter(
                                                                        (pay) =>
                                                                          pay.serviceName ===
                                                                          obj.serviceName
                                                                      );

                                                                    const filteredLength =
                                                                      filteredPayments.length;
                                                                    if (
                                                                      index ===
                                                                      0
                                                                    )
                                                                      return (
                                                                        parseInt(
                                                                          obj.totalPaymentWGST
                                                                        ) -
                                                                        parseInt(
                                                                          obj.firstPayment
                                                                        ) -
                                                                        parseInt(
                                                                          paymentObj.receivedPayment
                                                                        )
                                                                      );
                                                                    else if (
                                                                      index ===
                                                                      1
                                                                    )
                                                                      return (
                                                                        parseInt(
                                                                          obj.totalPaymentWGST
                                                                        ) -
                                                                        parseInt(
                                                                          obj.firstPayment
                                                                        ) -
                                                                        parseInt(
                                                                          paymentObj.receivedPayment
                                                                        ) -
                                                                        parseInt(
                                                                          filteredPayments[0]
                                                                            .receivedPayment
                                                                        )
                                                                      );
                                                                    else if (
                                                                      index ===
                                                                      2
                                                                    )
                                                                      return parseInt(
                                                                        currentLeadform.pendingAmount
                                                                      );
                                                                    // Add more conditions as needed
                                                                    return ""; // Return default value if none of the conditions match
                                                                  })()}
                                                                {/* {index === 0
                                                              ? parseInt(obj.totalPaymentWGST) - parseInt(obj.firstPayment) - parseInt(paymentObj.receivedPayment)
                                                              : index === 1
                                                              ? parseInt(obj.totalPaymentWGST) - parseInt(obj.firstPayment) - parseInt(paymentObj.receivedPayment) - parseInt(currentLeadform.remainingPayments[0].receivedPayment)
                                                              : parseInt(currentLeadform.pendingAmount)} */}
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
                                                              <div class="booking_inner_dtl_h h-100">
                                                                Payment Method
                                                              </div>
                                                            </div>
                                                            <div class="col-sm-7 align-self-stretc p-0">
                                                              <div
                                                                class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap"
                                                                title={
                                                                  paymentObj.paymentMethod
                                                                }
                                                              >
                                                                {
                                                                  paymentObj.paymentMethod
                                                                }
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                        <div className="col-lg-6 col-sm-4 p-0 align-self-stretc">
                                                          <div class="row m-0 h-100">
                                                            <div class="col-sm-4 align-self-stretc p-0">
                                                              <div class="booking_inner_dtl_h h-100 bdr-left-eee">
                                                                Extra Remarks
                                                              </div>
                                                            </div>
                                                            <div class="col-sm-8 align-self-stretc p-0">
                                                              <div
                                                                class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap"
                                                                title={
                                                                  paymentObj.extraRemarks
                                                                }
                                                              >
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
                                  </div>
                                )}
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
                            <div className="row m-0 bdr-btm-eee">
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
                                        parseInt(
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
                                        parseInt(
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
                                        parseInt(
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
                                    <div class="booking_inner_dtl_h h-100 ">
                                      Payment Method
                                    </div>
                                  </div>
                                  <div class="col-sm-8 align-self-stretch p-0">
                                    <div
                                      class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap"
                                      title={
                                        currentLeadform &&
                                        currentLeadform.paymentMethod
                                      }
                                    >
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
                                    <div
                                      class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap"
                                      title={
                                        currentLeadform &&
                                        currentLeadform.extraNotes
                                      }
                                    >
                                      {currentLeadform &&
                                        currentLeadform.extraNotes}
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
                                          {/* {currentLeadform &&
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
                                            ))} */}
                                          {currentLeadform &&
                                            currentLeadform.paymentReceipt &&
                                            currentLeadform.paymentReceipt[0] &&
                                            currentLeadform.paymentReceipt[0]
                                              .filename && // Ensure filename exists
                                            (currentLeadform.paymentReceipt[0].filename
                                              .toLowerCase()
                                              .endsWith(".pdf") ? (
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
                                            ) : currentLeadform.paymentReceipt[0].filename
                                              .toLowerCase()
                                              .endsWith(".png") ||
                                              currentLeadform.paymentReceipt[0].filename
                                                .toLowerCase()
                                                .endsWith(".jpg") ||
                                              currentLeadform.paymentReceipt[0].filename
                                                .toLowerCase()
                                                .endsWith(".jpeg") ? (
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
                                  currentLeadform.remainingPayments.map(
                                    (remainingObject, index) =>
                                      remainingObject.paymentReceipt.length !==
                                      0 && (
                                        <div
                                          className="col-sm-2 mb-1"
                                          key={index}
                                        >
                                          <div className="booking-docs-preview">
                                            <div
                                              className="booking-docs-preview-img"
                                              onClick={() =>
                                                handleViewPdfReciepts(
                                                  remainingObject
                                                    .paymentReceipt[0].filename,
                                                  currentLeadform[
                                                  "Company Name"
                                                  ]
                                                )
                                              }
                                            >
                                              {remainingObject.paymentReceipt[0].filename
                                                .toLowerCase()
                                                .endsWith(".pdf") ? (
                                                <PdfImageViewerAdmin
                                                  type="paymentrecieptpdf"
                                                  path={
                                                    remainingObject
                                                      .paymentReceipt[0]
                                                      .filename
                                                  }
                                                  companyName={
                                                    currentLeadform[
                                                    "Company Name"
                                                    ]
                                                  }
                                                />
                                              ) : remainingObject.paymentReceipt[0].filename.endsWith(
                                                ".png"
                                              ) ||
                                                remainingObject.paymentReceipt[0].filename.endsWith(
                                                  ".jpg"
                                                ) ||
                                                remainingObject.paymentReceipt[0].filename.endsWith(
                                                  ".jpeg"
                                                ) ? (
                                                <img
                                                  src={`${secretKey}/bookings/recieptpdf/${currentLeadform["Company Name"]}/${remainingObject.paymentReceipt[0].filename}`}
                                                  alt="Receipt Image"
                                                />
                                              ) : (
                                                <img
                                                  src={wordimg}
                                                  alt="Default Image"
                                                />
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
                                  )}

                                {/* {currentLeadform &&
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
                                  ))} */}
                                {currentLeadform &&
                                  currentLeadform.otherDocs &&
                                  currentLeadform.otherDocs.map((obj) => (
                                    <div
                                      className="col-sm-2 mb-1"
                                      key={obj.filename}
                                    >
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
                                          {obj.filename && // Ensure filename exists
                                            obj.filename
                                              .toLowerCase()
                                              .endsWith(".pdf") ? (
                                            <PdfImageViewerAdmin
                                              type="pdf"
                                              path={obj.filename}
                                              companyName={
                                                currentLeadform["Company Name"]
                                              }
                                            />
                                          ) : (
                                            obj.filename && (
                                              <img
                                                src={`${secretKey}/bookings/otherpdf/${currentLeadform["Company Name"]}/${obj.filename}`}
                                                alt={pdfimg}
                                              />
                                            )
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
                        currentLeadform.moreBookings.map((objMain, index) => (
                          <>
                            <div className="row align-items-center m-0 justify-content-between mb-1 mt-3">
                              <div className="mul_booking_heading col-6">
                                <b>Booking {index + 2}</b>
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
                                      setbookingIndex(index + 1);
                                      setEditBookingOpen(true);
                                    }}
                                  >
                                    <MdModeEdit />
                                  </div>
                                  <div
                                    onClick={() =>
                                      handleDeleteBooking(
                                        currentLeadform.company,
                                        objMain._id
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
                                              <i>
                                                {objMain.bdmType === "Close-by"
                                                  ? "Closed-by"
                                                  : "Supported-by"}
                                              </i>
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
                                                  {parseInt(
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
                                            <div
                                              class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap"
                                              title={
                                                obj.paymentRemarks
                                                  ? obj.paymentRemarks
                                                  : "N/A"
                                              }
                                            >
                                              {obj.paymentRemarks
                                                ? obj.paymentRemarks
                                                : "N/A"}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    {obj.expanse !== 0 && obj.expanse && (
                                      <div className="row m-0 bdr-btm-eee">
                                        <div className="col-lg-6 col-sm-2 p-0">
                                          <div class="row m-0">
                                            <div class="col-sm-4 align-self-stretch p-0">
                                              <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                                Expense
                                              </div>
                                            </div>
                                            <div class="col-sm-8 align-self-stretch p-0">
                                              <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                                - ₹{" "}
                                                {obj.expanse
                                                  ? obj.expanse.toLocaleString()
                                                  : "N/A"}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="col-lg-6 col-sm-2 p-0">
                                          <div class="row m-0">
                                            <div class="col-sm-4 align-self-stretch p-0">
                                              <div class="booking_inner_dtl_h bdr-left-eee h-100">
                                                Expanses Date
                                              </div>
                                            </div>
                                            <div class="col-sm-8 align-self-stretch p-0">
                                              <div class="booking_inner_dtl_b bdr-left-eee h-100">
                                                {formatDatePro(
                                                  obj.expanseDate
                                                    ? obj.expanseDate
                                                    : objMain.bookingDate
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
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
                                                {parseInt(
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
                                                    {parseInt(
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
                                                    {parseInt(
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
                                                    {parseInt(
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
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  {objMain.remainingPayments.length !== 0 &&
                                    objMain.remainingPayments.some(
                                      (boom) =>
                                        boom.serviceName === obj.serviceName
                                    ) && (
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
                                            {objMain.remainingPayments
                                              .length !== 0 &&
                                              objMain.remainingPayments
                                                .filter(
                                                  (boom) =>
                                                    boom.serviceName ===
                                                    obj.serviceName
                                                )
                                                .map(
                                                  (paymentObj, index) =>
                                                    paymentObj.serviceName ===
                                                      obj.serviceName ? (
                                                      <div class="accordion-body bdr-none p-0">
                                                        <div>
                                                          <div className="row m-0 bdr-btm-eee bdr-top-eee">
                                                            <div className="col-lg-12 col-sm-6 p-0 align-self-stretc bg-fffafa">
                                                              <div class="booking_inner_dtl_h h-100 d-flex align-items-center justify-content-between">
                                                                <div>
                                                                  {objMain
                                                                    .remainingPayments
                                                                    .length !==
                                                                    0 &&
                                                                    (() => {
                                                                      if (
                                                                        index ===
                                                                        0
                                                                      )
                                                                        return "Second ";
                                                                      else if (
                                                                        index ===
                                                                        1
                                                                      )
                                                                        return "Third ";
                                                                      else if (
                                                                        index ===
                                                                        2
                                                                      )
                                                                        return "Fourth ";
                                                                      else if (
                                                                        index >
                                                                        2
                                                                      )
                                                                        return "Other ";
                                                                      // Add more conditions as needed
                                                                      return ""; // Return default value if none of the conditions match
                                                                    })()}
                                                                  Remaining
                                                                  Payment
                                                                </div>
                                                                <div className="d-flex align-items-center">
                                                                  <div>
                                                                    {"(" +
                                                                      formatDatePro(
                                                                        paymentObj.publishDate
                                                                          ? paymentObj.publishDate
                                                                          : paymentObj.paymentDate
                                                                      ) +
                                                                      ")"}
                                                                  </div>

                                                                  {/* {
                                                          objMain.remainingPayments.length - 1 === index && <IconButton onClick={ ()=>functionDeleteRemainingPayment(BookingIndex + 1)} >
                                                            <MdDelete style={{ height: '14px', width: '14px' , color:'#be1e1e' }} />
                                                          </IconButton>
                                                          } */}
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
                                                                    {objMain
                                                                      .remainingPayments
                                                                      .length !==
                                                                      0 &&
                                                                      (() => {
                                                                        const filteredPayments =
                                                                          objMain.remainingPayments.filter(
                                                                            (
                                                                              pay
                                                                            ) =>
                                                                              pay.serviceName ===
                                                                              obj.serviceName
                                                                          );

                                                                        const filteredLength =
                                                                          filteredPayments.length;
                                                                        if (
                                                                          index ===
                                                                          0
                                                                        )
                                                                          return (
                                                                            Math.round(
                                                                              obj.totalPaymentWGST
                                                                            ) -
                                                                            Math.round(
                                                                              obj.firstPayment
                                                                            ) -
                                                                            Math.round(
                                                                              paymentObj.receivedPayment
                                                                            )
                                                                          );
                                                                        else if (
                                                                          index ===
                                                                          1
                                                                        )
                                                                          return (
                                                                            Math.round(
                                                                              obj.totalPaymentWGST
                                                                            ) -
                                                                            Math.round(
                                                                              obj.firstPayment
                                                                            ) -
                                                                            Math.round(
                                                                              paymentObj.receivedPayment
                                                                            ) -
                                                                            Math.round(
                                                                              filteredPayments[0]
                                                                                .receivedPayment
                                                                            )
                                                                          );
                                                                        else if (
                                                                          index ===
                                                                          2
                                                                        )
                                                                          return Math.round(
                                                                            objMain.pendingAmount
                                                                          );
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
                                                                  <div class="booking_inner_dtl_h h-100">
                                                                    Payment
                                                                    Method
                                                                  </div>
                                                                </div>
                                                                <div class="col-sm-7 align-self-stretc p-0">
                                                                  <div
                                                                    class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap"
                                                                    title={
                                                                      paymentObj.paymentMethod
                                                                    }
                                                                  >
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
                                                                  <div class="booking_inner_dtl_h h-100 bdr-left-eee">
                                                                    Extra
                                                                    Remarks
                                                                  </div>
                                                                </div>
                                                                <div class="col-sm-8 align-self-stretc p-0">
                                                                  <div
                                                                    class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap"
                                                                    title={
                                                                      paymentObj.extraRemarks
                                                                    }
                                                                  >
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
                                      </div>
                                    )}
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
                                            {parseInt(
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
                                            {parseInt(
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
                                            {parseInt(
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
                                          <div
                                            class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap"
                                            title={objMain.paymentMethod}
                                          >
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
                                          <div
                                            class="booking_inner_dtl_b h-100 bdr-left-eee My_Text_Wrap"
                                            title={objMain.extraNotes}
                                          >
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
                                          {objMain.paymentReceipt[0].filename
                                            .toLowerCase()
                                            .endsWith(".pdf") ? (
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
                                        {obj.filename
                                          .toLowerCase()
                                          .endsWith(".pdf") ? (
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
                                        setSendingIndex(index + 1);
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
      {/* --------------------------------backedrop------------------------- */}
      {openBacdrop && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={openBacdrop}
          onClick={handleCloseBackdrop}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
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
            IamAdmin={true}
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
            isAdmin={true}
            employeeName={currentLeadform.bdeName}
            employeeEmail={currentLeadform.bdeEmail}
          />
        </>
      )}
    </div>
  );
}

export default BookingList;
