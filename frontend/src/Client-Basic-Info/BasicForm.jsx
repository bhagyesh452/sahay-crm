import React, { useEffect, useState } from "react";
import img from "../static/logo.jpg";
import "../assets/styles.css";
import axios from "axios";

const BasicForm = () => {
  const DirectorForm = {
    DirectorName: "",
    DirectorEmail: "",
    DirectorMobileNo: "",
    DirectorQualification: "",
    DirectorWorkExperience: "",
    DirectorAnnualIncome: "",
    DirectorPassportPhoto: "",
    DirectorAdharCard: "",
    LinkedInProfileLink: "",
    DirectorDesignation: "",
    DirectorAdharCardNumber: "",
    DirectorGender: "",
    IsMainDirector: false,
  };

  const [formData, setFormData] = useState({
    CompanyName: "",
    CompanyEmail: "",
    CompanyNo: "",
    BrandName: "",
    WebsiteLink: "",
    CompanyAddress:"",
    CompanyPanNumber:"",
    UploadMOA: "",
    UploadAOA: "",
    FacebookLink: "",
    InstagramLink: "",
    LinkedInLink: "",
    YoutubeLink: "",
    CompanyActivities: "",
    ProductService: "",
    CompanyUSP: "",
    ValueProposition: "",
    TechnologyInvolved: "",
    UploadPhotos: "",
    RelevantDocument: "",
    DirectInDirectMarket: "",
    BusinessModel: "",
    Finance: "",
    DirectorDetails: [DirectorForm],
  });

  console.log(formData);

  const [directorLength, setDirectorLength] = useState(1);


  // console.log(directorLength);

  useEffect(() => {
    const simpleArray = [];

    for (let index = 0; index < directorLength; index++) {
      simpleArray.push(DirectorForm);
    }
    const tempFormData = {
      ...formData,
      DirectorDetails: simpleArray,
    };
    setFormData(tempFormData);
  }, [directorLength]);

  // console.log(formData);

  async function sendDataToBackend() {
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (!["DirectorDetails"].includes(key)) {
          data.append(key, formData[key]);
        } else {
          formData.DirectorDetails.forEach((director, index) => {
            Object.keys(director).forEach((prop) => {
              if (prop === "DirectorPassportPhoto" || prop === "DirectorAdharCard") {
                data.append(`${prop}`, director[prop]);
              } else {
                data.append(`DirectorDetails[${index}][${prop}]`, director[prop]);
              }
            });
          });
        }
      });

      for (const [key, value] of data.entries()) {
        console.log(`${key}: ${value}`);
      }

      const response = await fetch("http://localhost:3001/api/users", {
        method: "POST",
        body: data,
      });
      if (response.ok) {
        console.log("Form data submitted successfully!");
        // Refresh the page after a short delay (e.g., 1 second)
        setTimeout(() => {
          window.location.reload();
        }, 1000); // 1000 milliseconds = 1 second
      } else {
        console.error("Failed to submit form data:", response.statusText);
      }
      return response.data; // You can return data from the backend if needed
    }
    catch (error) {
      console.error("Error sending data to backend:", error);
      throw error; // Rethrow the error for handling it in the calling code
    }
  }

  const [errors, setErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [emailError, setEmailError] = useState('');

  const [showLinks, setShowLinks] = useState(false);
  const [showTechnologyDetails, setShowTechnologyDetails] = useState(false);
  const [showPhotos, setShowPhotos] = useState(false);
  const [showIp, setShowIp] = useState(false);
  const [showFinance, setShowFinance] = useState(false);
  const [numberOfDirectors, setNumberOfDirectors] = useState(1);


  const handleInputChange = (e, fieldName, index) => {
    const value = e.target.value;
    if (fieldName === "DirectorDetails") {
      const updatedDirectorDetails = [...formData.DirectorDetails];
      updatedDirectorDetails[index][e.target.name] = value;
      setFormData((prevState) => ({
        ...prevState,
        DirectorDetails: updatedDirectorDetails,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [fieldName]: value,
      }));
    }
  };


  // const handleInputChange = (e, field) => {
  //   const { value } = e.target;
  //   setFormData({
  //     ...formData,
  //     [field]: value,
  //   });
  // };


  const handleDirectorsChange = (e) => {
    const value = parseInt(e.target.value);
    setDirectorLength(value);
    setNumberOfDirectors(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.CompanyName && formData.CompanyName !== "") {
      newErrors.CompanyName = "Comapny Name is required";
    }
    if (!formData.CompanyEmail && formData.CompanyEmail !== "") {
      newErrors.CompanyEmail = "Email is required";
    }
    if (!formData.CompanyNo && formData.CompanyNo !== "") {
      newErrors.CompanyNo = "Mobile No is required";
    }
    if (!formData.BrandName && formData.BrandName !== "") {
      newErrors.CompanyNo = "Enter Brand Name";
    }
    if (!formData.WebsiteLink && formData.WebsiteLink !== "") {
      newErrors.CompanyNo = "Enter Website Link";
    }
    if (!formData.CompanyAddress && formData.CompanyAddress !== "") {
      newErrors.CompanyAddress = "Enter Company Address";
    }
    if (!formData.CompanyPanNumber && formData.CompanyPanNumber !== "") {
      newErrors.CompanyPanNumber = "Enter Pan Number";
    }
    if (!formData.CompanyActivities && formData.CompanyActivities !== "") {
      newErrors.CompanyActivities = "Enter Your Company Activities";
    }
    if (!formData.ProductService && formData.ProductService !== "") {
      newErrors.ProductService = "Enter Your Problems";
    }
    if (!formData.CompanyUSP && formData.CompanyUSP !== "") {
      newErrors.CompanyUSP = "Enter Your USP";
    }
    if (!formData.ValueProposition && formData.ValueProposition !== "") {
      newErrors.ValueProposition = "Enter Your Company  Value Proposition";
    }
    if (!formData.TechnologyInvolved && formData.TechnologyInvolved !== "") {
      newErrors.TechnologyInvolved = "Enter Your Technology";
    }
    if (!formData.UploadPhotos && formData.UploadPhotos !== "") {
      newErrors.UploadPhotos = "Comapny Name is required";
    }
    if (!formData.RelevantDocument && formData.RelevantDocument !== "") {
      newErrors.RelevantDocument = "Comapny Name is required";
    }
    if (!formData.DirectorDetails[0].DirectorName) {
      newErrors.DirectorName = "Enter Director Name";
    }
    if (!formData.DirectorDetails[0].DirectorEmail) {
      newErrors.DirectorEmail = "Enter Director Email Id";
    }
    if (!formData.DirectorDetails[0].DirectorMobileNo) {
      newErrors.DirectorMobileNo = "Mobile No is required";
    }
    if (!formData.DirectorDetails[0].DirectorQualification) {
      newErrors.DirectorQualification = "Enter Director Qualification";
    }
    if (!formData.DirectorDetails[0].DirectorWorkExperience) {
      newErrors.DirectorWorkExperience = "Enter Director Work Experience";
    }
    if (!formData.DirectorDetails[0].DirectorAnnualIncome) {
      newErrors.DirectorAnnualIncome = "Enter Director Annual Income";
    }
    if (!formData.DirectorDetails[0].DirectorPassportPhoto) {
      newErrors.DirectorPassportPhoto = "Upload Your Passport Photo";
    }
    if (!formData.DirectorDetails[0].DirectorAdharCard) {
      newErrors.DirectorAdharCard = "Upload your Adhar Card";
    }
    if (!formData.DirectorDetails[0].DirectorDesignation) {
      newErrors.DirectorDesignation = "Enter Director Designation";
    }
    if (!formData.DirectorDetails[0].DirectorAdharCardNumber) {
      newErrors.DirectorAdharCardNumber = "Enter Director Adhar Card Number";
    }
    if (!formData.DirectorDetails[0].DirectorGender) {
      newErrors.DirectorGender = "Select Director Gender";
    }

    setErrors(newErrors);

    // Check if there are any errors
    if (Object.keys(newErrors).length > 0) {
      // setErrors(newErrors);
      setFormSubmitted(true); // Reset form submission state
    }

    // setErrors(true);
    setFormSubmitted(true);
    if (Object.keys(newErrors).length === 0) {
      sendDataToBackend();
    }
  };


  const handleRadioChange = (e, index) => {
    setShowLinks(e.target.value === "yes");
    setFormData((prevState) => ({
      ...prevState,
      DirectorDetails: prevState.DirectorDetails.map((director, i) => ({
        ...director,
        IsMainDirector: i === index,
      })),
    }));
  };

  const handleRadioChanges = (event) => {
    setShowTechnologyDetails(event.target.value === "yes");
  };

  const handlePhotos = (event) => {
    setShowPhotos(event.target.value === "Yes");
  };

  const handleIp = (event) => {
    setShowIp(event.target.value === "Yes");
  };

  const handleFinance = (event) => {
    setShowFinance(event.target.value === "yes");
  };

  // Email content based on selected Business Model
  const getEmailContent = () => {
    switch (formData.BusinessModel) {
      case "B2B":
        return (
          <div>
            <h3>Email Details for B2B</h3>
            <p>Select Your BusinessModel: B2B Options</p>
          </div>
        );
      case "B2C":
        return (
          <div>
            <h3>Email Details for B2C</h3>
            <p>Select Your BusinessModel: B2C Options</p>
          </div>
        );
      case "B2G":
        return (
          <div>
            <h3>Email Details for B2G</h3>
            <p>Select Your BusinessModel: B2G Options</p>
          </div>
        );
      case "D2C":
        return (
          <div>
            <h3>Email Details for D2C</h3>
            <p>Select Your BusinessModel: D2C Options</p>
          </div>
        );
      case "C2C":
        return (
          <div>
            <h3>Email Details for C2C</h3>
            <p>Select Your BusinessModel: C2C Options</p>
          </div>
        );
      default:
        return null;
    }
  };

  // Director and Team Details code

  const renderDirectorFields = () => {
    return Array.from({ length: numberOfDirectors }, (_, index) => (
      <div className="directors-details-box p-3" key={index}>
        <div className="row">
          <div className="col-lg-12 d-flex align-items-center gap-5">
            <h5>{index + 1}</h5>
            <div>
              <label className="Director">Main Director</label>
              <input type="radio" name="maindirector_radio" checked={formData.DirectorDetails[index.IsMainDirector]} onChange={() => {
                setFormData((prevState) => ({
                  ...prevState,
                  DirectorDetails: prevState.DirectorDetails.map((director, i) =>
                    i === index
                      ? { ...director, IsMainDirector: true }
                      : { ...director, IsMainDirector: false }
                  ),
                }));
              }} />
            </div>
          </div>
          <div className="col-lg-4">
            <div className="form-group mt-2 mb-2">
              <label htmlFor={`DirectorName${index}`}>
                Enter Director's Name <span style={{ color: "red" }}>*</span>
              </label>
              <input
                required
                type="text"
                className="form-control mt-1"
                placeholder="Enter Director's Name "
                id={`DirectorName${index}`}
                value={formData.DirectorDetails[index.DirectorName]}
                onChange={(e) => {
                  setFormData((prevState) => ({
                    ...prevState,
                    DirectorDetails: prevState.DirectorDetails.map(
                      (DirectorDetails, i) =>
                        i === index
                          ? { ...DirectorDetails, DirectorName: e.target.value }
                          : DirectorDetails
                    ),
                  }));
                }}
              />
              {formSubmitted && !formData.DirectorDetails[0].DirectorName && (
                <div style={{ color: "red" }}>Enter Director Name</div>
              )}
              {/* {formSubmitted && !formData.DirectorName && (
                <div style={{ color: "red" }}></div>
              )} */}
            </div>
          </div>
          <div className="col-lg-4">
            <div className="form-group mt-2 mb-2">
              <label htmlFor={`DirectorEmail${index}`}>
                Enter Director's Email <span style={{ color: "red" }}>*</span>
              </label>
              <input
                required
                type="email"
                className="form-control mt-1"
                placeholder="Enter Director's Email "
                id={`DirectorEmail${index}`}
                value={formData.DirectorDetails[index.DirectorEmail]}
                onChange={(e) => {
                  setFormData((prevState) => ({
                    ...prevState,
                    DirectorDetails: prevState.DirectorDetails.map(
                      (DirectorDetails, i) =>
                        i === index
                          ? {
                            ...DirectorDetails,
                            DirectorEmail: e.target.value,
                          }
                          : DirectorDetails
                    ),
                  }));
                }}
              />
              {formSubmitted && !formData.DirectorDetails[0].DirectorEmail && (
                <div style={{ color: "red" }}>Enter Director Email</div>
              )}
              {/* {formSubmitted && !formData[`DirectorEmail${index}`] && (
                <div style={{ color: "red" }}></div>
              )} */}
            </div>
          </div>
          <div className="col-lg-4">
            <div className="form-group mt-2 mb-2">
              <label htmlFor={`DirectorMobileNo${index}`}>
                Enter Director's Mobile No{" "}
                <span style={{ color: "red" }}>*</span>
              </label>
              <input
                required
                type="text"
                className="form-control mt-1"
                placeholder="Enter Director's Mobile No "
                id={`DirectorMobileNo${index}`}
                value={formData.DirectorDetails[index.DirectorMobileNo]}
                onChange={(e) => {
                  setFormData((prevState) => ({
                    ...prevState,
                    DirectorDetails: prevState.DirectorDetails.map(
                      (DirectorDetails, i) =>
                        i === index
                          ? {
                            ...DirectorDetails,
                            DirectorMobileNo: e.target.value,
                          }
                          : DirectorDetails
                    ),
                  }));
                }}
              />
              {formSubmitted && !formData.DirectorDetails[0].DirectorMobileNo && (
                <div style={{ color: "red" }}>Enter Director Mobile No</div>
              )}
              {/* {formSubmitted && !formData[`DirectorMobileNo${index}`] && (
                <div style={{ color: "red" }}></div>
              )} */}
            </div>
          </div>
          <div className="col-lg-4">
            <div className="form-group mt-2 mb-2">
              <label htmlFor={`DirectorQualification${index}`}>
                Enter Director's Qualification{" "}
                <span style={{ color: "red" }}>*</span>
              </label>
              <input
                required
                type="text"
                className="form-control mt-1"
                placeholder="Enter Director's Qualification"
                id={`DirectorQualification${index}`}
                value={formData.DirectorDetails[index.DirectorQualification]}
                onChange={(e) => {
                  setFormData((prevState) => ({
                    ...prevState,
                    DirectorDetails: prevState.DirectorDetails.map(
                      (DirectorDetails, i) =>
                        i === index
                          ? {
                            ...DirectorDetails,
                            DirectorQualification: e.target.value,
                          }
                          : DirectorDetails
                    ),
                  }));
                }}
              />
              {formSubmitted && !formData.DirectorDetails[0].DirectorQualification && (
                <div style={{ color: "red" }}>Enter Director Qualification</div>
              )}
              {/* {formSubmitted && !formData[`DirectorQualification${index}`] && (
                <div style={{ color: "red" }}></div>
              )} */}
            </div>
          </div>
          <div className="col-lg-4">
            <div className="form-group mt-2 mb-2">
              <label htmlFor={`Directorexp${index}`}>
                Director's Work Experience (In Detail){" "}
                <span style={{ color: "red" }}>*</span>
              </label>
              <input
                required
                type="text"
                className="form-control mt-1"
                placeholder="Enter Director's Work Experience (In Detail)"
                id={`Directorexp${index}`}
                value={formData.DirectorDetails[index.DirectorWorkExperience]}
                onChange={(e) => {
                  setFormData((prevState) => ({
                    ...prevState,
                    DirectorDetails: prevState.DirectorDetails.map(
                      (DirectorDetails, i) =>
                        i === index
                          ? {
                            ...DirectorDetails,
                            DirectorWorkExperience: e.target.value,
                          }
                          : DirectorDetails
                    ),
                  }));
                }}
              />
              {formSubmitted && !formData.DirectorDetails[0].DirectorWorkExperience && (
                <div style={{ color: "red" }}>Enter Director Work Experience</div>
              )}
              {/* {formSubmitted && !formData[`DirectorWorkExperience${index}`] && (
                <div style={{ color: "red" }}>

                </div>
              )} */}
            </div>
          </div>
          <div className="col-lg-4">
            <div className="form-group mt-2 mb-2">
              <label htmlFor={`Directorincome${index}`}>
                Annual Income Of Director's Family (Approx):{" "}
                <span style={{ color: "red" }}>*</span>
              </label>
              <input
                required
                type="text"
                className="form-control mt-1"
                placeholder="Enter Annual Income Of Director's Family (Approx):"
                id={`Directorincome${index}`}
                value={formData.DirectorDetails[index.DirectorAnnualIncome]}
                onChange={(e) => {
                  setFormData((prevState) => ({
                    ...prevState,
                    DirectorDetails: prevState.DirectorDetails.map(
                      (DirectorDetails, i) =>
                        i === index
                          ? {
                            ...DirectorDetails,
                            DirectorAnnualIncome: e.target.value,
                          }
                          : DirectorDetails
                    ),
                  }));
                }}
              />
              {formSubmitted && !formData.DirectorDetails[0].DirectorAnnualIncome && (
                <div style={{ color: "red" }}>Enter Director Annual Income</div>
              )}
              {/* {formSubmitted && !formData[`DirectorAnnualIncome${index}`] && (
                <div style={{ color: "red" }}></div>
              )} */}
            </div>
          </div>
          <div className="col-lg-4">
            <div className="form-group mt-2 mb-2">
              <label htmlFor={`DirectorPassportPhoto${index}`}>
                Director's Passport Size Photo{" "}
                <span style={{ color: "red" }}>*</span>
              </label>
              <input
                required
                type="file"
                className="form-control mt-1"
                id={`DirectorPassportPhoto${index}`}
                value={formData.DirectorDetails[index.DirectorPassportPhoto]}
                onChange={(e) => {
                  setFormData((prevState) => ({
                    ...prevState,
                    DirectorDetails: prevState.DirectorDetails.map(
                      (DirectorDetails, i) =>
                        i === index
                          ? {
                            ...DirectorDetails,
                            DirectorPassportPhoto: e.target.files[0],
                          }
                          : DirectorDetails
                    ),
                  }));
                }}
              />
              {formSubmitted && !formData.DirectorDetails[0].DirectorPassportPhoto && (
                <div style={{ color: "red" }}>Upload Passport Size Photo</div>
              )}
              {/* {formSubmitted && !formData[`DirectorPassportPhoto${index}`] && (
                <div style={{ color: "red" }}>

                </div>
              )} */}
              <div className="input-note">
                (Files size should be less than 500KB)
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="form-group mt-2 mb-2">
              <label htmlFor={`DirectorAdharCard${index}`}>
                Director's Adhar Card <span style={{ color: "red" }}>*</span>
              </label>
              <input
                required
                type="file"
                className="form-control mt-1"
                id={`DirectorAdharCard${index}`}
                value={formData.DirectorDetails[index.DirectorAdharCard]}
                onChange={(e) => {
                  setFormData((prevState) => ({
                    ...prevState,
                    DirectorDetails: prevState.DirectorDetails.map(
                      (DirectorDetails, i) =>
                        i === index
                          ? {
                            ...DirectorDetails,
                            DirectorAdharCard: e.target.files[0],
                          }
                          : DirectorDetails
                    ),
                  }));
                }}
              />
              {formSubmitted && !formData.DirectorDetails[0].DirectorAdharCard && (
                <div style={{ color: "red" }}>Upload Director AdharCard</div>
              )}
              {/* {formSubmitted && !formData[`DirectorAdharCard${index}`] && (
                <div style={{ color: "red" }}></div>
              )} */}
            </div>
          </div>
          <div className="col-lg-4">
            <div className="form-group mt-2 mb-2">
              <label htmlFor={`DirectorAdharCardNumber${index}`}>
                Director's Adharcard Number
                <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                className="form-control mt-1"
                placeholder="Enter Director AdharCard Number"
                id={`DirectorAdharCardNumber${index}`}
                value={formData.DirectorDetails[index.DirectorAdharCardNumber]}
                onChange={(e) => {
                  setFormData((prevState) => ({
                    ...prevState,
                    DirectorDetails: prevState.DirectorDetails.map(
                      (DirectorDetails, i) =>
                        i === index
                          ? {
                            ...DirectorDetails,
                            DirectorAdharCardNumber: e.target.value,
                          }
                          : DirectorDetails
                    ),
                  }));
                }}
              />
              {formSubmitted && !formData.DirectorDetails[0].DirectorAdharCardNumber && (
                <div style={{ color: "red" }}>Enter Director AdharCard Number</div>
              )}
              {/* {formSubmitted && !formData[`DirectorAdharCardNumber${index}`] && (
                <div style={{ color: "red" }}></div>
              )} */}
            </div>
          </div>
          <div className="col-lg-4">
            <div className="form-group mt-2 mb-2">
              <label htmlFor={`DirectorDesignation${index}`}>
                Director's Designation
                <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                className="form-control mt-1"
                placeholder="Enter Director Designation"
                id={`DirectorDesignation${index}`}
                value={formData.DirectorDetails[index.DirectorDesignation]}
                onChange={(e) => {
                  setFormData((prevState) => ({
                    ...prevState,
                    DirectorDetails: prevState.DirectorDetails.map(
                      (DirectorDetails, i) =>
                        i === index
                          ? {
                            ...DirectorDetails,
                            DirectorDesignation: e.target.value,
                          }
                          : DirectorDetails
                    ),
                  }));
                }}
              />
              {formSubmitted && !formData.DirectorDetails[0].DirectorDesignation && (
                <div style={{ color: "red" }}>Enter Director Designation</div>
              )}
              {/* {formSubmitted && !formData[`DirectorDesignation${index}`] && (
                <div style={{ color: "red" }}></div>
              )} */}
            </div>
          </div>
          <div className="col-lg-4">
            <div className="form-group mt-2 mb-2 gender">
              <label htmlFor={`DirectorGender${index}`}>
                Choose  Director's Gender
                <span style={{ color: "red" }}>*</span>
              </label>
              <div className="d-flex align-items-center">
                <label className="form-check form-check-inline m-0 me-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name={`DirectorGender${index}`}
                    value="Male"
                    checked={formData.DirectorDetails[index]?.DirectorGender === 'Male'}
                    onChange={(e) => {
                      setFormData((prevState) => ({
                        ...prevState,
                        DirectorDetails: prevState.DirectorDetails.map(
                          (DirectorDetails, i) =>
                            i === index
                              ? { ...DirectorDetails, DirectorGender: e.target.value }
                              : DirectorDetails
                        ),
                      }));
                    }}
                  />
                  <span className="form-check-label">Male</span>
                </label>
                <label className="form-check form-check-inline m-0">
                  <input
                    className="form-check-input"
                    type="radio"
                    name={`DirectorGender${index}`}
                    value="Female"
                    checked={formData.DirectorDetails[index]?.DirectorGender === 'Female'}
                    onChange={(e) => {
                      setFormData((prevState) => ({
                        ...prevState,
                        DirectorDetails: prevState.DirectorDetails.map(
                          (DirectorDetails, i) =>
                            i === index
                              ? { ...DirectorDetails, DirectorGender: e.target.value }
                              : DirectorDetails
                        ),
                      }));
                    }}
                  />
                  <span className="form-check-label">Female</span>
                </label>
              </div>
              {formSubmitted && !formData.DirectorDetails[0].DirectorGender && (
                <div style={{ color: "red" }}>Select the Director Gender</div>
              )}

              {/* {formSubmitted && !formData.DirectorDetails[index].DirectorGender && (
                <div style={{ color: "red" }}></div>
              )} */}
            </div>
          </div>
          <div className="col-lg-4">
            <div className="form-group mt-2 mb-2">
              <label htmlFor={`DirectorLinkedIn${index}`}>
                LinkedIn Profile Link
                <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                className="form-control mt-1"
                placeholder="Enter LinkedIn Profile Link"
                id={`DirectorLinkedIn${index}`}
                value={formData.DirectorDetails[index.LinkedInProfileLink]}
                onChange={(e) => {
                  setFormData((prevState) => ({
                    ...prevState,
                    DirectorDetails: prevState.DirectorDetails.map(
                      (DirectorDetails, i) =>
                        i === index
                          ? {
                            ...DirectorDetails,
                            LinkedInProfileLink: e.target.value,
                          }
                          : DirectorDetails
                    ),
                  }));
                }}
              />
              {formSubmitted && !formData.DirectorDetails[0].LinkedInProfileLink && (
                <div style={{ color: "red" }}>Enter Director Profile Link</div>
              )}
              {/* {formSubmitted && !formData[`LinkedInProfileLink${index}`] && (
                <div style={{ color: "red" }}></div>
              )} */}
            </div>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="basic-information-main">
      <div className="basic-info-page-header">
        <div className="container-xl d-flex align-items-center justify-content-between">
          <div className="basic-info-logo">
            <img src={img} alt="image" />
          </div>
          <div className="go-web-btn">
            <button className="btn btn-md btn-primary">
              <a
                href="https://www.startupsahay.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Go To Website
              </a>
            </button>
          </div>
        </div>
      </div>
      <div className="basic-info-page-body">
        <div className="basic-info-head">
          <div className="container-xl">
            <h2 className="m-0">Basic Information form</h2>
          </div>
        </div>
        <form className="basic-info-form" onSubmit={handleSubmit}>
          <div className="container-xl">
            <div className="basic-info-form-head mt-4 mb-2">
              <h3>Basic Information</h3>
            </div>
            <div className="row">
              <div className="col-lg-4">
                <div className="form-group mt-2 mb-2">
                  <label htmlFor="Company">
                    Company Name: <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    required
                    type="text"
                    className="form-control mt-1"
                    placeholder="Enter Company Name"
                    id="Company"
                    value={formData.CompanyName}
                    onChange={(e) => handleInputChange(e, "CompanyName")}
                  />
                  {formSubmitted && !formData.CompanyName && (
                    <div style={{ color: "red" }}>
                      {"Company Name is required"}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-lg-4">
                <div className="form-group mt-2 mb-2">
                  <label htmlFor="CompanyEmail">
                    Email Address: <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    required
                    type="email"
                    className="form-control mt-1"
                    placeholder="Enter Company Email"
                    id="CompanyEmail"
                    value={formData.CompanyEmail}
                    onChange={e => handleInputChange(e, 'CompanyEmail')}
                    pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                    title="Enter a valid email address"
                  />
                  {formSubmitted && !formData.CompanyEmail && (
                    <div style={{ color: "red" }}>{"Enter Email Id"}</div>
                  )}
                  {/* {formSubmitted && formData.CompanyEmail && !isValidEmail(formData.CompanyEmail) && (
                    <div style={{ color: "red" }}>Enter a valid email address</div>
                  )} */}
                </div>
              </div>
              
              <div className="col-lg-4">
                <div className="form-group mt-2 mb-2">
                  <label htmlFor="CompanyNo">
                    Phone No: <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    required
                    type="tel"
                    className="form-control mt-1"
                    placeholder="Enter Company Phone No."
                    id="CompanyNo"
                    value={formData.CompanyNo}
                    onChange={e => handleInputChange(e, 'CompanyNo')}
                  />
                  {formSubmitted && !formData.CompanyNo && (
                    <div style={{ color: "red" }}>{"Enter Mobile Number"}</div>
                  )}
                </div>
              </div>
              <div className="col-lg-6">
                <div className="form-group mt-2 mb-2">
                  <label htmlFor="Brand-Name">Brand Name (If any):</label>
                  <input
                    required
                    type="text"
                    className="form-control mt-1"
                    placeholder="Enter Brand Name"
                    id="Brand-Name"
                    value={formData.BrandName}
                    onChange={e => handleInputChange(e, 'BrandName')}
                  />
                  {formSubmitted && !formData.BrandName && (
                    <div style={{ color: "red" }}>{"Enter Brand Name"}</div>
                  )}
                </div>
              </div>
              <div className="col-lg-6">
                <div className="form-group mt-2 mb-2">
                  <label htmlFor="WebsiteLink">Website's Link (If any):</label>
                  <input
                    required
                    type="text"
                    className="form-control mt-1"
                    placeholder="Enter Website's Link"
                    id="WebsiteLink"
                    value={formData.WebsiteLink}
                    onChange={(e) => handleInputChange(e, "WebsiteLink")}
                  />
                  {formSubmitted && !formData.WebsiteLink && (
                    <div style={{ color: "red" }}>{"Mention Website Link"}</div>
                  )}
                </div>
              </div>
              <div className="col-lg-6">
                <div className="form-group mt-2 mb-2">
                  <label htmlFor="WebsiteLink">Company Address: <span style={{ color: "red" }}>*</span></label>
                  <input
                    required
                    type="text"
                    className="form-control mt-1"
                    placeholder="Enter Company Address"
                    id="CompanyAddress"
                    value={formData.CompanyAddress}
                    onChange={(e) => handleInputChange(e, "CompanyAddress")}
                  />
                  {formSubmitted && !formData.CompanyAddress && (
                    <div style={{ color: "red" }}>{"Enter Company Address"}</div>
                  )}
                </div>
              </div>
              <div className="col-lg-6">
                <div className="form-group mt-2 mb-2">
                  <label htmlFor="WebsiteLink">Company Pan Number: <span style={{ color: "red" }}>*</span></label>
                  <input
                    required
                    type="text"
                    className="form-control mt-1"
                    placeholder="Enter Pan Number"
                    id="CompanyPanNumber"
                    value={formData.CompanyPanNumber}
                    onChange={(e) => handleInputChange(e, "CompanyPanNumber")}
                  />
                  {formSubmitted && !formData.CompanyPanNumber && (
                    <div style={{ color: "red" }}>{"Enter Pan Number"}</div>
                  )}
                </div>
              </div>
              <div className="col-lg-4">
                <div className="form-group mt-2 mb-2">
                  <label htmlFor="Services">
                    Select Your Services <span style={{ color: "red" }}>*</span>
                  </label>
                  <select className="form-select mt-1" id="Services">
                    <option>Seed Fund</option>
                  </select>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="form-group mt-2 mb-2">
                  <label htmlFor="Upload-MOA">Upload MOA:</label>
                  <input
                    type="file"
                    class="form-control mt-1"
                    id="Upload-MOA"
                    onChange={(e) =>
                      setFormData({ ...formData, UploadMOA: e.target.files[0] })
                    }
                  />
                  {formSubmitted && !formData.UploadMOA && (
                    <div style={{ color: "red" }}>{"Upload MOA"}</div>
                  )}
                </div>
              </div>
              <div className="col-lg-4">
                <div className="form-group mt-2 mb-2">
                  <label htmlFor="Upload-AOA">Upload AOA:</label>
                  <input
                    type="file"
                    className="form-control mt-1"
                    id="Upload-AOA"
                    onChange={(e) =>
                      setFormData({ ...formData, UploadAOA: e.target.files[0] })
                    }
                  />
                  {formSubmitted && !formData.UploadAOA && (
                    <div style={{ color: "red" }}>{"Upload AOA"}</div>
                  )}
                </div>
              </div>
              <div className="col-lg-12">
                <div className="form-group d-flex align-items-center mt-2 mb-2">
                  <label className="m-0" htmlFor="SocialMediaLink">
                    Do You have Social Media Link?
                  </label>
                  <div className="d-flex ms-2">
                    <label className="form-check form-check-inline m-0 me-2">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="socialMediaLink"
                        value="yes"
                        onChange={handleRadioChange}
                      />
                      <span className="form-check-label">Yes</span>
                    </label>
                    <label className="form-check form-check-inline m-0">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="socialMediaLink"
                        value="no"
                        onChange={handleRadioChange}
                      />
                      <span className="form-check-label">No</span>
                    </label>
                  </div>
                </div>
              </div>
              {showLinks && (
                <div className="col-lg-12">
                  <div className="row">
                    <div className="col-lg-3">
                      <div className="form-group mt-2 mb-2">
                        <label htmlFor="Facebook_link">Facebook link:</label>
                        <input
                          type="text"
                          className="form-control mt-1"
                          placeholder="Enter Facebook link"
                          id="Facebook_link"
                          onChange={(e) => handleInputChange(e, "FacebookLink")}
                        />
                        {/* {formSubmitted && !formData.FacebookLink && (
                          <div style={{ color: "red" }}>
                            {"Mention Facebook Link"}
                          </div>
                        )} */}
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="form-group mt-2 mb-2">
                        <label htmlFor="Instagram_link">Instagram link:</label>
                        <input
                          type="text"
                          className="form-control mt-1"
                          placeholder="Enter Instagram link"
                          id="Instagram_link"
                          onChange={(e) =>
                            handleInputChange(e, "InstagramLink")
                          }
                        />
                        {/* {formSubmitted && !formData.InstagramLink && (
                          <div style={{ color: "red" }}>
                            {"Enter Company Activities"}
                          </div>
                        )} */}
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="form-group mt-2 mb-2">
                        <label htmlFor="LinkedIn_link">LinkedIn link:</label>
                        <input
                          type="text"
                          className="form-control mt-1"
                          placeholder="Enter LinkedIn link"
                          id="LinkedIn_link"
                          onChange={(e) => handleInputChange(e, "LinkedInLink")}
                        />
                        {/* {formSubmitted && !formData.LinkedInLink && (
                          <div style={{ color: "red" }}>
                            {"Enter Company Activities"}
                          </div>
                        )} */}
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="form-group mt-2 mb-2">
                        <label htmlFor="YouTube_link">YouTube link:</label>
                        <input
                          type="text"
                          className="form-control mt-1"
                          placeholder="Enter YouTube link"
                          id="YouTube_link"
                          onChange={(e) => handleInputChange(e, "YoutubeLink")}
                        />
                        {/* {formSubmitted && !formData.YoutubeLink && (
                          <div style={{ color: "red" }}>
                            {"Enter Company Activities"}
                          </div>
                        )} */}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="basic-info-form-head mt-4 mb-2">
              <h3>Brief About Your Business</h3>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <div className="form-group mt-2 mb-2">
                  <label htmlFor="Brief">
                    Brief Of Your Business/Product/Service (Company's
                    Activities): <span style={{ color: "red" }}>*</span>
                  </label>
                  <textarea
                    required
                    className="form-control mt-1"
                    placeholder="Brief Of Your Business"
                    id="Brief"
                    onChange={(e) => handleInputChange(e, "CompanyActivities")}
                  ></textarea>
                  {formSubmitted && !formData.CompanyActivities && (
                    <div style={{ color: "red" }}>
                      {"Enter Company Activities"}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-lg-6">
                <div className="form-group mt-2 mb-2">
                  <label htmlFor="Problems">
                    What Are The Problems That Your Product Or Service Proposes
                    To Solve And How? <span style={{ color: "red" }}>*</span>
                  </label>
                  <textarea
                    required
                    className="form-control mt-1"
                    placeholder="Brief Of Problems and Solutions"
                    id="Problems"
                    onChange={(e) => handleInputChange(e, "ProductService")}
                  ></textarea>
                  {formSubmitted && !formData.ProductService && (
                    <div style={{ color: "red" }}>
                      {"Enter Problems And Solutions"}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-lg-6">
                <div className="form-group mt-2 mb-2">
                  <label htmlFor="USP">
                    Core Strength Of Your Business Which Differs Your Company
                    From Other Business In The <br />
                    Industry (USP) <span style={{ color: "red" }}>*</span>
                  </label>
                  <textarea
                    required
                    className="form-control mt-1"
                    placeholder="USP"
                    id="USP"
                    onChange={(e) => handleInputChange(e, "CompanyUSP")}
                  ></textarea>
                  {formSubmitted && !formData.CompanyUSP && (
                    <div style={{ color: "red" }}>{"Enter Company USP"}</div>
                  )}
                </div>
              </div>
              <div className="col-lg-6">
                <div className="form-group mt-2 mb-2">
                  <label htmlFor="ValueProposition">
                    Value Proposition Of <br /> Your Project{" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <textarea
                    required
                    className="form-control mt-1"
                    placeholder="Value Proposition"
                    id="ValueProposition"
                    onChange={(e) => handleInputChange(e, "ValueProposition")}
                  ></textarea>
                  {formSubmitted && !formData.ValueProposition && (
                    <div style={{ color: "red" }}>
                      {"Enter Company Value Proposition Of Your Project"}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-lg-12">
                <hr className="mt-1 mb-1" />
              </div>
              <div className="col-lg-6">
                <div className="form-group mt-2 mb-2">
                  <label className="m-0">
                    Any Kind Of Technology Is Involved In Your Product Or
                    Service?
                  </label>
                  <div className="d-flex align-items-center">
                    <label className="form-check form-check-inline m-0 me-2">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="technologyInvolved"
                        value="yes"
                        onChange={handleRadioChanges}
                      />
                      <span className="form-check-label">Yes</span>
                    </label>
                    <label className="form-check form-check-inline m-0">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="technologyInvolved"
                        value="no"
                        onChange={handleRadioChanges}
                      />
                      <span className="form-check-label">No</span>
                    </label>
                  </div>
                </div>
              </div>
              {showTechnologyDetails && (
                <div className="col-lg-6">
                  <div className="form-group mt-2 mb-2">
                    <label className="m-0">
                      Add Details About Technology Involved
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <textarea
                      className="form-control mt-1"
                      placeholder="Technology details"
                      id="TechnologyDetails"
                      onChange={(e) =>
                        handleInputChange(e, "TechnologyInvolved")
                      }
                    ></textarea>
                    {formSubmitted && !formData.TechnologyInvolved && (
                      <div style={{ color: "red" }}>{"Enter Technology"}</div>
                    )}
                  </div>
                </div>
              )}
              <div class="col-lg-12">
                <hr class="mt-1 mb-1" />
              </div>
              <div class="col-lg-6">
                <div class="form-group mt-2 mb-2">
                  <label class="m-0">
                    {" "}
                    Do You Have Photos Of Product/Prototype Or LOGO?
                  </label>
                  <div class="d-flex align-items-center">
                    <label class="form-check form-check-inline m-0 me-2">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="Photos"
                        value="Yes"
                        onChange={handlePhotos}
                      />
                      <span class="form-check-label">Yes</span>
                    </label>
                    <label class="form-check form-check-inline m-0">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="Photos"
                        value="No"
                        onChange={handlePhotos}
                      />
                      <span class="form-check-label">No</span>
                    </label>
                  </div>
                </div>
              </div>
              {showPhotos && (
                <div class="col-lg-6">
                  <div class="form-group mt-2 mb-2">
                    <label for="Technologyinvolve">
                      Upload Photos of LOGO Or Product/Prototype{" "}
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="file"
                      class="form-control mt-1"
                      id="Photos-logos"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          UploadPhotos: e.target.files[0],
                        })
                      }
                    />
                    {formSubmitted && !formData.UploadPhotos && (
                      <div style={{ color: "red" }}>{"Upload Photos"}</div>
                    )}
                  </div>
                </div>
              )}
              <div class="col-lg-12">
                <hr class="mt-1 mb-1" />
              </div>
              <div class="col-lg-6">
                <div class="form-group mt-2 mb-2">
                  <label class="m-0">
                    {" "}
                    Any IP (Trademark/Copyright/Patent/Geographical
                    Identification) Filed?
                  </label>
                  <div class="d-flex align-items-center">
                    <label class="form-check form-check-inline m-0 me-2">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="ip"
                        value="Yes"
                        onChange={handleIp}
                      />
                      <span class="form-check-label">Yes</span>
                    </label>
                    <label class="form-check form-check-inline m-0">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="ip"
                        value="No"
                        onChange={handleIp}
                      />
                      <span class="form-check-label">No</span>
                    </label>
                  </div>
                </div>
              </div>
              {showIp && (
                <div className="col-lg-6">
                  <div className="form-group mt-2 mb-2">
                    <label htmlFor="Technologyinvolve">
                      Provide The Option to Upload the Relevant Document:
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <textarea
                      className="form-control mt-1"
                      placeholder="Any Comment"
                      id="Technologyinvolve"
                    ></textarea>
                    <input
                      type="file"
                      className="form-control mt-1"
                      id="ip"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          RelevantDocument: e.target.files[0],
                        })
                      }
                    />
                    {formSubmitted && !formData.RelevantDocument && (
                      <div style={{ color: "red" }}>{"Upload Relevant Document"}</div>
                    )}
                  </div>
                </div>
              )}
              <div class="col-lg-12">
                <hr class="mt-1 mb-1" />
              </div>
              <div class="col-lg-6">
                <div class="form-group mt-2 mb-2">
                  <label for="Competitor">
                    {" "}
                    Name Closest Direct/Indirect Competitor In The Market
                  </label>
                  <input
                    type="text"
                    class="form-control mt-1"
                    placeholder="Closest Direct/Indirect Competitor In The Market"
                    id="Competitor"
                    onChange={(e) =>
                      handleInputChange(e, "DirectInDirectMarket")
                    }
                  />
                  {formSubmitted && !formData.DirectInDirectMarket && (
                    <div style={{ color: "red" }}></div>
                  )}
                </div>
              </div>
              <div class="col-lg-6">
                <div class="form-group mt-2 mb-2">
                  <label class="m-0"> Select Your Business Model</label>
                  <div class="d-flex align-items-center mt-2">
                    <label
                      class="form-check form-check-inline m-0 me-2"
                      onChange={(e) => handleInputChange(e, "BusinessModel")}
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        name="ip"
                        value="B2B"
                        onChange={(e) => handleInputChange(e, "BusinessModel")}
                      />
                      <span class="form-check-label">B2B</span>
                    </label>
                    <label class="form-check form-check-inline m-0 me-2">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        name="ip"
                        value="B2C"
                        onChange={(e) => handleInputChange(e, "BusinessModel")}
                      />
                      <span class="form-check-label">B2C</span>
                    </label>
                    <label class="form-check form-check-inline m-0 me-2">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        name="ip"
                        value="B2G"
                        onChange={(e) => handleInputChange(e, "BusinessModel")}
                      />
                      <span class="form-check-label">B2G</span>
                    </label>
                    <label class="form-check form-check-inline m-0 me-2">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        name="ip"
                        value="D2C"
                        onChange={(e) => handleInputChange(e, "BusinessModel")}
                      />
                      <span class="form-check-label">D2C</span>
                    </label>
                    <label class="form-check form-check-inline m-0 me-2">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        name="ip"
                        value="C2C"
                        onChange={(e) => handleInputChange(e, "BusinessModel")}
                      />
                      <span class="form-check-label">C2C</span>
                    </label>
                    {formSubmitted && !formData.BusinessModel && (
                      <div style={{ color: "red" }}></div>
                    )}
                  </div>
                </div>
              </div>
              <div class="col-lg-12">
                <hr class="mt-1 mb-1" />
              </div>
              <div class="col-lg-6">
                <div class="form-group mt-2 mb-2">
                  <label class="m-0">
                    Have You Raised Any Financing Thus Far <br />
                    (Grants, Loans, Investments, Friends And Family, Etc.)
                  </label>
                  <div class="d-flex align-items-center">
                    <label class="form-check form-check-inline m-0 me-2">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="Raised"
                        value="yes"
                        onChange={handleFinance}
                      />
                      <span class="form-check-label">Yes</span>
                    </label>
                    <label class="form-check form-check-inline m-0">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="Raised"
                        value="No"
                        onChange={handleFinance}
                      />
                      <span class="form-check-label">No</span>
                    </label>
                  </div>
                </div>
              </div>
              {showFinance && (
                <div class="col-lg-6">
                  <div class="form-group mt-2 mb-2">
                    <label for="grants">
                      Provide The Option to Mentioned The Same and Explain
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <textarea
                      class="form-control mt-1"
                      placeholder="grants, loans, investments, friends and family, etc"
                      id="grants"
                      onChange={(e) => handleInputChange(e, "Finance")}
                    ></textarea>
                    {formSubmitted && !formData.Finance && (
                      <div style={{ color: "red" }}>{"Enter details about Finance"}</div>
                    )}
                  </div>
                </div>
              )}
              <div class="col-lg-12">
                <hr class="mt-1 mb-1" />
              </div>
            </div>

            <div class="basic-info-form-head mt-4 mb-2">
              {/* <h3>Directors And Team Details</h3> */}
            </div>

            <div className="row">
              <div className="col-lg-12">
                <div className="form-group d-flex align-items-center mt-2 mb-2">
                  <label className="m-0" htmlFor="DirectorsNO">
                    How Many Directors/Partners Are There?
                  </label>
                  <select
                    className="form-select mt-1 ms-2"
                    id="DirectorsNO"
                    style={{ width: "70px" }}
                    onChange={handleDirectorsChange}
                    value={numberOfDirectors}
                  >
                    {Array.from({ length: 6 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {renderDirectorFields()}
            </div>
            <div className="d-flex justify-content-end">
              <button
                type="submit"
                onClick={handleSubmit}
                className="btn btn-md btn-primary mt-4"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
        {formSubmitted && formData.BusinessModel && (
          <div className="mt-4">
            {getEmailContent()}
          </div>
        )}
      </div>
    </div>
  );
};

export default BasicForm;
