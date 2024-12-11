import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SwapVertIcon from "@mui/icons-material/SwapVert";

const MonthWiseEmployeePerformanceReportFilter = ({
    filterField,
    filteredData,
    onFilter,
    completeData,
    empPerformanceData,
    dataForFilter,
    allFilterFields,
    showingMenu,
    selectedYears,
    setSelectedMonths,
    selectedMonths,
    setSelectedYears
}) => {

    // console.log("Filter field is :", filterField);
    // console.log("completeData", completeData);

    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().toLocaleString("default", { month: "long" });

    const monthsArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const yearsArray = [];
    for (let i = 2023; i <= new Date().getFullYear(); i++) {
        yearsArray.push(i);
    }

    const [columnValues, setColumnValues] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState({});
    const [sortOrder, setSortOrder] = useState(null);

    const handleMonthsAndYearsCheckbox = (e, type) => {
        const value = type === "year" ? parseInt(e.target.value, 10) : e.target.value; // Ensure correct type
        const checked = e.target.checked;

        if (type === "month") {
            setSelectedMonths((prev) =>
                checked ? [...prev, value] : prev.filter((month) => month !== value)
            );
        } else if (type === "year") {
            setSelectedYears((prev) =>
                checked ? [...prev, value] : prev.filter((year) => year !== value)
            );
        }
    };

    const fetchEmployeePerformanceReport = async () => {
        try {
            const res = await axios.get(`${secretKey}/employee/monthWisePerformanceReport`, {
                params: {
                    months: selectedMonths,
                    years: selectedYears,
                    employees: filteredData.map((employee) => employee.name),
                }
            });

            // console.log("Performance data is :", res.data.data);
            onFilter(res.data.data);
        } catch (error) {
            console.log("Error fetching performance data", error);
        }
    };

    // useEffect(() => {
    //     console.log("Selected Months:", selectedMonths);
    //     console.log("Selected Years:", selectedYears);
    // }, [selectedMonths, selectedYears]);

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
                if (empPerformanceData) {
                    // Look for each status in the statusCounts array of the companyInfo
                    switch (filterField) {
                        case 'name': {
                            return employee.name ?? '';
                        }
                        case 'branch': {
                            return employee.branch ?? '';
                        }
                        case 'amount': {
                            return employee.performance[0].amount ?? 0;
                        }
                        case 'achievedAmount': {
                            return employee.performance[0].achievedAmount ?? 0;
                        }
                        case 'ratio': {
                            return employee.performance[0].ratio ?? 0;
                        }
                        case 'result': {
                            return employee.performance[0].result ?? 0;
                        }
                        default: {
                            return empPerformanceData[filterField]; // Return the value from company data for other fields
                        }
                    }
                }
                return null;
            }).filter(value => value !== null && value !== undefined); // Filter out any falsy values (e.g., null)
        };

        const values = filteredData?.length ? getValues(filteredData) : getValues(dataForFilter);
        setColumnValues([...new Set(values)]);
    }, [filterField, filteredData, dataForFilter, empPerformanceData]);

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
        let dataToSort = [...(filteredData?.length ? filteredData : dataForFilter)];

        const allSelectedFilters = Object.values(safeFilters).flat();

        if (allSelectedFilters.length > 0) {
            dataToSort = dataToSort.filter(employee => {
                return Object.keys(safeFilters).every(filterColumn => {
                    const columnFilters = safeFilters[filterColumn];
                    const valueToCheck =
                        filterColumn === "name"
                            ? employee.name
                            : filterColumn === "branch" ? employee.branch : employee.performance[0][filterColumn];
                    return columnFilters.includes(String(valueToCheck));
                });
            });
        }

        if (sortOrder) {
            dataToSort.sort((a, b) => {
                const valueA =
                    filterField === "name"
                        ? a.name?.toLowerCase()
                        : a.performance[0][filterField] || 0;
                const valueB =
                    filterField === "name"
                        ? b.name?.toLowerCase()
                        : b.performance[0][filterField] || 0;
                return sortOrder === "ascending"
                    ? valueA > valueB
                        ? 1
                        : -1
                    : valueA < valueB
                        ? 1
                        : -1;
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
        allFilterFields([]);
        setSelectedYears([currentYear]);
        setSelectedMonths([currentMonth]);
        onFilter(completeData);
        showingMenu(false);
    };

    return (
        <div>
            {filterField !== 'month-year' ? (
                <div className="inco-filter">

                    <div className="inco-subFilter p-2" onClick={(e) => handleSort("ascending")}>
                        <SwapVertIcon style={{ height: "16px" }} />
                        {filterField === 'name' || filterField === 'branch' ? "Sort A TO Z" : "Ascending"}
                    </div>

                    <div className="inco-subFilter p-2" onClick={(e) => handleSort("descending")}>
                        <SwapVertIcon style={{ height: "16px" }} />
                        {filterField === 'name' || filterField === 'branch' ? "Sort Z TO A" : "Descending"}
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
                </div>
            ) : (
                <div className="inco-filter">

                    <div className='w-100'>
                        <div className="d-flex flex-column">
                            <div>
                                <label className="filter-val p-2" for="Select_All">
                                    Select Years
                                </label>
                            </div>
                            {yearsArray.map((year) => (
                                <div key={year} className="inco-subFilter d-flex align-items-center">
                                    <div className="filter-check">
                                        <input
                                            type="checkbox"
                                            value={year}
                                            onChange={(e) => handleMonthsAndYearsCheckbox(e, "year")}
                                            checked={selectedYears.includes(year)}
                                            id={`year-${year}`}
                                        />
                                    </div>
                                    <label className="filter-val p-2" htmlFor={`year-${year}`}>
                                        {year}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="inco_inner">
                        <div className='w-100'>
                            <div className="d-flex flex-column">
                                <div>
                                    <label className="filter-val p-2" for="Select_All">
                                        Select Months
                                    </label>
                                </div>
                                {monthsArray.map((month) => (
                                    <div key={month} className="inco-subFilter d-flex align-items-center">
                                        <div className="filter-check">
                                            <input
                                                type="checkbox"
                                                value={month}
                                                onChange={(e) => handleMonthsAndYearsCheckbox(e, "month")}
                                                checked={selectedMonths.includes(month)}
                                                id={`month-${month}`}
                                            />
                                        </div>
                                        <label className="filter-val p-2" htmlFor={`month-${month}`}>
                                            {month}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className='d-flex align-items-center justify-content-between'>

                <div className='w-50'>
                    <button className='filter-footer-btn btn-yellow' style={{ backgroundColor: "#e7e5e0" }}
                        onClick={() => {
                            if (filterField === "month-year") {
                                fetchEmployeePerformanceReport();
                            } else {
                                applyFilters(selectedFilters, filterField);
                            }
                            showingMenu(false);
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
    );
};

export default MonthWiseEmployeePerformanceReportFilter;