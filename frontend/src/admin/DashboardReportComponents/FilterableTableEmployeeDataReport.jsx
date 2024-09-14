import React, { useEffect, useState } from 'react';
import SwapVertIcon from "@mui/icons-material/SwapVert";
import AddCircle from "@mui/icons-material/AddCircle.js";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import axios from "axios";

const FilterableTableEmployeeDataReport = ({
    activeTab,
    filteredData,
    data,
    filterField,
    onFilter,
    completeData,
    companyData,
    dataForFilter,
    activeFilters,
    allFilterFields,
    employeeData,
    companyDataTotal,
    showingMenu,
    mergedMethod,
    fetchCompanyData
   
     }) => {
    const [columnValues, setColumnValues] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState({});
    const [sortOrder, setSortOrder] = useState(null);
    const secretKey = process.env.REACT_APP_SECRET_KEY;


    //-----------------------dateformats-------------------------------------
   
    const handleSort = (order) => {
        if (order === "none") {
            setSortOrder(null); // Clear the sort order
            applyFilters(selectedFilters, filterField); // Reapply filters without sorting
        } else {
            setSortOrder(order);
        }
    };

    useEffect(() => {
        applyFilters(selectedFilters, filterField);
    }, [sortOrder]);



    useEffect(() => {
        const getValues = (dataSource) => {
            return dataSource.map(employee => {
                // Find the corresponding company data by matching employee.ename to company._id
                const companyInfo = companyData.find(company => company._id === employee.ename);

                if (companyInfo) {
                    // Look for each status in the statusCounts array of the companyInfo
                    switch (filterField) {
                        case 'Untouched': {
                            const untouchedStatus = companyInfo.statusCounts?.find(statusObj => statusObj.status === 'Untouched');
                            return untouchedStatus ? untouchedStatus.count : null;
                        }
                        case 'Busy': {
                            const busyStatus = companyInfo.statusCounts?.find(statusObj => statusObj.status === 'Busy');
                            return busyStatus ? busyStatus.count : null;
                        }
                        case 'Not Picked Up': {
                            const notPickedUpStatus = companyInfo.statusCounts?.find(statusObj => statusObj.status === 'Not Picked Up');
                            return notPickedUpStatus ? notPickedUpStatus.count : null;
                        }
                        case 'Interested': {
                            const interestedStatus = companyInfo.statusCounts?.find(statusObj => statusObj.status === 'Interested');
                            return interestedStatus ? interestedStatus.count : null;
                        }
                        case 'FollowUp': {
                            const followupStatus = companyInfo.statusCounts?.find(statusObj => statusObj.status === 'Followup');
                            return followupStatus ? followupStatus.count : null;
                        }
                        case 'Junk': {
                            const junkStatus = companyInfo.statusCounts?.find(statusObj => statusObj.status === 'Junk');
                            return junkStatus ? junkStatus.count : null;
                        }
                        case 'Matured': {
                            const maturedStatus = companyInfo.statusCounts?.find(statusObj => statusObj.status === 'Matured');
                            return maturedStatus ? maturedStatus.count : null;
                        }
                        case 'Not Interested': {
                            const maturedStatus = companyInfo.statusCounts?.find(statusObj => statusObj.status === 'Matured');
                            return maturedStatus ? maturedStatus.count : null;
                        }
                        case 'ename': {
                            return employee.ename ? employee.ename : null;
                        }
                        default: {
                            return companyInfo[filterField]; // Return the value from company data for other fields
                        }
                    }
                }
                return null;
            }).filter(Boolean); // Filter out any falsy values (e.g., null)
        };

        if (filteredData && filteredData.length !== 0) {
            const values = getValues(filteredData);
            setColumnValues([...new Set(values)]); // Set unique values
        } else {
            const values = getValues(dataForFilter);
            setColumnValues([...new Set(values)]); // Set unique values
        }
    }, [filterField, filteredData, dataForFilter, companyData]);

    const handleCheckboxChange = (e) => {
        const value = e.target.value; // Checkbox value
        const valueAsString = String(value); // Convert to string for consistent comparison

        setSelectedFilters(prevFilters => {
            const updatedFilters = { ...prevFilters };
            const filtersAsString = updatedFilters[filterField] || [];

            if (filtersAsString.includes(valueAsString)) {
                updatedFilters[filterField] = filtersAsString.filter(filter => String(filter) !== valueAsString);
            } else {
                updatedFilters[filterField] = [...filtersAsString, value];
            }

            return updatedFilters;
        });
    };

    const applyFilters = (filters, column) => {
        // Ensure filters is always an object
        const safeFilters = filters || {};
        let dataToSort;
    
        // Combine all filters across different filter fields
        const allSelectedFilters = Object.values(safeFilters).flat();
    
        // Function to get status counts for the specified status
        const getStatusCount = (companyInfo, status) => {
            const statusObj = companyInfo?.statusCounts?.find(statusObj => statusObj.status === status);
            return statusObj ? statusObj.count : null;
        };
    
        // Start with the data to be filtered
        if (filteredData && filteredData.length !== 0) {
            dataToSort = filteredData.map(item => ({ ...item }));
    
            // Apply filters if there are selected filters
            if (allSelectedFilters.length > 0) {
                allFilterFields(prevFields => [...prevFields, column]);
    
                dataToSort = dataToSort.filter(employee => {
                    const companyInfo = companyData.find(company => company._id === employee.ename);
    
                    const match = Object.keys(safeFilters).every(column => {
                        const columnFilters = safeFilters[column];
    
                        // Special handling for each status
                        switch (column) {
                            case 'Untouched': {
                                const untouchedCount = getStatusCount(companyInfo, 'Untouched');
                                return columnFilters.includes(String(untouchedCount));
                            }
                            case 'Busy': {
                                const busyCount = getStatusCount(companyInfo, 'Busy');
                                return columnFilters.includes(String(busyCount));
                            }
                            case 'Not Picked Up': {
                                const notPickedUpCount = getStatusCount(companyInfo, 'Not Picked Up');
                                return columnFilters.includes(String(notPickedUpCount));
                            }
                            case 'Interested': {
                                const interestedCount = getStatusCount(companyInfo, 'Interested');
                                return columnFilters.includes(String(interestedCount));
                            }
                            case 'Followup': {
                                const followupCount = getStatusCount(companyInfo, 'Followup');
                                return columnFilters.includes(String(followupCount));
                            }
                            case 'Junk': {
                                const junkCount = getStatusCount(companyInfo, 'Junk');
                                return columnFilters.includes(String(junkCount));
                            }
                            case 'Matured': {
                                const maturedCount = getStatusCount(companyInfo, 'Matured');
                                return columnFilters.includes(String(maturedCount));
                            }
                            default: {
                                return columnFilters.includes(String(employee[column]));
                            }
                        }
                    });
    
                    return match;
                });
            }
    
            // Apply sorting based on `sortOrder` and the specified `column`
            if (sortOrder && column) {
                dataToSort = dataToSort.sort((a, b) => {
                    let valueA = a[column];
                    let valueB = b[column];
    
                    // Handle string sorting
                    if (typeof valueA === 'string' && typeof valueB === 'string') {
                        return sortOrder === 'ascending' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
                    }
                    // Handle number sorting
                    else if (typeof valueA === 'number' && typeof valueB === 'number') {
                        return sortOrder === 'ascending' ? valueA - valueB : valueB - valueA;
                    }
                    return 0;
                });
            }
        } else {
            dataToSort = dataForFilter.map(item => ({ ...item }));
    
            // Apply filters if there are selected filters
            if (allSelectedFilters.length > 0) {
                allFilterFields(prevFields => [...prevFields, column]);
    
                dataToSort = dataToSort.filter(employee => {
                    const companyInfo = companyData.find(company => company._id === employee.ename);
    
                    const match = Object.keys(safeFilters).every(column => {
                        const columnFilters = safeFilters[column];
    
                        // Special handling for each status
                        switch (column) {
                            case 'Untouched': {
                                const untouchedCount = getStatusCount(companyInfo, 'Untouched');
                                return columnFilters.includes(String(untouchedCount));
                            }
                            case 'Busy': {
                                const busyCount = getStatusCount(companyInfo, 'Busy');
                                return columnFilters.includes(String(busyCount));
                            }
                            case 'Not Picked Up': {
                                const notPickedUpCount = getStatusCount(companyInfo, 'Not Picked Up');
                                return columnFilters.includes(String(notPickedUpCount));
                            }
                            case 'Interested': {
                                const interestedCount = getStatusCount(companyInfo, 'Interested');
                                return columnFilters.includes(String(interestedCount));
                            }
                            case 'Followup': {
                                const followupCount = getStatusCount(companyInfo, 'Followup');
                                return columnFilters.includes(String(followupCount));
                            }
                            case 'Junk': {
                                const junkCount = getStatusCount(companyInfo, 'Junk');
                                return columnFilters.includes(String(junkCount));
                            }
                            case 'Matured': {
                                const maturedCount = getStatusCount(companyInfo, 'Matured');
                                return columnFilters.includes(String(maturedCount));
                            }
                            default: {
                                return columnFilters.includes(String(employee[column]));
                            }
                        }
                    });
    
                    return match;
                });
            }
    
            // Apply sorting based on `sortOrder` and the specified `column`
            if (sortOrder && column) {
                dataToSort = dataToSort.sort((a, b) => {
                    let valueA = a[column];
                    let valueB = b[column];
    
                    // Handle string sorting
                    if (typeof valueA === 'string' && typeof valueB === 'string') {
                        return sortOrder === 'ascending' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
                    }
                    // Handle number sorting
                    else if (typeof valueA === 'number' && typeof valueB === 'number') {
                        return sortOrder === 'ascending' ? valueA - valueB : valueB - valueA;
                    }
                    return 0;
                });
            }
        }
    
        onFilter(dataToSort); // Pass the filtered and sorted data back
    };
    
    const handleSelectAll = () => {
        setSelectedFilters(prevFilters => {
            const isAllSelected = prevFilters[filterField]?.length === columnValues.length;

            return {
                ...prevFilters,
                [filterField]: isAllSelected ? [] : [...columnValues]  // Deselect all if already selected, otherwise select all
            };
        });
    };
    console.log("completeData", completeData)
    const handleClearAll = async () => {
        setSelectedFilters(prevFilters => ({
            ...prevFilters,
            [filterField]: []
        }));
        onFilter(completeData);
        //fetchCompanyData()
        allFilterFields([])
        showingMenu(false)
    };


    return (
        <div>
            <div className="inco-filter">
                <div
                    className="inco-subFilter p-2"
                    onClick={(e) => handleSort("oldest")}
                >
                    <SwapVertIcon style={{ height: "16px" }} />
                    {filterField === "bookingDate" ||
                        filterField === "Company Number" ||
                        filterField === "caNumber" ||
                        filterField === "totalPaymentWGST" ||
                        filterField === "receivedPayment" ||
                        filterField === "achieved" ? "Ascending" : "Sort A TO Z"}
                </div>

                <div
                    className="inco-subFilter p-2"
                    onClick={(e) => handleSort("newest")}
                >
                    <SwapVertIcon style={{ height: "16px" }} />
                    {filterField === "bookingDate" ||
                        filterField === "Company Number" ||
                        filterField === "caNumber" ||
                        filterField === "totalPaymentWGST" ||
                        filterField === "receivedPayment" ||
                        filterField === "achieved" ? "Descending" : "Sort Z TO A"}
                </div>
                {/* <div className="inco-subFilter p-2"
                        onClick={(e) => handleSort("none")}>
                        <SwapVertIcon style={{ height: "16px" }} />
                        None
                    </div> */}
                <div className='w-100'>
                    <div className="inco-subFilter d-flex align-items-center">
                        <div className='filter-check' onClick={handleSelectAll}>
                            <input
                                type="checkbox"
                                checked={selectedFilters[filterField]?.length === columnValues.length}
                                readOnly
                                id='Select_All'
                            />
                        </div>
                        <label className="filter-val p-2" for="Select_All" onClick={handleSelectAll}>
                            Select All
                        </label>
                    </div>
                </div>
                <div className="inco_inner">
                    {columnValues.map(value => (
                        <div key={value} className="inco-subFilter d-flex align-items-center">
                            <div className='filter-check'>
                                <input
                                    type="checkbox"
                                    value={value}
                                    onChange={handleCheckboxChange}
                                    checked={selectedFilters[filterField]?.includes(String(value))}
                                    id={value}
                                />
                            </div>
                            <label className="filter-val p-2" for={value}>
                                {value}
                            </label>
                        </div>
                    ))}
                </div>
                <div className='d-flex align-items-center justify-content-between'>
                    <div className='w-50'>
                        <button className='filter-footer-btn btn-yellow'
                            style={{ backgroundColor: "#e7e5e0" }}
                            onClick={() => {
                                applyFilters(selectedFilters, filterField)
                                showingMenu(false)
                            }}>
                            Apply Filters
                        </button>
                    </div>
                    <div className='w-50'>
                        <button className='filter-footer-btn btn-yellow'
                            style={{ backgroundColor: "#e7e5e0" }}
                            onClick={() => {
                                handleClearAll()
                            }}>
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default FilterableTableEmployeeDataReport;

