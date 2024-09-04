import React, { useState, useEffect } from 'react';
import { IoArrowBackSharp } from "react-icons/io5";
import { GrFormNext } from "react-icons/gr";
import pdfimg from "../../static/my-images/pdf.png";
import { FaWhatsapp } from "react-icons/fa";
import axios from 'axios';
import EmpDfaullt from "../../static/EmployeeImg/office-man.png"
import FemaleEmployee from "../../static/EmployeeImg/woman.png";

function EmployeeAssetDetails({ serviceName, departmentName, back }) {

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

  // const fetchService = async () => {
  //   try {
  //     const res = await axios.get(`${secretKey}/services/fetchServiceFromServiceName/${serviceName}`);
  //     const res2 = await axios.get(`${secretKey}/department/fetchService/${serviceName}`)
  //     console.log("Fetched service is :", res.data.data);
  //     console.log("Service description is :", res2.data.data.serviceDescription);
  //     setService(res.data.data);
  //     setServiceDescription(res2.data.data.serviceDescription);
  //     fetchEmployees();
  //   } catch (error) {
  //     console.log("Error fetching service :", error);
  //   }
  // };

  const fetchService = async () => {
    try {
      const encodedServiceName = encodeURIComponent(serviceName); // Encode the service name to handle special characters like /
      
      const res = await axios.get(`${secretKey}/services/fetchServiceFromServiceName/${encodedServiceName}`);
      const res2 = await axios.get(`${secretKey}/department/fetchService/${encodedServiceName}`);
      
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
            <div className='d-flex align-items-center justify-content-between'>
              <div>
                <div className='emply_S_assets_dtl_head_brdcrm mt-3'>
                  <span>Services</span> <span><GrFormNext /></span> <span><b>Services Details & Assets</b></span>
                </div>
                <div className='emply_S_assets_dtl_head_sname mt-1'>
                  {serviceName}
                </div>
              </div>
              <div className='emply_S_assets_dtl_head_back'>
                <button className='btn_style_1 btn_style_1_primary' onClick={() => {
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
                      {service?.objectives?.length !== 0 && <li class="nav-item">
                        <a class="nav-link active" data-bs-toggle="tab" href="#Objective">Objective</a>
                      </li>}
                      {service?.benefits?.length !== 0 && <li class="nav-item">
                        <a class="nav-link" data-bs-toggle="tab" href="#Benefits">Benefits</a>
                      </li>}
                      {service?.requiredDocuments?.length !== 0 && <li class="nav-item">
                        <a class="nav-link" data-bs-toggle="tab" href="#Documents">Required Documents</a>
                      </li>}
                      {service?.eligibilityRequirements?.length !== 0 && <li class="nav-item">
                        <a class="nav-link" data-bs-toggle="tab" href="#Eligibility">Eligibility Requirements</a>
                      </li>}
                      {service?.process?.length !== 0 && <li class="nav-item">
                        <a class="nav-link" data-bs-toggle="tab" href="#Process">Process</a>
                      </li>}
                      {service?.deliverables?.length !== 0 && <li class="nav-item">
                        <a class="nav-link" data-bs-toggle="tab" href="#Deliverables">Deliverables</a>
                      </li>}
                      {service?.timeline?.length !== 0 && <li class="nav-item">
                        <a class="nav-link" data-bs-toggle="tab" href="#Timeline">Timeline</a>
                      </li>}
                    </ul>

                    <div class="tab-content">

                      <div class="tab-pane ES_assetsdtl_Linner active" id="Objective">
                        <div className='ES_assetsdtl_Linner_h'>
                          <h2 className='m-0'>Objective:</h2>
                        </div>
                        <div className='ES_assetsdtl_Linner_p'>
                          {service?.objectives
                            ? <div dangerouslySetInnerHTML={{ __html: service.objectives }} />
                            : "-"
                          }
                        </div>
                      </div>

                      <div class="tab-pane ES_assetsdtl_Linner fade" id="Benefits">
                        <div className='ES_assetsdtl_Linner_h'>
                          <h2 className='m-0'>Benefits:</h2>
                        </div>
                        <div className='ES_assetsdtl_Linner_p'>
                          {service?.benefits
                            ? <div dangerouslySetInnerHTML={{ __html: service.benefits }} />
                            : "-"
                          }
                        </div>
                      </div>

                      <div class="tab-pane ES_assetsdtl_Linner fade" id="Documents">
                        <div className='ES_assetsdtl_Linner_h'>
                          <h2 className='m-0'>Required Documents:</h2>
                          <div className='ES_assetsdtl_Linner_p'>
                            {service?.requiredDocuments
                              ? <div dangerouslySetInnerHTML={{ __html: service.requiredDocuments }} />
                              : "-"
                            }
                          </div>
                        </div>
                      </div>

                      <div class="tab-pane ES_assetsdtl_Linner fade" id="Eligibility">
                        <div className='ES_assetsdtl_Linner_h'>
                          <h2 className='m-0'>Eligibility Requirements:</h2>
                        </div>
                        <div className='ES_assetsdtl_Linner_p'>
                          {service?.eligibilityRequirements
                            ? <div dangerouslySetInnerHTML={{ __html: service.eligibilityRequirements }} />
                            : "-"
                          }
                        </div>
                      </div>

                      <div class="tab-pane ES_assetsdtl_Linner fade" id="Process">
                        <div className='ES_assetsdtl_Linner_h'>
                          <h2 className='m-0'>Application Process:</h2>
                        </div>
                        <div className='ES_assetsdtl_Linner_p'>
                          {service?.process
                            ? <div dangerouslySetInnerHTML={{ __html: service.process }} />
                            : "-"
                          }
                        </div>
                      </div>

                      <div class="tab-pane ES_assetsdtl_Linner fade" id="Deliverables">
                        <div className='ES_assetsdtl_Linner_h'>
                          <h2 className='m-0'>What You Will Receive from Start-Up Sahay</h2>
                        </div>
                        <div className='ES_assetsdtl_Linner_p'>
                          {service?.deliverables
                            ? <div dangerouslySetInnerHTML={{ __html: service.deliverables }} />
                            : "-"
                          }
                        </div>
                      </div>

                      <div class="tab-pane ES_assetsdtl_Linner fade" id="Timeline">
                        <div className='ES_assetsdtl_Linner_h'>
                          <h2 className='m-0'>Timeline:</h2>
                        </div>
                        <div className='ES_assetsdtl_Linner_p'>
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
                    <h3 className='m-0 esadir_docs_depart'>Service Category</h3>
                    <div className='esadir_docs_depart_name'>
                      {departmentName}
                    </div>
                  </div>

                  {(employeeNames?.length > 0 || headNames?.length > 0) &&
                    <>
                      <div className='esadir_docs bdr-btm-eee'>
                        <h3 className='m-0 esadir_docs_depart'>Concerned Team </h3>


                        {employeeNames?.length > 0 &&
                          <div className='esadir_docs_depart_name mt-2' >
                            <h4 className='m-0'>For sales and marketing related</h4>
                            <div className='ConcerneddepartPerson mt-1'>

                              {employeeNames.length > 0 ? (
                                employeeNames.map((employee, index) => (
                                  <div key={index} className="ConcerneddepartPerson mt-1">
                                    <div className='d-flex'>
                                      <img src={employee.profilePhoto?.length !== 0
                                        ? `${secretKey}/employee/fetchProfilePhoto/${employee._id}/${employee.profilePhoto?.[0]?.filename}`
                                        : employee.gender === "Male" ? EmpDfaullt : FemaleEmployee} alt="profile" style={{ height: "35px", width: "35px", borderRadius: "50%" }} />
                                      <p className="ms-2 mt-2">{employee.ename}</p>
                                    </div>
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
                          </div>}

                        {headNames?.length > 0 &&
                          <div className='esadir_docs_depart_name mt-2' >
                            <h4 className='m-0'>For Backend Process Related</h4>
                            <div className='ConcerneddepartPerson mt-1'>

                              {headNames.length > 0 ? (
                                headNames.map((head, index) => (
                                  <div key={index} className="ConcerneddepartPerson mt-1">
                                    <div className='d-flex'>
                                      <img src={head.profilePhoto?.length !== 0
                                        ? `${secretKey}/employee/fetchProfilePhoto/${head._id}/${head.profilePhoto?.[0]?.filename}`
                                        : head.gender === "Male" ? EmpDfaullt : FemaleEmployee} alt="profile" style={{ height: "35px", width: "35px", borderRadius: "50%" }} />
                                      <p className="ms-2 mt-2">{head.ename}</p>
                                    </div>
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
                            </div>
                          </div>}
                      </div>
                    </>
                  }

                  {service?.portfolio?.length > 0 &&
                    <div className='esadir_docs bdr-btm-eee'>
                      <h3 className='m-0 esadir_docs_depart'>Portfolio</h3>
                      <div className='esadir_docs_depart_name'>
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
                  }

                  {service?.documents?.length > 0 &&
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
                      </div>
                    </div>
                  }

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