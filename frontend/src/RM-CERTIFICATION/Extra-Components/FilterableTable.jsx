import React, { useEffect, useState } from 'react';
import SwapVertIcon from "@mui/icons-material/SwapVert";
import AddCircle from "@mui/icons-material/AddCircle.js";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

const FilterableTable = ({ data, filterField, onFilter, completeData, dataForFilter,activeFilters  }) => {
    const [columnValues, setColumnValues] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [sortOrder, setSortOrder] = useState(null);

    const handleSort = (order) => {
        if (order === "none") {
            setSortOrder(null); // Clear the sort order
            applyFilters(selectedFilters, filterField); // Reapply filters without sorting
        } else {
            setSortOrder(order);
        }
    };

    useEffect(() => {
        applyFilters();
    }, [activeFilters, sortOrder]);

    useEffect(() => {
        if (filterField) {
            const values = dataForFilter.map(item => {
                // Handle dynamic calculation for 'received Payment'
                if (filterField === 'receivedPayment') {
                    const payment = (
                        parseInt(
                            (item.paymentTerms === 'Full Advanced' ? item.totalPaymentWGST : item.firstPayment) || 0,
                            10
                        ) + parseInt(item.pendingRecievedPayment || 0, 10)
                    ).toLocaleString('en-IN');
                    return payment;
                }
                // Handle dynamic calculation for 'Pending Payment'
                if (filterField === 'pendingPayment') {
                    const pendingPayment = (
                        parseInt(item.totalPaymentWGST || 0, 10) - (
                            parseInt(
                                (item.paymentTerms === 'Full Advanced' ? item.totalPaymentWGST : item.firstPayment) || 0,
                                10
                            ) + parseInt(item.pendingRecievedPayment || 0, 10)
                        )
                    ).toLocaleString('en-IN');
                    return pendingPayment;
                }
                return item[filterField];
            }).filter(Boolean);
            setColumnValues([...new Set(values)]); // Ensure unique values
        }


    }, [filterField, data]);

    const handleCheckboxChange = (e) => {
        const value = e.target.value; // Checkbox value
        const valueAsString = String(value); // Convert to string for consistent comparison

        setSelectedFilters(prevFilters => {
            const filtersAsString = prevFilters.map(val => String(val)); // Convert existing filters to string

            return filtersAsString.includes(valueAsString)
                ? prevFilters.filter(filter => String(filter) !== valueAsString)
                : [...prevFilters, value];
        });
    };

    console.log("selectedFilters", selectedFilters)

    useEffect(() => {
        if (filterField) {
            applyFilters(selectedFilters, filterField);
        }
    }, [selectedFilters, filterField, sortOrder]);

    const applyFilters = (filters, column) => {
        // Ensure filters is always an array
        const safeFilters = Array.isArray(filters) ? filters : [];
        
        // Start with the data to be filtered
        let dataToSort = dataForFilter.map(item => {
            // Add numeric fields for sorting
            const receivedPayment = (
                parseInt(
                    (item.paymentTerms === 'Full Advanced' ? item.totalPaymentWGST : item.firstPayment) || 0,
                    10
                ) + parseInt(item.pendingRecievedPayment || 0, 10)
            );
            const pendingPayment = (
                parseInt(item.totalPaymentWGST || 0, 10) - (
                    parseInt(
                        (item.paymentTerms === 'Full Advanced' ? item.totalPaymentWGST : item.firstPayment) || 0,
                        10
                    ) + parseInt(item.pendingRecievedPayment || 0, 10)
                )
            );
    
            return {
                ...item,
                receivedPayment,
                pendingPayment
            };
        });
    
        // Apply filters if there are selected filters
        if (safeFilters.length > 0 && column) {
            dataToSort = dataToSort.filter(item => {
                if (column === 'receivedPayment') {
                    const payment = item.receivedPayment.toLocaleString('en-IN');
                    return safeFilters.includes(payment);
                }
                if (column === 'pendingPayment') {
                    const pendingPayment = item.pendingPayment.toLocaleString('en-IN');
                    return safeFilters.includes(pendingPayment);
                }
                return safeFilters.includes(String(item[column]));
            });
        } else {
            // If no filters are selected, use completeData
            dataToSort = completeData.map(item => {
                const receivedPayment = (
                    parseInt(
                        (item.paymentTerms === 'Full Advanced' ? item.totalPaymentWGST : item.firstPayment) || 0,
                        10
                    ) + parseInt(item.pendingRecievedPayment || 0, 10)
                );
                const pendingPayment = (
                    parseInt(item.totalPaymentWGST || 0, 10) - (
                        parseInt(
                            (item.paymentTerms === 'Full Advanced' ? item.totalPaymentWGST : item.firstPayment) || 0,
                            10
                        ) + parseInt(item.pendingRecievedPayment || 0, 10)
                    )
                );
    
                return {
                    ...item,
                    receivedPayment,
                    pendingPayment
                };
            });
        }
    
        // Apply sorting based on sortOrder
        if (sortOrder && column) {
            dataToSort = dataToSort.sort((a, b) => {
                let valueA = a[column];
                let valueB = b[column];
    
                // Handle date sorting
                if (column === 'bookingDate') {
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
    
        // Debugging: Check the filtered data
        console.log("Filtered Data:", dataToSort);
        onFilter(dataToSort);
    };
    
    
    



    const handleSelectAll = () => {
        if (selectedFilters.length === columnValues.length) {
            setSelectedFilters([]);
        } else {
            setSelectedFilters(columnValues.map(val => String(val)));
        }
    };

    const handleClearAll = () => {
        setSelectedFilters([]);
        onFilter(completeData)
    };



    return (
        <div>
            <div className="inco-filter">
                <div
                    className="inco-subFilter"
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
                    className="inco-subFilter"
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
                <div className='d-flex'>
                    <div className="inco-subFilter d-flex">
                        <div style={{ marginRight: "5px" }} onClick={handleSelectAll}>
                            <input
                                type="checkbox"
                                checked={selectedFilters.length === columnValues.length}
                                readOnly
                            />
                        </div>
                        <div className="filter-val">
                            Select All
                        </div>
                    </div>
                    <div className="inco-subFilter d-flex">
                        <div style={{ marginRight: "5px" }}>
                            <input
                                type="checkbox"
                                checked={selectedFilters.length === 0}
                                onChange={handleClearAll}
                            />
                        </div>
                        <div className="filter-val">
                            Clear All
                        </div>
                    </div>
                </div>
                {columnValues.map(value => (
                    <div key={value} className="inco-subFilter d-flex">
                        <div style={{ marginRight: "5px" }}>
                            <input
                                type="checkbox"
                                value={value}
                                onChange={handleCheckboxChange}
                                checked={selectedFilters.map(val => String(val)).includes(String(value))} // Convert for comparison
                            />
                        </div>
                        <div className="filter-val">
                            {value}
                        </div>
                    </div>
                ))}
                <div className="inco-subFilter"
                    onClick={(e) => handleSort("none")}>
                    <SwapVertIcon style={{ height: "16px" }} />
                    None
                </div>
            </div>
        </div >
    );
};

export default FilterableTable;