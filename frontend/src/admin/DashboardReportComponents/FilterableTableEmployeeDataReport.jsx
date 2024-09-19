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
        const safeFilters = filters || {};
        let dataToSort = filteredData && filteredData.length !== 0 ? [...filteredData] : [...dataForFilter];
    
        // Function to get status count for a specific company and status
        const getStatusCount = (companyInfo, status) => {
            const statusObj = companyInfo?.statusCounts?.find(statusObj => statusObj.status === status);
            return statusObj ? statusObj.count : null;
        };
    
        // Apply filters if any are selected
        if (Object.keys(safeFilters).length > 0) {
            allFilterFields(prevFields => [...prevFields, column]);
    
            dataToSort = dataToSort.filter(employee => {
                const companyInfo = companyData.find(company => company._id === employee.ename);
                return companyInfo && Object.keys(safeFilters).every(column => {
                    const columnFilters = safeFilters[column];
    
                    // Special handling for statuses
                    switch (column) {
                        case 'Untouched':
                        case 'Busy':
                        case 'Not Picked Up':
                        case 'Interested':
                        case 'Followup':
                        case 'Junk':
                        case 'Matured': {
                            const count = getStatusCount(companyInfo, column);
                            return columnFilters.includes(String(count));
                        }
                        default:
                            return columnFilters.includes(String(employee[column]));
                    }
                });
            });
        }
    
        // Sorting logic
        if (sortOrder && column) {
            dataToSort = dataToSort.sort((a, b) => {
                const companyA = companyData.find(company => company._id === a.ename);
                const companyB = companyData.find(company => company._id === b.ename);
    
                let valueA, valueB;
    
                // Compute status counts for sorting
                const getCountForSort = (company, column) => {
                    if (!company) return '';
                    switch (column) {
                        case 'UntouchedCount': return getStatusCount(company, 'Untouched');
                        case 'BusyCount': return getStatusCount(company, 'Busy');
                        case 'NotPickedUpCount': return getStatusCount(company, 'Not Picked Up');
                        case 'InterestedCount': return getStatusCount(company, 'Interested');
                        case 'FollowupCount': return getStatusCount(company, 'Followup');
                        case 'JunkCount': return getStatusCount(company, 'Junk');
                        case 'MaturedCount': return getStatusCount(company, 'Matured');
                        default: return company[column] !== undefined && company[column] !== null ? company[column] : '';
                    }
                };
    
                valueA = getCountForSort(companyA, column);
                valueB = getCountForSort(companyB, column);
    
                // Handle sorting logic
                if (typeof valueA === 'string' && typeof valueB === 'string') {
                    return sortOrder === 'ascending'
                        ? valueA.localeCompare(valueB)
                        : valueB.localeCompare(valueA);
                } else if (typeof valueA === 'number' && typeof valueB === 'number') {
                    return sortOrder === 'ascending' ? valueA - valueB : valueB - valueA;
                } else {
                    return 0;
                }
            });
        }
    
        // Pass the filtered and sorted data back
        onFilter(dataToSort);
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
                    {
                        filterField === "Untouched" ||
                            filterField === "Not Interested" ||
                            filterField === "Junk" ||
                            filterField === "Interested" ||
                            filterField === "FollowUp" ||
                            filterField === "Matured" ?
                            "Ascending" : "Sort A TO Z"
                    }
                </div>

                <div
                    className="inco-subFilter p-2"
                    onClick={(e) => handleSort("newest")}
                >
                    <SwapVertIcon style={{ height: "16px" }} />
                    {
                        filterField === "Untouched" ||
                            filterField === "Not Interested" ||
                            filterField === "Junk" ||
                            filterField === "Interested" ||
                            filterField === "FollowUp" ||
                            filterField === "Matured" ?
                            "Descending" : "Sort Z TO A"
                    }
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

