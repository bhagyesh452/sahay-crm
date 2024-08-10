import React, { useEffect, useState } from 'react';
import SwapVertIcon from "@mui/icons-material/SwapVert";
import AddCircle from "@mui/icons-material/AddCircle.js";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

const FilterableTable = ({ data, filterField, onFilter, completeData, dataForFilter }) => {
    const [columnValues, setColumnValues] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [sortOrder, setSortOrder] = useState(null);

    const handleSort = (order) => {
        setSortOrder(order);
    };

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
        const value = e.target.value;
        setSelectedFilters(prevFilters =>
            prevFilters.includes(value)
                ? prevFilters.filter(filter => filter !== value)
                : [...prevFilters, value]
        );
    };

    console.log("selectedFilters", selectedFilters)

    useEffect(() => {
        if (filterField) {
            applyFilters(selectedFilters, filterField);
        }
    }, [selectedFilters, filterField ,sortOrder]);

    const applyFilters = (filters, column) => {
        let filteredData = dataForFilter;
    
        // Apply filters if there are selected filters
        if (filters.length > 0 && column) {
            filteredData = filteredData.filter(item => {
                if (column === 'receivedPayment') {
                    const payment = (
                        parseInt(
                            (item.paymentTerms === 'Full Advanced' ? item.totalPaymentWGST : item.firstPayment) || 0,
                            10
                        ) + parseInt(item.pendingRecievedPayment || 0, 10)
                    ).toLocaleString('en-IN');
                    return filters.includes(payment);
                }
                if (column === 'pendingPayment') {
                    const pendingPayment = (
                        parseInt(item.totalPaymentWGST || 0, 10) - (
                            parseInt(
                                (item.paymentTerms === 'Full Advanced' ? item.totalPaymentWGST : item.firstPayment) || 0,
                                10
                            ) + parseInt(item.pendingRecievedPayment || 0, 10)
                        )
                    ).toLocaleString('en-IN');
                    return filters.includes(pendingPayment);
                }
                return filters.includes(String(item[column]));
            });
        } else {
            // If no filters are selected, use completeData
            filteredData = completeData;
        }
    
        // Apply sorting based on sortOrder
        if (sortOrder && column === 'Company Name') {
            console.log("filte" , filteredData)
            filteredData = filteredData.sort((a, b) => {
                const nameA = a["Company Name"].toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Normalize and remove accents
                const nameB = b["Company Name"].toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Normalize and remove accents
                if (sortOrder === 'oldest') {
                    return nameA.localeCompare(nameB);
                } else if (sortOrder === 'newest') {
                    return nameB.localeCompare(nameA);
                }
                return 0;
            });
        }
    
        console.log("filteredData", filteredData);
        onFilter(filteredData);
    };
    

    return (
        <div>
            <div className="inco-filter">
                <div
                    className="inco-subFilter"
                    onClick={(e) => handleSort("oldest")}
                >
                    <SwapVertIcon style={{ height: "16px" }} />
                    Sort A TO Z
                </div>

                <div
                    className="inco-subFilter"
                    onClick={(e) => handleSort("newest")}
                >
                    <SwapVertIcon style={{ height: "16px" }} />
                    Sort Z TO A
                </div>
                {columnValues.map(value => (
                    <div key={value} className="inco-subFilter d-flex">
                        <div style={{ marginRight: "5px" }}>
                            <input
                                type="checkbox"
                                value={value}
                                onChange={handleCheckboxChange}
                            />
                        </div>
                        <div className="filter-val">
                            {value}
                        </div>
                    </div>
                ))}
                <div className="inco-subFilter">
                    <SwapVertIcon style={{ height: "16px" }} />
                    None
                </div>
            </div>
        </div>
    );
};

export default FilterableTable;
