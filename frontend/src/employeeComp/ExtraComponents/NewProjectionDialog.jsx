import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { IoClose } from "react-icons/io5";
import Swal from "sweetalert2";
import axios from 'axios';
import { MdOutlinePostAdd } from "react-icons/md";
import debounce from "lodash/debounce";

function NewProjectionDialog({ closepopup, open , secretKey }) {
    const [companyName, setCompanyName] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);

    const handleInputChange = (event) => {
        const name = event.target.value;
        setCompanyName(name);

        if (name) {
            searchCompany(name);
        } else {
            setSuggestions([]);
            setSelectedCompany(null);
        }
    };

    console.log("suggections", suggestions)

    const searchCompany = debounce(async (name) => {
        try {
            const response = await axios.get(`${secretKey}/company-data/companies/search`, { params: { name } });
            if (response.data.found) {
                // If a company is found, set suggestions
                setSuggestions(response.data.companies); // Assuming your API returns an array of companies
            } else {
                setSuggestions([]);
            }
        } catch (error) {
            console.error("Error searching for company:", error);
            Swal.fire("Error", "Failed to search for company.", "error");
        }
    }, 300); // Debounce to limit the number of API calls

    const handleSuggestionClick = (company) => {
        setSelectedCompany(company);
        setCompanyName(company["Company Name"]); // Assuming company has a 'name' property
        setSuggestions([]); // Clear suggestions after selection
    };

    return (
        <div>
            <Dialog className='My_Mat_Dialog' open={open} onClose={closepopup} fullWidth maxWidth="sm">
                <DialogTitle>
                    Company Name{" "}
                    <button onClick={closepopup} style={{ backgroundColor: "transparent", border: "none", float: "right" }}>
                        <IoClose color="primary"></IoClose>
                    </button>{" "}
                </DialogTitle>
                <DialogContent>
                    <label htmlFor="companyName">Company Name</label>
                    <input
                        id="companyName"
                        type="text"
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
                    {suggestions.length > 0 && (
                        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                            {suggestions.map((company, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleSuggestionClick(company)}
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
                </DialogContent>
                <div className="card-footer">
                    {selectedCompany && (
                        <button
                            style={{ width: "100%" }}
                            className="btn btn-success bdr-radius-none"
                            onClick={() => {/* Handle Add Lead action here */}}
                        >
                            <MdOutlinePostAdd /> Add Lead
                        </button>
                    )}
                    {!selectedCompany && (
                        <button
                            style={{ width: "100%" }}
                            className="btn btn-primary bdr-radius-none"
                            disabled={!companyName}
                        >
                            Submit
                        </button>
                    )}
                </div>
            </Dialog>
        </div>
    );
}

export default NewProjectionDialog;
