import React, { useEffect } from "react";

import { useState } from "react";
import axios from "axios";

import Swal from "sweetalert2";

import "./styles/main.css";
import Select from "react-select";
import { IconX } from "@tabler/icons-react";
import { parse } from "papaparse";
import Edit from "@mui/icons-material/Edit";
const options = [
  {
    value: "Certification Services",
    label: "Certification Services",
    isDisabled: true,
  },
  { value: "Start-Up India Certificate", label: "Start-Up India Certificate" },
  { value: "MSME/UYDAM Certificate", label: "MSME/UYDAM Certificate 3" },
  { value: "ISO Certificate", label: "ISO Certificate" },
  { value: "IEC CODE Certificate", label: "IEC CODE Certificate" },
  { value: "BIS Certificate", label: "BIS Certificate" },
  { value: "NSIC Certificate", label: "NSIC Certificate" },
  { value: "FSSAI Certificate", label: "FSSAI Certificate" },
  { value: "APEDA Certificate", label: "APEDA Certificate" },
  { value: "GST Certificate", label: "GST Certificate" },
  {
    value: "Documentation Services",
    label: "Documentation Services",
    isDisabled: true,
  },
  { value: "Pitch Deck Development", label: "Pitch Deck Development" },
  { value: "Financial Modeling", label: "Financial Modeling" },
  { value: "DPR Developmen", label: "DPR Developmen" },
  { value: "CMA Report Development", label: "CMA Report Development" },
  { value: "Company Profile", label: "Company Profile" },
  { value: "Company Brochure", label: "Company Brochure" },
  { value: "Product Catalog", label: "Product Catalog" },
  {
    value: "Fund Raising Support Services",
    label: "Fund Raising Support Services",
    isDisabled: true,
  },
  { value: "Seed Funding Support", label: "Seed Funding Support" },
  { value: "Angel Funding Support", label: "Angel Funding Support" },
  { value: "VC Funding Support", label: "VC Funding Support" },
  { value: "Crowd Funding Support", label: "Crowd Funding Support" },
  { value: "Government Funding Support", label: "Government Funding Support" },
  { value: "Digital Marketing", label: "Digital Marketing", isDisabled: true },
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
  { value: "IT Services", label: "IT Services", isDisabled: true },
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
  {
    value: "Business Registration",
    label: "Business Registration",
    isDisabled: true,
  },
  {
    value: "Sole Proprietorship Registration",
    label: "Sole Proprietorship Registration",
  },
  {
    value: "Partnership Firm Registration",
    label: "Partnership Firm Registration",
  },
  { value: "LLP Firm Registration", label: "LLP Firm Registration" },
  {
    value: "Private Limited Registration",
    label: "hPrivate Limited Registrationh",
  },
  {
    value: "Public Company Registration",
    label: "Public Company Registration",
  },
  { value: "Nidhi Company Registration", label: "Nidhi Company Registration" },
  {
    value: "Producer Company Registration",
    label: "Producer Company Registration ",
  },
  { value: "Trademark & IP", label: "Trademark & IP", isDisabled: true },
  { value: "Trademark Registration", label: "Trademark Registration" },
  { value: "Copyright Registration", label: "Copyright Registration" },
  { value: "Patent Registration", label: "Patent Registration" },

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

function Form({
  matured,
  companysId,
  companysName,
  companysEmail,
  companysInco,
  employeeName,
  employeeEmail,
  companyNumber
}) {
  const [unames, setUnames] = useState([]);
  const [checkStat, setCheckStat] = useState(false);
  const [paymentCount, setpaymentCount] = useState(0);
  const [otherName, setotherName] = useState("");
  const [leadData, setLeadData] = useState({
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
    services: "",
    originalTotalPayment: 0,
    totalPayment: 0,
    paymentTerms: "Full Advanced",
    paymentMethod: "",
    firstPayment: 0,
    secondPayment: 0,
    thirdPayment: 0,
    fourthPayment: 0,
    paymentRemarks:"",
    paymentReciept: null,
    bookingSource: "",
    cPANorGSTnum: 0,
    incoDate: null,
    extraNotes: "",
    otherDocs: null,
  });
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const fetchData = async () => {
    try {
      const response = await axios.get(`${secretKey}/einfo`);

      // Set the retrieved data in the state
      const tempData = response.data;
      setUnames(tempData);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };
  const handleStatusChange = async (companysId) => {
    const newStatus = "Matured";
    try {
      // Make an API call to update the employee status in the database
      const response = await axios.post(
        `${secretKey}/update-status/${companysId}`,
        {
          newStatus,
        }
      );

      // Check if the API call was successful
      if (response.status === 200) {
        console.log("Status Changed");
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
  }, []);
  const [selectedValues, setSelectedValues] = useState([]);

  const handleSubmitForm = async () => {
    const formData = new FormData();
    if (leadData.bdmName === "other") {
      formData.append("bdmName", otherName);
    } else {
      formData.append("bdmName", leadData.bdmName);
    }

    formData.append("bdmEmail", leadData.bdmEmail);
    formData.append("bdmType", leadData.bdmType);
    formData.append("supportedBy", leadData.supportedBy);
    formData.append("bookingDate", leadData.bookingDate);
    formData.append("caCase", leadData.caCase);
    formData.append("caNumber", leadData.caNumber);
    formData.append("caEmail", leadData.caEmail);
    formData.append("caCommission", leadData.caCommission);

    formData.append("empName", employeeName);
    formData.append("empEmail", employeeEmail);
    {
      matured
        ? formData.append("companyName", companysName)
        : formData.append("companyName", leadData.companyName);
    }

    formData.append("contactNumber", leadData.contactNumber);
    {
      matured
        ? formData.append("companyEmail", companysEmail)
        : formData.append("companyEmail", leadData.companyEmail);
    }
    formData.append("services", selectedValues);
    formData.append("originalTotalPayment", leadData.originalTotalPayment);
    formData.append("totalPayment", leadData.totalPayment);
    formData.append("paymentTerms", leadData.paymentTerms);
    formData.append("paymentMethod", leadData.paymentMethod);
    formData.append("firstPayment", leadData.firstPayment);
    formData.append("secondPayment", leadData.secondPayment);
    formData.append("thirdPayment", leadData.thirdPayment);
    formData.append("fourthPayment", leadData.fourthPayment);
    formData.append("paymentRemarks", leadData.paymentRemarks);
    formData.append("bookingSource", leadData.bookingSource);
    formData.append("cPANorGSTnum", leadData.cPANorGSTnum);
    if (matured) {
      formData.append("incoDate", new Date(companysInco));
    } else {
      formData.append("incoDate", leadData.incoDate);
    }

    formData.append("extraNotes", leadData.extraNotes);
    if (leadData.otherDocs) {
      for (let i = 0; i < leadData.otherDocs.length; i++) {
        formData.append("otherDocs", leadData.otherDocs[i]);
      }
    }
    formData.append("paymentReceipt", leadData.paymentReciept);

    try {
      if (
        paymentCount > 1 &&
        parseInt(leadData.firstPayment) +
          parseInt(leadData.secondPayment) +
          parseInt(leadData.thirdPayment) +
          parseInt(leadData.fourthPayment) !==
          parseInt(leadData.totalPayment)
      ) {
        Swal.fire("Incorrect Payment");

        return true;
      }
      const response = await axios.post(`${secretKey}/lead-form`, formData);
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
      if (matured) {
        handleStatusChange(companysId);
      }
      Swal.fire("Data sent Succefully!");
    } catch (error) {
      Swal.fire("Error!");
      console.error("Login failed:", error.message);

      // setErrorMessage("Incorrect Credentials!");
    }
  };

  const [editEmail, setEditEmail] = useState(false)
  const [editNumber, setEditNumber] = useState(false)

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
  console.log(
    parseInt(leadData.firstPayment) +
      parseInt(leadData.secondPayment) +
      parseInt(leadData.thirdPayment) +
      parseInt(leadData.fourthPayment),
    parseInt(leadData.totalPayment)
  );

  return (
    <div>
      <div className="hr-1"></div>
      <div class="card-body mt-3">
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
              value={leadData.bdmName}
              onChange={(e) => {
                setLeadData((prevLeadData) => ({
                  ...prevLeadData,
                  bdmName: e.target.value,
                }));
              }}
            >
              <option value="" disabled selected>
                Please select BDM Name
              </option>
              {unames &&
                unames.map((names) => (
                  <option value={names.ename}>{names.ename}</option>
                ))}

              <option value="other">Other</option>
            </select>
          </div>

          {leadData.bdmName === "other" && (
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
                  value={otherName}
                  onChange={(e) => {
                    setotherName(e.target.value);
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
              value={leadData.bdmEmail}
              onChange={(e) => {
                setLeadData((prevLeadData) => ({
                  ...prevLeadData,
                  bdmEmail: e.target.value,
                }));
              }}
              required
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
                        bdmType: "Close by",
                      }));
                    }}
                    checked
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
                        bdmType: "Supported by",
                      }));
                    }}
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
                      onChange={(e) => {
                        setLeadData((prevLeadData) => ({
                          ...prevLeadData,
                          bookingDate: e.target.value,
                        }));
                      }}
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
                    }}
                    value="Yes" // Set the value attribute for "Yes"
                    checked={leadData.caCase === "Yes"} // Check condition based on state
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
                    }}
                    value="No" // Set the value attribute for "No"
                    checked={leadData.caCase === "No"} // Check condition based on state
                  />
                  <span className="form-check-label">No</span>
                </label>
              </div>
            </div>
          </div>
          {leadData.caCase === "Yes" && (
            <div className="ca-details row">
              <div className="ca-number col">
                <label className="form-label">Enter CA's Number</label>
                <input
                  type="number"
                  name="ca-number"
                  id="ca-number"
                  placeholder="Enter CA's Number"
                  className="form-control"
                  onChange={(e) => {
                    setLeadData((prevLeadData) => ({
                      ...prevLeadData,
                      caNumber: e.target.value, // Set the value based on the selected radio button
                    }));
                  }}
                />
              </div>
              <div className="ca-email col">
                <label className="form-label">Enter CA's Email</label>
                <div className="ca-email2">
                  <input
                    type="text"
                    name="ca-email"
                    id="ca-email"
                    placeholder="Enter CA's Email Address"
                    className="form-control"
                    onChange={(e) => {
                      setLeadData((prevLeadData) => ({
                        ...prevLeadData,
                        caEmail: e.target.value, // Set the value based on the selected radio button
                      }));
                    }}
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
                  className="form-control"
                  onChange={(e) => {
                    setLeadData((prevLeadData) => ({
                      ...prevLeadData,
                      caCommission: e.target.value, // Set the value based on the selected radio button
                    }));
                  }}
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
              value={matured ? companysName : leadData.companyName}
              onChange={(e) => {
                setLeadData((prevLeadData) => ({
                  ...prevLeadData,
                  companyName: e.target.value, // Set the value based on the selected radio button
                }));
              }}
            />
          </div>
          <div className="company-contact col">
            <label class="form-label">Enter Contact Number</label>
            <div className="position-relative">
            <input
              type="number"
              defaultValue={matured ? companyNumber : leadData.companyNumber}
              name="company-contact"
              id="company-contact"
              placeholder="Enter Contact Number"
              className="form-control"
              onChange={(e) => {
                setLeadData((prevLeadData) => ({
                  ...prevLeadData,
                  contactNumber: e.target.value, // Set the value based on the selected radio button
                }));
              }}
              disabled = {!editNumber}
            />
            <div className="editField">
            <Edit onClick={()=>{
              setEditNumber(true)
            }}/>
            </div>
            
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
              defaultValue={matured ? companysEmail : leadData.companyEmail}
              onChange={(e) => {
                setLeadData((prevLeadData) => ({
                  ...prevLeadData,
                  companyEmail: e.target.value, // Set the value based on the selected radio button
                }));
              }}
              disabled={!editEmail}
            />
            <div className="editField">
            <Edit onClick={()=>{
              setEditEmail(true)
            }}/>
            </div>
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
                placeholder="Select Services..."
              />
            </div>
          </div>
          <div className="col-sm-6">
            <p className="p-0">
              Total Selceted Services: {selectedValues.length}
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
                    }}
                  />
                  <span className="rupees-sym">₹</span>
                </div>
              </div>
              <div className="col-sm-5">
                <div className="form-check col m-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value={leadData.totalPayment}
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
                    }}
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
                className={
                  parseInt(leadData.firstPayment) +
                    parseInt(leadData.secondPayment) +
                    parseInt(leadData.thirdPayment) +
                    parseInt(leadData.fourthPayment) !==
                  parseInt(leadData.totalPayment)
                    ? "form-control error-border"
                    : "form-control"
                }
              >
                {leadData.totalPayment ? leadData.totalPayment : 0}
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
                  checked={leadData.paymentTerms === "Full Advanced"}
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
                  }}
                />
                <span className="form-check-label">Full Advanced</span>
              </label>
              <label className="form-check form-check-inline col">
                <input
                  className="form-check-input"
                  type="radio"
                  name="radios-inline"
                  value="two-part"
                  checked={leadData.paymentTerms === "two-part"}
                  onChange={(e) => {
                    setpaymentCount(2);

                    setLeadData((prevLeadData) => ({
                      ...prevLeadData,
                      paymentTerms: e.target.value,
                      firstPayment: 0,
                      secondPayment: 0,

                      // Set the value based on the selected radio button
                    }));
                  }}
                />
                <span className="form-check-label">Part Payment</span>
              </label>
            </div>
          </div>
          {leadData.paymentTerms === "two-part" && (
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
                      value={leadData.firstPayment}
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
                      }}
                    />

                    <span className="rupees-sym">₹</span>
                  </div>
                </div>
                {paymentCount === 2 && (
                  <>
                    <div className="col second-payment">
                      <label class="form-label">Second Payment</label>
                      <div className="d-flex">
                        <input
                          type="number"
                          style={{ borderRadius: "5px 0px 0px 5px" }}
                          name="second-payment"
                          id="second-payment"
                          value={leadData.secondPayment}
                          placeholder="Second Payment"
                          className={
                            parseInt(leadData.firstPayment) +
                              parseInt(leadData.secondPayment) !==
                            parseInt(leadData.totalPayment)
                              ? "form-control error-border"
                              : "form-control"
                          }
                          onChange={(e) => {
                            setLeadData((prevLeadData) => ({
                              ...prevLeadData,
                              secondPayment: e.target.value, // Set the value based on the input
                            }));
                          }}
                          readOnly={paymentCount === 2}
                          // Add style for extra space on the right
                        />
                        <span className="rupees-sym">₹</span>

                        {/* Add a span with Indian Rupees symbol */}

                        <button
                          onClick={() => {
                            setpaymentCount(3);
                            setLeadData((prevLeadData) => ({
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
                      </div>
                    </div>
                  </>
                )}
                {paymentCount === 3 && (
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
                          value={leadData.secondPayment}
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
                          }}
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
                          value={leadData.thirdPayment}
                          placeholder="Third Payment"
                          className={
                            parseInt(leadData.firstPayment) +
                              parseInt(leadData.secondPayment) +
                              parseInt(leadData.thirdPayment) !==
                            parseInt(leadData.totalPayment)
                              ? "form-control error-border"
                              : "form-control"
                          }
                          onChange={(e) => {
                            setLeadData((prevLeadData) => ({
                              ...prevLeadData,
                              thirdPayment: e.target.value,
                            }));
                          }}
                          readOnly={paymentCount === 3}
                        />
                        <span className="rupees-sym">₹</span>
                        <button
                          style={{ marginLeft: "5px" }}
                          onClick={(e) => {
                            setpaymentCount(2);
                            setLeadData((prevLeadData) => ({
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
                        <button
                          style={{ marginLeft: "5px" }}
                          onClick={() => {
                            setpaymentCount(4);
                            setLeadData((prevLeadData) => ({
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
                {paymentCount === 4 && (
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
                          value={leadData.secondPayment}
                          placeholder="Second Payment"
                          className="form-control"
                          onChange={(e) => {
                            setLeadData((prevLeadData) => ({
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
                          value={leadData.thirdPayment}
                          placeholder="Thrid Payment"
                          className="form-control"
                          onChange={(e) => {
                            setLeadData((prevLeadData) => ({
                              ...prevLeadData,
                              thirdPayment: e.target.value,
                              fourthPayment:
                                parseInt(leadData.totalPayment) -
                                parseInt(leadData.firstPayment) -
                                parseInt(leadData.secondPayment) -
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
                          value={leadData.fourthPayment}
                          placeholder="Fourth Payment"
                          className={
                            parseInt(leadData.firstPayment) +
                              parseInt(leadData.secondPayment) +
                              parseInt(leadData.thirdPayment) +
                              parseInt(leadData.fourthPayment) !==
                            parseInt(leadData.totalPayment)
                              ? "form-control error-border"
                              : "form-control"
                          }
                          onChange={(e) => {
                            setLeadData((prevLeadData) => ({
                              ...prevLeadData,
                              fourthPayment: e.target.value,
                            }));
                          }}
                          readOnly={paymentCount === 4}
                        />
                        <span className="rupees-sym">₹</span>
                        <button
                          style={{ marginLeft: "5px" }}
                          onClick={(e) => {
                            setpaymentCount(3);
                            setLeadData((prevLeadData) => ({
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
              <div className="details-payment row mb-3">
                <div className="details-payment-1 col">
                  <small class="form-hint">
                    {parseInt(leadData.firstPayment) +
                      parseInt(leadData.secondPayment) +
                      parseInt(leadData.thirdPayment) +
                      parseInt(leadData.fourthPayment) !==
                    parseInt(leadData.totalPayment)
                      ? "Wrong Payment"
                      : `${(
                          (leadData.firstPayment * 100) /
                          leadData.totalPayment
                        ).toFixed(2)} % Amount`}
                  </small>
                </div>
                <div className="details-payment-2 col">
                  <small class="form-hint">
                    {parseInt(leadData.firstPayment) +
                      parseInt(leadData.secondPayment) +
                      parseInt(leadData.thirdPayment) +
                      parseInt(leadData.fourthPayment) !==
                    parseInt(leadData.totalPayment)
                      ? "Wrong Payment"
                      : `${(
                          (leadData.secondPayment * 100) /
                          leadData.totalPayment
                        ).toFixed(2)} % Amount`}
                  </small>
                </div>
                {paymentCount >= 3 && (
                  <div className="details-payment-3 col">
                    <small class="form-hint">
                      {parseInt(leadData.firstPayment) +
                        parseInt(leadData.secondPayment) +
                        parseInt(leadData.thirdPayment) +
                        parseInt(leadData.fourthPayment) !==
                      parseInt(leadData.totalPayment)
                        ? "Wrong Payment"
                        : `${(
                            (leadData.thirdPayment * 100) /
                            leadData.totalPayment
                          ).toFixed(2)} % Amount`}
                    </small>
                  </div>
                )}

                {paymentCount === 4 && (
                  <div className="details-payment-4 col">
                    <small class="form-hint">
                      {parseInt(leadData.firstPayment) +
                        parseInt(leadData.secondPayment) +
                        parseInt(leadData.thirdPayment) +
                        parseInt(leadData.fourthPayment) !==
                      parseInt(leadData.totalPayment)
                        ? "Wrong Payment"
                        : `${(
                            (leadData.fourthPayment * 100) /
                            leadData.totalPayment
                          ).toFixed(2)} % Amount`}
                    </small>
                  </div>
                )}
              </div>
              <div className="payment-remarks col">
                <label class="form-label">Payment Remarks</label>
                <input
                  type="text"
                  name="payment-remarks"
                  id="payment-remarks"
                  placeholder="Please add remarks if any"
                  className="form-control"
                  onChange={(e) => {
                    setLeadData((prevLeadData) => ({
                      ...prevLeadData,
                      paymentRemarks: e.target.value,
                    }));
                  }}
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
                value={leadData.paymentMethod}
                onChange={(e) => {
                  setLeadData((prevLeadData) => ({
                    ...prevLeadData,
                    paymentMethod: e.target.value,
                  }));
                }}
                id="select-emails"
              >
                <option value="" disabled>
                  Select Payment Option
                </option>
                <option value="ICICI Bank">ICICI Bank</option>
                <option value="SRK Seedfund(Non GST)/IDFC first Bank">
                  SRK Seedfund(Non GST)/IDFC first Bank
                </option>
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
                    setLeadData((prevLeadData) => ({
                      ...prevLeadData,
                      paymentReciept: e.target.files[0],
                    }));
                  }}
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
                value={leadData.bookingSource}
                onChange={(e) => {
                  setLeadData((prevLeadData) => ({
                    ...prevLeadData,
                    bookingSource: e.target.value,
                  }));
                }}
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
                type="number"
                name="panorGSTnumber"
                id="panorGSTnumber"
                placeholder="Enter Company's PAN/GST number "
                className="form-control"
                onChange={(e) => {
                  setLeadData((prevLeadData) => ({
                    ...prevLeadData,
                    cPANorGSTnum: e.target.value,
                  }));
                }}
              />
            </div>
          </div>
        </div>

        <div className="cidate-or-extranotes row mb-3">
          <div className="cidate col">
            <label className="form-label">Company Incorporation Date</label>
            <input
              onChange={(e) => {
                setLeadData((prevLeadData) => ({
                  ...prevLeadData,
                  incoDate: e.target.value,
                }));
              }}
              value={matured ? formatDate(companysInco) : leadData.incoDate}
              type="date"
              className="form-control"
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
            />
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
          </div>
          <div className="extra-notes col">
            <label class="form-label">Any Extra Notes</label>
            <input
              type="text"
              name="extraNotes"
              id="extraNotes"
              placeholder="Enter any extra notes "
              className="form-control"
              onChange={(e) => {
                setLeadData((prevLeadData) => ({
                  ...prevLeadData,
                  extraNotes: e.target.value,
                }));
              }}
            />
          </div>
        </div>
      </div>
      <div class="card-footer text-end">
        <button
          onClick={handleSubmitForm}
          type="submit"
          class="btn btn-primary mb-3"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default Form;
