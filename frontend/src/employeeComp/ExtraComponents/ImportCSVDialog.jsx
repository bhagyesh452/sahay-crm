import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { TbFileImport } from "react-icons/tb";
import axios from "axios";

const CsvImportDialog = ({ secretKey, data }) => {
  const [openCSV, setOpenCSV] = useState(false);
  const [csvData, setCsvData] = useState([]);

  const formatDateFromExcel = (excelDate) => {
    const excelEpoch = new Date(Date.UTC(1900, 0, 1));
    const days = excelDate - 2;
    const dateInMillis = days * 86400 * 1000;
    return new Date(excelEpoch.getTime() + dateInMillis).toISOString().split("T")[0];
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file && file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const formattedJsonData = jsonData.slice(1).map((row) => ({
          "Sr. No": row[0],
          "Company Name": row[1],
          "Company Number": row[2],
          "Company Email": row[3],
          "Company Incorporation Date": formatDateFromExcel(row[4]),
          City: row[5],
          State: row[6],
          Status: row[7],
          Remarks: row[8],
          "Company Address": row[9],
          "Director Name(First)": row[10],
          "Director Number(First)": row[11],
          "Director Email(First)": row[12],
          "Director Name(Second)": row[13],
          "Director Number(Second)": row[14],
          "Director Email(Second)": row[15],
          "Director Name(Third)": row[16],
          "Director Number(Third)": row[17],
          "Director Email(Third)": row[18],
        }));

        setCsvData(formattedJsonData);
      };

      reader.readAsArrayBuffer(file);
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please upload a valid XLSX file.",
      });
    }
  };

  const handleUploadData = async () => {
    const name = data.ename;
    const updatedCsvData = csvData.map((item) => ({
      ...item,
      ename: name,
    }));

    if (updatedCsvData.length !== 0) {
      try {
        await axios.post(`${secretKey}/requests/requestCompanyData`, updatedCsvData);
        Swal.fire({
          title: "Request Sent!",
          text: "Your Request has been successfully sent to the Admin",
          icon: "success",
        });
        setCsvData([]);
        setOpenCSV(false);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.status !== 500 ? "Some of the data are not unique" : "Please upload unique data",
        });
        console.error("Error:", error);
      }
    } else {
      Swal.fire("Please upload data");
    }
  };

  const functionopenpopupCSV = () => setOpenCSV(true);
  const closepopupCSV = () => setOpenCSV(false);

  return (
    <div>
      {/* Button to open the CSV dialog */}
      <button type="button" className="btn mybtn" onClick={functionopenpopupCSV}>
        <TbFileImport className="mr-1" /> Import Leads
      </button>

      {/* CSV Import Dialog */}
      <Dialog className="My_Mat_Dialog" open={openCSV} onClose={closepopupCSV} fullWidth maxWidth="sm">
        <DialogTitle>
          Import CSV DATA
          <button onClick={closepopupCSV} style={{ float: "right" }}>
            <CloseIcon color="primary" />
          </button>
        </DialogTitle>
        <DialogContent>
          <div className="maincon">
            <div style={{ justifyContent: "space-between" }} className="con1 d-flex">
              <label htmlFor="formFile" className="form-label">
                Upload CSV File
              </label>
              <a href={`${process.env.PUBLIC_URL}/AddLeads_EmployeeSample.xlsx`} download>
                Download Sample
              </a>
            </div>
            <div className="mb-3">
              <input onChange={handleFileChange} className="form-control" type="file" id="formFile" />
            </div>
          </div>
        </DialogContent>
        <button onClick={handleUploadData} className="btn btn-primary bdr-radius-none">
          Submit
        </button>
      </Dialog>
    </div>
  );
};

export default CsvImportDialog;
