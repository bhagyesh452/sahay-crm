import React from 'react'
import { GiMoneyStack } from "react-icons/gi";
import { GoArrowUp } from "react-icons/go";
import { GoArrowDown } from "react-icons/go";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { TbTargetArrow } from "react-icons/tb";
import { TbAlarmAverage } from "react-icons/tb";
import { BsActivity } from "react-icons/bs";
import { BsDatabaseCheck } from "react-icons/bs";
import { FiLayers } from "react-icons/fi";
import { BsPersonCircle } from "react-icons/bs";
import icici from "../static/icici.png";
import { IoTicketOutline } from "react-icons/io5";
import idfc from "../static/idfc.png";
import { BarChart } from '@mui/x-charts/BarChart';

const data1 = [ 3, 4] 
const data2 = [ 5, 7]
const data3 = [ 2, 3] 
const data4 = [ 8, 2]  


function AdminReportPanel() {
  return (
    <div className="S-admin-dashboard">
      <div className='page-wrapper'>
        <div className='container-xl mt-3'>
          <div className='row'>
            <div className='col-sm-6'>
              <div className='admin-dash-card'>
                <div className='admin-dash-card-head'>
                  <div className='d-flex align-items-center justify-content-between'>
                    <div className='adch-name'>
                        Collection Summary
                    </div>
                    <div className="dash-select-filter">
                      <select class="form-select form-select-sm my-filter-select">
                          <option value="This Month">This Month</option>
                          <option value="Last Month">Last Month</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className='admin-dash-card-body'>
                  <div className='row'>
                    <div className='col-4 mb-3'>
                      <div className='sadmin-inner-card'>
                        <div className='sadmin-innercard-head'>
                          <div className='d-flex align-items-center justify-content-between'>
                            <div> 
                              <p className='m-0'>Today's <br></br>Collection</p>
                            </div>
                            <div className='sa_inCard_icon clr-5acb14'>
                             <GiMoneyStack />
                            </div>
                          </div>
                        </div>
                        <div className='sadmin-innercard-body'>
                          <div className='d-flex align-items-end justify-content-between'>
                            <div>
                              ₹5,33,660/-
                            </div>
                            <div className='dsrd-Revenue-up-ration d-flex aling-items-center ml-1'>
                              <GoArrowUp />
                              <div>
                                20%
                              </div>
                            </div>
                          </div>
                            
                        </div>
                      </div>
                    </div>  
                    <div className='col-4 mb-3'>
                      <div className='sadmin-inner-card'>
                        <div className='sadmin-innercard-head'>
                          <div className='d-flex align-items-center justify-content-between'>
                            <div> 
                              <p className='m-0'>Current Month <br></br>Collection</p>
                            </div>
                            <div className='sa_inCard_icon clr-e65b5b'>
                             <MdOutlineCalendarMonth />
                            </div>
                          </div>
                        </div>
                        <div className='sadmin-innercard-body'>
                          <div className='d-flex align-items-end justify-content-between'>
                            <div>
                              ₹33,660/-
                            </div>
                            <div className='dsrd-Revenue-up-ration d-flex aling-items-center ml-1' style={{background:'rgb(255, 236, 236)',color:'rgb(198, 31, 31)'}}>
                              <GoArrowDown />
                              <div>
                                20%
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>  
                    <div className='col-4 mb-3'>
                      <div className='sadmin-inner-card'>
                        <div className='sadmin-innercard-head'>
                          <div className='d-flex align-items-center justify-content-between'>
                            <div> 
                              <p className='m-0'>Current Month<br></br>Target</p>
                            </div>
                            <div className='sa_inCard_icon clr-ff8800'>
                             <TbTargetArrow />
                            </div>
                          </div>
                        </div>
                        <div className='sadmin-innercard-body'>
                            ₹33,660/-
                        </div>
                      </div>
                    </div> 
                    <div className='col-4 mb-3'>
                      <div className='sadmin-inner-card'>
                        <div className='sadmin-innercard-head'>
                          <div className='d-flex align-items-center justify-content-between'>
                            <div> 
                              <p className='m-0'>Current Average <br></br>Collection</p>
                            </div>
                            <div className='sa_inCard_icon clr-4299e1'>
                             <TbAlarmAverage  />
                            </div>
                          </div>
                        </div>
                        <div className='sadmin-innercard-body'>
                            ₹33,660/-
                        </div>
                      </div>
                    </div>  
                    <div className='col-4 mb-3'>
                      <div className='sadmin-inner-card'>
                        <div className='sadmin-innercard-head'>
                          <div className='d-flex align-items-center justify-content-between'>
                            <div> 
                              <p className='m-0'>Required Average  <br></br>Collection</p>
                            </div>
                            <div className='sa_inCard_icon clr-ff81f0'>
                             <BsActivity />
                            </div>
                          </div>
                        </div>
                        <div className='sadmin-innercard-body'>
                            ₹33,660/-
                        </div>
                      </div>
                    </div>  
                    <div className='col-4 mb-3'>
                      <div className='sadmin-inner-card'>
                        <div className='sadmin-innercard-head'>
                          <div className='d-flex align-items-center justify-content-between'>
                            <div> 
                              <p className='m-0'>Projected <br></br>Collection</p>
                            </div>
                            <div className='sa_inCard_icon clr-ad77f8'>
                             <BsDatabaseCheck />
                            </div>
                          </div>
                        </div>
                        <div className='sadmin-innercard-body'>
                            ₹33,660/-
                        </div>
                      </div>
                    </div> 
                  </div>
                </div>
              </div>
              <div className='row mt-3 mb-3'>
                <div className='col-5'>
                  <div className='admin-dash-card'>
                    <div className='admin-dash-card-head'>
                      <div className='d-flex align-items-center justify-content-between'>
                        <div className='adch-name'>
                            Booking Summary
                        </div>
                      </div>
                    </div>
                    <div className='admin-dash-card-body pb-2'>
                      <div className='admin-total-bkng-card'>
                        <div className='d-flex align-items-center justify-content-between'>
                          <div className='d-flex align-items-center'>
                            <div className='admin-total-bkng-card-icon clr-009688'>
                              <FiLayers/>
                            </div>
                            <div className='admin-total-bkng-card-text'>
                              No. Of Bookings
                            </div>
                          </div>
                          <div className='admin-total-bkng-card-data clr-009688'>
                            202
                          </div>
                        </div>
                      </div>
                      <div className='admin-total-bkng-card'>
                        <div className='d-flex align-items-center justify-content-between'>
                          <div className='d-flex align-items-center'>
                            <div className='admin-total-bkng-card-icon clr-a7636b'>
                              <IoTicketOutline />
                            </div>
                            <div className='admin-total-bkng-card-text'>
                              Uniq Booking
                            </div>
                          </div>
                          <div className='admin-total-bkng-card-data clr-a7636b'>
                            88
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='admin-dash-card mt-2'>
                    <div className='admin-dash-card-head'>
                      <div className='d-flex align-items-center justify-content-between'>
                        <div className='adch-name'>
                            Remaining Payment Summary
                        </div>
                      </div>
                    </div>
                    <div className='admin-dash-card-body pb-2'>
                      <div className='admin-total-bkng-card'>
                        <div className='d-flex align-items-center justify-content-between'>
                          <div className='d-flex align-items-center'>
                            <div className='admin-total-bkng-card-icon clr-009688'>
                              <FiLayers/>
                            </div>
                            <div className='admin-total-bkng-card-text'>
                              Remaining Collection
                            </div>
                          </div>
                          <div className='admin-total-bkng-card-data clr-009688'>
                              ₹0/-
                          </div>
                        </div>
                      </div>
                      <div className='admin-total-bkng-card'>
                        <div className='d-flex align-items-center justify-content-between'>
                          <div className='d-flex align-items-center'>
                            <div className='admin-total-bkng-card-icon clr-a7636b'>
                              <IoTicketOutline />
                            </div>
                            <div className='admin-total-bkng-card-text'>
                              Advanced Collected
                            </div>
                          </div>
                          <div className='admin-total-bkng-card-data clr-a7636b'>
                              ₹35,000/-
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-7'>
                  <div className='admin-dash-card'>
                    <div className='admin-dash-card-head'>
                      <div className='d-flex align-items-center justify-content-between'>
                        <div className='adch-name'>
                            Payment Summary
                        </div>
                        <div className="dash-select-filter">
                          <select class="form-select form-select-sm my-filter-select">
                              <option value="This Month">This Month</option>
                              <option value="Last Month">Last Month</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className='admin-dash-card-body pb-2'>
                      <div className='d-flex align-items-center justify-content-between mb-2'>
                        <div className='admin-dashbanknameh'>
                          <p>Bank Name</p>
                        </div>
                        <div className='admin-dashbankrevenueh'>
                          <p>Revenue</p>
                        </div>
                      </div>
                      <div className='Sadmin_bank_dtl_card'>
                        <div className='d-flex align-items-center justify-content-between'>
                          <div className='d-flex align-items-center'>
                            <div className='bankicon'>
                              <img src={icici}></img>
                            </div>
                            <div className='bankname'>
                              ICICI Bank
                            </div>
                          </div>
                          <div className='bankmoney'>
                            ₹3,33,660/-
                          </div>
                        </div>
                      </div>
                      <div className='Sadmin_bank_dtl_card'>
                        <div className='d-flex align-items-center justify-content-between'>
                          <div className='d-flex align-items-center'>
                            <div className='bankicon'>
                              <img src={idfc}></img>
                            </div>
                            <div className='bankname'>
                              Start-up Sahay Solution
                            </div>
                          </div>
                          <div className='bankmoney'>
                            ₹43,660/-
                          </div>
                        </div>
                      </div>
                      <div className='Sadmin_bank_dtl_card'>
                        <div className='d-flex align-items-center justify-content-between'>
                          <div className='d-flex align-items-center'>
                            <div className='bankicon'>
                              <img src={idfc}></img>
                            </div>
                            <div className='bankname'>
                              Start-up Sahay Advisory
                            </div>
                          </div>
                          <div className='bankmoney'>
                            ₹23,660/-
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='admin-dash-card-footer'>
                      <div className='row'>
                        <div className='col-4 p-0'>
                          <div className='grand_ttl'>
                            <div className='grand_ttl_text'>
                              Total Non-GST
                            </div>
                            <div className='grand_ttl_no'>
                              ₹22,33,660/-
                            </div>
                          </div>
                        </div>
                        <div className='col-4 p-0'>
                          <div className='grand_ttl bdr-left-eee'>
                            <div className='grand_ttl_text'>
                              Total With GST
                            </div>
                            <div className='grand_ttl_no'>
                              ₹11,33,660/-
                            </div>
                          </div>
                        </div>
                        <div className='col-4 p-0'>
                          <div className='grand_ttl bdr-left-eee'>
                            <div className='grand_ttl_text'>
                              Grand Total
                            </div>
                            <div className='grand_ttl_no'>
                              ₹33,33,660/-
                            </div>
                          </div>
                        </div>
                      </div>
                     


                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-sm-6'>
              <div className='admin-dash-card'>
                <div className='admin-dash-card-head'>
                  <div className='d-flex align-items-center justify-content-between'>
                    <div className='adch-name'>
                        Collection Summary
                    </div>
                    <div className="dash-select-filter">
                      <select class="form-select form-select-sm my-filter-select">
                          <option value="This Month">This Month</option>
                          <option value="Last Month">Last Month</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className='admin-dash-card-body'>
                  <div className='row'>
                    <div className='col-4 mb-3'>
                      <div className='sadmin-inner-card'>
                        <div className='sadmin-innercard-head'>
                          <div className='d-flex align-items-center justify-content-between'>
                            <div> 
                              <p className='m-0'>Today's Collection</p>
                            </div>
                            <div className='sa_inCard_icon clr-5acb14'>
                             <GiMoneyStack />
                            </div>
                          </div>
                        </div>
                        <div className='sadmin-innercard-body'>
                          <div className='d-flex align-items-end justify-content-between'>
                            <div>
                              ₹5,33,660/-
                            </div>
                            <div className='dsrd-Revenue-up-ration d-flex aling-items-center ml-1'>
                              <GoArrowUp />
                              <div>
                                20%
                              </div>
                            </div>
                          </div>
                            
                        </div>
                      </div>
                      <div className='sadmin-inner-card mt-3'>
                        <div className='sadmin-innercard-head'>
                          <div className='d-flex align-items-center justify-content-between'>
                            <div> 
                              <p className='m-0'>Current Month <br></br>Collection</p>
                            </div>
                            <div className='sa_inCard_icon clr-e65b5b'>
                             <MdOutlineCalendarMonth />
                            </div>
                          </div>
                        </div>
                        <div className='sadmin-innercard-body'>
                          <div className='d-flex align-items-end justify-content-between'>
                            <div>
                              ₹33,660/-
                            </div>
                            <div className='dsrd-Revenue-up-ration d-flex aling-items-center ml-1' style={{background:'rgb(255, 236, 236)',color:'rgb(198, 31, 31)'}}>
                              <GoArrowDown />
                              <div>
                                20%
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>   
                    <div className='col-8 mb-3'>
                      <div className='sadmin-inner-card'>
                          <BarChart
                            xAxis={[{ scaleType: 'band', data: ['Last Month', 'Current Month']}]}
                           // series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]}
                            series={[
                              { data: data1, label: 'Current Month Collection', color: '#e65b5b', stroke: 2 },
                              { data: data2, label: 'Current Month Target', color: '#ff8800', stroke: 2 },
                              { data: data3, label: 'Current Average Collection', color: '#4299e1', stroke: 2 },
                              { data: data4, label: 'Required Average Collection', color: '#ff81f0', stroke: 2 },
                            ]}
                            width={450}
                            height={200}
                            legend={false}
                          />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminReportPanel