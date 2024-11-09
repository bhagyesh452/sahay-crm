import React, { useState, useEffect } from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import moment from "moment";
import { useParams } from "react-router-dom";
import axios from "axios";
import Calendar from "@mui/icons-material/Event";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { IconButton } from "@mui/material";
import { RiEditCircleFill } from "react-icons/ri";
import dayjs from "dayjs";
import Nodata from "../components/Nodata";
import NewProjectionDialog from './ExtraComponents/NewProjectionDialog';

function NewProjectionReport() {

    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const { userId } = useParams();

    const formatDate = (dateString) => {
        if (!dateString) return "N/A"; // Handle undefined or null dates
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "Invalid Date"; // Handle invalid date formats
        const day = String(date.getDate()).padStart(2, '0');
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-IN').format(amount);
    };

    const shortcutsItems = [
        {
            label: "This Week",
            getValue: () => {
                const today = dayjs();
                return [today.startOf("week"), today.endOf("week")];
            },
        },
        {
            label: "Last Week",
            getValue: () => {
                const today = dayjs();
                const prevWeek = today.subtract(7, "day");
                return [prevWeek.startOf("week"), prevWeek.endOf("week")];
            },
        },
        {
            label: "Last 7 Days",
            getValue: () => {
                const today = dayjs();
                return [today.subtract(7, "day"), today];
            },
        },
        {
            label: "Current Month",
            getValue: () => {
                const today = dayjs();
                return [today.startOf("month"), today.endOf("month")];
            },
        },
        {
            label: "Next Month",
            getValue: () => {
                const today = dayjs();
                const startOfNextMonth = today.endOf("month").add(1, "day");
                return [startOfNextMonth, startOfNextMonth.endOf("month")];
            },
        },
        { label: "Reset", getValue: () => [null, null] },
    ];

    const [isLoading, setIsLoading] = useState(false);
    const [showProjectionDialog, setShowProjectionDialog] = useState(false);
    const [isProjectionEditable, setIsProjectionEditable] = useState(false);
    const [editableProjectionData, setEditableProjectionData] = useState({});
    const [projection, setProjection] = useState([]);
    const [companyName, setCompanyName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [employeeName, setEmployeeName] = useState('');

    const fetchEmployee = async () => {
        try {
            const res = await axios.get(`${secretKey}/employee/fetchEmployeeFromId/${userId}`);
            setEmployeeName(res.data.data.ename);
        } catch (error) {
            console.log("Error to fetch employee :", error);
        }
    };

    const fetchNewProjection = async (values) => {

        if (values) {
            // Check if values is [null, null], meaning the "Reset" option was selected
            if (values[0] === null && values[1] === null) {
                setStartDate('');
                setEndDate('');
            } else {
                const startDate = new Date(values[0]);
                const endDate = new Date(values[1]);
                setStartDate(startDate);
                setEndDate(endDate);
            }
        }

        try {
            setIsLoading(true);
            const res = await axios.get(`${secretKey}/company-data/getProjection/${employeeName}`, {
                params: {
                    companyName,
                    startDate: startDate ? startDate : '',
                    endDate: endDate ? endDate : ''
                }
            });
            // console.log("Projection data is :", res.data.data);
            setProjection(res.data.data);
        } catch (error) {
            console.log("Error to fetch new projection :", error);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployee();
    }, []);

    useEffect(() => {
        fetchNewProjection();
    }, [employeeName, companyName, startDate, endDate]);

    return (
        <div>
            <div className="col-12 mt-2" id="projectiondashboardemployee">
                <div className="card">
                    <div className="card-header p-1 employeedashboard d-flex align-items-center justify-content-between">
                        <div className="dashboard-title pl-1">
                            <h2 className="m-0">
                                Total Projection Summary
                            </h2>
                        </div>

                        <div className="d-flex align-items-center pr-1">
                            <div class="input-icon mr-1">
                                <span class="input-icon-addon">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                        <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
                                        <path d="M21 21l-6 -6"></path>
                                    </svg>
                                </span>

                                <input
                                    className="form-control"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    placeholder="Enter Company Name..."
                                    type="text"
                                    name="company-search"
                                    id="company-search"
                                />
                            </div>

                            <div>
                                <LocalizationProvider dateAdapter={AdapterDayjs} style={{ padding: "0px" }}>
                                    <DemoContainer components={["SingleInputDateRangeField"]}>
                                        <DateRangePicker className="form-control my-date-picker form-control-sm p-0"
                                            onChange={(values) => {
                                                const startDate = moment(values[0]).format(
                                                    "DD/MM/YYYY"
                                                );
                                                const endDate = moment(values[1]).format(
                                                    "DD/MM/YYYY"
                                                );
                                                fetchNewProjection(values);
                                            }}
                                            slots={{ field: SingleInputDateRangeField }}
                                            slotProps={{
                                                shortcuts: {
                                                    items: shortcutsItems,
                                                },
                                                actionBar: { actions: [] },
                                                textField: {
                                                    InputProps: { endAdornment: <Calendar /> },
                                                },
                                            }}
                                            calendars={1}
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </div>
                        </div>
                    </div>

                    <div className="card-body">
                        <div id="table-default" className="row tbl-scroll">
                            <table className="table-vcenter table-nowrap admin-dash-tbl">
                                <thead className="admin-dash-tbl-thead">
                                    <tr className="tr-sticky"
                                        style={{
                                            backgroundColor: "#ffb900",
                                            color: "white",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        <th>Sr. No</th>
                                        <th>Company Name</th>
                                        <th>BDE Name</th>
                                        <th>BDM Name</th>
                                        <th>Offered Services</th>
                                        <th>Offered Price</th>
                                        <th>Expected Amount</th>
                                        <th>Employee Payment</th>
                                        <th>Last FollowUp Date</th>
                                        <th>Estimated Payment Date</th>
                                        <th>Remarks</th>
                                        <th>Is Matured Case</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {isLoading && <tr>
                                        <td colSpan="11" className="LoaderTDSatyle">
                                            <ClipLoader
                                                color="lightgrey"
                                                loading
                                                size={30}
                                                aria-label="Loading Spinner"
                                                data-testid="loader"
                                            />
                                        </td>
                                    </tr>}

                                    {projection && projection.length > 0 ? (
                                        projection.map((data, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{data.companyName}</td>
                                                <td>{data.bdeName}</td>
                                                <td>{data.bdmName}</td>
                                                <td>{data.offeredServices
                                                    ? data.offeredServices.map(service => service).join(", ")
                                                    : "N/A"}
                                                </td>
                                                <td>₹ {formatAmount(data.offeredPrice)}</td>
                                                <td>₹ {formatAmount(data.totalPayment)}</td>
                                                <td>₹ {formatAmount(data.employeePayment)}</td>
                                                <td>{formatDate(data.lastFollowUpdate)}</td>
                                                <td>{formatDate(data.estPaymentDate)}</td>
                                                <td>{data.remarks}</td>
                                                <td>{data.isPreviousMaturedCase === "true" ? "Yes" : "No" }</td>
                                                <td style={{ padding: '0px !important' }}>
                                                {new Date(new Date(data.estPaymentDate).setHours(0, 0, 0, 0)) >= new Date(new Date().setHours(0, 0, 0, 0)) ? (
                                                        <IconButton
                                                            onClick={() => {
                                                                setShowProjectionDialog(true);
                                                                setIsProjectionEditable(true);
                                                                setEditableProjectionData(data);
                                                            }}
                                                        >
                                                            <RiEditCircleFill
                                                                color="#fbb900"
                                                                style={{
                                                                    width: "17px",
                                                                    height: "17px",
                                                                }}
                                                            />
                                                        </IconButton>
                                                    ) : (
                                                        <IconButton>
                                                            <RiEditCircleFill
                                                                color="lightgrey"
                                                                style={{
                                                                    width: "17px",
                                                                    height: "17px",
                                                                }}
                                                            />
                                                        </IconButton>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td className="particular" colSpan="13">
                                                <Nodata />
                                            </td>
                                        </tr>
                                    )}
                                </tbody>

                                {projection && projection.length > 0 && <tfoot className="admin-dash-tbl-tfoot">
                                    <tr style={{ fontWeight: 500 }} className="tf-sticky">
                                        <td colSpan="2">Total</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>{projection.reduce((a, b) => a + b.offeredServices.length, 0)}</td>
                                        <td>₹ {formatAmount(projection.reduce((a, b) => a + b.offeredPrice, 0))}</td>
                                        <td>₹ {formatAmount(projection.reduce((a, b) => a + b.totalPayment, 0))}</td>
                                        <td>₹ {formatAmount(projection.reduce((a, b) => a + b.employeePayment, 0))}</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                    </tr>
                                </tfoot>}

                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {showProjectionDialog && (
                <NewProjectionDialog
                    open={showProjectionDialog}
                    closepopup={() => setShowProjectionDialog(false)}
                    isProjectionEditable={isProjectionEditable}
                    projectionData={editableProjectionData}
                    fetchNewProjection={fetchNewProjection}
                />
            )}
        </div>
    );
}

export default NewProjectionReport;