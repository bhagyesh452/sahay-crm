import React, { useEffect, useState } from 'react';
import SwapVertIcon from "@mui/icons-material/SwapVert";

const FilterableTableEmployeeDataReport = ({
    filterField,
    filteredData,
    onFilter,
    completeData,
    companyData,
    dataForFilter,
    allFilterFields,
    showingMenu,
}) => {

    // console.log("Filter field is :", filterField);
    // console.log("completeData", completeData);

    const [columnValues, setColumnValues] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState({});
    const [sortOrder, setSortOrder] = useState(null);

    // Handle sorting logic
    const handleSort = (order) => {
        setSortOrder(order);
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
                        case 'Untouched':
                            return companyInfo.statusCounts?.find(statusObj => statusObj.status === 'Untouched')?.count ?? 0;
                        case 'Busy': {
                            return companyInfo.statusCounts?.find(statusObj => statusObj.status === 'Busy')?.count ?? 0;
                        }
                        case 'Not Picked Up': {
                            return companyInfo.statusCounts?.find(statusObj => statusObj.status === 'Not Picked Up')?.count ?? 0;
                        }
                        case 'Junk': {
                            return companyInfo.statusCounts?.find(statusObj => statusObj.status === 'Junk')?.count ?? 0;
                        }
                        case 'FollowUp': {
                            return companyInfo.statusCounts?.find(statusObj => statusObj.status === 'FollowUp')?.count ?? 0;
                        }
                        case 'Interested': {
                            return companyInfo.statusCounts?.find(statusObj => statusObj.status === 'Interested')?.count ?? 0;
                        }
                        case 'Not Interested': {
                            return companyInfo.statusCounts?.find(statusObj => statusObj.status === 'Not Interested')?.count ?? 0;
                        }
                        case 'Matured': {
                            return companyInfo.statusCounts?.find(statusObj => statusObj.status === 'Matured')?.count ?? 0;
                        }
                        case 'ename': {
                            return employee.ename ?? '';
                        }
                        default: {
                            return companyInfo[filterField]; // Return the value from company data for other fields
                        }
                    }
                }
                return null;
            }).filter(value => value !== null && value !== undefined); // Filter out any falsy values (e.g., null)
        };
        
        const values = filteredData?.length ? getValues(filteredData) : getValues(dataForFilter);
        setColumnValues([...new Set(values)]);
    }, [filterField, filteredData, dataForFilter, companyData]);

    const handleCheckboxChange = (e) => {
        const value = String(e.target.value); // Ensure value is a string for consistent comparison

        setSelectedFilters(prevFilters => {
            const updatedFilters = { ...prevFilters };
            const filtersAsString = updatedFilters[filterField] || [];

            if (filtersAsString.includes(value)) {
                updatedFilters[filterField] = filtersAsString.filter(filter => filter !== value);
            } else {
                updatedFilters[filterField] = [...filtersAsString, value];
            }
            return updatedFilters;
        });
    };

    const applyFilters = (filters, column) => {
        const safeFilters = filters || {};
        let dataToSort = filteredData?.length ? [...filteredData] : [...dataForFilter];

        const allSelectedFilters = Object.values(safeFilters).flat();

        if (allSelectedFilters.length > 0) {
            dataToSort = dataToSort.filter(employee => {
                return Object.keys(safeFilters).every(filterColumn => {
                    const columnFilters = safeFilters[filterColumn];
                    if (filterColumn === 'ename') {
                        return columnFilters.includes(employee.ename);
                    }
                    const companyInfo = companyData.find(company => company._id === employee.ename);
                    const statusCount = companyInfo?.statusCounts?.find(statusObj => statusObj.status === filterColumn)?.count ?? 0;
                    return columnFilters.includes(String(statusCount));
                });
            });
        }

        if (sortOrder) {
            dataToSort = dataToSort.sort((a, b) => {
                if (filterField === 'ename') { // Handle name sorting
                    const nameA = a.ename?.toLowerCase() || '';
                    const nameB = b.ename?.toLowerCase() || '';
                    return sortOrder === 'ascending' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
                }
                const companyA = companyData.find(company => company._id === a.ename);
                const companyB = companyData.find(company => company._id === b.ename);
                const valueA = companyA?.statusCounts?.find(statusObj => statusObj.status === filterField)?.count ?? 0;
                const valueB = companyB?.statusCounts?.find(statusObj => statusObj.status === filterField)?.count ?? 0;
                return sortOrder === 'ascending' ? valueA - valueB : valueB - valueA;
            });
        }
        onFilter(dataToSort);
    };

    const handleSelectAll = () => {
        setSelectedFilters(prevFilters => {
            const isAllSelected = prevFilters[filterField]?.length === columnValues.length;
            return {
                ...prevFilters,
                [filterField]: isAllSelected ? [] : columnValues.map(String) // Ensure values are strings
            };
        });
    };

    const handleClearAll = async () => {
        setSelectedFilters(prevFilters => ({
            ...prevFilters,
            [filterField]: []
        }));
        onFilter(completeData);
        allFilterFields([])
        showingMenu(false)
    };

    return (
        <div>
            <div className="inco-filter">

                <div className="inco-subFilter p-2" onClick={(e) => handleSort("ascending")}>
                    <SwapVertIcon style={{ height: "16px" }} />
                    {filterField === 'ename' ? "Sort A TO Z" : "Ascending"}
                </div>

                <div className="inco-subFilter p-2" onClick={(e) => handleSort("descending")}>
                    <SwapVertIcon style={{ height: "16px" }} />
                    {filterField === 'ename' ? "Sort Z TO A" : "Descending"}
                </div>

                <div className='w-100'>
                    <div className="inco-subFilter d-flex align-items-center">
                        <div className='filter-check' onClick={handleSelectAll}>
                            <input
                                type="checkbox"
                                checked={selectedFilters[filterField]?.length === columnValues.length}
                                readOnly
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
                        <button className='filter-footer-btn btn-yellow' style={{ backgroundColor: "#e7e5e0" }}
                            onClick={() => {
                                applyFilters(selectedFilters, filterField)
                                showingMenu(false)
                            }}
                        >
                            Apply Filters
                        </button>
                    </div>

                    <div className='w-50'>
                        <button className='filter-footer-btn btn-yellow' style={{ backgroundColor: "#e7e5e0" }} onClick={handleClearAll}>
                            Clear Filters
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default FilterableTableEmployeeDataReport;