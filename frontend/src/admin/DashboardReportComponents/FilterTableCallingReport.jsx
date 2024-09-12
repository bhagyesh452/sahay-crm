import React, { useEffect, useState } from 'react';
import SwapVertIcon from "@mui/icons-material/SwapVert";
import AddCircle from "@mui/icons-material/AddCircle.js";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import axios from "axios";

const FilterTableCallingReport = ({
    activeTab,
    filteredData,
    data,
    filterField,
    onFilter,
    completeData,
    dataForFilter,
    activeFilters,
    allFilterFields,
    employeeData,
    // noofItems,
    showingMenu }) => {
    const [columnValues, setColumnValues] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState({});
    const [sortOrder, setSortOrder] = useState(null);
    const secretKey = process.env.REACT_APP_SECRET_KEY;

    const formatDuration = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return [
            hours.toString().padStart(2, '0'),
            minutes.toString().padStart(2, '0'),
            seconds.toString().padStart(2, '0'),
        ].join(':');
    };
    const formatDateTime = (dateTime) => {
        // Remove the ' IST' part from the string (or any other timezone indicator)
        const cleanedDateTime = dateTime.replace(' IST', '').replace(' UTC', '');

        // Create a new Date object from the cleaned string
        const date = new Date(cleanedDateTime);

        // If the date is invalid, return the original string (as fallback)
        if (isNaN(date.getTime())) {
            return dateTime; // If it cannot parse the date, return the original value
        }

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    };



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
    console.log("employeeData", employeeData)

    useEffect(() => {
        const getValues = (dataSource) => {
            return dataSource.map(item => {
                // Handle dynamic filtering for 'emp_name'
                if (filterField === "emp_name") {
                    // Check if the employee number exists in employeeData
                    const employeeExists = employeeData.some(
                        (data) => Number(data.number) === Number(item.emp_number)
                    );
                    return employeeExists ? item.emp_name : null; // Return the employee name if exists
                }
                // Handle dynamic filtering for 'branchOffice'
                if (filterField === "branchOffice") {
                    const employee = employeeData.find(
                        (data) => Number(data.number) === Number(item.emp_number)
                    );
                    return employee ? employee.branchOffice : null; // Return the branchOffice if exists
                }
                // Handle dynamic filtering for 'total_duration'
                if (filterField === "total_duration") {
                    const durationInSeconds = item.total_duration; // Assuming duration is in seconds
                    return formatDuration(durationInSeconds); // Convert to hh:mm:ss
                }
                // Handle dynamic filtering for 'last_call_log.synced_at'
                if (filterField === "last_call_log.synced_at") {
                    return formatDateTime(item.last_call_log.synced_at); // Convert to DD-MM-YYYY HH:mm:ss
                }
                return item[filterField]; // Return the filtered field's value
            }).filter(Boolean); // Filter out any falsy values (e.g., null)
        };

        if (filteredData && filteredData.length !== 0) {
            const values = getValues(filteredData);
            setColumnValues([...new Set(values)]); // Set unique values
        } else {
            const values = getValues(dataForFilter);
            setColumnValues([...new Set(values)]); // Set unique values
        }
    }, [filterField, filteredData, dataForFilter, employeeData]);



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

    // useEffect(() => {
    //     if (filterField) {
    //         applyFilters(selectedFilters, filterField);
    //     }
    // }, [selectedFilters, filterField, sortOrder]);

    const applyFilters = (filters, column) => {
        // Ensure filters is always an object
        const safeFilters = filters || {};
        let dataToSort;

        // Combine all filters across different filter fields
        const allSelectedFilters = Object.values(safeFilters).flat();

        // Function to format `last_call_log.synced_at` correctly
        const parseSyncedAt = (syncedAt) => {
            const cleanedDateTime = syncedAt ? syncedAt.replace(' IST', '') : null;
            return cleanedDateTime ? new Date(cleanedDateTime) : null;
        };

        // Start with the data to be filtered
        if (filteredData && filteredData.length !== 0) {
            dataToSort = filteredData.map(item => {
                // Add numeric fields for sorting

                return {
                    ...item,
                    parsedSyncedAt: parseSyncedAt(item.last_call_log?.synced_at) // Add parsed date for `synced_at`
                };
            });

            // Apply filters if there are selected filters
            if (allSelectedFilters.length > 0) {
                // Update the active filter fields array
                allFilterFields(prevFields => {

                    // Add the field if it's not active
                    return [...prevFields, column];

                });
                dataToSort = dataToSort.filter(item => {
                    const match = Object.keys(safeFilters).every(column => {
                        const columnFilters = safeFilters[column];
                        if (column === 'branchOffice') {
                            // Get branch office from employeeData based on emp_number
                            const employee = employeeData.find(
                                (data) => Number(data.number) === Number(item.emp_number)
                            );
                            if (employee && columnFilters.includes(employee.branchOffice)) {
                                return true;
                            }
                            return false;
                        }
                        if (column === 'total_duration') {
                            const formattedDuration = formatDuration(item.total_duration);
                            return columnFilters.includes(formattedDuration);
                        }
                        if (column === 'last_call_log.synced_at') {
                            const formattedDate = formatDateTime(item.last_call_log?.synced_at); // Use your formatting logic
                            return columnFilters.includes(formattedDate);
                        }
                        return columnFilters.includes(String(item[column]));
                    });


                    return match;
                });
            }
            // Apply sorting based on sortOrder
            if (sortOrder && column) {
                dataToSort = dataToSort.sort((a, b) => {
                    let valueA = a[column];
                    let valueB = b[column];

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
                   
                    parsedSyncedAt: parseSyncedAt(item.last_call_log?.synced_at)
                };
            });

            // Apply filters if there are selected filters
            if (allSelectedFilters.length > 0) {
                allFilterFields(prevFields => {

                    // Add the field if it's not active
                    return [...prevFields, column];

                });
                dataToSort = dataToSort.filter(item => {
                    const match = Object.keys(safeFilters).every(column => {
                        const columnFilters = safeFilters[column];
                        if (column === 'branchOffice') {
                            // Get branch office from employeeData based on emp_number
                            const employee = employeeData.find(
                                (data) => Number(data.number) === Number(item.emp_number)
                            );
                            if (employee && columnFilters.includes(employee.branchOffice)) {
                                return true;
                            }
                            return false;
                        }
                        if (column === 'total_duration') {
                            const formattedDuration = formatDuration(item.total_duration);
                            return columnFilters.includes(formattedDuration);
                        }
                        if (column === 'last_call_log.synced_at') {
                            const formattedDate = formatDateTime(item.last_call_log?.synced_at); // Use your formatting logic
                            return columnFilters.includes(formattedDate);
                        }
                        return columnFilters.includes(String(item[column]));
                    });
                    return match;
                });
                // numberOfFilteredItems = dataToSort ? dataToSort.length : 0;
                // noofItems(numberOfFilteredItems)
            }

            // Apply sorting based on sortOrder
            if (sortOrder && column) {
                dataToSort = dataToSort.sort((a, b) => {
                    let valueA = a[column];
                    let valueB = b[column];

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
    console.log(selectedFilters[filterField]?.length, columnValues.length);

    const handleClearAll = async () => {
        setSelectedFilters(prevFilters => ({
            ...prevFilters,
            [filterField]: []
        }));
        onFilter(completeData);
        allFilterFields([])
        showingMenu(false)
        // noofItems(0)
        // } catch (error) {
        //     console.error("Error fetching complete data", error.message);
        // }
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
                        filterField === "pendingPayment" ? "Ascending" : "Sort A TO Z"}
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
                        filterField === "pendingPayment" ? "Descending" : "Sort Z TO A"}
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

export default FilterTableCallingReport;

