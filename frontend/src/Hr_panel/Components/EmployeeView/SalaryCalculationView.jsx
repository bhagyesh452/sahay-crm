import React from 'react';

function SalaryCalculationView() {
  return (
    <div className="salary-calculation-view mt-3">
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
                <button className='btn action-btn-alert'>Download Slip</button>
            </div>
        </div>
        <div style={{height:"calc(100vh - 307px)", overflow:"auto"}}>
            <div className='row m-0'>
                <div className='col-md-3'>
                    <div className='my-card'>
                        <div className='my-card-header p-2 bdr-btm-eee'>
                            <h5 className='m-0 clr-a0b1ad'>ACTUAL PAYABLE DAYS</h5>
                        </div>
                        <div className='my-card-body p-2'>
                            <h4 className='m-0 clr-5acb14'>21.0</h4>
                        </div>
                    </div>             
                </div>
                <div className='col-md-3'>
                    <div className='my-card'>
                        <div className='my-card-header p-2 bdr-btm-eee'>
                            <h5 className='m-0 clr-a0b1ad'>TOTAL WORKING DAYS</h5>
                        </div>
                        <div className='my-card-body p-2'>
                            <h4 className='m-0 clr-00d19d'>21.0</h4>
                        </div>
                    </div>
                </div>
                <div className='col-md-3'>
                    <div className='my-card'>
                        <div className='my-card-header p-2 bdr-btm-eee'>
                            <h5 className='m-0 clr-a0b1ad'>LOSS OF PAY DAYS</h5>
                        </div>
                        <div className='my-card-body p-2'>
                            <h4 className='m-0 clr-ff3636'>19</h4>
                        </div>
                    </div>
                </div>
                <div className='col-md-3'>
                    <div className='my-card'>  
                        <div className='my-card-header p-2 bdr-btm-eee'>
                            <h5 className='m-0 clr-a0b1ad'>DAYS PAYABLE</h5>
                        </div>
                        <div className='my-card-body p-2'>
                            <h4 className='m-0 clr-ad77f8'>2</h4>                                    
                        </div>
                    </div>
                </div>
            </div>
            <div className='row m-0'>
                <div className='col-6 mt-3 bdr-right-eee'>
                    <h4 className='slry-cal-view-hdr mb-1'>Earnings</h4>
                    <div className='slry-cal-view-dtl'>
                        <div className='d-flex align-items-center justify-content-between'>
                            <div className='slry-cal-view-dtl-h'>
                                <p className='m-0'>Basic</p>
                            </div>
                            <div className='slry-cal-view-dtl-b'>
                                <p className='m-0'>₹ 14,476.19</p>
                            </div>
                        </div>
                        <div className='d-flex align-items-center justify-content-between'>
                            <div className='slry-cal-view-dtl-h'>
                                <p className='m-0'>HRA</p>
                            </div>
                            <div className='slry-cal-view-dtl-b'>
                                <p className='m-0'>₹ 5,790.48</p>
                            </div>
                        </div>
                        <div className='d-flex align-items-center justify-content-between'>
                            <div className='slry-cal-view-dtl-h'>
                                <p className='m-0'>Medical Allowance</p>
                            </div>
                            <div className='slry-cal-view-dtl-b'>
                                <p className='m-0'>₹ 1,130.95</p>
                            </div>
                        </div>
                        <div className='d-flex align-items-center justify-content-between'>
                            <div className='slry-cal-view-dtl-h'>
                                <p className='m-0'>Conveyance Allowance</p>
                            </div>
                            <div className='slry-cal-view-dtl-b'>
                                <p className='m-0'>₹ 2,895.24</p>
                            </div>
                        </div>
                        <div className='d-flex align-items-center justify-content-between'>
                            <div className='slry-cal-view-dtl-h'>
                                <p className='m-0'>Flexi Allowance</p>
                            </div>
                            <div className='slry-cal-view-dtl-b'>
                                <p className='m-0'>₹ 4,297.62</p>
                            </div>
                        </div>
                        <div className='d-flex align-items-center justify-content-between'>
                            <div className='slry-cal-view-dtl-h'>
                                <p className='m-0'>Corporate Attire</p>
                            </div>
                            <div className='slry-cal-view-dtl-b'>
                                <p className='m-0'>₹ 4,297.62</p>
                            </div>
                        </div>
                        <div className='d-flex align-items-center justify-content-between'>
                            <div className='slry-cal-view-dtl-h'>
                                <p className='m-0'>CCA</p>
                            </div>
                            <div className='slry-cal-view-dtl-b'>
                                <p className='m-0'>₹ 5,790.48</p>
                            </div>
                        </div>
                        <div className='d-flex align-items-center justify-content-between'>
                            <div className='slry-cal-view-dtl-h'>
                                <p className='m-0'><b>Total Earnings (A)</b></p>
                            </div>
                            <div className='slry-cal-view-dtl-b'>
                                <p className='m-0'><b>₹ 36,190.48</b></p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-6 mt-3'>
                    <div className='bdr-btm-eee pb-2'>
                        <h4 className='slry-cal-view-hdr mb-1'>Deductions</h4>
                        <div className='slry-cal-view-dtl'>
                            <div className='d-flex align-items-center justify-content-between'>
                                <div className='slry-cal-view-dtl-h'>
                                    <p className='m-0'>Calling Leave / Late Coming</p>
                                </div>
                                <div className='slry-cal-view-dtl-b'>
                                    <p className='m-0'>₹ 1,737.00</p>
                                </div>
                            </div>
                            <div className='d-flex align-items-center justify-content-between'>
                                <div className='slry-cal-view-dtl-h'>
                                    <p className='m-0'>Unpaid Leave</p>
                                </div>
                                <div className='slry-cal-view-dtl-b'>
                                    <p className='m-0'>₹ 1,737.00</p>
                                </div>
                            </div>
                            <div className='d-flex align-items-center justify-content-between'>
                                <div className='slry-cal-view-dtl-h'>
                                    <p className='m-0'><b>Total Deduction</b></p>
                                </div>
                                <div className='slry-cal-view-dtl-b'>
                                    <p className='m-0'><b>₹ 3,474.00</b></p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='mt-2'>
                        <h4 className='slry-cal-view-hdr mb-1'>Contributions</h4>
                        <div className='slry-cal-view-dtl'>
                            <div className='d-flex align-items-center justify-content-between'>
                                <div className='slry-cal-view-dtl-h'>
                                    <p className='m-0'>PF Employee</p>
                                </div>
                                <div className='slry-cal-view-dtl-b'>
                                    <p className='m-0'>₹ 1,737.00</p>
                                </div>
                            </div>
                            <div className='d-flex align-items-center justify-content-between'>
                                <div className='slry-cal-view-dtl-h'>
                                    <p className='m-0'>PF - Employer</p>
                                </div>
                                <div className='slry-cal-view-dtl-b'>
                                    <p className='m-0'>₹ 1,737.00</p>
                                </div>
                            </div>
                            <div className='d-flex align-items-center justify-content-between'>
                                <div className='slry-cal-view-dtl-h'>
                                    <p className='m-0'><b>Total Contributions (B)</b></p>
                                </div>
                                <div className='slry-cal-view-dtl-b'>
                                    <p className='m-0'><b>₹ 3,474.00</b></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>  
            </div> 
            <div className='pl-1 pr-1 mt-2'>
                <div className='my-card p-3'>
                    <div className='row'>
                        <div className='col-5'>
                            <div className='slry-cal-view-dtl-h'>
                                <p className='m-0'><strong>Net Salary Payable ( A - B )</strong></p>
                            </div>
                        </div>
                        <div className='col-7'>
                            <div className='slry-cal-view-dtl-b'>
                                <p className='m-0'><b>₹ 32,716.00</b></p>
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-5'>
                            <div className='slry-cal-view-dtl-h'>
                                <p className='m-0'><strong>Net Salary in words </strong> </p>
                            </div>
                        </div>
                        <div className='col-7'>
                            <div className='slry-cal-view-dtl-b'>
                                <p className='m-0'><b>Thirty Two Thousand Seven Hundred and Sixteen only</b></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>  
        </div>     
    </div>
  );
}

export default SalaryCalculationView;