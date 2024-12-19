import React, { useState, useEffect } from 'react';
import ContentWriterGeneralTab from './ContentWriterGeneralTab';
import ContentWriterInprocessTab from './ContentWriterInprocessTab';
import ContentWriterApprovedTab from './ContentWriterApprovedTab';
import ContentWriterHoldTab from './ContentWriterHoldTab';
import ContentWriterDefaulterTab from './ContentWriterDefaulterTab';

function ContentWriterMyBookings() {

    const [dataStatus, setDataStatus] = useState("General");
    const [searchedCompany, setSearchedCompany] = useState("");

    useEffect(() => {
        document.title = "Content-Writer-Sahay-CRM";
    }, []);

    return (
        <div className="page-wrapper">
            <div className="page-wrapper">

                <div className="page-header mt-3">
                    <div className="container-xl">
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center">
                                <div class="input-icon">
                                    <span class="input-icon-addon">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="icon mybtn" width="18" height="18" viewBox="0 0 22 22" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                            <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
                                            <path d="M21 21l-6 -6"></path>
                                        </svg>
                                    </span>
                                    <input
                                        value={searchedCompany}
                                        onChange={(e) => setSearchedCompany(e.target.value)}
                                        className="form-control search-cantrol mybtn"
                                        placeholder="Enter Company Name..."
                                        type="text"
                                        name="bdeName-search"
                                        id="bdeName-search"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="page-body">
                    <div className="container-xl">
                        <div class="card-header my-tab">
                            <ul class="nav nav-tabs sales-nav-tabs card-header-tabs nav-fill p-0" data-bs-toggle="tabs">

                                <li class="nav-item sales-nav-item data-heading">
                                    <a
                                        href="#General"
                                        // ref={allTabRef} // Attach the ref to the anchor tag
                                        // onClick={() => handleDataStatusChange("All", allTabRef)}
                                        onClick={() => {
                                            setDataStatus("General");
                                            // setActiveTabId("General");
                                            // setSelectedRows([]);
                                            // setCurrentPage(0);
                                        }}
                                        className={`nav-link  ${dataStatus === "General" ? "active item-act" : ""}`}
                                        data-bs-toggle="tab"
                                    >
                                        <div>General</div>
                                        <div className="no_badge">
                                            0
                                        </div>
                                    </a>
                                </li>

                                <li class="nav-item sales-nav-item data-heading">
                                    <a
                                        href="#Inprocess"
                                        // ref={interestedTabRef}
                                        // onClick={() => handleDataStatusChange("Interested", interestedTabRef)}
                                        onClick={() => {
                                            setDataStatus("Inprocess");
                                            // setActiveTabId("Interested");
                                            // setSelectedRows([]);
                                            // setCurrentPage(0);
                                        }}
                                        className={`nav-link ${dataStatus === "Inprocess" ? "active item-act" : ""}`}
                                        data-bs-toggle="tab"
                                    >
                                        In Process
                                        <span className="no_badge">
                                            0
                                        </span>
                                    </a>
                                </li>

                                <li class="nav-item sales-nav-item data-heading">
                                    <a
                                        href="#Approved"
                                        // ref={maturedTabRef}
                                        // onClick={() => handleDataStatusChange("Matured", maturedTabRef)}
                                        onClick={() => {
                                            setDataStatus("Approved");
                                            // setActiveTabId("Matured");
                                            // setSelectedRows([]);
                                            // setCurrentPage(0);
                                        }}
                                        className={`nav-link ${dataStatus === "Approved" ? "active item-act" : ""}`}
                                        data-bs-toggle="tab"
                                    >
                                        Approved
                                        <span className="no_badge">
                                            0
                                        </span>
                                    </a>
                                </li>

                                <li class="nav-item sales-nav-item data-heading">
                                    <a
                                        href="#Hold"
                                        // ref={notInterestedTabRef}
                                        // onClick={() => handleDataStatusChange("Not Interested", notInterestedTabRef)}
                                        onClick={() => {
                                            setDataStatus("Hold");
                                            // setActiveTabId("Not Interested");
                                            // setSelectedRows([]);
                                            // setCurrentPage(0);
                                        }}
                                        className={`nav-link ${dataStatus === "Hold" ? "active item-act" : ""}`}
                                        data-bs-toggle="tab"
                                    >
                                        Hold
                                        <span className="no_badge">
                                            0
                                        </span>
                                    </a>
                                </li>

                                <li class="nav-item sales-nav-item data-heading">
                                    <a
                                        href="#Defaulter"
                                        // ref={notInterestedTabRef}
                                        // onClick={() => handleDataStatusChange("Not Interested", notInterestedTabRef)}
                                        onClick={() => {
                                            setDataStatus("Defaulter");
                                            // setActiveTabId("Not Interested");
                                            // setSelectedRows([]);
                                            // setCurrentPage(0);
                                        }}
                                        className={`nav-link ${dataStatus === "Defaulter" ? "active item-act" : ""}`}
                                        data-bs-toggle="tab"
                                    >
                                        Defaulter
                                        <span className="no_badge">
                                            0
                                        </span>
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div className="tab-content card-body">
                            <div className={`tab-pane ${dataStatus === "General" ? "active" : ""}`} id="General">
                                <ContentWriterGeneralTab />
                            </div>

                            <div className={`tab-pane ${dataStatus === "Inprocess" ? "active" : ""}`} id="Inprocess">
                                <ContentWriterInprocessTab />
                            </div>

                            <div className={`tab-pane ${dataStatus === "Approved" ? "active" : ""}`} id="Approved">
                                <ContentWriterApprovedTab />
                            </div>

                            <div className={`tab-pane ${dataStatus === "Hold" ? "active" : ""}`} id="Hold">
                                <ContentWriterHoldTab />
                            </div>

                            <div className={`tab-pane ${dataStatus === "Defaulter" ? "active" : ""}`} id="Defaulter">
                                <ContentWriterDefaulterTab />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContentWriterMyBookings;