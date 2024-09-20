import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ClipLoader from "react-spinners/ClipLoader";
import Nodata from '../../../Components/Nodata/Nodata';
import { MdDelete } from "react-icons/md";
import Swal from 'sweetalert2';


function ExpenseReport() {

    const secretKey = process.env.REACT_APP_SECRET_KEY;

    const [expenseReport, setExpenseReport] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [serviceName, setServiceName] = useState("");
    const [companyName, setCompanyName] = useState("");

    const formatSalary = (amount) => {
        return new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(amount);
    };

    const storeExpenseReport = async () => {
        try {
            const res = await axios.get(`${secretKey}/bookings/fetchRemainingExpenseServices`);
            // console.log("Expense report is :", res.data);
        } catch (error) {
            console.log("Error fetching expesne report :", error);
        }
    };

    useEffect(() => {
        storeExpenseReport();
    }, []);

    const fetchExpenseReport = async () => {
        try {
            setIsLoading(true);
            // Build the query parameters based on selected filters
            const params = {};
            if (serviceName) params.serviceName = serviceName;
            if (companyName) params.companyName = companyName;

            const res = await axios.get(`${secretKey}/expense/fetchExpenseReports`, { params });
            // console.log("Expense report successfully fetched :", res.data.data);
            setExpenseReport(res.data.data.filter((data) => data.isDeleted === false));

        } catch (error) {
            console.log("Error fetching expense report:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Trigger fetching of expense report data when filter changes
    useEffect(() => {
        fetchExpenseReport();
    }, [serviceName, companyName]); // Re-fetch whenever serviceName or companyName changes

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axios.put(`${secretKey}/expense/updateExpenseReportDeleteField/${id}`);
                    // console.log("Service successfully deleted :", res.data.data);
                    fetchExpenseReport();
                    Swal.fire('Deleted!', 'Service has been deleted', 'success');
                } catch (error) {
                    console.log("Error deleting service :", error);
                    Swal.fire('Error!', 'Error deleting service', 'error');
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire('Cancelled', 'Service data is safe', 'info');
            }
        });
    };

    const renderRows = () => {
        if (expenseReport.length === 0) {
            return (
                <tr>
                    <td colSpan="7"><Nodata /></td>
                </tr>
            );
        }

        return expenseReport.map((report, index) => (
            <tr key={index}>
                <td>{index + 1}</td>
                <td>{report.companyName}</td>
                <td>{report.serviceName}</td>
                <td>₹ {formatSalary(report.totalPayment)}</td>
                <td>₹ {formatSalary(report.receivedPayment)}</td>
                <td>₹ {formatSalary(report.remainingPayment)}</td>
                <td className='cursor-pointer'><MdDelete onClick={() => handleDelete(report._id)} /></td>
            </tr>
        ));
    };

    return (
        <div className="card">
            <div className="card-header p-1 employeedashboard d-flex align-items-center justify-content-between">

                <div className="dashboard-title pl-1"  >
                    <h2 className="m-0">
                        Expense Report
                    </h2>
                </div>

                <div className="d-flex align-items-center pr-1">
                    <div className="filter-booking mr-1 d-flex align-items-center">
                        <div className="filter-main">
                            <select
                                className="form-select"
                                id={`branch-filter`}
                                onChange={(e) => setServiceName(e.target.value)}
                            >
                                <option value="" selected>Select Service Name</option>
                                <option value="Start-Up India Certificate">Start-Up India Certificate</option>
                                <option value="ISO Certificate">ISO Certificate</option>
                                <option value="IEC CODE Certificate">IEC CODE Certificate</option>
                                <option value="FSSAI Certificate">FSSAI Certificate</option>
                                <option value="APEDA Certificate">APEDA Certificate</option>
                                <option value="Company Incorporation">Company Incorporation</option>
                                <option value="Organization DSC">Organization DSC</option>
                                <option value="Director DSC">Director DSC</option>
                                <option value="Website Development">Website Development</option>
                                <option value="App Design & Development">App Design & Development</option>
                                <option value="Web Application Development">Web Application Development</option>
                                <option value="Software Development">Software Development</option>
                                <option value="CRM Development">CRM Development</option>
                                <option value="ERP Development">ERP Development</option>
                                <option value="E-Commerce Website">E-Commerce Website</option>
                                <option value="GST Registration Application Support">GST Registration Application Support</option>
                            </select>
                        </div>
                    </div>

                    <div class="input-icon mr-1">
                        <span class="input-icon-addon">
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
                                <path d="M21 21l-6 -6"></path>
                            </svg>
                        </span>
                        <input
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="form-control"
                            placeholder="Enter Company Name"
                            type="text"
                            name="bdeName-search"
                            id="bdeName-search" />
                    </div>

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
                                <th>Action</th>
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