import React, { useEffect, useState, CSSProperties, useRef } from "react";
import { AiOutlineBank } from "react-icons/ai";
import { HiOutlineCurrencyRupee } from "react-icons/hi2";
import { BsCreditCard2Front } from "react-icons/bs";
import { GoCreditCard } from "react-icons/go";
import { BsCardHeading } from "react-icons/bs";
import { MdOutlineEdit } from "react-icons/md";
import { FaRegSave } from "react-icons/fa";





function EmployeeViewPayrollView({ data, editField, setEditField }) {
    const formatSalary = (amount) => {
        return new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(amount);
    };

    const [accountNo, setAccountNo] = useState("");
    const [nameAsPerBank, setNameAsPerBank] = useState("");
    const [ifscCode, setIfscCode] = useState("");
    const [salary, setSalary] = useState("");
    const [salaryCondition, setSalaryCondition] = useState("");
    const [firstMonthSalary, setFirstMonthSalary] = useState("");
    const [panNumber, setPanNumber] = useState("");
    const [aadharNumber, setAadharNumber] = useState("");
    const [uanNumber, setUanNumber] = useState("");
    const [pfNumber, setPfNumber] = useState("");

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
                        <div className="col-8 pt-1 pb-1 bdr-left-eee">
                            {editField !== "accountNo" ? (
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="ep_info_t">
                                        {data.accountNo || "-"}
                                    </div>
                                    <div className="ep_info_icon">
                                        <MdOutlineEdit onClick={() => setEditField("accountNo")} />
                                    </div>
                                </div>
                            ) : (
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="ep_info_form">
                                        <input type="text" className="ep_info_input form-control"
                                            value={data.accountNo} onChange={(e) => setAccountNo(e.target.value)} />
                                    </div>
                                    <div className="ep_info_icon">
                                        <FaRegSave onClick={() => setEditField("")} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="row m-0 bdr-btm-eee">
                        <div className="col-4 pt-1 pb-1">
                            <div className="d-flex align-items-center">
                                <div className="ep_info_icon clr-ffb900">
                                    <AiOutlineBank />
                                </div>
                                <div className="ep_info_h">Name As Per Bank  :</div>
                            </div>
                        </div>
                        <div className="col-8 pt-1 pb-1 bdr-left-eee">
                            {editField !== "nameAsPerBankRecord" ? (
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="ep_info_t">
                                        {data.nameAsPerBankRecord || "-"}
                                    </div>
                                    <div className="ep_info_icon">
                                        <MdOutlineEdit onClick={() => setEditField("nameAsPerBankRecord")} />
                                    </div>
                                </div>
                            ) : (
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="ep_info_form">
                                        <input type="text" className="ep_info_input form-control"
                                            value={data.nameAsPerBankRecord} onChange={(e) => setNameAsPerBank(e.target.value)} />
                                    </div>
                                    <div className="ep_info_icon">
                                        <FaRegSave onClick={() => setEditField("")} />
                                    </div>
                                </div>
                            )}
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
                        <div className="col-8 pt-1 pb-1 bdr-left-eee">
                            {editField !== "ifscCode" ? (
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="ep_info_t">
                                        {data.ifscCode || "-"}
                                    </div>
                                    <div className="ep_info_icon">
                                        <MdOutlineEdit onClick={() => setEditField("ifscCode")} />
                                    </div>
                                </div>
                            ) : (
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="ep_info_form">
                                        <input type="text" className="ep_info_input form-control"
                                            value={data.ifscCode} onChange={(e) => setIfscCode(e.target.value)} />
                                    </div>
                                    <div className="ep_info_icon">
                                        <FaRegSave onClick={() => setEditField("")} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            <div className="my-card mt-2" >
                <div className="my-card-body">

                    <div className="row m-0 bdr-btm-eee">
                        <div className="col-5 pt-1 pb-1">
                            <div className="d-flex align-items-center">
                                <div className="ep_info_icon clr-ffb900">
                                    <HiOutlineCurrencyRupee />
                                </div>
                                <div className="ep_info_h">Basic Salary</div>
                            </div>
                        </div>
                        <div className="col-7 pt-1 pb-1 bdr-left-eee">
                            {editField !== "basicSalary" ? (
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="ep_info_t">
                                        {data.salary ? `₹ ${formatSalary(data.salary)}` : "-"}
                                    </div>
                                    <div className="ep_info_icon">
                                        <MdOutlineEdit onClick={() => setEditField("basicSalary")} />
                                    </div>
                                </div>
                            ) : (
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="ep_info_form">
                                        <input type="text" className="ep_info_input form-control"
                                            value={data.salary} onChange={(e) => setSalary(e.target.value)} />
                                    </div>
                                    <div className="ep_info_icon">
                                        <FaRegSave onClick={() => setEditField("")} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="row m-0 bdr-btm-eee">
                        <div className="col-5 pt-1 pb-1">
                            <div className="d-flex align-items-center">
                                <div className="ep_info_icon clr-ffb900">
                                    <HiOutlineCurrencyRupee />
                                </div>
                                <div className="ep_info_h">1st Month Salary Condition :</div>
                            </div>
                        </div>
                        <div className="col-7 pt-1 pb-1 bdr-left-eee">
                            {editField !== "firstMonthSalaryCondition" ? (
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="ep_info_t">
                                        {data.firstMonthSalaryCondition ? `${data.firstMonthSalaryCondition}%` : "-"}
                                    </div>
                                    <div className="ep_info_icon">
                                        <MdOutlineEdit onClick={() => setEditField("firstMonthSalaryCondition")} />
                                    </div>
                                </div>
                            ) : (
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="ep_info_form">
                                        <select className="ep_info_select form-control"
                                            value={data.firstMonthSalaryCondition} onChange={(e) => setSalaryCondition(e.target.value)}>
                                            <option disabled selected>--Select First Month Salary Condition--</option>
                                            <option value="50">50%</option>
                                            <option value="75">75%</option>
                                            <option value="100">100%</option>
                                        </select>
                                    </div>
                                    <div className="ep_info_icon">
                                        <FaRegSave onClick={() => setEditField("")} />
                                    </div>
                                </div>
                            )}
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
                                {data.firstMonthSalary ? `₹ ${formatSalary(data.firstMonthSalary)}` : "-"}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div className="my-card mt-2" >
                <div className="my-card-body">

                    <div className="row m-0 bdr-btm-eee">
                        <div className="col-4 pt-1 pb-1">
                            <div className="d-flex align-items-center">
                                <div className="ep_info_icon clr-ffb900">
                                    <GoCreditCard />
                                </div>
                                <div className="ep_info_h">PAN Number :</div>
                            </div>
                        </div>
                        <div className="col-8 pt-1 pb-1 bdr-left-eee">
                            {editField !== "panNumber" ? (
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="ep_info_t">
                                        {data.panNumber || "-"}
                                    </div>
                                    <div className="ep_info_icon">
                                        <MdOutlineEdit onClick={() => setEditField("panNumber")} />
                                    </div>
                                </div>
                            ) : (
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="ep_info_form">
                                        <input type="text" className="ep_info_input form-control"
                                            value={data.panNumber} onChange={(e) => setPanNumber(e.target.value)} />
                                    </div>
                                    <div className="ep_info_icon">
                                        <FaRegSave onClick={() => setEditField("")} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="row m-0 bdr-btm-eee">
                        <div className="col-4 pt-1 pb-1">
                            <div className="d-flex align-items-center">
                                <div className="ep_info_icon clr-ffb900">
                                    <BsCreditCard2Front />
                                </div>
                                <div className="ep_info_h">Adhar Number :</div>
                            </div>
                        </div>
                        <div className="col-8 pt-1 pb-1 bdr-left-eee">
                            {editField !== "aadharNumber" ? (
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="ep_info_t">
                                        {data.aadharNumber || "-"}
                                    </div>
                                    <div className="ep_info_icon">
                                        <MdOutlineEdit onClick={() => setEditField("aadharNumber")} />
                                    </div>
                                </div>
                            ) : (
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="ep_info_form">
                                        <input type="text" className="ep_info_input form-control"
                                            value={data.aadharNumber} onChange={(e) => setAadharNumber(e.target.value)} />
                                    </div>
                                    <div className="ep_info_icon">
                                        <FaRegSave onClick={() => setEditField("")} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="row m-0 bdr-btm-eee">
                        <div className="col-4 pt-1 pb-1">
                            <div className="d-flex align-items-center">
                                <div className="ep_info_icon clr-ffb900">
                                    <BsCardHeading />
                                </div>
                                <div className="ep_info_h">UAN No :</div>
                            </div>
                        </div>
                        <div className="col-8 pt-1 pb-1 bdr-left-eee">
                            {editField !== "uanNumber" ? (
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="ep_info_t">
                                        {data.uanNumber || "-"}
                                    </div>
                                    <div className="ep_info_icon">
                                        <MdOutlineEdit onClick={() => setEditField("uanNumber")} />
                                    </div>
                                </div>
                            ) : (
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="ep_info_form">
                                        <input type="text" className="ep_info_input form-control"
                                            value={data.uanNumber} onChange={(e) => setUanNumber(e.target.value)} />
                                    </div>
                                    <div className="ep_info_icon">
                                        <FaRegSave onClick={() => setEditField("")} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="row m-0 bdr-btm-eee">
                        <div className="col-4 pt-1 pb-1">
                            <div className="d-flex align-items-center">
                                <div className="ep_info_icon clr-ffb900">
                                    <BsCardHeading />
                                </div>
                                <div className="ep_info_h">PF No :</div>
                            </div>
                        </div>
                        <div className="col-8 pt-1 pb-1 bdr-left-eee">
                            {editField !== "pfNumber" ? (
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="ep_info_t">
                                        {data.pfNumber || "-"}
                                    </div>
                                    <div className="ep_info_icon">
                                        <MdOutlineEdit onClick={() => setEditField("pfNumber")} />
                                    </div>
                                </div>
                            ) : (
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="ep_info_form">
                                        <input type="text" className="ep_info_input form-control"
                                            value={data.pfNumber} onChange={(e) => setPfNumber(e.target.value)} />
                                    </div>
                                    <div className="ep_info_icon">
                                        <FaRegSave onClick={() => setEditField("")} />
                                    </div>
                                </div>
                            )}
                            <div className="ep_info_t">
                                {data.pfNumber || "-"}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default EmployeeViewPayrollView;