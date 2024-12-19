import React, { useState, useEffect, useRef } from 'react';
import { IoArrowBackSharp } from "react-icons/io5";
import { GrFormNext } from "react-icons/gr";
import pdfimg from "../static/my-images/pdf.png";
import { FaWhatsapp } from "react-icons/fa";
import { FaChevronLeft } from 'react-icons/fa';
import { FaChevronRight } from 'react-icons/fa';
import axios from 'axios';
import EmpDfaullt from "../static/EmployeeImg/office-man.png"
import FemaleEmployee from "../static/EmployeeImg/woman.png";

function EmployeeAssetDetails({ serviceName, departmentName, back, serviceId }) {

    const secretKey = process.env.REACT_APP_SECRET_KEY;

    const [service, setService] = useState({});
    // const [serviceDescription, setServiceDescription] = useState("");
    const [employees, setEmployees] = useState([]);
    const [salesemployeeNames, setSalesEmployeeNames] = useState([]);
    const [backendemployeeNames, setBackendEmployeeName] = useState([]);
    const [empName, setEmpName] = useState([]);
    const [designation, setDesignation] = useState([]);
    const [branchOffice, setBranchOffice] = useState([]);
    const [officialNo, setOfficialNo] = useState([]);

    const fetchService = async () => {
        try {
            const res = await axios.get(`${secretKey}/service/getspecificservice/${serviceId}`);
            console.log("res emp--->", res.data.service)
            setService(res.data.service);
            fetchEmployees();
        } catch (error) {
            console.log("Error fetching service :", error);
        }
    };


    const fetchEmployees = async () => {
        try {
            const res = await axios.get(`${secretKey}/employee/einfo`);
            const data = res.data;
            console.log("Employees data:", data);
            setEmployees(data); // Save fetched employees in the state
        } catch (error) {
            console.log("Error fetching employees", error);
        }
    };

    const findEmployeeDetails = () => {

        // Find Sales & Marketing team employee from employee
        const foundEmployeesSales = employees.filter((employee) =>
            service?.teamInfo?.salesMarketingPersons?.some((person) =>
                person.trim().toLowerCase() === employee.empFullName.trim().toLowerCase()
            )
        );

        console.log("foundEmployeesSales", foundEmployeesSales);


        // Find backend team employee from employee
        const foundEmployeesBackend = employees.filter((employee) =>
            service?.teamInfo?.backendPersons?.some((person) =>
                person.trim().toLowerCase() === employee.empFullName.trim().toLowerCase()
            )
        );

        console.log("foundEmployeesBackend", foundEmployeesBackend);


        // // Set state for employees
        if (foundEmployeesSales.length > 0) {
            // console.log("Found employees are in if condition :", foundEmployees);
            setEmpName(foundEmployeesSales.map((emp) => emp.empFullName).join(", "));
            setDesignation(foundEmployeesSales.map((emp) => emp.newDesignation).join(", "));
            setBranchOffice(foundEmployeesSales.map((emp) => emp.branchOffice).join(", "));
            setOfficialNo(foundEmployeesSales.map((emp) => emp.number).join(", "));
        }

        if (foundEmployeesBackend.length > 0) {
            // console.log("Found heads are in if condition :", headNames);
            setEmpName(foundEmployeesBackend.map((emp) => emp.empFullName).join(", "));
            setDesignation(foundEmployeesBackend.map((emp) => emp.newDesignation).join(", "));
            setBranchOffice(foundEmployeesBackend.map((emp) => emp.branchOffice).join(", "));
            setOfficialNo(foundEmployeesBackend.map((emp) => emp.number).join(", "));
        }

        setSalesEmployeeNames(foundEmployeesSales);
        setBackendEmployeeName(foundEmployeesBackend);
    };

    // const openDocument = (filename) => {
    //     const id = service._id; // Assuming service contains the ID of the current service
    //     const url = `${secretKey}/services/fetchDocuments/${id}/${filename}`;
    //     window.open(url, "_blank"); // Open document in a new tab
    // };


    // const openDocument = (id, filename) => {
    //     const url = `${secretKey}/service/fetchServiceDocuments/${id}/${filename}`;
    //     window.open(url, "_blank");
    // };


    useEffect(() => {
        fetchService();
    }, []);

    // Filter employee details after fetching data
    useEffect(() => {
        if (employees.length > 0) {
            findEmployeeDetails();
        }
    }, [employees]);




    const openDocumentInNewTab = (id, filename) => {
        const url = `${secretKey}/service/fetchServiceDocuments/${id}/${filename}`;

        // Extract the file extension to determine its type
        const fileExtension = filename.split(".").pop().toLowerCase();

        // Open the document in a new tab based on file type
        if (fileExtension === "docx" || fileExtension === "xlsx") {
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;  // This will prompt a download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            // For other file types, directly open in the browser
            window.open(url, "_blank");
        }

        // if (fileExtension === "docx"){
        //     fetch(url)
        //     .then((response) => response.arrayBuffer())
        //     .then((buffer) => {
        //         // Convert DOCX to HTML using Mammoth.js
        //         mammoth.convertToHtml({ arrayBuffer: buffer }).then((result) => {
        //             const newWindow = window.open("", "_blank");
        //             newWindow.document.write(result.value);  // Display the HTML in the new tab
        //             newWindow.document.close();
        //         });
        //     })
        //     .catch((error) => {
        //         console.error("Error loading document", error);
        //     });
        // }
        // else if(fileExtension === "xlsx") {
        //     fetch(url)
        // .then((response) => response.arrayBuffer())
        // .then((buffer) => {
        //     // Read the XLSX file using SheetJS
        //     const workbook = XLSX.read(buffer, { type: 'array' });

        //     // Convert the first sheet to HTML table
        //     const html = XLSX.utils.sheet_to_html(workbook.Sheets[workbook.SheetNames[0]]);

        //     const newWindow = window.open("", "_blank");
        //     newWindow.document.write(html);  // Display the HTML table in the new tab
        //     newWindow.document.close();
        // })
        // .catch((error) => {
        //     console.error("Error loading document", error);
        // });
        // } else {
        //     // For other file types, directly open in the browser
        //     window.open(url, "_blank");
        // }
    };

    const scrollContainerRef = useRef(null);

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
        }
    };

    return (
        <div className='page-wrapper'>
            <div className='services_assets_dtl_main'>
                <div className='emply_S_assets_dtl'>
                    <div className='container-xl'>
                        <div className='d-flex align-items-center justify-content-between'>
                            <div>
                                <div className='emply_S_assets_dtl_head_brdcrm'>
                                    <span>Schemes & Services</span> <span className="emply_S_assets_dtl_head_brdcrm_icon"><GrFormNext /></span> <span>Services Details & Assets</span> <span className="emply_S_assets_dtl_head_brdcrm_icon"><GrFormNext /></span> <b>{serviceName}</b>
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
                    </div>
                </div>
                <div className='emply_S_assets_dtl_bg'>
                </div>
            </div>
            <div className='container-xl' style={{ zIndex: '2' }}>
                <div className='emply_S_assets_dtl_inner'>
                    <div className='my-card' style={{ height: '370px', background: '#fff', borderRadius: '20px' }}>
                        <div className='row m-0 p-0'>
                            <div className='col-lg-8 p-0'>
                                <div className='emply_S_assets_dtl_inner_left'>
                                    {/* <div>
                                        <ul className="nav nav-tabs">
                                            {(!service.detailsPart?.length && !service.teamInfo?.documents?.length && !service.teamInfo?.portfolio?.length) ? (
                                                <li className="nav-item">
                                                    <span className="nav-link">No data available for this service</span>
                                                </li>
                                            ) : (
                                                <>
                                                    {service.detailsPart?.map((detail, index) => (
                                                        <li className="nav-item" key={index}>
                                                            <a className={`nav-link ${index === 0 ? 'active' : ''}`} data-bs-toggle="tab" href={`#tab-${index}`}>
                                                                {detail.heading}
                                                            </a>
                                                        </li>
                                                    ))}
                                                    {service.teamInfo?.documents?.length > 0 && (
                                                        <li className="nav-item">
                                                            <a className="nav-link" data-bs-toggle="tab" href="#Documents">Documents</a>
                                                        </li>
                                                    )}
                                                    {service.teamInfo?.portfolio?.length > 0 && (
                                                        <li className="nav-item">
                                                            <a className="nav-link" data-bs-toggle="tab" href="#Portfolio">Portfolio</a>
                                                        </li>
                                                    )}
                                                </>
                                            )}
                                        </ul>

                                        <div className="tab-content">
                                            {service.detailsPart?.map((detail, index) => (
                                                <div key={index} className={`tab-pane fade ${index === 0 ? 'show active' : ''}`} id={`tab-${index}`}>
                                                    <div className="ES_assetsdtl_Linner">
                                                        <div className="ES_assetsdtl_Linner_p">
                                                            <div dangerouslySetInnerHTML={{ __html: detail.details }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            {service.teamInfo?.documents?.length > 0 && (
                                                <div className="tab-pane fade" id="Documents">
                                                    <div className="ES_assetsdtl_Linner">
                                                       

                                                        <ol className="list-group-numbered mt-3">
                                                            {service.teamInfo.documents.map((doc, index) => (
                                                                <li
                                                                    className="list-group-item d-flex justify-content-between align-items-start"
                                                                    key={index}
                                                                    onClick={() => openDocumentInNewTab(service._id, doc.filename)}
                                                                    style={{ cursor: "pointer" }}
                                                                >
                                                                    <div className="ms-2 me-auto">
                                                                        <div className="text-wrap">{doc.originalname}</div>
                                                                    </div>
                                                                </li>
                                                            ))}
                                                        </ol>


                                                    </div>
                                                </div>
                                            )}

                                            {service.teamInfo?.portfolio?.length > 0 && (
                                                <div className="tab-pane fade" id="Portfolio">
                                                    <div className="ES_assetsdtl_Linner mt-3">
                                                        <ul>
                                                            {service.teamInfo.portfolio.map((link, index) => (
                                                                <li key={index}>
                                                                    <a href={link} target="_blank" rel="noopener noreferrer">
                                                                        {link}
                                                                    </a>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div> */}

                                    {/* <div>
                                        <div
                                            className="nav-tabs-container"
                                            style={{
                                                overflowX: "auto",
                                                whiteSpace: "nowrap",
                                                borderBottom: "1px solid #ddd",
                                                WebkitOverflowScrolling: "touch", 
                                            }}
                                        >
                                            <ul
                                                className="nav nav-tabs"
                                                style={{
                                                    display: "inline-flex",
                                                    flexWrap: "nowrap",
                                                    gap: "0.5rem",
                                                    marginBottom: "0", 
                                                }}
                                            >
                                                {(!service.detailsPart?.length &&
                                                    !service.teamInfo?.documents?.length &&
                                                    !service.teamInfo?.portfolio?.length) ? (
                                                    <li className="nav-item">
                                                        <span className="nav-link">No data available for this service</span>
                                                    </li>
                                                ) : (
                                                    <>
                                                        {service.detailsPart?.map((detail, index) => (
                                                            <li className="nav-item" key={index}>
                                                                <a
                                                                    className={`nav-link ${index === 0 ? "active" : ""}`}
                                                                    data-bs-toggle="tab"
                                                                    href={`#tab-${index}`}
                                                                    style={{
                                                                        whiteSpace: "nowrap", 
                                                                        padding: "0.5rem 1rem", 
                                                                    }}
                                                                >
                                                                    {detail.heading}
                                                                </a>
                                                            </li>
                                                        ))}
                                                        {service.teamInfo?.documents?.length > 0 && (
                                                            <li className="nav-item">
                                                                <a
                                                                    className="nav-link"
                                                                    data-bs-toggle="tab"
                                                                    href="#Documents"
                                                                    style={{
                                                                        whiteSpace: "nowrap",
                                                                        padding: "0.5rem 1rem",
                                                                    }}
                                                                >
                                                                    Documents
                                                                </a>
                                                            </li>
                                                        )}

                                                    </>
                                                )}
                                            </ul>
                                        </div>

                                        <div className="tab-content">
                                            {service.detailsPart?.map((detail, index) => (
                                                <div
                                                    key={index}
                                                    className={`tab-pane fade ${index === 0 ? "show active" : ""}`}
                                                    id={`tab-${index}`}
                                                >
                                                    <div className="ES_assetsdtl_Linner">
                                                        <div className="ES_assetsdtl_Linner_p">
                                                            <div dangerouslySetInnerHTML={{ __html: detail.details }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            {service.teamInfo?.documents?.length > 0 && (
                                                <div className="tab-pane fade" id="Documents">

                                                    <div className='row m-0'>
                                                    {service.teamInfo.documents.map((doc, index)  => {
                                                            const fileExtension = doc.filename.split('.').pop().toLowerCase();

                                                            const isImage = ['jpg', 'jpeg', 'png'].includes(fileExtension);

                                                            return (
                                                                <div className='col-2 mt-2 mb-2' key={index}>
                                                                    <div className="booking-docs-preview" onClick={() => openDocumentInNewTab(service._id, doc.filename)}>
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
                                            )}

                                          
                                        </div>
                                    </div> */}

                                    {/* <div>
                                        <div
                                            className="nav-tabs-container"
                                            style={{
                                                overflowX: "auto",
                                                whiteSpace: "nowrap",
                                                borderBottom: "1px solid #ddd",
                                                WebkitOverflowScrolling: "touch", 
                                                scrollbarWidth: "none", 
                                                msOverflowStyle: "none", 
                                            }}
                                        >
                                            <style>
                                                {`
                .nav-tabs-container::-webkit-scrollbar {
                    display: none;
                }
            `}
                                            </style>
                                            <ul
                                                className="nav nav-tabs"
                                                style={{
                                                    display: "inline-flex",
                                                    flexWrap: "nowrap",
                                                    gap: "0.5rem",
                                                    marginBottom: "0",
                                                }}
                                            >
                                                {(!service.detailsPart?.length &&
                                                    !service.teamInfo?.documents?.length &&
                                                    !service.teamInfo?.portfolio?.length) ? (
                                                    <li className="nav-item">
                                                        <span className="nav-link">No data available for this service</span>
                                                    </li>
                                                ) : (
                                                    <>
                                                        {service.detailsPart?.map((detail, index) => (
                                                            <li className="nav-item" key={index}>
                                                                <a
                                                                    className={`nav-link ${index === 0 ? "active" : ""}`}
                                                                    data-bs-toggle="tab"
                                                                    href={`#tab-${index}`}
                                                                    style={{
                                                                        whiteSpace: "nowrap", 
                                                                        padding: "0.5rem 1rem", 
                                                                    }}
                                                                >
                                                                    {detail.heading}
                                                                </a>
                                                            </li>
                                                        ))}
                                                        {service.teamInfo?.documents?.length > 0 && (
                                                            <li className="nav-item">
                                                                <a
                                                                    className="nav-link"
                                                                    data-bs-toggle="tab"
                                                                    href="#Documents"
                                                                    style={{
                                                                        whiteSpace: "nowrap",
                                                                        padding: "0.5rem 1rem",
                                                                    }}
                                                                >
                                                                    Documents
                                                                </a>
                                                            </li>
                                                        )}
                                                    </>
                                                )}
                                            </ul>
                                        </div>

                                        <div className="tab-content">
                                            {service.detailsPart?.map((detail, index) => (
                                                <div
                                                    key={index}
                                                    className={`tab-pane fade ${index === 0 ? "show active" : ""}`}
                                                    id={`tab-${index}`}
                                                >
                                                    <div className="ES_assetsdtl_Linner">
                                                        <div className="ES_assetsdtl_Linner_p">
                                                            <div dangerouslySetInnerHTML={{ __html: detail.details }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            {service.teamInfo?.documents?.length > 0 && (
                                                <div className="tab-pane fade" id="Documents">
                                                    <div className="row m-0">
                                                        {service.teamInfo.documents.map((doc, index) => {
                                                            const fileExtension = doc.filename.split('.').pop().toLowerCase();

                                                            const isImage = ['jpg', 'jpeg', 'png'].includes(fileExtension);

                                                            return (
                                                                <div className="col-2 mt-2 mb-2" key={index}>
                                                                    <div className="booking-docs-preview" onClick={() => openDocumentInNewTab(service._id, doc.filename)}>
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
                                            )}
                                        </div>
                                    </div> */}


                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                                            <button
                                                onClick={scrollLeft}
                                                style={{
                                                    position: 'absolute',
                                                    left: '-14px',
                                                    zIndex: 10,
                                                    background: 'transparent',
                                                    border: 'none',             
                                                    cursor: 'pointer',
                                                    padding: '0.3rem',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    fontSize: '14px',
                                                    width: 'auto',             
                                                    height: 'auto',             
                                                    outline: 'none'           
                                                }}
                                            >
                                                <FaChevronLeft />
                                            </button>


                                            <div
                                                ref={scrollContainerRef}
                                                className="nav-tabs-container"
                                                style={{
                                                    overflowX: 'auto',
                                                    whiteSpace: 'nowrap',
                                                    borderBottom: '1px solid #ddd',
                                                    WebkitOverflowScrolling: 'touch', 
                                                    scrollbarWidth: 'none', 
                                                    msOverflowStyle: 'none', 
                                                }}
                                            >
                                                <style>
                                                    {`
                            .nav-tabs-container::-webkit-scrollbar {
                                display: none;
                            }
                        `}
                                                </style>
                                                <ul
                                                    className="nav nav-tabs"
                                                    style={{
                                                        display: 'inline-flex',
                                                        flexWrap: 'nowrap',
                                                        gap: '0.5rem',
                                                        marginBottom: '0', // Consistent spacing
                                                    }}
                                                >
                                                    {(!service.detailsPart?.length &&
                                                        !service.teamInfo?.documents?.length &&
                                                        !service.teamInfo?.portfolio?.length) ? (
                                                        <li className="nav-item">
                                                            <span className="nav-link">No data available for this service</span>
                                                        </li>
                                                    ) : (
                                                        <>
                                                            {service.detailsPart?.map((detail, index) => (
                                                                <li className="nav-item" key={index}>
                                                                    <a
                                                                        className={`nav-link ${index === 0 ? 'active' : ''}`}
                                                                        data-bs-toggle="tab"
                                                                        href={`#tab-${index}`}
                                                                        style={{
                                                                            whiteSpace: 'nowrap', // Prevent text wrapping
                                                                            padding: '0.5rem 1rem', // Consistent tab padding
                                                                        }}
                                                                    >
                                                                        {detail.heading}
                                                                    </a>
                                                                </li>
                                                            ))}
                                                            {service.teamInfo?.documents?.length > 0 && (
                                                                <li className="nav-item">
                                                                    <a
                                                                        className="nav-link"
                                                                        data-bs-toggle="tab"
                                                                        href="#Documents"
                                                                        style={{
                                                                            whiteSpace: 'nowrap',
                                                                            padding: '0.5rem 1rem',
                                                                        }}
                                                                    >
                                                                        Documents
                                                                    </a>
                                                                </li>
                                                            )}
                                                        </>
                                                    )}
                                                </ul>


                                            </div>

                                            <button
                                                onClick={scrollRight}
                                                style={{
                                                    position: 'absolute',
                                                    right: '-14px',
                                                    zIndex: 10,
                                                    background: 'transparent',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    padding: '0.3rem',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    fontSize: '14px',
                                                    width: 'auto',
                                                    height: 'auto',
                                                    outline: 'none',
                                                }}
                                            >
                                                <FaChevronRight />
                                            </button>

                                        </div>

                                        <div className="tab-content">
                                            {service.detailsPart?.map((detail, index) => (
                                                <div
                                                    key={index}
                                                    className={`tab-pane fade ${index === 0 ? 'show active' : ''}`}
                                                    id={`tab-${index}`}
                                                >
                                                    <div className="ES_assetsdtl_Linner">
                                                        <div className="ES_assetsdtl_Linner_p">
                                                            <div dangerouslySetInnerHTML={{ __html: detail.details }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            {service.teamInfo?.documents?.length > 0 && (
                                                <div className="tab-pane fade" id="Documents">
                                                    <div className="row m-0">
                                                        {service.teamInfo.documents.map((doc, index) => {
                                                            // Extract the file extension
                                                            const fileExtension = doc.filename.split('.').pop().toLowerCase();

                                                            // Check if the file is an image (jpg, jpeg, png)
                                                            const isImage = ['jpg', 'jpeg', 'png'].includes(fileExtension);

                                                            return (
                                                                <div className="col-2 mt-2 mb-2" key={index}>
                                                                    <div className="booking-docs-preview" onClick={() => openDocumentInNewTab(service._id, doc.filename)}>
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
                                            )}
                                        </div>
                                    </div>


                                    <div className='lbg'></div>
                                </div>
                            </div>

                            <div className='col-lg-4 p-0'>
                                <div className='emply_S_assets_dtl_inner_right'>
                                    <div className='esadir_docs bdr-btm-eee' >
                                        <h3 className='m-0 esadir_docs_depart'>Service Category</h3>
                                        <div className='esadir_docs_depart_name'>
                                            {departmentName}
                                        </div>
                                    </div>

                                    {service.teamInfo?.portfolio?.length > 0 &&
                                        <div className='esadir_docs bdr-btm-eee'>
                                            <h3 className='m-0 esadir_docs_depart'>Portfolio</h3>
                                            <div className='esadir_docs_depart_name'>
                                                {service.teamInfo.portfolio.map((link, index) => (
                                                    // <li key={index}>

                                                    <div key={index}>
                                                        <a className='link_wrap'
                                                            target="_blank"
                                                            href={link}
                                                            rel="noopener noreferrer"
                                                        >
                                                            {link}
                                                        </a>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {(salesemployeeNames?.length > 0 || backendemployeeNames?.length > 0) &&
                    <div className='row align-items-center justify-content-between'>
                        {salesemployeeNames?.length > 0 &&
                            <div className='col-lg-6'>
                                <div className='my-card mt-2'>
                                    <div className='my-card-body p-3'>
                                        <div className='esadir_docs_depart_name'>
                                            <h4 className='m-0'>Concerned Team For sales and marketing</h4>
                                            <div className='row'>
                                                {salesemployeeNames.length > 0 ? (
                                                    salesemployeeNames.map((employee, index) => (

                                                        <div className='col-6'>
                                                            <div key={index} className="ConcerneddepartPerson">
                                                                <div className='d-flex align-items-center'>
                                                                    <div className='tbl-pro-img'>
                                                                        <img className="profile-photo" src={employee.profilePhoto?.length !== 0
                                                                            ? `${secretKey}/employee/fetchProfilePhoto/${employee._id}/${employee.profilePhoto?.[0]?.filename}`
                                                                            : employee.gender === "Male" ? EmpDfaullt : FemaleEmployee} alt="profile" />
                                                                    </div>
                                                                    <div className='ConcerneddepartPerson-right'>
                                                                        <p>{employee.ename}</p>
                                                                        <div className='d-flex align-items-center justify-content-between'>
                                                                            <label className='mr-2'>
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
                                                                </div>
                                                            </div>
                                                        </div>

                                                    ))
                                                ) : (
                                                    <p>No concerned employees found.</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                        {backendemployeeNames?.length > 0 &&
                            <div className='col-lg-6'>
                                <div className='my-card mt-2'>
                                    <div className='my-card-body p-3'>
                                        <div className='esadir_docs_depart_name'>
                                            <h4 className='m-0'>Concerned Team For Backend Process</h4>
                                            {backendemployeeNames.length > 0 ? (
                                                backendemployeeNames.map((head, index) => (
                                                    <div className='row'>
                                                        <div className='col-6'>
                                                            <div key={index} className="ConcerneddepartPerson">
                                                                <div className='d-flex align-items-center'>
                                                                    <div className='tbl-pro-img'>
                                                                        <img className="profile-photo" src={head.profilePhoto?.length !== 0
                                                                            ? `${secretKey}/employee/fetchProfilePhoto/${head._id}/${head.profilePhoto?.[0]?.filename}`
                                                                            : head.gender === "Male" ? EmpDfaullt : FemaleEmployee} alt="profile" />
                                                                    </div>
                                                                    <div className='ConcerneddepartPerson-right'>
                                                                        <p>{head.ename}</p>
                                                                        <div className='d-flex align-items-center justify-content-between'>
                                                                            <label className='mr-2'>
                                                                                {head.newDesignation === "Business Development Executive" && "BDE" ||
                                                                                    head.newDesignation === "Business Development Manager" && "BDM" ||
                                                                                    head.newDesignation},{" "}
                                                                                {head.branchOffice === "Sindhu Bhawan" && "SBR" || head.branchOffice} Branch
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
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p>No concerned employees found.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                }
            </div>
        </div>

    )
}

export default EmployeeAssetDetails