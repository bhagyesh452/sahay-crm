import React, { useEffect, useState, CSSProperties, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { AiOutlineBank } from "react-icons/ai";
import { HiOutlineCurrencyRupee } from "react-icons/hi2";
import { BsCreditCard2Front } from "react-icons/bs";
import { GoCreditCard } from "react-icons/go";
import { BsCardHeading } from "react-icons/bs";
import { MdOutlineEdit } from "react-icons/md";
import { FaRegSave } from "react-icons/fa";





function EmployeeViewPayrollView({ editField, setEditField }) {

    const { userId } = useParams();
    const secretKey = process.env.REACT_APP_SECRET_KEY;

    const [data, setData] = useState([]);
    const [accountNo, setAccountNo] = useState("");
    const [nameAsPerBankRecord, setNameAsPerBankRecord] = useState("");
    const [ifscCode, setIfscCode] = useState("");
    const [salary, setSalary] = useState("");
    const [firstMonthSalaryCondition, setFirstMonthSalaryCondition] = useState("");
    const [firstMonthSalary, setFirstMonthSalary] = useState("");
    const [panNumber, setPanNumber] = useState("");
    const [aadharNumber, setAadharNumber] = useState("");
    const [uanNumber, setUanNumber] = useState("");
    const [pfNumber, setPfNumber] = useState("");

    const fetchEmployeeData = async () => {
        try {
          const response = await axios.get(`${secretKey}/employee/einfo`);
          console.log(response.data, userId);
          const tempData = response.data;
          const data = tempData.find((item) => item._id === userId);
          console.log("Payroll Info is :", data);
    
          setData(data);
          setAccountNo(data.accountNo);
          setNameAsPerBankRecord(data.nameAsPerBankRecord);
          setIfscCode(data.ifscCode);
          setSalary(data.salary);
          setFirstMonthSalaryCondition(data.firstMonthSalaryCondition);
          setFirstMonthSalary(data.firstMonthSalary);
          setPanNumber(data.panNumber);
          setAadharNumber(data.aadharNumber);
          setUanNumber(data.uanNumber);
          setPfNumber(data.pfNumber);
    
        } catch (error) {
          console.error("Error fetching employee data", error);
        }
      };

    const formatSalary = (amount) => {
        return new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(amount);
    };

    const handleSalaryChange = (newSalary) => {
        setSalary(newSalary);

        if (firstMonthSalaryCondition) {
            const calculatedFirstMonthSalary = (newSalary * firstMonthSalaryCondition) / 100;
            setFirstMonthSalary(calculatedFirstMonthSalary);
        }
    };

    const handleSalaryConditionChange = (condition) => {
        setFirstMonthSalaryCondition(condition);

        if (salary) {
            const calculatedFirstMonthSalary = (salary * condition) / 100;
            setFirstMonthSalary(calculatedFirstMonthSalary);
        }
    };

    const handleSave = async () => {
        const payload = {
            accountNo: accountNo,
            nameAsPerBankRecord: nameAsPerBankRecord,
            ifscCode: ifscCode,
            salary: salary,
            firstMonthSalaryCondition: firstMonthSalaryCondition,
            firstMonthSalary: firstMonthSalary,
            panNumber: panNumber,
            aadharNumber: aadharNumber,
            uanNumber: uanNumber,
            pfNumber: pfNumber
        };
        try {
            const res = await axios.put(`${secretKey}/employee/updateEmployeeFromId/${userId}`, payload);
            console.log("Updated details is :", res.data.data);
            fetchEmployeeData();
            Swal.fire("Success", "Employee details updated successfully", "success");
        } catch (error) {
            console.log("Error updating employee details :", error);
            Swal.fire("Error", "Error updating employee details", "error");
        }
    };

    useEffect(() => {
        fetchEmployeeData();
    }, []);
    
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
                                        <MdOutlineEdit onClick={() => {
                                            if (editField !== "") {
                                                Swal.fire("Error", "Please save your previos field before editing this field", "error");
                                                return;
                                            }
                                            setAccountNo(data.accountNo);
                                            setEditField("accountNo");
                                        }} />
                                    </div>
                                </div>
                            ) : (
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="ep_info_form">
                                        <input type="text" className="ep_info_input form-control"
                                            value={accountNo} onChange={(e) => setAccountNo(e.target.value)} />
                                    </div>
                                    <div className="ep_info_icon">
                                        <FaRegSave onClick={() => {
                                            setEditField("");
                                            handleSave();
                                        }} />
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
                                        <MdOutlineEdit onClick={() => {
                                            if (editField !== "") {
                                                Swal.fire("Error", "Please save your changes before editing this field", "error");
                                                return;
                                            }
                                            setNameAsPerBankRecord(data.nameAsPerBankRecord);
                                            setEditField("nameAsPerBankRecord");
                                        }} />
                                    </div>
                                </div>
                            ) : (
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="ep_info_form">
                                        <input type="text" className="ep_info_input form-control"
                                            value={nameAsPerBankRecord} onChange={(e) => setNameAsPerBankRecord(e.target.value)} />
                                    </div>
                                    <div className="ep_info_icon">
                                        <FaRegSave onClick={() => {
                                            setEditField("");
                                            handleSave();
                                        }} />
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
                                        <MdOutlineEdit onClick={() => {
                                            if (editField !== "") {
                                                Swal.fire("Error", "Please save your changes before editing this field", "error");
                                                return;
                                            }
                                            setIfscCode(data.ifscCode);
                                            setEditField("ifscCode");
                                        }} />
                                    </div>
                                </div>
                            ) : (
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="ep_info_form">
                                        <input type="text" className="ep_info_input form-control"
                                            value={ifscCode} onChange={(e) => setIfscCode(e.target.value)} />
                                    </div>
                                    <div className="ep_info_icon">
                                        <FaRegSave onClick={() => {
                                            setEditField("");
                                            handleSave();
                                        }} />
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
                                        <MdOutlineEdit onClick={() => {
                                            if (editField !== "") {
                                                Swal.fire("Error", "Please save your changes before editing this field", "error");
                                                return;
                                            }
                                            setSalary(data.salary);
                                            setEditField("basicSalary");
                                        }} />
                                    </div>
                                </div>
                            ) : (
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="ep_info_form">
                                        <input type="text" className="ep_info_input form-control"
                                            value={salary} onChange={(e) => handleSalaryChange(e.target.value)} />
                                    </div>
                                    <div className="ep_info_icon">
                                        <FaRegSave onClick={() => {
                                            setEditField("");
                                            handleSave();
                                        }} />
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
                                        <MdOutlineEdit onClick={() => {
                                            if (editField !== "") {
                                                Swal.fire("Error", "Please save your changes before editing this field", "error");
                                                return;
                                            }
                                            setFirstMonthSalaryCondition(data.firstMonthSalaryCondition);
                                            setEditField("firstMonthSalaryCondition");
                                        }} />
                                    </div>
                                </div>
                            ) : (
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="ep_info_form">
                                        <select className="ep_info_select form-control"
                                            value={firstMonthSalaryCondition} onChange={(e) => handleSalaryConditionChange(e.target.value)}>
                                            <option value="" selected>--Select First Month Salary Condition--</option>
                                            <option value="50">50%</option>
                                            <option value="75">75%</option>
                                            <option value="100">100%</option>
                                        </select>
                                    </div>
                                    <div className="ep_info_icon">
                                        <FaRegSave onClick={() => {
                                            setEditField("");
                                            handleSave();
                                        }} />
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
                                        <MdOutlineEdit onClick={() => {
                                            if (editField !== "") {
                                                Swal.fire("Error", "Please save your changes before editing this field", "error");
                                                return;
                                            }
                                            setPanNumber(data.panNumber);
                                            setEditField("panNumber");
                                        }} />
                                    </div>
                                </div>
                            ) : (
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="ep_info_form">
                                        <input type="text" className="ep_info_input form-control"
                                            value={panNumber} onChange={(e) => setPanNumber(e.target.value)} />
                                    </div>
                                    <div className="ep_info_icon">
                                        <FaRegSave onClick={() => {
                                            setEditField("");
                                            handleSave();
                                        }} />
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
                                        <MdOutlineEdit onClick={() => {
                                            if (editField !== "") {
                                                Swal.fire("Error", "Please save your changes before editing this field", "error");
                                                return;
                                            }
                                            setAadharNumber(data.aadharNumber);
                                            setEditField("aadharNumber");
                                        }} />
                                    </div>
                                </div>
                            ) : (
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="ep_info_form">
                                        <input type="text" className="ep_info_input form-control"
                                            value={aadharNumber} onChange={(e) => setAadharNumber(e.target.value)} />
                                    </div>
                                    <div className="ep_info_icon">
                                        <FaRegSave onClick={() => {
                                            setEditField("");
                                            handleSave();
                                        }} />
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
                                        <MdOutlineEdit onClick={() => {
                                            if (editField !== "") {
                                                Swal.fire("Error", "Please save your changes before editing this field", "error");
                                                return;
                                            }
                                            setUanNumber(data.uanNumber);
                                            setEditField("uanNumber");
                                        }} />
                                    </div>
                                </div>
                            ) : (
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="ep_info_form">
                                        <input type="text" className="ep_info_input form-control"
                                            value={uanNumber} onChange={(e) => setUanNumber(e.target.value)} />
                                    </div>
                                    <div className="ep_info_icon">
                                        <FaRegSave onClick={() => {
                                            setEditField("");
                                            handleSave();
                                        }} />
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
                                        <MdOutlineEdit onClick={() => {
                                            if (editField !== "") {
                                                Swal.fire("Error", "Please save your changes before editing this field", "error");
                                                return;
                                            }
                                            setPfNumber(data.pfNumber);
                                            setEditField("pfNumber");
                                        }} />
                                    </div>
                                </div>
                            ) : (
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="ep_info_form">
                                        <input type="text" className="ep_info_input form-control"
                                            value={pfNumber} onChange={(e) => setPfNumber(e.target.value)} />
                                    </div>
                                    <div className="ep_info_icon">
                                        <FaRegSave onClick={() => {
                                            setEditField("");
                                            handleSave();
                                        }} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default EmployeeViewPayrollView;