import React, { useEffect, useState } from 'react';
import SwapVertIcon from "@mui/icons-material/SwapVert";

function EmployeeFilter({ noofItems, allFilterFields, filteredData, filterField, onFilter, completeData, showingMenu, dataForFilter }) {

    const [columnValues, setColumnValues] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState({});
    const [sortOrder, setSortOrder] = useState(null);

    function formatDatePro(inputDate) {
        const date = new Date(inputDate);
        const day = date.getDate();
        const month = date.toLocaleString('en-US', { month: 'long' });
        const year = date.getFullYear();
        return `${day} ${month}, ${year}`;
    }

    const handleSort = (order) => {
        if (order === "none") {
            setSortOrder(null); // Clear the sort order
            applyFilters(selectedFilters, filterField); // Reapply filters without sorting
        } else {
            setSortOrder(order);
            applyFilters(selectedFilters, filterField);
        }
    };

    console.log("data to filter :", dataForFilter);

    useEffect(() => {
        if (filteredData && filteredData.length !== 0) {

            const values = filteredData.map(item => {
                if (filterField === 'jdate' || filterField === "AddedOn" || filterField === "deletedDate") {
                    const submittedDate = formatDatePro(item[filterField]); // Convert date to string (ignoring time)
                    return submittedDate;
                }
                return item[filterField];
            }).filter(Boolean);
            setColumnValues([...new Set(values)]); // Ensure unique values
        } else {
            const values = dataForFilter.map(item => {
                if (filterField === 'jdate' || filterField === "AddedOn" || filterField === "deletedDate") {
                    const submittedDate = formatDatePro(item[filterField]); // Convert date to string (ignoring time)
                    return submittedDate;
                }
                return item[filterField];
            }).filter(Boolean);
            setColumnValues([...new Set(values)]); // Ensure unique values
        }
    }, [filterField, filteredData]);

    // console.log("selectedFilters", selectedFilters);
    // console.log("columnValues", columnValues);

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
        let numberOfFilteredItems = 0;
        // Combine all filters across different filter fields
        const allSelectedFilters = Object.values(safeFilters).flat();

        // Start with the data to be filtered
        if (filteredData && filteredData.length !== 0) {
            dataToSort = filteredData.map(item => {
                return {
                    ...item,
                    AddedOn: formatDatePro(item.AddedOn),
                    jdate: formatDatePro(item.jdate),
                    deletedDate: formatDatePro(item.deletedDate)
                };
            });

            // Apply filters if there are selected filters
            if (allSelectedFilters.length > 0) {
                allFilterFields(prevFields => {
                    return [...prevFields, column];
                });

                dataToSort = dataToSort.filter(item => {
                    const match = Object.keys(safeFilters).every(column => {
                        const columnFilters = safeFilters[column];

                        if (column === 'AddedOn') {
                            const addedDate = formatDatePro(item.AddedOn);
                            return columnFilters.includes(addedDate);
                        }
                        if (column === 'jdate') {
                            const joiningDate = formatDatePro(item.jdate);
                            return columnFilters.includes(joiningDate);
                        }
                        if (column === 'deletedDate') {
                            const deletedDate = formatDatePro(item.deletedDate);
                            return columnFilters.includes(deletedDate);
                        }
                        return columnFilters.includes(String(item[column]));
                    });
                    return match;
                });
                numberOfFilteredItems = dataToSort ? dataToSort.length : 0;
                noofItems(numberOfFilteredItems)
            }

            // Apply sorting based on sortOrder
            if (sortOrder && column) {
                dataToSort = dataToSort.sort((a, b) => {
                    let valueA = a[column];
                    let valueB = b[column];

                    // Handle date sorting
                    if (column === 'AddedOn' || column === "jdate" || filterField === "deletedDate") {
                        const dateA = new Date(valueA);
                        const dateB = new Date(valueB);
                        if (sortOrder === 'oldest') {
                            return dateA - dateB; // Sort from oldest to newest
                        } else if (sortOrder === 'newest') {
                            return dateB - dateA; // Sort from newest to oldest
                        }
                    }

                    // Handle numeric fields
                    if (column === 'receivedPayment' || column === 'pendingPayment') {
                        valueA = valueA !== undefined ? valueA : 0;
                        valueB = valueB !== undefined ? valueB : 0;
                    } else {
                        valueA = typeof valueA === 'string'
                            ? valueA.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                            : valueA;
                        valueB = typeof valueB === 'string'
                            ? valueB.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                            : valueB;
                    }

                    // Handle other types
                    if (typeof valueA === 'string' && typeof valueB === 'string') {
                        return sortOrder === 'oldest' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
                    } else if (typeof valueA === 'number' && typeof valueB === 'number') {
                        return sortOrder === 'oldest' ? valueA - valueB : valueB - valueA;
                    }
                    return 0;
                });
            }
        } else {
            dataToSort = dataForFilter.map(item => {
                return {
                    ...item,
                    AddedOn: formatDatePro(item.AddedOn),
                    jdate: formatDatePro(item.jdate),
                    deletedDate: formatDatePro(item.deletedDate)
                };
            });

            // Apply filters if there are selected filters
            if (allSelectedFilters.length > 0) {
                allFilterFields(prevFields => {
                    return [...prevFields, column];
                });

                dataToSort = dataToSort.filter(item => {
                    const match = Object.keys(safeFilters).every(column => {
                        const columnFilters = safeFilters[column];

                        if (column === 'AddedOn') {
                            const addedDate = formatDatePro(item.AddedOn);
                            return columnFilters.includes(addedDate);
                        }
                        if (column === 'jdate') {
                            const joiningDate = formatDatePro(item.jdate);
                            return columnFilters.includes(joiningDate);
                        }
                        if (column === 'deletedDate') {
                            const deletedDate = formatDatePro(item.deletedDate);
                            return columnFilters.includes(deletedDate);
                        }
                        return columnFilters.includes(String(item[column]));
                    });
                    return match;
                });
                numberOfFilteredItems = dataToSort ? dataToSort.length : 0;
                noofItems(numberOfFilteredItems)
            }

            // Apply sorting based on sortOrder
            if (sortOrder && column) {
                dataToSort = dataToSort.sort((a, b) => {
                    let valueA = a[column];
                    let valueB = b[column];

                    // Handle date sorting
                    if (column === 'AddedOn' || column === "jdate" || filterField === "deletedDate") {
                        const dateA = new Date(valueA);
                        const dateB = new Date(valueB);
                        if (sortOrder === 'oldest') {
                            return dateA - dateB; // Sort from oldest to newest
                        } else if (sortOrder === 'newest') {
                            return dateB - dateA; // Sort from newest to oldest
                        }
                    }

                    // Handle numeric fields
                    if (column === 'receivedPayment' || column === 'pendingPayment') {
                        valueA = valueA !== undefined ? valueA : 0;
                        valueB = valueB !== undefined ? valueB : 0;
                    } else {
                        valueA = typeof valueA === 'string'
                            ? valueA.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                            : valueA;
                        valueB = typeof valueB === 'string'
                            ? valueB.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                            : valueB;
                    }

                    // Handle other types
                    if (typeof valueA === 'string' && typeof valueB === 'string') {
                        return sortOrder === 'oldest' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
                    } else if (typeof valueA === 'number' && typeof valueB === 'number') {
                        return sortOrder === 'oldest' ? valueA - valueB : valueB - valueA;
                    }
                    return 0;
                });
            }
        }
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

    // Example of logging the length of the selected filters for a specific field
    //console.log(selectedFilters[filterField]?.length, columnValues.length);

    const handleClearAll = async () => {
        setSelectedFilters(prevFilters => ({
            ...prevFilters,
            [filterField]: []
        }));
        onFilter(completeData);
        showingMenu(false);
        allFilterFields([]);
    };

    return (
        <div>
            <div className="inco-filter">
                <div
                    className="inco-subFilter p-2"
                    onClick={(e) => handleSort("oldest")}
                >
                    <SwapVertIcon style={{ height: "16px" }} />
                    {filterField === "ename" ||
                        filterField === "number" ||
                        filterField === "email" ||
                        filterField === "newDesignation" ||
                        filterField === "branchOffice" ||
                        filterField === "jdate" ||
                        filterField === "AddedOn" ||
                        filterField === "deletedDate" ||
                        filterField === "Active" ? "Ascending" : "Sort A TO Z"}
                </div>

                <div
                    className="inco-subFilter p-2"
                    onClick={(e) => handleSort("newest")}
                >
                    <SwapVertIcon style={{ height: "16px" }} />
                    {filterField === "ename" ||
                        filterField === "number" ||
                        filterField === "email" ||
                        filterField === "newDesignation" ||
                        filterField === "branchOffice" ||
                        filterField === "jdate" ||
                        filterField === "AddedOn" ||
                        filterField === "deletedDate" ||
                        filterField === "Active" ? "Descending" : "Sort Z TO A"}
                </div>

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
                                {filterField === "AddedOn" ? formatDatePro(value)
                                    : filterField === "jdate" ? formatDatePro(value) 
                                    : filterField === "deletedDate" ? formatDatePro(value) 
                                    : value}
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
}

export default EmployeeFilter;