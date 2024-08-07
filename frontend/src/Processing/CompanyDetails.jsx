import React, { useState, useEffect } from "react";
import "./style_processing/main_processing.css";
import { pdfuploader } from "../documents/pdf1.pdf";
import Dashboard_processing from "./Dashboard_processing";
import { Link } from "react-router-dom";
import { FaRegFilePdf } from "react-icons/fa";
import pdficon from "./PDF-icon-1.png";
import { MdDownload } from "react-icons/md";
import { FaRegCopy } from "react-icons/fa";
import { IoIosCloseCircleOutline } from "react-icons/io";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import CloseIcon from "@mui/icons-material/Close";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import KeyboardTabIcon from "@mui/icons-material/KeyboardTab";
import axios from "axios";
import PdfViewer from "./PdfViewer";
import { pdfjs } from "react-pdf";
import Nodata from "./Nodata";
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

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const CompanyDetails = ({ companyDetails, duplicateCompany }) => {
  // const [field, setField] = useState(false)
  const [isOpen, setIsOpen] = useState(false);
  const [open, openchange] = useState(false);
  const [company, setCompany] = useState(null);
  const [csvdata, setCsvData] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [displayForm, setDisplayForm] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedFile, setSelectedFile] = useState();
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [openPaymentReceipt, setOpenPaymentReceipt] = useState(false);
  const [openOtherDocs, setOpenOtherDocs] = useState(false);

  const formatDatelatest = (inputDate) => {
    const date = new Date(inputDate);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const frontendKey = process.env.REACT_APP_FRONTEND_KEY;
  useEffect(() => {
    setCompany(companyDetails);
  }, [companyDetails]);

  const handleNextClick = () => {
    if (currentIndex < duplicateCompany.length) {
      setCompany(duplicateCompany[currentIndex]);
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };
  const handleNextClickReset = () => {
    setCompany(companyDetails);
    setCurrentIndex(0);
  };

  // Function to close the popup
  // const handleClosePopup = () => {
  //   setIsOpen(false);
  // };

  const functionopenpopup = () => {
    openchange(true);
  };

  const closepopup = () => {
    openchange(false);

    setCsvData([]);
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
            bdeName: row[1],
            bdeEmail: row[2],
            bdmName: row[3],
            bdmEmail: row[4], // Assuming the date is in column 'E' (0-based)
            bdmType: row[5],
            supportedBy: row[6],
            bookingDate: formatDateFromExcel(row[7]),
            caCase: row[8],
            caNumber: row[9],
            caEmail: row[10],
            caCommission: row[11],
            companyName: row[12],
            contactNumber: row[13],
            companyEmail: row[14],
            services: row[15],
            originalTotalPayment: row[16],
            totalPayment: row[17],
            paymentTerms: row[18],
            paymentMethod: row[19],
            firstPayment: row[20],
            secondPayment: row[21],
            thirdPayment: row[22],
            fourthPayment: row[23],
            paymentRemarks: row[24],
            paymentReceipt: row[25],
            bookingSource: row[26],
            cPANorGSTnum: row[27],
            incoDate: formatDateFromExcel(row[28]),
            extraNotes: row[29],
            otherDocs: row[30],
            bookingTime: formatTimeFromExcel(row[31]),
          }));
        const newFormattedData = formattedJsonData.filter((obj) => {
          return (
            obj.companyName !== "" &&
            obj.companyName !== null &&
            obj.companyName !== undefined
          );
        });
        setExcelData(newFormattedData);
        console.log(newFormattedData);
      };

      reader.readAsArrayBuffer(file);
    } else if (file.type === "text/csv") {
      // CSV file
      // const parsedCsvData = parseCsv(data);
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

  const parseCsv = (data) => {
    // Use a CSV parsing library (e.g., Papaparse) to parse CSV data
    // Example using Papaparse:
    const parsedData = Papa.parse(data, { header: true });
    return parsedData.data;
  };
  function formatTimeFromExcel(serialNumber) {
    // Excel uses a fractional representation for time
    const totalSeconds = Math.round(serialNumber * 24 * 60 * 60); // Convert days to seconds
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // Format the time
    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    return formattedTime;
  }

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

  const transformedData = excelData.map((item) => ({
    "Company Name": item.companyName,
    "Company Number": item.contactNumber,
    "Company Email": item.companyEmail,
    "Company Incorporation Date  ": item.incoDate,
    ename: item.bdeName,
    City: "NA",
    State: "NA",
    Status: "Matured",
    // Add other fields as needed
  }));

  const handleSubmit = async () => {
    try {
      const updatedExcelData = excelData.map((item) => ({
        ...item,
        imported: true,
      }));
      console.log(updatedExcelData);
      const response = await axios.post(
        `${secretKey}/upload/lead-form`,
        updatedExcelData
      );
      await axios.post(`${secretKey}/leads`, transformedData);
      console.log(response.data.successCounter, response.data.errorCounter);
      if (response.data.errorCounter === 0) {
        Swal.fire({
          title: "Success!",
          html: `
          <b> ${response.data.errorCounter} </b> Duplicate Entries found!,
          </br>
          <small>${response.data.successCounter} Data Added </small>
        `,
          icon: "success",
        });
      } else {
        Swal.fire({
          title: "Data Already exists!",
          html: `
          <b> ${response.data.errorCounter} </b> Duplicate Entries found!,
          </br>
          <small>${response.data.successCounter} Data Added </small>
        `,
          icon: "info",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error uploading file.");
    }
  };

  // --------------------------------------to open attachments------------------------------------

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

  // ---------------------------------------copy to clipboard-------------------------------

  const copyToClipboard = (value) => {
    navigator.clipboard
      .writeText(value)

      .then(() => {
        console.log("Text successfully copied to clipboard:", value);
        const alertElement = document.createElement("div");
        alertElement.className = "copy-alert";
        alertElement.textContent = "Copied!";

        // Append the alert element to the document body
        document.body.appendChild(alertElement);

        // Remove the alert element after a short delay
        setTimeout(() => {
          document.body.removeChild(alertElement);
        }, 2000); // Adjust the delay as needed (2 seconds in this example)
      });
  };
  // ---------------------------tofetchdatainexcelfile---------------------------------

  const exportData = async () => {
    try {
      // Ask user for confirmation using SweetAlert
      const confirmed = await Swal.fire({
        title: "Confirmation",
        text: "Do you want to download the leads CSV file?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });

      // If user confirms, proceed with downloading
      if (confirmed.isConfirmed) {
        const response = await axios.get(`${secretKey}/exportdatacsv`, {
          responseType: "blob",
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "leads.csv");
        document.body.appendChild(link);
        link.click();
      }
    } catch (error) {
      console.error("Error downloading CSV:", error);
    }
  };

  // --------------------------------------uploadfiles-----------------------------------------

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

  const closePaymentReceiptPopup = () => {
    setOpenPaymentReceipt(false);
  };

  const closeOtherDocsPopup = () => {
    setOpenOtherDocs(false);
  };

  const handleChange = (selectedValue) => {
    const selectedOption = selectedValue;
    console.log(selectedOption);

    if (selectedOption === "paymentReceipt") {
      // If "Payment Receipt" is selected, open the payment receipt dialog and close other docs dialog
      setOpenPaymentReceipt(true);
      setOpenOtherDocs(false);
    } else if (selectedOption === "otherDocs") {
      // If "Other Docs" is selected, open the other docs dialog and close payment receipt dialog
      setOpenPaymentReceipt(false);
      setOpenOtherDocs(true);
    }
  };

  const handleUploads = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file && /\.(pdf|jpe?g|png)$/i.test(file.name)) {
      // File is valid (PDF, JPG, JPEG, PNG)
      // You can handle the file here, if needed
    } else {
      // Invalid file type
      alert("Please upload a PDF, JPG, JPEG, or PNG file.");
      e.target.value = ""; // Clear the file input
    }
  };

  const handleAttachment = async () => {
    try {
      const files = selectedFile;
      console.log(files);

      if (files.length === 0) {
        // No files selected
        return;
      }

      const formData = new FormData();
      formData.append("paymentReceipt", files);

      const response = await fetch(
        `${secretKey}/uploadAttachment/${company.companyName}`,
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

      const response = await fetch(
        `${secretKey}/uploadotherdocsAttachment/${company.companyName}`,
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

  return (
    <div className="card">
      <div className="card-header">
        <div className="d-flex justify-content-between align-items-center w-100">
          <div>
            <h3 class="card-title">Booking Details</h3>
          </div>
          <div
            className="buttons d-flex align-items-center justify-content-around"
            style={{ gap: "5px" }}
          >
            <div>
              <button className="btn btn-primary mr-1" onClick={exportData}>
                + Export CSV
              </button>
            </div>
            <div>
              <button className="btn btn-primary" onClick={functionopenpopup}>
                + Import CSV
              </button>
            </div>
            <div>
              <Dialog open={open} onClose={closepopup} fullWidth maxWidth="sm">
                <DialogTitle>
                  Import CSV DATA{" "}
                  <IconButton onClick={closepopup} style={{ float: "right" }}>
                    <CloseIcon color="primary"></CloseIcon>
                  </IconButton>{" "}
                </DialogTitle>
                <DialogContent>
                  <div className="maincon">
                    <div
                      style={{ justifyContent: "space-between" }}
                      className="con1 d-flex"
                    >
                      <div style={{ paddingTop: "9px" }} className="uploadcsv">
                        <label
                          style={{ margin: "0px 0px 6px 0px" }}
                          htmlFor="upload"
                        >
                          Upload CSV File
                        </label>
                      </div>
                      <a href={frontendKey + "/AddBookingFormat.xlsx"} download>
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
                <button className="btn btn-primary" onClick={handleSubmit}>
                  Submit
                </button>
              </Dialog>
            </div>
            <div>
              <Link to="/Processing/Dashboard_processing/addbookings">
                <button className="btn btn-primary">Add Booking</button>
              </Link>
            </div>
            {duplicateCompany.length !== 0 && (
              <div>
                <IconButton
                  style={{
                    backgroundColor:
                      currentIndex >= duplicateCompany.length
                        ? "#dacca7"
                        : "#fbb900",
                    color: "white",
                  }}
                  disabled={currentIndex >= duplicateCompany.length}
                  onClick={handleNextClick}
                >
                  <KeyboardTabIcon />
                </IconButton>
              </div>
            )}
            {duplicateCompany.length !== 0 && (
              <div>
                <IconButton
                  style={{ backgroundColor: "#fbb900", color: "white" }}
                  onClick={handleNextClickReset}
                >
                  <RestartAltIcon />
                </IconButton>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* ------------------------Booking info section------------- */}
      {company !== null ? (
        <div className="card-body booking-details-body">
          <section>
            <div className="row">
              {(company.bdeName || company.bdeName === " ") && (
                <div className="col-sm-3">
                  <div className="booking-fields-view">
                    <div className="fields-view-title">BDE Name :</div>
                    <div className="fields-view-value">
                      {company.bdeName}
                      <span
                        className="copy-icon"
                        onClick={() => copyToClipboard(`${company.bdeName}`)}
                      >
                        {/* Replace with your clipboard icon */}
                        <FaRegCopy
                          style={{
                            width: "15px",
                            height: "15px",
                            marginLeft: "5px",
                            cursor: "pointer",
                          }}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {(company.bdeEmail || company.bdeEmail === " ") && (
                <div className="col-sm-3">
                  <div className="booking-fields-view">
                    <div className="fields-view-title">BDE Email :</div>
                    <div className="fields-view-value">
                      {company.bdeEmail}
                      <span
                        className="copy-icon"
                        onClick={() => copyToClipboard(`${company.bdeEmail}`)}
                      >
                        {/* Replace with your clipboard icon */}
                        <FaRegCopy
                          style={{
                            width: "15px",
                            height: "15px",
                            marginLeft: "5px",
                            cursor: "pointer",
                          }}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {(company.bdmName || company.bdmName === " ") && (
                <div className="col-sm-3">
                  <div className="booking-fields-view">
                    <div className="fields-view-title">BDM Name :</div>
                    <div className="fields-view-value" id="bdmNameValue">
                      {`${company.bdmName}(${company.bdmType})`}
                      <span
                        className="copy-icon"
                        onClick={() =>
                          copyToClipboard(
                            `${company.bdmName}(${company.bdmType}`
                          )
                        }
                      >
                        {/* Replace with your clipboard icon */}
                        <FaRegCopy
                          style={{
                            width: "15px",
                            height: "15px",
                            marginLeft: "5px",
                            cursor: "pointer",
                          }}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {(company.bdmEmail || company.bdmEmail === " ") && (
                <div className="col-sm-3">
                  <div className="booking-fields-view">
                    <div className="fields-view-title">BDM Email :</div>
                    <div className="fields-view-value">
                      {company.bdmEmail}
                      <span
                        className="copy-icon"
                        onClick={() => copyToClipboard(`${company.bdmEmail}`)}
                      >
                        {/* Replace with your clipboard icon */}
                        <FaRegCopy
                          style={{
                            width: "15px",
                            height: "15px",
                            marginLeft: "5px",
                            cursor: "pointer",
                          }}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="row mt-2">
              {(company.bookingDate || company.bookingDate === " ") && (
                <div className="col-sm-3">
                  <div className="booking-fields-view">
                    <div className="fields-view-title">Booking Date :</div>
                    <div className="fields-view-value">
                      {formatDatelatest(company.bookingDate)}
                      <span
                        className="copy-icon"
                        onClick={() =>
                          copyToClipboard(
                            `${formatDatelatest(company.bookingDate)}`
                          )
                        }
                      >
                        {/* Replace with your clipboard icon */}
                        <FaRegCopy
                          style={{
                            width: "15px",
                            height: "15px",
                            marginLeft: "5px",
                            cursor: "pointer",
                          }}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {(company.bookingTime || company.bookingTime === " ") && (
                <div className="col-sm-3">
                  <div className="booking-fields-view">
                    <div className="fields-view-title">Booking Time :</div>
                    <div className="fields-view-value">
                      {company.bookingTime}
                      <span
                        className="copy-icon"
                        onClick={() =>
                          copyToClipboard(`${company.bookingTime}`)
                        }
                      >
                        {/* Replace with your clipboard icon */}
                        <FaRegCopy
                          style={{
                            width: "15px",
                            height: "15px",
                            marginLeft: "5px",
                            cursor: "pointer",
                          }}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
          <hr className="m-0 mt-2 mb-2"></hr>

          {/* --------------CA SECTION--------------------------- */}

          <section>
            <div className="row">
              {(company.caCase || company.caCase === " ") && (
                <div className="col-sm-3">
                  <div className="booking-fields-view">
                    <div className="fields-view-title">Ca Case :</div>
                    <div className="fields-view-value">
                      {company.caCase}
                      <span
                        className="copy-icon"
                        onClick={() => copyToClipboard(`${company.caCase}`)}
                      >
                        {/* Replace with your clipboard icon */}
                        <FaRegCopy
                          style={{
                            width: "15px",
                            height: "15px",
                            marginLeft: "5px",
                            cursor: "pointer",
                          }}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {(company.caCommission || company.caCommission === " ") && (
                <div className="col-sm-3">
                  <div className="booking-fields-view">
                    <div className="fields-view-title">Ca Case :</div>
                    <div className="fields-view-value">
                      {company.caCommission}
                      <span
                        className="copy-icon"
                        onClick={() =>
                          copyToClipboard(`${company.caCommission}`)
                        }
                      >
                        {/* Replace with your clipboard icon */}
                        <FaRegCopy
                          style={{
                            width: "15px",
                            height: "15px",
                            marginLeft: "5px",
                            cursor: "pointer",
                          }}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {(company.caEmail || company.caEmail === " ") && (
                <div className="col-sm-3">
                  <div className="booking-fields-view">
                    <div className="fields-view-title">CA Email :</div>
                    <div className="fields-view-value">
                      {company.caEmail}
                      <span
                        className="copy-icon"
                        onClick={() => copyToClipboard(`${company.caEmail}`)}
                      >
                        {/* Replace with your clipboard icon */}
                        <FaRegCopy
                          style={{
                            width: "15px",
                            height: "15px",
                            marginLeft: "5px",
                            cursor: "pointer",
                          }}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {(company.caNumber || company.caNumber === " ") && (
                <div className="col-sm-3">
                  <div className="booking-fields-view">
                    <div className="fields-view-title">CA Number :</div>
                    <div className="fields-view-value">
                      {company.caNumber}
                      <span
                        className="copy-icon"
                        onClick={() => copyToClipboard(`${company.caNumber}`)}
                      >
                        {/* Replace with your clipboard icon */}
                        <FaRegCopy
                          style={{
                            width: "15px",
                            height: "15px",
                            marginLeft: "5px",
                            cursor: "pointer",
                          }}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
          <hr className="m-0 mt-2 mb-2"></hr>

          {/* -------------------------------Company Details Section-------------------------------------------- */}

          <section>
            <div className="row">
              {(company.companyName || company.companyName === " ") && (
                <div className="col-sm-3">
                  <div className="booking-fields-view">
                    <div className="fields-view-title">Company Name :</div>
                    <div className="fields-view-value">
                      {company.companyName}
                      <span
                        className="copy-icon"
                        onClick={() =>
                          copyToClipboard(`${company.companyName}`)
                        }
                      >
                        {/* Replace with your clipboard icon */}
                        <FaRegCopy
                          style={{
                            width: "15px",
                            height: "15px",
                            marginLeft: "5px",
                            cursor: "pointer",
                          }}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {(company.companyEmail || company.companyEmail === " ") && (
                <div className="col-sm-3">
                  <div className="booking-fields-view">
                    <div className="fields-view-title">Company Email :</div>
                    <div className="fields-view-value">
                      {company.companyEmail}
                      <span
                        className="copy-icon"
                        onClick={() =>
                          copyToClipboard(`${company.companyEmail}`)
                        }
                      >
                        {/* Replace with your clipboard icon */}
                        <FaRegCopy
                          style={{
                            width: "15px",
                            height: "15px",
                            marginLeft: "5px",
                            cursor: "pointer",
                          }}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {(company.contactNumber || company.contactNumber === " ") && (
                <div className="col-sm-3">
                  <div className="booking-fields-view">
                    <div className="fields-view-title">Contact Number :</div>
                    <div className="fields-view-value">
                      {company.contactNumber}
                      <span
                        className="copy-icon"
                        onClick={() =>
                          copyToClipboard(`${company.contactNumber}`)
                        }
                      >
                        {/* Replace with your clipboard icon */}
                        <FaRegCopy
                          style={{
                            width: "15px",
                            height: "15px",
                            marginLeft: "5px",
                            cursor: "pointer",
                          }}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {(company.services || company.services === " ") && (
                <div className="col-sm-3">
                  <div className="booking-fields-view" id="fieldValue">
                    <div className="fields-view-title">Services :</div>
                    <div className="fields-view-value" id="servicesValue">
                      {company.services}
                      <span
                        className="copy-icon"
                        onClick={() =>
                          copyToClipboard(company.services, "servicesValue")
                        }
                      >
                        {/* Replace with your clipboard icon */}
                        <FaRegCopy
                          style={{
                            width: "15px",
                            height: "15px",
                            marginLeft: "5px",
                            cursor: "pointer",
                          }}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
          <hr className="m-0 mt-2 mb-2"></hr>
          {/* --------------------------------Payment Details Section------------------------------ */}
          <section>
            <div className="row">
              {(company.paymentTerms || company.paymentTerms === " ") && (
                <div className="col-sm-3">
                  <div className="booking-fields-view">
                    <div className="fields-view-title">Payment Terms :</div>
                    <div className="fields-view-value">
                      {company.paymentTerms}
                      <span
                        className="copy-icon"
                        onClick={() =>
                          copyToClipboard(`${company.paymentTerms}`)
                        }
                      >
                        {/* Replace with your clipboard icon */}
                        <FaRegCopy
                          style={{
                            width: "15px",
                            height: "15px",
                            marginLeft: "5px",
                            cursor: "pointer",
                          }}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {(company.paymentMethod || company.paymentMethod === " ") && (
                <div className="col-sm-3">
                  <div className="booking-fields-view">
                    <div className="fields-view-title">Payment Method :</div>
                    <div className="fields-view-value">
                      {company.paymentMethod}
                      <span
                        className="copy-icon"
                        onClick={() =>
                          copyToClipboard(`${company.paymentMethod}`)
                        }
                      >
                        {/* Replace with your clipboard icon */}
                        <FaRegCopy
                          style={{
                            width: "15px",
                            height: "15px",
                            marginLeft: "5px",
                            cursor: "pointer",
                          }}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {(company.originalTotalPayment ||
                company.originalTotalPayment === " ") && (
                <div className="col-sm-3">
                  <div className="booking-fields-view">
                    <div className="fields-view-title">
                      Original Total Payment :
                    </div>
                    <div className="fields-view-value">
                      <span
                        style={{
                          color: "black",
                          fontWeight: "bolder",
                          marginRight: "-120px",
                        }}
                      >
                        &#8377;
                      </span>
                      {company.originalTotalPayment.toLocaleString()}
                      <span
                        className="copy-icon"
                        onClick={() =>
                          copyToClipboard(`${company.originalTotalPayment}`)
                        }
                      >
                        {/* Replace with your clipboard icon */}
                        <FaRegCopy
                          style={{
                            width: "15px",
                            height: "15px",
                            marginLeft: "5px",
                            cursor: "pointer",
                          }}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {(company.totalPayment || company.totalPayment === " ") && (
                <div className="col-sm-3">
                  <div className="booking-fields-view">
                    <div className="fields-view-title">Total Payment :</div>
                    <div className="fields-view-value">
                      <span
                        style={{
                          color: "black",
                          fontWeight: "bolder",
                          marginRight: "-120px",
                        }}
                      >
                        &#8377;
                      </span>
                      {company.totalPayment.toLocaleString()}
                      <span
                        className="copy-icon"
                        onClick={() =>
                          copyToClipboard(`${company.totalPayment}`)
                        }
                      >
                        {/* Replace with your clipboard icon */}
                        <FaRegCopy
                          style={{
                            width: "15px",
                            height: "15px",
                            marginLeft: "5px",
                            cursor: "pointer",
                          }}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="row">
              {(company.firstPayment || company.firstPayment === " ") && (
                <div className="col-sm-3">
                  <div className="booking-fields-view">
                    <div className="fields-view-title">First Payment :</div>
                    <div className="fields-view-value">
                      <span
                        style={{
                          color: "black",
                          fontWeight: "bolder",
                          marginRight: "-120px",
                        }}
                      >
                        &#8377;
                      </span>
                      {company.firstPayment.toLocaleString()}
                      <span
                        className="copy-icon"
                        onClick={() =>
                          copyToClipboard(`${company.firstPayment}`)
                        }
                      >
                        {/* Replace with your clipboard icon */}
                        <FaRegCopy
                          style={{
                            width: "15px",
                            height: "15px",
                            marginLeft: "5px",
                            cursor: "pointer",
                          }}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {(company.secondPayment || company.secondPayment === " ") && (
                <div className="col-sm-3">
                  <div className="booking-fields-view">
                    <div className="fields-view-title">Second Payment :</div>
                    <div className="fields-view-value">
                      <span
                        style={{
                          color: "black",
                          fontWeight: "bolder",
                          marginRight: "-120px",
                        }}
                      >
                        &#8377;
                      </span>
                      {company.secondPayment.toLocaleString()}
                      <span
                        className="copy-icon"
                        onClick={() =>
                          copyToClipboard(`${company.secondPayment}`)
                        }
                      >
                        {/* Replace with your clipboard icon */}
                        <FaRegCopy
                          style={{
                            width: "15px",
                            height: "15px",
                            marginLeft: "5px",
                            cursor: "pointer",
                          }}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {(company.thirdPayment || company.thirdPayment === " ") && (
                <div className="col-sm-3">
                  <div className="booking-fields-view">
                    <div className="fields-view-title">Third Payment :</div>
                    <div className="fields-view-value">
                      <span
                        style={{
                          color: "black",
                          fontWeight: "bolder",
                          marginRight: "-120px",
                        }}
                      >
                        &#8377;
                      </span>
                      {company.thirdPayment.toLocaleString()}
                      <span
                        className="copy-icon"
                        onClick={() =>
                          copyToClipboard(`${company.thirdPayment}`)
                        }
                      >
                        {/* Replace with your clipboard icon */}
                        <FaRegCopy
                          style={{
                            width: "15px",
                            height: "15px",
                            marginLeft: "5px",
                            cursor: "pointer",
                          }}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {(company.fourthPayment || company.fourthPayment === " ") && (
                <div className="col-sm-3">
                  <div className="booking-fields-view">
                    <div className="fields-view-title">Fourth Payment :</div>
                    <div className="fields-view-value">
                      <span
                        style={{
                          color: "black",
                          fontWeight: "bolder",
                          marginRight: "-120px",
                        }}
                      >
                        &#8377;
                      </span>
                      {company.fourthPayment.toLocaleString()}
                      <span
                        className="copy-icon"
                        onClick={() =>
                          copyToClipboard(`${company.fourthPayment}`)
                        }
                      >
                        {/* Replace with your clipboard icon */}
                        <FaRegCopy
                          style={{
                            width: "15px",
                            height: "15px",
                            marginLeft: "5px",
                            cursor: "pointer",
                          }}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="row">
              {(company.bookingSource || company.bookingSource === " ") && (
                <div className="col-sm-3">
                  <div className="booking-fields-view">
                    <div className="fields-view-title">Booking Source :</div>
                    <div className="fields-view-value">
                      {company.bookingSource}
                      <span
                        className="copy-icon"
                        onClick={() =>
                          copyToClipboard(`${company.bookingSource}`)
                        }
                      >
                        {/* Replace with your clipboard icon */}
                        <FaRegCopy
                          style={{
                            width: "15px",
                            height: "15px",
                            marginLeft: "5px",
                            cursor: "pointer",
                          }}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {(company.cPANorGSTnum || company.cPANorGSTnum === " ") && (
                <div className="col-sm-3">
                  <div className="booking-fields-view">
                    <div className="fields-view-title">Pan or Gst :</div>
                    <div className="fields-view-value">
                      {company.cPANorGSTnum}
                      <span
                        className="copy-icon"
                        onClick={() =>
                          copyToClipboard(`${company.cPANorGSTnum}`)
                        }
                      >
                        {/* Replace with your clipboard icon */}
                        <FaRegCopy
                          style={{
                            width: "15px",
                            height: "15px",
                            marginLeft: "5px",
                            cursor: "pointer",
                          }}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {(company.incoDate || company.incoDate === " ") && (
                <div className="col-sm-3">
                  <div className="booking-fields-view">
                    <div className="fields-view-title">
                      Incorporation Date :
                    </div>
                    <div className="fields-view-value">
                      {formatDatelatest(company.incoDate)}
                      <span
                        className="copy-icon"
                        onClick={() =>
                          copyToClipboard(
                            `${formatDatelatest(company.incoDate)}`
                          )
                        }
                      >
                        {/* Replace with your clipboard icon */}
                        <FaRegCopy
                          style={{
                            width: "15px",
                            height: "15px",
                            marginLeft: "5px",
                            cursor: "pointer",
                          }}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {(company.extraNotes || company.extraNotes === " ") && (
                <div className="col-sm-3">
                  <div className="booking-fields-view">
                    <div className="fields-view-title">Extra Notes :</div>
                    <div className="fields-view-value">
                      {company.extraNotes}
                      <span
                        className="copy-icon"
                        onClick={() => copyToClipboard(`${company.extraNotes}`)}
                      >
                        {/* Replace with your clipboard icon */}
                        <FaRegCopy
                          style={{
                            width: "15px",
                            height: "15px",
                            marginLeft: "5px",
                            cursor: "pointer",
                          }}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* -----------------------------------Reciepts and Documents Upload Section----------------------------- */}
          <hr className="m-0 mt-4 mb-2 w-100"></hr>
          <section>
            <div className="d-flex justify-content-between mb-0">
              <div className="col-sm-3 column-width-reciept mt-2">
                <select
                  id="docType"
                  class="form-select"
                  onChange={(event) => {
                    handleChange(event.target.value);
                  }}
                >
                  <option value="" disabled selected>
                    Upload Attachment
                  </option>
                  <option value="paymentReceipt">Payment Receipt</option>
                  <option value="otherDocs" multiple>
                    Other Docs
                  </option>
                </select>
                <div>
                  <Dialog
                    open={openPaymentReceipt}
                    onClose={closePaymentReceiptPopup}
                    fullWidth
                    maxWidth="sm"
                  >
                    <DialogTitle>
                      Upload Your Attachments
                      <IconButton
                        onClick={closePaymentReceiptPopup}
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
                            onChange={handleUploads}
                            // Allow multiple files selection
                          />
                        </div>
                      </div>
                    </DialogContent>
                    <button
                      className="btn btn-primary"
                      onClick={handleAttachment}
                    >
                      Submit
                    </button>
                  </Dialog>

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
                          style={{ justifyContent: "space-between" }}
                          className="con1 d-flex"
                        >
                          <div
                            style={{ paddingTop: "9px" }}
                            className="uploadcsv"
                          >
                            <label
                              style={{ margin: "0px 0px 6px 0px" }}
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
                              handleOtherDocsUpload(e.target.files);
                            }}
                            multiple // Allow multiple files selection
                          />
                          {selectedDocuments &&
                            selectedDocuments.length > 0 && (
                              <div className="uploaded-filename-main d-flex flex-wrap">
                                {selectedDocuments.map((file, index) => (
                                  <div
                                    className="uploaded-fileItem d-flex align-items-center"
                                    key={index}
                                  >
                                    <p className="m-0">{file.name}</p>
                                    <button
                                      className="fileItem-dlt-btn"
                                      onClick={() => handleRemoveFile(index)}
                                    >
                                      <IconX className="close-icon" />
                                    </button>
                                  </div>
                                ))}
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
            </div>
          </section>

          {/*------------------------------------------------Reciepts Viewer Section---------------------------------------- */}

          {(company.paymentReceipt || company.otherDocs.length > 0) && (
            <>
              <hr className="m-0 mt-4 mb-2 w-100"></hr>
              <section>
                <div className="d-flex justify-content-between mb-0 flex-wrap ml-0">
                  {company.paymentReceipt && (
                    <div className="col-sm-3 column-width-reciept">
                      <div className="booking-fields-view d-flex align-items-center flex-column cursor-pointer">
                        <div className="fields-view-title mb-2 mt-2">
                          Payment Receipts :
                        </div>
                        <div
                          className="custom-image-div d-flex "
                          onClick={() => {
                            handleViewPdfReciepts(company.paymentReceipt);
                          }}
                        >
                          {/* <img src={pdficon} alt="pdficon" /> */}

                          {company.paymentReceipt.endsWith(".pdf") ? (
                            <PdfViewer
                              type="paymentrecieptpdf"
                              path={company.paymentReceipt}
                            />
                          ) : (
                            <img
                              src={`${secretKey}/recieptpdf/${company.paymentReceipt}`}
                              alt="Receipt"
                              style={{ width: "200px", height: "129px" }}
                            />
                          )}

                          <div className="d-flex align-items-center justify-content-center download-attachments cursor-pointer">
                            <div className="pdf-div">Pdf</div>
                            <div
                              style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                textWrap: "nowrap",
                              }}
                            >
                              Reciept
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {company.otherDocs.map((object) => {
                    const originalFilename = object
                      .split("-")
                      .slice(1)
                      .join("-")
                      .replace(".pdf", "");
                    return (
                      <div className="col-sm-3 column-width-reciept">
                        <div
                          className="booking-fields-view d-flex  align-items-center flex-column cursor-pointer"
                          key={object}
                        >
                          <div className="fields-view-title mb-2 mt-2">
                            Attachments
                          </div>
                          <div
                            className="custom-image-div d-flex justify-content-center"
                            onClick={() => {
                              handleViewPdOtherDocs(object);
                            }}
                          >
                            {/* <img src={pdficon} alt="pdficon" /> */}
                            {object.endsWith(".pdf") ? (
                              <PdfViewer type="pdf" path={object} />
                            ) : (
                              <img
                                src={`${secretKey}/otherpdf/${object}`}
                                alt="Document"
                                style={{ width: "200px", height: "129px" }}
                              />
                            )}
                            <div className="d-flex align-items-center justify-content-center download-attachments cursor-pointer">
                              <div className="pdf-div">Pdf</div>
                              <div
                                title={originalFilename}
                                style={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  textWrap: "nowrap",
                                }}
                              >
                                {originalFilename}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </>
          )}
        </div>
      ) : (
        <Nodata />
      )}
    </div>
  );
};

export default CompanyDetails;
