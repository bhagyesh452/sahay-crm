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

function NewProjectionDialog({ closepopup, open, employeeName, refetch, isFilledFromTeamLeads }) {

    const secretKey = process.env.REACT_APP_SECRET_KEY;

    const [companyName, setCompanyName] = useState('');
    const [companyId, setCompanyId] = useState('');
    const [companyStatus, setCompanyStatus] = useState('');
    const [selectedBdm, setSelectedBdm] = useState('');
    const [selectedBde, setSelectedBde] = useState('');
    const [offeredServices, setOfferedServices] = useState([]);
    const [offeredPrice, setOfferedPrice] = useState(null);
    const [expectedPrice, setExpectedPrice] = useState(null);
    const [followupDate, setFollowupDate] = useState('');
    const [paymentDate, setPaymentDate] = useState('');
    const [remarks, setRemarks] = useState('');
    const [bdmName, setBdmName] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [companyNotFound, setCompanyNotFound] = useState(false);
    const [showAddLeadsPopup, setShowAddLeadsPopup] = useState(false);

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

    console.log("suggections", suggestions);

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
                .filter(employee => (employee.newDesignation === "Business Development Manager" || employee.newDesignation === "Floor Manager") && employee.ename !== employeeName)
                .map(employee => employee.ename);
            setBdmName(data);
            // console.log("Bdm Names :", data);
        } catch (error) {
            console.log("Error fetching bdm names", error);
        }
    };

    const handleAddProjection = async () => {
        const payload = {
            companyName: companyName,
            companyId: companyId,
            ename: employeeName,
            date: new Date(),
            time: new Date().toLocaleTimeString(),
            offeredServices: offeredServices,
            offeredPrice: offeredPrice,
            totalPayment: expectedPrice,
            lastFollowUpdate: followupDate,
            estPaymentDate: paymentDate,
            remarks: remarks,
            bdeName: isFilledFromTeamLeads ? selectedBde : employeeName,
            bdmName: isFilledFromTeamLeads || !selectedBdm ? employeeName : selectedBdm,
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
            const res = await axios.post(`${secretKey}/company-data/addProjection/${companyId}`, payload);
            console.log("Projection submitted :", res.data.data);
            Swal.fire("Success", "Projection submitted successfully.", "success");
            handleClosePopup();
        } catch (error) {
            console.log("Error submitting projection", error);
            Swal.fire("Error", "Failed to submit projection.", "error");
        }
    };

    useEffect(() => {
        fetchBdmNames();
    }, []);

    return (
        <div>
            <Dialog className='My_Mat_Dialog' open={open} fullWidth maxWidth="sm">

                <DialogTitle>
                    Add Projection{" "}
                    <button onClick={handleClosePopup} style={{ backgroundColor: "transparent", border: "none", float: "right" }}>
                        <IoClose color="primary"></IoClose>
                    </button>{" "}
                </DialogTitle>

                <DialogContent>
                    <label htmlFor="companyName">Company Name</label>
                    <input id="companyName" type="text" placeholder="Enter Company Name"
                        value={companyName}
                        onChange={handleInputChange}
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
                                            <label for="bdeName">BDE Name <span style={{ color: "red" }}>*</span> :</label>
                                            <input type="text" className="form-control mt-1" value={selectedBde} disabled />
                                        </> : <>
                                            <label for="bdmName">Select BDM :</label>
                                            <select className="form-select mt-1" name="bdmName" id="bdmName" disabled={!selectedCompany}
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
                                        <Select isMulti className="mt-1" options={options} placeholder="Select Services..." isDisabled={!selectedCompany}
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
                                        <input type="number" className="form-control mt-1" placeholder="Please Enter Offered Price" disabled={!selectedCompany}
                                            value={offeredPrice} onChange={(e) => setOfferedPrice(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="col-sm-6">
                                    <div className="form-group mt-2 mb-2">
                                        <label for="expectedPrice">Expected Price (With GST) <span style={{ color: "red" }}>*</span> :</label>
                                        <input type="number" className="form-control mt-1" placeholder="Please Enter Expected Price" disabled={!selectedCompany}
                                            value={expectedPrice} onChange={(e) => setExpectedPrice(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="form-group mt-2 mb-2">
                                        <label for="followupDate">Last Follow Up Date <span style={{ color: "red" }}>*</span> :</label>
                                        <input type="date" className="form-control mt-1" disabled={!selectedCompany}
                                            value={followupDate} onChange={(e) => setFollowupDate(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="col-sm-6">
                                    <div className="form-group mt-2 mb-2">
                                        <label for="paymentDate">Payment Expected On <span style={{ color: "red" }}>*</span> :</label>
                                        <input type="date" className="form-control mt-1" disabled={!selectedCompany}
                                            value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="form-group mt-2 mb-2">
                                    <label for="remarks">Remarks <span style={{ color: "red" }}>*</span> :</label>
                                    <textarea className="form-control mt-1" placeholder="Enter Remarks Here" disabled={!selectedCompany}
                                        value={remarks} onChange={(e) => setRemarks(e.target.value)}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>

                <div className="card-footer">
                    {/* {selectedCompany && ( */}
                    <button style={{ width: "100%" }} className="btn btn-success bdr-radius-none cursor-pointer"
                        onClick={handleAddProjection} disabled={companyNotFound || !selectedCompany}>
                        <MdOutlinePostAdd /> Add Projection
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
                </div>
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