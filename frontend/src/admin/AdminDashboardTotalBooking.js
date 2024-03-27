import React, { useEffect, useState, useRef } from "react";
import { DateRangePicker } from 'react-date-range';
import axios from "axios";
import Nodata from "../components/Nodata";
import "../assets/styles.css";
import { IconEye } from "@tabler/icons-react";
import { FaRegCalendar } from "react-icons/fa";

function AdminDashboardTotalBooking() {
    const [startDateAnother, setStartDateAnother] = useState(new Date());
    const [endDateAnother, setEndDateAnother] = useState(new Date());
    const [showBookingDate, setShowBookingDate] = useState(false)
    const dateRangePickerRef = useRef(null);
    const [filteredBooking, setFilteredBooking] = useState([]);
    const [bookingObject, setBookingObject] = useState([]);
    const [expandedRow, setExpandedRow] = useState(null);
    const [tableEmployee, setTableEmployee] = useState("");
    const [openTable, setOpenTable] = useState(false);
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const [expand, setExpand] = useState("");
    



    const fetchCompanies = async () => {
        try {
            let url;
            if (startDateAnother === endDateAnother) {
                // If start and end dates are the same, fetch data for a single date
                url = `${secretKey}/booking-model-filter?date=${startDateAnother}`;
            } else {
                // If start and end dates are different, fetch data for a date range
                url = `${secretKey}/booking-model-filter?startDate=${startDateAnother}&endDate=${endDateAnother}`;
            }

            const response = await axios.get(url);
            const data = response.data.leads;
            console.log(` startDate : ${startDateAnother} , endDate : ${endDateAnother}`, data);

            // Update state with the fetched data
            setBookingObject(data);
            setFilteredBooking(data);
        } catch (error) {
            console.error("Error Fetching Booking Details", error.message);
        }
    };
    useEffect(() => {




        // Call the fetchData function when the component mounts

        fetchCompanies();
        //debouncedFetchCompanyData();
        // debouncedFetchEmployeeInfo();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    useEffect(() => {
        fetchCompanies();
    }, [startDateAnother, endDateAnother])

    const selectionRangeAnother = {
        startDate: startDateAnother,
        endDate: endDateAnother,
        key: "selection",
    };

    const handleSelectAnother = (date) => {
        const filteredDataDateRange = bookingObject.filter((product) => {
            const productDate = new Date(product["bookingDate"]);
            return (
                productDate >= date.selection.startDate &&
                productDate <= date.selection.endDate
            );
        });
        setStartDateAnother(date.selection.startDate);
        setEndDateAnother(date.selection.endDate);
        setFilteredBooking(filteredDataDateRange);
    };


    const finalFilteredData = [];
    const uniqueBdeNames = new Set();

    filteredBooking.forEach((obj) => {
        // Check if the bdeName is already in the Set

        if (!uniqueBdeNames.has(obj.bdeName)) {
            // If not, add it to the Set and push the object to the final array
            uniqueBdeNames.add(obj.bdeName);
            finalFilteredData.push(obj);
        }
    });

    const handleRowClick = (index, tableEmployee) => {
        setExpandedRow(expandedRow === index ? null : index);
        setTableEmployee(tableEmployee);
        functionOpenTable();
    };
    const functionOpenTable = () => {
        setOpenTable(true);
      };
      const closeTable = () => {
        setOpenTable(false);
        setExpand("");
      };

      const formatDate = (inputDate) => {
        const date = new Date(inputDate);
        const convertedDate = date.toLocaleDateString();
        return convertedDate;
      };
    




    return (
        <div className="col card todays-booking m-2 totalbooking" id='totalbooking' >
            <div className="card-header employeedashboard d-flex align-items-center justify-content-between">
                <div>
                    <h2>Total Booking</h2>
                </div>
                <div className=" form-control date-range-picker d-flex align-items-center justify-content-between">
                    <div style={{ cursor: 'pointer' }} onClick={() => setShowBookingDate(!showBookingDate)}>
                        {`${formatDate(startDateAnother)} - ${formatDate(endDateAnother)}`}
                    </div>
                    <button onClick={() => setShowBookingDate(!showBookingDate)} style={{ border: "none", padding: "0px", backgroundColor: "white" }}>
                        <FaRegCalendar style={{ width: "17px", height: "17px", color: "#bcbaba", color: "grey" }} />
                    </button>
                </div>
            </div>
            {showBookingDate && <div
                ref={dateRangePickerRef}
                style={{
                    position: "absolute",
                    top: "65px",
                    zIndex: 9,
                    right: "157px",
                }}
                className="booking-filter"
            >
                <DateRangePicker
                    ranges={[selectionRangeAnother]}
                    onChange={handleSelectAnother}
                    onClose={() => setShowBookingDate(false)}
                />
            </div>}
            <div className="card-body">
                <div
                    className="row"
                    style={{
                        overflowX: "auto",
                        overflowY: "auto",
                        maxHeight: "60vh",
                        lineHeight: "32px",
                    }}
                >
                    <table
                        style={{
                            position: "sticky",
                            width: "100%",
                            borderCollapse: "collapse",
                            border: "1px solid #ddd",
                            marginBottom: "5px",
                            lineHeight: "32px",
                        }}
                        className="table-vcenter table-nowrap"
                    >
                        <thead style={{ lineHeight: "32px" }}>
                            <tr
                                style={{
                                    backgroundColor: "#ffb900",
                                    color: "black",
                                    fontWeight: "bold",
                                }}
                            >
                                <th style={{ lineHeight: "32px" }}>SR.NO</th>
                                <th>BDE NAME</th>
                                <th>MATURED CASES</th>
                                <th>NUM OF UNIQUE SERVICES OFFERED</th>
                                <th>TOTAL PAYMENT</th>
                                <th>RECEIVED PAYMENT</th>
                                <th>PENDING PAYMENT</th>
                            </tr>
                        </thead>
                        {finalFilteredData.length !== 0 ? (
                            <>
                                <tbody>
                                    {finalFilteredData.map((obj, index) => (
                                        <>
                                            <tr style={{ position: "relative" }}>
                                                <td style={{ lineHeight: "32px" }}>
                                                    {index + 1}
                                                </td>
                                                <td>{obj.bdeName}</td>
                                                <td>
                                                    <div className="row">
                                                        <div
                                                            style={{ textAlign: "right" }}
                                                            className="col"
                                                        >
                                                            {filteredBooking.filter((data) => {
                                                                return (
                                                                    data.bdeName === obj.bdeName &&
                                                                    data.bdeName === data.bdmName
                                                                );
                                                            }).length +
                                                                filteredBooking.filter((data) => {
                                                                    return (
                                                                        data.bdeName === obj.bdeName &&
                                                                        data.bdeName !== data.bdmName
                                                                    );
                                                                }).length /
                                                                2}{" "}
                                                        </div>
                                                        <div className="col-sm-5">
                                                            <IconEye
                                                                style={{
                                                                    cursor: "pointer",
                                                                    marginLeft: "5px",
                                                                    height: "17px",
                                                                }}
                                                                onClick={() =>
                                                                    handleRowClick(index, obj.bdeName)
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>
                                                    {
                                                        filteredBooking
                                                            .filter(
                                                                (data) => data.bdeName === obj.bdeName
                                                            ) // Filter objects with bdeName same as myName
                                                            .reduce((totalServices, obj) => {
                                                                // Use reduce to calculate the total number of services
                                                                return (
                                                                    totalServices +
                                                                    (obj.services && obj.services[0]
                                                                        ? obj.services[0]
                                                                            .split(",")
                                                                            .map((service) =>
                                                                                service.trim()
                                                                            ).length
                                                                        : 0)
                                                                );
                                                            }, 0) // Initialize totalServices as 0
                                                    }
                                                </td>
                                                <td>
                                                    {" "}
                                                    ₹{
                                                        filteredBooking
                                                            .filter(
                                                                (data) => data.bdeName === obj.bdeName
                                                            ) // Filter objects with bdeName same as myName
                                                            .reduce((totalPayments, obj1) => {
                                                                // Use reduce to calculate the total of totalPayments
                                                                return (
                                                                    totalPayments +
                                                                    (obj1.bdeName === obj1.bdmName && obj.bdmType !== "closeby"
                                                                        ? obj1.originalTotalPayment !== 0
                                                                            ? obj1.originalTotalPayment
                                                                            : 0
                                                                        : obj1.originalTotalPayment !== 0
                                                                            ? obj1.originalTotalPayment / 2
                                                                            : 0)
                                                                );
                                                            }, 0)
                                                            .toLocaleString() // Initialize totalPayments as 0
                                                    }
                                                </td>
                                                <td>
                                                    ₹{
                                                        filteredBooking
                                                            .filter(
                                                                (data) => data.bdeName === obj.bdeName
                                                            ) // Filter objects with bdeName same as obj.bdeName
                                                            .reduce((totalPayments, obj1) => {
                                                                // Use reduce to calculate the total of totalPayments
                                                                return (
                                                                    totalPayments +
                                                                    (obj1.firstPayment === 0
                                                                        ? obj1.bdeName === obj1.bdmName
                                                                            ? obj1.originalTotalPayment / 2 // If bdeName and bdmName are the same
                                                                            : obj1.originalTotalPayment // If bdeName and bdmName are different
                                                                        : obj1.bdeName === obj1.bdmName
                                                                            ? obj1.originalTotalPayment// If bdeName and bdmName are the same
                                                                            : obj1.originalTotalPayment / 2) // If bdeName and bdmName are different
                                                                );
                                                            }, 0)
                                                            .toLocaleString() // Initialize totalPayments as 0
                                                    }
                                                </td>
                                                <td>
                                                    ₹{
                                                        filteredBooking
                                                            .filter(
                                                                (data) => data.bdeName === obj.bdeName
                                                            ) // Filter objects with bdeName same as obj.bdeName
                                                            .reduce((totalPayments, obj1) => {
                                                                // Use reduce to calculate the total of totalPayments
                                                                return (
                                                                    totalPayments +
                                                                    (obj1.firstPayment !== 0
                                                                        ? obj1.bdeName !== obj1.bdmName
                                                                            ? (obj1.originalTotalPayment -
                                                                                obj1.firstPayment) /
                                                                            2 // If bdeName and bdmName are the same
                                                                            : obj1.originalTotalPayment -
                                                                            obj1.firstPayment // If bdeName and bdmName are different
                                                                        : 0) // If bdeName and bdmName are different
                                                                );
                                                            }, 0)
                                                            .toLocaleString() // Initialize totalPayments as 0
                                                    }
                                                </td>
                                            </tr>
                                        </>
                                    ))}
                                </tbody>

                                <tfoot>
                                    <tr style={{ fontWeight: "500" }}>
                                        <td colSpan={2} style={{ lineHeight: "32px" }}>
                                            Total:{finalFilteredData.length}
                                        </td>

                                        <td>
                                            {filteredBooking.filter((data) => {
                                                return data.bdeName === data.bdmName;
                                            }).length +
                                                filteredBooking.filter((data) => {
                                                    return data.bdeName !== data.bdmName;
                                                }).length /
                                                2}
                                        </td>
                                        <td>
                                            {filteredBooking.reduce((totalLength, obj) => {
                                                // Split the services string by commas and calculate the length of the resulting array
                                                const serviceLength =
                                                    obj.services[0].split(",").length;
                                                // Add the length of services for the current object to the total length
                                                return totalLength + serviceLength;
                                            }, 0)}
                                        </td>

                                        <td>
                                            ₹{filteredBooking
                                                .reduce((totalPayment, obj) => {
                                                    // Add the totalPayment of the current object to the totalPayment accumulator
                                                    const finalPayment =
                                                        obj.bdeName === obj.bdmName
                                                            ? obj.originalTotalPayment
                                                            : obj.originalTotalPayment / 2;
                                                    return totalPayment + finalPayment;
                                                }, 0)
                                                .toLocaleString()}
                                        </td>

                                        <td>
                                            ₹{filteredBooking
                                                .reduce((totalFirstPayment, obj) => {
                                                    // If firstPayment is 0, count totalPayment instead
                                                    const paymentToAdd =
                                                        obj.firstPayment === 0
                                                            ? obj.bdeName === obj.bdmName
                                                                ? obj.originalTotalPayment
                                                                : obj.originalTotalPayment / 2
                                                            : obj.bdeName === obj.bdmName
                                                                ? obj.firstPayment
                                                                : obj.firstPayment / 2;
                                                    // Add the paymentToAdd to the totalFirstPayment accumulator
                                                    return totalFirstPayment + paymentToAdd;
                                                }, 0)
                                                .toLocaleString()}
                                        </td>
                                        <td>
                                            ₹{filteredBooking
                                                .reduce((totalFirstPayment, obj) => {
                                                    // If firstPayment is 0, count totalPayment instead

                                                    const paymentToAdd =
                                                        obj.bdeName === obj.bdmName
                                                            ? obj.firstPayment === 0
                                                                ? 0
                                                                : obj.originalTotalPayment - obj.firstPayment
                                                            : obj.firstPayment === 0
                                                                ? 0
                                                                : obj.originalTotalPayment - obj.firstPayment;

                                                    // Add the paymentToAdd to the totalFirstPayment accumulator
                                                    return totalFirstPayment + paymentToAdd;
                                                }, 0)
                                                .toLocaleString()}
                                        </td>
                                    </tr>
                                </tfoot>
                            </>
                        ) : (
                            <tbody>
                                <tr>
                                    <td className="particular" colSpan={9}>
                                        <Nodata />
                                    </td>
                                </tr>
                            </tbody>
                        )}
                    </table>
                </div>
            </div>
        </div>

    )
}

export default AdminDashboardTotalBooking