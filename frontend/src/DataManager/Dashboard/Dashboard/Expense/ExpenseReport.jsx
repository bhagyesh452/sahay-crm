import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ClipLoader from "react-spinners/ClipLoader";
import Nodata from '../../../Components/Nodata/Nodata';


function ExpenseReport() {

    const secretKey = process.env.REACT_APP_SECRET_KEY;

    const [expenseReport, setExpenseReport] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchExpenseReport = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get(`${secretKey}/bookings/fetchRemainingExpenseServices`);
            console.log("Expense report is :", res.data);
            setExpenseReport(res.data);
        } catch (error) {
            console.log("Error fetching expesne report :", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenseReport();
    }, []);

    const renderRows = () => {
        if (!expenseReport.length) {
            return (
                <tr>
                    <td colSpan="6" className="text-center"><Nodata /></td>
                </tr>
            );
        }

        let rowIndex = 1;

        return expenseReport.map((company, companyIndex) => {
            const allServices = [
                ...company.services, 
                ...company.moreBookings.flatMap(booking => booking.services)
            ];

            return allServices.map((service, serviceIndex) => (
                <tr key={`${companyIndex}-${serviceIndex}`}>
                    {/* Show company name only for the first service of the company */}
                    <td>{rowIndex++}</td>
                    <td>{company["Company Name"]}</td>
                    <td>{service.serviceName}</td>
                    <td>₹ {service.totalAmount}</td>
                    <td>₹ {service.receivedAmount}</td>
                    <td>₹ {service.pendingAmount}</td>
                </tr>
            ));
        });
    };

    return (
        <div className="card">
            <div className="card-header p-1 employeedashboard d-flex align-items-center justify-content-between">
                <div className="dashboard-title pl-1"  >
                    <h2 className="m-0">
                        Expense Report
                    </h2>
                </div>
            </div>

            <div className="card-body">
                <div id="table-default" className="row tbl-scroll">
                    <table className="table-vcenter table-nowrap admin-dash-tbl"  >

                        <thead className="admin-dash-tbl-thead">
                            <tr>
                                <th>Sr. No</th>
                                <th>Company Name</th>
                                <th>Service Name</th>
                                <th>Total Payment</th>
                                <th>Received Payment</th>
                                <th>Remaining Payment</th>
                            </tr>
                        </thead>

                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6">
                                        <div className="LoaderTDSatyle w-100">
                                            <ClipLoader
                                                color="lightgrey"
                                                size={30}
                                                aria-label="Loading Spinner"
                                                data-testid="loader"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                renderRows()
                            )}
                        </tbody>

                    </table>
                </div>
            </div>
        </div>
    );
}

export default ExpenseReport;