import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { IoClose } from "react-icons/io5";
import Swal from "sweetalert2";
import axios from 'axios';
import { MdOutlinePostAdd } from "react-icons/md";
import debounce from "lodash/debounce";
import Select from "react-select";
import { options } from "../../components/Options.js";
import EmployeeAddLeadDialog from './EmployeeAddLeadDialog';

function NewProjectionDialog({ closepopup, open, viewProjection, employeeName, refetch, isFilledFromTeamLeads, isProjectionEditable, projectionData, fetchNewProjection }) {

    const secretKey = process.env.REACT_APP_SECRET_KEY;

    // Convert the date to a valid "YYYY-MM-DD" format for input fields
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        // Ensure date is valid before formatting
        return !isNaN(date.getTime()) ? date.toISOString().split("T")[0] : "";
    };

    const [companyName, setCompanyName] = useState(projectionData ? (projectionData.companyName || projectionData["Company Name"]) : '');
    const [companyId, setCompanyId] = useState(projectionData ? projectionData._id : '');
    const [companyStatus, setCompanyStatus] = useState(projectionData ? projectionData.Status : '');
    const [selectedBdm, setSelectedBdm] = useState(projectionData ? projectionData.bdmName : '');
    const [selectedBde, setSelectedBde] = useState(projectionData ? (projectionData.bdeName || projectionData.ename) : '');
    const [offeredServices, setOfferedServices] = useState(projectionData ? projectionData.offeredServices : []);
    const [offeredPrice, setOfferedPrice] = useState(projectionData ? projectionData.offeredPrice : null);
    const [expectedPrice, setExpectedPrice] = useState(projectionData ? projectionData.totalPayment : null);
    const [followupDate, setFollowupDate] = useState(projectionData ? formatDate(projectionData.lastFollowUpdate) : '');
    const [paymentDate, setPaymentDate] = useState(projectionData ? formatDate(projectionData.estPaymentDate) : '');
    const [remarks, setRemarks] = useState(projectionData ? projectionData.remarks : '');
    const [bdmName, setBdmName] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [companyNotFound, setCompanyNotFound] = useState(false);
    const [showAddLeadsPopup, setShowAddLeadsPopup] = useState(false);
    const [isProjectionAvailable, setIsProjectionAvailable] = useState(false);

    const handleInputChange = (event) => {
        const name = event.target.value;
        setCompanyName(name);

        if (name) {
            searchCompany(name);
        } else {
            setSuggestions([]);
            setSelectedCompany(null);
            setCompanyNotFound(false);
        }
    };

    // console.log("suggections", suggestions);

    const searchCompany = debounce(async (name) => {
        try {
            let response;

            // Only call the necessary API based on isFilledFromTeamLeads
            if (isFilledFromTeamLeads) {
                response = await axios.get(`${secretKey}/company-data/companies/searchforTeamLeads/${employeeName}`, { params: { name } });
            } else {
                response = await axios.get(`${secretKey}/company-data/companies/searchforLeads/${employeeName}`, { params: { name } });
            }

            if (response.data.found) {
                // If a company is found, set suggestions
                setSuggestions(response.data.companies); // Assuming your API returns an array of companies
                setCompanyNotFound(false);
            } else {
                setSuggestions([]);
                setCompanyNotFound(true); // Set company not found message
            }
        } catch (error) {
            console.error("Error searching for company:", error);
            Swal.fire("Error", "Failed to search for company.", "error");
        }
    }, 300); // Debounce to limit the number of API calls

    const handleSuggestionClick = (company) => {
        setSelectedCompany(company);
        setCompanyName(company["Company Name"]); // Assuming company has a 'name' property
        setCompanyId(company._id);
        setCompanyStatus(company.Status);
        setSelectedBde(company.ename);
        setSuggestions([]); // Clear suggestions after selection
        setCompanyNotFound(false); // Reset companyNotFound since a company was selected
    };

    const handleClosePopup = () => {
        closepopup();
        setSelectedCompany(null);
        setCompanyName('');
        setSuggestions([]);
        setCompanyNotFound(false);
        setSelectedBde('');
        setSelectedBdm('');
        setOfferedServices([]);
        setOfferedPrice(null);
        setExpectedPrice(null);
        setFollowupDate('');
        setPaymentDate('');
        setRemarks('');
    };

    const handleCloseAddLeadsPopup = () => {
        setShowAddLeadsPopup(false);
    };

    const fetchBdmNames = async () => {
        try {
            const res = await axios.get(`${secretKey}/employee/einfo`);
            const data = res.data
                .filter(employee => (employee.newDesignation === "Business Development Manager" || employee.newDesignation === "Floor Manager"))
                .map(employee => employee.ename);
            setBdmName(data);
            // console.log("Bdm Names :", data);
        } catch (error) {
            console.log("Error fetching bdm names", error);
        }
    };

    useEffect(() => {
        fetchBdmNames();
    }, []);

    const fetchSelectedCompanyProjection = async () => {
        try {
            const res = await axios.get(`${secretKey}/company-data/getProjection/${employeeName}`, {
                params: {
                    companyName: selectedCompany["Company Name"],
                }
            });
            const projectionData = res.data.data;
            // console.log("Fetched projection is :", projectionData);

            if (projectionData) {
                const futureProjections = projectionData.filter(p => new Date(p.estPaymentDate).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0));

                if (futureProjections.length > 0) {
                    // Sort future projections by estPaymentDate in descending order
                    const latestProjection = futureProjections.sort((a, b) => new Date(b.projectionDate) - new Date(a.projectionDate))[0];

                    // Fill the form with latest future projection
                    setIsProjectionAvailable(true);
                    setCompanyName(latestProjection.companyName);
                    setCompanyId(latestProjection.companyId);
                    setSelectedBdm(latestProjection.bdmName);
                    setSelectedBde(latestProjection.bdeName);
                    setOfferedServices(latestProjection.offeredServices);
                    setOfferedPrice(latestProjection.offeredPrice);
                    setExpectedPrice(latestProjection.totalPayment);
                    setFollowupDate(formatDate(latestProjection.lastFollowUpdate));
                    setPaymentDate(formatDate(latestProjection.estPaymentDate));
                    setRemarks(latestProjection.remarks);
                }
            }
        } catch (error) {
            console.log("Error fetching projection for selected company :", error);
            setIsProjectionAvailable(false);
        }
    };

    useEffect(() => {
        if (selectedCompany) {
            setCompanyName(selectedCompany["Company Name"]);
            fetchSelectedCompanyProjection();
        } else if (!projectionData) {
            // Clear fields only if there's no projection data available (i.e., not in edit mode)
            setIsProjectionAvailable(false);
            setCompanyId('');
            setCompanyName('');
            setSelectedBdm('');
            setSelectedBde('');
            setOfferedServices([]);
            setOfferedPrice('');
            setExpectedPrice('');
            setFollowupDate('');
            setPaymentDate('');
            setRemarks('');
        }
    }, [selectedCompany, projectionData]);

    const handleAddProjection = async () => {
        const payload = {
            companyName: companyName,
            companyId: companyId,
            ename: employeeName ? employeeName : projectionData.ename,
            date: new Date(),
            time: new Date().toLocaleTimeString(),
            offeredServices: offeredServices,
            offeredPrice: offeredPrice,
            totalPayment: expectedPrice,
            lastFollowUpdate: followupDate,
            estPaymentDate: paymentDate,
            remarks: remarks,
            bdeName: isFilledFromTeamLeads ? selectedBde : (employeeName || projectionData.ename),
            bdmName: selectedBdm ? selectedBdm : (isFilledFromTeamLeads || projectionData) ? (employeeName || projectionData.ename) : employeeName,
            caseType: isFilledFromTeamLeads ? "Received" : "NotForwarded",
            isPreviousMaturedCase: companyStatus === "Matured" ? true : false
        };
        
        if (offeredServices.length === 0) {
            Swal.fire({ title: "Please Select service!", icon: "warning" });
            return;
        } else if (!offeredPrice) {
            Swal.fire({ title: "Please Enter Offered Price!", icon: "warning" });
            return;
        } else if (!expectedPrice) {
            Swal.fire({ title: "Please Enter Expected Price!", icon: "warning" });
            return;
        } else if (Number(expectedPrice) > Number(offeredPrice)) {
            Swal.fire({ title: "Expected Price cannot be greater than Offered Price!", icon: "warning" });
            return;
        } else if (!followupDate) {
            Swal.fire({ title: "Please Select Follow Up Date!", icon: "warning" });
            return;
        } else if (!paymentDate) {
            Swal.fire({ title: "Please Select Payment Date!", icon: "warning" });
            return;
        } else if (remarks === "") {
            Swal.fire({ title: "Please Enter Remarks!", icon: "warning" });
            return;
        }

        try {
            const res = await axios.post(`${secretKey}/company-data/addProjection/${companyName}`, payload);
            // console.log("Projection submitted :", res.data.data);
            Swal.fire("Success", "Projection submitted successfully.", "success");
            handleClosePopup();
            fetchNewProjection && fetchNewProjection();
        } catch (error) {
            console.log("Error submitting projection", error);
            Swal.fire("Error", "Failed to submit projection.", "error");
        }
    };

    const handleUpdateProjection = async () => {
        const payload = {
            ename: isFilledFromTeamLeads ? selectedBdm : selectedBde,
            date: new Date(),
            time: new Date().toLocaleTimeString(),
            offeredServices: offeredServices,
            offeredPrice: offeredPrice,
            totalPayment: expectedPrice,
            lastFollowUpdate: new Date(followupDate),
            estPaymentDate: new Date(paymentDate),
            bdeName: isProjectionAvailable ? selectedBde : projectionData.bdeName,
            bdmName: !selectedBdm ? projectionData.bdmName : selectedBdm,
            remarks: remarks,
            caseType: isFilledFromTeamLeads ? "Received" : "NotForwarded",
            isPreviousMaturedCase: companyStatus === "Matured" ? true : false
        };

        if (offeredServices.length === 0) {
            Swal.fire({ title: "Please Select service!", icon: "warning" });
            return;
        } else if (!offeredPrice) {
            Swal.fire({ title: "Please Enter Offered Price!", icon: "warning" });
            return;
        } else if (!expectedPrice) {
            Swal.fire({ title: "Please Enter Expected Price!", icon: "warning" });
            return;
        } else if (Number(expectedPrice) > Number(offeredPrice)) {
            Swal.fire({ title: "Expected Price cannot be greater than Offered Price!", icon: "warning" });
            return;
        } else if (!followupDate) {
            Swal.fire({ title: "Please Select Follow Up Date!", icon: "warning" });
            return;
        } else if (!paymentDate) {
            Swal.fire({ title: "Please Select Payment Date!", icon: "warning" });
            return;
        } else if (remarks === "") {
            Swal.fire({ title: "Please Enter Remarks!", icon: "warning" });
            return;
        }

        try {
            const res = await axios.put(`${secretKey}/company-data/updateProjection/${companyName}`, payload);
            // console.log("Projection updated :", res.data.data);
            Swal.fire("Success", "Projection updated successfully.", "success");
            handleClosePopup();
            fetchNewProjection && fetchNewProjection();
        } catch (error) {
            console.log("Error updating projection", error);
            Swal.fire("Error", "Failed to update projection.", "error");
        }
    };

    

    return (
        <div>
            <Dialog className='My_Mat_Dialog' open={open} fullWidth maxWidth="sm">

                <DialogTitle>
                    {viewProjection ? "View Projection" : (isProjectionEditable || isProjectionAvailable) ? "Update Projection" : "Add Projection"}
                    <button onClick={handleClosePopup} style={{ backgroundColor: "transparent", border: "none", float: "right" }}>
                        <IoClose color="primary"></IoClose>
                    </button>{" "}
                </DialogTitle>

                <DialogContent>
                    <label htmlFor="companyName">Company Name</label>
                    <input id="companyName" type="text" placeholder="Enter Company Name"
                        value={companyName}
                        onChange={handleInputChange}
                        disabled={isProjectionEditable || viewProjection || projectionData}
                        style={{
                            width: "100%",
                            padding: "8px",
                            margin: "10px 0",
                            border: "1px solid #ccc",
                            borderRadius: "4px"
                        }}
                    />
                    {companyNotFound && (
                        <div className='d-flex justify-content-between'>
                            <p className='text-danger'>Company Not Found...! Please Add a Lead to Add Projection</p>
                            <button className='btn btn-primary' onClick={() => {
                                setShowAddLeadsPopup(true);
                                closepopup();
                                setSelectedCompany(null);
                                setCompanyName('');
                                setSuggestions([]);
                                setCompanyNotFound(false);
                            }}>
                                Add Company
                            </button>
                        </div>
                    )}

                    {suggestions.length > 0 && (
                        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                            {suggestions.map((company, index) => (
                                <li key={index} onClick={() => handleSuggestionClick(company)}
                                    style={{
                                        padding: "8px",
                                        border: "1px solid #ccc",
                                        borderRadius: "4px",
                                        margin: "5px 0",
                                        cursor: "pointer",
                                        backgroundColor: "#f9f9f9"
                                    }}
                                >
                                    {company["Company Name"]} {/* Adjust based on your company object structure */}
                                </li>
                            ))}
                        </ul>
                    )}

                    {!companyNotFound && (
                        <>
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="form-group mt-2 mb-2">
                                        {isFilledFromTeamLeads ? <>
                                            <label for="bdeName">BDE Name :</label>
                                            <input type="text" className="form-control mt-1" value={selectedBde} disabled />
                                        </> : <>
                                            <label for="bdmName">Select BDM :</label>
                                            <select className="form-select mt-1" name="bdmName" id="bdmName" disabled={!selectedCompany && !isProjectionEditable && (viewProjection || !projectionData)}
                                                value={selectedBdm} onChange={(e) => setSelectedBdm(e.target.value)}
                                            >
                                                <option value="">Select BDM</option>
                                                {bdmName.map((name, index) => (
                                                    <option key={index} value={name}>{name}</option>
                                                ))}
                                            </select>
                                        </>}
                                    </div>
                                </div>

                                <div className="col-sm-6">
                                    <div className="form-group mt-2 mb-2">
                                        <label for="services">Offered Services <span style={{ color: "red" }}>*</span> :</label>
                                        <Select isMulti className="mt-1" options={options} placeholder="Select Services..." isDisabled={!selectedCompany && !isProjectionEditable && (viewProjection || !projectionData)}
                                            onChange={(selectedOptions) => setOfferedServices(selectedOptions.map((option) => option.value))}
                                            value={offeredServices && offeredServices.map((value) => ({
                                                value,
                                                label: value,
                                            }))}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="form-group mt-2 mb-2">
                                        <label for="offeredPrice">Offered Price (With GST) <span style={{ color: "red" }}>*</span> :</label>
                                        <input type="number" className="form-control mt-1" placeholder="Please Enter Offered Price" disabled={!selectedCompany && !isProjectionEditable && (viewProjection || !projectionData)}
                                            value={offeredPrice} onChange={(e) => setOfferedPrice(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="col-sm-6">
                                    <div className="form-group mt-2 mb-2">
                                        <label for="expectedPrice">Expected Price (With GST) <span style={{ color: "red" }}>*</span> :</label>
                                        <input type="number" className="form-control mt-1" placeholder="Please Enter Expected Price" disabled={!selectedCompany && !isProjectionEditable && (viewProjection || !projectionData)}
                                            value={expectedPrice} onChange={(e) => setExpectedPrice(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="form-group mt-2 mb-2">
                                        <label for="followupDate">Last Follow Up Date <span style={{ color: "red" }}>*</span> :</label>
                                        <input type="date" className="form-control mt-1" disabled={!selectedCompany && !isProjectionEditable && (viewProjection || !projectionData)}
                                            value={followupDate} onChange={(e) => setFollowupDate(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="col-sm-6">
                                    <div className="form-group mt-2 mb-2">
                                        <label for="paymentDate">Payment Expected On <span style={{ color: "red" }}>*</span> :</label>
                                        <input type="date" className="form-control mt-1" disabled={!selectedCompany && !isProjectionEditable && (viewProjection || !projectionData)}
                                            value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="form-group mt-2 mb-2">
                                    <label for="remarks">Remarks <span style={{ color: "red" }}>*</span> :</label>
                                    <textarea className="form-control mt-1" placeholder="Enter Remarks Here" disabled={!selectedCompany && !isProjectionEditable && (viewProjection || !projectionData)}
                                        value={remarks} onChange={(e) => setRemarks(e.target.value)}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>

                {!viewProjection && <div className="card-footer">
                    {/* {selectedCompany && ( */}
                    <button style={{ width: "100%" }} className="btn btn-success bdr-radius-none cursor-pointer"
                        onClick={(isProjectionEditable || isProjectionAvailable) ? handleUpdateProjection : handleAddProjection} disabled={companyNotFound && !selectedCompany}>
                        <MdOutlinePostAdd /> {(isProjectionEditable || isProjectionAvailable) ? "Update Projection" : "Add Projection"}
                    </button>
                    {/* )} */}

                    {/* {!selectedCompany && (
                        <button
                            style={{ width: "100%" }}
                            className="btn btn-primary bdr-radius-none"
                            disabled={!companyName || companyNotFound}
                        >
                            Submit
                        </button>
                    )} */}
                </div>}
            </Dialog>

            {showAddLeadsPopup && (
                <EmployeeAddLeadDialog
                    ename={employeeName}
                    refetch={refetch}
                    showPopup={showAddLeadsPopup}
                    closePopup={handleCloseAddLeadsPopup}
                />
            )}
        </div>
    );
}

export default NewProjectionDialog;