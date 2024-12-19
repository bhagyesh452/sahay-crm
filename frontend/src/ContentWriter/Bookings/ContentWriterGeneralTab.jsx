import React from 'react';

function ContentWriterGeneralTab() {
  
    return (
        <div className="sales-panels-main no-select">
            <h1>Content Writer General Tab</h1>
            <div className="table table-responsive e-Leadtable-style m-0">
                <table className="table table-vcenter table-nowrap" style={{ width: "1800px" }}>
                    
                    <thead>
                        <tr className="tr-sticky">
                            <th className={"rm-sticky-left-1"}>Sr. No</th>
                            <th className={"rm-sticky-left-2"}>Company Name</th>
                            <th>Company Number</th>
                            <th>Company Email</th>
                            <th>Incorporation Date</th>
                            <th>Service Name</th>
                            <th>Status</th>
                            <th>Booking Date</th>
                            <th>Booking Number</th>
                            <th>CA Case</th>
                            <th>CA Number</th>
                            <th>BDE Name</th>
                            <th>BDM Name</th>
                            <th>Graphic Designer Name</th>
                            <th>Graphic Designer Status</th>
                            <th>Content Done Date</th>
                            <th>Business Input Status</th>
                            <th>Business Input Status Date</th>
                            <th>Assign Date</th>
                            <th>Accepted Date</th>
                            <th>Priority</th>
                            <th>Remarks</th>
                        </tr>
                    </thead>

                    {/* <tbody>
                        {isLoading && (
                            <tr>
                                <td colSpan="11">
                                    <div className="LoaderTDSatyle">
                                        <ClipLoader
                                            color="lightgrey"
                                            loading
                                            size={30}
                                            aria-label="Loading Spinner"
                                            data-testid="loader"
                                        />
                                    </div>
                                </td>
                            </tr>
                        )}
                        {generalData?.length !== 0 ? (
                            generalData?.map((company, index) => (
                                <tr
                                    key={company._id}
                                    onMouseDown={() => handleMouseDown(company._id)} // Start drag selection
                                    onMouseOver={() => handleMouseEnter(company._id)} // Continue drag selection
                                    onMouseUp={handleMouseUp} // End drag selection
                                    id={
                                        selectedRows && selectedRows.includes(company._id)
                                            ? "selected_admin"
                                            : ""
                                    } // Highlight selected rows
                                >
                                    {(newDesignation === "admin" ||
                                        newDesignation === "datamanager") && (
                                            <td className="AEP-sticky-left-1">
                                                <label className="table-check">
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            selectedRows && selectedRows.includes(company._id)
                                                        }
                                                        onChange={(e) => handleCheckboxChange(company._id, e)}
                                                    />
                                                    <span class="table_checkmark"></span>
                                                </label>
                                            </td>
                                        )}
                                    <td
                                        className={
                                            newDesignation === "admin" ||
                                                newDesignation === "datamanager"
                                                ? "AEP-sticky-left-2"
                                                : "rm-sticky-left-1 "
                                        }
                                    >
                                        {startIndex + index + 1}
                                    </td>
                                    <td
                                        className={
                                            newDesignation === "admin" ||
                                                newDesignation === "datamanager"
                                                ? "AEP-sticky-left-3"
                                                : "rm-sticky-left-2 "
                                        }
                                    >
                                        {company["Company Name"]}
                                    </td>
                                    <td>{company.ename}</td>

                                    <td>
                                        <div
                                            key={company._id}
                                            className="d-flex align-items-center justify-content-between w-100"
                                        >
                                            <p
                                                className="rematkText text-wrap mb-0 mr-1"
                                                title={company.Remarks}
                                            >
                                                {!company["Remarks"] ? "No Remarks" : company.Remarks}
                                            </p>
                                            <TeamLeadsRemarksDialog
                                                companyName={company["Company Name"]}
                                                companyId={company._id}
                                                remarksKey="remarks"
                                                isEditable={false}
                                                bdmAcceptStatus={company.bdmAcceptStatus}
                                                companyStatus={company.Status}
                                                name={company.ename}
                                                mainRemarks={company.Remarks}
                                                designation={designation}
                                                bdeRemarks={company.Remarks}
                                                refetch={refetchTeamLeads}
                                            />
                                        </div>
                                    </td>
                                    <td>
                                        <Tooltip
                                            title={`Age: ${calculateAgeFromDate(company["Company Incorporation Date  "])}`}
                                            arrow
                                        >
                                            <span>
                                                {formatDateNew(company["Company Incorporation Date  "])}
                                            </span>
                                        </Tooltip>
                                    </td>
                                    <td>{company["City"]}</td>
                                    <td>{company["State"]}</td>
                                    <td>{formatDateNew(company.bdeForwardDate)}</td>
                                    {!newDesignation && (
                                        <td className="rm-sticky-action">
                                            <IconButton
                                                style={{
                                                    color: "green",
                                                    marginRight: "5px",
                                                    height: "25px",
                                                    width: "25px",
                                                }}
                                                onClick={(e) =>
                                                    handleAcceptClick(
                                                        company._id,
                                                        company["Company Name"],
                                                        company["Company Email"],
                                                        company["Company Incorporation Date  "],
                                                        company["Company Number"],
                                                        company["Status"],
                                                        company.bdmStatus
                                                    )
                                                }
                                            >
                                                <GrStatusGood />
                                            </IconButton>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={11} className="text-center">
                                    <Nodata />
                                </td>
                            </tr>
                        )}
                    </tbody> */}
                </table>
            </div>

            {/* {generalData && generalData.length !== 0 && (
        <div className="pagination d-flex align-items-center justify-content-center w-100">
          <div>
            <button
              className="btn-pagination"
              onClick={prevPage}
              disabled={currentPage === 0}
            >
              <GoArrowLeft />
            </button>
          </div>
          <div className="ml-3 mr-3">
            Page {currentPage + 1} of {totalPages}
          </div>
          <div>
            <button
              className="btn-pagination"
              onClick={nextPage}
              disabled={currentPage >= totalPages - 1}
            >
              <GoArrowRight />
            </button>
          </div>
        </div>
      )} */}
        </div>
    );
}

export default ContentWriterGeneralTab;