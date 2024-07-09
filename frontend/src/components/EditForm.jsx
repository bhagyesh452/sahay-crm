import React, { useEffect } from "react";

import { useState } from "react";
import axios from "axios";

import Swal from "sweetalert2";

import "../assets/styles.css";
import Select from "react-select";
import { IconX } from "@tabler/icons-react";
import { parse } from "papaparse";
import Edit from "@mui/icons-material/Edit";
const options = [
  
  { value: "Start-Up India Certificate", label: "Start-Up India Certificate" },
  { value: "Start-Up India Certificate With DSC", label: "Start-Up India Certificate with DSC" },
  { value: "MSME/UYDAM Certificate", label: "MSME/UYDAM Certificate 3" },
  { value: "ISO Certificate", label: "ISO Certificate" },
  { value: "IEC CODE Certificate", label: "IEC CODE Certificate" },
  { value: "BIS Certificate", label: "BIS Certificate" },
  { value: "NSIC Certificate", label: "NSIC Certificate" },
  { value: "FSSAI Certificate", label: "FSSAI Certificate" },
  { value: "APEDA Certificate", label: "APEDA Certificate" },
  { value: "GST Certificate", label: "GST Certificate" },
  { value: "Pitch Deck Development ", label: "Pitch Deck Development" },
  { value: "Financial Modeling", label: "Financial Modeling" },
  { value: "DPR Development", label: "DPR Developmen" },
  { value: "CMA Report Development", label: "CMA Report Development" },
  { value: "Company Profile Write-Up", label: "Company Profile" },
  { value: "Company Brochure", label: "Company Brochure" },
  { value: "Product Catalog", label: "Product Catalog" },
  { value: "Logo Design", label: "Logo Design" },
  { value: "Seed Funding Support", label: "Seed Funding Support" },
  { value: "Angel Funding Support", label: "Angel Funding Support" },
  { value: "VC Funding Support", label: "VC Funding Support" },
  { value: "Crowd Funding Support", label: "Crowd Funding Support" },
  { value: "I-Create", label: "I-Create" },
  { value: "Nidhi Seed Support Scheme", label: "Nidhi Seed Support Scheme  " },
  { value: "Nidhi Prayash Yojna", label: "Nidhi Prayash Yojna" },
  { value: "NAIF", label: "NAIF" },
  { value: "Raftaar", label: "Raftaar" },
  { value: "CSR Funding", label: "CSR Funding" },
  {value : 'Stand-Up India' , label : 'Stand-Up India'},
  {value : 'PMEGP' , label : 'PMEGP'},
  {value : 'USAID' , label : 'USAID'},
  {value : 'UP Grant' , label : 'UP Grant'},
  {value : 'DBS Grant' , label : 'DBS Grant'},
  {value : 'MSME Innovation' , label : 'MSME Innovation'},
  {value : 'MSME Hackathon' , label : 'MSME Hackathon'},
  {value : 'Gujarat Grant' , label : 'Gujarat Grant'},
  {value : 'CGTMSC' , label : 'CGTMSC'},
  {value : 'Income Tax Exemption' , label : 'Income Tax Exemption'},
  {value : 'Mudra Loan' , label : 'Mudra Loan'},
  {value : 'SIDBI Loan' , label : 'SIDBI Loan'},
  {value : 'Incubation Support' , label : 'Incubation Support'},
  {value : 'Digital Marketing' , label : 'Digital Marketing'},
  { value: "SEO Services", label: "SEO Services" },
  { value: "Branding Services", label: "Branding Services" },
  {
    value: "Social Promotion Management",
    label: "Social Promotion Management",
  },
  { value: "Email Marketing", label: "Email Marketing" },
  { value: "Digital Content", label: "Digital Content" },
  { value: "Lead Generation", label: "Lead Generation" },
  { value: "Whatsapp Marketing", label: "Whatsapp Marketing" },
  { value: "Website Development", label: "Website Development" },
  { value: "App Design & Development", label: "App Design & Development" },
  {
    value: "Web Application Development",
    label: "Web Application Development",
  },
  { value: "Software Development", label: "Software Development" },
  { value: "CRM Development", label: "CRM Development" },
  { value: "ERP Development", label: "ERP Development" },
  { value: "E-Commerce Website", label: "E-Commerce Website" },
  { value: "Product Development", label: "Product Development" },
  { value: "Company Incorporation", label: "Company Incorporation" },
  { value: "Trademark Registration", label: "Trademark Registration" },
  { value: "Copyright Registration", label: "Copyright Registration" },
  { value: "Patent Registration", label: "Patent Registration" },
  { value: "Organization DSC", label: "Organization DSC" },
  { value: "Director DSC", label: "Director DSC" },
  { value: "Self Certification", label: "Self Certification" },
  { value: "GeM", label: "GeM" },

  // Add more options as needed
];
const customStyles = {
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "blue"
      : state.isDisabled
      ? "#ffb900"
      : "white",
    color: state.isDisabled ? "white" : "black",
    // Add more styles as needed
  }),
};

function EditForm({
  matured,
  companysId,
  companysName,
  companysEmail,
  companysInco,
  employeeName,
  employeeEmail,
  companyNumber,
}) {
  const [companyData, setCompanyData] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [unames, setUnames] = useState([]);
  const [checkStat, setCheckStat] = useState(false);
  const [paymentCount, setpaymentCount] = useState(0);
  const [oldPaymentCount, setOldPaymentCount] = useState(0)
  const [otherName, setotherName] = useState("");
  const [leadData, setLeadData] = useState({
    // Initialize properties with default values if needed
    bdmName: companyData.bdmName,
    bdmEmail: companyData.bdmEmail,
    bdmType: companyData.bdmType,
    supportedBy: companyData.supportedBy,
    bookingDate: companyData.bookingDate,
    caCase: companyData.caCase,
    caNumber: companyData.caNumber,
    caEmail: companyData.caEmail,
    caCommission: companyData.caCommission,
    companyName: companyData.companyName,
    contactNumber: companyData.contactNumber,
    companyEmail: companyData.companyEmail,
    services: companyData.services,
    originalTotalPayment: companyData.originalTotalPayment,
    totalPayment: companyData.totalPayment,
    paymentTerms: companyData.paymentTerms,
    paymentMethod: companyData.paymentMethod,
    firstPayment: companyData.firstPayment,
    secondPayment: companyData.secondPayment,
    thirdPayment: companyData.thirdPayment,
    fourthPayment: companyData.fourthPayment,
    paymentRemarks: companyData.paymentRemarks,
    paymentReciept: companyData.paymentReciept,
    bookingSource: companyData.bookingSource,
    cPANorGSTnum: companyData.cPANorGSTnum,
    incoDate: companyData.incoDate,
    extraNotes: companyData.extraNotes,
    otherDocs: companyData.otherDocs,
  });
  const secretKey = process.env.REACT_APP_SECRET_KEY;
console.log(companyData)
  const fetchCompanyDetails = async () => {
    try {
      const response = await axios.get(`${secretKey}/company/${companysName}`);
      setCompanyData(response.data);
      setSelectedValues(response.data.services);
    } catch {
      console.error("Error Fetching company Data");
    }
  };
  const [companyDataLoaded, setCompanyDataLoaded] = useState(false);

  useEffect(() => {
    
      changeCount();
      setCompanyDataLoaded(true);
    
  }, [companyData]);
  
  const changeCount = () => {

    setOldPaymentCount(
      companyData.paymentTerms === "Full Advanced" ? 1 :
      companyData.thirdPayment === 0 ? 2 :
      companyData.fourthPayment === 0 ? 3 : 4
    );
  };
  


 
  const fetchData = async () => {
    try {
      const response = await axios.get(`${secretKey}/employee/einfo`);

      // Set the retrieved data in the state
      const tempData = response.data;
      setUnames(tempData);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  console.log(selectedValues);
  const handleStatusChange = async (companysId) => {
    const newStatus = "Matured";
    try {
      // Make an API call to update the employee status in the database
      const response = await axios.post(
        `${secretKey}/company-data/update-status/${companysId}`,
        {
          newStatus,
        }
      );

      // Check if the API call was successful
      if (response.status === 200) {
      } else {
        // Handle the case where the API call was not successful
        console.error("Failed to update status:", response.data.message);
      }
    } catch (error) {
      // Handle any errors that occur during the API call
      console.error("Error updating status:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
    fetchCompanyDetails();
  }, []);
 

  const handleSubmitForm = async () => {
    const currentTime = new Date();
    const formattedTime = formatTime(currentTime);

    const formData = new FormData();
    if (companyData.bdmName === "other") {
      formData.append("bdmName", otherName);
    } else {
      formData.append("bdmName", companyData.bdmName);
    }

    formData.append("bdmEmail", companyData.bdmEmail);
    formData.append("bdmType", companyData.bdmType);
    formData.append("bookingTime", formattedTime);
    formData.append("supportedBy", companyData.supportedBy);
    formData.append("bookingDate", companyData.bookingDate);
    formData.append("caCase", companyData.caCase);
    formData.append("caNumber", companyData.caNumber);
    formData.append("caEmail", companyData.caEmail);
    formData.append("caCommission", companyData.caCommission);

    formData.append("empName", companyData.bdeName);
    formData.append("empEmail", companyData.bdeEmail);
    {
      matured
        ? formData.append("companyName", companysName)
        : formData.append("companyName", companyData.companyName);
    }

    formData.append("contactNumber", companyData.contactNumber);
    formData.append("companyEmail", companyData.companyEmail)
        
    formData.append("services", selectedValues);
    formData.append("originalTotalPayment", companyData.originalTotalPayment);
    formData.append("totalPayment", companyData.totalPayment);
    formData.append("paymentTerms", companyData.paymentTerms);
    formData.append("paymentMethod", companyData.paymentMethod);
    formData.append("firstPayment", companyData.firstPayment);
    formData.append("secondPayment", companyData.secondPayment);
    formData.append("thirdPayment", companyData.thirdPayment);
    formData.append("fourthPayment", companyData.fourthPayment);
    formData.append("paymentRemarks", companyData.paymentRemarks);
    formData.append("bookingSource", companyData.bookingSource);
    formData.append("cPANorGSTnum", companyData.cPANorGSTnum);
    if (matured) {
      formData.append("incoDate", new Date(companyData.incoDate));
    } else {
      formData.append("incoDate", companyData.incoDate);
    }

    formData.append("extraNotes", companyData.extraNotes);
    if (companyData.otherDocs) {
      for (let i = 0; i < companyData.otherDocs.length; i++) {
        formData.append("otherDocs", companyData.otherDocs[i]);
      }
    }
    formData.append("paymentReceipt", companyData.paymentReceipt);

    try {
      if (
        oldPaymentCount > 1 &&
        parseInt(companyData.firstPayment) +
          parseInt(companyData.secondPayment) +
          parseInt(companyData.thirdPayment) +
          parseInt(companyData.fourthPayment) !==
          parseInt(companyData.totalPayment)
      ) {
        Swal.fire("Incorrect Payment");
        return true;
      }
      const response = await axios.post(`${secretKey}/lead-form2`, formData);

      setLeadData({
        // Initialize properties with default values if needed
        bdmName: "",
        bdmEmail: "",
        bdmType: "Close by",
        supportedBy: false,
        bookingDate: null,
        caCase: "No",
        caNumber: 0,
        caEmail: "",
        caCommission: "",
        companyName: "",
        contactNumber: 0,
        companyEmail: "",
        services: [],
        originalTotalPayment: 0,
        totalPayment: 0,
        paymentTerms: "Full Advanced",
        paymentMethod: "",
        firstPayment: 0,
        secondPayment: 0,
        thirdPayment: 0,
        fourthPayment: 0,
        paymentReciept: null,
        bookingSource: "",
        cPANorGSTnum: 0,
        incoDate: null,
        extraNotes: "",
        otherDocs: null,
      });
      // if (matured) {
      //   handleStatusChange(companysId);
      // }
      Swal.fire("Data sent Succefully!");
    } catch (error) {
      Swal.fire("Error!");
      console.error("Login failed:", error.message);

      // setErrorMessage("Incorrect Credentials!");
    }
  };

  const [editEmail, setEditEmail] = useState(false);
  const [editNumber, setEditNumber] = useState(false);

  function formatTime(date) {
    // Ensure date is a valid Date object
    if (!(date instanceof Date)) {
      return "Invalid Date";
    }

    // Get the hours, minutes, and seconds from the date object
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    // Construct the formatted time string (HH:MM:SS)
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    return formattedTime;
  }

  const formatDate = (inputdate) => {
    const inputDate = new Date(inputdate);
    const year = inputDate.getFullYear();
    const month = String(inputDate.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(inputDate.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  };

  const handleRemoveFile = (index) => {
    setLeadData((prevLeadData) => {
      const updatedDocs = [...prevLeadData.otherDocs];
      updatedDocs.splice(index, 1);
      return {
        ...prevLeadData,
        otherDocs: updatedDocs,
      };
    });
  };

  return (
    <div>
      <div class="card-body mt-3">
        <div className="hr-1"></div>
        <div className="BDM-section row">
          <div className="bdm-name col">
            <label class="form-label">
              BDM Name
              {leadData.bdmName == "" && (
                <span style={{ color: "red" }}>*</span>
              )}
            </label>
            <select
              type="text"
              className="form-select"
              id="select-users"
              value={companyData.length !== 0 && companyData.bdmName}
              onChange={(e) => {
                const newValue = e.target.value;
                setLeadData((prevLeadData) => ({
                  ...prevLeadData,
                  bdmName: newValue,
                }));
                setCompanyData((prevLeadData) => ({
                  ...prevLeadData,
                  bdmName: newValue,
                }));
              }}
              disabled={!matured}
            >
              <option value="" disabled>
                Please select BDM Name
              </option>
              {unames &&
                unames.map((names) => (
                  <option key={names.ename} value={names.ename}>
                    {names.ename}
                  </option>
                ))}
              <option value="other">Other</option>
            </select>
          </div>

          {companyData.bdmName === "other" && (
            <div className="bdmOtherName col">
              <div className="othername">
                <label class="form-label">
                  BDM Name
                  {otherName == "" && <span style={{ color: "red" }}>*</span>}
                </label>
                <input
                  type="text"
                  name="othername"
                  id="othername"
                  placeholder="Enter BDM Name"
                  className="form-control"
                  value={leadData.bdmName}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setLeadData((prevLeadData) => ({
                      ...prevLeadData,
                      bdmName: newValue,
                    }));
                  }}
                />
              </div>
            </div>
          )}

          <div className="email col">
            <label class="form-label">
              BDM Email
              {leadData.bdmEmail == "" && (
                <span style={{ color: "red" }}>*</span>
              )}
            </label>
            <input
              type="email"
              name="othername"
              id="othername"
              placeholder="Enter BDM Email Address"
              className="form-control"
              value={companyData.bdmEmail}
              onChange={(e) => {
                setLeadData((prevLeadData) => ({
                  ...prevLeadData,
                  bdmEmail: e.target.value,
                }));
                setCompanyData((prevLeadData) => ({
                  ...prevLeadData,
                  bdmEmail: e.target.value,
                }));
              }}
              required
              disabled={!matured}
            />
          </div>

          <div className="closeby mt-2">
            <div class="mb-1">
              <div className="d-flex">
                <label class="form-check form-check-inline">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="close-by"
                    onChange={(e) => {
                      setLeadData((prevLeadData) => ({
                        ...prevLeadData,
                        bdmType: "closeby",
                      }));
                      setCompanyData((prevLeadData) => ({
                        ...prevLeadData,
                        bdmType: "closeby",
                      }));
                    }}
                    checked={companyData.bdmType === "closeby"}
                    disabled={!matured}
                  />
                  <span class="form-check-label">Close By</span>
                </label>
                <label class="form-check form-check-inline">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="close-by"
                    onChange={(e) => {
                      setLeadData((prevLeadData) => ({
                        ...prevLeadData,
                        bdmType: "supportedBy",
                      }));
                      setCompanyData((prevLeadData) => ({
                        ...prevLeadData,
                        bdmType: "supportedBy",
                      }));
                    }}
                    checked={companyData.bdmType === "supportedBy"}
                    disabled={!matured}
                  />
                  <span class="form-check-label">Supported By</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <div className="row">
              <div className="col-sm-4">
                <div className="booking-date mb-1">
                  <div className="bookingDateinside">
                    <label className="form-label">Booking Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={
                        companyData.length !== 0 &&
                        companyData.bookingDate.split("T")[0]
                      }
                      onChange={(e) => {
                        setLeadData((prevLeadData) => ({
                          ...prevLeadData,
                          bookingDate: e.target.value,
                        }));
                        setCompanyData((prevLeadData) => ({
                          ...prevLeadData,
                          bookingDate: e.target.value,
                        }));
                      }}
                      disabled={!matured}
                    />
                  </div>
                </div>
              </div>
              <div className="col-12 p-1">
                <div className="hr-2"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="CA-case mb-1">
          <label class="form-label">CA Case</label>
          <div className="check-ca-case">
            <div class="mb-3">
              <div>
                <label className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="ca-case"
                    onChange={(e) => {
                      setLeadData((prevLeadData) => ({
                        ...prevLeadData,
                        caCase: e.target.value, // Set the value based on the selected radio button
                      }));
                      setCompanyData((prevLeadData) => ({
                        ...prevLeadData,
                        caCase: e.target.value,
                      }));
                    }}
                    value="yes" // Set the value attribute for "Yes"
                    checked={
                      companyData.caCase === "yes"
                    }
                    disabled={!matured} // Check condition based on state
                  />
                  <span className="form-check-label">Yes</span>
                </label>
                <label className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="ca-case"
                    onChange={(e) => {
                      setLeadData((prevLeadData) => ({
                        ...prevLeadData,
                        caCase: e.target.value, // Set the value based on the selected radio button
                      }));
                      setCompanyData((prevLeadData) => ({
                        ...prevLeadData,
                        caCase: e.target.value,
                      }));
                    }}
                    value="No" // Set the value attribute for "No"
                    checked={
                      companyData.caCase === "No"
                    }
                    disabled={!matured} // Check condition based on state
                  />
                  <span className="form-check-label">No</span>
                </label>
              </div>
            </div>
          </div>
          {companyData.length !== 0 && companyData.caCase === "Yes" && (
            <div className="ca-details row">
              <div className="ca-number col">
                <label className="form-label">Enter CA's Number</label>
                <input
                  type="number"
                  name="ca-number"
                  id="ca-number"
                  value={companyData.caNumber}
                  placeholder="Enter CA's Number"
                  className="form-control"
                  onChange={(e) => {
                    setLeadData((prevLeadData) => ({
                      ...prevLeadData,
                      caNumber: e.target.value, // Set the value based on the selected radio button
                    }));
                    setCompanyData((prevLeadData) => ({
                      ...prevLeadData,
                      caNumber: e.target.value,
                    }));
                  }}
                  disabled={!matured}
                />
              </div>
              <div className="ca-email col">
                <label className="form-label">Enter CA's Email</label>
                <div className="ca-email2">
                  <input
                    type="text"
                    name="ca-email"
                    id="ca-email"
                    value={companyData.caEmail}
                    placeholder="Enter CA's Email Address"
                    className="form-control"
                    onChange={(e) => {
                      setLeadData((prevLeadData) => ({
                        ...prevLeadData,
                        caEmail: e.target.value, // Set the value based on the selected radio button
                      }));
                      setCompanyData((prevLeadData) => ({
                        ...prevLeadData,
                        caEmail: e.target.value,
                      }));
                    }}
                    disabled={!matured}
                  />
                </div>
              </div>

              <div className="ca-commision col">
                <label className="form-label">Enter CA's Commission</label>
                <input
                  type="text"
                  name="ca-commision"
                  id="ca-commision"
                  placeholder="Enter CA's Commision- If any"
                  value={companyData.caCommission}
                  className="form-control"
                  onChange={(e) => {
                    setLeadData((prevLeadData) => ({
                      ...prevLeadData,
                      caCommission: e.target.value, // Set the value based on the selected radio button
                    }));
                    setCompanyData((prevLeadData) => ({
                      ...prevLeadData,
                      caCommission: e.target.value,
                    }));
                  }}
                  disabled={!matured}
                />
              </div>
            </div>
          )}
        </div>
        <div className="companyDetails row mb-3">
          <div className="col-12">
            <div className="hr-2"></div>
          </div>
          <div className="company-name col">
            <label class="form-label">Enter Company's Name</label>
            <input
              type="text"
              name="company-name"
              id="company-name"
              placeholder="Enter Company Name"
              className="form-control"
              value={companyData.companyName}
              onChange={(e) => {
                setLeadData((prevLeadData) => ({
                  ...prevLeadData,
                  companyName: e.target.value, // Set the value based on the selected radio button
                }));
                setCompanyData((prevLeadData) => ({
                  ...prevLeadData,
                  companyName: e.target.value,
                }));
              }}
              disabled={!matured}
            />
          </div>
          <div className="company-contact col">
            <label class="form-label">Enter Contact Number</label>
            <div className="position-relative">
              <input
                type="number"
                value={companyData.contactNumber}
                name="company-contact"
                id="company-contact"
                placeholder="Enter Contact Number"
                className="form-control"
                onChange={(e) => {
                  setLeadData((prevLeadData) => ({
                    ...prevLeadData,
                    contactNumber: e.target.value, // Set the value based on the selected radio button
                  }));
                  setCompanyData((prevLeadData) => ({
                    ...prevLeadData,
                    contactNumber: e.target.value,
                  }));
                }}
                disabled={!matured}
              />
              {/* <div className="editField">
                <Edit
                  onClick={() => {
                    setEditNumber(true);
                  }}
                />
              </div> */}
            </div>
          </div>
          <div className="company-email col">
            <label class="form-label">Enter Company's Email-ID</label>
            <div className="position-relative">
              <input
                type="text"
                name="company-email"
                id="company-email"
                placeholder="Enter Company Email ID"
                className="form-control"
                value={companyData.companyEmail}
                onChange={(e) => {
                  setLeadData((prevLeadData) => ({
                    ...prevLeadData,
                    companyEmail: e.target.value, // Set the value based on the selected radio button
                  }));
                  setCompanyData((prevLeadData) => ({
                    ...prevLeadData,
                    companyEmail: e.target.value,
                  }));
                }}
                disabled={!matured}
              />
              {/* <div className="editField">
                <Edit
                  onClick={() => {
                    setEditEmail(true);
                  }}
                />
              </div> */}
            </div>
          </div>
        </div>
        <div className="row align-items-center">
          <div className="col-12">
            <label class="form-label">Services</label>
          </div>
          <div className="col-sm-6">
            <div className="services mb-3">
              <Select
                styles={customStyles}
                isMulti
                options={options}
                onChange={(selectedOptions) => {
                  setSelectedValues(
                    selectedOptions.map((option) => option.value)
                  );
                }}
                value={selectedValues.map((value) => ({ value, label: value }))}
                disabled={!matured}
                placeholder="Select Services..."
              />
            </div>
          </div>
          <div className="col-sm-6">
            <p className="p-0">
              Total Selceted Services:{" "}
              {companyData.length !== 0 && companyData.services.length}
            </p>
          </div>
        </div>

        <div className="paymentGST mb-3 row">
          <div className="col-12">
            <div className="hr-2"></div>
          </div>
          <div className="original-payment col">
            <label class="form-label">Total Payment&nbsp;</label>
            <div className="row align-items-center">
              <div className="col-sm-7">
                <div className="d-flex">
                  <input
                    style={{
                      borderRadius: "5px 0px 0px 5px",
                    }}
                    type="number"
                    name="total-payment"
                    id="total-payment"
                    value={companyData.originalTotalPayment}
                    placeholder="Enter Total Payment with GST"
                    className="form-control"
                    onChange={(e) => {
                      setLeadData((prevLeadData) => ({
                        ...prevLeadData,
                        originalTotalPayment: e.target.value,
                        totalPayment: checkStat
                          ? e.target.value * 1.18
                          : e.target.value,
                      }));
                      setCompanyData((prevLeadData) => ({
                        ...prevLeadData,
                        originalTotalPayment: e.target.value,
                        totalPayment: checkStat
                          ? e.target.value * 1.18
                          : e.target.value,
                      }));
                    }}
                    disabled={!matured}
                  />
                  <span className="rupees-sym">₹</span>
                </div>
              </div>
              <div className="col-sm-5">
                <div className="form-check col m-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value={companyData.totalPayment}
                    id="flexCheckChecked"
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setCheckStat(isChecked ? true : false);
                      setLeadData((prevLeadData) => ({
                        ...prevLeadData,
                        originalTotalPayment: isChecked
                          ? prevLeadData.totalPayment
                          : prevLeadData.originalTotalPayment,
                        totalPayment: isChecked
                          ? prevLeadData.totalPayment * 1.18
                          : prevLeadData.originalTotalPayment,
                      }));
                      setCompanyData((prevLeadData) => ({
                        ...prevLeadData,
                        originalTotalPayment: isChecked
                          ? prevLeadData.totalPayment
                          : prevLeadData.originalTotalPayment,
                        totalPayment: isChecked
                          ? prevLeadData.totalPayment * 1.18
                          : prevLeadData.originalTotalPayment,
                      }));
                    }}
                    checked={
                      companyData.originalTotalPayment !==
                      companyData.totalPayment
                    }
                    disabled={!matured}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckChecked"
                  >
                    WITH GST (18%)
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="payment-withGST col">
            <label class="form-label">
              Total Payment&nbsp;
              <span style={{ fontWeight: "bold" }}>WITH GST</span>
            </label>
            <div className="d-flex">
              <div
                style={{
                  borderRadius: "5px 0px 0px 5px",
                }}
                className="form-control"                
              >
                {companyData.totalPayment}
              </div>
              <span className="rupees-sym">₹</span>
            </div>
          </div>
        </div>

        <div className="payment-terms">
          <label className="form-label">Payment Terms</label>
          <div className="mb-3 row">
            <div className="full-time col">
              <label className="form-check form-check-inline col">
                <input
                  className="form-check-input"
                  type="radio"
                  name="radios-inline"
                  value="Full Advanced"
                  checked={companyData.paymentTerms === "Full Advanced"}
                  onChange={(e) => {
                    setpaymentCount(1);
                    setLeadData((prevLeadData) => ({
                      ...prevLeadData,
                      paymentTerms: e.target.value,
                      firstPayment: 100,
                      secondPayment: 0,
                      thirdPayment: 0,
                      fourthPayment: 0,
                    }));
                    setOldPaymentCount(1);
                    setCompanyData((prevLeadData) => ({
                      ...prevLeadData,
                      paymentTerms: e.target.value,
                      firstPayment: 100,
                      secondPayment: 0,
                      thirdPayment: 0,
                      fourthPayment: 0,
                    }));
                  }}
                  disabled={!matured}
                />
                <span className="form-check-label">Full Advanced</span>
              </label>
              <label className="form-check form-check-inline col">
                <input
                  className="form-check-input"
                  type="radio"
                  name="radios-inline"
                  value="two-part"
                  checked={companyData.paymentTerms === "two-part"}
                  onChange={(e) => {
                    setpaymentCount(2);

                    setLeadData((prevLeadData) => ({
                      ...prevLeadData,
                      paymentTerms: e.target.value,
                      firstPayment: 0,
                      secondPayment: 0,

                      // Set the value based on the selected radio button
                    }));
                    setOldPaymentCount(2);

                    setCompanyData((prevLeadData) => ({
                      ...prevLeadData,
                      paymentTerms: e.target.value,
                      firstPayment: 0,
                      secondPayment: 0,

                      // Set the value based on the selected radio button
                    }));
                  }}
                  disabled={!matured}
                />
                <span className="form-check-label">Part Payment</span>
              </label>
            </div>
          </div>
          {companyData.paymentTerms === "two-part" && (
            <>
              <div className="row more-payments">
                <div className="col first-payment">
                  <label class="form-label">First Payment</label>
                  <div className="f-pay d-flex">
                    <input
                      type="number"
                      style={{
                        borderRadius: "5px 0px 0px 5px",
                      }}
                      name="first-payment"
                      id="first-payment"
                      value={companyData.firstPayment}
                      placeholder="First Payment"
                      className="form-control"
                      onChange={(e) => {
                        setLeadData((prevLeadData) => ({
                          ...prevLeadData,
                          firstPayment: e.target.value,
                          secondPayment:
                            paymentCount === 2 &&
                            leadData.totalPayment - e.target.value,
                        }));
                        setCompanyData((prevLeadData) => ({
                          ...prevLeadData,
                          firstPayment: e.target.value,
                          secondPayment:
                            oldPaymentCount === 2 &&
                            companyData.totalPayment - e.target.value,
                        }));
                      }}
                      disabled={!matured}
                    />

                    <span className="rupees-sym">₹</span>
                  </div>
                </div>
                {oldPaymentCount === 2 && !matured && (
                  <>
                  <div className="col second-payment">
                      <label class="form-label">Second Payment</label>
                      <div className="d-flex">
                        <input
                          type="number"
                          style={{ borderRadius: "5px 0px 0px 5px" }}
                          name="second-payment"
                          id="second-payment"
                          value={companyData.secondPayment}
                          placeholder="Second Payment"
                          className={
                           
                               "form-control"
                          }
                       
                          disabled
                          // Add style for extra space on the right
                        />
                        <span className="rupees-sym">₹</span>

                      </div>
                    </div>
                  </>
                )}
                {oldPaymentCount === 2 && matured && (
                  <>
                    <div className="col second-payment">
                      <label class="form-label">Second Payment</label>
                      <div className="d-flex">
                        <input
                          type="number"
                          style={{ borderRadius: "5px 0px 0px 5px" }}
                          name="second-payment"
                          id="second-payment"
                          value={companyData.secondPayment}
                          placeholder="Second Payment"
                          className={
                            parseInt(companyData.firstPayment) +
                              parseInt(companyData.secondPayment) !==
                            parseInt(companyData.totalPayment)
                              ? "form-control error-border"
                              : "form-control"
                          }
                          onChange={(e) => {
                            setLeadData((prevLeadData) => ({
                              ...prevLeadData,
                              secondPayment: e.target.value, // Set the value based on the input
                            }));
                            setCompanyData((prevLeadData) => ({
                              ...prevLeadData,
                              secondPayment: e.target.value, // Set the value based on the input
                            }));
                          }}
                          disabled={!matured}
                          // Add style for extra space on the right
                        />
                        <span className="rupees-sym">₹</span>

                        {/* Add a span with Indian Rupees symbol */}

                        {matured && (
                          <button
                            onClick={() => {
                             
                              setOldPaymentCount(3)
                              setLeadData((prevLeadData) => ({
                                ...prevLeadData,
                                firstPayment: 0,
                                secondPayment: 0,
                                thirdPayment: 0,
                              }));
                              setCompanyData((prevLeadData) => ({
                                ...prevLeadData,
                                firstPayment: 0,
                                secondPayment: 0,
                                thirdPayment: 0,
                              }));
                            }}
                            type="button"
                            style={{ marginLeft: "5px" }}
                            className="btn btn-primary"
                          >
                            <i className="fas fa-plus"></i> +{" "}
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}
                 {oldPaymentCount === 3 && !matured && (
                  <>
                  <div className="col second-payment">
                      <label class="form-label">Second Payment</label>
                      <div className="d-flex">
                        <input
                          type="number"
                          style={{ borderRadius: "5px 0px 0px 5px" }}
                          name="second-payment"
                          id="second-payment"
                          value={companyData.secondPayment}
                          placeholder="Second Payment"
                          className={
                           
                               "form-control"
                          }
                       
                          disabled
                          // Add style for extra space on the right
                        />
                        <span className="rupees-sym">₹</span>

                      </div>
                    </div>
                  <div className="col third-payment">
                      <label class="form-label">Third Payment</label>
                      <div className="d-flex">
                        <input
                          type="number"
                          style={{ borderRadius: "5px 0px 0px 5px" }}
                          name="third-payment"
                          id="third-payment"
                          value={companyData.thirdPayment}
                          placeholder="third Payment"
                          className={
                           
                               "form-control"
                          }
                       
                          disabled
                          // Add style for extra space on the right
                        />
                        <span className="rupees-sym">₹</span>

                      </div>
                    </div>
                  </>
                )}
                {oldPaymentCount === 3 && matured && (
                  <>
                    <div className="col second-payment">
                      <label class="form-label">Second Payment</label>
                      <div className="d-flex">
                        <input
                          style={{
                            borderRadius: "5px 0px 0px 5px",
                          }}
                          type="number"
                          name="second-payment"
                          id="second-payment"
                          value={companyData.secondPayment}
                          placeholder="Second Payment"
                          className="form-control"
                          onChange={(e) => {
                            setLeadData((prevLeadData) => ({
                              ...prevLeadData,
                              secondPayment: e.target.value,
                              thirdPayment:
                                parseInt(leadData.totalPayment) -
                                parseInt(leadData.firstPayment) -
                                parseInt(e.target.value),
                            }));
                            setCompanyData((prevLeadData) => ({
                              ...prevLeadData,
                              secondPayment: e.target.value,
                              thirdPayment:
                                parseInt(companyData.totalPayment) -
                                parseInt(companyData.firstPayment) -
                                parseInt(e.target.value),
                            }));
                          }}
                          disabled={!matured}
                        />
                        <span className="rupees-sym">₹</span>
                      </div>
                    </div>
                    <div className="col third-payment">
                      <label class="form-label">Third Payment</label>
                      <div className="d-flex">
                        <input
                          style={{
                            borderRadius: "5px 0px 0px 5px",
                          }}
                          type="number"
                          name="third-payment"
                          id="third-payment"
                          value={companyData.thirdPayment}
                          placeholder="Third Payment"
                          className={
                            parseInt(companyData.firstPayment) +
                              parseInt(companyData.secondPayment) +
                              parseInt(companyData.thirdPayment) !==
                            parseInt(companyData.totalPayment)
                              ? "form-control error-border"
                              : "form-control"
                          }
                          onChange={(e) => {
                            setLeadData((prevLeadData) => ({
                              ...prevLeadData,
                              thirdPayment: e.target.value,
                            }));
                            setCompanyData((prevLeadData) => ({
                              ...prevLeadData,
                              thirdPayment: e.target.value,
                            }));
                          }}
                          disabled={!matured}
                          readOnly={oldPaymentCount === 3}
                        />
                        <span className="rupees-sym">₹</span>
                        {matured && (
                          <button
                            style={{ marginLeft: "5px" }}
                            onClick={(e) => {
                              setpaymentCount(2);
                              setOldPaymentCount(2);
                              setLeadData((prevLeadData) => ({
                                ...prevLeadData,
                                thirdPayment: 0,
                                firstPayment: 0,
                                secondPayment: 0,
                              }));
                              setCompanyData((prevLeadData) => ({
                                ...prevLeadData,
                                thirdPayment: 0,
                                firstPayment: 0,
                                secondPayment: 0,
                              }));
                            }}
                            type="button"
                            className="btn btn-primary"
                          >
                            <i className="fas fa-plus"></i> -{" "}
                          </button>
                        )}
                        <button
                          style={{ marginLeft: "5px" }}
                          onClick={() => {
                            setpaymentCount(4);
                            setOldPaymentCount(4)
                            setLeadData((prevLeadData) => ({
                              ...prevLeadData,
                              thirdPayment: 0,
                              firstPayment: 0,
                              secondPayment: 0,
                              fourthPayment: 0,
                            }));
                            setCompanyData((prevLeadData) => ({
                              ...prevLeadData,
                              thirdPayment: 0,
                              firstPayment: 0,
                              secondPayment: 0,
                              fourthPayment: 0,
                            }));
                          }}
                          type="button"
                          className="btn btn-primary"
                        >
                          <i className="fas fa-plus"></i> +{" "}
                        </button>
                      </div>
                    </div>
                  </>
                )}
                 {oldPaymentCount === 4 && !matured && (
                  <>
                  <div className="col second-payment">
                      <label class="form-label">Second Payment</label>
                      <div className="d-flex">
                        <input
                          type="number"
                          style={{ borderRadius: "5px 0px 0px 5px" }}
                          name="second-payment"
                          id="second-payment"
                          value={companyData.secondPayment}
                          placeholder="Second Payment"
                          className={
                           
                               "form-control"
                          }
                       
                          disabled
                          // Add style for extra space on the right
                        />
                        <span className="rupees-sym">₹</span>

                      </div>
                    </div>
                  <div className="col third-payment">
                      <label class="form-label">Third Payment</label>
                      <div className="d-flex">
                        <input
                          type="number"
                          style={{ borderRadius: "5px 0px 0px 5px" }}
                          name="Third-payment"
                          id="Third-payment"
                          value={companyData.thirdPayment}
                          placeholder="Third Payment"
                          className={
                           
                               "form-control"
                          }
                       
                          disabled
                          // Add style for extra space on the right
                        />
                        <span className="rupees-sym">₹</span>

                      </div>
                    </div>
                  <div className="col fourth-payment">
                      <label class="form-label">Fourth Payment</label>
                      <div className="d-flex">
                        <input
                          type="number"
                          style={{ borderRadius: "5px 0px 0px 5px" }}
                          name="Fourth-payment"
                          id="Fourth-payment"
                          value={companyData.fourthPayment}
                          placeholder="Fourth Payment"
                          className={
                           
                               "form-control"
                          }
                       
                          disabled
                          // Add style for extra space on the right
                        />
                        <span className="rupees-sym">₹</span>

                      </div>
                    </div>
                  </>
                )}
                {oldPaymentCount === 4 && matured && (
                  <>
                    <div className="col second-payment">
                      <label class="form-label">Second Payment</label>
                      <div className="d-flex">
                        <input
                          style={{
                            borderRadius: "5px 0px 0px 5px",
                          }}
                          type="number"
                          name="second-payment"
                          id="second-payment"
                          value={companyData.secondPayment}
                          placeholder="Second Payment"
                          className="form-control"
                          onChange={(e) => {
                            setCompanyData((prevLeadData) => ({
                              ...prevLeadData,
                              secondPayment: e.target.value,
                            }));
                          }}
                        />
                        <span className="rupees-sym">₹</span>
                      </div>
                    </div>
                    <div className="col third-payment">
                      <label class="form-label">Third Payment</label>
                      <div className="d-flex">
                        <input
                          type="number"
                          style={{
                            borderRadius: "5px 0px 0px 5px",
                          }}
                          name="third-payment"
                          id="third-payment"
                          value={companyData.thirdPayment}
                          placeholder="Thrid Payment"
                          className="form-control"
                          onChange={(e) => {
                            setCompanyData((prevLeadData) => ({
                              ...prevLeadData,
                              thirdPayment: e.target.value,
                              fourthPayment:
                                parseInt(companyData.totalPayment) -
                                parseInt(companyData.firstPayment) -
                                parseInt(companyData.secondPayment) -
                                parseInt(e.target.value),
                            }));
                          }}
                        />
                        <span className="rupees-sym">₹</span>
                      </div>
                    </div>
                    <div className="col fourth-payment">
                      <label class="form-label">Fourth Payment</label>
                      <div className="d-flex">
                        <input
                          style={{
                            borderRadius: "5px 0px 0px 5px",
                          }}
                          type="number"
                          name="fourth-payment"
                          id="fourth-payment"
                          value={companyData.fourthPayment}
                          placeholder="Fourth Payment"
                          className={
                            parseInt(companyData.firstPayment) +
                              parseInt(companyData.secondPayment) +
                              parseInt(companyData.thirdPayment) +
                              parseInt(companyData.fourthPayment) !==
                            parseInt(companyData.totalPayment)
                              ? "form-control error-border"
                              : "form-control"
                          }
                          onChange={(e) => {
                            
                            setCompanyData((prevLeadData) => ({
                              ...prevLeadData,
                              fourthPayment: e.target.value,
                            }));
                          }}
                          readOnly={oldPaymentCount === 4}
                        />
                        <span className="rupees-sym">₹</span>
                        <button
                          style={{ marginLeft: "5px" }}
                          onClick={(e) => {
                           
                            setOldPaymentCount(3)
                         
                            setCompanyData((prevLeadData) => ({
                              ...prevLeadData,
                              fourthPayment: 0,
                              firstPayment: 0,
                              secondPayment: 0,
                              thirdPayment: 0,
                            }));
                          }}
                          type="button"
                          className="btn btn-primary"
                        >
                          <i className="fas fa-plus"></i> -{" "}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
              {matured && <div className="details-payment row mb-3">
                <div className="details-payment-1 col">
                  <small class="form-hint">
                    {parseInt(companyData.firstPayment) +
                      parseInt(companyData.secondPayment) +
                      parseInt(companyData.thirdPayment) +
                      parseInt(companyData.fourthPayment) !==
                    parseInt(companyData.totalPayment)
                      ? "Wrong Payment"
                      : `${(
                          (companyData.firstPayment * 100) /
                          companyData.totalPayment
                        ).toFixed(2)} % Amount`}
                  </small>
                </div>
                <div className="details-payment-2 col">
                  <small class="form-hint">
                    {parseInt(companyData.firstPayment) +
                      parseInt(companyData.secondPayment) +
                      parseInt(companyData.thirdPayment) +
                      parseInt(companyData.fourthPayment) !==
                    parseInt(companyData.totalPayment)
                      ? "Wrong Payment"
                      : `${(
                          (companyData.secondPayment * 100) /
                          companyData.totalPayment
                        ).toFixed(2)} % Amount`}
                  </small>
                </div>
                {oldPaymentCount >= 3 && (
                  <div className="details-payment-3 col">
                    <small class="form-hint">
                      {parseInt(companyData.firstPayment) +
                        parseInt(companyData.secondPayment) +
                        parseInt(companyData.thirdPayment) +
                        parseInt(companyData.fourthPayment) !==
                      parseInt(companyData.totalPayment)
                        ? "Wrong Payment"
                        : `${(
                            (companyData.thirdPayment * 100) /
                            companyData.totalPayment
                          ).toFixed(2)} % Amount`}
                    </small>
                  </div>
                )}

                {oldPaymentCount === 4 && (
                  <div className="details-payment-4 col">
                    <small class="form-hint">
                      {parseInt(companyData.firstPayment) +
                        parseInt(companyData.secondPayment) +
                        parseInt(companyData.thirdPayment) +
                        parseInt(companyData.fourthPayment) !==
                      parseInt(companyData.totalPayment)
                        ? "Wrong Payment"
                        : `${(
                            (companyData.fourthPayment * 100) /
                            companyData.totalPayment
                          ).toFixed(2)} % Amount`}
                    </small>
                  </div>
                )}
              </div>}
              <div className="payment-remarks col">
                <label class="form-label">Payment Remarks</label>
                <input
                  type="text"
                  name="payment-remarks"
                  id="payment-remarks"
                  value={companyData.paymentRemarks}
                  placeholder="Please add remarks if any"
                  className="form-control"
                  onChange={(e) => {
                    setCompanyData((prevLeadData) => ({
                      ...prevLeadData,
                      paymentRemarks: e.target.value,
                    }));
                  }}
                  disabled={!matured}
                />
              </div>
            </>
          )}
          <div className="col-12">
            <div className="hr-2"></div>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-3">
            <div className="payment-method mb-3">
              <label className="form-label">Payment Method</label>
              <select
                className="form-select mb-3"
                value={companyData.paymentMethod}
                onChange={(e) => {
                  setCompanyData((prevLeadData) => ({
                    ...prevLeadData,
                    paymentMethod: e.target.value,
                  }));
                }}
                id="select-emails"
                disabled={!matured}
              >
                <option value="" disabled>
                  Select Payment Option
                </option>
                <option value="ICICI Bank">ICICI Bank</option>
                {/* <option value="SRK Seedfund(Non GST)/IDFC first Bank">
                  SRK Seedfund(Non GST)/IDFC first Bank
                </option> */}
                <option value="STARTUP SAHAY SERVICES/ADVISORY(Non GST)/ IDFC First Bank">
                  STARTUP SAHAY SERVICES/ADVISORY(Non GST)/ IDFC First Bank
                </option>
                <option value="Razorpay">Razorpay</option>
                <option value="PayU">PayU</option>
                <option value="Other">Other</option>
              </select>
              {leadData.paymentMethod === "Other" && (
                <input
                  type="text"
                  name="other-method"
                  id="other-method"
                  placeholder="Enter Payment Method "
                  className="form-control "
                />
              )}
            </div>
          </div>
          <div className="col-sm-3">
            <div className="payment-receipt">
              <div class="mb-3">
                <label for="formFile" class="form-label">
                  Payment Reciept
                </label>
                <input
                  class="form-control"
                  type="file"
                  id="formFile"
                  onChange={(e) => {
                    setCompanyData((prevLeadData) => ({
                      ...prevLeadData,
                      paymentReciept: e.target.files[0],
                    }));
                  }}
                  disabled={!matured}
                />
              </div>
            </div>
          </div>
          <div className="col-sm-3">
            <div className="booking-source mb-3">
              <label class="form-label">Booking Source</label>
              <select
                type="text"
                class="form-select mb-3"
                id="select-emails"
                value={companyData.bookingSource}
                onChange={(e) => {
                  setCompanyData((prevLeadData) => ({
                    ...prevLeadData,
                    bookingSource: e.target.value,
                  }));
                }}
                disabled={!matured}
              >
                <option value="" disabled>
                  Select Booking Source
                </option>
                <option value="Excel Data">Excel Data</option>
                <option value="Insta Lead">Insta Lead</option>
                <option value="Reference">Reference</option>
                <option value="Existing Client">Existing Client</option>
                <option value="Lead By Saurav Sir">Lead By Saurav Sir</option>
                <option value="Other">Other</option>
              </select>
              {leadData.bookingSource === "Other" && (
                <input
                  type="text"
                  name="other-method"
                  id="other-method"
                  placeholder="Enter Booking Source"
                  className="form-control "
                />
              )}
            </div>
          </div>
          <div className="col-sm-3">
            <div className="cpan-or-gst mb-3">
              <label class="form-label">Company Pan or GST Number</label>
              <input
                type="text"
                name="panorGSTnumber"
                id="panorGSTnumber"
                placeholder="Enter Company's PAN/GST number "
                value={companyData.cPANorGSTnum}
                className="form-control"
                onChange={(e) => {
                  setCompanyData((prevLeadData) => ({
                    ...prevLeadData,
                    cPANorGSTnum: e.target.value,
                  }));
                }}
                disabled={!matured}
              />
            </div>
          </div>
        </div>

        <div className="cidate-or-extranotes row mb-3">
          <div className="cidate col">
            <label className="form-label">Company Incorporation Date</label>
            <input
              onChange={(e) => {
                setCompanyData((prevLeadData) => ({
                  ...prevLeadData,
                  incoDate: e.target.value,
                }));
              }}
              value={formatDate(companyData.incoDate)}
              type="date"
              className="form-control"
              disabled={!matured}
            />
          </div>
          <div className="other-docs col">
            <label for="formFile" class="form-label">
              Any Other Documents
            </label>
            <input
              onChange={(e) => {
                // Update the state with the selected files
                setLeadData((prevLeadData) => ({
                  ...prevLeadData,
                  otherDocs: [
                    ...(prevLeadData.otherDocs || []),
                    ...e.target.files,
                  ],
                }));
              }}
              className="form-control mb-3"
              type="file"
              id="other-docs"
              multiple
              disabled={!matured}
            />
          </div>
          {leadData.otherDocs && leadData.otherDocs.length > 0 && (
            <div className="uploaded-filename-main d-flex flex-wrap">
              {leadData.otherDocs.map((file, index) => (
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
          <div className="extra-notes col">
            <label class="form-label">Any Extra Notes</label>
            <input
              type="text"
              name="extraNotes"
              id="extraNotes"
              value={companyData.extraNotes}
              placeholder="Enter any extra notes "
              className="form-control"
              onChange={(e) => {
                setLeadData((prevLeadData) => ({
                  ...prevLeadData,
                  extraNotes: e.target.value,
                }));
                setCompanyData((prevLeadData) => ({
                  ...prevLeadData,
                  extraNotes: e.target.value,
                }));
              }}
              disabled={!matured}
            />
          </div>
        </div>
      </div>
      {matured && <div class="card-footer text-end">
        <button
          onClick={handleSubmitForm}
          type="submit"
          class="btn btn-primary mb-3"
        >
          Request Changes
        </button>
      </div>}
    </div>
  );
}

export default EditForm;
