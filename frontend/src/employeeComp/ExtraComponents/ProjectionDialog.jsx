import React, { useState } from 'react';
import { Drawer, Button } from "@mui/material";
import { RiEditCircleFill } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import { AiOutlineDownload } from "react-icons/ai";
import { HiPencilSquare } from "react-icons/hi2";
import { IoCloseCircle } from "react-icons/io5";
import { options } from "../../components/Options.js";
import Select from "react-select";
import Swal from "sweetalert2";
import axios from 'axios'

function ProjectionDialog({
    projectionCompanyName,
    projectionData, // Pass projectionData to check if a projection exists
    bdmAcceptStatus,
    secretKey,
    fetchProjections,
    ename,
    hasMaturedStatus,
    hasExistingProjection,
    userId,
    newDesignation,
    isBdmProjection,
    fordesignation
}) {
    const [open, setOpen] = useState(false);
    const [currentProjection, setCurrentProjection] = useState({
        companyName: "",
        ename: "",
        offeredPrize: "",
        offeredServices: "",
        totalPayment: 0,
        lastFollowUpdate: "",
        remarks: "",
        date: "",
        time: "",
        editCount: -1,
        totalPaymentError: "",
    });
    const [selectedValues, setSelectedValues] = useState([]);
    const [isEditProjection, setIsEditProjection] = useState(false);
    const [projectingCompany, setProjectingCompany] = useState("");
    // Check if the company has an existing projection
    const cleanedProjectionCompanyName = projectionCompanyName.toLowerCase().trim();
    const findOneprojection = projectionData?.find(
        (item) => item.companyName.toLowerCase().trim() === cleanedProjectionCompanyName
    );

    // console.log("hasExistingProjection:", hasExistingProjection);
    const functionopenprojection = () => {
        // setProjectingCompany(projectionCompanyName);
        setOpen(true)

        // console.log("projectionCompanyName:", projectionCompanyName);
        // console.log("findOneprojection:", findOneprojection);

        if (findOneprojection) {
            // Existing projection, set edit mode to true
            setCurrentProjection({
                companyName: findOneprojection.companyName,
                ename: findOneprojection.ename,
                offeredPrize: findOneprojection.offeredPrize,
                offeredServices: findOneprojection.offeredServices,
                lastFollowUpdate: findOneprojection.lastFollowUpdate,
                estPaymentDate: findOneprojection.estPaymentDate,
                remarks: findOneprojection.remarks,
                totalPayment: findOneprojection.totalPayment,
                date: "",
                time: "",
                editCount: findOneprojection.editCount,
            });
            setSelectedValues(findOneprojection.offeredServices);
            setIsEditProjection(false);  // Set to true because it's an edit
        } else {
            // No existing projection, we are creating a new one
            setCurrentProjection({
                companyName: projectionCompanyName,
                ename: "",
                offeredPrize: "",
                offeredServices: [],
                totalPayment: 0,
                lastFollowUpdate: "",
                remarks: "",
                date: "",
                time: "",
                editCount: -1,
                totalPaymentError: "",
            });
            setSelectedValues([]);
            setIsEditProjection(true);  // New projection, so not in edit mode
        }
    };

    const closeProjection = () => {
        setOpen(false);
        setCurrentProjection({
            companyName: "",
            ename: "",
            offeredPrize: "",
            offeredServices: "",
            totalPayment: 0,
            lastFollowUpdate: "",
            remarks: "",
            date: "",
            time: "",
        });
        setIsEditProjection(false);
        setSelectedValues([]);
    };
    // console.log("currentProjection", currentProjection)
    // Handle form submission
    const dialogDismissedData = JSON.parse(localStorage.getItem('dialogDismissedData')) || {};

    // Get the current date in YYYY-MM-DD format
    const currentDate = new Date().toISOString().split('T')[0];
    const handleProjectionSubmit = async () => {
        try {

            // Create a new object with only the relevant data fields
            const newEditCount = currentProjection.editCount === -1 ? 0 : currentProjection.editCount + 1;
            // console.log("currentProjection", currentProjection)
            // Manually create a clean object without including any potential non-serializable references
            const finalData = {
                companyName: currentProjection.companyName,
                ename: ename,
                offeredPrize: currentProjection.offeredPrize,
                offeredServices: selectedValues,
                totalPayment: currentProjection.totalPayment,
                lastFollowUpdate: currentProjection.lastFollowUpdate,
                estPaymentDate: currentProjection.estPaymentDate,
                remarks: currentProjection.remarks,
                editCount: newEditCount, // Increment editCount
            };

            // Validation logic
            if (finalData.offeredServices.length === 0) {
                Swal.fire({ title: "Services is required!", icon: "warning" });
            } else if (finalData.remarks === "") {
                Swal.fire({ title: "Remarks is required!", icon: "warning" });
            } else if (Number(finalData.totalPayment) === 0) {
                Swal.fire({ title: "Total Payment Can't be 0!", icon: "warning" });
            } else if (Number(finalData.offeredPrize) === 0) {
                Swal.fire({ title: "Offered Prize is required!", icon: "warning" });
            } else if (Number(finalData.totalPayment) > Number(finalData.offeredPrize)) {
                Swal.fire({
                    title: "Total Payment cannot be greater than Offered Prize!",
                    icon: "warning",
                });
            } else if (!finalData.lastFollowUpdate) {
                Swal.fire({
                    title: "Last FollowUp Date is required!",
                    icon: "warning",
                });
            } else if (!finalData.estPaymentDate) {
                Swal.fire({
                    title: "Estimated Payment Date is required!",
                    icon: "warning",
                });
            } else {
                // Send data to backend API
                const response = await axios.post(
                    `${secretKey}/projection/update-followup`,
                    finalData
                );
                Swal.fire({ title: "Projection Submitted!", icon: "success" });
                const storedData = JSON.parse(localStorage.getItem(userId)) || {};

                // Set count to 3 and dismissed to true, ensuring no further popups
                localStorage.setItem(userId, JSON.stringify({
                    ...storedData,
                    count: 3,  // Set count to maximum to prevent further popups
                    dismissed: true,  // Mark dismissed as true
                    lastShown: new Date(),  // Optionally set the lastShown timestamp
                }));
                closeProjection(); // Close projection after submitting
                fetchProjections(); // Refresh data
            }
        } catch (error) {
            console.error("Error updating or adding data:", error.message);
        }
    };

    // Determine the color and icon based on conditions
    const getIconColor = () => {
        // console.log("hasmaturedstatus" , hasMaturedStatus , projectionCompanyName)
        if (bdmAcceptStatus === "NotForwarded" || hasMaturedStatus) {
            return hasExistingProjection ? "#fbb900" : "#8b8b8b";
        }
        return "black"; // Default color for other statuses
    };

    const bdmProjectionIconColor = () => {
        if (bdmAcceptStatus === "Accept" || hasMaturedStatus) {
            return hasExistingProjection ? "#fbb900" : "black";
        }
    };

    const handleDelete = async (company) => {
        const companyName = company;
        //console.log(companyName);

        try {
            // Send a DELETE request to the backend API endpoint
            const response = await axios.delete(
                `${secretKey}/projection/delete-followup/${companyName}`
            );
            //console.log(response.data.message); // Log the response message
            // Show a success message after successful deletion

            setCurrentProjection({
                companyName: projectionCompanyName,
                ename: "",
                offeredPrize: 0,
                offeredServices: [],
                lastFollowUpdate: "",
                totalPayment: 0,
                estPaymentDate: "",
                remarks: "",
                date: "",
                time: "",
            });
            setSelectedValues([]);
            fetchProjections();
        } catch (error) {
            console.error("Error deleting data:", error);
            // Show an error message if deletion fails
            console.log("Error!", "Follow Up Not Found.", "error");
        }
    };

    //console.log("projectionData", projectionData)

    return (
        <div>
            {<button style={{ border: "transparent", background: "none" }}>
                <RiEditCircleFill
                    onClick={functionopenprojection}
                    style={{
                        cursor: "pointer",
                        width: "17px",
                        newDesignation,
                        height: "17px",
                    }}
                    title="View Projection"
                    color={isBdmProjection ? bdmProjectionIconColor() : getIconColor()} // Set the color based on conditions
                />
            </button>}
            <Drawer
                style={{ top: "50px" }}
                anchor="right"
                open={open}
                onClose={closeProjection}
            >
                <div style={{ width: "31em" }} className="container-xl">
                    <div
                        className="header d-flex justify-content-between align-items-center"
                        style={{ margin: "10px 0px" }}
                    >
                        <h1
                            style={{ marginBottom: "0px", fontSize: "23px" }}
                            className="title"
                        >
                            Projection Form
                        </h1>
                        <div>
                            {projectionCompanyName &&
                                projectionData &&
                                projectionData.some((item) => item.companyName === projectionCompanyName) ? (
                                <>
                                    {(fordesignation !== "admin" && fordesignation !== "datamanager" && !newDesignation) && (
                                        <button
                                            style={{ border: "transparent", background: "none" }}
                                            onClick={() => {
                                                setIsEditProjection(true);
                                            }}
                                        >
                                            <HiPencilSquare color="grey" />
                                        </button>
                                    )}
                                </>
                            ) : null}

                            <button style={{ border: "transparent", background: "none" }}>
                                <IoClose onClick={closeProjection} />
                            </button>
                        </div>

                    </div>
                    <hr style={{ margin: "0px" }} />
                    <div className="body-projection">
                        <div className="header d-flex align-items-center justify-content-between">
                            <div>
                                <h1
                                    title={projectionCompanyName}
                                    style={{
                                        fontSize: "14px",
                                        textShadow: "none",
                                        fontFamily: "sans-serif",
                                        fontWeight: "400",
                                        fontFamily: "Poppins, sans-serif",
                                        margin: "10px 0px",
                                        width: "200px",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {projectionCompanyName}
                                </h1>
                            </div>
                            <div>
                                <button
                                    onClick={() => handleDelete(projectionCompanyName)}
                                    className="btn btn-link"
                                    style={{ color: "grey" }}
                                >
                                    Clear Form
                                </button>
                            </div>
                        </div>
                        <div className="label">
                            <strong>
                                Offered Services{" "}
                                {selectedValues && selectedValues.length === 0 && (
                                    <span style={{ color: "red" }}>*</span>
                                )}{" "}
                                :
                            </strong>
                            <div className="services mb-3">
                                <Select
                                    isMulti
                                    options={options}
                                    onChange={(selectedOptions) => {
                                        setSelectedValues(
                                            selectedOptions.map((option) => option.value)
                                        );
                                    }}
                                    value={selectedValues && selectedValues.map((value) => ({
                                        value,
                                        label: value,
                                    }))}
                                    placeholder="Select Services..."
                                    isDisabled={!isEditProjection || newDesignation}
                                />
                            </div>
                        </div>
                        <div className="label">
                            <strong>
                                Offered Prices(With GST){" "}
                                {!currentProjection.offeredPrize && (
                                    <span style={{ color: "red" }}>*</span>
                                )}{" "}
                                :
                            </strong>
                            <div className="services mb-3">
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Please enter offered Prize"
                                    value={currentProjection.offeredPrize}
                                    onChange={(e) => {
                                        setCurrentProjection((prevLeadData) => ({
                                            ...prevLeadData,
                                            offeredPrize: e.target.value,
                                        }));
                                    }}
                                    disabled={!isEditProjection || newDesignation}
                                />
                            </div>
                        </div>
                        <div className="label">
                            <strong>
                                Expected Price (With GST)
                                {currentProjection.totalPayment === 0 && (
                                    <span style={{ color: "red" }}>*</span>
                                )}{" "}
                                :
                            </strong>
                            <div className="services mb-3">
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Please enter total Payment"
                                    value={currentProjection.totalPayment}
                                    onChange={(e) => {
                                        const newTotalPayment = e.target.value;
                                        if (
                                            Number(newTotalPayment) <=
                                            Number(currentProjection.offeredPrize)
                                        ) {
                                            setCurrentProjection((prevLeadData) => ({
                                                ...prevLeadData,
                                                totalPayment: newTotalPayment,
                                                totalPaymentError: "",
                                            }));
                                        } else {
                                            setCurrentProjection((prevLeadData) => ({
                                                ...prevLeadData,
                                                totalPayment: newTotalPayment,
                                                totalPaymentError:
                                                    "Expected Price should be less than or equal to Offered Price.",
                                            }));
                                        }
                                    }}
                                    disabled={!isEditProjection || newDesignation}
                                />

                                <div style={{ color: "lightred" }}>
                                    {currentProjection.totalPaymentError}
                                </div>
                            </div>
                        </div>

                        <div className="label">
                            <strong>
                                Last Follow Up Date{" "}
                                {!currentProjection.lastFollowUpdate && (
                                    <span style={{ color: "red" }}>*</span>
                                )}
                                :{" "}
                            </strong>
                            <div className="services mb-3">
                                <input
                                    type="date"
                                    className="form-control"
                                    placeholder="Please enter offered Prize"
                                    value={currentProjection.lastFollowUpdate}
                                    onChange={(e) => {
                                        setCurrentProjection((prevLeadData) => ({
                                            ...prevLeadData,
                                            lastFollowUpdate: e.target.value,
                                        }));
                                    }}
                                    disabled={!isEditProjection || newDesignation}
                                />
                            </div>
                        </div>
                        <div className="label">
                            <strong>
                                Payment Expected on{" "}
                                {!currentProjection.estPaymentDate && (
                                    <span style={{ color: "red" }}>*</span>
                                )}
                                :
                            </strong>
                            <div className="services mb-3">
                                <input
                                    type="date"
                                    className="form-control"
                                    placeholder="Please enter Estimated Payment Date"
                                    value={currentProjection.estPaymentDate}
                                    onChange={(e) => {
                                        setCurrentProjection((prevLeadData) => ({
                                            ...prevLeadData,
                                            estPaymentDate: e.target.value,
                                        }));
                                    }}
                                    disabled={!isEditProjection || newDesignation}
                                />
                            </div>
                        </div>
                        <div className="label">
                            <strong>
                                Remarks{" "}
                                {currentProjection.remarks === "" && (
                                    <span style={{ color: "red" }}>*</span>
                                )}
                                :
                            </strong>
                            <div className="remarks mb-3">
                                <textarea
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter any Remarks"
                                    value={currentProjection.remarks}
                                    onChange={(e) => {
                                        setCurrentProjection((prevLeadData) => ({
                                            ...prevLeadData,
                                            remarks: e.target.value,
                                        }));
                                    }}
                                    disabled={!isEditProjection || newDesignation}
                                />
                            </div>
                        </div>
                        <div className="submitBtn">
                            {(fordesignation !== "admin" && fordesignation !== "datamanager") &&
                                (<button
                                    disabled={!isEditProjection || newDesignation}
                                    onClick={handleProjectionSubmit}
                                    style={{ width: "100%" }}
                                    type="submit"
                                    class="btn btn-primary mb-3"
                                >
                                    Submit
                                </button>)
                            }
                        </div >
                        <div>
                        </div>
                    </div >
                </div >
            </Drawer >
        </div >
    );
}

export default ProjectionDialog;
