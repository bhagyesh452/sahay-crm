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
    editingStateOfProjection,
    secretKey,
    fetchProjections,
    ename
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
    
      // Function to open projection dialog and set the current projection data
      const functionopenprojection = (comName) => {
        setProjectingCompany(comName);
        setOpen(true);
        const findOneprojection = projectionData.find(
          (item) => item.companyName === comName
        );
        if (findOneprojection) {
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
    
      // Handle form submission
      const handleProjectionSubmit = async () => {
        try {
          const newEditCount =
            currentProjection.editCount === -1 ? 0 : currentProjection.editCount + 1;
    
          const finalData = {
            ...currentProjection,
            companyName: projectingCompany,
            ename: ename,
            offeredServices: selectedValues,
            editCount: currentProjection.editCount + 1, // Increment editCount
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
            closeProjection(); // Close projection after submitting
            fetchProjections(); // Refresh data
          }
        } catch (error) {
          console.error("Error updating or adding data:", error.message);
        }
      };
    // Check if the company has an existing projection
    const hasExistingProjection = projectionData?.some(
        (item) => item.companyName === projectionCompanyName
    );

    // Handle drawer open/close state
    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    // Determine the color and icon based on conditions
    const getIconColor = () => {
        if (bdmAcceptStatus === "NotForwarded") {
            return hasExistingProjection ? "#fbb900" : "#8b8b8b";
        }
        return "black"; // Default color for other statuses
    };

    const handleIconClick = () => {
        // Open the drawer or do other actions based on conditions
        if (bdmAcceptStatus === "NotForwarded") {
            if (hasExistingProjection) {
                editingStateOfProjection && editingStateOfProjection(true); // Optionally handle editing state
            }
        }
        setOpen(true); // Open the drawer
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
                companyName: "",
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

    return (
        <div>
            <button style={{ border: "transparent", background: "none" }}>
                <RiEditCircleFill
                    onClick={handleIconClick}
                    style={{
                        cursor: "pointer",
                        width: "17px",
                        height: "17px",
                    }}
                    color={getIconColor()} // Set the color based on conditions
                />
            </button>
            {/* <Drawer
                style={{ top: "50px" }}
                anchor="right"
                open={open}
                onClose={toggleDrawer(false)}
            >
                <div style={{ width: "31em" }}>
                    <h3>Project Details for {projectionCompanyName}</h3>
                  
                    {hasExistingProjection ? (
                        <div>
                            <p>Editing Existing Projection</p>
                           
                        </div>
                    ) : (
                        <div>
                            <p>New Projection</p>
                           
                        </div>
                    )}
                    <button onClick={toggleDrawer(false)}>
                        <IoClose size={24} /> Close
                    </button>
                </div>
            </Drawer> */}
            <Drawer
                style={{ top: "50px" }}
                anchor="right"
                open={open}
                onClose={toggleDrawer(false)}
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
                                projectionData.some(
                                    (item) => item.companyName === projectionCompanyName
                                ) ? (
                                <>
                                    <button
                                        onClick={() => {
                                            editingStateOfProjection(true);
                                        }}
                                    >
                                        <HiPencilSquare color="grey"/>
                                    </button>
                                </>
                            ) : null}

                            <button>
                                <IoClose onClick={toggleDrawer(false)} />
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
                                {selectedValues.length === 0 && (
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
                                    value={selectedValues.map((value) => ({
                                        value,
                                        label: value,
                                    }))}
                                    placeholder="Select Services..."
                                    isDisabled={!isEditProjection}
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
                                    disabled={!isEditProjection}
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
                                    disabled={!isEditProjection}
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
                                    disabled={!isEditProjection}
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
                                    disabled={!isEditProjection}
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
                                    disabled={!isEditProjection}
                                />
                            </div>
                        </div>
                        <div className="submitBtn">
                            <button
                                disabled={!isEditProjection}
                                onClick={handleProjectionSubmit}
                                style={{ width: "100%" }}
                                type="submit"
                                class="btn btn-primary mb-3"
                            >
                                Submit
                            </button>
                        </div>
                        <div>
                        </div>
                    </div>
                </div>
            </Drawer>
        </div>
    );
}

export default ProjectionDialog;
