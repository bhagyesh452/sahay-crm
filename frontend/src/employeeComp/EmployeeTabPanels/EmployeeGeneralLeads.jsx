import React, { useState, useEffect ,useRef} from 'react';
import { LuHistory } from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa";
import ClipLoader from "react-spinners/ClipLoader";
import { Link } from 'react-router-dom';
import { GoArrowLeft } from "react-icons/go";
import { GoArrowRight } from "react-icons/go";
import Nodata from '../../components/Nodata';
import EmployeeStatusChange from '../ExtraComponents/EmployeeStatusChange';
import RedesignedForm from '../../admin/RedesignedForm';
import AddLeadForm from '../../admin/AddLeadForm';
import RemarksDialog from '../ExtraComponents/RemarksDialog';
import FilterableComponentEmployee from '../ExtraComponents/FilterableComponentEmployee';
import { BsFilter } from "react-icons/bs";
import { FaFilter } from "react-icons/fa";


function EmployeeGeneralLeads({
    userId,
    generalData,
    isLoading,
    refetch,
    formatDateNew,
    startIndex,
    endIndex,
    totalPages,
    setCurrentPage,
    currentPage,
    dataStatus,
    setdataStatus,
    ename,
    email,
    secretKey,
    handleShowCallHistory,
    designation,
    fordesignation,
    setSelectedRows,
    handleCheckboxChange,
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp,
    selectedRows,
    bdenumber
}) {

    const [companyName, setCompanyName] = useState("");
    const [maturedCompanyName, setMaturedCompanyName] = useState("");
    const [companyEmail, setCompanyEmail] = useState("");
    const [companyInco, setCompanyInco] = useState(null);
    const [companyNumber, setCompanyNumber] = useState(0);
    const [companyId, setCompanyId] = useState("");
    const [formOpen, setFormOpen] = useState(false);
    //const [editFormOpen, setEditFormOpen] = useState(false);
    const [addFormOpen, setAddFormOpen] = useState(false);
    const [deletedEmployeeStatus, setDeletedEmployeeStatus] = useState(false)
    const [newBdeName, setNewBdeName] = useState("")
    const [nowToFetch, setNowToFetch] = useState(false);
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [completeRmData, setcompleteRmData] = useState([])
    const [dataToFilter, setdataToFilter] = useState([])
    const [page, setPage] = useState(1);
    const [isScrollLocked, setIsScrollLocked] = useState(false);
    // const [totalPages, setTotalPages] = useState(0);
    const [filteredData, setFilteredData] = useState([]);
    const [activeFilterFields, setActiveFilterFields] = useState([]); // New state for active filter fields
    const [error, setError] = useState('');
    const [noOfAvailableData, setnoOfAvailableData] = useState(0);
    const [activeFilterField, setActiveFilterField] = useState(null);
    const [filterPosition, setFilterPosition] = useState({ top: 10, left: 5 });
    const fieldRefs = useRef({});
    const filterMenuRef = useRef(null); // Ref for the filter menu container
    const nextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage((prevPage) => prevPage + 1);
            refetch(); // Trigger a refetch when the page changes
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage((prevPage) => prevPage - 1);
            refetch(); // Trigger a refetch when the page changes
        }
    };

    //-------------------filter method-------------------------------

    const handleFilter = (newData) => {
        setFilteredData(newData)
        //setRmServicesData(newData.filter(obj => obj.mainCategoryStatus === "General"));

    };

    // useEffect(() => {
    //     if (noOfAvailableData) {
    //         showingFilterIcon(true)
    //         totalFilteredData(noOfAvailableData)
    //     } else {
    //         showingFilterIcon(false)
    //         totalFilteredData(0)
    //     }

    // }, [noOfAvailableData, activeTab])


    const handleFilterClick = (field) => {
        if (activeFilterField === field) {
            setShowFilterMenu(!showFilterMenu);
            setIsScrollLocked(!showFilterMenu);
        } else {
            setActiveFilterField(field);
            setShowFilterMenu(true);
            setIsScrollLocked(true);

            const rect = fieldRefs.current[field].getBoundingClientRect();
            setFilterPosition({ top: rect.bottom, left: rect.left });
        }
    };
    const isActiveField = (field) => activeFilterFields.includes(field);

    useEffect(() => {
        if (typeof document !== 'undefined') {
            const handleClickOutside = (event) => {
                if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
                    setShowFilterMenu(false);
                    setIsScrollLocked(false);
                }
            };

            document.addEventListener('mousedown', handleClickOutside);

            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, []);



    return (
        <div className="sales-panels-main" onMouseUp={handleMouseUp}>
            {!formOpen && !addFormOpen && (
                <>
                    <div className="table table-responsive e-Leadtable-style m-0">
                        <table className="table table-vcenter table-nowrap" style={{ width: "1800px" }}>
                            <thead>
                                <tr className="tr-sticky">
                                    {(fordesignation === "admin" || fordesignation === "datamanager") &&
                                        (
                                            <th className='AEP-sticky-left-1'>
                                                <label className='table-check'>
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            selectedRows && generalData && (selectedRows.length === generalData.length)
                                                        }
                                                        onChange={(e) => handleCheckboxChange("all", e)}
                                                    />
                                                    <span class="table_checkmark"></span>
                                                </label>
                                            </th>
                                        )}
                                    <th className={(fordesignation === "admin" || fordesignation === "datamanager") ? "AEP-sticky-left-2" : "rm-sticky-left-1"}>Sr. No</th>
                                    <th className={(fordesignation === "admin" || fordesignation === "datamanager") ? "AEP-sticky-left-3" : "rm-sticky-left-2"}>
                                        <div className='d-flex align-items-center justify-content-center position-relative'>
                                            <div ref={el => fieldRefs.current['bookingDate'] = el}>
                                                Company Name
                                            </div>

                                            {/* <div className='RM_filter_icon'>
                                                {isActiveField('bookingDate') ? (
                                                    <FaFilter onClick={() => handleFilterClick("bookingDate")} />
                                                ) : (
                                                    <BsFilter onClick={() => handleFilterClick("bookingDate")} />
                                                )}
                                            </div> */}

                                            {/* ---------------------filter component--------------------------- */}
                                            {showFilterMenu && activeFilterField === 'bookingDate' && (
                                                <div
                                                    ref={filterMenuRef}
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <FilterableComponentEmployee
                                                        noofItems={setnoOfAvailableData}
                                                        allFilterFields={setActiveFilterFields}
                                                        filteredData={filteredData}
                                                        activeTab={"General"}
                                                        data={generalData}
                                                        filterField={activeFilterField}
                                                        onFilter={handleFilter}
                                                        completeData={generalData}
                                                        showingMenu={setShowFilterMenu}
                                                        dataForFilter={generalData}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </th>
                                    <th>Company No</th>
                                    <th>Call History</th>
                                    <th>Status</th>
                                    <th>Remarks</th>
                                    <th>Incorporation Date</th>
                                    <th>City</th>
                                    <th>State</th>
                                    <th>Company Email</th>
                                    <th>Assign Date</th>
                                </tr>
                            </thead>
                            {
                                isLoading ? (
                                    <tbody>
                                        <tr>
                                            <td colSpan="11">
                                                <div className="LoaderTDSatyle w-100">
                                                    <ClipLoader
                                                        color="lightgrey"
                                                        loading={true}
                                                        size={30}
                                                        aria-label="Loading Spinner"
                                                        data-testid="loader"
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                ) : (
                                    <tbody>
                                        {generalData && generalData.map((company, index) => (
                                            <tr key={company._id}
                                                onMouseDown={() =>
                                                    handleMouseDown(company._id)
                                                } // Start drag selection
                                                onMouseOver={() => handleMouseEnter(company._id)} // Continue drag selection
                                                onMouseUp={handleMouseUp} // End drag selection
                                                id={selectedRows && selectedRows.includes(company._id) ? 'selected_admin' : ''} // Highlight selected rows
                                            >
                                                {(fordesignation === "admin" || fordesignation === "datamanager") && (
                                                    <td className='AEP-sticky-left-1'>
                                                        <label className='table-check'>
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedRows && selectedRows.includes(company._id)}
                                                                onChange={(e) => handleCheckboxChange(company._id, e)}
                                                            />
                                                            <span class="table_checkmark"></span>
                                                        </label>

                                                    </td>
                                                )}
                                                <td className={(fordesignation === "admin" || fordesignation === "datamanager") ? "AEP-sticky-left-2" : "rm-sticky-left-1 "}>{startIndex + index + 1}</td>
                                                <td className={(fordesignation === "admin" || fordesignation === "datamanager") ? "AEP-sticky-left-3" : "rm-sticky-left-2 "}>
                                                    <Link to={`/company-profile/${userId}`} className='text-decoration-none text-dark'>
                                                        {company["Company Name"]}
                                                    </Link>
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center justify-content-between wApp">
                                                        <div>{company["Company Number"]}</div>
                                                        <a
                                                            target="_blank"
                                                            href={`https://wa.me/91${company["Company Number"]}`}
                                                        >
                                                            <FaWhatsapp />
                                                        </a>
                                                    </div>
                                                </td>
                                                <td>
                                                    <LuHistory
                                                        onClick={() => {
                                                            handleShowCallHistory(
                                                                company["Company Name"],
                                                                company["Company Number"],
                                                                bdenumber,
                                                                company.bdmName

                                                            );
                                                            // setShowCallHistory(true);
                                                            // setClientNumber(company["Company Number"]);
                                                        }}
                                                        style={{
                                                            cursor: "pointer",
                                                            width: "15px",
                                                            height: "15px",
                                                        }}
                                                        color="grey"
                                                    />
                                                </td>
                                                <td>
                                                    {(fordesignation === "admin" || fordesignation === "datamanager") ? (
                                                        <div
                                                            className={company.Status === "Untouched" ? "ep_untouched_status" :
                                                                company.Status === "Busy" ? "ep_busy_status" :
                                                                    company.Status === "Not Picked Up" ? "ep_notpickedup_status" : null}>
                                                            {company.Status}
                                                        </div>
                                                    ) : (
                                                        <EmployeeStatusChange
                                                            key={`${company["Company Name"]}-${index}`}
                                                            companyName={company && company["Company Name"]}
                                                            companyStatus={company.Status}
                                                            id={company._id}
                                                            refetch={refetch}
                                                            mainStatus={dataStatus}
                                                            setCompanyName={setCompanyName}
                                                            setCompanyEmail={setCompanyEmail}
                                                            setCompanyInco={setCompanyInco}
                                                            setCompanyId={setCompanyId}
                                                            setCompanyNumber={setCompanyNumber}
                                                            setDeletedEmployeeStatus={setDeletedEmployeeStatus}
                                                            setNewBdeName={setNewBdeName}
                                                            isDeletedEmployeeCompany={company.isDeletedEmployeeCompany}
                                                            setFormOpen={setFormOpen}
                                                            setAddFormOpen={setAddFormOpen}
                                                            cemail={company["Company Email"]}
                                                            cindate={company["Incorporation Date"]}
                                                            cnum={company["Company Number"]}
                                                            ename={company.ename}
                                                            bdmAcceptStatus={company.bdmAcceptStatus}
                                                        />
                                                    )}
                                                </td>

                                                <td>
                                                    <div key={company._id} className='d-flex align-items-center justify-content-between w-100' >
                                                        <p
                                                            className="rematkText text-wrap mb-0 mr-1"
                                                            title={company.Remarks}
                                                        >
                                                            {!company["Remarks"]
                                                                ? "No Remarks"
                                                                : company.Remarks}
                                                        </p>
                                                        <RemarksDialog
                                                            key={`${company["Company Name"]}-${index}`} // Using index or another field to create a unique key
                                                            currentCompanyName={company["Company Name"]}
                                                            //remarksHistory={remarksHistory} // pass your remarks history data
                                                            companyId={company._id}
                                                            remarksKey="remarks" // Adjust this based on the type of remarks (general or bdm)
                                                            isEditable={company.bdmAcceptStatus !== "Accept"} // Allow editing if status is not "Accept"
                                                            bdmAcceptStatus={company.bdmAcceptStatus}
                                                            companyStatus={company.Status}
                                                            secretKey={secretKey}
                                                            //fetchRemarksHistory={fetchRemarksHistory}
                                                            bdeName={company.ename}
                                                            refetch={refetch}
                                                            mainRemarks={company.Remarks}
                                                        />
                                                    </div>
                                                </td>
                                                <td>
                                                    {formatDateNew(
                                                        company["Company Incorporation Date  "]
                                                    )}
                                                </td>
                                                <td>{company["City"]}</td>
                                                <td>{company["State"]}</td>
                                                <td>{company["Company Email"]}</td>
                                                <td>{formatDateNew(company["AssignDate"])}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                )
                            }
                            {generalData && generalData.length === 0 && !isLoading && (
                                <tbody>
                                    <tr>
                                        <td colSpan="11" className="p-2 particular">
                                            <Nodata />
                                        </td>
                                    </tr>
                                </tbody>
                            )}
                        </table>

                    </div>
                    {generalData && generalData.length !== 0 && (
                        <div className="pagination d-flex align-items-center justify-content-center w-100">
                            <div>
                                <button className='btn-pagination' onClick={prevPage} disabled={currentPage === 0}>
                                    <GoArrowLeft />
                                </button>
                            </div>
                            <div className='ml-3 mr-3'>
                                Page {currentPage + 1} of {totalPages}
                            </div>
                            <div>
                                <button className='btn-pagination' onClick={nextPage} disabled={currentPage >= totalPages - 1}>
                                    <GoArrowRight />
                                </button>
                            </div>
                        </div>
                    )}
                </>)}
            {formOpen && (
                <>
                    <RedesignedForm
                        // matured={true}
                        // companysId={companyId}
                        setDataStatus={setdataStatus}
                        setFormOpen={setFormOpen}
                        companysName={companyName}
                        companysEmail={companyEmail}
                        companyNumber={companyNumber}
                        setNowToFetch={setNowToFetch}
                        companysInco={companyInco}
                        employeeName={ename}
                        employeeEmail={email}
                    />
                </>
            )}
            {addFormOpen && (
                <>
                    {" "}
                    <AddLeadForm
                        employeeEmail={email}
                        newBdeName={newBdeName}
                        isDeletedEmployeeCompany={deletedEmployeeStatus}
                        setFormOpen={setAddFormOpen}
                        companysName={companyName}
                        setNowToFetch={setNowToFetch}
                        setDataStatus={setdataStatus}
                        employeeName={ename}
                    />
                </>
            )}
        </div>
    );
}

export default EmployeeGeneralLeads;