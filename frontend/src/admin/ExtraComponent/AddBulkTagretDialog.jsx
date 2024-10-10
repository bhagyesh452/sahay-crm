import React, { useState, useRef } from 'react';
import { AiOutlineDownload } from "react-icons/ai";
import Swal from 'sweetalert2';
import axios from 'axios';
import * as XLSX from 'xlsx';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { MdOutlineFileUpload } from "react-icons/md";
import { SiGoogledocs } from "react-icons/si";
import { MdOutlineDelete } from "react-icons/md";
import { MdDelete } from "react-icons/md";


function AddBulkTargetDialog({ refetchActive }) {
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const [uploadedFile, setUploadedFile] = useState(null);
    const fileInputRef = useRef(null); // Create a ref for the file input
    const [isDragging, setIsDragging] = useState(false); // To highlight the area during drag


    const handleCloseDialog = () => {
        setUploadedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Manually reset the file input value
        }
        refetchActive();
    };

    const handleFileChange = (e) => {
        setUploadedFile(e.target.files[0]);
    };

    const handleRemoveFile = () => {
        setUploadedFile(null);
    }

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true); // Show drag highlight
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true); // Show drag highlight
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false); // Remove drag highlight
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false); // Remove drag highlight
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setUploadedFile(e.dataTransfer.files[0]);
            e.dataTransfer.clearData(); // Clear data after drop
        }
    };

    const handleBulkUploadSubmit = async () => {
        if (!uploadedFile) {
            Swal.fire({
                icon: 'error',
                title: 'Missing File',
                text: 'Please upload an Excel file.',
            });
            return;
        }

        const reader = new FileReader();

        reader.onload = async (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

            const employeeData = sheetData.map((row) => ({
                ename: row["Employee Name"],
                email: row["Email  Address"],
                year: row["Year"],
                month: row["Month"],
                amount: row["Amount(In Rupees)"],
                achievedAmount: "",
            }));

            try {
                const response = await axios.post(`${secretKey}/employee/addbulktargetemployees`, { employeeData });
                if (response.status === 200) {
                    Swal.fire({
                        title: 'Data Added Successfully!',
                        icon: 'success',
                    });
                    handleCloseDialog(); // Close the modal and reset state
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Bulk Upload Failed',
                    text: `Error occurred during bulk upload: ${error.message}`,
                });
            }
        };

        reader.readAsArrayBuffer(uploadedFile);
    };

    console.log("uploadedFile:", uploadedFile);

    return (
        <div>
            <div className={'d-flex align-items-center justify-content-center'}>
                <a
                    style={{ textDecoration: "none" }}
                    data-bs-toggle="modal"
                    data-bs-target="#targetModal"
                >
                    <button className="btn btn-primary mr-1">+ Add Bulk Target</button>
                </a>
            </div>
            <div className="modal" id="targetModal">
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header d-flex align-items-center justify-content-between">
                            <h4 className="modal-title">Add Recent Employee</h4>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={handleCloseDialog}
                            >
                            </button>
                        </div>

                        <div className="modal-body">
                            {/* <div className="row mb-3">
                                <label className="form-label">Upload Employee Targets</label>
                                <div className="col-lg-12">
                                    <input
                                        type="file"
                                        className="form-control"
                                        onChange={handleFileChange}
                                        ref={fileInputRef} // Attach ref to file input
                                    />
                                </div>
                                <a
                                    href={`${process.env.PUBLIC_URL}/AddBulkTarget.xlsx`}
                                    download={"AddBulkTarget.xlsx"}
                                >
                                    <div className='d-flex align-items-center justify-content-end' style={{ marginTop: "10px", textDecoration: "none" }}>
                                        <div style={{ marginRight: "5px" }}>
                                            <AiOutlineDownload />
                                        </div>
                                        <div>
                                            Download Sample
                                        </div>
                                    </div>
                                </a>
                            </div> */}
                            <div>
                                <div className={`drag-file-area ${isDragging ? 'dragging' : ''}`} // Add 'dragging' class to change style during drag
                                    onDragOver={handleDragOver}
                                    onDragEnter={handleDragEnter}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}>
                                    <div className='upload-icon'>
                                        <MdOutlineFileUpload />
                                    </div>
                                    <h3 class="dynamic-message"> Drag & drop any file here </h3>
                                    <label className='browse-files-text'> Browse Files Here
                                        <input type="file" 
                                        class="default-file-input" 
                                        onChange={handleFileChange}
                                        ref={fileInputRef}
                                         />
                                    </label>
                                </div>
                                {uploadedFile && (
                                    <div className="file-block">
                                        <div className="file-info">
                                            <span className="material-icons-outlined file-icon"><SiGoogledocs /></span>
                                            <span className="file-name">{uploadedFile.name}</span>
                                        </div>
                                        <span className="material-icons remove-file-icon" onClick={handleRemoveFile}><MdDelete /></span>
                                        <div className="progress-bar"></div>
                                    </div>
                                )}
                                <a className='hr_bulk_upload_a'
                                    href={`${process.env.PUBLIC_URL}/AddBulkTarget.xlsx`}
                                    download={"AddBulkTarget.xlsx"}
                                >
                                    <div className='hr_bulk_upload'>
                                        <div style={{ marginRight: "5px" }}>
                                            <AiOutlineDownload />
                                        </div>
                                        <div>
                                            Download Sample
                                        </div>

                                    </div>
                                </a>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                className="btn btn-primary"
                                data-bs-dismiss="modal"
                                onClick={() => {
                                    handleBulkUploadSubmit();
                                }}
                            >
                                Bulk Upload
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddBulkTargetDialog;
