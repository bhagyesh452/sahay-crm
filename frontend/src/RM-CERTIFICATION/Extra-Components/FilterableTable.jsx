import React, { useState, useEffect } from 'react';
import SwapVertIcon from "@mui/icons-material/SwapVert";


const FilterableTable = ({ data, onFilter, filterField }) => {
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [columnValues, setColumnValues] = useState([]);

    useEffect(() => {
        if (filterField) {
            console.log("filterField", filterField)
            if (filterField === "Company Name") {
                const values = data.map(item => item["Company Name"]);
                console.log("Values", values)

                setColumnValues(values);
            }

        } else {
            setColumnValues([]);
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

    const handleFilterChange = (e) => {
        const text = e.target.value;
        applyFilters(selectedFilters, filterField, text);
    };

    const applyFilters = (filters, column, text = '') => {
        let filteredData = data;

        if (column) {
            filteredData = filteredData.filter(item =>
                filters.length === 0 || filters.includes(String(item[column]))
            );
        }

        if (text) {
            filteredData = filteredData.filter(item =>
                String(item[column]).toLowerCase().includes(text.toLowerCase())
            );
        }

        onFilter(filteredData);
    };

    return (
        <div className="filter-container">
            {filterField && (
                <>
                    <label htmlFor="filter-input">Filter Text:</label>
                    <input
                        id="filter-input"
                        type="text"
                        onChange={handleFilterChange}
                        placeholder="Type to filter..."
                    />
                    <label>Filter Options for {filterField}:</label>
                    <div className="checkbox-group">
                        {columnValues.map((value, index) => (
                            <div key={index} className="checkbox-item">
                                <input
                                    type="checkbox"
                                    value={value}
                                    checked={selectedFilters.includes(value)}
                                    onChange={handleCheckboxChange}
                                />
                                <label>{value}</label>
                            </div>
                        ))}
                    </div>

                </>
            )}
        </div>
    );
};

export default FilterableTable;
