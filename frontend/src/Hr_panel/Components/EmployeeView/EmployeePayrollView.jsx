import React, { useEffect, useState, CSSProperties, useRef } from "react";
import { AiOutlineBank } from "react-icons/ai";
import { HiOutlineCurrencyRupee } from "react-icons/hi2";
import { BsCreditCard2Front } from "react-icons/bs";
import { GoCreditCard } from "react-icons/go";
import { BsCardHeading } from "react-icons/bs";






function EmployeeViewPayrollView()
{
    return (
        <div className="payrollViewMain mt-2">
            <div className="my-card mt-2" >
                <div className="my-card-body">
                    <div className="row m-0  bdr-btm-eee">
                        <div className="col-4 pt-1 pb-1">
                            <div className="d-flex align-items-center">
                                <div className="ep_info_icon clr-ffb900">
                                    <AiOutlineBank />
                                </div>
                                <div className="ep_info_h">Bank A/C No :</div>
                            </div>
                        </div>
                        <div className="col-6 pt-1 pb-1 bdr-left-eee">
                            <div className="ep_info_t">
                                123544789966
                            </div>
                        </div>
                    </div>  
                    <div className="row m-0  bdr-btm-eee">
                        <div className="col-4 pt-1 pb-1">
                            <div className="d-flex align-items-center">
                                <div className="ep_info_icon clr-ffb900">
                                    <AiOutlineBank />
                                </div>
                                <div className="ep_info_h">Name As Per Bank  :</div>
                            </div>
                        </div>
                        <div className="col-6 pt-1 pb-1 bdr-left-eee">
                            <div className="ep_info_t">
                                Nimeshkumar Parekh
                            </div>
                        </div>
                    </div>
                    <div className="row m-0">
                        <div className="col-4 pt-1 pb-1">
                            <div className="d-flex align-items-center">
                                <div className="ep_info_icon clr-ffb900">
                                    <AiOutlineBank />
                                </div>
                                <div className="ep_info_h">IFSC Code :</div>
                            </div>
                        </div>
                        <div className="col-6 pt-1 pb-1 bdr-left-eee">
                            <div className="ep_info_t">
                                9924283530
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="my-card mt-2" >
                <div className="my-card-body">
                    <div className="row m-0  bdr-btm-eee">
                        <div className="col-5 pt-1 pb-1">
                            <div className="d-flex align-items-center">
                                <div className="ep_info_icon clr-ffb900">
                                    <HiOutlineCurrencyRupee />
                                </div>
                                <div className="ep_info_h">Basic Salary</div>
                            </div>
                        </div>
                        <div className="col-7 pt-1 pb-1 bdr-left-eee">
                            <div className="ep_info_t">
                                ₹ 50,000
                            </div>
                        </div>
                    </div>  
                    <div className="row m-0  bdr-btm-eee">
                        <div className="col-5 pt-1 pb-1">
                            <div className="d-flex align-items-center">
                                <div className="ep_info_icon clr-ffb900">
                                    <HiOutlineCurrencyRupee />
                                </div>
                                <div className="ep_info_h">1st Month Salary Condition :</div>
                            </div>
                        </div>
                        <div className="col-7 pt-1 pb-1 bdr-left-eee">
                            <div className="ep_info_t">
                                50%
                            </div>
                        </div>
                    </div>
                    <div className="row m-0">
                        <div className="col-5 pt-1 pb-1">
                            <div className="d-flex align-items-center">
                                <div className="ep_info_icon clr-ffb900">
                                    <HiOutlineCurrencyRupee />
                                </div>
                                <div className="ep_info_h">1st Month's Salary</div>
                            </div>
                        </div>
                        <div className="col-7 pt-1 pb-1 bdr-left-eee">
                            <div className="ep_info_t">
                                ₹ 25,500
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="my-card mt-2" >
                <div className="my-card-body">
                    <div className="row m-0  bdr-btm-eee">
                        <div className="col-4 pt-1 pb-1">
                            <div className="d-flex align-items-center">
                                <div className="ep_info_icon clr-ffb900">
                                    <GoCreditCard />
                                </div>
                                <div className="ep_info_h">PAN Number :</div>
                            </div>
                        </div>
                        <div className="col-6 pt-1 pb-1 bdr-left-eee">
                            <div className="ep_info_t">
                                SLFKK5896S
                            </div>
                        </div>
                    </div>  
                    <div className="row m-0  bdr-btm-eee">
                        <div className="col-4 pt-1 pb-1">
                            <div className="d-flex align-items-center">
                                <div className="ep_info_icon clr-ffb900">
                                    <BsCreditCard2Front />
                                </div>
                                <div className="ep_info_h">Adhar Number :</div>
                            </div>
                        </div>
                        <div className="col-6 pt-1 pb-1 bdr-left-eee">
                            <div className="ep_info_t">
                                5869234575
                            </div>
                        </div>
                    </div>
                    <div className="row m-0">
                        <div className="col-4 pt-1 pb-1">
                            <div className="d-flex align-items-center">
                                <div className="ep_info_icon clr-ffb900">
                                    <BsCardHeading />
                                </div>
                                <div className="ep_info_h">UAN No :</div>
                            </div>
                        </div>
                        <div className="col-6 pt-1 pb-1 bdr-left-eee">
                            <div className="ep_info_t">
                                55588666225
                            </div>
                        </div>
                    </div>
                    <div className="row m-0">
                        <div className="col-4 pt-1 pb-1">
                            <div className="d-flex align-items-center">
                                <div className="ep_info_icon clr-ffb900">
                                    <BsCardHeading />
                                </div>
                                <div className="ep_info_h">PF No :</div>
                            </div>
                        </div>
                        <div className="col-6 pt-1 pb-1 bdr-left-eee">
                            <div className="ep_info_t">
                                55588666225
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmployeeViewPayrollView;