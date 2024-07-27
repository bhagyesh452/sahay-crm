import React from 'react';
import { FaWhatsapp } from "react-icons/fa";
import StatusDropdown from "../Extra-Components/status-dropdown";
import DscStatusDropdown from "../Extra-Components/dsc-status-dropdown";
import { FaRegEye } from "react-icons/fa";
import { CiUndo } from "react-icons/ci";

function RmofCertificationHoldPanel({ rmServicesData }) {




    function formatDate(dateString) {
        dateString = "2024-07-26"
        const [year, month, date] = dateString.split('-');
        return `${date}/${month}/${year}`
    }







    return (
        <div>
            <div className="RM-my-booking-lists">
                <div className="table table-responsive table-style-3 m-0">
                    <table className="table table-vcenter table-nowrap rm_table">
                        <thead>
                            <tr className="tr-sticky">
                                <th className="rm-sticky-left-1">Sr.No</th>
                                <th className="rm-sticky-left-2">Booking Date</th>
                                <th className="rm-sticky-left-3">Company Name</th>
                                <th>Company Number</th>
                                <th>Company Email</th>
                                <th>CA Number</th>
                                <th>Service Name</th>
                                <th>Status</th>
                                <th>Remark</th>
                                <th>DSC Applicable</th>
                                <th>BDE Name</th>
                                <th>BDM name</th>
                                <th>Total Payment</th>
                                <th>received Payment</th>
                                <th>Pending Payment</th>
                                <th className="rm-sticky-action">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rmServicesData && rmServicesData.length !== 0 && rmServicesData.map((obj, index) => (
                                <tr key={index}>
                                    <td className="rm-sticky-left-1"><div className="rm_sr_no">{index + 1}</div></td>
                                    <td className="rm-sticky-left-2">{formatDate(obj.bookingDate)}</td>
                                    <td className="rm-sticky-left-3"><b>{obj["Company Name"]}</b></td>
                                    <td>
                                        <div className="d-flex align-items-center justify-content-center wApp">
                                            <div>{obj["Company Number"]}</div>
                                            <a style={{ marginLeft: '10px', lineHeight: '14px', fontSize: '14px' }}>
                                                <FaWhatsapp />
                                            </a>
                                        </div>
                                    </td>
                                    <td>{obj["Company Email"]}</td>
                                    <td>{obj.caCase === "Yes" ? obj.caNumber : "Not Applicable"}</td>
                                    <td><b>{obj.serviceName}</b></td>
                                    <td>
                                        {/* <div><StatusDropdown /></div> */}
                                    </td>
                                    <td>test remarks</td>
                                    <td>{obj.withDSC ? "Yes" : "No"}</td>
                                    <td>
                                        <div className="d-flex align-items-center justify-content-center">

                                            <div>{obj.bdeName}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center justify-content-center">

                                            <div>{obj.bdmName}</div>
                                        </div>
                                    </td>
                                    <td>₹ {obj.totalPaymentWGST}/-</td>
                                    <td>₹ {obj.firstPayment ? obj.firstPayment : obj.totalPaymentWGST}/-</td>
                                    <td>₹ {obj.firstPayment ? (obj.totalPaymentWGST - obj.firstPayment) : 0}/-</td>
                                    <td className="rm-sticky-action"><button className="action-btn action-btn-primary" 
                                    //onClick={() => setOpenCompanyTaskComponent(true)}
                                    ><FaRegEye /></button>
                                        <button className="action-btn action-btn-danger ml-1"><CiUndo /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default RmofCertificationHoldPanel;