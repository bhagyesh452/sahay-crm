import React, { useState, useEffect, useSyncExternalStore } from "react";
import axios from 'axios';
import { BsFilter } from "react-icons/bs";
import { FaWhatsapp } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import DscLetterStatusDropdown from './../ExtraComponents/DscLetterStatusDropdown'
import DscStatusDropdown from './../ExtraComponents/DscStatusDropdown'
import DscPortalDropdown from './../ExtraComponents/DscPortalDropdown'
import DscValidityDropdown from './../ExtraComponents/DscValidityDropdown'
import DscTypeDropdown from './../ExtraComponents/DscTypeDropdown'
import DscPortalCharges from './../ExtraComponents/DscPortalCharges'
import DscChargesPaidVia from './../ExtraComponents/DscChargesPaidVia'
import DscExpanceReimbursement from './../ExtraComponents/DscExpanceReimbursement'

function AdminExecutiveProcessPanel() {
    return (
    <div>
        <div className="table table-responsive table-style-3 m-0">
            <table className="table table-vcenter table-nowrap adminEx_table">
                <thead>
                    <tr className="tr-sticky">
                        <th className="G_rm-sticky-left-1">Sr.No</th>
                        <th className="G_rm-sticky-left-2">
                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                <div>
                                    Booking Date
                                </div>
                                <div className='RM_filter_icon'>
                                    <BsFilter  />
                                </div>
                            </div>
                        </th>
                        <th className="G_rm-sticky-left-3">
                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                
                                <div>
                                    Company Name 
                                </div>
                                <div className='RM_filter_icon'>
                                    <BsFilter  />
                                </div>
                            </div>
                        </th>
                        <th>
                            <div className='d-flex align-items-center justify-content-center position-relative'>
                  
                                <div>
                                    Company Number 
                                </div>
                                <div className='RM_filter_icon'>
                                    <BsFilter  />
                                </div>
                            </div>
                        </th>
                        <th>
                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                
                                <div>
                                    Company Email 
                                </div>
                                <div className='RM_filter_icon'>
                                    <BsFilter  />
                                </div>
                            </div>
                        </th>
                        <th>
                            <div className='d-flex align-items-center justify-content-center position-relative'>
                    
                                <div>
                                CA Number
                                </div>
                                <div className='RM_filter_icon'>
                                    <BsFilter  />
                                </div>
                            </div>
                        </th>
                        <th>
                            <div className='d-flex align-items-center justify-content-center position-relative'>
                      
                                <div>
                                    Services Name 
                                </div>
                                <div className='RM_filter_icon'>
                                    <BsFilter  />
                                </div>
                            </div>
                        </th>
                        <th>
                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                <div>
                                    Letter Status
                                </div>
                                <div className='RM_filter_icon'>
                                    <BsFilter  />
                                </div>
                            </div>
                        </th>
                        <th>
                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                <div>DSC Status</div>
                                <div className='RM_filter_icon'>
                                    <BsFilter  />
                                </div>
                            </div>
                        </th>
                        <th>
                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                <div>DSC Portal</div>
                                <div className='RM_filter_icon'>
                                    <BsFilter  />
                                </div>
                            </div>
                        </th>
                        <th>
                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                <div>DSC Type</div>
                                <div className='RM_filter_icon'>
                                    <BsFilter  />
                                </div>
                            </div>
                        </th>
                        <th>
                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                <div>DSC Validity</div>
                                <div className='RM_filter_icon'>
                                    <BsFilter  />
                                </div>
                            </div>
                        </th>
                        <th>
                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                <div>Portal Charges</div>
                                <div className='RM_filter_icon'>
                                    <BsFilter  />
                                </div>
                            </div>
                        </th>
                        <th>
                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                <div>Charges Paid Via</div>
                                <div className='RM_filter_icon'>
                                    <BsFilter  />
                                </div>
                            </div>
                        </th>
                        <th>
                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                 <div>Reimbursement Status</div>
                                <div className='RM_filter_icon'>
                                    <BsFilter  />
                                </div>
                            </div>
                        </th>
                        <th>
                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                <div>BDE</div>
                                <div className='RM_filter_icon'>
                                    <BsFilter  />
                                </div>
                            </div>
                        </th>
                        <th>
                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                <div>BDM</div> 
                                <div className='RM_filter_icon'>
                                    <BsFilter  />
                                </div>
                            </div>
                        </th>
                        {/* <th>
                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                <div>Total Payment </div>
                                <div className='RM_filter_icon'>
                                    <BsFilter  />
                                </div>
                            </div>
                        </th>
                        <th>
                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                <div>
                                    Pending Payment
                                </div> 
                                <div className='RM_filter_icon'>
                                    <BsFilter  />
                                </div>
                            </div>
                        </th>
                        <th>
                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                <div> 
                                    Received Payment
                                </div> 
                                <div className='RM_filter_icon'>
                                    <BsFilter  />
                                </div>
                            </div>
                        </th> */}
                        <th className="rm-sticky-action">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="G_rm-sticky-left-1"><div className="rm_sr_no">1</div></td>
                        <td className='G_rm-sticky-left-2'>10 Jun 2024</td>
                        <td className="G_rm-sticky-left-3"><b>LLP PVT LTD</b></td>
                        <td>
                            <div className="d-flex align-items-center justify-content-center wApp">
                                <div>9924283530</div>
                                <a
                                    href=""
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ marginLeft: '10px', lineHeight: '14px', fontSize: '14px' }}>
                                    <FaWhatsapp />
                                </a>
                            </div>
                        </td>
                        <td>mail@gmail.com</td>
                        <td>
                            <div className="d-flex align-items-center justify-content-center wApp">
                                <div>9924283530</div>
                                <a
                                    href=""
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ marginLeft: '10px', lineHeight: '14px', fontSize: '14px' }}>
                                    <FaWhatsapp />
                                </a>
                            </div>
                        </td>
                        <td>
                            Startup certificate  
                        </td>
                        <td>
                            <DscLetterStatusDropdown/>
                        </td>
                        <td>
                            <DscStatusDropdown/>
                        </td>
                        <td>
                            <DscPortalDropdown/>
                        </td>
                        <td>
                            <DscTypeDropdown/>
                        </td>
                        <td>
                            <DscValidityDropdown/>
                        </td>
                        <td>
                            <DscPortalCharges/>
                        </td>
                        <td>
                            <DscChargesPaidVia/>
                        </td>
                        <td>
                            <DscExpanceReimbursement/>
                        </td>
                        <td>
                            Vishnu Shuthar
                        </td>
                        <td>
                            Vishnu Shuthar
                        </td>
                        <td className="rm-sticky-action">
                            <button className="action-btn action-btn-primary"><FaRegEye /></button>
                        </td>
                    </tr>
                </tbody>

            </table>
        </div>
    </div>
    );
}


export default AdminExecutiveProcessPanel