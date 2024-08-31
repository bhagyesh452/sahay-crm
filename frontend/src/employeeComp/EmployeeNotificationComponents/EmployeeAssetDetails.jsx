import React, { useState, useEffect } from 'react';
import { IoArrowBackSharp } from "react-icons/io5";
import { GrFormNext } from "react-icons/gr";
import pdfimg from "../../static/my-images/pdf.png";
import { FaWhatsapp } from "react-icons/fa";
import axios from 'axios';


function EmployeeAssetDetails({ DetailsPage, serviceName, departmentName, back }) {

  const secretKey = process.env.REACT_APP_SECRET_KEY;

  const [service, setService] = useState({});
  const [serviceDescription, setServiceDescription] = useState("");
  const [employees, setEmployees] = useState([]);
  const [employeeNames, setEmployeeNames] = useState([]);
  const [headNames, setHeadNames] = useState([]);
  const [empName, setEmpName] = useState([]);
  const [designation, setDesignation] = useState([]);
  const [branchOffice, setBranchOffice] = useState([]);
  const [officialNo, setOfficialNo] = useState([]);

  const fetchService = async () => {
    try {
      const res = await axios.get(`${secretKey}/services/fetchServiceFromServiceName/${serviceName}`);
      const res2 = await axios.get(`${secretKey}/department/fetchService/${serviceName}`)
      console.log("Fetched service is :", res.data.data);
      console.log("Service description is :", res2.data.data.serviceDescription);
      setService(res.data.data);
      setServiceDescription(res2.data.data.serviceDescription);
      fetchEmployees();
    } catch (error) {
      console.log("Error fetching service :", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${secretKey}/employee/einfo`);
      const data = res.data;
      // console.log("Employees data:", data);
      setEmployees(data); // Save fetched employees in the state
    } catch (error) {
      console.log("Error fetching employees", error);
    }
  };

  const findEmployeeDetails = () => {
    // Find employees in employeeNames
    const foundEmployees = employees.filter((employee) =>
      service?.concernTeam.employeeNames.includes(employee.empFullName)
    );

    // Find heads in headNames
    const foundHeads = employees.filter((employee) =>
      service?.concernTeam.headNames.includes(employee.empFullName)
    );

    // Set state for employees
    if (foundEmployees.length > 0) {
      // console.log("Found employees are in if condition :", foundEmployees);
      setEmpName(foundEmployees.map((emp) => emp.empFullName).join(", "));
      setDesignation(foundEmployees.map((emp) => emp.newDesignation).join(", "));
      setBranchOffice(foundEmployees.map((emp) => emp.branchOffice).join(", "));
      setOfficialNo(foundEmployees.map((emp) => emp.number).join(", "));
    }

    if (foundHeads.length > 0) {
      // console.log("Found heads are in if condition :", headNames);
      setEmpName(foundHeads.map((emp) => emp.empFullName).join(", "));
      setDesignation(foundHeads.map((emp) => emp.newDesignation).join(", "));
      setBranchOffice(foundHeads.map((emp) => emp.branchOffice).join(", "));
      setOfficialNo(foundHeads.map((emp) => emp.number).join(", "));
    }

    setEmployeeNames(foundEmployees);
    setHeadNames(foundHeads);
  };

  const openDocument = (filename) => {
    const id = service._id; // Assuming service contains the ID of the current service
    const url = `${secretKey}/services/fetchDocuments/${id}/${filename}`;
    window.open(url, "_blank"); // Open document in a new tab
  };

  useEffect(() => {
    fetchService();
  }, []);

  // Filter employee details after fetching data
  useEffect(() => {
    if (employees.length > 0) {
      findEmployeeDetails();
    }
  }, [employees]);

  return (
    <div className='page-wrapper'>
      <div className='services_assets_dtl_main'>

        <div className='emply_S_assets_dtl'>
          <div className='container-xl'>
            <div className='emply_S_assets_dtl_head_back'>
              <button className='btn_style_1 btn_style_1_primary' onClick={() => {
                DetailsPage(false);
                back();
              }}>
                <div className='d-flex align-items-center justify-content-center'>
                  <div style={{ lineHeight: '10px', marginRight: '6px' }}>
                    <IoArrowBackSharp />
                  </div>
                  <div style={{ lineHeight: '10px' }}>
                    Back
                  </div>
                </div>
              </button>
            </div>
            <div className='emply_S_assets_dtl_head_brdcrm mt-3'>
              <span>Services</span> <span><GrFormNext /></span> <span><b>Services Details & Assets</b></span>
            </div>
            <div className='emply_S_assets_dtl_head_sname mt-1'>
              {serviceName}
            </div>
            <div className='emply_S_assets_dtl_head_tagline'>
              {serviceDescription}
            </div>
          </div>
        </div>
        <div className='emply_S_assets_dtl_bg'>
        </div>
      </div>
      <div className='container-xl' style={{ zIndex: '2' }}>
        <div className='emply_S_assets_dtl_inner'>
          <div className='my-card' style={{ height: '400px', background: '#fff', borderRadius: '20px' }}>
            <div className='row m-0 p-0'>
              <div className='col-lg-9 p-0'>
                <div className='emply_S_assets_dtl_inner_left'>
                  <div>
                    <ul class="nav nav-tabs">
                      <li class="nav-item">
                        <a class="nav-link active" data-bs-toggle="tab" href="#Objective">Objective</a>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link" data-bs-toggle="tab" href="#Benefits">Benefits</a>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link" data-bs-toggle="tab" href="#Documents">Required Documents</a>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link" data-bs-toggle="tab" href="#Eligibility">Eligibility Requirements</a>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link" data-bs-toggle="tab" href="#Process">Process</a>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link" data-bs-toggle="tab" href="#Deliverables">Deliverables</a>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link" data-bs-toggle="tab" href="#Timeline">Timeline</a>
                      </li>
                    </ul>

                    <div class="tab-content">

                      <div class="tab-pane active" id="Objective">
                        <div className='ES_assetsdtl_Linner_h'>
                          <h2 className='m-0'>Objective:</h2>
                        </div>
                        <div className='ES_assetsdtl_Linner_p'>
                          {/* <p>Private Limited Company is a popular business structure in India, offering limited liability to its shareholders and a separate legal entity status, making it suitable for medium to large-sized businesses and startups.</p> */}
                          {service?.objectives
                            ? <div dangerouslySetInnerHTML={{ __html: service.objectives }} />
                            : "-"
                          }
                        </div>
                      </div>

                      <div class="tab-pane fade" id="Benefits">
                        <div className='ES_assetsdtl_Linner_h'>
                          <h2 className='m-0'>Benefits:</h2>
                        </div>
                        <div className='ES_assetsdtl_Linner_p'>
                          {/* <ul>
                            <li><span><b>Limited Liability :</b></span> Shareholders’ personal assets are protected; they are liable only to the extent of their share capital.</li>
                            <li><span><b>Separate Legal Entity : </b></span> The company has its own legal identity, separate from its owners, allowing it to own property, incur debt, and enter contracts.</li>
                            <li><span><b>Ease of Fundraising :  </b></span> Easier access to funding through equity, bank loans, and other financial instruments.</li>
                            <li><span><b>Credibility :  </b></span> : A Private Limited Company is highly regarded by clients, suppliers, and financial institutions, enhancing business credibility.</li>
                            <li><span><b>Perpetual Succession :  </b></span> :The company continues to exist even if the ownership or management changes.</li>
                          </ul> */}
                          {service?.benefits
                            ? <div dangerouslySetInnerHTML={{ __html: service.benefits }} />
                            : "-"
                          }
                        </div>
                      </div>

                      <div class="tab-pane fade" id="Documents">
                        <div className='ES_assetsdtl_Linner_h'>
                          <h2 className='m-0'>Required Documents:</h2>
                          <div className='ES_assetsdtl_Linner_p'>
                            {/* <ul>
                              <li>Directors' ID Proof (Aadhaar, PAN Card And Voter Id Card or Passport)</li>
                              <li>
                                Director’s Latest Bank Statements (1Month)
                              </li>
                              <li>
                                Directors' Passport-sized photos
                              </li>
                              <li>
                                Address Proof (Ligh Bill, Gas Bill or Landline Bill - Any One)
                              </li>
                              <li>
                                No Objection Certificate (NOC) from the property owner (for the registered office) – NOC draft Will Be Provided By Start-Up Sahay.
                              </li>
                            </ul> */}
                            {service?.requiredDocuments
                              ? <div dangerouslySetInnerHTML={{ __html: service.requiredDocuments }} />
                              : "-"
                            }
                          </div>
                        </div>
                      </div>

                      <div class="tab-pane fade" id="Eligibility">
                        <div className='ES_assetsdtl_Linner_h'>
                          <h2 className='m-0'>Eligibility Requirements:</h2>
                        </div>
                        <div className='ES_assetsdtl_Linner_p'>
                          {/* <ul>
                            <li><span><b>Number of Directors :</b></span> Shareholders’ personal assets are protected; they are liable only to the extent of their share capital.</li>
                            <li><span><b>Number of Shareholders :</b></span> The company has its own legal identity, separate from its owners, allowing it to own property, incur debt, and enter contracts.</li>
                            <li><span><b>Authorized Capital :   </b></span> Easier access to funding through equity, bank loans, and other financial instruments.</li>
                            <li><span><b>Registered Office Address :</b></span> : A Private Limited Company is highly regarded by clients, suppliers, and financial institutions, enhancing business credibility.</li>
                          </ul> */}
                          {service?.eligibilityRequirements
                            ? <div dangerouslySetInnerHTML={{ __html: service.eligibilityRequirements }} />
                            : "-"
                          }
                        </div>
                      </div>

                      <div class="tab-pane fade" id="Process">
                        <div className='ES_assetsdtl_Linner_h'>
                          <h2 className='m-0'>Application Process:</h2>
                        </div>
                        <div className='ES_assetsdtl_Linner_p'>
                          {/* <ul>
                            <li><span><b>1.	Obtain DSC & DIN :</b></span> Apply for the Digital Signature Certificate (DSC) and Director Identification Number (DIN) for the proposed directors.</li>
                            <li><span><b>2.	Name Reservation :</b></span> Choose a unique name for the company and get it approved by the Ministry of Corporate Affairs (MCA).</li>
                            <li><span><b>3.	Incorporation Filing :   </b></span> Submit the incorporation form (SPICe) with the required documents to the MCA.</li>
                            <li><span><b>4.	MOA & AOA Drafting :</b></span> : Draft and file the MOA & AOA defining the company’s objectives and rules.</li>
                            <li><span><b>5.	Certificate of Incorporation :</b></span> :Once approved, the company receives a Certificate of Incorporation from the Registrar of Companies (RoC), along with a Corporate Identification Number (CIN).</li>
                          </ul> */}
                          {service?.process
                            ? <div dangerouslySetInnerHTML={{ __html: service.process }} />
                            : "-"
                          }
                        </div>
                      </div>

                      <div class="tab-pane fade" id="Deliverables">
                        <div className='ES_assetsdtl_Linner_h'>
                          <h2 className='m-0'>What You Will Receive from Start-Up Sahay</h2>
                        </div>
                        <div className='ES_assetsdtl_Linner_p'>
                          {/* <p>When you choose Start-Up Sahay for your Private Limited Company registration, you will receive the following:</p>
                          <ul>
                            <li><span><b>1.	Certificate of Incorporation :</b></span>
                              Legal certificate confirming the company’s formation.
                            </li>
                            <li><span><b>2.	Articles of Association (AOA) :</b></span>
                              Rules and regulations for company management.
                            </li>
                            <li><span><b>3. Digital Signature Certificate (DSC):  </b></span>
                              For both directors
                            </li>
                            <li><span><b>4.	Company PAN :</b></span> Permanent Account Number for tax purposes.</li>
                            <li><span><b>5.	Company TAN:</b></span> Tax Deduction and Collection Account Number.</li>
                            <li><span><b>6.	Udyam/MSME Certificate:</b></span>Registration under Micro, Small & Medium Enterprises (if applicable).</li>
                          </ul> */}
                          {service?.deliverables
                            ? <div dangerouslySetInnerHTML={{ __html: service.deliverables }} />
                            : "-"
                          }
                        </div>
                      </div>

                      <div class="tab-pane fade" id="Timeline">
                        <div className='ES_assetsdtl_Linner_h'>
                          <h2 className='m-0'>Timeline:</h2>
                        </div>
                        <div className='ES_assetsdtl_Linner_p'>
                          {/* <p>Typically takes 10-15 working days for the complete process.</p> */}
                          {service?.timeline
                            ? <div dangerouslySetInnerHTML={{ __html: service.timeline }} />
                            : "-"
                          }
                        </div>
                      </div>

                    </div>
                  </div>

                  <div className='lbg'></div>
                </div>
              </div>

              <div className='col-lg-3 p-0'>
                <div className='emply_S_assets_dtl_inner_right'>
                  <div className='esadir_docs bdr-btm-eee' >
                    <h3 className='m-0 esadir_docs_depart'>Department</h3>
                    <div className='esadir_docs_depart_name'>
                      {departmentName}
                    </div>
                  </div>

                  <div className='esadir_docs bdr-btm-eee'>
                    <h3 className='m-0 esadir_docs_depart'>Concerned Team </h3>

                    <div className='esadir_docs_depart_name mt-2' >
                      <h4 className='m-0'>For sales and marketing related</h4>
                      <div className='ConcerneddepartPerson mt-1'>

                        {employeeNames.length > 0 ? (
                          employeeNames.map((employee, index) => (
                            <div key={index} className="ConcerneddepartPerson mt-1">
                              <p>{employee.ename}</p>
                              <div className="d-flex align-items-center justify-content-between">
                                <label>
                                  {employee.newDesignation === "Business Development Executive" && "BDE" ||
                                    employee.newDesignation === "Business Development Manager" && "BDM" ||
                                    employee.newDesignation},{" "}
                                  {employee.branchOffice === "Sindhu Bhawan" && "SBR" || employee.branchOffice} Branch
                                </label>
                                <label className="d-flex align-items-center justify-content-between">
                                  <div className="mr-1">
                                    <a
                                      target="_blank"
                                      className="text-decoration-none text-dark"
                                      href={`https://wa.me/91${employee.number}`}
                                    >
                                      {employee.number}
                                    </a>
                                  </div>
                                  <div className="wp-icon">
                                    <FaWhatsapp />
                                  </div>
                                </label>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p>No concerned employees found.</p>
                        )}
                      </div>

                      {/* <div className='ConcerneddepartPerson mt-1'>
                        <p>Vaibhav Acharya</p>
                        <div className='d-flex align-items-center justify-content-between'>
                          <label>Floor Manager, Gota Branch</label>
                          <label className='d-flex align-items-center justify-content-between'>
                            <div className='mr-1'>
                              9924283530
                            </div>
                            <div className='wp-icon'>
                              <FaWhatsapp />
                            </div>
                          </label>
                        </div>
                      </div>
                      <div className='ConcerneddepartPerson mt-1'>
                        <p>Vishal Gohel</p>
                        <div className='d-flex align-items-center justify-content-between'>
                          <label>Floor Manager, SBR Branch</label>
                          <label className='d-flex align-items-center justify-content-between'>
                            <div className='mr-1'>
                              9924283530
                            </div>
                            <div className='wp-icon'>
                              <FaWhatsapp />
                            </div>
                          </label>
                        </div>
                      </div> */}
                    </div>

                    <div className='esadir_docs_depart_name mt-2' >
                      <h4 className='m-0'>For Backend Process Related</h4>
                      <div className='ConcerneddepartPerson mt-1'>

                        {headNames.length > 0 ? (
                          headNames.map((head, index) => (
                            <div key={index} className="ConcerneddepartPerson mt-1">
                              <p>{head.ename}</p>
                              <div className="d-flex align-items-center justify-content-between">
                                <label>
                                  <label>
                                    {head.newDesignation === "Business Development Executive" && "BDE" ||
                                      head.newDesignation === "Business Development Manager" && "BDM" ||
                                      head.newDesignation},{" "}
                                    {head.branchOffice === "Sindhu Bhawan" && "SBR" || head.branchOffice} Branch
                                  </label>
                                </label>
                                <label className="d-flex align-items-center justify-content-between">
                                  <div className="mr-1">
                                    <a
                                      target="_blank"
                                      className="text-decoration-none text-dark"
                                      href={`https://wa.me/91${head.number}`}
                                    >
                                      {head.number}
                                    </a>
                                  </div>
                                  <div className="wp-icon">
                                    <FaWhatsapp />
                                  </div>
                                </label>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p>No concerned employees found.</p>
                        )}
                        {/* <p>RonakKumar</p>
                        <div className='d-flex align-items-center justify-content-between'>
                          <label>MD</label>
                          <label className='d-flex align-items-center justify-content-between'>
                            <div className='mr-1'>
                              9924283530
                            </div>
                            <div className='wp-icon'>
                              <FaWhatsapp />
                            </div>
                          </label>
                        </div> */}
                      </div>
                    </div>
                  </div>

                  <div className='esadir_docs bdr-btm-eee'>
                    <h3 className='m-0 esadir_docs_depart'>Portfolio</h3>
                    <div className='esadir_docs_depart_name'>
                      {/* <a className='link_wrap'>https://drive.google.com/drive/u/1/folders/1XJlCdsbgw_2_7gwT6EKANPxPZ5MN9Kbg</a>, */}
                      {service?.portfolio?.map((portfolio, index) => {
                        return <div key={index}>
                          <a className='link_wrap'
                            target="_blank"
                            href={portfolio}
                            rel="noopener noreferrer"
                          >
                            {portfolio}
                          </a>
                        </div>
                      })}
                    </div>
                  </div>

                  <div className='esadir_docs '>
                    <h3>Documents</h3>
                    <div className='row'>
                      {service?.documents?.map((doc, index) => {
                        // Extract the file extension
                        const fileExtension = doc.filename.split('.').pop().toLowerCase();

                        // Check if the file is an image (jpg, jpeg, png)
                        const isImage = ['jpg', 'jpeg', 'png'].includes(fileExtension);

                        return (
                          <div className='col' key={index}>
                            <div className="booking-docs-preview" onClick={() => openDocument(doc.filename)}>
                              <div className="booking-docs-preview-img">
                                {isImage ? (
                                  <img src={`${secretKey}/services/fetchDocuments/${service._id}/${doc.filename}`} alt={doc.originalname} />
                                ) : (
                                  <img src={pdfimg} alt="Document Preview" />
                                )}
                              </div>
                              <div className="booking-docs-preview-text">
                                <p className="booking-img-name-txtwrap text-wrap m-auto m-0 text-wrap m-auto m-0">
                                  {doc.originalname}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}


                      {/* <div className='col'>
                        <div className="booking-docs-preview">
                          <div className="booking-docs-preview-img" >
                            <img src={pdfimg}   ></img>
                          </div>
                          <div className="booking-docs-preview-text">
                            <p className="booking-img-name-txtwrap text-wrap m-auto m-0 text-wrap m-auto m-0">
                              hi
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className='col'>
                        <div className="booking-docs-preview">
                          <div className="booking-docs-preview-img" >
                            <img src={pdfimg}   ></img>
                          </div>
                          <div className="booking-docs-preview-text">
                            <p className="booking-img-name-txtwrap text-wrap m-auto m-0 text-wrap m-auto m-0">
                              hi
                            </p>
                          </div>
                        </div>
                      </div> */}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    // <div className='d-flex align-items-center justify-content-between'>
    //     EmployeeAssetDetails
    //     <button className='mr-2' onClick={()=>{
    //         DetailsPage(false)
    //     }}>
    //         Back
    //     </button>
    // </div>
  )
}

export default EmployeeAssetDetails