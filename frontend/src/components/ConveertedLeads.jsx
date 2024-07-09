import React, { useEffect } from "react";
import Header from "./Header";
import { useState } from "react";
import { useParams } from "react-router-dom";
import EmpNav from "../employeeComp/EmpNav";
import axios from "axios";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import Swal from "sweetalert2";
import { IconButton } from "@mui/material";
import "../assets/styles.css";
import CloseIcon from "@mui/icons-material/Close";
import Form from "./Form";
import Nodata from "./Nodata";

function ConveertedLeads() {
  const [formOpen, setformOpen] = useState(false);
  const [data, setData] = useState([]);
  const [unames, setUnames] = useState([]);
  const [paymentCount, setpaymentCount] = useState(0);
  const [otherName, setotherName] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  // const [currentData, setCurrentData] = useState([]);
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
    paymentReciept: null,
    bookingSource: "",
    cPANorGSTnum: 0,
    incoDate: null,
    extraNotes: "",
    otherDocs: null,
  });

  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const { userId } = useParams();
  const fetchData = async () => {
    try {
      const response = await axios.get(`${secretKey}/employee/einfo`);

      const tempData = response.data;
      setUnames(tempData);

      const userData = tempData.find((item) => item._id === userId);

      setData(userData);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };
  const fetchNewData = async () => {
    try {
      const response = await axios.get(`${secretKey}/company-data/employees/${data.ename}`);
      const tempData = response.data;
      console.log(tempData);
      // console.log(response.data)
      setFilteredData(response.data);
      // setmoreEmpData(response.data);

      // setEmployeeData(tempData.filter(obj => obj.Status === "Busy" || obj.Status === "Not Picked Up" || obj.Status === "Untouched"))
    } catch (error) {
      console.error("Error fetching new data:", error);
    }
  };

  const currentData = filteredData.filter((obj) => obj.Status === "Matured");
  useEffect(() => {
    fetchData();
    fetchNewData();
  }, []);

  const [open, openchange] = useState(false);
  const functionopenpopup = () => {
    openchange(true);
  };
  const closepopup = () => {
    openchange(false);
  };

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
    formData.append("companyName", leadData.companyName);
    formData.append("contactNumber", leadData.contactNumber);
    formData.append("companyEmail", leadData.companyEmail);
    formData.append("services", leadData.services);
    formData.append("originalTotalPayment", leadData.originalTotalPayment);
    formData.append("totalPayment", leadData.totalPayment);
    formData.append("paymentTerms", leadData.paymentTerms);
    formData.append("paymentMethod", leadData.paymentMethod);
    formData.append(
      "firstPayment",
      (leadData.firstPayment * leadData.totalPayment) / 100
    );
    formData.append(
      "secondPayment",
      (leadData.secondPayment * leadData.totalPayment) / 100
    );
    formData.append(
      "thirdPayment",
      (leadData.thirdPayment * leadData.totalPayment) / 100
    );
    formData.append(
      "fourthPayment",
      (leadData.fourthPayment * leadData.totalPayment) / 100
    );
    formData.append("bookingSource", leadData.bookingSource);
    formData.append("cPANorGSTnum", leadData.cPANorGSTnum);
    formData.append("incoDate", leadData.incoDate);
    formData.append("extraNotes", leadData.extraNotes);
    if (leadData.otherDocs) {
      for (let i = 0; i < leadData.otherDocs.length; i++) {
        formData.append("otherDocs", leadData.otherDocs[i]);
      }
    }
    formData.append("paymentReceipt", leadData.paymentReciept);

    try {
      if (
        leadData.firstPayment +
          leadData.secondPayment +
          leadData.thirdPayment +
          leadData.fourthPayment !==
        100
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
        services: "",
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
      closepopup();
      Swal.fire("Data sent Succefully!");
    } catch (error) {
      Swal.fire("Error!");
      console.error("Login failed:", error.message);

      // setErrorMessage("Incorrect Credentials!");
    }
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
      {/* Dialog box Content */}

      <Dialog open={false} onClose={closepopup} fullWidth maxWidth="lg">
        <div class="col-md-12">
          <div class="card">
            <div class="card-header d-flex justify-content-between">
              <h3 class="card-title">Lead Form</h3>
              <IconButton onClick={closepopup} style={{ float: "right" }}>
                <CloseIcon color="primary"></CloseIcon>
              </IconButton>{" "}
            </div>
            <div class="card-body">
              <div className="BDM-Name">
                <label class="form-label">BDM Name</label>
                <div className="nameSection row mb-3">
                  <div className="name col">
                    <div className="choose-option">
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
                  </div>
                  {leadData.bdmName === "other" && (
                    <div className="othername col">
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
                  )}

                  <div className="email col">
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
                </div>
                <div className="closeby">
                  <div class="mb-3">
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
                      <div className="booking-date mb-3">
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
                  </div>
                </div>
              </div>

              <div className="CA-case mb-3">
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
                <div className="company-name col">
                  <label class="form-label">Enter Company's Name</label>
                  <input
                    type="text"
                    name="company-name"
                    id="company-name"
                    placeholder="Enter Company Name"
                    className="form-control"
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
                  <input
                    type="number"
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
                  />
                </div>
                <div className="company-email col">
                  <label class="form-label">Enter Company's Email-ID</label>
                  <input
                    type="text"
                    name="company-email"
                    id="company-email"
                    placeholder="Enter Company Email ID"
                    className="form-control"
                    onChange={(e) => {
                      setLeadData((prevLeadData) => ({
                        ...prevLeadData,
                        companyEmail: e.target.value, // Set the value based on the selected radio button
                      }));
                    }}
                  />
                </div>
              </div>

              <div className="services mb-3">
                <label class="form-label">Services</label>
                <input
                  type="text"
                  name="services"
                  id="services"
                  placeholder="Enter Services Name"
                  className="form-control"
                  onChange={(e) => {
                    setLeadData((prevLeadData) => ({
                      ...prevLeadData,
                      services: e.target.value, // Set the value based on the selected radio button
                    }));
                  }}
                />
              </div>
              <div className="paymentGST mb-3">
                <label class="form-label">Total Payment&nbsp;</label>
                <input
                  type="number"
                  name="total-payment"
                  id="total-payment"
                  placeholder="Enter Total Payment with GST"
                  className="form-control"
                  onChange={(e) => {
                    setLeadData((prevLeadData) => ({
                      ...prevLeadData,
                      originalTotalPayment: e.target.value,
                      totalPayment: e.target.value, // Set the value based on the selected radio button
                    }));
                  }}
                />
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id="flexCheckChecked"
                    onChange={(e) => {
                      const isChecked = e.target.checked;
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
                    Include GST (18%)
                  </label>
                </div>
              </div>
              <div className="payment-withGST mb-3">
                <label class="form-label">
                  Total Payment&nbsp;
                  <span style={{ fontWeight: "bold" }}>INC. GST</span>
                </label>
                <div className="form-control">{leadData.totalPayment}</div>
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

                            // Set the value based on the selected radio button
                          }));
                        }}
                      />
                      <span className="form-check-label">Two Part Payment</span>
                    </label>
                  </div>
                </div>
                {leadData.paymentTerms === "two-part" && (
                  <>
                    <div className="row more-payments mb-3">
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
                                style={{
                                  borderRadius: "5px 0px 0px 5px",
                                }}
                                name="second-payment"
                                id="second-payment"
                                value={leadData.secondPayment}
                                placeholder="Second Payment"
                                className="form-control"
                                onChange={(e) => {
                                  setLeadData((prevLeadData) => ({
                                    ...prevLeadData,
                                    secondPayment: e.target.value, // Set the value based on the input
                                  }));
                                }}
                                // Add style for extra space on the right
                              />
                              <span className="rupees-sym">₹</span>

                              {/* Add a span with Indian Rupees symbol */}

                              <button
                                onClick={() => {
                                  setpaymentCount(3);
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
                                className="form-control"
                                onChange={(e) => {
                                  setLeadData((prevLeadData) => ({
                                    ...prevLeadData,
                                    thirdPayment: e.target.value,
                                  }));
                                }}
                              />
                              <span className="rupees-sym">₹</span>
                              <button
                                style={{ marginLeft: "5px" }}
                                onClick={() => {
                                  setpaymentCount(4);
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
                                className="form-control"
                                onChange={(e) => {
                                  setLeadData((prevLeadData) => ({
                                    ...prevLeadData,
                                    fourthPayment: e.target.value,
                                  }));
                                }}
                              />
                              <span className="rupees-sym">₹</span>
                              <button
                                style={{ marginLeft: "5px" }}
                                onClick={() => {
                                  setpaymentCount(3);
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
                    <div className="details-payment row">
                      <div className="details-payment-1 col">
                        <div className="form-control">
                          {(leadData.firstPayment * leadData.totalPayment) /
                            100}
                        </div>
                      </div>
                      <div className="details-payment-2 col">
                        <div className="form-control">
                          {(leadData.secondPayment * leadData.totalPayment) /
                            100}
                        </div>
                      </div>
                      {paymentCount >= 3 && (
                        <div className="details-payment-3 col">
                          <div className="form-control">
                            {(leadData.thirdPayment * leadData.totalPayment) /
                              100}
                          </div>
                        </div>
                      )}

                      {paymentCount === 4 && (
                        <div className="details-payment-4 col">
                          <div className="form-control">
                            {(leadData.fourthPayment * leadData.totalPayment) /
                              100}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
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
                      {/* <option value="SRK Seedfund(Non GST)/IDFC first Bank">
                        SRK Seedfund(Non GST)/IDFC first Bank
                      </option> */}
                      <option value="STARTUP SAHAY SERVICES/ADVISORY(Non GST)/ IDFC First Bank">
                        STARTUP SAHAY SERVICES/ADVISORY(Non GST)/ IDFC First
                        Bank
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
                      <option value="Lead By Saurav Sir">
                        Lead By Saurav Sir
                      </option>
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
                  <label className="form-label">
                    Company Incorporation Date
                  </label>
                  <input
                    onChange={(e) => {
                      setLeadData((prevLeadData) => ({
                        ...prevLeadData,
                        incoDate: e.target.value,
                      }));
                    }}
                    type="date"
                    className="form-control"
                  />
                </div>
                <div className="extra-notes col">
                  <label class="form-label">Any Extra Notes</label>
                  <input
                    type="text"
                    name="extraNotes"
                    id="extraNotes"
                    placeholder="Enter Company's PAN/GST number "
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
              <div className="other-docs mb-3">
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
                  <ul>
                    {leadData.otherDocs.map((file, index) => (
                      <li key={index}>
                        {file.name}
                        <button
                          style={{
                            backgroundColor: "#ffb900",
                            color: "white",
                            border: "none",
                            borderRadius: "10px",
                            padding: "0px 5px",
                            marginLeft: "5px",
                          }}
                          onClick={() => handleRemoveFile(index)}
                        >
                          -
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div class="card-footer text-end">
              <button
                onClick={handleSubmitForm}
                type="submit"
                class="btn btn-primary"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </Dialog>

      <Header name={data.ename} designation={data.designation} />
      <EmpNav userId={userId} />

      <div className="page-wrapper">
        <div className="page-header d-print-none">
          <div
            style={{ justifyContent: "space-between" }}
            className="container-xl d-flex"
          >
            <div className="row g-2 align-items-center">
              <div className="col">
                {/* <!-- Page pre-title --> */}
                <h2 className="page-title">
                  {formOpen === false ? "Converted leads" : "LeadForm"}
                </h2>
              </div>
            </div>
            <div className="request">
              {formOpen ? (
                <>
                  <div className="btn-list">
                    <button
                      onClick={() => {
                        setformOpen(false);
                      }}
                      className="btn btn-primary d-none d-sm-inline-block"
                    >
                      Leads
                    </button>
                  </div>
                </>
              ) : (
                <div className="btn-list">
                  <button
                    onClick={() => {
                      setformOpen(true);
                    }}
                    className="btn btn-primary d-none d-sm-inline-block"
                  >
                    ADD Leads
                  </button>
                  <a
                    href="#"
                    className="btn btn-primary d-sm-none btn-icon"
                    data-bs-toggle="modal"
                    data-bs-target="#modal-report"
                    aria-label="Create new report"
                  >
                    {/* <!-- Download SVG icon from http://tabler-icons.io/i/plus --> */}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
        <div
          onCopy={(e) => {
            e.preventDefault();
          }}
          className="page-body m-0"
        >
          <div className="container-xl">
            {formOpen ? (
              <Form employeeName={data.ename} employeeEmail={data.email} />
            ) : (
              <div className="card mt-2">
                <div className="card-body p-0">
                  <div style={{ overflowX: "auto" }}>
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        border: "1px solid #ddd",
                      }}
                      className="table-vcenter table-nowrap"
                    >
                      <thead>
                        <tr style={{ backgroundColor: "#f2f2f2" }}>
                          <th
                            style={{
                              position: "sticky",
                              left: "0px",
                              zIndex: 1,
                            }}
                          >
                            Sr.No
                          </th>
                          <th
                            style={{
                              position: "sticky",
                              left: "80px",
                              zIndex: 1,
                            }}
                          >
                            Company Name
                          </th>
                          <th>Company Number</th>
                          <th>Company Email</th>
                          <th>Incorporation Date</th>
                          <th>City</th>
                          <th>State</th>
                          <th>Status</th>
                          <th>Remarks</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      {currentData ? (
                        <tbody>
                          <tr>
                            <td colSpan="10" style={{ textAlign: "center" }}>
                             <Nodata/>
                            </td>
                          </tr>
                        </tbody>
                      ) : (
                        <tbody>
                          {currentData &&
                            currentData.map((company, index) => (
                              <tr
                                key={index}
                                style={{ border: "1px solid #ddd" }}
                              >
                                <td
                                  style={{
                                    position: "sticky",
                                    left: "0px",
                                    zIndex: 1,
                                    background: "white",
                                  }}
                                >
                                  {index + 1}
                                </td>
                                <td
                                  style={{
                                    position: "sticky",
                                    left: "0px",
                                    zIndex: 1,
                                    background: "white",
                                  }}
                                >
                                  {company["Company Name"]}
                                </td>
                                <td>{company["Company Number"]}</td>
                                <td>{company["Company Email"]}</td>
                                <td>
                                  {company["Company Incorporation Date  "]}
                                </td>
                                <td>{company["City"]}</td>
                                <td>{company["State"]}</td>
                                <td>Matured</td>

                                <td>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <textarea
                                      defaultValue={company["Remarks"]}
                                      type="text"
                                      style={{
                                        padding: ".4375rem .75rem",
                                        border:
                                          " var(--tblr-border-width) solid var(--tblr-border-color)",
                                        borderRadius:
                                          "var(--tblr-border-radius)",
                                        boxShadow: "0 0 transparent",
                                        transition:
                                          "border-color .15s ease-in-out,box-shadow .15s ease-in-out",
                                        height: "34px",
                                      }}
                                    />
                                  </div>
                                </td>

                                <td>
                                  <button
                                    style={{
                                      padding: "5px",
                                      fontSize: "12px",
                                      backgroundColor: "lightblue",
                                      // Additional styles for the "View" button
                                    }}
                                    className="btn btn-primary d-none d-sm-inline-block"
                                  >
                                    View
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      )}
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConveertedLeads;
