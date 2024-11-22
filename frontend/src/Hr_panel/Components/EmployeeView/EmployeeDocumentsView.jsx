import React, { useState, useEffect } from 'react';
import PdfImageViewerAdmin from '../../../admin/PdfViewerAdmin';
import Nodata from '../../../DataManager/Components/Nodata/Nodata';
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2';
import pdfimg from "../../../static/my-images/pdf.png";
import wordimg from "../../../static/my-images/word.png";
import { IoAdd } from "react-icons/io5";

function EmployeeDocumentsView({ employeeInformation, isEmployee, fetchEmployeeData }) {

    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const { userId } = useParams();

    // console.log("Employee information from document section :", employeeInformation);

    const [selectedFiles, setSelectedFiles] = useState({
        offerLetter: null,
        aadharCard: null,
        panCard: null,
        educationCertificate: null,
        relievingCertificate: null,
        salarySlip: null,
    });

    const handleFileChange = (event, docType) => {
        const file = event.target.files[0];
        if (file && file.type.match("image/jpeg|image/png|image/jpg|application/pdf")) {
            setSelectedFiles((prevState) => ({
                ...prevState,
                [docType]: file,
            }));
        } else {
            Swal.fire("Error", "Please select a valid file format (JPG, JPEG, PNG, PDF).", "error");
        }
    };

    const handleUploadDocuments = async () => {
        const formData = new FormData();

        // Append all selected files to FormData
        for (const [key, file] of Object.entries(selectedFiles)) {
            if (file) {
                formData.append(key, file);
            }
        }

        if (formData.has("offerLetter") || formData.has("aadharCard") || formData.has("panCard") ||
            formData.has("educationCertificate") || formData.has("relievingCertificate") ||
            formData.has("salarySlip")) {
            try {
                const response = await axios.put(`${secretKey}/employee/updateEmployeeFromId/${userId}`, formData);
                Swal.fire("Success", "Documents successfully uploaded", "success");
                fetchEmployeeData();
            } catch (error) {
                console.error("Error uploading documents:", error);
                Swal.fire("Error", "Error uploading documents", "error");
            }
        } else {
            Swal.fire("Error", "No files selected for upload", "error");
        }
    };

    const renderDocument = (documentType, documents, displayName) => {
        return (
            <>
                {documents && documents.length > 0 && (
                    <div className='col-md-3 mb-1 mt-1'>
                        <div className="booking-docs-preview">
                            <div
                                className="booking-docs-preview-img"
                                onClick={() => {
                                    window.open(
                                        `${secretKey}/employee/employeedocuments/${documentType}/${employeeInformation._id}/${documents[0].filename}`,
                                        "_blank"
                                    );
                                }}
                            >
                                {documents[0].filename &&
                                    (documents[0].filename.toLowerCase().endsWith(".pdf") ? (
                                        <PdfImageViewerAdmin
                                            isEmployee={true}
                                            type={documentType}
                                            path={documents[0].filename}
                                            id={employeeInformation._id}
                                        />
                                    ) : documents[0].filename.toLowerCase().endsWith(".png") ||
                                        documents[0].filename.toLowerCase().endsWith(".jpg") ||
                                        documents[0].filename.toLowerCase().endsWith(".jpeg") ? (
                                        <img
                                            src={`${secretKey}/employee/employeedocuments/${documentType}/${employeeInformation._id}/${documents[0].filename}`}
                                            alt={displayName}
                                        />
                                    ) : (
                                        <img
                                            src={wordimg}
                                            alt="Default Image"
                                        />
                                    ))
                                }
                            </div>
                            <div className="booking-docs-preview-text">
                                <p className="booking-img-name-txtwrap text-wrap m-auto m-0">
                                    {displayName}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    };

    return (
        <div>
            {employeeInformation &&
                (employeeInformation?.offerLetter?.length > 0 ||
                    employeeInformation?.aadharCard?.length > 0 ||
                    employeeInformation?.panCard?.length > 0 ||
                    employeeInformation?.educationCertificate?.length > 0 ||
                    employeeInformation?.relievingCertificate?.length > 0 ||
                    employeeInformation?.salarySlip?.length > 0) ? (
                <div className='row'>
                    {renderDocument("offerLetter", employeeInformation.offerLetter, "Offer Letter")}
                    {renderDocument("aadharcard", employeeInformation.aadharCard, "Aadhar Card")}
                    {renderDocument("pancard", employeeInformation.panCard, "PAN Card")}
                    {renderDocument("educationCertificate", employeeInformation.educationCertificate, "Education Certificate")}
                    {renderDocument("relievingCertificate", employeeInformation.relievingCertificate, "Relieving Certificate")}
                    {renderDocument("salarySlip", employeeInformation.salarySlip, "Salary Slip")}
                    {/* {renderDocument("profilePhoto", employeeInformation.profilePhoto, "Profile Photo")} */}

                    {!isEmployee && <div className="col-md-3 mb-1 mt-1">
                        <div className="booking-docs-preview" title="Upload More Documents">
                            <a
                                style={{ textDecoration: "none" }}
                                data-bs-toggle="modal"
                                data-bs-target="#myModal"
                            >
                                <div className="upload-Docs-BTN">
                                    <IoAdd />
                                </div>
                                <div className="text-center">
                                    <span>Upload Documents</span>
                                </div>
                            </a>
                        </div>
                    </div>}
                </div>
            ) : (employeeInformation &&
                employeeInformation?.offerLetter?.length === 0 &&
                employeeInformation?.aadharCard?.length === 0 &&
                employeeInformation?.panCard?.length === 0 &&
                employeeInformation?.educationCertificate?.length === 0 &&
                employeeInformation?.relievingCertificate?.length === 0 &&
                employeeInformation?.salarySlip?.length === 0 &&
                (
                    <div className="row">
                        <div className="col-md-3 mb-1 mt-1">
                            <div className="booking-docs-preview">
                                <a
                                    style={{ textDecoration: "none" }}
                                    data-bs-toggle="modal"
                                    data-bs-target="#myModal"
                                >
                                    <div className="upload-Docs-BTN">
                                        <IoAdd />
                                    </div>
                                </a>
                                <div className="text-center">
                                    <span>Upload Documents</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            }

            {/* -----------------------modal for adding more documents----------------- */}
            <div className="modal" id="myModal">
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content">

                        <div className="modal-header d-flex align-items-center justify-content-between">
                            <h4 className="modal-title">Add Documents (JPG, JPEG, PNG, PDF)</h4>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            >
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="row mb-3">
                                {Object.keys(selectedFiles).map((docType) => (
                                    <div className="col-lg-12 mb-2" key={docType}>
                                        <label>{`Upload ${docType.replace(/([A-Z])/g, " $1")}`}</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            accept=".jpg, .jpeg, .png, .pdf"
                                            onChange={(e) => handleFileChange(e, docType)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>


                        <div className="modal-footer">
                            <button className="btn btn-primary" data-bs-dismiss="modal" onClick={handleUploadDocuments}>
                                Submit
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div >
    );
}

export default EmployeeDocumentsView;