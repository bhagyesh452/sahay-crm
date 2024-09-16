import React from 'react';

function LeaveReportView() {
  return (
    <div className="leave-report-view mt-3">
        <div className='d-flex mb-3 align-items-center justify-content-between pl-1 pr-1'>
            <div className='d-flex align-items-center justify-content-start'>
                <div className='form-group'>
                    <select className='form-select'>
                        <option disabled selected>--Select Year--</option>
                    </select>
                </div>  
                <div className='form-group ml-1'>
                    <select className='form-select'>
                        <option disabled selected>--Select Month--</option>
                    </select>
                </div>
            </div>
            <div className="d-flex align-items-center justify-content-start">
                <button className='btn action-btn-warning ml-1'>Credit Leave : 1.5</button>
                <button className='btn action-btn-alert ml-1'>Leave Request</button>
                <button className='btn action-btn-primary ml-1'>Back</button>
            </div>
        </div>
        <div className='pl-1 pr-1'>
            <div className="table table-responsive table-style-2 m-0" style={{ maxHeight: "calc(100vh - 307px)", overflow: "auto" }}>
                <table className="table table-vcenter table-nowrap">
                    <thead>
                        <tr className="tr-sticky">
                            <th>Sr. No</th>
                            <th>Date</th>
                            <th>Reason</th>
                            <th>Leave Type</th>
                            <th>Paid/Unpaid</th>
                            <th>Credit Leave</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>01 Jun 2024</td>
                            <td>Health Issue</td>
                            <td>Half Day</td>
                            <td>Unpaid</td>
                            <td>0</td>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>01 Jun 2024</td>
                            <td>Health Issue</td>
                            <td>Half Day</td>
                            <td>Unpaid</td>
                            <td>0</td>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>01 Jun 2024</td>
                            <td>Health Issue</td>
                            <td>Half Day</td>
                            <td>Unpaid</td>
                            <td>1.5</td>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>01 Jun 2024</td>
                            <td>Health Issue</td>
                            <td>Half Day</td>
                            <td>Unpaid</td>
                            <td>2</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
}

export default LeaveReportView;