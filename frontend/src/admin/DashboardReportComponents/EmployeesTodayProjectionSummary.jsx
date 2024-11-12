import React, { useState, useEffect, useRef } from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import { useParams } from "react-router-dom";
import axios from "axios";
import { IconButton } from "@mui/material";
import { RiEditCircleFill } from "react-icons/ri";
import Nodata from '../../components/Nodata';
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { FcDatabase } from "react-icons/fc";
import { MdHistory } from "react-icons/md";
import FilterTableThisMonthBooking from './FilterableTableThisMonthBooking';
import FilterTableCallingReport from './FilterTableCallingReport';
import { BsFilter } from "react-icons/bs";
import { FaFilter } from "react-icons/fa";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import moment from "moment";

function EmployeesTodayProjectionSummary({ isFloorManagerView, floorManagerBranch }) {

    // console.log("Is floor manager view :", isFloorManagerView);
    // console.log("Floor manager branch :", floorManagerBranch);

    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const { userId } = useParams();

    const excludedEmployees = [
        "Vishnu Suthar", "Vandit Shah", "Khushi Gandhi",
        "Yashesh Gajjar", "Ravi Prajapati", "Yash Goswami"
    ];

    const [isLoading, setIsLoading] = useState(false);
    const [projection, setProjection] = useState([]);
    const [companyName, setCompanyName] = useState('');
    const [employeeName, setEmployeeName] = useState('');
    const [totalEmployees, setTotalEmployees] = useState([]);
    const [employeeProjectionData, setEmployeeProjectionData] = useState([])
    const [projectionEname, setProjectionEname] = useState("")
    const [openProjectionTable, setOpenProjectionTable] = useState(false);
    const [historyData, setHistoryData] = useState([])
    const [openHistoryDialog, setOpenHistoryDialog] = useState(false);
    const [historyCompanyName, setHistoryCompanyName] = useState("");
    const [addedOnDate, setAddedOnDate] = useState(null);
    const [searchTerm, setSearchTerm] = useState("")
    const [filteredProjection, setFilteredProjection] = useState([]);
    const [completeProjection, setCompleteProjection] = useState([]);
    const [filteredData, setFilteredData] = useState([])
    const [branchSearchTerm, setBranchSearchTerm] = useState(''); // Branch office search term
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [filterField, setFilterField] = useState("")
    const filterMenuRef = useRef(null); // Ref for the filter menu container
    const [activeFilterField, setActiveFilterField] = useState(null);
    const [filterPosition, setFilterPosition] = useState({ top: 10, left: 5 });
    const fieldRefs = useRef({});
    const [cleared, setCleared] = useState(false);
    const [activeFilterFields, setActiveFilterFields] = useState([]); // New state for active filter fields
    const [selectedDate, setSelectedDate] = useState(new Date());
    const formatDate = (dateString) => {
        if (!dateString) return "N/A"; // Handle undefined or null dates
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "Invalid Date"; // Handle invalid date formats
        const day = String(date.getDate()).padStart(2, '0');
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-IN').format(amount);
    };

    const fetchEmployee = async () => {
        try {
            const res2 = await axios.get(`${secretKey}/employee/einfo`);
            let employees = res2.data.filter(
                (employee) => employee.designation === "Sales Executive" || employee.designation === "Sales Manager"
            );

            if (isFloorManagerView) {
                employees = employees.filter(
                    (employee) =>
                        !excludedEmployees.includes(employee.ename) &&
                        employee.branchOffice === floorManagerBranch
                );
            }

            setTotalEmployees(employees);
        } catch (error) {
            console.log("Unexpected error in fetchEmployee:", error);
        }
    };

    const fetchNewProjection = async (date = selectedDate) => {
        try {
            setIsLoading(true);
            // Manually format date to YYYY-MM-DD to avoid timezone shifts
            const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
            console.log("formattedDate", selectedDate, formattedDate)
            const currentDayProjectionRes = await axios.get(`${secretKey}/company-data/getCurrentDayProjection`, {
                params: { companyName, date: formattedDate },
            });

            const dailyEmployeeProjectionRes = await axios.get(`${secretKey}/company-data/getDailyEmployeeProjections`, {
                params: { date: formattedDate },
            });
            // Transform the data from the first API to calculate the required metrics
            const summary = currentDayProjectionRes.data.data.reduce((acc, company) => {
                const isShared = company.bdeName !== company.bdmName;

                // Initialize each employee's data if not already in summary
                [company.bdeName, company.bdmName].forEach((employeeName) => {
                    if (!acc[employeeName]) {
                        acc[employeeName] = {
                            total_companies: 0,
                            total_offered_price: 0,
                            total_estimated_payment: 0,
                            total_services: 0,
                        };
                    }
                });

                const serviceCount = company.offeredServices ? company.offeredServices.length : 0;

                if (isShared) {
                    acc[company.bdeName].total_companies += 0.5;
                    acc[company.bdmName].total_companies += 0.5;
                    acc[company.bdeName].total_offered_price += (company.offeredPrice || 0) * 0.5;
                    acc[company.bdmName].total_offered_price += (company.offeredPrice || 0) * 0.5;
                    acc[company.bdeName].total_estimated_payment += (company.totalPayment || 0) * 0.5;
                    acc[company.bdmName].total_estimated_payment += (company.totalPayment || 0) * 0.5;
                    acc[company.bdeName].total_services += serviceCount;
                    acc[company.bdmName].total_services += serviceCount;
                } else {
                    acc[company.bdeName].total_companies += 1;
                    acc[company.bdeName].total_offered_price += company.offeredPrice || 0;
                    acc[company.bdeName].total_estimated_payment += company.totalPayment || 0;
                    acc[company.bdeName].total_services += serviceCount;
                }

                return acc;
            }, {});

            // Convert the summary object to an array
            const summaryArray = Object.entries(summary).map(([ename, values]) => ({
                ename,
                total_companies: values.total_companies,
                total_offered_price: values.total_offered_price,
                total_estimated_payment: values.total_estimated_payment,
                total_services: values.total_services,
            }));
            console.log("summaryArray", summaryArray);

            // Process daily employee projections to incorporate "Not Added Yet" status
            const dailyEmployeeProjections = dailyEmployeeProjectionRes.data.data;
            console.log("dailyEmployeeProjections", dailyEmployeeProjections);
            const combinedSummaryArray = totalEmployees.map(employee => {
                const existingEmployee = summaryArray.find(summary => summary.ename === employee.ename);
                const dailyProjection = dailyEmployeeProjections.find(daily => daily.ename === employee.ename);
                //console.log("dailyProjection", dailyProjection);
                // If the employee exists in both summaries, use existing data; otherwise, default values
                if (existingEmployee) {
                    return {
                        ...existingEmployee,
                        result: dailyProjection?.result || "Added",  // Add result status if available
                        branchOffice: employee.branchOffice,  // Add branch office from totalEmployees
                    };
                } else if (dailyProjection) {
                    // If only found in daily projections, default counts with "Not Added Yet" as result
                    return {
                        ename: employee.ename,
                        total_companies: 0,
                        total_offered_price: 0,
                        total_estimated_payment: 0,
                        total_services: 0,
                        result: dailyProjection.result || "Not Added Yet",
                        branchOffice: employee.branchOffice,  // Add branch office from totalEmployees
                    };
                } else {
                    // If not found in either source, default values
                    return {
                        ename: employee.ename,
                        total_companies: 0,
                        total_offered_price: 0,
                        total_estimated_payment: 0,
                        total_services: 0,
                        result: 0,
                        branchOffice: employee.branchOffice,  // Add branch office from totalEmployees
                    };
                }
            });

            // Sort so that employees with projections are on top and zero projections at the bottom
            combinedSummaryArray.sort((a, b) => b.total_companies - a.total_companies);
            // console.log("Employee Projection Summary:", combinedSummaryArray);
            setProjection(combinedSummaryArray);
            setFilteredProjection(combinedSummaryArray);
            setCompleteProjection(combinedSummaryArray);

        } catch (error) {
            console.log("Error fetching today's projection:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenProjectionsForEmployee = async (employeeName) => {
        setProjectionEname(employeeName); // Store the employee name for dialog title
        try {
            setIsLoading(true);
            const res = await axios.get(`${secretKey}/company-data/getCurrentDayProjection/${employeeName}`, {
                params: {
                    companyName,
                }
            });
            // console.log("Projection data is :", res.data.data);
            setEmployeeProjectionData(res.data.data);
            setOpenProjectionTable(true); // Open the dialog
        } catch (error) {
            console.log("Error to fetch new projection :", error);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    }
    const closeProjectionTable = () => setOpenProjectionTable(false);

    useEffect(() => {
        // Fetch employees on component mount
        fetchEmployee();
    }, []);

    useEffect(() => {
        // Fetch projections only when totalEmployees has data
        if (totalEmployees && totalEmployees.length > 0) {
            fetchNewProjection();
        }
    }, [totalEmployees]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    // ----------projection history function-----------------------------------
    const handleViewHistory = (companyId) => {
        // Find the specific projection that matches the companyId
        const selectedProjection = employeeProjectionData.find(projection => projection._id === companyId);
        // console.log("selectedProjection", selectedProjection)
        setHistoryCompanyName(selectedProjection.companyName)
        setAddedOnDate(selectedProjection.addedOnDate)

        // Set history data if found; otherwise, set an empty array
        setHistoryData(selectedProjection ? selectedProjection.history || [] : []);

        // Open the history dialog
        setOpenHistoryDialog(true);
        setOpenProjectionTable(false);
    };

    const handleCloseHistoryDialog = () => {
        setOpenHistoryDialog(false);
        setOpenProjectionTable(true);
    }

    // -----------------------search function------------------------
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        const searchValue = e.target.value.toLowerCase();
        const filteredData = filteredProjection.filter((proj) =>
            proj.ename.toLowerCase().includes(searchValue)
        );
        setProjection(filteredData);
    };

    // ---------------------filter functions----------------------------

    const handleFilter = (newData) => {
        setFilteredData(newData)
        setProjection(newData);
    };


    const handleFilterClick = (field) => {
        if (activeFilterField === field) {
            setShowFilterMenu(!showFilterMenu);

        } else {
            setActiveFilterField(field);
            setShowFilterMenu(true);
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

                }
            };
            document.addEventListener('mousedown', handleClickOutside);

            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, []);

    // -----------------------date filter functions----------------------


    useEffect(() => {
        if (cleared) {
            const timeout = setTimeout(() => {
                setCleared(false);
            }, 1500);

            return () => clearTimeout(timeout);
        }
        return () => { };
    }, [cleared]);

    const handleSingleDateSelection = async (formattedDate) => {
        const selected = new Date(formattedDate);
        setSelectedDate(selected); // Update selected date
        await fetchNewProjection(selected); // Fetch data for the selected date
    };

    return (
        <div>
            <div className="employee-dashboard">
                <div className="card">
                    <div className="card-header p-1 employeedashboard d-flex align-items-center justify-content-between">
                        <div className="dashboard-title pl-1">
                            <h2 className="m-0">
                                Today's Projection Summary
                            </h2>
                        </div>

                        <div className="d-flex align-items-center pr-1">
                            <div class="input-icon mr-1">
                                <span class="input-icon-addon">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                        <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
                                        <path d="M21 21l-6 -6"></path>
                                    </svg>
                                </span>
                                <input
                                    className="form-control"
                                    value={searchTerm} // bind to searchTerm
                                    onChange={handleSearch} // bind to handleSearch
                                    placeholder="Search by Employee Name..."
                                    type="text"
                                    name="employee-search"
                                    id="employee-search"
                                />
                            </div>
                            <div className="data-filter">
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['DatePicker']} sx={{ padding: '0px', width: '220px' }}>
                                        <DatePicker
                                            className="form-control my-date-picker form-control-sm p-0"
                                            format="DD/MM/YYYY" // Ensures the DatePicker displays and accepts DD/MM/YYYY format
                                            onChange={(value) => {
                                                if (value) {
                                                    // Use dayjs to handle the date conversion and format
                                                    const selectedDate = dayjs(value);

                                                    // Format the selected date to 'YYYY-MM-DD' for backend compatibility
                                                    const formattedDate = selectedDate.format("YYYY-MM-DD");

                                                    // Pass the correctly formatted date to your handler
                                                    handleSingleDateSelection(formattedDate);
                                                }
                                            }}
                                            slotProps={{
                                                field: {
                                                    clearable: true,
                                                    onClear: () => {
                                                        setCleared(true);
                                                        fetchNewProjection(new Date()); // Reset to today's date if cleared
                                                    }
                                                },
                                            }}
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </div>
                        </div>
                    </div>

                    <div className="card-body">
                        <div className="tbl-scroll" style={{ width: "100%", height: "500px" }}>
                            <table className="table-vcenter table-nowrap admin-dash-tbl" style={{ width: "100%" }}>
                                <thead className="admin-dash-tbl-thead">
                                    <tr className="tr-sticky"
                                        style={{
                                            backgroundColor: "#ffb900",
                                            color: "white",
                                            fontWeight: "bold",
                                        }}>
                                        <th>Sr. No</th>
                                        <th>
                                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                                <div ref={el => fieldRefs.current['ename'] = el}>
                                                    BDE/BDM Name
                                                </div>

                                                <div className='RM_filter_icon' style={{ color: "black" }}>
                                                    {isActiveField('ename') ? (
                                                        <FaFilter onClick={() => handleFilterClick("ename")} />
                                                    ) : (
                                                        <BsFilter onClick={() => handleFilterClick("ename")} />
                                                    )}
                                                </div>
                                                {/* ---------------------filter component--------------------------- */}
                                                {showFilterMenu && activeFilterField === 'ename' && (
                                                    <div
                                                        ref={filterMenuRef}
                                                        className="filter-menu"
                                                        style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                    >
                                                        <FilterTableCallingReport
                                                            //noofItems={setnoOfAvailableData}
                                                            allFilterFields={setActiveFilterFields}
                                                            filteredData={filteredData}
                                                            //activeTab={"None"}
                                                            employeeData={totalEmployees}
                                                            data={projection}
                                                            filterField={activeFilterField}
                                                            onFilter={handleFilter}
                                                            completeData={completeProjection}
                                                            showingMenu={setShowFilterMenu}
                                                            dataForFilter={filteredProjection}
                                                            forProjectionSummary={true}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </th>
                                        <th>
                                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                                <div ref={el => fieldRefs.current['branchOffice'] = el}>
                                                    Branch Office
                                                </div>

                                                <div className='RM_filter_icon' style={{ color: "black" }}>
                                                    {isActiveField('branchOffice') ? (
                                                        <FaFilter onClick={() => handleFilterClick("branchOffice")} />
                                                    ) : (
                                                        <BsFilter onClick={() => handleFilterClick("branchOffice")} />
                                                    )}
                                                </div>
                                                {/* ---------------------filter component--------------------------- */}
                                                {showFilterMenu && activeFilterField === 'branchOffice' && (
                                                    <div
                                                        ref={filterMenuRef}
                                                        className="filter-menu"
                                                        style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                    >
                                                        <FilterTableCallingReport
                                                            //noofItems={setnoOfAvailableData}
                                                            allFilterFields={setActiveFilterFields}
                                                            filteredData={filteredData}
                                                            //activeTab={"None"}
                                                            employeeData={totalEmployees}
                                                            data={projection}
                                                            filterField={activeFilterField}
                                                            onFilter={handleFilter}
                                                            completeData={completeProjection}
                                                            showingMenu={setShowFilterMenu}
                                                            dataForFilter={filteredProjection}
                                                            forProjectionSummary={true}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </th>
                                        <th>
                                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                                <div ref={el => fieldRefs.current['total_companies'] = el}>
                                                    Total Compnaies
                                                </div>

                                                <div className='RM_filter_icon' style={{ color: "black" }}>
                                                    {isActiveField('total_companies') ? (
                                                        <FaFilter onClick={() => handleFilterClick("total_companies")} />
                                                    ) : (
                                                        <BsFilter onClick={() => handleFilterClick("total_companies")} />
                                                    )}
                                                </div>
                                                {/* ---------------------filter component--------------------------- */}
                                                {showFilterMenu && activeFilterField === 'total_companies' && (
                                                    <div
                                                        ref={filterMenuRef}
                                                        className="filter-menu"
                                                        style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                    >
                                                        <FilterTableCallingReport
                                                            //noofItems={setnoOfAvailableData}
                                                            allFilterFields={setActiveFilterFields}
                                                            filteredData={filteredData}
                                                            //activeTab={"None"}
                                                            employeeData={totalEmployees}
                                                            data={projection}
                                                            filterField={activeFilterField}
                                                            onFilter={handleFilter}
                                                            completeData={completeProjection}
                                                            showingMenu={setShowFilterMenu}
                                                            dataForFilter={filteredProjection}
                                                            forProjectionSummary={true}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </th>
                                        <th>
                                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                                <div ref={el => fieldRefs.current['total_services'] = el}>
                                                    Offered Services
                                                </div>

                                                <div className='RM_filter_icon' style={{ color: "black" }}>
                                                    {isActiveField('total_services') ? (
                                                        <FaFilter onClick={() => handleFilterClick("total_services")} />
                                                    ) : (
                                                        <BsFilter onClick={() => handleFilterClick("total_services")} />
                                                    )}
                                                </div>
                                                {/* ---------------------filter component--------------------------- */}
                                                {showFilterMenu && activeFilterField === 'total_services' && (
                                                    <div
                                                        ref={filterMenuRef}
                                                        className="filter-menu"
                                                        style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                    >
                                                        <FilterTableCallingReport
                                                            //noofItems={setnoOfAvailableData}
                                                            allFilterFields={setActiveFilterFields}
                                                            filteredData={filteredData}
                                                            //activeTab={"None"}
                                                            employeeData={totalEmployees}
                                                            data={projection}
                                                            filterField={activeFilterField}
                                                            onFilter={handleFilter}
                                                            completeData={completeProjection}
                                                            showingMenu={setShowFilterMenu}
                                                            dataForFilter={filteredProjection}
                                                            forProjectionSummary={true}
                                                        />
                                                    </div>
                                                )}
                                            </div></th>
                                        <th>
                                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                                <div ref={el => fieldRefs.current['total_offered_price'] = el}>
                                                    Total Offered Price
                                                </div>

                                                <div className='RM_filter_icon' style={{ color: "black" }}>
                                                    {isActiveField('total_offered_price') ? (
                                                        <FaFilter onClick={() => handleFilterClick("total_offered_price")} />
                                                    ) : (
                                                        <BsFilter onClick={() => handleFilterClick("total_offered_price")} />
                                                    )}
                                                </div>
                                                {/* ---------------------filter component--------------------------- */}
                                                {showFilterMenu && activeFilterField === 'total_offered_price' && (
                                                    <div
                                                        ref={filterMenuRef}
                                                        className="filter-menu"
                                                        style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                    >
                                                        <FilterTableCallingReport
                                                            //noofItems={setnoOfAvailableData}
                                                            allFilterFields={setActiveFilterFields}
                                                            filteredData={filteredData}
                                                            //activeTab={"None"}
                                                            employeeData={totalEmployees}
                                                            data={projection}
                                                            filterField={activeFilterField}
                                                            onFilter={handleFilter}
                                                            completeData={completeProjection}
                                                            showingMenu={setShowFilterMenu}
                                                            dataForFilter={filteredProjection}
                                                            forProjectionSummary={true}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </th>
                                        <th>
                                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                                <div ref={el => fieldRefs.current['total_estimated_payment'] = el}>
                                                    Total Estimated Amount
                                                </div>

                                                <div className='RM_filter_icon' style={{ color: "black" }}>
                                                    {isActiveField('total_estimated_payment') ? (
                                                        <FaFilter onClick={() => handleFilterClick("total_estimated_payment")} />
                                                    ) : (
                                                        <BsFilter onClick={() => handleFilterClick("total_estimated_payment")} />
                                                    )}
                                                </div>
                                                {/* ---------------------filter component--------------------------- */}
                                                {showFilterMenu && activeFilterField === 'total_estimated_payment' && (
                                                    <div
                                                        ref={filterMenuRef}
                                                        className="filter-menu"
                                                        style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                    >
                                                        <FilterTableCallingReport
                                                            //noofItems={setnoOfAvailableData}
                                                            allFilterFields={setActiveFilterFields}
                                                            filteredData={filteredData}
                                                            //activeTab={"None"}
                                                            employeeData={totalEmployees}
                                                            data={projection}
                                                            filterField={activeFilterField}
                                                            onFilter={handleFilter}
                                                            completeData={completeProjection}
                                                            showingMenu={setShowFilterMenu}
                                                            dataForFilter={filteredProjection}
                                                            forProjectionSummary={true}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                {/* New code with branch office */}
                                <tbody>
                                    {isLoading && (
                                        <tr>
                                            <td colSpan="7" className="LoaderTDSatyle">
                                                <ClipLoader color="lightgrey" loading size={30} aria-label="Loading Spinner" data-testid="loader" />
                                            </td>
                                        </tr>
                                    )}

                                    {projection && projection.length > 0 ? (
                                        projection.map((data, index) => {
                                            // Find the branch office for each employee in totalEmployees
                                            const employee = totalEmployees.find((emp) => emp.ename === data.ename);
                                            const branchOffice = employee ? employee.branchOffice : '-';

                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{data.ename}</td>
                                                    <td>{branchOffice}</td>
                                                    <td>
                                                        {data.result ? (data.result === "Not Added Yet" ? 0 : data.total_companies) : "Not Added Yet"}
                                                        {data.result !== "Not Added Yet" && data.result ? (<FcDatabase
                                                            className='ml-1'
                                                            onClick={() => handleOpenProjectionsForEmployee(data.ename)} />) : null}
                                                    </td>
                                                    <td>{data.result ? (data.result === "Not Added Yet" ? 0 : data.total_services) : "Not Added Yet"}</td>
                                                    <td>{data.result ? (data.result === "Not Added Yet" ? 0 : formatCurrency(data.total_offered_price)) : "Not Added Yet"}
                                                    </td>
                                                    <td>{data.result ? (data.result === "Not Added Yet" ? 0 : formatCurrency(data.total_estimated_payment)) : "Not Added Yet"}</td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td className="particular" colSpan="7">
                                                <Nodata />
                                            </td>
                                        </tr>
                                    )}
                                </tbody>

                                {projection && projection.length > 0 && (
                                    <tfoot className="admin-dash-tbl-tfoot">
                                        <tr style={{ fontWeight: 500 }} className="tf-sticky">
                                            <td colSpan="3">Total</td>
                                            <td>{projection.reduce((total, item) => total + item.total_companies, 0)}</td>
                                            <td>{projection.reduce((total, item) => total + item.total_services, 0)}</td>
                                            <td>₹ {formatAmount(projection.reduce((total, item) => total + item.total_offered_price, 0))}</td>
                                            <td>₹ {formatAmount(projection.reduce((total, item) => total + item.total_estimated_payment, 0))}</td>
                                        </tr>
                                    </tfoot>
                                )}

                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* -------------------------------------projection-dashboard--------------------------------------------- */}
            <Dialog
                open={openProjectionTable}
                onClose={closeProjectionTable}
                fullWidth
                maxWidth="lg"
            >
                <DialogTitle>
                    {projectionEname}'s Today's Report{" "}
                    <IconButton
                        onClick={closeProjectionTable}
                        style={{ float: "right" }}
                    >
                        <CloseIcon color="primary" />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <div
                        id="table-default"
                        style={{
                            overflowX: "auto",
                            overflowY: "auto",
                        }}
                    >
                        <table
                            style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                border: "1px solid #ddd",
                                marginBottom: "10px",
                            }}
                            className="table-vcenter table-nowrap"
                        >
                            <thead
                                style={{
                                    position: "sticky",
                                    top: "-1px",
                                    backgroundColor: "#ffb900",
                                    color: "black",
                                    fontWeight: "bold",
                                    zIndex: 1,
                                }}
                            >
                                <tr
                                    style={{
                                        backgroundColor: "#ffb900",
                                        color: "white",
                                        fontWeight: "bold",
                                    }}
                                >
                                    <th>Sr. No</th>
                                    <th>Company Name</th>
                                    <th>BDE Name</th>
                                    <th>BDM Name</th>
                                    <th>Offered Services</th>
                                    <th>Total Offered Price</th>
                                    <th>Expected Amount</th>
                                    <th>Employee Payment</th>
                                    <th>Last Follow Up Date</th>
                                    <th>Estimated Payment Date</th>
                                    <th>Remarks</th>
                                    <th>Added On</th>
                                    <th>Modified On</th>
                                    <th>View History</th>

                                </tr>
                            </thead>
                            <tbody>
                                {employeeProjectionData && employeeProjectionData.length > 0 ? (
                                    employeeProjectionData.map((data, index) => (
                                        <tr key={data._id}>
                                            <td>{index + 1}</td>
                                            <td>{data.companyName}</td>
                                            <td>{data.bdeName}</td>
                                            <td>{data.bdmName}</td>
                                            <td>{data.offeredServices.join(', ')}</td>
                                            <td>{formatCurrency(data.offeredPrice)}</td>
                                            <td>{formatCurrency(data.totalPayment)}</td>
                                            <td>{formatCurrency(data.employeePayment)}</td>
                                            <td>{formatDate(new Date(data.lastFollowUpdate))}</td>
                                            <td>{formatDate(new Date(data.estPaymentDate))}</td>
                                            <td>{data.remarks}</td>
                                            <td>{formatDate(new Date(data.addedOnDate))}</td>
                                            <td>{formatDate(new Date(data.projectionDate))}</td>
                                            <td>
                                                {/* View History button or link (replace with your actual logic) */}
                                                <MdHistory
                                                    onClick={() => handleViewHistory(data._id)}
                                                />

                                            </td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="12">No data available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </DialogContent>
            </Dialog>
            {/* --------------------history dialog---------------------------- */}
            <Dialog
                open={openHistoryDialog}
                onClose={handleCloseHistoryDialog}
                fullWidth
                maxWidth="lg"

            >
                <DialogTitle>
                    {historyCompanyName}'s History
                    <IconButton
                        onClick={handleCloseHistoryDialog}
                        style={{ float: "right" }}
                    >
                        <CloseIcon color="primary" />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <div
                        id="table-default"
                        style={{ overflowX: "auto", overflowY: "auto" }}>
                        <table
                            style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                border: "1px solid #ddd",
                                marginBottom: "10px",
                            }}
                            className="table-vcenter table-nowrap"
                        >
                            <thead
                                style={{
                                    position: "sticky",
                                    top: "-1px",
                                    backgroundColor: "#ffb900",
                                    color: "black",
                                    fontWeight: "bold",
                                    zIndex: 1,
                                }}
                            >
                                <tr
                                    style={{
                                        backgroundColor: "#ffb900",
                                        color: "white",
                                        fontWeight: "bold",
                                    }}
                                >
                                    <th>Sr. No</th>
                                    <th>Company Name</th>
                                    <th>BDE Name</th>
                                    <th>BDM Name</th>
                                    <th>Offered Services</th>
                                    <th>Total Offered Price</th>
                                    <th>Expected Amount</th>
                                    <th>Employee Payment</th>
                                    <th>Last Follow Up Date</th>
                                    <th>Estimated Payment Date</th>
                                    <th>Remarks</th>
                                    <th>Added On</th>
                                    <th>Modified On</th>

                                </tr>
                            </thead>
                            <tbody>
                                {historyData && historyData.length > 0 ? (
                                    historyData.map((entry, index) => (
                                        <tr key={entry._id || index}>
                                            <td>{index + 1}</td>
                                            <td>{historyCompanyName}</td>
                                            <td>{entry.data.bdeName}</td>
                                            <td>{entry.data.bdmName}</td>
                                            <td>{entry.data.offeredServices.join(', ')}</td>
                                            <td>{formatCurrency(entry.data.offeredPrice)}</td>
                                            <td>{formatCurrency(entry.data.totalPayment)}</td>
                                            <td>{entry.data.bdeName === entry.data.bdmName ? formatCurrency(entry.data.totalPayment) : formatCurrency((entry.data.totalPayment) / 2)}</td>
                                            <td>{formatDate(new Date(entry.data.lastFollowUpdate))}</td>
                                            <td>{formatDate(new Date(entry.data.estPaymentDate))}</td>
                                            <td>{entry.data.remarks}</td>
                                            <td>{formatDate(addedOnDate)}</td>
                                            <td>{formatDate(new Date(entry.modifiedAt))}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8">No history available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    );
}

export default EmployeesTodayProjectionSummary