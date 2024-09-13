import React from 'react';

function SalaryCalculationView() {
  return (
    <div className="salary-calculation-view">
        <div className='row mt-3'>
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
        <div className='row mt-3'>
            <h4 className='m-0 slry-cal-view-hdr'>EARNINGS</h4>
        </div>        
    </div>
  );
}

export default SalaryCalculationView;