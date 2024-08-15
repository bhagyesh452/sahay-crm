import React, { useState, useEffect, useSyncExternalStore } from "react";
import axios from 'axios';
import { BsFilter } from "react-icons/bs";


function AdminExecutiveProcessPanel() {
    <div>
        <div className="table table-responsive table-style-3 m-0">
            <table className="table table-vcenter table-nowrap rm_table_inprocess">
                <thead>
                    <tr className="tr-sticky">
                        <th className="G_rm-sticky-left-1">Sr.No</th>
                        <th className="G_rm-sticky-left-2">
                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                Booking Date
                            </div>
                            <div className='RM_filter_icon'>
                                <BsFilter  />
                            </div>
                        </th>
                        <th className="G_rm-sticky-left-3">
                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                Company Name 
                            </div>
                            <div className='RM_filter_icon'>
                                <BsFilter  />
                            </div>
                        </th>
                        <th className="rm-sticky-left-2">
                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                Company Number 
                            </div>
                            <div className='RM_filter_icon'>
                                <BsFilter  />
                            </div>
                        </th>
                        <th className="rm-sticky-left-2">
                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                Company Email 
                            </div>
                            <div className='RM_filter_icon'>
                                <BsFilter  />
                            </div>
                        </th>
                        <th className="rm-sticky-left-2">
                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                CA Number
                            </div>
                            <div className='RM_filter_icon'>
                                <BsFilter  />
                            </div>
                        </th>
                        <th className="rm-sticky-left-2">
                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                Services Name 
                            </div>
                            <div className='RM_filter_icon'>
                                <BsFilter  />
                            </div>
                        </th>
                        <th className="rm-sticky-left-2">
                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                DSC Applicable 
                            </div>
                            <div className='RM_filter_icon'>
                                <BsFilter  />
                            </div>
                        </th>
                        <th className="rm-sticky-left-2">
                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                Letter Status
                            </div>
                            <div className='RM_filter_icon'>
                                <BsFilter  />
                            </div>
                        </th>
                        <th className="rm-sticky-left-2">
                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                DSC Status
                            </div>
                            <div className='RM_filter_icon'>
                                <BsFilter  />
                            </div>
                        </th>
                        <th className="rm-sticky-left-2">
                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                DSC Portal
                            </div>
                            <div className='RM_filter_icon'>
                                <BsFilter  />
                            </div>
                        </th>
                        <th className="rm-sticky-left-2">
                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                DSC Type
                            </div>
                            <div className='RM_filter_icon'>
                                <BsFilter  />
                            </div>
                        </th>
                        <th className="rm-sticky-left-2">
                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                DSC Validity
                            </div>
                            <div className='RM_filter_icon'>
                                <BsFilter  />
                            </div>
                        </th>
                        <th className="rm-sticky-left-2">
                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                Portal Charges
                            </div>
                            <div className='RM_filter_icon'>
                                <BsFilter  />
                            </div>
                        </th>
                        <th className="rm-sticky-left-2">
                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                Charges Paid Via
                            </div>
                            <div className='RM_filter_icon'>
                                <BsFilter  />
                            </div>
                        </th>
                        <th className="rm-sticky-left-2">
                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                Charges Paid Via
                            </div>
                            <div className='RM_filter_icon'>
                                <BsFilter  />
                            </div>
                        </th>
                        <th className="rm-sticky-left-2">
                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                Charges Paid Via
                            </div>
                            <div className='RM_filter_icon'>
                                <BsFilter  />
                            </div>
                        </th>
                        <th className="rm-sticky-left-2">
                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                Expanse Reimbursement Status
                            </div>
                            <div className='RM_filter_icon'>
                                <BsFilter  />
                            </div>
                        </th>
                        <th className="rm-sticky-left-2">
                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                BDE 
                            </div>
                            <div className='RM_filter_icon'>
                                <BsFilter  />
                            </div>
                        </th>
                        <th className="rm-sticky-left-2">
                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                BDM 
                            </div>
                            <div className='RM_filter_icon'>
                                <BsFilter  />
                            </div>
                        </th>
                        <th className="rm-sticky-left-2">
                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                Total Payment 
                            </div>
                            <div className='RM_filter_icon'>
                                <BsFilter  />
                            </div>
                        </th>
                        <th className="rm-sticky-left-2">
                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                Pending Payment 
                            </div>
                            <div className='RM_filter_icon'>
                                <BsFilter  />
                            </div>
                        </th>
                        <th className="rm-sticky-left-2">
                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                Received Payment 
                            </div>
                            <div className='RM_filter_icon'>
                                <BsFilter  />
                            </div>
                        </th>
                        <th className="rm-sticky-action">
                            Action
                        </th>
                    </tr>
                </thead>
            </table>
        </div>
    </div>
}


export default AdminExecutiveProcessPanel