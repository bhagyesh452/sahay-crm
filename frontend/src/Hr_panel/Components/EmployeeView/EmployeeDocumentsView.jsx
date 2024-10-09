import React from 'react';
import PdfImageViewerAdmin from '../../../admin/PdfViewerAdmin';
import pdfimg from "../../../static/my-images/pdf.png";
import wordimg from "../../../static/my-images/word.png";
import Nodata from '../../../DataManager/Components/Nodata/Nodata';
import { IoAdd } from "react-icons/io5";

function EmployeeDocumentsView({ employeeInformation, isEmployee }) {
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    console.log(employeeInformation);

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
                                    ))}
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
                (employeeInformation?.aadharCard?.length > 0 ||
                    employeeInformation?.panCard?.length > 0 ||
                    employeeInformation?.educationCertificate?.length > 0 ||
                    employeeInformation?.salarySlip?.length > 0 ||
                    employeeInformation?.relievingCertificate?.length > 0) ? (
                <div className='row'>
                    {renderDocument("aadharcard", employeeInformation.aadharCard, "Aadhar Card")}
                    {renderDocument("pancard", employeeInformation.panCard, "PAN Card")}
                    {renderDocument("educationCertificate", employeeInformation.educationCertificate, "Education Certificate")}
                    {renderDocument("offerLetter", employeeInformation.offerLetter, "Offer Letter")}
                    {renderDocument("salarySlip", employeeInformation.salarySlip, "Salary Slip")}
                    {/* {renderDocument("profilePhoto", employeeInformation.profilePhoto, "Profile Photo")} */}
                    {renderDocument("relievingCertificate", employeeInformation.relievingCertificate, "Relieving Certificate")}
                    {!isEmployee && <div className="col-md-3 mb-1 mt-1">
                        <div
                            className="booking-docs-preview"
                            title="Upload More Documents"
                        >
                            <a
                                style={{ textDecoration: "none" }}
                                data-bs-toggle="modal"
                                data-bs-target="#myModal"
                            >
                                <div
                                    className="upload-Docs-BTN"
                                >
                                    <IoAdd />
                                </div>
                            </a>
                        </div>
                    </div>}
                </div>
            ) : (employeeInformation &&
                employeeInformation?.aadharCard?.length === 0 &&
                employeeInformation?.panCard?.length === 0 &&
                employeeInformation?.educationCertificate?.length === 0 &&
                employeeInformation?.offerLetter?.length === 0 &&
                employeeInformation?.salarySlip?.length === 0 &&
                employeeInformation?.relievingCertificate?.length === 0 &&

                (<>
                    {!isEmployee && <div className="row">
                        <div className="col-md-3 mb-1 mt-1">
                            <div
                                className="booking-docs-preview"
                                title="Upload More Documents"
                            >
                                <div
                                    className="upload-Docs-BTN"
                                >
                                    <IoAdd />
                                </div>
                            </div>
                        </div>
                    </div>}
                </>

                )
            )}

            {/* -----------------------modal for adding more documents----------------- */}
            <div className="modal" id="myModal">
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header d-flex align-items-center justify-content-between">
                            <h4 className="modal-title">Add Documents</h4>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            //onClick={handleCloseDialog}
                            >
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="row mb-3">

                                <div className="col-lg-12">
                                    <input
                                        type="file"
                                        className="form-control"
                                    // onChange={handleFileChange}
                                    // ref={fileInputRef} // Attach ref to file input
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                className="btn btn-primary"
                                data-bs-dismiss="modal"
                            // onClick={() => {
                            //     handleBulkUploadSubmit();
                            // }}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmployeeDocumentsView;
