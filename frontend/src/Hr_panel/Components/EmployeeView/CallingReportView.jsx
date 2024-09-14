import React from 'react';

function CallingReportView() {
  return (
    <div className="calling-report-view mt-3">
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
                <button className='btn action-btn-alert'>Calling Leave: 2</button>
            </div>
        </div>
        <div className='pl-1 pr-1'>
            <div className="table table-responsive table-style-2 m-0" style={{ maxHeight: "calc(100vh - 307px)", overflow: "auto" }}>
                <table className="table table-vcenter table-nowrap">
                    <thead>
                        <tr className="tr-sticky">
                            <th>Sr. No</th>
                            <th>Date</th>
                            <th>Outgoing</th>
                            <th>Incoming</th>
                            <th>Missed</th>
                            <th>Rejected</th>
                            <th>Unique Clients</th>
                            <th>Total</th>
                            <th>Call Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>01 Jun 2024</td>
                            <td>34 Calls</td>
                            <td>3 Calls</td>
                            <td>1 Calls</td>
                            <td>0 Calls</td>
                            <td>27 Calls</td>
                            <td>35 Calls</td>
                            <td>00:57:40</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
}

export default CallingReportView;